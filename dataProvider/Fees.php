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
include_once($_SESSION['site']['root'].'/classes/dbHelper.php');
include_once($_SESSION['site']['root'].'/dataProvider/Patient.php');
include_once($_SESSION['site']['root'].'/dataProvider/User.php');
include_once($_SESSION['site']['root'].'/dataProvider/Encounter.php');


class Fees extends Encounter {
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


    public function getFilterEncountersBillingData(stdClass $params){

        $sql = "SELECT enc.eid,
                       enc.prov_uid AS encounterProviderUid,
                       enc.start_date,
                       demo.title,
                       demo.fname,
                       demo.mname,
                       demo.lname,
                       demo.provider AS primaryProviderUid
                  FROM form_data_encounter AS enc
             LEFT JOIN form_data_demographics AS demo ON demo.pid = enc.pid
              ORDER BY enc.start_date ASC ";
        $this->db->setSQL($sql);
        $encounters = array();
        foreach($this->db->fetchRecords(PDO::FETCH_ASSOC) as $row){

            $row['primaryProvider'] = $row['primaryProviderUid'] == null ? 'None' : $this->user->getUserNameById($row['primaryProviderUid']);
            $row['encounterProvider'] = $row['encounterProviderUid'] == null ? 'None' : $this->user->getUserNameById($row['encounterProviderUid']);

            $row['patientName'] = $row['title'].' '.$this->patient->fullname($row['fname'],$row['mname'],$row['lname']);
            $encounters[] = $row;
        }
        $total = count($encounters);
        $encounters = array_slice($encounters, $params->start, $params->limit);
        return array('totals' => $total, 'encounters' => $encounters);

    }





}

