<?php
class SiteSetup {
	var $siteName;
	var $siteDbPrefix;
	var $siteDbUser;
	var $siteDbPass;
//********************************************************
// ckeck cmod 777
//********************************************************
function check_perms($path){
    clearstatcache();
    $configmod = substr(sprintf('%o', fileperms($path)), -4); 
} 
//********************************************************
// create site name folder inside /sites/
//********************************************************
function createFolders($siteName) {
	mkdir("sites/" . $siteName, 0777);
}
//********************************************************
// create database
//********************************************************
function createDataBase($db_server,$db_port,$db_name,$db_root,$db_rootPass) {
	$conn = new PDO("mysql:host=".$db_server.";port=".$db_port,$db_root,$db_rootPass);
	if ($conn->exec("CREATE DATABASE ".$db_name."")){
	} else {
		$error = 	 $conn->errorInfo();
		$errorCode = $error[1];
		$errorMsg =  $error[2];
	}
}

	
} // end class siteSetup

?>


