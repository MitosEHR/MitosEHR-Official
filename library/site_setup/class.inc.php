<?php
//*********************************************************************************************
// setup class v0.0.1
// Description: A Class to setup sites dir easier. 
// 
// Author: Ernesto Rodriguez
//*********************************************************************************************

error_reporting(0);

/////////////////////////////////////
// ENABLE PHP ERRORS FOR DEBUGGING //
/////////////////////////////////////
// error_reporting(E_ALL); 		   //
// ini_set("display_errors", 0);   //
/////////////////////////////////////
   
class SiteSetup {
	private $conn;
	private $err;
	private $sitesDir = 'sites';
	private $siteName = 'defaultTest';
	private $dbPrefix;
	private $dbUser = 'mitosehr';
	private $dbPass = 'pass';
	private	$dbHost = 'localhost';
	private	$dbPort = '3306';
	private	$dbName = 'mitosehr';
	private	$rootUser = 'root';
	private	$rootPass = 'pass'; 
	private $AESkey;
	private $adminUser = 'admin';
	private $adminPass = 'pass';

	//*****************************************************************************************
	// Ckeck sites folder cmod 777
	//*****************************************************************************************
	function check_perms(){
		chmod($this->sitesDir, 0777);
	    clearstatcache();
    	if(substr(sprintf('%o', fileperms($this->sitesDir)), -4) == '0777'){
    		return true; 
    	} 
	}

	//*****************************************************************************************
	// Fetch the last error.
	// getError - Get the error for a statement, if any.
	// getConError - Get the connection error, if any.
	// return: Only the error in a array
	//
	// Author: Gino Rivera
	//*****************************************************************************************
	function getError(){
		if (!$this->err){
			return $this->conn->errorInfo();
		} else {
			return $this->err;
		}
	}
	//*****************************************************************************************
	// Send last error as json back to ExtJs
	//*****************************************************************************************
	function displayError(){
		if($this->err){
			die ("{success:false,errors:{reason:'Error: ".$this->err."'}}");
		}else{
			$error = $this->conn->errorInfo();
			if($error[2]){
				die ("{success:false,errors:{reason:'Error: ".$error[1]." - ".$error[2]."'}}");
			}	
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
		$this->conn = new PDO("mysql:host=".$this->dbHost.";port=".$this->dbPort,$this->rootUser,$this->rootPass);
		//-------------------------------------------------------------------------------------
		// send error callback if conn can't be stablish
		//-------------------------------------------------------------------------------------
		} catch (PDOException $e) {
    		$this->err = $e->getMessage();
    		if($e != null){
				$this->displayError();
			}
		}
	}
	
	//*****************************************************************************************
	// If database exist connect to it 
	//*****************************************************************************************
	function DatabaseConn() {
		try {
			//---------------------------------------------------------------------------------
			// connection to mysql with database and user
			//---------------------------------------------------------------------------------
			$this->conn = new PDO("mysql:host=".$this->dbHost.";
								   		 port=".$this->dbPort.";
								 	   dbname=".$this->dbName,$this->dbUser,$this->dbPass);
		} catch (PDOException $e) {
    		$this->err = $e->getMessage();
			if($e != null){
				$this->displayError();
			}
		}
	}
	
	//*****************************************************************************************
	// Create new database and dump data
	//*****************************************************************************************
	function createDatabase() {
		$this->conn->exec("CREATE DATABASE ".$this->dbName."");
		return $this->displayError();
	} // end function createDataBase
	
	//*****************************************************************************************
	// Create new database user
	//*****************************************************************************************
	function createDatabaseUser() {
		$this->conn->exec("GRANT ALL PRIVILEGES ON ".$this->dbName.".* 
					 					  		TO '".$this->dbUser."'@'localhost'
   					 		   		 IDENTIFIED BY '".$this->dbPass."' 
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

			//---------------------------------------------------------------------------------
			// and check for errors
			//---------------------------------------------------------------------------------
			if ($this->conn->errorInfo()) {
				$this->displayError();
			} else {
				//-----------------------------------------------------------------------------
				// Grats! we made it! Database created
				//-----------------------------------------------------------------------------
				return true;
			}
		} else {
			//---------------------------------------------------------------------------------
			// error if sitesetup.sql not found
			//---------------------------------------------------------------------------------
			die("{success:false,errors:{reason:'Error: Unable to find install.sql inside /sql/ directory'}}");
		}
	}

	//*****************************************************************************************
	// set Default Language  //  TODO  //
	//*****************************************************************************************
	function defaultLanguage($langauge) {
	 	//-------------------------------------------------------------------------------------
	 	// ask Gino how we wanna do this!
	 	//-------------------------------------------------------------------------------------
		$recordset = $this->conn->query("");
	}
	
	//*****************************************************************************************
	// Create new AES Key
	//*****************************************************************************************
	function createRandomKey() {
	    $chars = "abcdefghijkmnopqrstuvwxyz023456789";
	    srand((double)microtime()*1000000);
	    $i = 0;
	    $key = "" ;
	    while ($i <= 31) {
	        $num = rand() % 33;
	        $tmp = substr($chars, $num, 1);
	        $key = $key . $tmp;
	        $i++;
	    }
		$this->AESkey = $key;
	}
	
	//*****************************************************************************************
	// Bild the new conf.php
	//*****************************************************************************************
	function buildConf(){
		if (file_exists($conf = "library/site_setup/conf.php")){
			$buffer = file_get_contents($conf);
			$search  = array('%host%','%user%', '%pass%', '%db%', '%port%', '%key%');
			$replace = array($this->dbHost, $this->dbUser, $this->dbPass, $this->dbName, $this->dbPort, $this->AESkey);
			$this->newConf = str_replace($search, $replace, $buffer);
		}else{
			echo ("Unable to find default conf.pgp file inside library/site_setup/ directory");
		}
	} 
	
	//*****************************************************************************************
	// Create site conf file
	//*****************************************************************************************
	function createSiteConf() {
		if($this->check_perms()){
			$workingDir = $this->sitesDir."/".$this->siteName;
			if (!file_exists($workingDir)){	
				mkdir($workingDir, 0777, true);
				chmod($workingDir, 0777);
				$conf_file = ($workingDir."/conf.php");
				$handle = fopen($conf_file, "w");
				fwrite($handle, $this->newConf);
				fclose($handle);
				chmod($conf_file, 0644);
			}else{
				die ("{success:false,errors:{reason:'Error: The site ".$this->siteName." already exist'}}");
			}
		}else{
			die ("{success:false,errors:{reason:'Error: Unable to write on sites folder'}}");
		}
	}
	
	//*****************************************************************************************
	// create Admin user and AES encrypted password using site AESkey
	//*****************************************************************************************
	function adminUser(){
		require_once("library/phpAES/AES.class.php");
		$admin = $this->adminUser;
		$aes = new AES($this->AESkey);
		$ePass = $aes->encrypt($this->adminPass);
		$this->conn->exec("INSERT INTO users
							  	   SET username 	='".$admin."',
							  	       fname		='Adminstrator',
							  	  	   password 	='".$ePass."',
							  	       authorized 	='1'");
		if ($this->conn->errorInfo()) {
				$this->displayError();
		}
	}
} // end class siteSetup


//////////////////////////
// For dry run tests!!! //
//////////////////////////

// create an instance
$setup = new SiteSetup();
// connect to as a root
$setup->rootDatabaseConn();
// creates the mitos database
$setup->createDatabase();
// creates the mitos database user
$setup->createDatabaseUser();
// connect to user database
$setup->DatabaseConn();
// dumps the install.sql into user database
$setup->sqldump();
// generate a random 32bit key
$setup->createRandomKey();
// builds de conf file
$setup->buildConf();
// safe the conf fine into the new site folder
$setup->createSiteConf();
// create a admin user with the AES key generaded for the conf file
$setup->adminUser();

?>
