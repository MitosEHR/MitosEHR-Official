<?php
//---------------------------------------------------------------------------------------
// data_read.ejs.php / Global form values
// v0.0.1
// Under GPLv3 License
//
// Integrated by: Ernesto Rodriguez in 2011
//
// Remember, this file is called via the Framework Store, this is the AJAX thing.
//---------------------------------------------------------------------------------------

session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once($_SESSION['site']['root']."/classes/dbHelper.class.php");

// *************************************************************************************
// Reset session count 10 secs = 1 Flop
// *************************************************************************************
$_SESSION['site']['flops'] = 0;

//--------------------------------------------------------------------------------------
// Database class instance
//--------------------------------------------------------------------------------------
$mitos_db = new dbHelper();

// *************************************************************************************
// SQL query for all Global form values
// *************************************************************************************
$mitos_db->setSQL("SELECT gl_name, gl_index, gl_value FROM globals");

// *************************************************************************************
// $rows = $mitos_db->execStatement(PDO::FETCH_ASSOC) because we wwant to print all recods into one row
// *************************************************************************************
$count = 0;
$rows = array();
foreach($mitos_db->execStatement(PDO::FETCH_ASSOC) as $row){
	$rows['data_id'] = '1';
	$rows[$row[0]] = $row[2];
}
print_r(json_encode(array('totals'=>'1','row'=>$rows)));
?>
