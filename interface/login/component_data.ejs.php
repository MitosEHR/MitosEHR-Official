<?php
//--------------------------------------------------------------------------------------------------------------------------
// component_data.ejs.php / List Options
// v0.0.1
// Under GPLv3 License
//
// Integrated by: Gi Technologies. in 2011
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
// Load the MitosEHR Libraries
// *************************************************************************************
require_once("../registry.php");
require_once("../../repository/dataExchange/dataExchange.inc.php");

// Count records variable
$count = 0;

// *************************************************************************************
// Deside what to do with the $_GET['task']
// *************************************************************************************
switch ($_GET['task']) {

	// *************************************************************************************
	// Data for for storeGroups
	// *************************************************************************************
	case "groups":
		$sql = sqlStatement("SELECT
								*
							FROM
								groups");
		while ($urow = sqlFetchArray($sql)) {
			$buff .= " { id: '" . dataDecode( $urow['id'] ) . "', user: '" . dataDecode( $urow['user'] ) . "', name: '" . dataDecode( $urow['name'] ) . "' },". chr(13);
			$count++;
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