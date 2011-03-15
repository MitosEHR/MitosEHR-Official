<?php
//--------------------------------------------------------------------------------------------------------------------------
// data_destroy.ejs.php / Roles
// v0.0.1
// Under GPLv3 License
// Integrated by: Gi Ernesto Rodriguez. in 2011
// Remember, this file is called via the Framework Store, this is the AJAX thing.
//--------------------------------------------------------------------------------------------------------------------------
session_name ( "MitosEHR" );
session_start();
include_once("library/dbHelper/dbHelper.inc.php");
include_once("library/I18n/I18n.inc.php");
require_once("repository/dataExchange/dataExchange.inc.php");
// *****************************************************************************************
// Flag the list item to delete
// *****************************************************************************************
$data = json_decode ( $_POST['row'] );
switch ($_GET['task']) {
	// *************************************************************************************
	// Code to delete roles and related data from acl_role_perms
	// *************************************************************************************
	case "delete_role";
	$delete_id = $data[0]->id;
	sqlStatement("DELETE FROM acl_roles, acl_role_perms  
						WHERE acl_roles.id='$delete_id' 
						  AND acl_role_perms.role_id='$delete_id' ");
	break;
	// *************************************************************************************
	// Code to delete permissions and related data from acl_role_perms
	// *************************************************************************************
	case "delete_permission";
	$delete_id = $data[0]->id;
	sqlStatement("DELETE FROM acl_permissions, acl_role_perms  
						WHERE acl_permissions.id='$delete_id' 
						  AND acl_role_perms.role_id='$delete_id' ");
	break;
}
?>