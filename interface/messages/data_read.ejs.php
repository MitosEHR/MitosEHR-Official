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
ini_set('display_errors', 'On'); // debug info
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once("../../library/dbHelper/dbHelper.inc.php");
include_once("../../library/I18n/I18n.inc.php");
require_once("../../repository/dataExchange/dataExchange.inc.php");

//------------------------------------------
// Database class instance
//------------------------------------------
$mitos_db = new dbHelper();

// OpenEMR
//require_once("../../library/pnotes.inc.php");
//require_once("../../library/patient.inc.php");
//require_once("../../library/acl.inc.php");
//require_once("../../library/log.inc.php");
//require_once("../../library/options.inc.php");
//require_once("../../library/formdata.inc.php");
//require_once("../../library/classes/Document.class.php");
//require_once("../../library/gprelations.inc.php");
//require_once("../../library/formatting.inc.php");

// Setting defults incase no request is sent by sencha
$start = ($_REQUEST["start"] == null)? 0 : $_REQUEST["start"];
$count = ($_REQUEST["limit"] == null)? 10 : $_REQUEST["limit"];

$sql = "SELECT
			pnotes.id,
			pnotes.user,
			pnotes.pid,
			pnotes.title,
			pnotes.date,
			pnotes.body,
			pnotes.subject,
			pnotes.message_status,
			pnotes.reply_id,
			users.fname AS users_fname,
			users.lname AS users_lname,
			patient_data.fname AS patient_data_fname,
			patient_data.lname AS patient_data_lname
		FROM
			((pnotes JOIN users ON pnotes.user = users.username) JOIN patient_data ON pnotes.pid = patient_data.pid)
        WHERE
			pnotes.message_status != 'Done' AND
			pnotes.deleted != '1'
		LIMIT ".$start.",".$count;
		// AND pnotes.assigned_to LIKE ?  <-----   need to fix this
		
$mitos_db->setSQL($sql);
$total = $mitos_db->rowCount();
		
foreach ($mitos_db->execStatement() as $myrow) {
	$name = dataEncode( $myrow['user'] );
	$name = dataEncode( $myrow['users_lname'] );
	$p_body = str_replace(chr(10), '<br>', dataEncode( $myrow['body'] ));
	
	if ($myrow['users_fname']) {
		$name .= ', ' . dataEncode( $myrow['users_fname'] ); 
	}
	
	$patient = dataEncode( $myrow['pid'] );
	$patient = dataEncode( $myrow['patient_data_lname'] );
	if ($myrow['patient_data_fname']) {
		$patient .= ', ' . dataEncode( $myrow['patient_data_fname'] ); 
	}
	
	// build the message
	$buff .= '{';
	$buff .= ' "noteid: "' . dataEncode( $myrow['id'] ) . '",';
	$buff .= ' "user: "' . dataEncode( $myrow['user'] ) . '",';
	$buff .= ' "subject: "' . dataEncode( $myrow['subject'] ) . '",';
	$buff .= ' "body: "' . $p_body . '",';
	$buff .= ' "from: "' . dataEncode( $name ) . '",' ;
	$buff .= ' "patient: "' . dataEncode( $patient ) . '",';
	$buff .= ' "date: "' . oeFormatShortDate(substr($myrow['date'], 0, strpos($myrow['date'], ' '))) . '",';
	$buff .= ' "reply_id: "' . dataEncode( $myrow['reply_id'] ) . '",';
	$buff .= ' "status: "' . dataEncode( $myrow['message_status'] ) . '"},' . chr(13);
}

$buff = substr($buff, 0, -2); // Delete the last comma.
echo '{';
echo '"totals": ' . $total . ', ' . chr(13);
echo '"row": [' . chr(13);
echo $buff;
echo ']}' . chr(13);
?>