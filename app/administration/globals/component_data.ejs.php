<?php
//------------------------------------------------------------------------------------------
// component_data.ejs.php
// v0.0.1
// Under GPLv3 License
// Integrated by: Ernesto J Rodriguez
// Remember, this file is called via the Framework Store, this is the AJAX thing.
//------------------------------------------------------------------------------------------

session_name ( "MitosEHR" );
session_start();

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
// *****************************************************************************************
// Deside what to do with the $_GET['task']
// *****************************************************************************************
switch ($_GET['task']) {
	// *************************************************************************************
	// Data for  lists options (combos)
	// *************************************************************************************
	case "selectLists":
		$sql = "SELECT * FROM list_options ORDER BY list_id ";
		$mitos_db->setSQL($sql);
		foreach ($mitos_db->execStatement() as $urow) {
			$count++;
		    $buff .= '{';
			$buff .= '"list_id":"' 			. dataEncode( $urow['list_id'] ) . '",';
			$buff .= '"option_id":"'		. dataEncode( $urow['option_id'] ) . '",';
			$buff .= '"title":"' 			. dataEncode( $urow['title'] ) . '",';
			$buff .= '"seq":"'				. dataEncode( $urow['seq'] ) . '",';
			$buff .= '"is_default":"'		. dataEncode( $urow['is_default'] ) . '",';
			$buff .= '"option_value":"'		. dataEncode( $urow['option_value'] ) . '"},' . chr(13);
		}
		$buff = substr($buff, 0, -2); // Delete the last comma.
		echo '{';
		echo '"totals": "' . $count . '", ' . chr(13);
		echo '"row": [' . chr(13);
		echo $buff;
		echo ']}' . chr(13);
	break;
	// *************************************************************************************
	// Data for Languages select lists (combos)
	// *************************************************************************************
	case "langs":
		$sql = "SELECT * FROM lang_languages ORDER BY lang_description ";
		$mitos_db->setSQL($sql);
		foreach ($mitos_db->execStatement() as $urow) {
			$count++;
		    $buff .= '{';
			$buff .= '"lang_id":"' 			. dataEncode( $urow['lang_id'] ) . '",';
			$buff .= '"lang_code":"'		. dataEncode( $urow['lang_code'] ) . '",';
			$buff .= '"lang_description":"'	. dataEncode( $urow['lang_description'] ) . '"},' . chr(13);
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