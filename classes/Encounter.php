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

        $sql = $this->db->sqlBind($data, "form_data_encounter", "I");
        $this->db->setSQL($sql);
        $this->db->execLog();
        $eid = $this->db->lastInsertId;
        return array('success'=>true,'encounter'=>array('eid'=>intval($eid), 'start_date'=>$params->start_date));
    }

    /**
     * @param stdClass $params
     * @return array|mixed
     */
    public function getEncounter(stdClass $params){

        $this->db->setSQL("SELECT * FROM form_data_encounter WHERE eid = '$params->eid'");
        $encounter = $this->db->fetch(PDO::FETCH_ASSOC);

        if($encounter != null){
            return $encounter;
        }else{
            return array("success" => false);
        }
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
        unset($data['signature']);
        if($this->user->verifyUserPass($params->signature)){
            $sql = $this->db->sqlBind($data, 'form_data_vitals', 'I');
            $this->db->setSQL($sql);
            $this->db->execLog();
            return array('success'=> true);
        }else{
            return array('success'=> false);
        }
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

}