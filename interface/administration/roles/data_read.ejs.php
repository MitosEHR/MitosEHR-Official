<?php
//--------------------------------------------------------------------------------------------------------------------------
// data_read.ejs.php / Permissions List with values for role
// v0.0.1
// Under GPLv3 License
// Integrated by: Ernesto Rodriguez
// Remember, this file is called via the Framework Store, this is the AJAX thing.
//--------------------------------------------------------------------------------------------------------------------------
session_name ( "MitosEHR" );
session_start();
include_once("../../../library/dbHelper/dbHelper.inc.php");
include_once("../../../library/I18n/I18n.inc.php");
require_once("../../../repository/dataExchange/dataExchange.inc.php");

//------------------------------------------
// Database class instance
//------------------------------------------
$mitos_db = new dbHelper();
//print_r($_REQUEST); 
// Setting defults incase no request is sent by sencha
$start = ($_REQUEST["start"] == null)? 0 : $_REQUEST["start"];
$count = ($_REQUEST["limit"] == null)? 10 : $_REQUEST["limit"];

// *************************************************************************************
// Get the $_GET['role_id'] 
// and execute the apropriate SQL statement
// query all permissions and left join with currRole values
// *************************************************************************************
$currRole = ($_REQUEST["role_id"] == null) ? 5 : $_REQUEST["role_id"];
$mitos_db->setSQL("SELECT acl_roles.id AS roleID,
			   acl_roles.role_name,
			   acl_permissions.id AS permID,
			   acl_permissions.perm_key,
			   acl_permissions.perm_name,
			   acl_role_perms.id AS rolePermID,
			   acl_role_perms.role_id,
			   acl_role_perms.perm_id,
			   acl_role_perms.value
		  FROM (acl_role_perms
  	 LEFT JOIN acl_roles ON acl_role_perms.role_id = acl_roles.id)
  	RIGHT JOIN acl_permissions ON acl_role_perms.perm_id = acl_permissions.id
  		 WHERE acl_roles.id = '$currRole'
  		 ORDER BY role_name DESC");
$total = $mitos_db->rowCount();
	$buff = "";
foreach ($mitos_db->execStatement() as $urow) {
	$count++;
	$buff .= '{';
	$buff .= ' "roleID": "' . $urow['roleID'] . '",';
	$buff .= ' "role_name": "' . dataEncode( $urow['role_name'] ) . '",';
	$buff .= ' "permID": "' . dataEncode( $urow['permID'] ) . '",';
	$buff .= ' "perm_key": "' . $urow['perm_key'] . '",';
	$buff .= ' "perm_name": "' . dataEncode( $urow['perm_name'] ) . '",';
	$buff .= ' "rolePermID": "' . $urow['rolePermID'] . '",';
	$buff .= ' "role_id": "' . $urow['role_id'] . '",';
	$buff .= ' "perm_id": "' . $urow['perm_id'] . '",';
	$buff .= ' "value": "' . $urow['value'] . '"},' . chr(13);
}

$buff = substr($buff, 0, -2); // Delete the last comma.
echo '{';
echo '"totals": "' . $total . '", ' . chr(13);
echo '"row": [' . chr(13);
echo $buff;
echo ']}' . chr(13);
?>