<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File: Encounter.php
 * Date: 1/21/12
 * Time: 3:26 PM
 */
if(!isset($_SESSION)){
    session_name ("MitosEHR");
    session_start();
    session_cache_limiter('private');
}

include_once($_SESSION['site']['root'].'/dataProvider/Patient.php');
include_once($_SESSION['site']['root'].'/dataProvider/User.php');
include_once($_SESSION['site']['root'].'/classes/dbHelper.php');

class Medical {
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

    function __construct()
    {
        $this->db = new dbHelper();
        $this->user = new User();
        $this->patient = new Patient();
        return;
    }


    /*********************************************
     * METHODS USED BY SENCHA                    *
     *********************************************/


    /**
     * @return mixed
     */
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
        unset($data['id']);

        $data['administered_date'] = $this->parseDate($data['administered_date']);
        $data['education_date'] = $this->parseDate($data['education_date']);
        $data['vis_date'] = $this->parseDate($data['vis_date']);

        $this->db->setSQL($this->db->sqlBind($data, 'patient_immunizations', 'I'));
        $this->db->execLog();
        $params->id = $this->db->lastInsertId;
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
        return $this->db->fetchRecords(PDO::FETCH_ASSOC);
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
        return $this->db->fetchRecords(PDO::FETCH_ASSOC);
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
        $this->db->setSQL("SELECT * FROM patient_medical_issues WHERE pid='$pid'");
        return $this->db->fetchRecords(PDO::FETCH_ASSOC);
    }
    /**
     * @param $eid
     * @return array
     */
    private function getMedicalIssuesByEncounterID($eid)
    {
        $this->db->setSQL("SELECT * FROM patient_medical_issues WHERE eid='$eid'");
        return $this->db->fetchRecords(PDO::FETCH_ASSOC);
    }
    /**
     * @param $pid
     * @return array
     */
    private function getSurgeriesByPatientID($pid)
    {
        $this->db->setSQL("SELECT * FROM patient_surgeries WHERE pid='$pid'");
        return $this->db->fetchRecords(PDO::FETCH_ASSOC);
    }
    /**
     * @param $eid
     * @return array
     */
    private function getSurgeriesByEncounterID($eid)
    {
        $this->db->setSQL("SELECT * FROM patient_surgeries WHERE eid='$eid'");
        return $this->db->fetchRecords(PDO::FETCH_ASSOC);
    }
    /**
     * @param $pid
     * @return array
     */
    private function getDentalByPatientID($pid)
    {
        $this->db->setSQL("SELECT * FROM patient_dental WHERE pid='$pid'");
        return $this->db->fetchRecords(PDO::FETCH_ASSOC);
    }
    /**
     * @param $eid
     * @return array
     */
    private function getDentalByEncounterID($eid)
    {
        $this->db->setSQL("SELECT * FROM patient_dental WHERE eid='$eid'");
        return $this->db->fetchRecords(PDO::FETCH_ASSOC);
    }
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
