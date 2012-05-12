<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File: Encounter.php
 * Date: 1/21/12
 * Time: 3:26 PM
 */
if(!isset($_SESSION)) {
	session_name("MitosEHR");
	session_start();
	session_cache_limiter('private');
}
include_once($_SESSION['site']['root'] . '/dataProvider/Patient.php');
include_once($_SESSION['site']['root'] . '/dataProvider/User.php');
include_once($_SESSION['site']['root'] . '/dataProvider/Services.php');
include_once($_SESSION['site']['root'] . '/classes/dbHelper.php');
class PoolArea
{
	/**
	 * @var dbHelper
	 */
	private $db;
	/**
	 * @var User
	 */
	private $user;
	/**
	 * @var Patient
	 */
	private $patient;
	/**
	 * @var Services
	 */
	private $services;

	function __construct()
	{
		$this->db      = new dbHelper();
		$this->user    = new User();
		$this->patient = new Patient();
		$this->services = new Services();
		return;
	}


	public function getPatientsArrivalLog(stdClass $params){

	}

	public function addPatientArrivalLog(stdClass $params){

	}

	public function updatePatientArrivalLog(stdClass $params){

	}

	public function removePatientArrivalLog(stdClass $params){

	}


}




//$e = new Medical();
//echo '<pre>';
//print_r($e->CheckImmunizations());

