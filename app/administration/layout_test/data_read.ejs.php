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

include_once($_SESSION['site']['root']."/classes/dbHelper.class.php");
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
$mitos_db->setSQL("SELECT DISTINCT group_name FROM layout_options
			        WHERE form_id = '". (($_REQUEST['form_id']) ? $_REQUEST['form_id'] : 'Demographics') . "'
			     ORDER BY group_order");

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
    $group = array();
	$group['group_name'] = $row['group_name'];
    $mitos_db->setSQL("SELECT layout_options.*, list_options.title AS listDesc
			             FROM layout_options
			  LEFT OUTER JOIN list_options ON layout_options.list_id = list_options.option_id
			            WHERE layout_options.form_id = '". (($_REQUEST['form_id']) ? $_REQUEST['form_id'] : 'Demographics') . "'
			              AND layout_options.group_name = '".$row['group_name']."'
			         ORDER BY layout_options.group_order, layout_options.seq");
    $fields = array();
    foreach($mitos_db->execStatement(PDO::FETCH_ASSOC) as $field){
        unset($field['group_name']);
        // look for nested fields
         $field['leaf'] = true;
        //
        array_push($fields, $field);
    }
    $group = array( 'group_name'=>$group['group_name'] , 'children'=>$fields);
	array_push($rows, $group);
}

//echo "<pre>";
//print_r(array('text'=>'.','children'=>$rows));
//echo "</pre>";
print(json_encode($rows));
?>