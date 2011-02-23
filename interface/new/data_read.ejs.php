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

include_once("library/adoHelper/adoHelper.inc.php");
include_once("library/I18n/I18n.inc.php");
require_once("repository/dataExchange/dataExchange.inc.php");

require_once("$srcdir/pnotes.inc.php");
require_once("$srcdir/patient.inc.php");
require_once("$srcdir/acl.inc.php");
require_once("$srcdir/log.inc.php");
require_once("$srcdir/options.inc.php");
require_once("$srcdir/formdata.inc.php");
require_once("$srcdir/classes/Document.class.php");
require_once("$srcdir/gprelations.inc.php");
require_once("$srcdir/formatting.inc.php");

// Count records variable
$count = 0;

$sql = "SELECT
			pnotes.id,
			pnotes.user,
			pnotes.pid,
			pnotes.title,
			pnotes.date,
			pnotes.body,
			pnotes.message_status,
			users.fname AS users_fname,
			users.lname AS users_lname,
			patient_data.fname AS patient_data_fname,
			patient_data.lname AS patient_data_lname
		FROM
			((pnotes JOIN users ON pnotes.user = users.username) JOIN patient_data ON pnotes.pid = patient_data.pid)
        WHERE
			pnotes.message_status != 'Done' AND
			pnotes.deleted != '1' AND
			pnotes.assigned_to LIKE ?";
$result = sqlStatement($sql, array($_GET['show']) );

while ($myrow = sqlFetchArray($result)) {
	$count++;
	$name = $myrow['user'];
	$name = $myrow['users_lname'];
	$p_body = str_replace(chr(10), "<br>", $myrow['body'] );
	if ($myrow['users_fname']) { $name .= ", " . $myrow['users_fname']; }
	$patient = $myrow['pid'];
	$patient = $myrow['patient_data_lname'];
	if ($myrow['patient_data_fname']) { $patient .= ", " . $myrow['patient_data_fname']; }
	// build the message
	$buff .= "{";
	$buff .= " noteid: '" . htmlspecialchars( $myrow['id'], ENT_QUOTES) . "',";
	$buff .= " user: '" . htmlspecialchars( $myrow['user'], ENT_QUOTES) . "',";
	$buff .= " body: '" . $p_body . "',";
	$buff .= " from: '" . htmlspecialchars( $name, ENT_NOQUOTES) . "'," ;
	$buff .= " patient: '" . htmlspecialchars( $patient, ENT_NOQUOTES) . "',";
	$buff .= " type: '" . htmlspecialchars( $myrow['title'], ENT_NOQUOTES) . "',";
	$buff .= " date: '" . htmlspecialchars( oeFormatShortDate(substr($myrow['date'], 0, strpos($myrow['date'], " "))), ENT_NOQUOTES) . "',";
	$buff .= " status: '" . htmlspecialchars( $myrow['message_status'], ENT_NOQUOTES) . "'}," . chr(13);
}

$buff = substr($buff, 0, -2); // Delete the last comma.
echo $_GET['callback'] . '({';
echo "results: " . $count . ", " . chr(13);
echo "row: [" . chr(13);
echo $buff;
echo "]})" . chr(13);


?>