<?php

//--------------------------------------------------------------------------------------------------------------------------
// immunization.ejs.php
// v0.0.2 -> AJAX
//
// Under GPLv3 License
//
// Integration Sencha ExtJS Framework
//
// Integrated by: IdeasGroup Inc. in 2010
// OpenEMR is a free medical practice management, electronic medical records, prescription writing,
// and medical billing application. These programs are also referred to as electronic health records.
// OpenEMR is licensed under the General Gnu Public License (General GPL). It is a free open source replacement
// for medical applications such as Medical Manager, Health Pro, and Misys. It features support for EDI billing
// to clearing houses such as Availity, MD-Online, MedAvant and ZirMED using ANSI X12.
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
include_once("../../globals.php");
include_once("$srcdir/sql.inc");
include_once("$srcdir/options.inc.php");

// Count records variable
$count = 0;
$buff = NULL;

// -------------------------------------------------------------------------------------
// Deside what to do with the task
// -------------------------------------------------------------------------------------
switch($_GET['task']){
	
	// -------------------------------------------------------------------------------------
	// Load the immunizations list of a patient
	// -------------------------------------------------------------------------------------
	case "load":
		$sql = "SELECT
					i1.id,
					i1.immunization_id,
					i1.administered_date,
					i1.manufacturer,
					i1.lot_number,
					administered_by_id,
					vis_date,
					ifnull(concat(u.lname,', ',u.fname),'Other') as administered_by,
					i1.education_date,
					i1.note
				FROM
					immunizations i1 left join users u on i1.administered_by_id = u.id
				WHERE patient_id = '" . $pid . "'";
		$result = sqlStatement($sql);
		while ($row = sqlFetchArray($result)) {
			$buff .= "{ id: '" . htmlspecialchars( $row["id"], ENT_NOQUOTES) . "'," .
						"immunization_id: '" . $row['immunization_id'] . "'," .
						"administered_by: '" . $row['administered_date'] . "'," .
						"administered_by_id: '" . $row['administered_by_id'] . "'," .
						"vis_date: '" . $row['vis_date'] . "'," .
						"administered_date: '" . htmlspecialchars( $row["administered_date"], ENT_NOQUOTES) . "'," .
						"manufacturer: '" . htmlspecialchars( $row["manufacturer"], ENT_NOQUOTES) . "'," .
						"lot_number: '" . htmlspecialchars( $row["lot_number"], ENT_NOQUOTES) . "'," .
						"administered_by: '" . htmlspecialchars( $row["administered_by"], ENT_NOQUOTES) . "'," .
						"education_date: '" . htmlspecialchars( $row["education_date"], ENT_NOQUOTES) . "'," .
						"vaccine: '" . generate_display_field(array('data_type'=>'1','list_id'=>'immunizations'), $row['immunization_id']) . "'," .
						"note: '" . htmlspecialchars( $row["note"], ENT_NOQUOTES) . "'},". chr(13);
		}
		$buff = substr($buff, 0, -2); // Delete the last comma.
		echo $_GET['callback'] . '({';
		echo "results: " . $count . ", " . chr(13);
		echo "row: [" . chr(13);
		echo $buff;
		echo "]})" . chr(13);
	break;

	// -------------------------------------------------------------------------------------
	// Load the immunizations list
	// -------------------------------------------------------------------------------------
	case "immunizations":
		$sql = "SELECT
					*
				FROM
					list_options
				WHERE
					list_id = 'immunizations'
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

	// -------------------------------------------------------------------------------------
	// Load the cmb_administered_by_id list
	// -------------------------------------------------------------------------------------
	case "admData":
		$sql = "SELECT
					id,
					concat(lname,', ',fname) as full_name
				FROM
					users
				WHERE
					username != ''
				ORDER BY
					concat(lname,', ',fname)";
		$result = sqlStatement($sql);
		while($row = sqlFetchArray($result)){
			$buff .= " { id: '" . htmlspecialchars( $row{'id'}, ENT_QUOTES) . "', full_name: '" . htmlspecialchars( $row{'full_name'}, ENT_NOQUOTES) . "' },". chr(13);
		}
		$buff = substr($buff, 0, -2); // Delete the last comma and clear the buff.
		echo $_GET['callback'] . '({';
		echo "results: " . $count . ", " . chr(13);
		echo "row: [" . chr(13);
		echo $buff;
		echo "]})" . chr(13);
	break;

	// -------------------------------------------------------------------------------------
	// Save the patient immunization
	// -------------------------------------------------------------------------------------
	case "create":
	break;

	// -------------------------------------------------------------------------------------
	// Delete the patient immunization
	// -------------------------------------------------------------------------------------
	case "delete":
	break;

	// -------------------------------------------------------------------------------------
	// Update the patient immunization
	// -------------------------------------------------------------------------------------
	case "update":
	break;

}

?>