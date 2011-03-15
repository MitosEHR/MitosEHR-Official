<?php
/* setup class v0.0.1
 * Description: A Class to setup sites dir much easier. 
 * 
 * Author: Ernesto Rodriguez
 */
class SiteSetup {
	
	// Globals inside he Class
	var $siteName;
	var $siteDbPrefix;
	var $siteDbUser;
	var $siteDbPass;

	//*************************************************************************************
	// ckeck cmod 777
	//*************************************************************************************
	function check_perms($path){
	    clearstatcache();
    	$configmod = substr(sprintf('%o', fileperms($path)), -4);
		return true; 
	}

	//*************************************************************************************
	// create site name folder inside /sites/
	//*************************************************************************************
	function createFolders($siteName) {
		mkdir("sites/" . $siteName, 0777);
		return true;
	}

	//*************************************************************************************
	// Database connection and error handeler
	//*************************************************************************************
	function databaseConn($db_server,$db_port,$db_name,$db_rootUser,$db_rootPass) {
		//---------------------------------------------------------------------------------
		// connection to mysql w/o database
		//---------------------------------------------------------------------------------
		$conn = new PDO("mysql:host=".$db_server.";port=".$db_port,$db_rootUser,$db_rootPass);
		//---------------------------------------------------------------------------------
		// send error callback if conn can't be stablish
		//---------------------------------------------------------------------------------
		if (!$conn){
			$conn->errorInfo();
			$errorCode = $error[1];
			$errorMsg =  $error[2];
			echo "{ success: false, errors: { reason: 'Error: ".$errorCode." - ".$errorMsg." }}";
	 		return;
		} else {
			return $conn;
		}
	}

	//*************************************************************************************
	// create database
	//*************************************************************************************
	function createDataBase($db_server,$db_port,$db_name,$db_rootUser,$db_rootPass) {
		//---------------------------------------------------------------------------------
		// connection to mysql w/o database
		//---------------------------------------------------------------------------------
		databaseConn($db_server,$db_port,$db_name,$db_rootUser,$db_rootPass);
		if ($conn){
			$conn->exec("CREATE DATABASE ".$db_name."");
			return true;
		} else {
			return false;
		}

	}

} // end class siteSetup

?>


