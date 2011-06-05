<?php
//--------------------------------------------------------------------------------------------------------------------------
// component_data.ejs.php / List Options
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

//------------------------------------------
// Database class instance
//------------------------------------------
$mitos_db = new dbHelper();

// *************************************************************************************
// Deside what to do with the $_GET['task']
// *************************************************************************************
switch ($_GET['task']) {
	
	// *************************************************************************************
	// Data for Form List
	// *************************************************************************************
	case "form_list":
		$mitos_db->setSQL("SELECT DISTINCT form_id FROM layout_options");
		$total = $mitos_db->rowCount();
		//---------------------------------------------------------------------------------------
		// start the array
		//---------------------------------------------------------------------------------------
		$rows = array();
		foreach($mitos_db->execStatement() as $row){
			$row['id'] = $row['form_id'];
			array_push($rows, $row);
		}
		//---------------------------------------------------------------------------------------
		// here we are adding "totals" and the root "row" for sencha use 
		//---------------------------------------------------------------------------------------
		print_r(json_encode(array('totals'=>$total,'row'=>$rows)));
	break;

}
?>