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

include_once("../../../library/dbHelper/dbHelper.inc.php");
include_once("../../../library/I18n/I18n.inc.php");
require_once("../../../repository/dataExchange/dataExchange.inc.php");
require_once("../../../library/phpAES/AES.class.php");

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;

//------------------------------------------
// Database class instance
//------------------------------------------
$mitos_db = new dbHelper();

// Setting defults incase no request is sent by sencha
$start = ($_REQUEST["start"] == null)? 0 : $_REQUEST["start"];
$count = ($_REQUEST["limit"] == null)? 10 : $_REQUEST["limit"];
$facillity = $_REQUEST["facillity"];
$mitos_db->setSQL("SELECT * 
        			 FROM onotes
        		 ORDER BY date DESC
        			LIMIT ".$start.",".$count);
				//	WHERE onotes.facillity = '$facillity'
$total = $mitos_db->rowCount();
$buff = '';        			
foreach ($mitos_db->execStatement() as $urow) {
  $buff .= '{';
  $buff .= '"id":"' 	. dataEncode($urow['id']).'",';
  $buff .= '"date":"' 	. dataEncode($urow['date']).'",';
  $buff .= '"user":"' 	. dataEncode($urow['user']).'",';
  $buff .= '"body":"' 	. dataEncode($urow['body'] ).'"},'.chr(13);
}
$buff = substr($buff, 0, -2); // Delete the last comma.
echo '{';
echo '"totals": "' . $total . '", ' . chr(13);
echo '"row": [' . chr(13);
echo $buff;
echo ']}' . chr(13);
?>