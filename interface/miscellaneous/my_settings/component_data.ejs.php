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

include_once("../../../library/dbHelper/dbHelper.inc.php");
include_once("../../../library/I18n/I18n.inc.php");
require_once("../../../repository/dataExchange/dataExchange.inc.php");

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
	// Data for for storeTitles
	// *************************************************************************************
	case "titles":
	    $mitos_db->setSQL("SELECT option_id, title 
	        				 FROM list_options
	        				WHERE list_id = 'titles' ");
	  foreach ($mitos_db->execStatement() as $urow) {
	    $count++;
	    $buff .= "{";
	    $buff .= " option_id: '" . dataEncode( $urow['option_id'] ) . "',";
	    $buff .= " title: '" . dataEncode( $urow['title'] ) . "'}," . chr(13);
	  }
	  $buff = substr($buff, 0, -2); // Delete the last comma.
	  echo '{';
	  echo '"totals": "' . $count . '", ' . chr(13);
	  echo '"row": [' . chr(13);
	  echo $buff;
	  echo ']}' . chr(13); 
	break;
	// *************************************************************************************
	// Data for for storeTypes
	// *************************************************************************************
	case "types":
		$mitos_db->setSQL("SELECT option_id, title 
		        			 FROM list_options
		        			WHERE list_id = 'abook_type'");
		foreach ($mitos_db->execStatement() as $urow) {
		    $count++;
		    $buff .= "{";
		    $buff .= " option_id: '" . dataEncode( $urow['option_id'] ) . "',";
		    $buff .= " title: '" . dataEncode( $urow['title'] ) . "'}," . chr(13);
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