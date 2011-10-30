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
session_cache_limiter('private');

include_once($_SESSION['site']['root']."/classes/dbHelper.class.php");

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;

$mitos_db = new dbHelper();

// *****************************************************************************************
// Deside what to do with the $_GET['task']
// *****************************************************************************************
switch ($_GET['task']) {
	// *************************************************************************************
	// Data for Languages select lists (combos)
	// *************************************************************************************
	case "langs":
		$mitos_db->setSQL("SELECT * FROM lang_languages ORDER BY lang_description");
        $total = $mitos_db->rowCount();
        $rows = array();
		foreach($mitos_db->execStatement(PDO::FETCH_ASSOC) as $row){
            array_push($rows, $row);
        }
        print_r(json_encode(array('totals'=>$total,'row'=>$rows)));
	break;
}
?>