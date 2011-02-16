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

// *************************************************************************************
// SANITIZE ALL ESCAPES
// *************************************************************************************
$sanitize_all_escapes=true;
// *************************************************************************************
// STOP FAKE REGISTER GLOBALS
// *************************************************************************************
$fake_register_globals=false;
// *************************************************************************************
// Load the MitosEHR Libraries
// *************************************************************************************
require_once("../../registry.php");
require_once("../../../repository/dataExchange/dataExchange.inc.php");
// Count records variable
$count = 0;
// *************************************************************************************
// Deside what to do with the $_GET['task']
// *************************************************************************************
switch ($_GET['task']) {
	// *************************************************************************************
	// Data for for storeTitles
	// *************************************************************************************
	case "titles":
	    $sql = "SELECT option_id, title FROM list_options WHERE list_id = 'titles' ";
	  $result = sqlStatement( $sql );
	  
	  while ($myrow = sqlFetchArray($result)) {
	    $count++;
	    $buff .= "{";
	    $buff .= " option_id: '" . dataEncode( $myrow['option_id'] ) . "',";
	    $buff .= " title: '" . dataEncode( $myrow['title'] ) . "'}," . chr(13);
	  }
	  $buff = substr($buff, 0, -2); // Delete the last comma.
	  echo $_GET['callback'] . '({';
	  echo "results: " . $count . ", " . chr(13);
	  echo "row: [" . chr(13);
	  echo $buff;
	  echo "]})" . chr(13);   
  	break;
	// *************************************************************************************
	// Data for for storeTypes
	// *************************************************************************************
	case "types":
	  $sql = "SELECT option_id, title FROM list_options WHERE list_id = 'abook_type' ";
	  $result = sqlStatement( $sql );
	  
	  while ($myrow = sqlFetchArray($result)) {
	    $count++;
	    $buff .= "{";
	    $buff .= " option_id: '" . dataEncode( $myrow['option_id'] ) . "',";
	    $buff .= " title: '" . dataEncode( $myrow['title'] ) . "'}," . chr(13);
	  }
	  $buff = substr($buff, 0, -2); // Delete the last comma.
	  echo $_GET['callback'] . '({';
	  echo "results: " . $count . ", " . chr(13);
	  echo "row: [" . chr(13);
	  echo $buff;
	  echo "]})" . chr(13);   
	break;
	// *************************************************************************************
	// Data for for Facilities
	// *************************************************************************************
	case "facilities":
	  $sql = "SELECT * FROM facility WHERE service_location != 0 ORDER BY name";
	  $result = sqlStatement( $sql );
	  
	  while ($myrow = sqlFetchArray($result)) {
	    $count++;
	    $buff .= "{";
	    $buff .= " id: '" . dataEncode( $myrow['id'] ) . "',";
	    $buff .= " name: '" . dataEncode( $myrow['name'] ) . "'}," . chr(13);
	  }
	  $buff = substr($buff, 0, -2); // Delete the last comma.
	  echo $_GET['callback'] . '({';
	  echo "totals: " . $count . ", " . chr(13);
	  echo "row: [" . chr(13);
	  echo $buff;
	  echo "]})" . chr(13);   
	break;
	// *************************************************************************************
	// Data for for See Authorizations
	// *************************************************************************************
	case "seeAuthorizations":

	  echo "({totals: 3, row: [ { id: '1', name: 'None'}, { id: '2', name: 'Only Mine'}, { id: '3', name: 'All'}]})";
   
	break;
		// *************************************************************************************
	// Data for for AccessControl
	// *************************************************************************************
	case "accessControls":
	  $sql = "SELECT id, value, name FROM gacl_aco_sections ORDER BY name";
	  $result = sqlStatement( $sql );
	  
	  while ($myrow = sqlFetchArray($result)) {
	    $count++;
	    $buff .= "{";
	    $buff .= " id: '" . dataEncode( $myrow['id'] ) . "',";
	    $buff .= " value: '" . dataEncode( $myrow['value'] ) . "',";
	    $buff .= " name: '" . dataEncode( $myrow['name'] ) . "'}," . chr(13);
	  }
	  $buff = substr($buff, 0, -2); // Delete the last comma.
	  echo $_GET['callback'] . '({';
	  echo "totals: " . $count . ", " . chr(13);
	  echo "row: [" . chr(13);
	  echo $buff;
	  echo "]})" . chr(13);   
	break;
}
?>