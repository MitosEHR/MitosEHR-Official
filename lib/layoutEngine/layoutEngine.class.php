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
 * author: GI Technologies, 2011
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
		$buff  = "{ xtype: 'textfield',";
		$buff .= "fieldLabel: '".addslashes( trim($fieldLabel) )."',";
		$buff .= "name: '".$fieldName."',";
		$buff .= "maxLength: ".$fieldLengh.",";
		$buff .= "size: ".$fieldLengh.",";
		$buff .= "submitValue: true,";
		$buff .= "value: '".$initValue."'}";
		return $buff;
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
		$buff  = "{xtype: 'textarea',"; 
		$buff .= "fieldLabel: '".addslashes( trim($fieldLabel) )."',"; 
		$buff .= "name: '".$fieldName."',"; 
		$buff .= "grow: false,";
		$buff .= "size: ".$fieldLengh.",}";
		return $buff;
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
		$buff  = "{xtype: 'datefield',"; 
		$buff .= "fieldLabel: '".addslashes( trim($fieldLabel) )."',"; 
		$buff .= "name: '".$fieldName."',"; 
		$buff .= "value: new Date()}";
		return $buff;
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
		$buff  = "{xtype			: 'combo',"; 
		$buff .= "submitValue: true,"; 
		$buff .= "name: '".$fieldName."',";
		$buff .= "fieldLabel: '".addslashes( trim($fieldLabel) )."',";
		$buff .= "editable: false,";
		$buff .= "triggerAction: 'all',";
		$buff .= "mode: 'local',";
		$buff .= "valueField: 'title',";
		$buff .= "displayField: 'title',";
		$buff .= "store: panel.store".ucfirst($list_id)."}";
		return $buff;
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
		$buff  = "{xtype: 'combo',"; 
		$buff .= "submitValue: true,"; 
		$buff .= "name: '".$fieldName."',";
		$buff .= "fieldLabel: '".addslashes( trim($fieldLabel) )."',";
		$buff .= "editable: true,";
		$buff .= "triggerAction: 'all',";
		$buff .= "mode: 'local',";
		$buff .= "valueField: 'title',";
		$buff .= "displayField: 'title',";
		$buff .= "store: panel.store".ucfirst($list_id)."}";
		return $buff;
	}
	
	//**********************************************************************
	// factorFormStore
	//
	// This creates the dataStore for the form.
	//**********************************************************************
	private function factorFormStore($dataStore, $path, $fieldArray, $index){
		$buff  = "panel.".$dataStore." = Ext.create('Ext.mitos.CRUDStore',{fields: [";
		$buff .="{name: '".$index."', type: 'int'},";
		foreach($fieldArray as $key => $row){
			$buff .= "{name: '".$row['field_id']."', type: 'string'},";
		}
		$buff = substr($buff, 0, -1);
		$buff .= "],model: '".$dataStore."Model',";
		$buff .= "idProperty: 'item_id',";
		$buff .= "read: '".$path."/data_read.ejs.php',";
		$buff .= "create: '".$path."/data_create.ejs.php',";
		$buff .= "update: '".$path."/data_update.ejs.php',";
		$buff .= "destroy: '".$path."/data_destroy.ejs.php'});";
		return $buff;
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
	//**********************************************************************
	private function factorDataStore($list){
		$buff  = "panel.store" . ucfirst($list) . " = Ext.create('Ext.mitos.CRUDStore',{";
		$buff .= "fields: [{name: 'option_id', type: 'string'},";
		$buff .= "{name: 'title', type: 'string'}";
		$buff .= "],";
		$buff .= "model:'".$list."Model',";
		$buff .= "idProperty:'option_id',";
		$buff .= "read: 'lib/layoutEngine/listOptions.json.php',";
		$buff .= 'extraParams: {"filter": "'.$list.'"} });';
		return $buff;
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
		echo $this->factorFormStore("store".ucfirst($formPanel), $path, $dataStoresNames, "item_id");
		
		// 2.Render the dataStores for the combo boxes first
		//---
		foreach($dataStoresNames as $key => $row){if($row['list_id'] != ""){ echo $this->factorDataStore($row['list_id']); } }
		
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
					echo $this->comboAdd($row['field_id'], $row['list_id'], $row['title']);
					if($dataStoresNames[$ahead]['group_name'] == $row['group_name']){ echo ","; }
				break;
				// Text box
				case 2:
					if ($row['fld_length'] != "")$s=255;
					echo $this->textAdd($row['field_id'], $row['title'], "", $s);
					if($dataStoresNames[$ahead]['group_name'] == $row['group_name']){ echo ","; }
				break;
				// Text area
				case 3:
					if ($row['fld_length'] != "") $s=255;
					echo $this->textareaAdd($row['field_id'], $row['title'], "", $s);
					if($dataStoresNames[$ahead]['group_name'] == $row['group_name']){ echo ","; }
				break;
				// Text-date
				case 4:
					echo $this->dateAdd($row['field_id'], $row['title']);
					if($dataStoresNames[$ahead]['group_name'] == $row['group_name']){ echo ","; }
				break;
				// List box w/ Add (Editable)
				case 26:
					echo $this->comboAdd_Editable($row['field_id'], $row['list_id'], $row['title']);
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