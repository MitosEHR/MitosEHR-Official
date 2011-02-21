<?php
/* The MitosEHR Registry File, this will containt all the global variables
 * used by MitosEHR, putting here variable is a security risk please consider
 * first putting here variables that are not sesible to the database.
 * 
 * version 0.0.1
 * revision: N/A
 * author: Gino Rivera Falu
 */
 
 session_name ( "MitosEHR" );
 session_start();
 
//**********************************************************************
// Read the SITES directory first
// To get the sqlconf.php
//**********************************************************************
$d = dir("../sites/");
while (false !== ($entry = $d->read())) {
	if ( $entry != "." && $entry != ".."){ $confs[] = $entry . "/sqlconf.php"; } 
	if ( $entry != "." && $entry != ".." && $entry == "default" ){ $default = $entry; }
	if ( $entry != "." && $entry != ".."){ $sites[] = $entry; }
}
$_SESSION['site']['sites'] = $sites;
$_SESSION['site']['default'] = $default;
$_SESSION['site']['sites_conf'] = $confs;

//**********************************************************************
// Site Setup Wizard Trigger
//**********************************************************************
$_SESSION['site']['setup'] = false;

//**********************************************************************
// Directory related variables
//**********************************************************************
$_SESSION['dir']['ext'] = "ext-4.0-pr1";
$_SESSION['dir']['AES'] = "phpAES";
$_SESSION['dir']['ADOdb'] = "adodb";
$_SESSION['dir']['adoHelper'] = "adoHelper";

//**********************************************************************
// Version related variables
//**********************************************************************
$_SESSION['ver']['codeName']= "Vega";
$_SESSION['ver']['major'] = '1';
$_SESSION['ver']['rev'] = '0';
$_SESSION['ver']['minor'] = '0 Development';

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
// Use the field name association intead of numbers
//**********************************************************************
define ('ADODB_FETCH_ASSOC',2); 

echo "<pre>";
print_r($_SESSION);
echo "</pre>";
?>

