<?php
/* 
 * layoutEngine.class.php
 * 
 * @DESCRIPTION: This class object will create dynamic ExtJS v4 form, previuosly created or edited 
 * from the Layout Form Editor. Gathering all it's data and parameters from the layout_options table. 
 * Most of the structural database table was originally created by OpenEMR developers.
 * 
 * version: 0.0.1 
 * author: Gino Rivera Falu
 */

class layoutEngine {

	private $conn;
	
	//**********************************************************************
	// Connect to the database just like dbHelper
	//
	// Author: Gino Rivera
	//**********************************************************************
	function __construct() {
		error_reporting(0);
		try {
    		$this->conn = new PDO( "mysql:host=" . $_SESSION['site']['db']['host'] . ";port=" . $_SESSION['site']['db']['port'] . ";dbname=" . $_SESSION['site']['db']['database'], $_SESSION['site']['db']['username'], $_SESSION['site']['db']['password'] );
		} catch (PDOException $e) {
    		$this->err = $e->getMessage();
		}
	}
	
}

?>