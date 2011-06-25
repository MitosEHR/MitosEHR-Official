<?php
/* The MitosEHR Registry File, this will containt all the global variables
 * used by MitosEHR, putting here variable is a security risk please consider
 * first putting here variables that are not sesible to the database.
 * 
 * version 0.0.1
 * revision: N/A
 * author: GI Technologies, 2011
 */
 
//**********************************************************************
// Read the SITES directory first
// To get the conf.php
//**********************************************************************
// this returns the current folder and defined it as a root.
$d = dir("sites/");
while (false !== ($entry = $d->read())) {
	if ( $entry != "." && $entry != ".."){ $confs[] = $entry . "/conf.php"; } 
	if ( $entry != "." && $entry != ".." && $entry == "default" ){ $default = $entry; }
	if ( $entry != "." && $entry != ".."){ $sites[] = $entry; }
}
$_SESSION['site']['self'] = $_SERVER['PHP_SELF'];
$_SESSION['site']['sites'] = $sites;
$_SESSION['site']['sitesCount'] = count($sites);
$_SESSION['site']['sites_conf'] = $confs;
$_SESSION['site']['root'] = str_replace('\\','/',dirname(__FILE__));
$_SESSION['site']['url'] = "http://" . $_SERVER['HTTP_HOST'] . str_replace("/index.php", "", $_SERVER['PHP_SELF']);
$_SESSION['site']['facility'] = 'default'; // THIS IS A TEMP VARIABLE
//**********************************************************************
// Default Language Related variables
//**********************************************************************
$_SESSION['lang']['code'] = "en_US";
$_SESSION['lang']['language'] = "English (Standard)";
//**********************************************************************
// Directory related variables
//**********************************************************************
$_SESSION['dir']['ext'] = "ext-4.0.2";
$_SESSION['dir']['ext_cal'] = "extensible-1.5.0-beta1";
$_SESSION['dir']['AES'] = "phpAES";
$_SESSION['dir']['adoHelper'] = "dbHelper";
$_SESSION['dir']['ext_classes'] = "classes/ext";
//**********************************************************************
// Patient Related Variables
//**********************************************************************
$_SESSION['patient']['id'] = "";
$_SESSION['patient']['name'] = "";
//**********************************************************************
// Server related variables
//**********************************************************************
$_SESSION['server'] = $_SERVER;
$_SESSION['server']['OS'] = (strstr( strtolower($_SERVER['SERVER_SIGNATURE']), "win") ? "Windows" : "Linux");
//**********************************************************************
// Client related variables
//**********************************************************************
$_SESSION['client']['os'] = php_uname('s');

?>