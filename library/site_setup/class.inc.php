<?php
//*********************************************************************************************
// setup class v0.0.1
// Description: A Class to setup sites dir easier. 
// 
// Author: Ernesto Rodriguez
//*********************************************************************************************

//*********************************************************************************************
// turn off all PDO error reportings
//*********************************************************************************************
error_reporting(1);

//*********************************************************************************************
// First... lets change to root directory and work there
//*********************************************************************************************
chdir($_SESSION['site']['root']);

class SiteSetup {
	
	private $conn;
	private $err;
	private $sitesDir = 'sites';
	private $dbPrefix;
	private $AESkey;
	var $siteName;
	var $connTest;
	var $dbUser;
	var $dbPass;
	var	$dbHost;
	var	$dbPort;
	var	$dbName;
	var	$rootUser;
	var	$rootPass; 
	var $adminUser;
	var $adminPass;
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
		if ($this->err || $this->conn->errorInfo()){
			if($this->err){
				$error = array('success' => false, 'jerror' => $this->err);
				echo json_encode($error, JSON_FORCE_OBJECT);
				exit;
			}else{
				$error = $this->conn->errorInfo();
				if($error[2]){
					$this->dropDatabase();
					$error = array('success' => false, 'jerror' => 'Error : '.$error[1].' - '.dataEncode($error[2]));
					echo json_encode($error, JSON_FORCE_OBJECT);
					exit;
				}	
			}
		}
	}

	//*****************************************************************************************
	// test databases connections
	//*****************************************************************************************
	function testConn() {
		switch ($this->connTest) {
			case 'user':
				$this->DatabaseConn();
			break;
			case 'root';
				$this->rootDatabaseConn();
			break;
		}
		if (!$this->displayError()){
			echo '{"success":true,"jerror":"Congratulation! Your Database Credentials are Valid"}';
			return;
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
	// Drop new database and dump data
	//*****************************************************************************************
	function dropDatabase() {
		$this->conn->exec("DROP DATABASE ".$this->dbName."");
	}
	
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
			$this->displayError();
		} else {
			//---------------------------------------------------------------------------------
			// error if sitesetup.sql not found
			//---------------------------------------------------------------------------------
			$this->dropDatabase();
			exit ("{success:false,errors:{reason:'Error: Unable to find install.sql inside /sql/ directory' PHP is looking her ".getcwd()."}}");
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
			$this->dropDatabase();
			exit ("Unable to find default conf.php file inside library/site_setup/ directory. PHP is looking her ".getcwd()."");
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
				if(!file_exists($conf_file)){
					exit ("{success:false,errors:{reason:'Error: The conf.php file for ".$this->siteName." could not be created.'}}");
				}
			}else{
				$this->dropDatabase();
				exit ("{success:false,errors:{reason:'Error: The site ".$this->siteName." already exist'}}");
			}
		}else{
			$this->dropDatabase();
			exit ("{success:false,errors:{reason:'Error: Unable to write on sites folder. PHP is looking her ".getcwd()."'}}");
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
		if($this->conn->errorInfo()){
			$this->displayError();
		}else{
			echo "{ success: true, message: 'Congratulation! MitosEHR is installed, please refresh your browser to Login' }";
		}
	}
	
	//*****************************************************************************************
	// Method to install a site with root access and creating database
	//*****************************************************************************************
	function rootInstall(){
		$this->testConn();
		$this->createDatabase();
		$this->createDatabaseUser();
		$this->DatabaseConn();
		$this->sqldump();
		$this->createRandomKey();
		$this->buildConf();
		$this->createSiteConf();
		$this->adminUser();
	}
	//*****************************************************************************************
	// Method to install a site with Databse User access
	//*****************************************************************************************
	function dbInstall(){
		$this->testConn();
		$this->DatabaseConn();
		$this->sqldump();
		$this->createRandomKey();
		$this->buildConf();
		$this->createSiteConf();
		$this->adminUser();
	}

} // end class siteSetup
?>
