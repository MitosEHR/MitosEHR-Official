<?php
//--------------------------------------------------------------------------------------------------------------------------
// component_data.ejs.php
// v0.0.1
// Under GPLv3 License
//
// Integrated by: Gi Technologies. in 2011
//
// Remember, this file is called via the Framework Store, this is the AJAX thing.
//--------------------------------------------------------------------------------------------------------------------------

session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once($_SESSION['site']['root']."/classes/dbHelper.class.php");
include_once($_SESSION['site']['root']."/classes/I18n.class.php");
require_once($_SESSION['site']['root']."/classes/dataExchange.class.php");

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
	// *************************************************************************************
	// Data for for Facilities
	// *************************************************************************************
	case "facilities":
	  $sql = "SELECT * FROM facility WHERE service_location != 0 ORDER BY name";
	  $mitos_db->setSQL($sql);
	  foreach ($mitos_db->execStatement(PDO::FETCH_ASSOC) as $urow) {
	    $count++;
	    $buff .= '{';
	    $buff .= ' "id": "' . dataEncode( $urow['id'] ) . '",';
	    $buff .= ' "name": "' . dataEncode( $urow['name'] ) . '"},' . chr(13);
	  }
	  $buff = substr($buff, 0, -2); // Delete the last comma.
	  echo '{';
	  echo '"totals": "' . $count . '", ' . chr(13);
	  echo '"row": [' . chr(13);
	  echo $buff;
	  echo ']}' . chr(13);    
	break;
	// *************************************************************************************
	// Data for for See Authorizations
	// *************************************************************************************
	case "seeAuthorizations":

	  echo '{"totals": "3", "row": [ { "id": "1", name: "None"}, { id: "2", "name": "Only Mine"}, { "id": "3", "name": "All"}]}';
   
	break;
		// *************************************************************************************
	// Data for for AccessControl
	// *************************************************************************************
	case "roles":
	  $sql = "SELECT id, role_name FROM acl_roles ORDER BY role_name";
	  $mitos_db->setSQL($sql);
	  foreach ($mitos_db->execStatement(PDO::FETCH_ASSOC) as $urow) {
	    $count++;
	    $buff .= '{';
	    $buff .= ' "id": "' . dataEncode( $urow['id'] ) . '",';
	    $buff .= ' "role_name": "' . dataEncode( $urow['role_name'] ) . '"},' . chr(13);
	  }
	  $buff = substr($buff, 0, -2); // Delete the last comma.
	  echo '{';
	  echo '"totals": "' . $count . '", ' . chr(13);
	  echo '"row": [' . chr(13);
	  echo $buff;
	  echo ']}' . chr(13);  
	break;
    case "codetypes":
	  $sql = "SELECT ct_key, ct_id FROM code_types ORDER BY ct_seq";
	  $mitos_db->setSQL($sql);
	  foreach ($mitos_db->execStatement(PDO::FETCH_ASSOC) as $urow) {
	    $count++;
	    $buff .= '{';
	    $buff .= ' "ct_id": "' . dataEncode( $urow['ct_id'] ) . '",';
	    $buff .= ' "ct_key": "' . dataEncode( $urow['ct_key'] ) . '"},' . chr(13);
	  }
	  $buff = substr($buff, 0, -2); // Delete the last comma.
	  echo '{';
	  echo '"totals": "' . $count . '", ' . chr(13);
	  echo '"row": [' . chr(13);
	  echo $buff;
	  echo ']}' . chr(13);
	break;
    case "calcategories":
	  $sql = "SELECT * FROM calendar_categories ORDER BY cattype, catname";
	  $mitos_db->setSQL($sql);
	  foreach ($mitos_db->execStatement(PDO::FETCH_ASSOC) as $urow) {
	    $count++;
	    $buff .= '{';
	    $buff .= ' "catid": "' . dataEncode( $urow['catid'] ) . '",';
	    $buff .= ' "catname": "' . dataEncode( $urow['catname'] ) . '"},' . chr(13);
	  }
	  $buff = substr($buff, 0, -2); // Delete the last comma.
	  echo '{';
	  echo '"totals": "' . $count . '", ' . chr(13);
	  echo '"row": [' . chr(13);
	  echo $buff;
	  echo ']}' . chr(13);
	break;
}
?>