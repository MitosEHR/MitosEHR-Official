<?php

class QueryDatabase
{
	private $_db;
	protected $_result;
	public $results;
	
	public function __construct()
	{
		$_db = new mysqli('hostname', 'username' ,'password', 'database');
		
		if ($_db->connect_error) {
			die('Connection Error (' . $_db->connect_errno . ') ' . $_db->connect_error);
		}
		
		return $_db;
	}
	
	public function getResults(stdClass $params)
	{
		
		$_db = $this->__construct();

		$_result = $_db->query("SELECT id, name, address, state FROM owners") or die('Connect Error (' . $_db->connect_errno . ') ' . $_db->connect_error);
		
		$results = array();
		
		while ($row = $_result->fetch_assoc()) {
			array_push($results, $row);
		}
		
		return $results;
	}
	
	public function createRecord(stdClass $params)
	{

		$_db = $this->__construct();
		if($stmt = $_db->prepare("INSERT INTO owners (name, address, state) VALUES (?, ?, ?)")) {
			
			$stmt->bind_param('sss', $name, $address, $state);
			
			$name = $_db->real_escape_string($params->name);
			$address = $_db->real_escape_string($params->address);
			$state = $_db->real_escape_string($params->state);
			
			$stmt->execute();
			
			$params->id = $_db->insert_id;
			
			$stmt->close();
		}
		
		
		return $params;
	}
	
	public function updateRecords(stdClass $params)
	{
		$_db = $this->__construct();
		
		if ($stmt = $_db->prepare("UPDATE owners SET name=?, address=?, state=? WHERE id=?")) {
			$stmt->bind_param('sssi', $name, $address, $state, $id);

			$name = $_db->real_escape_string($params->name);
			$address = $_db->real_escape_string($params->address);
			$state = $_db->real_escape_string($params->state);
			//cast id to int
			$id = (int) $params->id;
						
			$stmt->execute();
									
			$stmt->close();
		}

		return $params;
	}
	
	public function destroyRecord(stdClass $params)
	{
		$_db = $this->__construct();
		
		$id = $params->id;
		
		if(is_numeric($id)) {
			if($stmt = $_db->prepare("DELETE FROM owners WHERE id = ? LIMIT 1")) {
				$stmt->bind_param('i', $id);
				$stmt->execute();
				$stmt->close();
			}
		}
				
		return $this;
	}
	
	public function __destruct()
	{
		$_db = $this->__construct();
		$_db->close();
		
		return $this;
	}
}