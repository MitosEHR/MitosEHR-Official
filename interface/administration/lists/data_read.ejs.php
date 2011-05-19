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
	
$lang_id = empty($_SESSION['language_choice']) ? '1' : $_SESSION['language_choice'];
if (($lang_id == '1' && !empty($GLOBALS['skip_english_translation'])) || !$GLOBALS['translate_lists']) {
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
$total = $mitos_db->rowCount();
$buff = "";
foreach ($mitos_db->execStatement() as $urow) {
	$buff .= '{';
	$buff .= '"id":"' 			. $urow['id'].'",';
	$buff .= '"list_id":"' 		. dataEncode($urow['list_id']).'",';
	$buff .= '"option_id":"' 	. dataEncode($urow['option_id']).'",';
	$buff .= '"title":"'		. dataEncode($urow['title']).'",';
	$buff .= '"seq":"'			. dataEncode($urow['seq']).'",';
	$buff .= '"is_default":"'	. dataEncode($urow['is_default']).'",';
	$buff .= '"option_value":"' . dataEncode($urow['option_value']).'",';
	$buff .= '"mapping":"' 		. dataEncode($urow['mapping']).'",';
	$buff .= '"notes": "'		. dataEncode($urow['notes']).'"},' . chr(13);
}

$buff = substr($buff, 0, -2); // Delete the last comma.
echo '{';
echo '"totals": "' . $total . '", ' . chr(13);
echo '"row": [' . chr(13);
echo $buff;
echo ']}' . chr(13);
?>