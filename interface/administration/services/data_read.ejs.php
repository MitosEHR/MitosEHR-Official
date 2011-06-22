<?php
//--------------------------------------------------------------------------------------------------------------------------
// manage_messages.ejs.php
// v0.0.1
// Under GPLv3 License
//
// Integrated by: Ernesto Rodriguez. in 2011
//
// Remember, this file is called via the Framework Store, this is the AJAX thing.
//--------------------------------------------------------------------------------------------------------------------------

session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');
include_once($_SESSION['site']['root']."/library/dbHelper/dbHelper.inc.php");
require_once($_SESSION['site']['root']."/library/phpAES/AES.class.php");

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;

//------------------------------------------
// Database class instance
//------------------------------------------
$mitos_db = new dbHelper();

$where = "";
if ($filter) {
  $where .= " AND code_type = '$filter'";
}
if (!empty($search)) {
  $where .= " AND code LIKE '" . ffescape($search) . "%'";
}


// Setting defults incase no request is sent by sencha
$start = ($_REQUEST["start"] == null)? 0 : $_REQUEST["start"];
$limit = ($_REQUEST["limit"] == null)? 10 : $_REQUEST["limit"];

$mitos_db->setSQL("SELECT * FROM codes $WHERE ORDER BY code_type, code, code_text");
$total = $mitos_db->rowCount();
$mitos_db->setSQL("SELECT * FROM codes $WHERE ORDER BY code_type, code, code_text LIMIT $start,$limit");
$rows = array();
foreach($mitos_db->execStatement() as $row){
	array_push($rows, $row);
}
//------------------------------------------------------------------------------
// here we are adding "totals" and the root "row" for sencha use 
//------------------------------------------------------------------------------
print_r(json_encode(array('totals'=>$total,'row'=>$rows)));
?>