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
require_once("../../globals.php");
require_once("$srcdir/pnotes.inc");
require_once("$srcdir/patient.inc");
require_once("$srcdir/acl.inc");
require_once("$srcdir/log.inc");
require_once("$srcdir/options.inc.php");
require_once("$srcdir/formdata.inc.php");
require_once("$srcdir/classes/Document.class.php");
require_once("$srcdir/gprelations.inc.php");
require_once("$srcdir/formatting.inc.php");

// Count records variable
$count = 0;

// *************************************************************************************
// Deside what to do with the $_GET['task']
// *************************************************************************************
switch ($_GET['task']) {

	// *************************************************************************************
	// Pull users from the database
	// *************************************************************************************
	case "users":
		$sql = sqlStatement("SELECT
							 	username,
								fname,
								lname
							FROM
								users
							WHERE
								username != '' AND active = 1 AND ( info IS NULL OR info NOT LIKE '%Inactive%' )
							ORDER BY
								lname,
								fname");
		while ($urow = sqlFetchArray($sql)) {
			$count++;
			// Merge firstname with lastname
			if ($urow['fname']){
				$username = htmlspecialchars( $urow['fname'], ENT_NOQUOTES);
			} else {
				$username = htmlspecialchars( $urow['fname'], ENT_NOQUOTES) . ", " . htmlspecialchars( $urow['lname'], ENT_NOQUOTES);
			}
			$buff .= " { user: '" . htmlspecialchars( $urow['username'], ENT_NOQUOTES) . "', full_name: '" . $username . "' },". chr(13);
		}
		$buff = substr($buff, 0, -2); // Delete the last comma and clear the buff.
		echo $_GET['callback'] . '({';
		echo "results: " . $count . ", " . chr(13);
		echo "row: [" . chr(13);
		echo $buff;
		echo "]})" . chr(13);
	break;


	// *************************************************************************************
	// Data for for cmb_Type
	// *************************************************************************************
	case "types":
		$sql = "SELECT
					*
				FROM
					list_options
				WHERE
					list_id = 'note_type'
				ORDER BY
					seq, title";
		$result = sqlStatement($sql);
		while($row = sqlFetchArray($result)){
			$count++;
			$buff .= " { option_id: '" . htmlspecialchars( $row{'option_id'}, ENT_QUOTES) . "', title: '" . htmlspecialchars( $row{'title'}, ENT_NOQUOTES) . "' },". chr(13);
		}
		$buff = substr($buff, 0, -2); // Delete the last comma and clear the buff.
		echo $_GET['callback'] . '({';
		echo "results: " . $count . ", " . chr(13);
		echo "row: [" . chr(13);
		echo $buff;
		echo "]})" . chr(13);
	break;


	// *************************************************************************************
	// Pull Status from the database
	// *************************************************************************************
	case "status";
		$sql = "SELECT
					*
				FROM
					list_options
				WHERE
					list_id = 'message_status'
				ORDER BY
					seq, title";
		$result = sqlStatement($sql);
		while($row = sqlFetchArray($result)){
			$count++;
			$buff .= "{ option_id: '" . htmlspecialchars( $row{'option_id'}, ENT_QUOTES) . "', title: '" . htmlspecialchars( $row{'title'}, ENT_NOQUOTES) . "' },". chr(13);
		}
		$buff = substr($buff, 0, -2); // Delete the last comma and clear the buff.
		echo $_GET['callback'] . '({';
		echo "results: " . $count . ", " . chr(13);
		echo "row: [" . chr(13);
		echo $buff;
		echo "]})" . chr(13);
	break;


	// *************************************************************************************
	// Pull the patients from the database
	// *************************************************************************************
	case "patients";
		$sql = "SELECT
					*
				FROM
					patient_data
				ORDER BY
					lname ASC, fname ASC";
		$result = sqlStatement($sql);
		while ($row = sqlFetchArray($result)) {
			$count++;
			$buff .= "{ id: '" . htmlspecialchars( $row['id'], ENT_QUOTES) . "',";
			$buff .= " name: '" . htmlspecialchars( $row['fname'], ENT_QUOTES) . ", " . htmlspecialchars( $row['lname'], ENT_QUOTES)  . "',";
			$buff .= " phone: '" . htmlspecialchars( "Contact: ".$row['phone_contact']." | Home: " . $row['phone_home']." | Cell: ".$row['phone_cell']." | Work: ".$row['phone_biz'], ENT_QUOTES) . "',";
			$buff .= " ss: '" . htmlspecialchars( $row['ss'], ENT_QUOTES) . "',";
			$buff .= " dob: '" . htmlspecialchars( $row['DOB'], ENT_QUOTES) . "',";
			$buff .= " pid: '" . htmlspecialchars( $row['pid'], ENT_QUOTES) . "'},".chr(13);
		}
		$buff = substr($buff, 0, -2); // Delete the last comma and clear the buff.
		echo $_GET['callback'] . '({';
		echo "results: " . $count . ", " . chr(13);
		echo "row: [" . chr(13);
		echo $buff;
		echo "]})" . chr(13);
	break;


	// *************************************************************************************
	// Pull the messages from the database
	// *************************************************************************************
	case "messages";
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
			if ($myrow['patient_data_fname']) {
				$patient .= ", " . $myrow['patient_data_fname'];
			}
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
	break;

	// *************************************************************************************
	// Add a new message for a specific patient; the message is documented in Patient Notes.
	// Add a new message; it's treated as a new note in Patient Notes.
	// *************************************************************************************
	case "create":
		// Current structure of the record ExtJS Mappings
		// informational only
		//
		// {name: 'noteid', type: 'int', mapping: 'noteid'},
		// {name: 'user', type: 'string', mapping: 'user'},
		// {name: 'body', type: 'string', mapping: 'body'},
		// {name: 'from', type: 'string', mapping: 'from'},
		// {name: 'patient', type: 'string', mapping: 'patient'},
		// {name: 'type', type: 'string', mapping: 'type'},
		// {name: 'date', type: 'string', mapping: 'date'},
		// {name: 'status', type: 'string', mapping: 'status'}
		// {name: 'reply_to', type: 'int', mapping: 'reply_to'}
		//
		// Parce the data generated by EXTJS witch is JSON
		$data = json_decode ( $_POST['row'] );

		if ($noteid) {
			updatePnote($data[0]->noteid, // Internal OpenEMR Function
						$data[0]->body,
						$data[0]->type,
						$data[0]->user,
						$data[0]->status);
			$noteid = '';
		} else {
			$noteid = addPnote($data[0]->reply_to, // Internal OpenEMR Function
								$data[0]->body,
								$userauthorized,
								'1',
								$data[0]->type,
								$data[0]->user,
								'',
								$data[0]->status);
		}
	break;


	// *************************************************************************************
	// Update the message record
	// *************************************************************************************
	case "update":
		$data = json_decode ( $_POST['row'] );
        updatePnoteMessageStatus($data[0]->noteid, $data[0]->status);
		updatePnote($data[0]->noteid, // Internal OpenEMR Function
					$data[0]->body,
					$data[0]->type,
					$data[0]->user,
					$data[0]->status);
	break;

	// *************************************************************************************
	// Flag the message to delete
	// *************************************************************************************
	case "delete":
		$data = json_decode ( $_POST['row'] );
		$delete_id = $data[0];
		deletePnote($delete_id);
		newEvent("delete", $_SESSION['authUser'], $_SESSION['authProvider'], 1, "pnotes: id ".$delete_id);
	break;
}

?>