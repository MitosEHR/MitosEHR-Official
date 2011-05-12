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
session_cache_limiter('private');

include_once("../../../library/dbHelper/dbHelper.inc.php");
include_once("../../../library/I18n/I18n.inc.php");
include_once("../../../library/acl/class.inc.php");

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;

$mitos_db = new dbHelper();

// Count records variable
$count = 0;
$buff = "";
// *************************************************************************************
// Deside what to do with the $_GET['task']
// *************************************************************************************
switch ($_GET['task']) {
	// *********************************************************************************
	// Data for for Role List
	// *********************************************************************************
	case "roles":
		// *****************************************************************************
		// get full list of roles
		// *****************************************************************************
		$mitos_db->setSQL("SELECT * FROM acl_roles ORDER BY role_name ASC");
		foreach ($mitos_db->execStatement() as $urow) {
			$count++;
			$buff .= '{';
			$buff .= ' "id": "' . $urow['id'] . '",';
			$buff .= ' "role_name": "' . $urow['role_name'] . '"},' . chr(13);
		}
		$buff = substr($buff, 0, -2); // Delete the last comma and clear the buff.
		echo '{';
		echo '"totals": "' . $count . '", ' . chr(13);
		echo '"row": [' . chr(13);
		echo $buff;
		echo ']}' . chr(13); 
	break;
	
	// *****************************************************************************
	// Permissions
	// *****************************************************************************
	case "perms":
		$count++;
		$buff .= " { value: '0', perm: '" . i18n('No Access','r') . "' },". chr(13);
		$count++;
		$buff .= " { value: '1', perm: '" . i18n('View / Read','r') . "' },". chr(13);
		$count++;
		$buff .= " { value: '2', perm: '" . i18n('View / read / Edit','r') . "' }";
		echo '({';
		echo "results: " . $count . ", " . chr(13);
		echo "row: [" . chr(13);
		echo $buff;
		echo "]})" . chr(13);
	break;
}
?>