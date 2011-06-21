<?php
/* 
 * layoutEngine.class.php
 * 
 * @DESCRIPTION: This class object will create dynamic ExtJS v4 form, previuosly created or edited 
 * from the Layout Form Editor. Gathering all it's data and parameters from the layout_options table. 
 * Most of the structural database table was originally created by OpenEMR developers.
 * 
 * version: 0.0.1 
 * author: Gino Rivera Falu
 */

class layoutEngine {

	private $conn;
	private $switcher;
	
	//**********************************************************************
	// Connect to the database just like dbHelper
	//
	// Author: Gino Rivera
	//**********************************************************************
	function __construct() {
		error_reporting(0);
		try {
    		$this->conn = new PDO( "mysql:host=" . $_SESSION['site']['db']['host'] . ";port=" . $_SESSION['site']['db']['port'] . ";dbname=" . $_SESSION['site']['db']['database'], $_SESSION['site']['db']['username'], $_SESSION['site']['db']['password'] );
		} catch (PDOException $e) {
    		$this->err = $e->getMessage();
		}
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
	function formPanel($start="S", $formPanel="formPanel", $title, $url){
		if($start=="S"){
			echo "panel." . $formPanel . " = Ext.create('Ext.form.Panel', {
    					title: '" . $title . "',
    					labelWidth: 80,
    					url: '" . $url . "',
	    				frame: true,
    					bodyStyle: 'padding: 5px',
    					width: '100%',
    					layout: 'column',
    					defaults: {
    	    				bodyPadding: 4
	    				},";
    	}
		if ($start=="E") echo "});";
	}
	
	//**********************************************************************
	// Create the fieldset
	//**********************************************************************
	function formFieldset($start="S", $fieldsetName, $column=1){
		$cpos = $column * 0.5;
		if($start=="S"){
			echo "items: [{
        				xtype:'fieldset',
        				columnWidth: ".$cpos.",
        				title: '".$fieldsetName."',
        				collapsible: true,
        				defaults: {anchor: '100%'},
        				layout: 'anchor',";	
		}
		if($start=="E"){
			echo "}]";
		}
	}
	
	
}

?>