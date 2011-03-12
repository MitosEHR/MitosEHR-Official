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
	}
	 
	//*************************************************************************************
	// create site name folder inside /sites/
	//*************************************************************************************
	function createFolders($siteName) {
		mkdir("sites/" . $siteName, 0777);
	}
	
	//*************************************************************************************
	// handle database connection errors
	//*************************************************************************************
	function connError($conn){
		$conn->errorInfo();
		$errorCode = $error[1];
		$errorMsg =  $error[2];
	}
	
	//*************************************************************************************
	// create database
	//*************************************************************************************
	function createDataBase($db_server,$db_port,$db_name,$db_root,$db_rootPass) {
		//-------------------------------------------------
		// connection to mysql w/o database
		//-------------------------------------------------
		$conn = new PDO("mysql:host=".$db_server.";port=".$db_port,$db_root,$db_rootPass);
		if (!$conn){
			//-------------------------------------------------
			// error if cant stablish connection
			//-------------------------------------------------
			connError($conn);
		} else {
			if (!$conn->exec("CREATE DATABASE ".$db_name."")){
				//-------------------------------------------------
				// error if cant create database
				//-------------------------------------------------
				connError($conn);
			}
		}

	}

} // end class siteSetup

?>


