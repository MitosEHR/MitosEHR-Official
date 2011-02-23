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
// Load the MitosEHR Libraries
// *************************************************************************************
require_once("../registry.php");
require_once($_SESSION['site']['root']."/repository/dataExchange/dataExchange.inc.php");
require_once($_SESSION['site']['root']."/library/adoHelper/adoHelper.inc.php");

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
		$sql = "SELECT
					*
				FROM
					groups";
		foreach (sqlStatement($sql) as $urow) {
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
	
	// *************************************************************************************
	// Data for storeLang
	// *************************************************************************************
	case "lang":
		$sql = "SELECT
					*
				FROM
					lang_languages
				ORDER BY
					lang_description,
					lang_id";
		foreach (sqlStatement($sql) as $urow) {
			$buff .= " { lang_id: '" . dataDecode( $urow['lang_id'] ) . "', lang_description: '" . dataDecode( $urow['lang_description'] ) . "' },". chr(13);
			$count++;
		}
		$buff = substr($buff, 0, -2); // Delete the last comma and clear the buff.
		echo $_GET['callback'] . '({';
		echo "results: " . $count . ", " . chr(13);
		echo "row: [" . chr(13);
		echo $buff;
		echo "]})" . chr(13);
	break;
	
	// *************************************************************************************
	// Data for storeSites
	// *************************************************************************************
	case "sites":
		foreach ($_SESSION['site']['sites'] as $urow) {
			$buff .= " { site_id: '" . $count . "', site: '" . $urow . "' },". chr(13);
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