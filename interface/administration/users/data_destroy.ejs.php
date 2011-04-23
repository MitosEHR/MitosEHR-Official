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

include_once("../../../library/dbHelper/dbHelper.inc.php");
include_once("../../../library/I18n/I18n.inc.php");
require_once("../../../repository/dataExchange/dataExchange.inc.php");

// Count records variable
$count = 0;
$mitos_db = new dbHelper();

// *************************************************************************************
// Flag the message to delete
// *************************************************************************************

$data = json_decode ( $_POST['row'], true );
$delete_id = $data['id'];

// *************************************************************************************
// Finally build the Delete SQL Statement and inject it to the SQL Database
// *************************************************************************************
$mitos_db->setSQL( "DELETE FROM users WHERE id='" . $delete_id . "'");
$ret = $mitos_db->execOnly();

if ( $ret == "" ){
	echo '{ success: false, errors: { reason: "'. $ret[2] .'" }}';
} else {
	echo "{ success: true }";
}

?>