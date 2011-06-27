<?php
/**
 * Created by JetBrains PhpStorm.
 * User: ernesto
 * Date: 6/27/11
 * Time: 3:27 PM
 * To change this template use File | Settings | File Templates.
 */
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once($_SESSION['site']['root']."/classes/dbHelper.class.php");

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;

$mitos_db = new dbHelper();

$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);
$delete_id = $data['id'];

// *************************************************************************************
// Finally build the Delete SQL Statement and inject it to the SQL Database
// *************************************************************************************
$mitos_db->setSQL( "DELETE FROM calendar_events WHERE id='" . $delete_id . "'");
$ret = $mitos_db->execLog();

if ( $ret == "" ){
	echo '{ success: false, errors: { reason: "'. $ret[2] .'" }}';
} else {
	echo "{ success: true }";
}
?>
