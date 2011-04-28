<?php
//--------------------------------------------------------------------------------------------------------------------------
// data_read.ejs.php / Permissions List with values for role
// v0.0.1
// Under GPLv3 License
// Integrated by: Ernesto Rodriguez
// Remember, this file is called via the Framework Store, this is the AJAX thing.
//--------------------------------------------------------------------------------------------------------------------------
session_name ( "MitosEHR" );
session_start();
include_once("../../../library/dbHelper/dbHelper.inc.php");
include_once("../../../library/I18n/I18n.inc.php");
require_once("../../../repository/dataExchange/dataExchange.inc.php");

//------------------------------------------
// Database class instance
//------------------------------------------
$mitos_db = new dbHelper();

$count = 1;
$buff = "";

// *************************************************************************************
// and execute the apropriate SQL statement
// query all permissions and left join with currRole values
// *************************************************************************************
$mitos_db->setSQL("SELECT gl_name, gl_index, gl_value FROM globals");
$total = $mitos_db->rowCount();

foreach ($mitos_db->execStatement() as $urow) {
	
	$buff .= '<'.$urow['gl_name'].'>'.$urow['gl_value'].'</'.$urow['gl_name'].'>';
}

echo '<message success="true">';
echo '<form>';
echo '<data_id>1</data_id>';
echo $buff;
echo '</form>';
?>
