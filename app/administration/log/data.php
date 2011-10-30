<?php
//--------------------------------------------------------------------------------------------------------------------------
// data_read.ejs.php / Permissions List with values for role
// v0.0.1
// Under GPLv3 License
// Integrated by: Ernesto Rodriguez
// Remember, this file is called via the Framework Store, this is the AJAX thing.
//--------------------------------------------------------------------------------------------------------------------------
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once($_SESSION['site']['root']."/classes/dbHelper.class.php");

$_SESSION['site']['flops'] = 0;

$mitos_db = new dbHelper();

$start = ($_REQUEST["start"] == null)? 0 : $_REQUEST["start"];
$count = ($_REQUEST["limit"] == null)? 30 : $_REQUEST["limit"];

$rows = array();
$mitos_db->setSQL("SELECT id FROM log");
$total = $mitos_db->rowCount();
//******************************************************************
// Lets get the pharmacies and address and order by name
//******************************************************************
$mitos_db->setSQL("SELECT * FROM log ORDER BY id DESC LIMIT ".$start.",".$count);
foreach($mitos_db->execStatement(PDO::FETCH_ASSOC) as $row){
    array_push($rows, $row);
}
print_r(json_encode(array('totals'=>$total,'row'=>$rows)));
?>
