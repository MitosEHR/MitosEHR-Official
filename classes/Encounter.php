<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File: Encounter.php
 * Date: 1/21/12
 * Time: 3:26 PM
 */
if(!isset($_SESSION)){
    session_name ("MitosEHR" );
    session_start();
    session_cache_limiter('private');
}

include_once('Patient.php');
include_once('User.php');
include_once('dbHelper.php');

class Encounter {
    /**
     * @var dbHelper
     */
    private $db;
    /**
     * @var User
     */
    private $user;

    function __construct(){
        $this->db = new dbHelper();
        $this->user = new User();
        return;
    }
    /**
     * @return array
     */
    public function ckOpenEncounters(){
        $pid =  $_SESSION['patient']['pid'];
        $this->db->setSQL("SELECT * FROM form_data_encounter WHERE pid = '$pid' AND close_date IS NULL");
        $total = $this->db->rowCount();
        if($total >= 1){
            return array('encounter' => true);
        }else{
            return array('encounter' => false);
        }
    }

    /**
     * @param stdClass $params
     * @return array
     */
    public function getEncounters(stdClass $params){

        if(isset($params->sort)){
            $ORDER = 'ORDER BY ' . $params->sort[0]->property . ' ' . $params->sort[0]->direction;
        } else {
            $ORDER = 'ORDER BY start_date DESC';
        }

        $pid = $_SESSION['patient']['pid'];
        $this->db->setSQL("SELECT * FROM form_data_encounter WHERE pid = '$pid' ".$ORDER);
        $rows = array();
        foreach($this->db->execStatement(PDO::FETCH_ASSOC) as $row){
            $row['status'] = ($row['close_date']== null)? 'open' : 'close';
        	array_push($rows, $row);
        }

        return $rows;

    }

    /**
     * @param stdClass $params
     * @return array
     */
    public function createEncounter(stdClass $params){

        $params->pid        = $_SESSION['patient']['pid'];
        $params->open_uid   = $_SESSION['user']['id'];

        $data = get_object_vars($params);
        foreach($data as $key => $val){
            if($val == '') {
                unset($data[$key]);
            }
        }

        $data['start_date'] = $this->parseDate($data['start_date']);

        $sql = $this->db->sqlBind($data, "form_data_encounter", "I");
        $this->db->setSQL($sql);
        $this->db->execLog();
        $eid = $this->db->lastInsertId;

        $default = array('pid'=>$params->pid, 'eid'=>$eid);

        $this->db->setSQL($this->db->sqlBind($default, "form_data_review_of_systems", "I"));
        $this->db->execOnly();
        $this->db->setSQL($this->db->sqlBind($default, "form_data_review_of_systems_check", "I"));
        $this->db->execOnly();
        $this->db->setSQL($this->db->sqlBind($default, "form_data_soap", "I"));
        $this->db->execOnly();
        $this->db->setSQL($this->db->sqlBind($default, "form_data_dictation", "I"));
        $this->db->execOnly();

        $params->eid = intval($eid);

        return array('success'=>true,'encounter'=>$params);
    }

    /**
     * @param stdClass $params
     * @return array|mixed
     */
    public function getEncounter(stdClass $params){
        $this->db->setSQL("SELECT * FROM form_data_encounter WHERE eid = '$params->eid'");
        $encounter = $this->db->fetch(PDO::FETCH_ASSOC);

        $encounter['vitals']                = $this->getVitalsByPid($encounter['pid']);
        $encounter['reviewossystems']       = $this->getReviewOfSystemsByEid($params->eid);
        $encounter['reviewossystemschecks'] = $this->getReviewOfSystemsChecksByEid($params->eid);
        $encounter['soap']                  = $this->getSoapByEid($params->eid);
        $encounter['speechdictation']       = $this->getDictationByEid($params->eid);


        if($encounter != null){
            return array("success" => true, 'encounter' => $encounter);
        }else{
            return array("success" => false);
        }
    }
    /**
     * @param stdClass $params
     * @return array|mixed
     */
    public function updateEncounter(stdClass $params){


        return array("success" => true, 'encounter' => $params);


    }

    public function getVitalsByPid($pid){
        $this->db->setSQL("SELECT * FROM form_data_vitals WHERE pid = '$pid' ORDER BY date DESC");
        $rows = array();
        foreach($this->db->execStatement(PDO::FETCH_ASSOC) as $row){
            $row['height_in'] = intval($row['height_in']);
            $row['height_cn'] = intval($row['height_cn']);
            $row['administer'] = $this->user->getUserNameById($row['uid']);
            array_push($rows, $row);
        }
        return $rows;
    }

    public function getVitalsByEid($eid){
        $this->db->setSQL("SELECT * FROM form_data_vitals WHERE eid = '$eid' ORDER BY date DESC");
        $rows = array();
        foreach($this->db->execStatement(PDO::FETCH_ASSOC) as $row){
            $row['height_in'] = intval($row['height_in']);
            $row['height_cn'] = intval($row['height_cn']);
            $row['administer'] = $this->user->getUserNameById($row['uid']);
            array_push($rows, $row);
        }
        return $rows;
    }

    /**
     * @param stdClass $params
     * @return array
     */
    public function getVitals(stdClass $params){

        $pid =  (isset($params->pid)) ? $params->pid : $_SESSION['patient']['pid'];

        $this->db->setSQL("SELECT * FROM form_data_vitals WHERE pid = '$pid' ORDER BY date DESC");
        $total = $this->db->rowCount();
        $rows = array();
        foreach($this->db->execStatement(PDO::FETCH_ASSOC) as $row){
            $row['height_in'] = intval($row['height_in']);
            $row['height_cn'] = intval($row['height_cn']);
            $row['administer'] = $this->user->getUserNameById($row['uid']);
            array_push($rows, $row);
        }
        if($total >= 1){
            return $rows;
        }else{
            return array("success" => true);
        }
    }

    public function addVitals(stdClass $params){
        $data = get_object_vars($params);
        unset($data['administer']);
        $data['date'] = $this->parseDate($data['date']);
        $sql = $this->db->sqlBind($data, 'form_data_vitals', 'I');
        $this->db->setSQL($sql);
        $this->db->execLog();
        return $params;
    }


    public function getSoapByEid($eid){
        $this->db->setSQL("SELECT * FROM form_data_soap WHERE eid = '$eid' ORDER BY date DESC");
        return $this->db->execStatement(PDO::FETCH_ASSOC);
    }

    public function getReviewOfSystemsChecksByEid($eid){
        $this->db->setSQL("SELECT * FROM form_data_review_of_systems_check WHERE eid = '$eid' ORDER BY date DESC");
        return $this->db->execStatement(PDO::FETCH_ASSOC);
    }
    public function getReviewOfSystemsByEid($eid){
        $this->db->setSQL("SELECT * FROM form_data_review_of_systems WHERE eid = '$eid' ORDER BY date DESC");
        return $this->db->execStatement(PDO::FETCH_ASSOC);
    }
    public function getDictationByEid($eid){
        $this->db->setSQL("SELECT * FROM form_data_dictation WHERE eid = '$eid' ORDER BY date DESC");
        return $this->db->execStatement(PDO::FETCH_ASSOC);
    }

    /**
     * @param stdClass $params
     * @return array
     */
    public function closeEncounter(stdClass $params)
    {
        $data['close_date'] = $params->close_date;
        $data['close_uid'] = $_SESSION['user']['id'];

        if($this->user->verifyUserPass($params->signature)){
            $sql = $this->db->sqlBind($data, "form_data_encounter", "U", "eid='".$params->eid."'");
            $this->db->setSQL($sql);
            $this->db->execLog();
            return array('success'=> true);
        }else{
            return array('success'=> false);
        }
    }

    public function parseDate($date)
    {
        return str_replace('T', ' ', $date);
    }

}