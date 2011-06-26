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

	private $cu;
	
	//**********************************************************************
	// switchTF
	//
	// This function will write the Sencha ExtJS v4 code, in two modes
	// C = Create: Create a new record
	// U = Update: Read for Update a record
	//**********************************************************************
	function actionCU($a = "C"){ $this->cu = $a; } 
	
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
		if ($fieldLengh != ""){$s=255;}else{$s=$fieldLengh;}
		$buff  = "{ xtype: 'textfield',";
		$buff .= "fieldLabel: '".addslashes( trim($fieldLabel) )."',";
		$buff .= "name: '".$fieldName."',";
		$buff .= "maxLength: ".$s.",";
		$buff .= "size: ".$s.",";
		$buff .= "submitValue: true,";
		$buff .= "value: '".$initValue."'}";
		return $buff;
	}
	
	//**********************************************************************
	// statictextAdd
	//
	// This creates the fields into the fieldset & form.
	// 
	// Parameters:
	// $fieldName: The field name
	// $fieldLabel: The field label
	//**********************************************************************
	private function statictexAdd($fieldName, $fieldLabel, $initValue){
		$buff  = "{ xtype: 'textfield',";
		$buff .= "fieldLabel: '".addslashes( trim($fieldLabel) )."',";
		$buff .= "name: '".$fieldName."',";
		$buff .= "submitValue: true,";
		$buff .= "disabled: true,";
		$buff .= "value: '".$initValue."'}";
		return $buff;
	}
	
	//**********************************************************************
	// checkboxAdd
	//
	// This creates the fields into the fieldset & form.
	// 
	// Parameters:
	// $fieldName: The field name
	// $fieldLabel: The field label
	// $initValue: The initial value of the field
	//**********************************************************************
	private function checkboxAdd($fieldName, $fieldLabel, $initValue){
		$buff  = "{ xtype: 'checkboxfield',";
		$buff .= "fieldLabel: '".addslashes( trim($fieldLabel) )."',";
		$buff .= "name: '".$fieldName."',";
		$buff .= "inputValue: '".$initValue."'}";
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
		if ($fieldLengh != ""){$s=255;}else{$s=$fieldLengh;}
		$buff  = "{xtype: 'textarea',"; 
		$buff .= "fieldLabel: '".addslashes( trim($fieldLabel) )."',"; 
		$buff .= "name: '".$fieldName."',"; 
		$buff .= "grow: false,";
		$buff .= "value: '".$initValue."',";
		$buff .= "size: ".$s.",}";
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
		$buff  = "{xtype: 'combo',"; 
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
	// providersAdd
	//
	// This creates the combo into the fieldset & form.
	// 
	// Parameters:
	// $fieldName: The field name
	// $fieldLabel: The field label
	//**********************************************************************
	private function providersAdd($fieldName, $fieldLabel){
		$buff  = "{xtype: 'combo',"; 
		$buff .= "submitValue: true,"; 
		$buff .= "name: '".$fieldName."',";
		$buff .= "fieldLabel: '".addslashes( trim($fieldLabel) )."',";
		$buff .= "editable: false,";
		$buff .= "triggerAction: 'all',";
		$buff .= "mode: 'local',";
		$buff .= "valueField: 'id',";
		$buff .= "displayField: 'cName',";
		$buff .= "store: panel.storeProviders }";
		return $buff;
	}
	
	//**********************************************************************
	// pharmaciesAdd
	//
	// This creates the combo into the fieldset & form.
	// 
	// Parameters:
	// $fieldName: The field name
	// $fieldLabel: The field label
	//**********************************************************************
	private function pharmaciesAdd($fieldName, $fieldLabel){
		$buff  = "{xtype: 'combo',"; 
		$buff .= "submitValue: true,"; 
		$buff .= "name: '".$fieldName."',";
		$buff .= "fieldLabel: '".addslashes( trim($fieldLabel) )."',";
		$buff .= "editable: false,";
		$buff .= "triggerAction: 'all',";
		$buff .= "mode: 'local',";
		$buff .= "valueField: 'id',";
		$buff .= "displayField: 'name',";
		$buff .= "store: panel.storePharmacies }";
		return $buff;
	}
	
	//**********************************************************************
	// providersNPIAdd
	//
	// This creates the combo into the fieldset & form.
	// 
	// Parameters:
	// $fieldName: The field name
	// $fieldLabel: The field label
	//**********************************************************************
	private function providersNPIAdd($fieldName, $fieldLabel){
		$buff  = "{xtype: 'combo',"; 
		$buff .= "submitValue: true,"; 
		$buff .= "name: '".$fieldName."',";
		$buff .= "fieldLabel: '".addslashes( trim($fieldLabel) )."',";
		$buff .= "editable: false,";
		$buff .= "triggerAction: 'all',";
		$buff .= "mode: 'local',";
		$buff .= "valueField: 'npi',";
		$buff .= "displayField: 'cName',";
		$buff .= "store: panel.storeProviders }";
		return $buff;
	}
	
	//**********************************************************************
	// organizationsAdd
	//
	// This creates the combo into the fieldset & form.
	// 
	// Parameters:
	// $fieldName: The field name
	// $fieldLabel: The field label
	//**********************************************************************
	private function organizationsAdd($fieldName, $fieldLabel){
		$buff  = "{xtype: 'combo',"; 
		$buff .= "submitValue: true,"; 
		$buff .= "name: '".$fieldName."',";
		$buff .= "fieldLabel: '".addslashes( trim($fieldLabel) )."',";
		$buff .= "editable: false,";
		$buff .= "triggerAction: 'all',";
		$buff .= "mode: 'local',";
		$buff .= "valueField: 'id',";
		$buff .= "displayField: 'organization',";
		$buff .= "store: panel.storeOrganization}";
		return $buff;
	}
	
	//**********************************************************************
	// allergiesAdd
	//
	// This creates the combo into the fieldset & form.
	// 
	// Parameters:
	// $fieldName: The field name
	// $fieldLabel: The field label
	//**********************************************************************
	private function allergiesAdd($fieldName, $fieldLabel){
		$buff  = "{xtype: 'combo',"; 
		$buff .= "submitValue: true,"; 
		$buff .= "name: '".$fieldName."',";
		$buff .= "fieldLabel: '".addslashes( trim($fieldLabel) )."',";
		$buff .= "editable: false,";
		$buff .= "triggerAction: 'all',";
		$buff .= "mode: 'local',";
		$buff .= "valueField: 'id',";
		$buff .= "displayField: 'type',";
		$buff .= "store: panel.storeAllergies}";
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
		if ($this->cu == "U") $buff .= "read: '".$path."/data_read.ejs.php',";
		if ($this->cu == "C") $buff .= "create: '".$path."/data_create.ejs.php'});";
		if ($this->cu == "U") $buff .= "update: '".$path."/data_update.ejs.php'});";
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
	// factor DataStore for providers
	// 
	// This will create the code for the dataStores requiered by
	// the comboboxes, or any other object that requieres dataStore.
	//
	//**********************************************************************
	private function factorStoreProviders(){
		$buff  = "panel.storeProviders = Ext.create('Ext.mitos.CRUDStore',{";
		$buff .= "fields: [{name: 'id', type: 'int'},";
		$buff .= "{name: 'cName', type: 'string'},";
		$buff .= "{name: 'npi', type: 'string'}";
		$buff .= "],";
		$buff .= "model:'providersModel',";
		$buff .= "idProperty:'id',";
		$buff .= "read: 'lib/layoutEngine/listProviders.json.php' });";
		return $buff;
	}
	
	//**********************************************************************
	// factor DataStore for pharmacies
	// 
	// This will create the code for the dataStores requiered by
	// the comboboxes, or any other object that requieres dataStore.
	//
	//**********************************************************************
	private function factorStorePharmacies(){
		$buff  = "panel.storePharmacies = Ext.create('Ext.mitos.CRUDStore',{";
		$buff .= "fields: [{name: 'id', type: 'int'},";
		$buff .= "{name: 'name', type: 'string'},";
		$buff .= "{name: 'transmit_method', type: 'string'},";
		$buff .= "{name: 'email', type: 'string'}";
		$buff .= "],";
		$buff .= "model:'pharmaciesModel',";
		$buff .= "idProperty:'id',";
		$buff .= "read: 'lib/layoutEngine/listPharmacies.json.php' });";
		return $buff;
	}
	
	//**********************************************************************
	// factor DataStore for pharmacies
	// 
	// This will create the code for the dataStores requiered by
	// the comboboxes, or any other object that requieres dataStore.
	//
	//**********************************************************************
	private function factorStoreOrganizations(){
		$buff  = "panel.storeOrganizations = Ext.create('Ext.mitos.CRUDStore',{";
		$buff .= "fields: [{name: 'id', type: 'int'},";
		$buff .= "{name: 'cName', type: 'string'},";
		$buff .= "{name: 'organization', type: 'string'}";
		$buff .= "],";
		$buff .= "model:'organizationsModel',";
		$buff .= "idProperty:'id',";
		$buff .= "read: 'lib/layoutEngine/listOrganizations.json.php' });";
		return $buff;
	}
	
	//**********************************************************************
	// factor DataStore for allergies
	// 
	// This will create the code for the dataStores requiered by
	// the comboboxes, or any other object that requieres dataStore.
	//
	//**********************************************************************
	private function factorStoreAllergies(){
		$buff  = "panel.storeAllergies = Ext.create('Ext.mitos.CRUDStore',{";
		$buff .= "fields: [{name: 'id', type: 'int'},";
		$buff .= "{name: 'type', type: 'string'}";
		$buff .= "],";
		$buff .= "model:'allegiesModel',";
		$buff .= "idProperty:'id',";
		$buff .= "read: 'lib/layoutEngine/listAllergies.json.php' });";
		return $buff;
	}
	
	//**********************************************************************
	// startFieldContainer & endFieldContainer
	//
	// 
	//**********************************************************************
	private function startFieldContainer($fieldLabel, $labelWidth){
		$buff  = "{";
		$buff .= "xtype: 'fieldcontainer',";
        $buff .= "fieldLabel: '".$fieldLabel."',";
        $buff .= "labelWidth: ".$labelWidth.",";
		$buff .= "layout: 'hbox',";
        $buff .= "items: [";
		return $buff;
	}
	private function endFieldContainer(){
		return "]}";
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
		
		// 1.Render the form dataStores
		//---
		echo $this->factorFormStore("store".ucfirst($formPanel), $path, $dataStoresNames, "item_id");
		echo $this->factorStoreProviders();
		echo $this->factorStorePharmacies();
		echo $this->factorStoreOrganizations();
		echo $this->factorStoreAllergies();
		
		// 2.Render the dataStores for the combo boxes first
		// and do not duplicate the dataStore
		//---
		foreach($dataStoresNames as $key => $row){
			if($row['list_id'] != ""){
				if(!array_key_exists($row['list_id'], $dCheck)){
					echo $this->factorDataStore($row['list_id']);
				}
				$dCheck[$row['list_id']] = true;
			} 
		}
		
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
        				defaults: {anchor: '30%', labelWidth: ".$labelWidth."},
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
					echo ($dataStoresNames[$ahead]['group_name']) ? $row['group_name'] : ',';
				break;
				// Text box
				case 2:
					echo $this->textAdd($row['field_id'], $row['title'], "", $row['fld_length']);
					echo ($dataStoresNames[$ahead]['group_name']) ? $row['group_name'] : ',';
				break;
				// Text area
				case 3:
					echo $this->textareaAdd($row['field_id'], $row['title'], "", $row['fld_length']);
					echo ($dataStoresNames[$ahead]['group_name']) ? $row['group_name'] : ',';
				break;
				// Text-date
				case 4:
					echo $this->dateAdd($row['field_id'], $row['title']);
					echo ($dataStoresNames[$ahead]['group_name']) ? $row['group_name'] : ',';
				break;
				// Providers Combo
				case 10:
					echo $this->providersAdd($row['field_id'], $row['title']);
					echo ($dataStoresNames[$ahead]['group_name']) ? $row['group_name'] : ',';
				break;
				// Providers NPI Combo
				case 11:
					echo $this->providersNPIAdd($row['field_id'], $row['title']);
					echo ($dataStoresNames[$ahead]['group_name']) ? $row['group_name'] : ',';
				break;
				// Pharmacies Combo
				case 12:
					echo $this->pharmaciesAdd($row['field_id'], $row['title']);
					echo ($dataStoresNames[$ahead]['group_name']) ? $row['group_name'] : ',';
				break;
				// Organizations Combo
				case 14:
					echo $this->organizationsAdd($row['field_id'], $row['title']);
					echo ($dataStoresNames[$ahead]['group_name']) ? $row['group_name'] : ',';
				break;
				// Check box List
				case 21:
					echo $this->checkboxAdd($row['field_id'], $row['title']);
					echo ($dataStoresNames[$ahead]['group_name']) ? $row['group_name'] : ',';
				break;
				// Check box Allergies
				case 24:
					echo $this->allergiesAdd($row['field_id'], $row['title']);
					echo ($dataStoresNames[$ahead]['group_name']) ? $row['group_name'] : ',';
				break;
				// Check box w/ Text
				case 25:
					echo $this->checkboxAdd($row['field_id'], $row['title']);
					echo ($dataStoresNames[$ahead]['group_name']) ? $row['group_name'] : ',';
				break;
				// List box w/ Add (Editable)
				case 26:
					echo $this->comboAdd_Editable($row['field_id'], $row['list_id'], $row['title']);
					if($dataStoresNames[$ahead]['group_name'] == $row['group_name']){ echo ","; }
				break;
				// Static Test
				case 31:
					echo $this->statictexAdd($row['field_id'], $row['title'], $row['default_value']);
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
								if (panel." . $formPanel . ".getForm().findField('id').getValue()){ // Update
									var record = panel." . $formPanel . ".getAt(rowPos);
									var fieldValues = panel." . $formPanel . ".getForm().getValues();
            			    	    var k, i;
									for ( k=0; k <= record.fields.getCount()-1; k++) {
										i = record.fields.get(k).name;
										record.set( i, fieldValues[i] );
									}
								} else { // Add
									var obj = eval( '(' + Ext.JSON.encode(panel." . $formPanel . ".getForm().getValues()) + ')' );
									panel." . $formPanel . ".add( obj );
								}
								panel." . $formPanel . ".sync();	// Save the record to the dataStore
								panel." . $formPanel . ".load();	// Reload the dataSore from the database
								Ext.topAlert.msg('New patient as been saved!','');
							}
                        }]
                    }]
				}); // End of ".$formPanel . chr(13);
	}
	
}

?>