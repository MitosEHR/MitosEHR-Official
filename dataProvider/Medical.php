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
class Medical
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
	private $services;

	function __construct()
	{
		$this->db      = new dbHelper();
		$this->user    = new User();
		$this->patient = new Patient();
		$this->services = new Services();
		return;
	}

	/*********************************************
	 * METHODS USED BY SENCHA                    *
	 *********************************************/
	/**
	 * @return mixed
	 */
	/*************************************************************************************************************/
	public function getImmunizationsList()
	{
		$sql = "SELECT * FROM codes WHERE code_type='100'";
		$this->db->setSQL($sql);
		return $this->db->fetchRecords(PDO::FETCH_ASSOC);
	}

	public function getPatientImmunizations(stdClass $params)
	{
		return $this->getImmunizationsByPatientID($params->pid);
	}

	public function addPatientImmunization(stdClass $params)
	{
		$data = get_object_vars($params);
		unset($data['id'],$data['alert']);
		$data['administered_date'] = $this->parseDate($data['administered_date']);
		$data['education_date']    = $this->parseDate($data['education_date']);
		$data['vis_date']          = $this->parseDate($data['vis_date']);
		$data['create_date']       = $this->parseDate($data['create_date']);
		$this->db->setSQL($this->db->sqlBind($data, 'patient_immunizations', 'I'));
		$this->db->execLog();
		$params->id = $this->db->lastInsertId;
		return $params;

	}

	public function updatePatientImmunization(stdClass $params)
	{
		$data = get_object_vars($params);
		$id = $data['id'];
		unset($data['id'],$data['alert']);
		$data['administered_date'] = $this->parseDate($data['administered_date']);
		$data['education_date']    = $this->parseDate($data['education_date']);
		$data['create_date']       = $this->parseDate($data['create_date']);
		$data['vis_date']          = $this->parseDate($data['vis_date']);
		$this->db->setSQL($this->db->sqlBind($data, "patient_immunizations", "U", "id='$id'"));
		$this->db->execLog();
		return $params;

	}

	/*************************************************************************************************************/
	public function getPatientAllergies(stdClass $params)
	{
		return $this->getAllergiesByPatientID($params->pid);
	}

	public function addPatientAllergies(stdClass $params)
	{
		$data = get_object_vars($params);
		unset($data['id'],$data['alert']);
		$data['begin_date']  = $this->parseDate($data['begin_date']);
		$data['end_date']    = $this->parseDate($data['end_date']);
		$data['create_date'] = $this->parseDate($data['create_date']);
		$this->db->setSQL($this->db->sqlBind($data, 'patient_allergies', 'I'));
		$this->db->execLog();
		$params->id = $this->db->lastInsertId;
		return $params;
	}

	public function updatePatientAllergies(stdClass $params)
	{
		$data = get_object_vars($params);
		$id = $data['id'];
		unset($data['id'],$data['alert']);
		$data['begin_date']  = $this->parseDate($data['begin_date']);
		$data['end_date']    = $this->parseDate($data['end_date']);
		$data['create_date'] = $this->parseDate($data['create_date']);
		$this->db->setSQL($this->db->sqlBind($data, "patient_allergies", "U", "id='$id'"));
		$this->db->execLog();
		return $params;

	}

	/*************************************************************************************************************/
	public function getMedicalIssues(stdClass $params)
	{
		return $this->getMedicalIssuesByPatientID($params->pid);
	}

	public function addMedicalIssues(stdClass $params)
	{
		$data = get_object_vars($params);
		unset($data['id'],$data['alert']);
		$data['begin_date']  = $this->parseDate($data['begin_date']);
		$data['end_date']    = $this->parseDate($data['end_date']);
		$data['create_date'] = $this->parseDate($data['create_date']);
		$this->db->setSQL($this->db->sqlBind($data, 'patient_issues', 'I'));
		$this->db->execLog();
		$params->id = $this->db->lastInsertId;
		return $params;
	}

	public function updateMedicalIssues(stdClass $params)
	{
		$data = get_object_vars($params);
		$id = $data['id'];
		unset($data['id'],$data['alert']);
		$data['begin_date']  = $this->parseDate($data['begin_date']);
		$data['end_date']    = $this->parseDate($data['end_date']);
		$data['create_date'] = $this->parseDate($data['create_date']);
		$this->db->setSQL($this->db->sqlBind($data, "patient_issues", "U", "id='$id'"));
		$this->db->execLog();
		return $params;

	}

	/*************************************************************************************************************/
	public function getPatientSurgery(stdClass $params)
	{
		return $this->getPatientSurgeryByPatientID($params->pid);
	}

	public function addPatientSurgery(stdClass $params)
	{
		$data = get_object_vars($params);
		unset($data['id'],$data['alert']);
		$data['begin_date']  = $this->parseDate($data['begin_date']);
		$data['end_date']    = $this->parseDate($data['end_date']);
		$data['create_date'] = $this->parseDate($data['create_date']);
		$this->db->setSQL($this->db->sqlBind($data, 'patient_surgery', 'I'));
		$this->db->execLog();
		$params->id = $this->db->lastInsertId;
		return $params;
	}

	public function updatePatientSurgery(stdClass $params)
	{
		$data = get_object_vars($params);
		$id = $data['id'];
		unset($data['id'],$data['alert']);
		$data['begin_date']  = $this->parseDate($data['begin_date']);
		$data['end_date']    = $this->parseDate($data['end_date']);
		$data['create_date'] = $this->parseDate($data['create_date']);
		$this->db->setSQL($this->db->sqlBind($data, "patient_surgery", "U", "id='$id'"));
		$this->db->execLog();
		return $params;

	}

	/*************************************************************************************************************/
	public function getPatientDental(stdClass $params)
	{
		return $this->getPatientDentalByPatientID($params->pid);
	}

	public function addPatientDental(stdClass $params)
	{
		$data = get_object_vars($params);
		unset($data['id'],$data['alert']);
		$data['begin_date']  = $this->parseDate($data['begin_date']);
		$data['end_date']    = $this->parseDate($data['end_date']);
		$data['create_date'] = $this->parseDate($data['create_date']);
		$this->db->setSQL($this->db->sqlBind($data, 'patient_dental', 'I'));
		$this->db->execLog();
		$params->id = $this->db->lastInsertId;
		return $params;
	}

	public function updatePatientDental(stdClass $params)
	{
		$data = get_object_vars($params);
		$id = $data['id'];
		unset($data['id'],$data['alert']);
		$data['begin_date']  = $this->parseDate($data['begin_date']);
		$data['end_date']    = $this->parseDate($data['end_date']);
		$data['create_date'] = $this->parseDate($data['create_date']);
		$this->db->setSQL($this->db->sqlBind($data, "patient_dental", "U", "id='$id'"));
		$this->db->execLog();
		return $params;

	}

	/*************************************************************************************************************/
	public function getPatientMedications(stdClass $params)
	{
		return $this->getPatientMedicationsByPatientID($params->pid);
	}

	public function addPatientMedications(stdClass $params)
	{
		$data = get_object_vars($params);
		unset($data['id'],$data['alert']);
		$data['begin_date']  = $this->parseDate($data['begin_date']);
		$data['end_date']    = $this->parseDate($data['end_date']);
		$data['create_date'] = $this->parseDate($data['create_date']);
		$this->db->setSQL($this->db->sqlBind($data, 'patient_medications', 'I'));
		$this->db->execLog();
		$params->id = $this->db->lastInsertId;
		return $params;
	}

	public function updatePatientMedications(stdClass $params)
	{
		$data = get_object_vars($params);
		$id = $data['id'];
		unset($data['id'],$data['alert']);
		$data['begin_date']  = $this->parseDate($data['begin_date']);
		$data['end_date']    = $this->parseDate($data['end_date']);
		$data['create_date'] = $this->parseDate($data['create_date']);
		$this->db->setSQL($this->db->sqlBind($data, "patient_medications", "U", "id='$id'"));
		$this->db->execLog();
		return $params;

	}

	/*************************************************************************************************************/
	public function getMedicationLiveSearch(stdClass $params)
	{
		$this->db->setSQL("SELECT id,
								  PROPRIETARYNAME,
								  PRODUCTNDC,
								  NONPROPRIETARYNAME,
								  ACTIVE_NUMERATOR_STRENGTH,
								  ACTIVE_INGRED_UNIT
                           	 FROM medications
                            WHERE PROPRIETARYNAME LIKE '$params->query%'
                               OR NONPROPRIETARYNAME LIKE '$params->query%'");
		$records =$this->db->fetchRecords(PDO::FETCH_ASSOC);
		$total = count($records);
		$records  = array_slice($records, $params->start, $params->limit);
		return array('totals'=> $total,
		             'rows'  => $records);
	}
	/*************************************************************************************************************/
	public function getImmunizationLiveSearch(stdClass $params)
	{
		$this->db->setSQL("SELECT id,
								  code,
								  code_text,
								  code_text_short

							FROM  immunizations
							WHERE code_text LIKE '$params->query%'
							   OR code      LIKE'$params->query%'");
        $records =$this->db->fetchRecords(PDO::FETCH_ASSOC);
		$total = count($records);
		$records  = array_slice($records, $params->start, $params->limit);
		return array('totals'=> $total,
		             'rows'  => $records);
	}
	/***************************************************************************************************************/

	public function getPatientLabsResults(stdClass $params)
	{
		$records = array();
		$this->db->setSQL("SELECT pLab.*, pDoc.url AS document_url
							 FROM patient_labs AS pLab
						LEFT JOIN patient_documents AS pDoc ON pLab.document_id = pDoc.id
							WHERE pLab.parent_id = '$params->parent_id'");
        $labs = $this->db->fetchRecords(PDO::FETCH_ASSOC);
		foreach($labs as $lab){
			$id = $lab['id'];
			$this->db->setSQL("SELECT observation_loinc, observation_value, unit
							     FROM patient_labs_results
							    WHERE patient_lab_id = '$id'");
			$lab['columns'] = $this->db->fetchRecords(PDO::FETCH_ASSOC);
			$lab['data'] = array();
			foreach($lab['columns'] as $column){
				$lab['data'][$column['observation_loinc']] = $column['observation_value'];
				$lab['data'][$column['observation_loinc'].'_unit'] = $column['unit'];
			}

			$records[] = $lab;
		}
		return $records;
	}


	public function addPatientLabsResult(stdClass $params)
	{
		$lab['pid'] = (isset($params->pid)) ? $params->pid : $_SESSION['patient']['pid'];
		$lab['uid'] = $_SESSION['user']['id'];
		$lab['document_id'] = $params->document_id;
		$lab['date'] = date('Y-m-d H:i:s');
		$lab['parent_id'] = $params->parent_id;
		$this->db->setSQL($this->db->sqlBind($lab,'patient_labs','I'));
		$this->db->execLog();
		$patient_lab_id = $this->db->lastInsertId;


		foreach($this->services->getLabObservationFieldsByParentId($params->parent_id) as $result){
			$foo = array();
			$foo['patient_lab_id'] = $patient_lab_id;
			$foo['observation_loinc'] = $result->loinc_number;
			$foo['observation_value'] = '-';
			$foo['unit'] = $result->default_unit;
			$this->db->setSQL($this->db->sqlBind($foo,'patient_labs_results','I'));
			$this->db->execOnly();
		}

		return $params;
	}


	public function updatePatientLabsResult(stdClass $params)
	{

		return $params;
	}


	public function deletePatientLabsResult(stdClass $params)
	{

		return $params;
	}


	/*********************************************
	 * METHODS USED BY PHP                       *
	 *********************************************/
	/**
	 * @param $pid
	 * @return array
	 */
	private function getImmunizationsByPatientID($pid)
	{
		$this->db->setSQL("SELECT * FROM patient_immunizations WHERE pid='$pid'");

		$records = array();
		foreach($this->db->fetchRecords(PDO::FETCH_ASSOC) as $rec){
			$rec['alert'] = ($rec['end_date'] == null || $rec['end_date'] == '0000-00-00 00:00:00') ? 0 : 1 ;
			$records[]= $rec;
		}
		return $records;
	}

	/**
	 * @param $eid
	 * @return array
	 */
	private function getImmunizationsByEncounterID($eid)
	{
		$this->db->setSQL("SELECT * FROM patient_immunizations WHERE eid='$eid'");
		return $this->db->fetchRecords(PDO::FETCH_ASSOC);
	}

	/**
	 * @param $pid
	 * @return array
	 */
	private function getAllergiesByPatientID($pid)
	{
		$this->db->setSQL("SELECT * FROM patient_allergies WHERE pid='$pid'");
		$records = array();
		foreach($this->db->fetchRecords(PDO::FETCH_ASSOC) as $rec){
			$rec['alert'] = ($rec['end_date']== null || $rec['end_date'] == '0000-00-00 00:00:00') ? 0 : 1 ;
			$records[]= $rec;
		}
		return $records;
	}

	/**
	 * @param $eid
	 * @return array
	 */
	private function getAllergiesByEncounterID($eid)
	{
		$this->db->setSQL("SELECT * FROM patient_allergies WHERE eid='$eid'");
		return $this->db->fetchRecords(PDO::FETCH_ASSOC);
	}

	/**
	 * @param $pid
	 * @return array
	 */
	private function getMedicalIssuesByPatientID($pid)
	{
		$this->db->setSQL("SELECT * FROM patient_issues WHERE pid='$pid'");
		$records = array();
		foreach($this->db->fetchRecords(PDO::FETCH_ASSOC) as $rec){
			$rec['alert'] = ($rec['end_date']== null || $rec['end_date'] == '0000-00-00 00:00:00') ? 0 : 1 ;
			$records[]= $rec;
		}

		return $records;
	}

	/**
	 * @param $eid
	 * @return array
	 */
	private function getMedicalIssuesByEncounterID($eid)
	{
		$this->db->setSQL("SELECT * FROM patient_issues WHERE eid='$eid'");
		return $this->db->fetchRecords(PDO::FETCH_ASSOC);
	}

	/**
	 * @param $pid
	 * @return array
	 */
	private function getPatientSurgeryByPatientID($pid)
	{
		$this->db->setSQL("SELECT * FROM patient_surgery WHERE pid='$pid'");
		$records = array();
		foreach($this->db->fetchRecords(PDO::FETCH_ASSOC) as $rec){
			$rec['alert'] = ($rec['end_date']== null || $rec['end_date'] == '0000-00-00 00:00:00') ? 0 : 1 ;
			$records[]= $rec;
		}

		return $records;
	}

	/**
	 * @param $eid
	 * @return array
	 */
	private function getPatientSurgeryByEncounterID($eid)
	{
		$this->db->setSQL("SELECT * FROM patient_surgery WHERE eid='$eid'");
		return $this->db->fetchRecords(PDO::FETCH_ASSOC);
	}

	/**
	 * @param $pid
	 * @return array
	 */
	private function getPatientDentalByPatientID($pid)
	{
		$this->db->setSQL("SELECT * FROM patient_dental WHERE pid='$pid'");
		$records = array();
		foreach($this->db->fetchRecords(PDO::FETCH_ASSOC) as $rec){
			$rec['alert'] = ($rec['end_date']== null || $rec['end_date'] == '0000-00-00 00:00:00') ? 0 : 1 ;
			$records[]= $rec;
		}

		return $records;
	}

	/**
	 * @param $eid
	 * @return array
	 */
	private function getPatientDentalByEncounterID($eid)
	{
		$this->db->setSQL("SELECT * FROM patient_dental WHERE eid='$eid'");
		return $this->db->fetchRecords(PDO::FETCH_ASSOC);
	}

	/**
	 * @param $pid
	 * @return array
	 */
	private function getPatientMedicationsByPatientID($pid)
	{
		$this->db->setSQL("SELECT * FROM patient_medications WHERE pid='$pid'");
		$records = array();
		foreach($this->db->fetchRecords(PDO::FETCH_ASSOC) as $rec){
			$rec['alert'] = ($rec['end_date']== null || $rec['end_date'] == '0000-00-00 00:00:00') ? 0 : 1 ;
			$records[]= $rec;
		}

		return $records;
	}

	/**
	 * @param $eid
	 * @return array
	 */
	private function getPatientMedicationsByEncounterID($eid)
	{
		$this->db->setSQL("SELECT * FROM patient_medications WHERE eid='$eid'");
		return $this->db->fetchRecords(PDO::FETCH_ASSOC);
	}

	//******************************************************************************************************************



	/**
	 * @param $date
	 * @return mixed
	 */
	public function parseDate($date)
	{
		return str_replace('T', ' ', $date);
	}

}
//
//$e = new Medical();
//echo '<pre>';
//print_r($e->getProgressNoteByEid(7));
