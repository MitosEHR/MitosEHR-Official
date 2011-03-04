<?php
//--------------------------------------------------------------------------------------------------------------------------
// data_read.ejs.php / Permissions List with values for role
// v0.0.1
// Under GPLv3 License
//
// Integrated by: Ernesto Rodriguez
//
// Remember, this file is called via the Framework Store, this is the AJAX thing.
//--------------------------------------------------------------------------------------------------------------------------

session_name ( "MitosEHR" );
session_start();

include_once("../../../library/dbHelper/dbHelper.inc.php");
require_once("../../../repository/dataExchange/dataExchange.inc.php");

// Count records variable
$count = 0;
// *************************************************************************************
// Get the $_GET['role_id'] 
// and execute the apropriate SQL statement
// query all permissions and left join with currRole values
// *************************************************************************************

$currRole = ($_REQUEST["start"] == null) ? 5 : $_REQUEST["role_id"];

$sql = "SELECT acl_roles.id,
			   acl_roles.role_name,
			   acl_permissions.id AS permID,
			   acl_permissions.perm_key,
			   acl_permissions.perm_name,
			   acl_role_perms.role_id,
			   acl_role_perms.perm_id,
			   acl_role_perms.value
		  FROM (acl_role_perms
  	 LEFT JOIN acl_roles ON acl_role_perms.role_id = acl_roles.id)
  	RIGHT JOIN acl_permissions ON acl_role_perms.perm_id = acl_permissions.id
  		 WHERE acl_roles.id = '$currRole'
  		 ORDER BY role_name DESC";

	$buff = "";
	foreach (sqlStatement($sql) as $urow) {
		$count++;
		$buff .= "{";
		$buff .= " id: '" . $urow['id'] . "',";
		$buff .= " role_name: '" . dataEncode( $urow['role_name'] ) . "',";
		$buff .= " perm_key: '" . $urow['perm_key'] . "',";
		$buff .= " perm_name: '" . dataEncode( $urow['perm_name'] ) . "',";
		$buff .= " role_id: '" . $urow['role_id'] . "',";
		$buff .= " perm_id: '" . $urow['perm_id'] . "',";
		$buff .= " value: '" . $urow['value'] . "'}," . chr(13);
	}

	$buff = substr($buff, 0, -2); // Delete the last comma.
	echo $_GET['callback'] . '({';
	echo "totalCount: " . $count . ", " . chr(13);
	echo "row: [" . chr(13);
	echo $buff;
	echo "]})" . chr(13);
?>