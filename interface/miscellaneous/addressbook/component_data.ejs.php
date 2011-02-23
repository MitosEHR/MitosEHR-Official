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

include_once("library/adoHelper/adoHelper.inc.php");
include_once("library/I18n/I18n.inc.php");
require_once("repository/dataExchange/dataExchange.inc.php");

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
    $sql = "SELECT 
          option_id, title 
        FROM 
          list_options
        WHERE 
          list_id = 'titles' ";
  $result = sqlStatement( $sql );
  
  while ($myrow = sqlFetchArray($result)) {
    $count++;
    $buff .= "{";
    $buff .= " option_id: '" . dataEncode( $myrow['option_id'] ) . "',";
    $buff .= " title: '" . dataEncode( $myrow['title'] ) . "'}," . chr(13);
  }
  $buff = substr($buff, 0, -2); // Delete the last comma.
  echo $_GET['callback'] . '({';
  echo "totals: " . $count . ", " . chr(13);
  echo "row: [" . chr(13);
  echo $buff;
  echo "]})" . chr(13);   
  break;
	break;
	// *************************************************************************************
	// Data for for storeTypes
	// *************************************************************************************
	case "types":
  $sql = "SELECT 
          option_id, title 
        FROM 
          list_options
        WHERE 
          list_id = 'abook_type' ";
  $result = sqlStatement( $sql );
  
  while ($myrow = sqlFetchArray($result)) {
    $count++;
    $buff .= "{";
    $buff .= " option_id: '" . dataEncode( $myrow['option_id'] ) . "',";
    $buff .= " title: '" . dataEncode( $myrow['title'] ) . "'}," . chr(13);
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