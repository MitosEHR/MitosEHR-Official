<?php
//--------------------------------------------------------------------------------------------------------------------------
// data_read.ejs.php / List Options
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

// Setting defults incase no request is sent by sencha
$start = ($_REQUEST["start"] == null)? 0 : $_REQUEST["start"];
$count = ($_REQUEST["limit"] == null)? 10 : $_REQUEST["limit"];

// *************************************************************************************
// Get the $_GET['list_id'] 
// and execute the apropriate SQL statement
// *************************************************************************************
$currList = $_REQUEST["list_id"];

if ($_SESSION['lang']['code'] == "en_US") { // If the selected language is English, do not translate
	$mitos_db->setSQL("SELECT 
				*
			FROM 
				list_options 
			WHERE 
				list_id = '$currList' 
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
				LEFT JOIN lang_definitions AS ld ON ld.cons_id = lc.cons_id AND ld.lang_id = '$lang_id' 
			WHERE 
				lo.list_id = '$currList' 
			ORDER BY 
				IF(LENGTH(ld.definition),ld.definition,lo.title), lo.seq");
}

//---------------------------------------------------------------------------------------
// catch the total records
//---------------------------------------------------------------------------------------
$total = $mitos_db->rowCount();

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
print_r(json_encode(array('totals'=>$total,'row'=>$rows)));

?>