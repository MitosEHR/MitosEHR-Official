<?php
/**
 * Created by JetBrains PhpStorm.
 * User: erodriguez
 * Date: 4/15/12
 * Time: 7:14 PM
 * To change this template use File | Settings | File Templates.
 */
if(!isset($_SESSION)){
    session_name ("MitosEHR");
    session_start();
    session_cache_limiter('private');
}

include_once($_SESSION['site']['root'].'/classes/dbHelper.php');
include_once($_SESSION['site']['root'].'/dataProvider/Patient.php');
class VectorGraph
{

	/**
	 * @var dbHelper
	 */
	private $db;
	/**
	 * @var Patient
	 */
	private $patient;

	function __construct()
	{
		$this->db = new dbHelper();
		$this->patient = new Patient();
	}

	public function getGraphData(stdClass $params){
		$data = $this->getGraphCurves($params->type, $this->patient->getPatientSexIntByPid($params->pid));
		return $data;
	}


	private function getGraphCurves($type, $sex)
	{
		$this->db->setSQL("SELECT * FROM vector_charts WHERE type = '$type' AND sex = '$sex'");
		$records = array();
		foreach($this->db->fetchRecords(PDO::FETCH_ASSOC) as $row){
			unset($row['type'],$row['sex'],$row['L'],$row['M'],$row['S']);

			$row['PP'] = $row['P50'];

			foreach($row as $key => $val){
				if($val == null) unset($row[$key]);
			}
			$records[] = $row;
		}
		return $records;
	}


}
//print '<pre>';
//$params = new stdClass();
//$params->type = 1;
//$params->pid = 1;
//
//
//$v = new VectorGraph();
//print_r($v->getGraphData($params));
