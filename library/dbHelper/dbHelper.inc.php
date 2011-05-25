<?php

/* db Helper v0.0.4 OOP
 * 
 * Description: A PDO helper for MitosEHR, containts custom function to manage the database
 * in MitosEHR. PDO is new in PHP v5 
 * 
 * The PHP Data Objects (PDO) extension defines a lightweight, 
 * consistent interface for accessing databases in PHP. 
 * Each database driver that implements the PDO interface can expose database-specific 
 * features as regular extension functions. Note that you cannot perform any database 
 * functions using the PDO extension by itself; 
 * you must use a database-specific PDO driver to access a database server.
 * 
 * PDO provides a data-access abstraction layer, which means that, 
 * regardless of which database you're using, you use the same functions to issue queries 
 * and fetch data. PDO does not provide a database abstraction; it doesn't rewrite 
 * SQL or emulate missing features. 
 * You should use a full-blown abstraction layer if you need that facility.
 * 
 * PDO ships with PHP 5.1, and is available as a PECL extension for PHP 5.0; 
 * PDO requires the new OO features in the core of PHP 5, and so will not 
 * run with earlier versions of PHP.
 * 
 * Author: Gino Rivera Falu
 * Ver: 0.0.3
 */

class dbHelper {
	
	private $sql_statement;
	private $conn;
	private $err;
	
	//**********************************************************************
	// Connect to the database
	// $db = new $dbHelper();
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

	//**********************************************************************
	// Set the SQL Statement
	//
	// Author: Gino Rivera
	//**********************************************************************	
	function setSQL($sql){
		$this->sql_statement = $sql;
	}
		
	//**********************************************************************
	// Simple SQL Stament, with no Event LOG injection
	// $dbHelper->execStatement();
	// return: Array of records, if error ocurred return the error instead
	// foreach (sqlStatement($sql) as $urow) {
	//
	// Author: Gino Rivera
	//**********************************************************************
	function execStatement(){
		$recordset = $this->conn->query($this->sql_statement);
		$err = $this->conn->errorInfo();
		if(!$err[2]){
			return $recordset->fetchAll(PDO::FETCH_ASSOC);
		} else {
			return $err;
		}
	}
	
	//**********************************************************************
	// Simple exec SQL Stament, with no Event LOG injection
	// return: Array of errors, if any.
	//
	// Author: Gino Rivera
	//**********************************************************************
	function execOnly(){
		$this->conn->query($this->sql_statement);
		return $this->conn->errorInfo();
	}
	
	//**********************************************************************
	// Simple SQL Stament, with Event LOG injection
	// $dbHelper->exeLog();
	// return: Array of records + Inject the action on the event log
	// The Log Injection is automatic 
	// It tries to detect an insert, delete, alter and log the event
	//
	// Author: Gino Rivera
	//**********************************************************************
	function execLog(){
		$recordset = $this->conn->query( $this->sql_statement );

		// If the QUERY has INSERT, DELETE, ALTER then has to 
		// insert the event to the database.
		if (stristr($this->sql_statement, "INSERT") || 
			stristr($this->sql_statement, "DELETE") ||
			stristr($this->sql_statement, "UPDATE") || 
			stristr($this->sql_statement, "ALTER")){
			if (stristr($this->sql_statement, "INSERT")) { $eventLog = "Record insertion"; }
			if (stristr($this->sql_statement, "DELETE")) $eventLog = "Record deletion";
			if (stristr($this->sql_statement, "DELETE")) $eventLog = "Record update";
			if (stristr($this->sql_statement, "ALTER")) $eventLog = "Table alteration";
			// Prepare the SQL stament first, and then execute.
			$stmt = $this->conn->prepare("INSERT INTO log (facility, event, comments, user, patient_id, checksum) VALUES (:facility, :event, :comments, :user, :patient_id, :checksum)");
			$stmt->bindParam(':event', $eventLog, PDO::PARAM_STR);
			$stmt->bindParam(':comments', $this->sql_statement, PDO::PARAM_STR);
			$stmt->bindParam(':user', $_SESSION['user']['name'], PDO::PARAM_STR);
			$stmt->bindParam(':checksum', crc32($this->sql_statement), PDO::PARAM_STR);
			$stmt->bindParam(':facility', $_SESSION['site']['facility'], PDO::PARAM_STR);
			$stmt->bindParam(':patient_id', $_SESSION['patient']['id'], PDO::PARAM_INT);
			$stmt->execute();
		}
		return $this->conn->errorInfo();
	}

	//**********************************************************************
	// Inject directly to the LOG
	// $dbHelper->execEvent("Need to be audited!");
	// return: N/A
	//
	// Author: Gino Rivera
	//**********************************************************************
	function execEvent($eventLog){
	
		// Prepare the SQL stament first, and then execute.
		$stmt = $this->conn->prepare("INSERT INTO log (date, event, comments, user, patient_id) VALUES (:dtime, :event, :comments, :user, :patient_id)");
		$stmt->bindParam(':dtime', date(), PDO::PARAM_STR);
		$stmt->bindParam(':event', $eventLog, PDO::PARAM_STR);
		$stmt->bindParam(':comments', $this->$sql_statement, PDO::PARAM_STR);
		$stmt->bindParam(':user', $_SESSION['user']['name'], PDO::PARAM_STR);
		$stmt->bindParam(':patient_id', $_SESSION['patient']['id'], PDO::PARAM_INT);
		$stmt->execute();

	}
	
	//**********************************************************************
	// Fetch a recordset
	// return: Only one record array
	// $rec = $dbHelper->fetch($sql);
	// if ($rec['username'] == ""){
	//
	// Author: Gino Rivera
	//**********************************************************************
	function fetch(){
		// Get all the records
		$recordset = $this->conn->query( $this->sql_statement );
		return $recordset->fetch(PDO::FETCH_ASSOC);
	}
	
	//**********************************************************************
	// Fetch the last error.
	// getError - Get the error for a statement, if any.
	// 
	// return: If there was a problem with the connection it will return 
	// the error message, if the was not a connection problem, it will
	// return a array with the code and message.
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
	// rowCount
	// return: The number of rows in a table
	// $rec = $dbHelper->rowCount();
	// if ($rec['username'] == ""){
	//
	// Author: Ernesto Rodriguez
	//**********************************************************************
	function rowCount(){
	
		// Get all the records & count it.
		$recordset = $this->conn->query( $this->sql_statement );
		return $recordset->rowCount();
		
	}
	
	//**********************************************************************
	// Get last id from table
	// Usage: $dbHelper->lastRowId('','')
	//
	// Author: Ernesto Rodriguez
	//**********************************************************************
	function lastRowId($table, $id_col){
		// Get all the records & count it.
		$recordset = $this->conn->query("SELECT " . $id_col . " FROM " . $table . "  ORDER BY " . $id_col . " DESC");
		return $recordset->fetch(PDO::FETCH_ASSOC);
	}
	
	//**********************************************************************
	// Get last inserted id
	// Usage: $dbHelper->lastInsertedId();
	//
	// Author: Ernesto Rodriguez
	//**********************************************************************
	function lastInsertedId(){
		return $this->conn->lastInsertId();
	}
	
}

?>



