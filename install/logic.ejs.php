<?php 

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
				$install->dbname 	= $_REQUEST['dbName'];
				$install->dbUser 	= $_REQUEST['dbUser'];
				$install->dbPass 	= $_REQUEST['dbPass'];
				$install->connTest  = 'user';
				$install->testConn();
			break;
		}
  	break;	// *************************************************************************************
	// Installation with Root Access
	// *************************************************************************************
	case "rootInstall":
		$install->siteName 	= $post['siteName'];
		$install->dbHost 	= $post['dbHost'];
		$install->dbPort 	= $post['dbPort'];
		$install->dbName 	= $post['dbName'];
		$install->rootUser 	= $post['rootUser'];
		$install->rootPass 	= $post['rootPass']; 
		$install->adminUser = $post['adminUser'];
		$install->adminPass = $post['adminPass'];
		
		$install->rootInstall();
	break;
	// *************************************************************************************
	// Installation with Database Access
	// *************************************************************************************
	case "dbInstall":
		$install->siteName 	= $post['siteName'];
		$install->dbUser 	= $post['dbUser'];
		$install->dbPass 	= $post['dbPass'];
		$install->dbHost 	= $post['dbHost'];
		$install->dbPort 	= $post['dbPort'];
		$install->dbName 	= $post['dbName'];
		$install->adminUser = $post['adminUser'];
		$install->adminPass = $post['adminPass'];
		
		$install->dbInstall();
	break;
}


?>

