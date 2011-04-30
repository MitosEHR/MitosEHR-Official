<?php
//---------------------------------------------------------------------------------------
// data_read.ejs.php / Global form values
// v0.0.1
// Under GPLv3 License
// Integrated by: Ernesto Rodriguez
// Remember, this file is called via the Framework Store, this is the AJAX thing.
//---------------------------------------------------------------------------------------
session_name ( "MitosEHR" );
session_start();
include_once("../../../library/dbHelper/dbHelper.inc.php");
include_once("../../../library/I18n/I18n.inc.php");
require_once("../../../repository/dataExchange/dataExchange.inc.php");

//--------------------------------------------------------------------------------------
// Database class instance
//--------------------------------------------------------------------------------------
$mitos_db = new dbHelper();
//--------------------------------------------------------------------------------------
// JSON will be printed as one record, so there is no need to count all sql record
//--------------------------------------------------------------------------------------
$count = 1;
$buff = "";

// *************************************************************************************
// SQL query for all Global form values
// *************************************************************************************
$mitos_db->setSQL("SELECT gl_name, gl_index, gl_value FROM globals");
$total = $mitos_db->rowCount();
foreach ($mitos_db->execStatement() as $urow) {
	$buff .= '"'.$urow['gl_name'].'":"'.$urow['gl_value'].'",'.chr(13);
}
$buff = substr($buff, 0, -2); // Delete the last comma.
echo '{';
echo '"totals":"'.$count.'",'.chr(13);
echo '"row":[{'.chr(13);
echo '"data_id":"1",'.chr(13);
echo $buff;
echo '}]}'.chr(13);
?>
