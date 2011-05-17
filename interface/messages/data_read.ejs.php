<?php
//--------------------------------------------------------------------------------------------------------------------------
// manage_messages.ejs.php
// v0.0.1
// Under GPLv3 License
//
// Integrated by: IdeasGroup Inc. in 2010
//
// Remember, this file is called via the Framework Store, this is the AJAX thing.
//--------------------------------------------------------------------------------------------------------------------------
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;

include_once($_SESSION['site']['root']."/library/dbHelper/dbHelper.inc.php");
include_once($_SESSION['site']['root']."/library/I18n/I18n.inc.php");
require_once($_SESSION['site']['root']."/repository/dataExchange/dataExchange.inc.php");

//------------------------------------------
// Database class instance
//------------------------------------------
$mitos_db = new dbHelper();

// catch the total records
$sql = "SELECT count(*) as total FROM
			((pnotes JOIN users ON pnotes.user = users.username) JOIN patient_data ON pnotes.pid = patient_data.pid)
        WHERE
			pnotes.message_status != 'Done' AND
			pnotes.deleted != '1'";
$mitos_db->setSQL($sql);
$urow = $mitos_db->execStatement();
$total = $urow[0]['total'];

// Setting defults incase no request is sent by sencha
$start = (!$_REQUEST["start"])? 0 : $_REQUEST["start"];
$count = (!$_REQUEST["limit"])? 10 : $_REQUEST["limit"];

$sql = "SELECT
			*
		FROM
  			pnotes
		LEFT OUTER JOIN 
			patient_data
		ON 
			pnotes.pid = patient_data.id
        WHERE
			pnotes.deleted = '0'
		ORDER BY
  			pnotes.date
		LIMIT ".$start.",".$count;

$mitos_db->setSQL($sql);
foreach ($mitos_db->execStatement() as $myrow) {
	$name = dataEncode( $myrow['user'] );
	$name = dataEncode( $myrow['users_lname'] );
	$p_body = str_replace(chr(10), '<br>', dataEncode( $myrow['body'] ));
	
	if ($myrow['fname']) {
		$patient = dataEncode( $myrow['fname'] ) . ', ' . dataEncode( $myrow['lname'] ); 
	} else {
		$patient = dataEncode( $myrow['fname'] );
	}
	
	// build the message
	$buff .= '{';
	$buff .= ' "id: "'				. dataEncode( $myrow['id'] ) . '",';
	$buff .= ' "date: "'			. dataEncode( $myrow['date'] ) . '",';
	$buff .= ' "body: "'			. dataEncode( $myrow['body'] ) . '",';
	$buff .= ' "pid: "'				. dataEncode( $myrow['pid'] ) . '",';
	$buff .= ' "patient: "'			. $patient . '",';
	$buff .= ' "user_id: "'			. dataEncode( $myrow['user_id'] ) . '",' ;
	$buff .= ' "facility_id: "'		. dataEncode( $myrow['facility_id'] ) . '",';
	$buff .= ' "activity: "'		. dataEncode( $myrow['activity'] ) . '",';
	$buff .= ' "authorized: "'		. dataEncode( $myrow['authorized'] ) . '",';
	$buff .= ' "message_status: "'	. dataEncode( $myrow['message_status'] ) . '",';
	$buff .= ' "reply_id: "'		. dataEncode( $myrow['reply_id'] ) . '",';
	$buff .= ' "note_type: "'		. dataEncode( $myrow['note_type'] ) . '",';
	$buff .= ' "assigned_to: "'		. dataEncode( $myrow['assigned_to'] ) . '"},' . chr(13);
}

$buff = substr($buff, 0, -2); // Delete the last comma.
echo '{';
echo '"totals": ' . $total . ', ' . chr(13);
echo '"row": [' . chr(13);
echo $buff;
echo ']}' . chr(13);
?>