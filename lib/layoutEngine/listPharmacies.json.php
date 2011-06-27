<?php
//--------------------------------------------------------------------------------------------------------------------------
// listPharmacies.json.php
// 
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

include_once($_SESSION['site']['root']."/classes/dbHelper.class.php");

// **************************************************************************************
// Reset session count 10 secs = 1 Flop
// **************************************************************************************
$_SESSION['site']['flops'] = 0;

// **************************************************************************************
// Database class instance
// **************************************************************************************
$mitos_db = new dbHelper();
$mitos_db->setSQL("SELECT * FROM pharmacies");

$total = $mitos_db->rowCount();
$rows = array();
foreach ($mitos_db->execStatement(PDO::FETCH_ASSOC) as $row) {
	array_push($rows, $row);
}
print(json_encode(array('totals'=>$total,'row'=>$rows)));
?>