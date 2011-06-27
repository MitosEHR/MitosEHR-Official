<?php
//--------------------------------------------------------------------------------------------------------------------------
// manage_messages.ejs.php
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
include_once($_SESSION['site']['root']."/classes/I18n.class.php");
require_once($_SESSION['site']['root']."/classes/dataExchange.class.php");

// **************************************************************************************
// Reset session count 10 secs = 1 Flop
// **************************************************************************************
$_SESSION['site']['flops'] = 0;

// **************************************************************************************
// Database class instance
// **************************************************************************************
$mitos_db = new dbHelper();

// **************************************************************************************
// Setting defults incase no request is sent by sencha
// **************************************************************************************
$start = ($_REQUEST["start"] == null)? 0 : $_REQUEST["start"];
$limit = ($_REQUEST["limit"] == null)? 30 : $_REQUEST["limit"];

// **************************************************************************************
// Verify if a $_GET['id'] has passed to select a facility.
// and execute the apropriate SQL statement
// **************************************************************************************
if ($_GET['id']){
	$sql = "SELECT * 
			  FROM facility
		  ORDER BY name
			 WHERE id=" . $_GET['id'] . "
			 LIMIT " . $start . "," . $limit;
} else { // if not select all of them
	$sql = "SELECT * 
			  FROM facility
		  ORDER BY name
			 LIMIT " . $start . "," . $limit;
}
$mitos_db->setSQL($sql);

//---------------------------------------------------------------------------------------
// catch the total records
//---------------------------------------------------------------------------------------
$total = $mitos_db->rowCount();

//---------------------------------------------------------------------------------------
// start the array
//---------------------------------------------------------------------------------------
$rows = array();
foreach($mitos_db->execStatement(PDO::FETCH_ASSOC) as $row){
	$row['service_location'] = ($row['service_location'] == '1' ? 'on' : 'off');
	$row['billing_location'] = ($row['billing_location'] == '1' ? 'on' : 'off');
	$row['accepts_assignment'] = ($row['accepts_assignment'] == '1' ? 'on' : 'off');
	if (strlen($row['pos_code']) <= 1){
		$row['pos_code'] = '0'.$row['pos_code'];
	} else {
		$row['pos_code'] = $row['pos_code'];
	}
	array_push($rows, $row);
}
//---------------------------------------------------------------------------------------
// here we are adding "totals" and the root "row" for sencha use 
//---------------------------------------------------------------------------------------
print_r(json_encode(array('totals'=>$total,'row'=>$rows)));

?>