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

include_once("../../../classes/dbHelper.php");
include_once("../../../classes/I18n.class.php");
require_once("../../../classes/dataExchange.class.php");

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;

// Count records variable
$count = 0;
$mitos_db = new dbHelper();

// *************************************************************************************
// Flag the message to delete
// *************************************************************************************

$data = json_decode ( $_POST['row'] );
$delete_id = $data[0]->id;

// *************************************************************************************
// Finally build the Delete SQL Statement and inject it to the SQL Database
// *************************************************************************************
$sql = "DELETE FROM facility WHERE id='" . $delete_id . "'";

$mitos_db->setSQL($sql);
$ret = $mitos_db->execOnly();

if ( $ret == "" ){
	echo '{ success: false, errors: { reason: "'. $ret[2] .'" }}';
} else {
	echo "{ success: true }";
}

?>