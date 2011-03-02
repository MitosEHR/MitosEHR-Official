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

include_once("library/dbHelper/dbHelper.inc.php");
include_once("library/I18n/I18n.inc.php");
require_once("repository/dataExchange/dataExchange.inc.php");

// Count records variable
$count = 0;
// *************************************************************************************
// Get the $_GET['role_id'] 
// and execute the apropriate SQL statement
// query all permissions and left join with currRole values
// *************************************************************************************
$currRole = $_REQUEST['role_id'];
$sql = "SELECT acl_permissions.id,
			   acl_permissions.perm_key,
			   acl_permissions.perm_name,
			   acl_role_perms.role_id,
			   acl_role_perms.perm_id,
			   acl_role_perms.value
		  FROM acl_permissions
  	 LEFT JOIN acl_role_perms
	 	    ON acl_permissions.id = acl_role_perms.perm_id
	 	 WHERE role_id = '$currRole' 
  		 ORDER BY perm_name";
	$buff = "";
	foreach (sqlStatement($sql) as $urow) {
		$count++;
		$buff .= "{";
		$buff .= " id: '" . $urow['id'] . "',";
		$buff .= " perm_key: '" . dataEncode( $urow['perm_key'] ) . "',";
		$buff .= " perm_name: '" . dataEncode( $urow['perm_name'] ) . "',";
		$buff .= " role_id: '" . dataEncode( $urow['role_id'] ) . "',";
		$buff .= " perm_id: '" . dataEncode( $urow['perm_id'] ) . "',";
		$buff .= " value: '" . dataEncode( $urow['value'] ) . "'}," . chr(13);
	}

	$buff = substr($buff, 0, -2); // Delete the last comma.
	echo $_GET['callback'] . '({';
	echo "results: " . $count . ", " . chr(13);
	echo "row: [" . chr(13);
	echo $buff;
	echo "]})" . chr(13);
?>