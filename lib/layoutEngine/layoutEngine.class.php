<?php
/* 
 * layoutEngine.class.php
 * 
 * @DESCRIPTION@: This class object will create dynamic ExtJS v4 form, previuosly created or edited 
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
	// actionCU
	//
	// This function will set the main dataStore in two modes Create and
	// Update
	//
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
		$s = (($fieldLengh) ? $fieldLengh : '255');
		$buff  = "{xtype: 'textfield',";
		$buff .= "fieldLabel: '".addslashes( trim($fieldLabel) )."',";
		$buff .= "name: '".$fieldName."', maxLength: ".$s.", size: " . $s . ", submitValue: true,";
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
		$buff  = "{xtype: 'textfield',";
		$buff .= "fieldLabel: '".addslashes( trim($fieldLabel) )."',";
		$buff .= "name: '".$fieldName."', submitValue: true, disabled: true,";
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
		$buff  = "{xtype: 'checkboxfield',";
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
		$s = (($fieldLengh) ? $fieldLengh : '255');
		$buff  = "{xtype: 'textarea',"; 
		$buff .= "fieldLabel: '".addslashes( trim($fieldLabel) )."',"; 
		$buff .= "name: '".$fieldName."', grow: false, value: '".$initValue."',";
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
		$buff .= "editable: false, triggerAction: 'all', mode: 'local', valueField: 'title', displayField: 'title',";
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
		$buff .= "editable: false, triggerAction: 'all', mode: 'local', valueField: 'id', displayField: 'cName',";
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
		$buff .= "editable: false, triggerAction: 'all', mode: 'local', valueField: 'id', displayField: 'name',";
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
		$buff .= "editable: false, triggerAction: 'all', mode: 'local', valueField: 'npi', displayField: 'cName',";
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
		$buff .= "editable: false, triggerAction: 'all', mode: 'local', valueField: 'id', displayField: 'organization',";
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
		$buff .= "editable: false, triggerAction: 'all', mode: 'local', valueField: 'id', displayField: 'type',";
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
		$buff .= "editable: true, triggerAction: 'all', mode: 'local', valueField: 'title', displayField: 'title',";
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
		if ($this->cu == "U") $buff .= "read: '".$path."/data_read.ejs.php',";			// Only when updating
		if ($this->cu == "C") $buff .= "create: '".$path."/data_create.ejs.php'});";	// Only when creating
		if ($this->cu == "U") $buff .= "update: '".$path."/data_update.ejs.php'});";	// Only when updating
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
		$buff .= "model:'".$list."Model', idProperty:'option_id',";
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
		$buff .= "model:'providersModel', idProperty:'id',";
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
		$buff .= "model:'pharmaciesModel', idProperty:'id',";
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
		$buff .= "model:'organizationsModel', idProperty:'id',";
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
		$buff .= "model:'allegiesModel', idProperty:'id',";
		$buff .= "read: 'lib/layoutEngine/listAllergies.json.php' });";
		return $buff;
	}
	
	//**********************************************************************
	// startFieldContainer & endFieldContainer
	//
	// 
	//**********************************************************************
	private function startFieldContainer($fieldLabel, $labelWidth){
		$buff  = "{xtype: 'fieldcontainer',";
        $buff .= "fieldLabel: '".$fieldLabel."', labelWidth: ".$labelWidth.", layout: 'hbox',";
        $buff .= "items: [";
		return $buff;
	}
	private function endFieldContainer(){
		return "]}";
	}
	
	//**********************************************************************
	// Get all the fields from a particupar form and give back
	// the array of the fields.
	//**********************************************************************
	private function arrayFields($formPanel){
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
		return $this->execStatement(PDO::FETCH_ASSOC);
	}
	
	private function tfInGroup($formPanel, $group){
		$this->setSQL("SELECT 
							*
						FROM
  							layout_options
						WHERE
  							form_id = '".$formPanel."' AND group_name = '".$group."'
						HAVING
  							layout_options.uor = '1' OR layout_options.uor = '2'
						ORDER BY
  							layout_options.group_order
							, layout_options.seq");
		return count($this->execStatement(PDO::FETCH_ASSOC));
	}
				
	//**********************************************************************
	// renderForm 
	//
	// This will render the selected form, and returns the Sencha ExtJS v4 
	// code.
	//**********************************************************************
	function renderForm($formPanel, $path, $title, $labelWidth, $saveText){
			
		$big_buff = "";
		
		// First we need to render all the dataStores
		// and gather all the dataStore names
		// This SQL Statement has the uor in action UOR means
		// U.Unused O.Optional R.Requiered
		//---
		$dataStoresNames = array();
		$dataStoresNames = $this->arrayFields($formPanel);
		
		// 1.Render the form dataStores
		//---
		$big_buff  = $this->factorFormStore("store".ucfirst($formPanel), $path, $dataStoresNames, "item_id");
		$big_buff .= $this->factorStoreProviders();
		$big_buff .= $this->factorStorePharmacies();
		$big_buff .= $this->factorStoreOrganizations();
		$big_buff .= $this->factorStoreAllergies();
		
		// 2.Render the dataStores for the combo boxes first
		// and do not duplicate the dataStore
		//---
		foreach($dataStoresNames as $key => $row){
			if($row['list_id'] != ""){
				if(!array_key_exists($row['list_id'], $dCheck)){ $big_buff .= $this->factorDataStore($row['list_id']); }
				$dCheck[$row['list_id']] = true;
			} 
		}
		
		// 3.Begin with the form
		//---
		$big_buff .= "panel." . $formPanel . " = Ext.create('Ext.form.Panel', {";
		$big_buff .= "title: '" . $title . "',";
		$big_buff .= "frame: true, bodyStyle: 'padding: 5px', layout: 'anchor',";
		$big_buff .= "fieldDefaults: {labelAlign: 'top', msgTarget: 'side', anchor: '40%'},";
		$big_buff .= "items: [";
		
		// 4.Loop through the form groups & fields
		//---
		$group_name = array();
		$first=true;
		$gfCount=1;
		foreach($dataStoresNames as $key => $row){
			$ahead = $key + 1;
			
			/*
			 * Check if the group_name already has been deployed
			 * if not create the fieldset.
			 */
			if(!array_key_exists($row['group_name'], $group_name)){
				// Get the number of fields on a form and in a group
				// and divide it by 2, so it can give us the number of fields
				// alfter rendering the fields into the next column
				$tfGroup = $this->tfInGroup($formPanel, $row['group_name']);			// Total Fields in Group
				$cols = round($this->tfInGroup($formPanel, $row['group_name']) / 2);	// Middle of the total fields
				$big_buff .= "{xtype:'fieldset',";
        		$big_buff .= "collapsible: true, collapsed: ". (($first) ? 'false' : 'true') .", title: '".$row["group_name"]."',";
        		$big_buff .= "defaults: {border: false, xtype: 'panel', flex: 1, layout: 'anchor', labelWidth: ".$labelWidth."},";
        		$big_buff .= "layout: 'hbox',";
        		$big_buff .= "items: [{";
	        	$first=false;
	        	$gfCount=1;
			} 
			
			/* 
			 * Divide the group into 2 columns
			 * pre-calculated on $cols
			 */
			if($gfCount == 1){ $big_buff .= "items :["; }	// Render fields to the first column 
			if ($gfCount == $cols){ 						// Render fields to the next column
				$big_buff = substr($big_buff, 0, -1);
				$big_buff .= "] }, { items: ["; 
			}
			
			/*
			 * Create the fields inside of the fieldset
			 * depending on the data_type field create
			 * the field
			 */
			switch ($row['data_type']){
				// list box
				case 1:
					$big_buff .= $this->comboAdd($row['field_id'], $row['list_id'], $row['title']);
					$big_buff .= (($dataStoresNames[$ahead]['group_name']==$row['group_name']) ? ',' : '');
				break;
				// Text box
				case 2:
					$big_buff .= $this->textAdd($row['field_id'], $row['title'], "", $row['fld_length']);
					$big_buff .= (($dataStoresNames[$ahead]['group_name']==$row['group_name']) ? ',' : '');
				break;
				// Text area
				case 3:
					$big_buff .= $this->textareaAdd($row['field_id'], $row['title'], "", $row['fld_length']);
					$big_buff .= (($dataStoresNames[$ahead]['group_name']==$row['group_name']) ? ',' : '');
				break;
				// Text-date
				case 4:
					$big_buff .= $this->dateAdd($row['field_id'], $row['title']);
					$big_buff .= (($dataStoresNames[$ahead]['group_name']==$row['group_name']) ? ',' : '');
				break;
				// Providers Combo
				case 10:
					$big_buff .= $this->providersAdd($row['field_id'], $row['title']);
					$big_buff .= (($dataStoresNames[$ahead]['group_name']==$row['group_name']) ? ',' : '');
				break;
				// Providers NPI Combo
				case 11:
					$big_buff .= $this->providersNPIAdd($row['field_id'], $row['title']);
					$big_buff .= (($dataStoresNames[$ahead]['group_name']==$row['group_name']) ? ',' : '');
				break;
				// Pharmacies Combo
				case 12:
					$big_buff .= $this->pharmaciesAdd($row['field_id'], $row['title']);
					$big_buff .= (($dataStoresNames[$ahead]['group_name']==$row['group_name']) ? ',' : '');
				break;
				// Organizations Combo
				case 14:
					$big_buff .= $this->organizationsAdd($row['field_id'], $row['title']);
					$big_buff .= (($dataStoresNames[$ahead]['group_name']==$row['group_name']) ? ',' : '');
				break;
				// Check box List
				case 21:
					$big_buff .= $this->checkboxAdd($row['field_id'], $row['title']);
					$big_buff .= (($dataStoresNames[$ahead]['group_name']==$row['group_name']) ? ',' : '');
				break;
				// Check box Allergies
				case 24:
					$big_buff .= $this->allergiesAdd($row['field_id'], $row['title']);
					$big_buff .= (($dataStoresNames[$ahead]['group_name']==$row['group_name']) ? ',' : '');
				break;
				// Check box w/ Text
				case 25:
					$big_buff .= $this->checkboxAdd($row['field_id'], $row['title']);
					$big_buff .= (($dataStoresNames[$ahead]['group_name']==$row['group_name']) ? ',' : '');
				break;
				// List box w/ Add (Editable)
				case 26:
					$big_buff .= $this->comboAdd_Editable($row['field_id'], $row['list_id'], $row['title']);
					$big_buff .= (($dataStoresNames[$ahead]['group_name']==$row['group_name']) ? ',' : '');
				break;
				// Static Test
				case 31:
					$big_buff .= $this->statictexAdd($row['field_id'], $row['title'], $row['default_value']);
					$big_buff .= (($dataStoresNames[$ahead]['group_name']==$row['group_name']) ? ',' : '');
				break;
			}
			
			/*
			 * Close the fieldset, if it is the end.
			 */
			if($tfGroup == $gfCount){ $big_buff .= "]"; }
			if($dataStoresNames[$ahead]['group_name'] != $row['group_name']) $big_buff .= "}]},";
			
			/*
			 * Update the group_name variable to see if in the
			 * next round trip we make a fieldset.
			 */
			$group_name[$row['group_name']] = $row['group_name'];
			$gfCount++;
		} 
		$big_buff = substr($big_buff, 0, -1);

		// 5. End the form
		//---
		$big_buff .= "]";
		$big_buff .= "}); // End of ".$formPanel . chr(13);
		
		echo $big_buff;
	}
	
}

?>