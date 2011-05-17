<?php
/* The MitosEHR Registry File, this will containt all the global variables
 * used by MitosEHR, putting here variable is a security risk please consider
 * first putting here variables that are not sesible to the database.
 * 
 * version 0.0.1
 * revision: N/A
 * author: Gino Rivera Falú
 */
 
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');
 
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
$_SESSION['site']['root'] = dirname(__FILE__);
$_SESSION['site']['url'] = "http://" . $_SERVER['HTTP_HOST'] . str_replace("/index.php", "", $_SERVER['PHP_SELF']);
$_SESSION['site']['facility'] = 'default'; // THIS IS A TEMP VARIABLE

//**********************************************************************
// Default Language Related variables
//**********************************************************************
$_SESSION['lang']['code'] = "en";
$_SESSION['lang']['language'] = "English (Standard)";

//**********************************************************************
// Directory related variables
//**********************************************************************
$_SESSION['dir']['zend'] = "ZendFramework-1.11.4";
$_SESSION['dir']['ext'] = "ext-4.0.0";
$_SESSION['dir']['AES'] = "phpAES";
$_SESSION['dir']['adoHelper'] = "dbHelper";
$_SESSION['dir']['ux'] = "library/".$_SESSION['dir']['ext']."/examples/ux";

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
$operating_systems = array  (
	// User Agent String will have a information about Os. Lets identify them.
	'Windows 3.11' => 'Win16',
	'Windows 95' => '(Windows 95)|(Win95)|(Windows_95)',
	'Windows 98' => '(Windows 98)|(Win98)',
	'Windows 2000' => '(Windows NT 5.0)|(Windows 2000)',
	'Windows XP' => '(Windows NT 5.1)|(Windows XP)',
	'Windows Server 2003 ' => '(Windows NT 5.2)',
	'Windows Vista ' => '(Windows NT 6.0)',
	'Windows 7' => '(Windows NT 7.0)',
	'Windows NT 4.0' => '(Windows NT 4.0)|(WinNT4.0)|(WinNT)|(Windows NT)',
	'Windows ME' => '(Windows 98)|(Win 9x 4.90)|(Windows ME)',
	'Open BSD' => 'OpenBSD',
	'Sun OS' => 'SunOS',
	'Linux' => '(Linux)|(X11)',
	'Mac OS' => '(Mac_PowerPC)|(Macintosh)',
	'QNX' => 'QNX',
	'BeOS' => 'BeOS',
	'OS/2' => 'OS/2',
);
// Match against our array of operating systems, To match
foreach($operating_systems as $current_os=>$found){
	if (eregi($found, $_SERVER['HTTP_USER_AGENT'])){
		$_SESSION['client']['os'] = $current_os;
		break;
	} else {
		$_SESSION['client']['os'] = 'Unknow';
	}
}

?>

