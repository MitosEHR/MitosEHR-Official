<?php

/* adodb Helper v0.0.1
 * Description: A ADOdb helper for MitosEHR, containts custom function to manage the database
 * in MitosEHR, a re-write of the OpenEMR functions
 * Author: Gino Rivera Falu
 */

//**********************************************************************
// Use the field name association intead of numbers
//**********************************************************************
define ('ADODB_FETCH_ASSOC',2); 

//**********************************************************************
// Include the main library of ADOdb
//**********************************************************************
include_once($_SESSION['site']['root'] . "/library/adodb/adodb.inc.php");

//**********************************************************************
// Connect to the database
//**********************************************************************
$database = NewADOConnection("mysql");
$database->PConnect($_SESSION['db']['host'].":".$_SESSION['db']['port'], $_SESSION['db']['username'], $_SESSION['db']['password'], $_SESSION['db']['database']);

//**********************************************************************
// Simple SQL Stament, with Event LOG injection
//**********************************************************************
function sqlStatement($sql){
	$recordset = $database->Execute($sql);
	return $recordset;
}

?>



