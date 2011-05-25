<?php 
//if(!defined('_MitosEXEC')) die('No direct access allowed.');
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

require_once('../library/site_setup/class.inc.php');


error_reporting(E_ALL); 		   //
ini_set("display_errors", 0); 

// create an instance
$install = new SiteSetup();

switch ($_GET['task']) {
	// *************************************************************************************
	// Test Connection Only
	// *************************************************************************************
	case "connTest":
		$install->dbHost = $_REQUEST['dbHost'];
		$install->dbPort = $_REQUEST['dbPort'];
		switch ($_GET['conn']) {
			case "rott":
				$install->rooUser = $_REQUEST['rootUser'];
				$install->rootPass = $_REQUEST['rootPass'];
			break;
			case "user":
				$install->dbUser = $_REQUEST['dbUser'];
				$install->dbPass = $_REQUEST['dbPass'];
			break;
		}
  		$install->testConn();
  	break;	// *************************************************************************************
	// Installation with Root Access
	// *************************************************************************************
	case "rootInstall":
		$install->siteName = 'defaultTest';
		$install->dbHost = 'localhost';
		$install->dbPort = '3306';
		$install->dbName = 'mitosehr';
		$install->rootUser = 'root';
		$install->rootPass = 'pass'; 
		$install->adminUser = 'admin';
		$install->adminPass = 'pass';
		
		$install->rootInstall();
	break;
	// *************************************************************************************
	// Installation with Database Access
	// *************************************************************************************
	case "dbInstall":
		$install->siteName = 'defaultTest';
		$install->dbUser = 'mitosehr';
		$install->dbPass = 'pass';
		$install->dbHost = 'localhost';
		$install->dbPort = '3306';
		$install->dbName = 'mitosehr';
		$install->adminUser = 'admin';
		$install->adminPass = 'pass';
		
		$install->dbInstall();
	break;
}


?>

