<?php
// *********************************************************
// MitosEHR Configuration file per site
// MySQL Config
// *********************************************************

//**********************************************************************
// Database Init Configuration
//**********************************************************************
$_SESSION['db']['type'] = 'localhost';
$_SESSION['db']['host'] = 'localhost';
$_SESSION['db']['port'] = '3306';
$_SESSION['db']['username'] = 'openemr';
$_SESSION['db']['password'] = 'pass';
$_SESSION['db']['database'] = 'openemr';

//**********************************************************************
// Setup Command
// If it's true, the application will
// run the Setup Wizard 
//**********************************************************************
$_SESSION['site']['setup'] = false;

?>
