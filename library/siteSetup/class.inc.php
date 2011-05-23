<?php
/* setup class v0.0.1
 * Description: A Class to setup sites dir much easier. 
 * 
 * Author: Ernesto Rodriguez
 */
class SiteSetup {
	// Globals vars inside the Class
	private $conn;
	private $path;
	private $siteName;
	private $siteDbPrefix;
	private $siteDbUser;
	private $siteDbPass;
	private	$db_server;
	private	$db_port;
	private	$db_name;
	private	$db_rootUser;
	private	$db_rootPass;

	//*****************************************************************************************
	// ckeck cmod 777
	//*****************************************************************************************
	function check_perms(){
	    clearstatcache();
    	$configChmod = substr(sprintf('%o', fileperms($this->path)), -4);
		return true; 
	}

	//*****************************************************************************************
	// create site name folder inside /sites/
	//*****************************************************************************************
	function createFolders() {
		mkdir("sites/" . $this->siteName, 0777);
		return true;
	}

	//*****************************************************************************************
	// Connection error handeler
	//*****************************************************************************************
	function connError() {
		$this->conn->errorInfo();
		$errorCode = $error[1];
		$errorMsg =  $error[2];
		echo "{success:false,errors:{reason:'Error:".$errorCode." - ".$errorMsg."'}}";
	 	return;
	}
	
	//*****************************************************************************************
	// Database connection and error handeler
	//*****************************************************************************************
	function newDatabaseConn() {
		//-------------------------------------------------------------------------------------
		// connection to mysql w/o database
		//-------------------------------------------------------------------------------------
		$this->conn = new PDO("mysql:host=".$this->db_server.";port=".$this->db_port,$this->db_rootUser,$this->db_rootPass);
		//-------------------------------------------------------------------------------------
		// send error callback if conn can't be stablish
		//-------------------------------------------------------------------------------------
		if (!$this->conn){
			$this->connError();
		} else {
			return true;
		}
	}
	
	//*****************************************************************************************
	// If database exist connect to it 
	//*****************************************************************************************
	function oldDatabaseConn() {
		//-------------------------------------------------------------------------------------
		// connection to mysql with database and user
		//-------------------------------------------------------------------------------------
		$this->conn = new PDO("mysql:host=".$this->db_server.";
							   		 port=".$this->db_port.";
							 	   dbname=".$this->db_name,$this->siteDbUser,$this->siteDbPass);
		if (!$this->conn){
			$this->connError();
		} else {
			return true;
		}
	}
	
	//*****************************************************************************************
	// lets dump all the new data in the database
	//*****************************************************************************************
	function sqldump() {
		//-------------------------------------------------------------------------------------
		// lets look for sitesetup.qsl file
		//-------------------------------------------------------------------------------------
		if (file_exists("sitesetup.sql")) {
			//---------------------------------------------------------------------------------
			// if sitesetup.sql found, open it
			//---------------------------------------------------------------------------------
			if ($sqlDump = fopen("sql/mitosdb_structure.sql", "r")) {
				//-----------------------------------------------------------------------------
				// if was able to open, lets executed
				//-----------------------------------------------------------------------------
				$this->conn->exec($sqlDump);
				//-----------------------------------------------------------------------------
				// then close it
				//-----------------------------------------------------------------------------
				fclose($sqlDump);
				//-----------------------------------------------------------------------------
				// and check for errors
				//-----------------------------------------------------------------------------
				if ($this->conn->errorInfo()) {
					$this->connError();
				} else {
					//-------------------------------------------------------------------------
					// Grats! we made it! Database created
					//-------------------------------------------------------------------------
					return true;
				}
			} else {
				//-----------------------------------------------------------------------------
				// error if unable to open sitesetup.sql
				//-----------------------------------------------------------------------------
				die("{success:false,errors:{reason:'Error: Unable to open sitesetup.sql'}}");
			}
		} else {
			//---------------------------------------------------------------------------------
			// error if sitesetup.sql not found
			//---------------------------------------------------------------------------------
			die("{success:false,errors:{reason:'Error: Unable to find sitesetup.sql'}}");
		}
	}
	
	//*****************************************************************************************
	// create new database and dump data
	//*****************************************************************************************
	function createDatabase() {
		//-------------------------------------------------------------------------------------
		// connection to mysql w/o database
		//-------------------------------------------------------------------------------------
		$this->newDatabaseConn();
		//-------------------------------------------------------------------------------------
		// if connection exist Create Databse and dump sql data
		//-------------------------------------------------------------------------------------
		if ($this->conn){
			$this->conn->exec("CREATE DATABASE ".$this->db_name."");
			//---------------------------------------------------------------------------------
			// lets check for conn errors
			//---------------------------------------------------------------------------------
			if (!$this->conn->errorInfo()) {
				//-----------------------------------------------------------------------------
				// if no errors found lets create the database user and give him all privileges
				//-----------------------------------------------------------------------------
				$this->$conn->exec("GRANT ALL PRIVILEGES ON ".$this->db_name.".* 
							 					  		 TO '".$this->siteDbUser."'@'localhost'
	       					 		   		  IDENTIFIED BY '".$this->siteDbPass."' 
	       					 	   		  WITH GRANT OPTION;");
				//-----------------------------------------------------------------------------
				// lets check for conn errors
				//-----------------------------------------------------------------------------
				if (!$this->conn->errorInfo()) {
					//-------------------------------------------------------------------------
					// if no error found try to connect using new user 
					//-------------------------------------------------------------------------
					$this->conn = new PDO("mysql:host=".$this->db_server.";
									 	   port=".$this->db_port.";
									 	 dbname=".$this->db_name,$this->siteDbUser,$this->siteDbPass);
					//-------------------------------------------------------------------------
					// lets check for conn errors
					//-------------------------------------------------------------------------
					if (!$this->conn->errorInfo()) {
						//---------------------------------------------------------------------
						// if no error found call sqldump funtion
						//---------------------------------------------------------------------
						$this->sqldump();
					} else {
						//---------------------------------------------------------------------
						// if Can't stablish connection as user, send error
						//---------------------------------------------------------------------
						$this->connError();
					}
				} else {
					//-------------------------------------------------------------------------
					// if Can't create the user, send error
					//-------------------------------------------------------------------------
					$this->connError();
				}
			} else {
				//-----------------------------------------------------------------------------
				// if Can't create the user, send error
				//-----------------------------------------------------------------------------
				$this->connError();
			}
		} else {
			//---------------------------------------------------------------------------------
			// if no $conn just return false
			//---------------------------------------------------------------------------------
			return false;
		}
	} // end function createDataBase
	
	//*****************************************************************************************
	// use existing database and dump data
	//*****************************************************************************************
	function useDatabase() {
		//-------------------------------------------------------------------------------------
		// connection to mysql with database
		//-------------------------------------------------------------------------------------
		$this->oldDatabaseConn();
		//-------------------------------------------------------------------------------------
		// if connection exist Create Databse and dump sql data
		//-------------------------------------------------------------------------------------
		if ($this->conn){
			//---------------------------------------------------------------------------------
			// if no conn error call sqldump function
			//---------------------------------------------------------------------------------
			sqldump($this->conn);
		} else {
			//---------------------------------------------------------------------------------
			// if no $conn just return false, error already haldled by oldDatabaseConn function
			//---------------------------------------------------------------------------------
			return false;
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
	
	//*****************************************************************************************
	// create site files
	//*****************************************************************************************
	function createSiteConf() {
		// create site conf.php inside current site folder
		$siteConf = tempnam("sites/".$this->siteName."conf.php");
		// change permission to 777
		chmod($siteConf, 0777);
		// open new site conf.php
		$handle = fopen($siteConf, "w");
		// write con.php with site configuration
		fwrite($handle, "writing to conf.php");
		// close file pointer
		fclose($handle);
		// change pernission back to 644
		chmod($this->siteConf, 0644);
		
	}
} // end class siteSetup

?>
