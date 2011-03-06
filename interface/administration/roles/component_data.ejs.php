<?php
//--------------------------------------------------------------------------------------------------------------------------
// component_data.ejs.php / Role List
// v0.0.1
// Under GPLv3 License
// Integrated by: Ernesto Rodriguez
// Remember, this file is called via the Framework Store, this is the AJAX thing.
//--------------------------------------------------------------------------------------------------------------------------
session_name ( "MitosEHR" );
session_start();
include_once("library/dbHelper/dbHelper.inc.php");
include_once("library/acl/class.inc.php");
// Count records variable
$count = 0;
// *************************************************************************************
// Deside what to do with the $_GET['task']
// *************************************************************************************
switch ($_GET['task']) {
	// *********************************************************************************
	// Data for for Role List
	// *********************************************************************************
	case "roles":
	// *********************************************************************************
	// get full list of roles
	// *********************************************************************************
	$sql = "SELECT * FROM acl_roles ORDER BY role_name ASC";
	$buff = "";
	foreach (sqlStatement($sql) as $urow) {
		$count++;
		$buff .= "{";
		$buff .= " id: '" . $urow['id'] . "',";
		$buff .= " role_name: '" . $urow['role_name'] . "'}," . chr(13);
	}
	$buff = substr($buff, 0, -2); // Delete the last comma and clear the buff.
	echo $_GET['callback'] . '({';
	echo "totalCount: " . $count . ", " . chr(13);
	echo "row: [" . chr(13);
	echo $buff;
	echo "]})" . chr(13);
	break;
}
?>