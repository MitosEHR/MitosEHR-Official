<?php
//--------------------------------------------------------------------------------------------------------------------------
// data_read.ejs.php
// v0.0.1
// Under GPLv3 License
//
// Integrated by: Ernesto Rodriguez. in 2011
//
// Remember, this file is called via the Framework Store, this is the AJAX thing.
//--------------------------------------------------------------------------------------------------------------------------

session_name ( "Passport" );
session_start();
session_cache_limiter('private');

include_once("../../../../library/dbHelper/dbHelper.inc.php");
include_once("../../../../library/I18n/I18n.inc.php");
require_once("../../../../repository/dataExchange/dataExchange.inc.php");

$passport_db 	= new dbHelper();

$sql = "SELECT count(*) as pending FROM x12_837 WHERE transfered = '0'";
$passport_db->setSQL($sql);
$urow = $passport_db->execStatement();
$p = $urow[0]['pending'];

$sql = "SELECT count(*) as transfered FROM x12_837 WHERE transfered = '1'";
$passport_db->setSQL($sql);
$urow = $passport_db->execStatement();
$t = $urow[0]['transfered']; 
	
$buff = "{";
$buff .= " id: '0',";
$buff .= " action: '" . i18n('Pending transaction to send', 'r') . "',";
$buff .= " trans: '" 	. $p . "'},";

$buff .= "{";
$buff .= " id: '1',";
$buff .= " action: '" . i18n('Transfered trasaction to payer', 'r') . "',";
$buff .= " trans: '" 	. $t . "'},";

// *************************************************************************************
// Return the results to ExtJS v4
// *************************************************************************************
if ( $passport_db == "" ){
	echo '{ success: false, errors: { reason: "'. $passport_db[2] .'" }}';
	die();
}

$buff = substr($buff, 0, -1); // Delete the last comma.
echo '({';
echo "totals: 2, " . chr(13);
echo "row: [" . chr(13);
echo $buff;
echo "]})" . chr(13);
?>