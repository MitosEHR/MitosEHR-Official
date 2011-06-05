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

include_once("../../../library/dbHelper/dbHelper.inc.php");
include_once("../../../library/I18n/I18n.inc.php");
require_once("../../../repository/dataExchange/dataExchange.inc.php");

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
		$total = $mitos_db->rowCount();
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
		print_r(json_encode(array('totals'=>$total,'row'=>$rows)));
	break;
	
	case "data_types";
		$datatypes = array(
			"1"  => i18n("List box"), 
			"2"  => i18n("Textbox"),
			"3"  => i18n("Textarea"),
			"4"  => i18n("Text-date"),
			"10" => i18n("Providers"),
			"11" => i18n("Providers NPI"),
			"12" => i18n("Pharmacies"),
			"13" => i18n("Squads"),
			"14" => i18n("Organizations"),
			"15" => i18n("Billing codes"),
			"21" => i18n("Checkbox list"),
			"22" => i18n("Textbox list"),
			"23" => i18n("Exam results"),
			"24" => i18n("Patient allergies"),
			"25" => i18n("Checkbox w/text"),
			"26" => i18n("List box w/add"),
			"27" => i18n("Radio buttons"),
			"28" => i18n("Lifestyle status"),
			"31" => i18n("Static Text"),
			"32" => i18n("Smoking Status"),
			"33" => i18n("Race and Ethnicity")
		);
		$totals = count($datatypes);
		foreach($datatypes as $row){ array_push($rows, $row); }
		print_r(json_encode(array('totals'=>$total,'row'=>$rows)));
	break;

}
?>