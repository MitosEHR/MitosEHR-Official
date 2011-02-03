<?php
// *********************************************************
// MitosEHR Configuration file per site
// MySQL Config
// Referenced from /library/sqlconf.php.
// *********************************************************

// *********************************************************
// New configuration for MitosEHR
// Using CodeIgniter v2.0.0
// Database configuration
// *********************************************************
//$site['hostname'] = "localhost";
//$site['username'] = "openemr";
//$site['password'] = "pass";
//$site['database'] = "openemr";
//$site['dbdriver'] = "mysql";
//$site['dbprefix'] = "";
//$site['pconnect'] = TRUE;
//$site['db_debug'] = FALSE;
//$site['cache_on'] = FALSE;
//$site['cachedir'] = "";
//$site['char_set'] = "utf8";
//$site['dbcollat'] = "utf8_general_ci";

$host	= 'localhost';
$port	= '3306';
$login	= 'openemr';
$pass	= 'pass';
$dbase	= 'openemr';

//Added ability to disable
//utf8 encoding - bm 05-2009
global $disable_utf8_flag;
$disable_utf8_flag = false;

$sqlconf = array();
global $sqlconf;
$sqlconf["host"]= $host;
$sqlconf["port"] = $port;
$sqlconf["login"] = $login;
$sqlconf["pass"] = $pass;
$sqlconf["dbase"] = $dbase;
//////////////////////////
//////////////////////////
//////////////////////////
//////DO NOT TOUCH THIS///
$config = 1; /////////////
//////////////////////////
//////////////////////////
//////////////////////////
?>
