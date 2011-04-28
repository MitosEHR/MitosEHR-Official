<?php
//--------------------------------------------------------------------------------------------------------------------------
// data_destroy.ejs.php / List Options
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

include_once("library/dbHelper/dbHelper.inc.php");
include_once("library/I18n/I18n.inc.php");
require_once("repository/dataExchange/dataExchange.inc.php");

// *************************************************************************************
// Flag the list item to delete
// *************************************************************************************
$data = json_decode ( $_POST['row'] );
$delete_id = $data[0]->id;

sqlStatement("DELETE FROM list_options WHERE id='$delete_id'"); 

?>