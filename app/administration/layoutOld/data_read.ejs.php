<?php
//--------------------------------------------------------------------------------------------------------------------------
// data_read.ejs.php
// Desc: Read all the data related to the layout, in this case the fields and groups
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

include_once($_SESSION['site']['root']."/classes/dbHelper.php");
include_once($_SESSION['site']['root']."/classes/I18n.class.php");
require_once($_SESSION['site']['root']."/lib/layoutEngine/dataTypes.array.php");

// **************************************************************************************
// Reset session count 10 secs = 1 Flop
// **************************************************************************************
$_SESSION['site']['flops'] = 0;

// **************************************************************************************
// Database class instance
// **************************************************************************************
$mitos_db = new dbHelper();

// **************************************************************************************
// Verify if a $_GET['id'] has passed to select a facility.
// and execute the apropriate SQL statement
// **************************************************************************************
$mitos_db->setSQL("SELECT 
				layout_options.*, list_options.title AS listDesc
			FROM
  				layout_options
			LEFT OUTER JOIN 
				list_options
			ON 
				layout_options.list_id = list_options.option_id
			WHERE
  				layout_options.form_id = '". (($_REQUEST['form_id']) ? $_REQUEST['form_id'] : 'Demographics') . "'
			ORDER BY
  				layout_options.group_order, layout_options.seq");

//---------------------------------------------------------------------------------------
// catch the total records
//---------------------------------------------------------------------------------------
$total = $mitos_db->rowCount();

//---------------------------------------------------------------------------------------
// UOR
//---------------------------------------------------------------------------------------
$uorTypes = array(
	0 => i18n('Unused', 'r'), 
	1 => i18n('Optional', 'r'), 
	2 => i18n('Required', 'r')
);

//---------------------------------------------------------------------------------------
// start the array
//---------------------------------------------------------------------------------------
$rows = array();
foreach($mitos_db->execStatement(PDO::FETCH_ASSOC) as $row){
	// Some parsing before output the data
	$row['data_type'] = $dataTypes[ $row['data_type'] ];
	$row['uor'] = $uorTypes[ $row['uor'] ];
	array_push($rows, $row);
}
//---------------------------------------------------------------------------------------
// here we are adding "totals" and the root "row" for sencha use 
//---------------------------------------------------------------------------------------
print(json_encode(array('totals'=>$total,'row'=>$rows)));
?>