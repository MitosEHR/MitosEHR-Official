<?php
//--------------------------------------------------------------------------------------------------------------------------
// data_read.ejs.php
// Desc: Read all the data related to the layout, in this case the fields and groups
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

// **************************************************************************************
// Reset session count 10 secs = 1 Flop
// **************************************************************************************
$_SESSION['site']['flops'] = 0;

// **************************************************************************************
// Database class instance
// **************************************************************************************
$mitos_db = new dbHelper();

// **************************************************************************************
// Verify if a $_GET['id'] has passed to select a facility.
// and execute the apropriate SQL statement
// **************************************************************************************
if(!$_REQUEST['form_id']){
	$sql = "SELECT * FROM layout_options WHERE form_id='Demographics' ORDER BY seq";
} else {
	$sql = "SELECT * FROM layout_options WHERE form_id='". $_REQUEST['form_id'] . "' ORDER BY seq";
}
$mitos_db->setSQL($sql);

//---------------------------------------------------------------------------------------
// catch the total records
//---------------------------------------------------------------------------------------
$total = $mitos_db->rowCount();

$dataTypes = array(
	"1"  => i18n("List box", 'r'), 
	"2"  => i18n("Textbox", 'r'),
	"3"  => i18n("Textarea", 'r'),
	"4"  => i18n("Text-date", 'r'),
	"10" => i18n("Providers", 'r'),
	"11" => i18n("Providers NPI", 'r'),
	"12" => i18n("Pharmacies", 'r'),
	"13" => i18n("Squads", 'r'),
	"14" => i18n("Organizations", 'r'),
	"15" => i18n("Billing codes", 'r'),
	"21" => i18n("Checkbox list", 'r'),
	"22" => i18n("Textbox list", 'r'),
	"23" => i18n("Exam results", 'r'),
	"24" => i18n("Patient allergies", 'r'),
	"25" => i18n("Checkbox w/text", 'r'),
	"26" => i18n("List box w/add", 'r'),
	"27" => i18n("Radio buttons", 'r'),
	"28" => i18n("Lifestyle status", 'r'),
	"31" => i18n("Static Text", 'r'),
	"32" => i18n("Smoking Status", 'r'),
	"33" => i18n("Race and Ethnicity", 'r'),
);

//---------------------------------------------------------------------------------------
// start the array
//---------------------------------------------------------------------------------------
$rows = array();
foreach($mitos_db->execStatement() as $row){
	$row['data_type'] = $dataTypes[ $row['data_type'] ];
	array_push($rows, $row);
}
//---------------------------------------------------------------------------------------
// here we are adding "totals" and the root "row" for sencha use 
//---------------------------------------------------------------------------------------
print_r(json_encode(array('totals'=>$total,'row'=>$rows)));
?>