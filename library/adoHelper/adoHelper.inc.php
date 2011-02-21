<?php

/* adodb Helper v0.0.1
 * Description: A ADOdb helper for MitosEHR, containts custom function to manage the database
 * in MitosEHR, a re-write of the OpenEMR functions
 * Author: Gino Rivera Falu
 */

//**********************************************************************
// Include the main library of ADOdb
//**********************************************************************
include_once($_SESSION['site']['root'] . "/library/adodb/adodb.inc.php");

//**********************************************************************
// Connect to the database
//**********************************************************************
$conn = NewADOConnection("mysql");
$conn->PConnect($_SESSION['db']['host'].":".$_SESSION['db']['port'], $_SESSION['db']['username'], $_SESSION['db']['password'], $_SESSION['db']['database']);
$conn->SetFetchMode(ADODB_FETCH_ASSOC); 

//**********************************************************************
// Simple SQL Stament, with no Event LOG injection
// return: Array of records
//**********************************************************************
function sqlStatement($sql){
	global $conn;
	$recordset = $conn->GetAll($sql);
	return $recordset;
}

?>



