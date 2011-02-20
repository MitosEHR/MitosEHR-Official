<?php

/* adodb Helper v0.0.1
 * Description: A ADOdb helper for MitosEHR, containts custom function to manage the database
 * in MitosEHR, a re-write of the OpenEMR functions
 * Author: Gino Rivera Falu
 */

 // Include the main library of ADOdb
require_once(dirname(__FILE__) . "/adodb/adodb.inc.php");

// Use the field name association intead of numbers
define('ADODB_FETCH_ASSOC',2);

// Connect to the database
$database = NewADOConnection("mysql");
$database->PConnect($host, $login, $pass, $dbase);
$GLOBALS['adodb']['db'] = $database;
$GLOBALS['dbh'] = $database->_connectionID;

?>



