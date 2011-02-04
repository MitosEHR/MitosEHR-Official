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

}

?>