<?php
/* 
 * layoutEngine.class.php
 * 
 * @DESCRIPTION: This class object will create dynamic ExtJS v4 form, previuosly created or edited 
 * from the Layout Form Editor. Gathering all it's data and parameters from the layout_options table. 
 * Most of the structural database table was originally created by OpenEMR developers.
 * 
 * What this class will not do: This class will not create the entire Screen Panel for you, this
 * will only create the form object with the fields names & dataStores configured on the layout_options table.
 * 
 * version: 0.0.1 
 * author: Gino Rivera Falu
 * 
 */
include_once($_SESSION['site']['root']."/classes/dbHelper.class.php");
class layoutEngine extends dbHelper {

	private $switcher;
	
	//**********************************************************************
	// switchTF
	//
	// This function will write the Sencha ExtJS v4 code, in two modes
	// T = Text: Will display the form only in HTML, no fields
	// F = Fields: Will create the form with fields
	//**********************************************************************
	function switchTF($v = "F"){ $this->switcher = $v; } 
	
	//**********************************************************************
	// textAdd
	//
	// This creates the fields into the fieldset & form.
	// 
	// Parameters:
	// $fieldName: The field name
	// $fieldLabel: The field label
	// $initValue: The initial value of the field
	// $fieldLengh: The max length of the field
	//**********************************************************************
	private function textAdd($fieldName, $fieldLabel, $initValue, $fieldLengh="255"){
		echo "{
						xtype		: 'textfield', 
						fieldLabel	: '".addslashes( trim($fieldLabel) )."',
						name		: '".$fieldName."', 
						maxLength	: ".$fieldLengh.", 
						size		: ".$fieldLengh.", 
						submitValue	: true, 
						value		: '".$initValue."' 
					}";
	}
	
	//**********************************************************************
	// textareaAdd
	//
	// This creates the fields into the fieldset & form.
	// 
	// Parameters:
	// $fieldName: The field name
	// $fieldLabel: The field label
	// $initValue: The initial value of the field
	// $fieldLengh: The max length of the field
	//**********************************************************************
	private function textareaAdd($fieldName, $fieldLabel, $initValue, $fieldLengh="255"){
		echo "{
						xtype		: 'textarea', 
						fieldLabel	: '".addslashes( trim($fieldLabel) )."', 
						name		: '".$fieldName."', 
						grow		: true,
						size		: ".$fieldLengh.", 
					}";
	}
	
	//**********************************************************************
	// dateAdd
	//
	// This creates the fields into the fieldset & form.
	// 
	// Parameters:
	// $fieldName: The field name
	// $fieldLabel: The field label
	//**********************************************************************
	private function dateAdd($fieldName, $fieldLabel){
		echo "{
						xtype		: 'datefield', 
						fieldLabel	: '".addslashes( trim($fieldLabel) )."', 
						name		: '".$fieldName."', 
						vale		: new Date()
					}";
	}
	
	//**********************************************************************
	// comboAdd
	//
	// This creates the combo into the fieldset & form.
	// 
	// Parameters:
	// $fieldName: The field name
	// $fieldLabel: The field label
	//**********************************************************************
	private function comboAdd($fieldName, $list_id, $fieldLabel){
		echo "{
						xtype			: 'combo', 
						submitValue		: true, 
						name			: '".$fieldName."',
						fieldLabel		: '".addslashes( trim($fieldLabel) )."',
						editable		: false,
						triggerAction	: 'all',
						mode			: 'local',
						valueField		: 'title',
						displayField	: 'title',
						store			: panel.store".ucfirst($list_id)."
					}";
	}
	
	//**********************************************************************
	// comboAdd_Editable
	//
	// This creates the combo into the fieldset & form.
	// 
	// Parameters:
	// $fieldName: The field name
	// $fieldLabel: The field label
	//**********************************************************************
	private function comboAdd_Editable($fieldName, $list_id, $fieldLabel){
		echo "{
						xtype			: 'combo', 
						submitValue		: true, 
						name			: '".$fieldName."',
						fieldLabel		: '".addslashes( trim($fieldLabel) )."',
						editable		: true,
						triggerAction	: 'all',
						mode			: 'local',
						valueField		: 'title',
						displayField	: 'title',
						store			: panel.store".ucfirst($list_id)."
					}";
	}
	
	private function factorFormStore($dataStore, $path, $fieldArray, $index){
		echo "
			// *************************************************************************************
			// Data Store Object for ".$dataStore."
			// *************************************************************************************
			panel.".$dataStore." = Ext.create('Ext.mitos.CRUDStore',{
				fields: [";
		$buff="
			{name: '".$index."', type: 'int'}," . chr(13);
		foreach($fieldArray as $key => $row){
			$buff .= "{name: '".$row['field_id']."', type: 'string'}," . chr(13);
		}
		echo substr($buff, 0, -2);
		echo"
				],
					model 		: '".$dataStore."Model',
					idProperty 	: 'item_id',
					read		: '".$path."/data_read.ejs.php',
					create		: '".$path."/data_create.ejs.php',
					update		: '".$path."/data_update.ejs.php',
					destroy 	: '".$path."/data_destroy.ejs.php'
			});
		";
	}
	
	//**********************************************************************
	// factorDataStore
	// 
	// This will create the code for the dataStores requiered by
	// the comboboxes, or any other object that requieres dataStore.
	//
	// Parameters:
	// $list
	//
	// Return:
	// Return the name of the dataStore, i.e.
	// if $list parameter was patients, the name of the dataStore will be
	// storePatients, and the record model will be patientsModel.
	//**********************************************************************
	private function factorDataStore($list){
		echo "
			panel.store" . ucfirst($list) . " = Ext.create('Ext.mitos.CRUDStore',{
				fields: [
					{name: 'option_id',		type: 'string'},
					{name: 'title',			type: 'string'}
				],
				model 		:'".$list."Model',
				idProperty 	:'option_id',
				read		: 'lib/layoutEngine/listOptions.json.php',
				extraParams	: {\"filter\": \"".$list."\"}
			});
			" . chr(13);
			return "store".ucfirst($list);
	}
				
	//**********************************************************************
	// renderForm 
	//
	// This will render the selected form, and returns the Sencha ExtJS v4 
	// code.
	//**********************************************************************
	function renderForm($formPanel, $path, $title, $labelWidth, $saveText){
		
		// First we need to render all the dataStores
		// and gather all the dataStore names
		// This SQL Statement has the uor in action UOR means
		// U.Unused O.Optional R.Requiered
		//---
		$this->setSQL("SELECT 
					layout_options.*, list_options.title AS listDesc
				FROM
  					layout_options
				LEFT OUTER JOIN 
					list_options
				ON 
					layout_options.list_id = list_options.option_id
				WHERE
  					layout_options.form_id = '".$formPanel."'
				HAVING
					uor = '1' OR uor = '2'
				ORDER BY
  					layout_options.group_order, layout_options.seq");
		$dataStoresNames = array();
		$dataStoresNames = $this->execStatement();
		
		// 1.Render the form dataStore
		//---
		$this->factorFormStore("store".ucfirst($formPanel), $path, $dataStoresNames, "item_id");
		
		// 2.Render the dataStores for the combo boxes first
		//---
		foreach($dataStoresNames as $key => $row){if($row['list_id'] != ""){ $this->factorDataStore($row['list_id']);	} }
		
		// 3.Begin with the form
		//---
		echo "
			panel." . $formPanel . " = Ext.create('Ext.form.Panel', {
				title		: '" . $title . "',
				frame		: true,
				bodyStyle	: 'padding: 5px',
				width		: '100%',
				layout		: 'anchor',
				defaults	: { bodyPadding: 4, labelWidth: ".$labelWidth.", anchor: '100%'},
				items		: [
			";
		
		// 4.Loop through the form groups & fields
		//---
		$group_name = array();
		foreach($dataStoresNames as $key => $row){
			$ahead = $key + 1;
			
			/*
			 * Check if the group_name already has been deployed
			 * if not create the fieldset.
			 */
			if(!array_key_exists($row['group_name'], $group_name)){
				echo "{
					xtype:'fieldset',
        				collapsible: true,
        				collapsed: true,
        				title: '".$row['group_name']."',
        				defaults: {anchor: '20%'},
        				layout: 'anchor',
	        			items :[
	        		";	
			} 
			
			/*
			 * Create the fields inside of the fieldset
			 * depending on the data_type field create
			 * the field
			 */
			switch ($row['data_type']){
				// list box
				case 1:
					$this->comboAdd($row['field_id'], $row['list_id'], $row['title']);
					if($dataStoresNames[$ahead]['group_name'] == $row['group_name']){ echo ","; }
				break;
				// Text box
				case 2:
					if ($row['fld_length'] != ""){$s=255;}
					$this->textAdd($row['field_id'], $row['title'], "", $s);
					if($dataStoresNames[$ahead]['group_name'] == $row['group_name']){ echo ","; }
				break;
				// Text area
				case 3:
					if ($row['fld_length'] != ""){$s=255;}
					$this->textareaAdd($row['field_id'], $row['title'], "", $s);
					if($dataStoresNames[$ahead]['group_name'] == $row['group_name']){ echo ","; }
				break;
				// Text-date
				case 4:
					$this->dateAdd($row['field_id'], $row['title']);
					if($dataStoresNames[$ahead]['group_name'] == $row['group_name']){ echo ","; }
				break;
				// List box w/ Add (Editable)
				case 26:
					$this->comboAdd_Editable($row['field_id'], $row['list_id'], $row['title']);
					if($dataStoresNames[$ahead]['group_name'] == $row['group_name']){ echo ","; }
				break;
			}
			
			/*
			 * Close the fieldset, if it is the end.
			 */
			if($dataStoresNames[$ahead]['group_name'] != $row['group_name']){ echo "]},"; }
			
			/*
			 * Update the group_name variable to see if in the
			 * next round trip we make a fieldset.
			 */
			$group_name[$row['group_name']] = $row['group_name'];
		} 
				
		// End with the form
		//---
		
		// 5.Write the save toolbar 
		echo "
				],
                    dockedItems: [{
                        xtype: 'toolbar',
                        dock: 'top',
                        items: [{
                            text      : '". $saveText . "',
                            iconCls   : 'save',
                            handler   : function(){
                                var record = panel." . $formPanel . ".getAt('0');
                                var fieldValues = panel." . $formPanel . ".getForm().getValues();
                                for (var k=0; k <= record.fields.getCount()-1; k++) {
                                    var i = record.fields.get(k).name;
                                    record.set( i, fieldValues[i] );
                                }
                                panel.store".ucfirst($formPanel).".sync();	// Save the record to the dataStore
                                panel.store".ucfirst($formPanel).".load();	// Reload the dataSore from the database

                                Ext.topAlert.msg('New patient as been saved!','');
                            }
                        }]
                    }]
				}); // End of ".$formPanel . chr(13);
	}
	
}

?>