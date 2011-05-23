<?php
/* setup class v0.0.1
 * Description: A Class to setup sites dir much easier. 
 * 
 * Author: Ernesto Rodriguez
 */
/////////////////////////////////////
// ENABLE PHP ERRORS FOR DEBUGGING //
/////////////////////////////////////
error_reporting(E_ALL);            //
ini_set("display_errors", 1);      //
/////////////////////////////////////


class SiteSetup {
	// Globals vars inside the Class
	private $conn;
	private $sites_folder = 'sites';
	private $siteName = 'defaultTest';
	private $siteDbPrefix;
	private $siteDbUser = 'dbuser';
	private $siteDbPass = 'dbpass';
	private	$db_server = 'localhost';
	private	$db_port = '3306';
	private	$db_name = 'mitosehr';
	private	$db_rootUser = 'root';
	private	$db_rootPass = ''; 

	//*****************************************************************************************
	// ckeck sites folder cmod 777
	//*****************************************************************************************
	function check_perms(){
		chmod($this->sites_folder, 0777);
	    clearstatcache();
    	if(substr(sprintf('%o', fileperms($this->sites_folder)), -4) == '0777'){
    		return true; 
    	} 
	}

	//*****************************************************************************************
	// Database connection and error handeler
	//*****************************************************************************************
	function rootDatabaseConn() {
		try {
		//-------------------------------------------------------------------------------------
		// connection to mysql w/o database
		//-------------------------------------------------------------------------------------
		$this->conn = new PDO("mysql:host=".$this->db_server.";port=".$this->db_port,$this->db_rootUser,$this->db_rootPass);
		//-------------------------------------------------------------------------------------
		// send error callback if conn can't be stablish
		//-------------------------------------------------------------------------------------
		} catch (PDOException $e) {
    		$this->err = $e->getMessage();
		}
	}
	
	//*****************************************************************************************
	// If database exist connect to it 
	//*****************************************************************************************
	function DatabaseConn() {
		try {
			//-------------------------------------------------------------------------------------
			// connection to mysql with database and user
			//-------------------------------------------------------------------------------------
			$this->conn = new PDO("mysql:host=".$this->db_server.";
								   		 port=".$this->db_port.";
								 	   dbname=".$this->db_name,$this->siteDbUser,$this->siteDbPass);
		} catch (PDOException $e) {
    		$this->err = $e->getMessage();
		}
	}
	
	//**********************************************************************
	// Fetch the last error.
	// getError - Get the error for a statement, if any.
	// getConError - Get the connection error, if any.
	// return: Only the error in a array
	//
	// Author: Gino Rivera
	//**********************************************************************
	function getError(){
		return $this->conn->errorInfo();
	}
	function getConError(){
		return $this->err;
	}
	function displayError(){
		$error = $this->conn->errorInfo();
		if($error[2]){
			echo ("{success:false,errors:{reason:'Error: ".$error[1]." - ".$error[2]."'}}");
		}
	}
	
	//*****************************************************************************************
	// create new database and dump data
	//*****************************************************************************************
	function createDatabase() {
		$this->conn->exec("CREATE DATABASE ".$this->db_name."");
		return $this->displayError();
	} // end function createDataBase
	
	//*****************************************************************************************
	// create new database user
	//*****************************************************************************************
	function createDatabaseUser() {
		$this->conn->exec("GRANT ALL PRIVILEGES ON ".$this->db_name.".* 
					 					  		TO '".$this->siteDbUser."'@'localhost'
   					 		   		 IDENTIFIED BY '".$this->siteDbPass."' 
   					 	   		  	 WITH GRANT OPTION;");
		return $this->displayError();
	}
	
	//*****************************************************************************************
	// lets dump all the new data in the database
	//*****************************************************************************************
	function sqldump() {
		//-------------------------------------------------------------------------------------
		// lets look for sitesetup.qsl file
		//-------------------------------------------------------------------------------------
		if (file_exists($sqlFile = "sql/install.sql")) {
			
			$query = file_get_contents($sqlFile);
			//echo $query;
			$this->conn->query($query);

			//-----------------------------------------------------------------------------
			// and check for errors
			//-----------------------------------------------------------------------------
			if ($this->conn->errorInfo()) {
				$this->displayError();
			} else {
				//-------------------------------------------------------------------------
				// Grats! we made it! Database created
				//-------------------------------------------------------------------------
				return true;
			}
		} else {
			//---------------------------------------------------------------------------------
			// error if sitesetup.sql not found
			//---------------------------------------------------------------------------------
			die("{success:false,errors:{reason:'Error: Unable to find sitesetup.sql'}}");
		}
	}

	//*****************************************************************************************
	// set Default Language
	//*****************************************************************************************
	function defaultLanguage($langauge) {
	 	//-------------------------------------------------------------------------------------
	 	// ask Gino how we wanna do this!
	 	//-------------------------------------------------------------------------------------
		$recordset = $this->conn->query("");
		
	}
	
	function buildConf(){
		if (file_exists($conf = "library/site_setup/conf.php")){
			$buffer = file_get_contents($conf);
			$search  = array('%host%','%user%', '%pass%', '%db%', '%port%', '%key%');
			$replace = array($this->db_server, $this->siteDbUser, $this->siteDbPass, $this->db_name, $this->db_port, 'abcdefghijuklmno0123456789012345');
			$this->newConf = str_replace($search, $replace, $buffer);
		}else{
			echo ("Unable to find default conf.pgp file inside library/site_setup/");
		}
	} 
	
	//*****************************************************************************************
	// create site files
	//*****************************************************************************************
	function createSiteConf() {
		if($this->check_perms()){
			$newdir = $this->sites_folder."/".$this->siteName;
			if (!file_exists($newdir)){	
				mkdir($newdir, 0777, true);
				chmod($newdir, 0777);
				chdir($newdir);
				$conf_file = ("conf.php");
				$handle = fopen($conf_file, "w");
				fwrite($handle, $this->newConf);
				fclose($handle);
				chmod($conf_file, 0644);
			}else{
				echo ("The site ".$this->siteName." already exist");
			}
		}else{
			echo ("Unable to write on sites folder");
		}

	}
} // end class siteSetup

$setup = new SiteSetup();
/*
$setup->rootDatabaseConn();
$setup->createDatabase();
$setup->createDatabaseUser();
$setup->DatabaseConn();
$setup->sqldump();
$setup->buildConf();
$setup->createSiteConf();
*/
?>
