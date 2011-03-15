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
	// Connection error handeler
	//*************************************************************************************
	function connError($conn) {
		$conn->errorInfo();
		$errorCode = $error[1];
		$errorMsg =  $error[2];
		echo "{ success: false, errors: { reason: 'Error: ".$errorCode." - ".$errorMsg."' }}";
	 	return;
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
			connError($conn);
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
		//---------------------------------------------------------------------------------
		// if connection exist Create Databse and dump sql data
		//---------------------------------------------------------------------------------
		if ($conn){
			$conn->exec("CREATE DATABASE ".$db_name."");
			//-------------------------------------------------------------------------
			// if no error found look for sitesetup.qsl file
			//-------------------------------------------------------------------------
			if (!$conn->errorInfo()) {
				if(file_exists("sitesetup.sql")) {
					//-----------------------------------------------------------------
					// if sitesetup.sql found, open it, executed, and close it
					//-----------------------------------------------------------------
					$sqlDump = fopen("sitesetup.sql", "r");
					$conn->exec($sqlDump);
					fclose($sqlDump);
					if ($conn->errorInfo()) {
						connError($conn);
					}
				} else {
					//-----------------------------------------------------------------
					// error if sitesetup.sql not found
					//-----------------------------------------------------------------
					die("{ success: false, errors: { reason: 'Error: Unable to find sitesetup.sql' }}");
				}
			} else {
				//-----------------------------------------------------------------
				// if Can't CREATE DATABASE send error
				//-----------------------------------------------------------------
				connError($conn);
			}
		} else {
			//-------------------------------------------------------------------------
			// if no $conn just return false
			//-------------------------------------------------------------------------
			return false;
		}
	}

} // end class siteSetup

?>
