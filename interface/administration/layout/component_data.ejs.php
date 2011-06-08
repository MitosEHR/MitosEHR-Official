<?php
//--------------------------------------------------------------------------------------------------------------------------
// component_data.ejs.php / List Options
// v0.0.1
// Under GPLv3 License
//
// Integrated by: Gi Technologies. in 2011
//
// Remember, this file is called via the Framework Store, this is the AJAX thing.
//--------------------------------------------------------------------------------------------------------------------------

session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once($_SESSION['site']['root']."/library/dbHelper/dbHelper.inc.php");
include_once($_SESSION['site']['root']."/library/I18n/I18n.inc.php");
require_once($_SESSION['site']['root']."/repository/dataExchange/dataExchange.inc.php");

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;

//------------------------------------------
// Database class instance
//------------------------------------------
$mitos_db = new dbHelper();

// *************************************************************************************
// Deside what to do with the $_GET['task']
// *************************************************************************************
switch ($_GET['task']) {
	
	// *************************************************************************************
	// Data for Form List
	// *************************************************************************************
	case "form_list":
		$mitos_db->setSQL("SELECT DISTINCT form_id FROM layout_options");
		$totals = $mitos_db->rowCount();
		//---------------------------------------------------------------------------------------
		// start the array
		//---------------------------------------------------------------------------------------
		$rows = array();
		foreach($mitos_db->execStatement() as $row){
			$row['id'] = $row['form_id'];
			array_push($rows, $row);
		}
		//---------------------------------------------------------------------------------------
		// here we are adding "totals" and the root "row" for sencha use 
		//---------------------------------------------------------------------------------------
		print_r(json_encode(array('totals'=>$totals,'row'=>$rows)));
	break;
	
	// *************************************************************************************
	// Available Data Types for the Form Editor
	// *************************************************************************************
	case "data_types":
		$datatypes = array(
			0 => array("id" => "1", "type" => i18n("List box", 'r')), 
			1 => array("id" => "2", "type"  => i18n("Textbox", 'r')),
			2 => array("id" => "3", "type"  => i18n("Textarea", 'r')),
			3 => array("id" => "4", "type"  => i18n("Text-date", 'r')),
			4 => array("id" => "10", "type" => i18n("Providers", 'r')),
			5 => array("id" => "11", "type" => i18n("Providers NPI", 'r')),
			6 => array("id" => "12", "type" => i18n("Pharmacies", 'r')),
			7 => array("id" => "13", "type" => i18n("Squads", 'r')),
			8 => array("id" => "14", "type" => i18n("Organizations", 'r')),
			9 => array("id" => "15", "type" => i18n("Billing codes", 'r')),
			10 => array("id" => "21", "type" => i18n("Checkbox list", 'r')),
			11 => array("id" => "22", "type" => i18n("Textbox list", 'r')),
			12 => array("id" => "23", "type" => i18n("Exam results", 'r')),
			13 => array("id" => "24", "type" => i18n("Patient allergies", 'r')),
			14 => array("id" => "25", "type" => i18n("Checkbox w/text", 'r')),
			15 => array("id" => "26", "type" => i18n("List box w/add", 'r')),
			16 => array("id" => "27", "type" => i18n("Radio buttons", 'r')),
			17 => array("id" => "28", "type" => i18n("Lifestyle status", 'r')),
			18 => array("id" => "31", "type" => i18n("Static Text", 'r')),
			19 => array("id" => "32", "type" => i18n("Smoking Status", 'r')),
			20 => array("id" => "33", "type" => i18n("Race and Ethnicity", 'r'))
		);
		$totals = count($datatypes);
		print_r(json_encode(array('totals'=>$totals,'row'=>$datatypes)));
	break;

	//---------------------------------------------------------------------------------------
	// UOR
	//---------------------------------------------------------------------------------------	
	case "uor":
		$uorTypes = array(
			0 => array("id"=> 0, "uor" => i18n('Unused', 'r')),
			1 => array("id"=> 1, "uor" => i18n('Optional', 'r')),
			2 => array("id"=> 2, "uor" => i18n('Required', 'r'))
		);
		$totals = count($uorTypes);
		print_r(json_encode(array('totals'=>$totals,'row'=>$uorTypes)));
	break;
	
	// *************************************************************************************
	// Available List for the available data types
	// *************************************************************************************
	case "lists":
		if ($_SESSION['lang']['code'] == "en_US") { // If the selected language is English, do not translate
			$mitos_db->setSQL("SELECT 
						*
					FROM 
						list_options 
					WHERE 
						list_id = 'lists' 
					ORDER BY 
						seq");
		} else {
			// Use and sort by the translated list name.
			$mitos_db->setSQL("SELECT 
						lo.id,
						lo.list_id,
						lo.option_id, 
						IF(LENGTH(ld.definition),ld.definition,lo.title) AS title ,
						lo.seq,
						lo.is_default,
						lo.option_value,
						lo.mapping,
						lo.notes 
					FROM 
						list_options AS lo 
						LEFT JOIN lang_constants AS lc ON lc.constant_name = lo.title 
						LEFT JOIN lang_definitions AS ld ON ld.cons_id = lc.cons_id AND ld.lang_id = '" . $_SESSION['lang']['code'] . "
					WHERE 
						lo.list_id = 'lists' 
					ORDER BY 
						IF(LENGTH(ld.definition),ld.definition,lo.title), lo.seq");
		}
		$totals = $mitos_db->rowCount();
		//---------------------------------------------------------------------------------------
		// start the array
		//---------------------------------------------------------------------------------------
		$rows = array();
		foreach($mitos_db->execStatement() as $row){
			array_push($rows, $row);
		}
		//---------------------------------------------------------------------------------------
		// here we are adding "totals" and the root "row" for sencha use 
		//---------------------------------------------------------------------------------------
		print_r(json_encode(array('totals'=>$totals,'row'=>$rows)));
	break;

}
?>