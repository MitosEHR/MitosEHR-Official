<?php 
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');
require_once('../library/site_setup/class.inc.php');
// *****************************************************************************************
// create an instance
// *****************************************************************************************
$install = new SiteSetup();
switch ($_REQUEST["task"]) {
	// *************************************************************************************
	// Test Connection Only
	// *************************************************************************************
	case "connTest":
		switch ($_REQUEST['conn']) {
			case "root":
				$install->dbHost 	= $_REQUEST['dbHost'];
				$install->dbPort 	= $_REQUEST['dbPort'];
				$install->rootUser 	= $_REQUEST['rootUser'];
				$install->rootPass 	= $_REQUEST['rootPass'];
				$install->connTest  = 'root';
				$install->testConn();
			break;
			case "user":
				$install->dbHost 	= $_REQUEST['dbHost'];
				$install->dbPort 	= $_REQUEST['dbPort'];
				$install->dbName 	= $_REQUEST['dbName'];
				$install->dbUser 	= $_REQUEST['dbUser'];
				$install->dbPass 	= $_REQUEST['dbPass'];
				$install->connTest  = 'user';
				$install->testConn();
			break;
		}
  	break;	// *************************************************************************************
	// Install process
	// *************************************************************************************
	case "install":
		// *********************************************************************************
		// Installation with Root Access
		// *********************************************************************************
		if ($_REQUEST['rootFieldset-checkbox'] == 'on'){
			$install->siteName 		= str_replace(' ',"_",$_REQUEST['siteName']);
			$install->dbHost 		= $_REQUEST['dbHost'];
			$install->dbPort 		= $_REQUEST['dbPort'];
			$install->dbName 		= strtolower($_REQUEST['dbName']);
			$install->dbUser 		= $_REQUEST['dbUser'];
			$install->dbPass 		= $_REQUEST['dbPass'];
			$install->rootUser 		= $_REQUEST['rootUser'];
			$install->rootPass 		= $_REQUEST['rootPass']; 
			$install->adminUser 	= $_REQUEST['adminUser'];
			$install->adminPass 	= $_REQUEST['adminPass'];
			$install->connTest  	= 'root';
			$install->rootInstall();
		}
		if ($_REQUEST['dbuserFieldset-checkbox'] == 'on'){
			// *****************************************************************************
			// Installation with Database Access
			// *****************************************************************************
			$install->siteName 		= str_replace(' ',"_",$_REQUEST['siteName']);
			$install->dbUser 		= $_REQUEST['dbUser'];
			$install->dbPass 		= $_REQUEST['dbPass'];
			$install->dbHost 		= $_REQUEST['dbHost'];
			$install->dbPort 		= $_REQUEST['dbPort'];
			$install->dbName		= $_REQUEST['dbName'];
			$install->adminUser 	= $_REQUEST['adminUser'];
			$install->adminPass 	= $_REQUEST['adminPass'];
			$install->connTest  	= 'user';
			$install->dbInstall();
		}
	break;
}
?>

