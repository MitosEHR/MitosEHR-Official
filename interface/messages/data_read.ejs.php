<?php
//--------------------------------------------------------------------------------------------------------------------------
// manage_messages.ejs.php
// v0.0.1
// Under GPLv3 License
//
// Integration Sencha ExtJS Framework
//
// Integrated by: IdeasGroup Inc. in 2010
//
// OpenEMR is a free medical practice management, electronic medical records, prescription writing,
// and medical billing application. These programs are also referred to as electronic health records.
// OpenEMR is licensed under the General Gnu Public License (General GPL). It is a free open source replacement
// for medical applications such as Medical Manager, Health Pro, and Misys. It features support for EDI billing
// to clearing houses such as Availity, MD-Online, MedAvant and ZirMED using ANSI X12.
//
// Sencha ExtJS
// Ext JS is a cross-browser JavaScript library for building rich internet applications. Build rich,
// sustainable web applications faster than ever. It includes:
// * High performance, customizable UI widgets
// * Well designed and extensible Component model
// * An intuitive, easy to use API
// * Commercial and Open Source licenses available
//
// Remember, this file is called via the Framework Store, this is the AJAX thing.
//--------------------------------------------------------------------------------------------------------------------------

// *************************************************************************************
//SANITIZE ALL ESCAPES
// *************************************************************************************
$sanitize_all_escapes=true;

// *************************************************************************************
//STOP FAKE REGISTER GLOBALS
// *************************************************************************************
$fake_register_globals=false;

// *************************************************************************************
// Load the OpenEMR Libraries
// *************************************************************************************
require_once("../registry.php");
require_once("../../repository/dataExchange/dataExchange.inc.php");

// OpenEMR
require_once("../../library/pnotes.inc.php");
require_once("../../library/patient.inc.php");
require_once("../../library/acl.inc.php");
require_once("../../library/log.inc.php");
require_once("../../library/options.inc.php");
require_once("../../library/formdata.inc.php");
require_once("../../library/classes/Document.class.php");
require_once("../../library/gprelations.inc.php");
require_once("../../library/formatting.inc.php");



// Count records variable
$count = 0;

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
			pnotes.deleted != '1' AND
			pnotes.assigned_to LIKE ?";
$result = sqlStatement($sql, array($_GET['show']) );

while ($myrow = sqlFetchArray($result)) {
	$count++;
	$name = dataEncode( $myrow['user'] );
	$name = dataEncode( $myrow['users_lname'] );
	$p_body = str_replace(chr(10), "<br>", dataEncode( $myrow['body'] ));
	if ($myrow['users_fname']) { $name .= ", " . dataEncode( $myrow['users_fname'] ); }
	$patient = dataEncode( $myrow['pid'] );
	$patient = dataEncode( $myrow['patient_data_lname'] );
	if ($myrow['patient_data_fname']) { $patient .= ", " . dataEncode( $myrow['patient_data_fname'] ); }
	// build the message
	$buff .= "{";
	$buff .= " noteid: '" . dataEncode( $myrow['id'] ) . "',";
	$buff .= " user: '" . dataEncode( $myrow['user'] ) . "',";
	$buff .= " subject: '" . dataEncode( $myrow['subject'] ) . "',";
	$buff .= " body: '" . $p_body . "',";
	$buff .= " from: '" . dataEncode( $name ) . "'," ;
	$buff .= " patient: '" . dataEncode( $patient ) . "',";
	$buff .= " date: '" . oeFormatShortDate(substr($myrow['date'], 0, strpos($myrow['date'], " "))) . "',";
	$buff .= " reply_id: '" . dataEncode( $myrow['reply_id'] ) . "',";
	$buff .= " status: '" . dataEncode( $myrow['message_status'] ) . "'}," . chr(13);
}

$buff = substr($buff, 0, -2); // Delete the last comma.
echo $_GET['callback'] . '({';
echo "results: " . $count . ", " . chr(13);
echo "row: [" . chr(13);
echo $buff;
echo "]})" . chr(13);


?>