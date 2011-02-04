<?php

//*********************************************************************************
// Load all the data for any form.
// This will be the AJAX thing.
//
// This file will be called several time at once, this way will speed up 
// the execution of the code.
//
// This will output a JSON data format.
//
// rev 0.0.1
//*********************************************************************************

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
include_once("../../registry.php");
include_once("$srcdir/sql.inc.php");
include_once("$srcdir/options.inc.php");
include_once("$srcdir/calendar.inc");
include_once("$srcdir/patient.inc.php");

//**************************************************************************************
// JSON Data Structure
//
//    results: 2000, // Total rows in the SQL Statement
//    rows: [        // Reader's configured root
//        // record data objects:
//        { id: 1, firstname: 'Bill', occupation: 'Gardener' },
//        { id: 2, firstname: 'Ben' , occupation: 'Horticulturalist' },
//
//**************************************************************************************

// Future implementations:
// * Create a function in PHP to create the data structure of JSON
//   and at the same time, spits the data into it, without having a lot of echo.
//

// *************************************************************************************
// Clear the buffer variable first
// *************************************************************************************
$buff = null;
$count = 0;

// *************************************************************************************
// Deside what to do with the $_GET['task']
// *************************************************************************************
switch ($_GET['task']) {
	
	// *************************************************************************************
	// Data for cmb_Status comboBox
	// *************************************************************************************
	case "cmbStatus":
		$sql = "SELECT 
					* 
				FROM 
					list_options
				WHERE
					list_id = 'apptstat' 
				ORDER BY
					seq, title";
		$result = sqlStatement($sql);
		while($row = sqlFetchArray($result)){
			$count++;
			$buff .= " { id: '" . htmlspecialchars( $row{'option_id'}, ENT_QUOTES) . "', title: '" . htmlspecialchars( $row{'title'}, ENT_NOQUOTES) . "' },". chr(13);
		}
		$buff = substr($buff, 0, -2); // Delete the last comma and clear the buff.
		echo $_GET['callback'] . '({';
		echo "results: " . $count . ", " . chr(13);
		echo "row: [" . chr(13);
		echo $buff;
		echo "]})" . chr(13);
		break;

	// *************************************************************************************
	// Data for cmb_Prov_Edit comboBox
	// *************************************************************************************
	case "cmbProvEdit":
		$row = getProviderUsernames();
		$buff = null;
		foreach ($row as $key => $value){
			$count++;
			$buff .= "{username: '" . $value['username'] . "', name: '" . $value['fname'] .",". $value['lname'] . "'}," . chr(13);
		}
		$buff = substr($buff, 0, -2); // Delete the last comma and clear the buff.
		echo $_GET['callback'] . '({';
		echo "results: " . $count . ", " . chr(13);
		echo "row: [" . chr(13);
		echo $buff;
		echo "]})" . chr(13);
	break;

	// *************************************************************************************
	// Data for cmb_Prov comboBox
	// *************************************************************************************
	case "cmbProv":
		$row = getProviderUsernames();
		$count++;
		$buff = "{username: 'all', name: 'Show All'}," . chr(13);
		foreach ($row as $key => $value){
			$count++;
			$buff .= "{username: '" . $value['username'] . "', name: '" . $value['fname'] .",". $value['lname'] . "'}," . chr(13);
		}
		$buff = substr($buff, 0, -2); // Delete the last comma and clear the buff.
		echo $_GET['callback'] . '({';
		echo "results: " . $count . ", " . chr(13);
		echo "row: [" . chr(13);
		echo $buff;
		echo "]})" . chr(13);
	break;
	
	// *************************************************************************************
	// Data for cmb_Cat comboBox
	// *************************************************************************************
	case "cmbCat":
		$cres = sqlStatement("SELECT 
							 		pc_catid, 
									pc_catname, 
									pc_recurrtype, 
									pc_duration, 
									pc_end_all_day 
								FROM 
									openemr_postcalendar_categories 
								ORDER BY 
									pc_catname");
		$result = sqlStatement($cres);
		while($row = sqlFetchArray($result)){
			$count++;
			$buff .= "{ id: '" .  $row['pc_catid'] . "', name: '" . $row['pc_catname'] . "'}," . chr(13);
		}
		$buff = substr($buff, 0, -2); // Delete the last comma and clear the buff.
		echo $_GET['callback'] . '({';
		echo "results: " . $count . ", " . chr(13);
		echo "row: [" . chr(13);
		echo $buff;
		echo "]})" . chr(13);
	break;
	
	
} // end of switch


?>