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

session_name ( "MitosEHR" );
session_start();

include_once($_SESSION['site']['root']."/library/adoHelper/adoHelper.inc.php");
include_once($_SESSION['site']['root']."/library/I18n/I18n.inc.php");
require_once($_SESSION['site']['root']."/repository/dataExchange/dataExchange.inc.php");

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
		foreach (sqlStatement($sql) as $urow) {
			$count++;
			// Merge firstname with lastname
			if ($urow['fname']){
				$username = $urow['fname'] . ", " . $urow['lname'];
			} else {
				$username = $urow['lname'];
			}
			$buff .= " { user: '" . dataDecode( $urow['username'] ) . "', full_name: '" . $username . "' },". chr(13);
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
		foreach (sqlStatement($sql) as $urow) {
			$count++;
			$buff .= " { option_id: '" . dataDecode( $urow['option_id'] ) . "', title: '" . dataDecode( $urow['title'] ) . "' },". chr(13);
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
		foreach (sqlStatement($sql) as $urow) {
			$count++;
			$buff .= "{ option_id: '" . dataDecode( $urow['option_id'] ) . "', title: '" . dataDecode( $urow['title'] ) . "' },". chr(13);
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
		foreach (sqlStatement($sql) as $urow) {
			$count++;
			$buff .= "{ id: '" . dataDecode( $urow['id'] ) . "',";
			$buff .= " name: '" . dataDecode( $urow['fname'] ) . ", " . dataDecode( $urow['lname'] )  . "',";
			$buff .= " phone: '" . dataDecode( "Contact: ".$urow['phone_contact']." | Home: " . $urow['phone_home']." | Cell: ".$urow['phone_cell']." | Work: ".$urow['phone_biz'] ) . "',";
			$buff .= " ss: '" . dataDecode( $urow['ss'] ) . "',";
			$buff .= " dob: '" . dataDecode( $urow['DOB'] ) . "',";
			$buff .= " pid: '" . dataDecode( $urow['pid'] ) . "'},".chr(13);
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