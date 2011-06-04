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
require_once("../../../repository/dataExchange/dataExchange.inc.php");

// **************************************************************************************
// Reset session count 10 secs = 1 Flop
// **************************************************************************************
$_SESSION['site']['flops'] = 0;

// **************************************************************************************
// Database class instance
// **************************************************************************************
$mitos_db = new dbHelper();

// **************************************************************************************
// catch the total records
// **************************************************************************************
if(!$_REQUEST['form_id']){
	$sql = "SELECT count(*) as total FROM layout_options WHERE form_id='Demographics'";
} else {
	$sql = "SELECT count(*) as total FROM layout_options WHERE form_id='". $_REQUEST['form_id'] . "'";
}
$mitos_db->setSQL($sql);
$urow = $mitos_db->execStatement();
$total = $urow[0]['total'];

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
foreach ($mitos_db->execStatement() as $urow) {
	$buff .= "{";
	$buff .= " item_id: '" 			. dataEncode( $urow['item_id'] ) . "',";
	$buff .= " form_id: '" 			. dataEncode( $urow['form_id'] ) . "',";
	$buff .= " field_id: '" 		. dataEncode( $urow['field_id'] ) . "',";
	$buff .= " group_name: '" 		. dataEncode( $urow['group_name'] ) . "',";
	$buff .= " title: '" 			. dataEncode( $urow['title'] ) . "'," ;
	$buff .= " seq: '" 				. dataEncode( $urow['seq'] ) . "',";
	$buff .= " data_type: '" 		. dataEncode( $urow['data_type'] ) . "',";
	$buff .= " uor: '" 				. dataEncode( $urow['uor'] ) . "',";
	$buff .= " fld_length: '" 		. dataEncode( $urow['fld_length'] ) . "',";
	$buff .= " max_length: '" 		. dataEncode( $urow['max_length'] ) . "',";
	$buff .= " list_id: '" 			. dataEncode( $urow['list_id'] ) . "',";
	$buff .= " titlecols: '" 		. dataEncode( $urow['titlecols'] ) . "',";
	$buff .= " datacols: '" 		. dataEncode( $urow['datacols'] ) . "',";
	$buff .= " default_value: '" 	. dataEncode( $urow['default_value'] ) . "',";
	$buff .= " edit_options: '" 	. dataEncode( $urow['edit_options'] ) . "',";
	$buff .= " description: '" 		. dataEncode( $urow['description'] ) . "',";
	$buff .= " group_order: '" 		. dataEncode( $urow['group_order'] ) . "'}," . chr(13);
}

$buff = substr($buff, 0, -2); // Delete the last comma.
echo $_GET['callback'] . '({';
echo "totals: " . $total . ", " . chr(13);
echo "row: [" . chr(13);
echo $buff;
echo "]})" . chr(13);


?>