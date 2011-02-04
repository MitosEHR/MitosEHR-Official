<?php

//*********************************************************************************
// Load all the events saved on the Database
// This will be the AJAX thing.
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
include_once("$srcdir/patient.inc.php");

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
	// Load all the events on the database, filtered by the group
	// *************************************************************************************
	case "load_events":
		$groupname = '%';
		$buff = '';
		$query = "SELECT 
						* 
					FROM 
						events 
					WHERE 
						provider_id like '" . $_GET['group'] . "' 
					ORDER BY 
						startdate";
		$rez = sqlStatement($query);
		while($row = sqlFetchArray($rez)){
			$buff .= "{ event_id: '" .  $row['event_id'] . "'," . 
					"title: '" . $row['title'] . "'," .
					"startdate: '" . $row['startdate'] . "'," . 
					"enddate: '" . $row['enddate'] . "'," . 
					"location: '" . $row['location'] . "'," . 
					"notes: '" . $row['notes'] . "'," . 
					"url: '" . $row['url'] . "'," . 
					"isallday: '" . $row['isallday'] . "'," . 
					"reminder: '" . $row['reminder'] . "'," . 
					"isnew: '" . $row['isnew'] . "'," . 
					"category_id: '" . $row['category_id'] . "'," . 
					"provider_id: '" . $row['provider_id'] . "'," . 
					"status_id: '" . $row['status_id'] . "'," . 
					"comments: '" . $row['comments'] . "'," . 
					"patient_id: '" . $row['patient_id'] . "'," . 
					"recurrence: '" . $row['recurrence'] . "'," . 
					"htmlPatInfo: '" . $row['htmlPatInfo'] . "'}," . chr(13);
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