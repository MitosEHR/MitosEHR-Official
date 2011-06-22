<?php
/* 
 * layoutEngine.class.php
 * 
 * @DESCRIPTION: This class object will create dynamic ExtJS v4 form, previuosly created or edited 
 * from the Layout Form Editor. Gathering all it's data and parameters from the layout_options table. 
 * Most of the structural database table was originally created by OpenEMR developers.
 * 
 * What this class will not do: This class will not create the entire Screen Panel for you, this
 * will only create the form object with the fields names, configured on the layout_options table.
 * 
 * version: 0.0.1 
 * author: Gino Rivera Falu
 * 
 */

class layoutEngine {

	private $conn;
	private $switcher;
	
	//**********************************************************************
	// dbObject
	//
	// Description:
	// Makes a copy of the current database connection object into the
	// class itself.
	//**********************************************************************
	function dbObject($dbobj){
		$this->conn = $dbobj;
	}

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
	}

	//**********************************************************************
	// switchTF
	// This function will write the Sencha ExtJS v4 code, in two modes
	// T = Text: Will display the form only in HTML, no fields
	// F = Fields: Will create the form with fields
	//**********************************************************************
	function switchTF($v = "F"){ $this->switcher = $v; } 
	
	//**********************************************************************
	// formPanel
	//
	// This creates the Sencha form object, in OOP
	//
	// Parameters:
	// $start: S for start the form, or E to end the form
	// $formPanel: The name of the form panel object
	// $title: The title of the form panel object
	// $url: Where te results will be send to.
	//**********************************************************************
	function formPanel($title, $url, $start="S", $formPanel="formPanel", $labelWidth="80"){
		if($start=="S"){
			echo "panel." . $formPanel . " = Ext.create('Ext.form.Panel', {
  					title		: '" . $title . "',
					labelWidth	: " . $labelWidth . ",
					url		: '" . $url . "',
  					frame		: true,
					bodyStyle	: 'padding: 5px',
					width		: '100%',
					layout		: 'column',
  					defaults	: { bodyPadding: 4 },";
    	}
		if ($start=="E") echo "});";
	}
	
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
			echo "items: [{
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
		echo "
			{
				xtype: '".$xtype."',
				fieldLabel: '".$fieldLabel."',
            	name: '".$fieldName."',
            	maxLength: ".$fieldLengh.",
            	size: ".$fieldLengh.",
            	submitValue: true,
            	value: '".$initValue."',
            }";
	}
	
	//**********************************************************************
	// renderForm 
	//
	// This will render the selected form, and returns the Sencha ExtJS v4 
	// code.
	//**********************************************************************
	function renderForm($form, $echo="TRUE"){
		
	}
	
}

?>