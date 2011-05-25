<?php
//***************************************************************************************
// setup class v0.0.1
// Description: A Class to setup sites dir easier. 
// 
// Author: Ernesto Rodriguez
//***************************************************************************************


error_reporting(0);   
/////////////////////////////////////
// ENABLE PHP ERRORS FOR DEBUGGING //
/////////////////////////////////////
//error_reporting(E_ALL); 
//ini_set("display_errors", 0); 
/////////////////////////////////////
   

class SiteSetup {
	private $conn;
	private $sites_folder = 'sites';
	private $siteName = 'default';
	private $siteDbPrefix;
	private $siteDbUser = 'mitosehr';
	private $siteDbPass = 'pass';
	private	$db_server = 'localhost';
	private	$db_port = '3306';
	private	$db_name = 'mitosehr';
	private	$db_rootUser = 'root';
	private	$db_rootPass = 'pass'; 
	private $AESkey;
	private $userPass = 'pass';
	private $err;

	//*****************************************************************************************
	// Ckeck sites folder cmod 777
	//*****************************************************************************************
	function check_perms(){
		chmod($this->sites_folder, 0777);
	    clearstatcache();
    	if(substr(sprintf('%o', fileperms($this->sites_folder)), -4) == '0777'){
    		return true; 
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
		if (!$this->err){
			return $this->conn->errorInfo();
		} else {
			return $this->err;
		}
	}
	//**********************************************************************
	// Send last error as json back to ExtJs
	//**********************************************************************
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
		$this->conn = new PDO("mysql:host=".$this->db_server.";port=".$this->db_port,$this->db_rootUser,$this->db_rootPass);
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
			//-------------------------------------------------------------------------------------
			// connection to mysql with database and user
			//-------------------------------------------------------------------------------------
			$this->conn = new PDO("mysql:host=".$this->db_server.";
								   		 port=".$this->db_port.";
								 	   dbname=".$this->db_name,$this->siteDbUser,$this->siteDbPass);
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
		$this->conn->exec("CREATE DATABASE ".$this->db_name."");
		return $this->displayError();
	} // end function createDataBase
	
	//*****************************************************************************************
	// Create new database user
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
			$replace = array($this->db_server, $this->siteDbUser, $this->siteDbPass, $this->db_name, $this->db_port, $this->AESkey);
			$this->newConf = str_replace($search, $replace, $buffer);
		}else{
			echo ("Unable to find default conf.pgp file inside library/site_setup/");
		}
	} 
	
	//*****************************************************************************************
	// Create site conf file
	//*****************************************************************************************
	function createSiteConf() {
		if($this->check_perms()){
			$newdir = $this->sites_folder."/".$this->siteName;
			if (!file_exists($newdir)){	
				mkdir($newdir, 0777, true);
				chmod($newdir, 0777);
				$conf_file = ($newdir."/conf.php");
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
	// create Admin user and password
	//*****************************************************************************************
	function adminUser(){
		require_once("library/phpAES/AES.class.php");
		$aes = new AES($this->AESkey);
		$ePass = $aes->encrypt($this->userPass);
		$this->conn->exec("INSERT INTO users
							  	   SET username 	='admin',
							  	       fname		='Adminstrator',
							  	  	   password 	='".$ePass."',
							  	       authorized 	='1'");
		if ($this->conn->errorInfo()) {
				$this->displayError();
		}
	}
} // end class siteSetup

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
