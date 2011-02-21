<?php

/* adodb Helper v0.0.1
 * Description: A ADOdb helper for MitosEHR, containts custom function to manage the database
 * in MitosEHR, a re-write of the OpenEMR functions
 * Author: Gino Rivera Falu
 */

//**********************************************************************
// Include the main library of ADOdb
//**********************************************************************
require_once(dirname(__FILE__) . "/adodb/adodb.inc.php");

//**********************************************************************
// Connect to the database
//**********************************************************************
$database = NewADOConnection("mysql");
$database->PConnect($_SESSION['db']['host'].":".$_SESSION['db']['port'], $_SESSION['db']['username'], $_SESSION['db']['password'], $_SESSION['db']['database']);

//**********************************************************************
// Simple SQL Stament, with Event LOG injection
//**********************************************************************
function sqlStatement($sql){
	
}

?>



