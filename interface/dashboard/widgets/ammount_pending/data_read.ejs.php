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
include_once("../../../../library/x12_manager/x12_parser.inc.php");

$passport_db 	= new dbHelper();
$x12			= new x12parse_837_4010();

$sql = "SELECT * FROM x12_837 WHERE transfered = '0'";
$passport_db->setSQL($sql);

$buff="";
$count=0;

foreach ($passport_db->execStatement() as $urow) {
	$claims = unserialize( trim($urow['x12_array']) );
	$x12->setX12($urow['x12_storage']);
	$payer = $x12->getReceiver();
	$money = 0;
	foreach($claims as $value){
		if($value['CLM_AMOUNT']){ $money = $money + $value['CLM_AMOUNT']; }
	}
	$buff .= "{";
	$buff .= " id_x12: '"		. $count ."',";
	$buff .= " file: '"			. $urow['x12_filename'] ."',";
	$buff .= " payer: '" 		. $payer['NM140_SUBNAME'] . "',";
	$buff .= " ammount: '$" 	. number_format($money, 2) . "'},";
	$count++;	
}

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