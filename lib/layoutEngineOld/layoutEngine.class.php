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
class layoutEngineOld extends dbHelper {

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
	// examsAdd
	//
	// This creates the fields into the fieldset & form.
	// 
	// Parameters:
	// $fieldName: The field name
	// $fieldLabel: The field label
	//**********************************************************************
	private function examsAdd($fieldName, $fieldLabel){
		$buff  = "{xtype: 'fieldcontainer',";
		$buff .= "fieldLabel: '".$fieldLabel."',";
		$buff .= "defaultType: 'radiofield',";
		$buff .= "defaults: {flex: 1},";
		$buff .= "layout: 'hbox',";
		$buff .= "items: [";
		if ($_SESSION['lang']['code'] == "en_US") { // If the selected language is English, do not translate
			$this->setSQL("SELECT 
								*
							FROM
								list_options
							WHERE
								list_id = 'exams'
							ORDER BY seq");
		} else {
		// Use and sort by the translated list name.
			$this->setSQL("SELECT 
							*, 
							IF(LENGTH(ld.definition),ld.definition,lo.title) AS title 
						FROM list_options AS lo 
							LEFT JOIN lang_constants AS lc ON lc.constant_name = lo.title 
							LEFT JOIN lang_definitions AS ld ON ld.cons_id = lc.cons_id AND ld.lang_id = '" . $_SESSION['lang']['code'] . "' 
						WHERE 
							lo.list_id = 'exams' 
						ORDER BY 
							IF(LENGTH(ld.definition),ld.definition,lo.title), lo.seq");
}
		foreach($this->execStatement(PDO::FETCH_ASSOC) as $key => $row){
			$buff .= "{boxLabel: '".$row['title']."',";
			$buff .= "name: '".$fieldName."',";
			$buff .= "inputValue: '".$row['option_id']."'";
			$buff .= "}";
		}
		$buff .= "]}";
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
	// factor DataStore for providers
	// 
	// This will create the code for the dataStores requiered by
	// the comboboxes, or any other object that requieres dataStore.
	//
	//**********************************************************************
	private function factorStoreExams(){
		$buff  = "panel.storeExams = Ext.create('Ext.mitos.CRUDStore',{";
		$buff .= "fields: [{name: 'id', type: 'int'},";
		$buff .= "{name: 'option_id', type: 'string'},";
		$buff .= "{name: 'title', type: 'string'},";
		$buff .= "{name: 'seq', type: 'int'},";
		$buff .= "{name: 'is_default', type: 'string'},";
		$buff .= "{name: 'option_value', type: 'string'}";
		$buff .= "],";
		$buff .= "model:'examsModel', idProperty:'id',";
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
			
		$bBuff = "";
		
		// First we need to render all the dataStores
		// and gather all the dataStore names
		// This SQL Statement has the uor in action UOR means
		// U.Unused O.Optional R.Requiered
		//---
		$dataStoresNames = array();
		$dataStoresNames = $this->arrayFields($formPanel);
		
		// 1.Render the form dataStores
		//---
		$bBuff  = $this->factorFormStore("store".ucfirst($formPanel), $path, $dataStoresNames, "item_id");
		$bBuff .= $this->factorStoreProviders();
		$bBuff .= $this->factorStorePharmacies();
		$bBuff .= $this->factorStoreOrganizations();
		$bBuff .= $this->factorStoreAllergies();
		$bBuff .= $this->factorStoreExams();
		
		// 2.Render the dataStores for the combo boxes first
		// and do not duplicate the dataStore
		//---
		foreach($dataStoresNames as $key => $row){
			if($row['list_id'] != ""){
				if(!array_key_exists($row['list_id'], $dCheck)){ $bBuff .= $this->factorDataStore($row['list_id']); }
				$dCheck[$row['list_id']] = true;
			} 
		}
		
		// 3.Begin with the form
		//---
		$bBuff .= "panel." . $formPanel . " = Ext.create('Ext.form.Panel', {";
		$bBuff .= "title: '" . $title . "',";
		$bBuff .= "frame: true, bodyStyle: 'padding: 5px', layout: 'anchor',";
		$bBuff .= "fieldDefaults: {labelAlign: 'top', msgTarget: 'side', anchor: '40%'},";
		$bBuff .= "items: [";
		
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
				$tfGroup = $this->tfInGroup($formPanel, $row['group_name']);			// Total Fields in Group
				$cols = round($this->tfInGroup($formPanel, $row['group_name']) / 2);	// Middle of the total fields
				$bBuff .= "{xtype:'fieldset',";
        		$bBuff .= "collapsible: true, collapsed: ". (($first) ? 'false' : 'true') .", title: '".$row["group_name"]."',";
        		$bBuff .= "defaults: {border: false, xtype: 'panel', flex: 1, layout: 'anchor', labelWidth: ".$labelWidth."},";
        		$bBuff .= "layout: 'hbox',";
        		$bBuff .= "items: [{ items :[";
	        	$first=false;
	        	$gfCount=1;
			} 
			
			/* 
			 * Render fields to the next column
			 */ 
			if ($gfCount == $cols){
				$bBuff = substr($bBuff, 0, -1);
				$bBuff .= "] }, { items: ["; 
			}
			
			/*
			 * Create the fields inside of the fieldset
			 * depending on the data_type field create
			 * the field
			 */
			switch ($row['data_type']){
				// list box
				case 1:
					$bBuff .= $this->comboAdd($row['field_id'], $row['list_id'], $row['title']);
					$bBuff .= (($dataStoresNames[$ahead]['group_name']==$row['group_name']) ? ',' : '');
				break;
				// Text box
				case 2:
					$bBuff .= $this->textAdd($row['field_id'], $row['title'], "", $row['fld_length']);
					$bBuff .= (($dataStoresNames[$ahead]['group_name']==$row['group_name']) ? ',' : '');
				break;
				// Text area
				case 3:
					$bBuff .= $this->textareaAdd($row['field_id'], $row['title'], "", $row['fld_length']);
					$bBuff .= (($dataStoresNames[$ahead]['group_name']==$row['group_name']) ? ',' : '');
				break;
				// Text-date
				case 4:
					$bBuff .= $this->dateAdd($row['field_id'], $row['title']);
					$bBuff .= (($dataStoresNames[$ahead]['group_name']==$row['group_name']) ? ',' : '');
				break;
				// Providers Combo
				case 10:
					$bBuff .= $this->providersAdd($row['field_id'], $row['title']);
					$bBuff .= (($dataStoresNames[$ahead]['group_name']==$row['group_name']) ? ',' : '');
				break;
				// Providers NPI Combo
				case 11:
					$bBuff .= $this->providersNPIAdd($row['field_id'], $row['title']);
					$bBuff .= (($dataStoresNames[$ahead]['group_name']==$row['group_name']) ? ',' : '');
				break;
				// Pharmacies Combo
				case 12:
					$bBuff .= $this->pharmaciesAdd($row['field_id'], $row['title']);
					$bBuff .= (($dataStoresNames[$ahead]['group_name']==$row['group_name']) ? ',' : '');
				break;
				// Organizations Combo
				case 14:
					$bBuff .= $this->organizationsAdd($row['field_id'], $row['title']);
					$bBuff .= (($dataStoresNames[$ahead]['group_name']==$row['group_name']) ? ',' : '');
				break;
				// Check box List
				case 21:
					$bBuff .= $this->checkboxAdd($row['field_id'], $row['title']);
					$bBuff .= (($dataStoresNames[$ahead]['group_name']==$row['group_name']) ? ',' : '');
				break;
				// Exams Radio Group
				case 23:
					$bBuff .= $this->examsAdd($row['field_id'], $row['title']);
					$bBuff .= (($dataStoresNames[$ahead]['group_name']==$row['group_name']) ? ',' : '');
				break;
				// Check box Allergies
				case 24:
					$bBuff .= $this->allergiesAdd($row['field_id'], $row['title']);
					$bBuff .= (($dataStoresNames[$ahead]['group_name']==$row['group_name']) ? ',' : '');
				break;
				// Check box w/ Text
				case 25:
					$bBuff .= $this->checkboxAdd($row['field_id'], $row['title']);
					$bBuff .= (($dataStoresNames[$ahead]['group_name']==$row['group_name']) ? ',' : '');
				break;
				// List box w/ Add (Editable)
				case 26:
					$bBuff .= $this->comboAdd_Editable($row['field_id'], $row['list_id'], $row['title']);
					$bBuff .= (($dataStoresNames[$ahead]['group_name']==$row['group_name']) ? ',' : '');
				break;
				// Static Test
				case 31:
					$bBuff .= $this->statictexAdd($row['field_id'], $row['title'], $row['default_value']);
					$bBuff .= (($dataStoresNames[$ahead]['group_name']==$row['group_name']) ? ',' : '');
				break;
			}
			
			/*
			 * Close the fieldset, if it is the end.
			 */
			if($tfGroup == $gfCount){ $bBuff .= "]"; }
			if($dataStoresNames[$ahead]['group_name'] != $row['group_name']) $bBuff .= "}]},";
			
			/*
			 * Update the group_name variable to see if in the
			 * next round trip we make a fieldset.
			 */
			$group_name[$row['group_name']] = $row['group_name'];
			$gfCount++;
		} 
		$bBuff = substr($bBuff, 0, -1);

		// 5. End the form
		//---
		$bBuff .= "]";
		$bBuff .= "}); // End of ".$formPanel . chr(13);
		
		echo $bBuff;
	}
	
}

?>