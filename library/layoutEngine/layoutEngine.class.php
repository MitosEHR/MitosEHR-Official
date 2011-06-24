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

 class layoutEngine extends dbHelper {

	private $conn;
	private $switcher;
	
	//**********************************************************************
	// getForm
	//
	// SQL Statement, to get the diferent forms created in the
	// layout_options 
	//**********************************************************************
	function getForm($form_id="Demographics"){
		$sql = "SELECT 
					layout_options.*, list_options.title AS listDesc
				FROM
  					layout_options
				LEFT OUTER JOIN 
					list_options
				ON 
					layout_options.list_id = list_options.option_id
				WHERE
  					layout_options.form_id = '". $form_id . "'
				ORDER BY
  					layout_options.group_order, layout_options.seq";
		$this->setSQL($sql);
		return $this->execStatement();
	}

	//**********************************************************************
	// switchTF
	//
	// This function will write the Sencha ExtJS v4 code, in two modes
	// T = Text: Will display the form only in HTML, no fields
	// F = Fields: Will create the form with fields
	//**********************************************************************
	function switchTF($v = "F"){ $this->switcher = $v; } 
	
	//**********************************************************************
	// formFieldset
	// 
	// This creates the fielsets for the formPanel, this should be called
	// between formPanel's start & ends.
	// 
	// Parameters:
	// $start: S to start the fieldset, E to end it.
	// $fieldsetName: The name of the field set, can be empty
	//**********************************************************************
	function formFieldset($fieldsetName, $start="S"){
		if($start=="S"){
			echo "{
        			xtype:'fieldset',
        			columnWidth: 0.5,
        			title: '".$fieldsetName."',
        			defaults: {anchor: '100%'},
        			layout: 'anchor',
        			items :[";	
		}
		
		if($start=="E"){
			echo "]";
		}
	}
	
	//**********************************************************************
	// fieldAdd
	//
	// This creates the fields into the fieldset & form.
	// 
	// Parameters:
	// $fieldName: The field name
	// $fieldLabel: The field label
	// $initValue: The initial value of the field
	// $fieldLengh: The max length of the field
	// $xtype: The xtype value this one is the same a Sencha has.
	//**********************************************************************
	function fieldAdd($fieldName, $fieldLabel, $initValue, $fieldLengh="255", $xtype="textfield"){
		echo "	{
					xtype		: '".$xtype."', 
					fieldLabel	: '".$fieldLabel."', 
					name		: '".$fieldName."', 
					maxLength	: ".$fieldLengh.", 
					size		: ".$fieldLengh.", 
					submitValue	: true, 
					value		: '".$initValue."' 
				}";
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
	function factorDataStore($list){
			echo "panel.store" . ucfirst($list) . " = Ext.create('Ext.mitos.CRUDStore',{
						fields: [
							{name: 'option_id',		type: 'string'},
							{name: 'title',			type: 'string'}
						],
						model 		:'".$list."Model',
						idProperty 	:'id',
						read		: 'library/layoutEngine/listOptions.json.php',
						extraParams	: {\"task\": \"".$list."\"}
					});";
			return "store".ucfirst($list);
	}
	
	//**********************************************************************
	// renderForm 
	//
	// This will render the selected form, and returns the Sencha ExtJS v4 
	// code.
	//**********************************************************************
	function renderForm($formPanel, $url, $title, $labelWidth){
		
		$dataStoresNames = array();
		
		// First we need to render all the dataStores
		// and gather all the dataStore names
		//---
		foreach(getForm($formPanel) as $row){
			
		}
		
		// Begin with the form
		//---
		echo "panel." . $formPanel . " = Ext.create('Ext.form.Panel', {
				title		: '" . $title . "',
				url			: '" . $url . "',
				frame		: false,
				bodyStyle	: 'padding: 5px',
				width		: '100%',
				layout		: 'column',
				defaults	: { bodyPadding: 4, labelWidth: ".$labelWidth.", anchor: '100%'},
				items		: [";
		
		// Loop through the form groups
		//---
		foreach(getForm($formPanel) as $row){
			
		}
				
		// End with the form
		//---
		echo "		]
				}); // End of ".$formPanel;
	}
	
}

?>