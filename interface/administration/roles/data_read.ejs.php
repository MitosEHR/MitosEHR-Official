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
session_cache_limiter('private');

include_once("../../../library/dbHelper/dbHelper.inc.php");
include_once("../../../library/I18n/I18n.inc.php");
require_once("../../../repository/dataExchange/dataExchange.inc.php");

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;

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
$rows = array();
foreach($mitos_db->execStatement() as $row){
	switch($row['value']){
		case '0':
			$row['ac_perm'] = 'No Access';
		break;
		case '1':
			$row['ac_perm'] = 'View';
		break;
		case '2':
			$row['ac_perm'] = 'View/Update';
		break;
		case '3':
			$row['ac_perm'] = 'View/Update/Create';
		break;
	}
	array_push($rows, $row);
}
print_r(json_encode(array('totals'=>$total,'row'=>$rows)));

?>