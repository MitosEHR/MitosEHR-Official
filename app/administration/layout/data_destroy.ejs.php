<?php
//--------------------------------------------------------------------------------------------------------------------------
// data_destroy.ejs.php
// v0.0.1
// Under GPLv3 License
//
// Integrated by: Gi Technologies. in 2011
//
// Remember, this file is called via the Framework Store, this is the AJAX thing.
//--------------------------------------------------------------------------------------------------------------------------
// TODO: Create a procedure to check if the field has data on the patient_data. If there is data do not allow the
// user to delete the field. Return an error, indicating that the field has data in it.

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

// *************************************************************************************
// Database object
// *************************************************************************************
$mitos_db = new dbHelper();

// *************************************************************************************
// Flag the message to delete
// *************************************************************************************
$data = json_decode ( $_REQUEST['row'] );
$row = array();
$row['item_id'] 		= trim($data->item_id);
$row['form_id'] 		= $data->form_id;
$row['field_id'] 		= strtolower($data->field_id);
$row['group_name'] 		= $data->group_name;
$row['title'] 			= $data->title;
$row['seq'] 			= $data->seq;
$row['data_type'] 		= $dataTypes[$data->data_type]; // Reverse
$row['uor'] 			= $uorTypes[$data->uor]; // Reverse
$row['fld_length'] 		= $data->fld_length;
$row['max_length'] 		= $data->max_length;
$row['list_id'] 		= $reverse_list[0]['option_id'];
$row['titlecols'] 		= $data->titlecols;
$row['datacols'] 		= $data->datacols;
$row['default_value'] 	= $data->default_value;
$row['edit_options'] 	= $data->edit_options;
$row['description'] 	= $data->description;
$row['group_order'] 	= $data->group_order;

// *************************************************************************************
// Check if this field about to be deleted, has data on the patient_data
// If so, advice the user
// *************************************************************************************
$sql = "ALTER TABLE patient_data DROP COLUMN " . $row['field_id'];
$mitos_db->setSQL($sql);
$ret = $mitos_db->execLog();

// *************************************************************************************
// Finally build the Delete SQL Statement and inject it to the SQL Database
// *************************************************************************************
$sql = "DELETE FROM layout_options WHERE item_id='" . $row['item_id'] . "'";
$mitos_db->setSQL($sql);
$ret = $mitos_db->execLog();

if ( $ret[2] <> "" ){
	echo '{ success: false, errors: { reason: "'. $ret[2] .'" }}';
} else {
	echo "{ success: true }";
}

?>