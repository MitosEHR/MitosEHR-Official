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

include_once($_SESSION['site']['root']."/classes/Patient.php");
include_once($_SESSION['site']['root']."/classes/AES.class.php");

class Encounter extends Patient{

    /**
     * @return array
     */
    public function ckOpenEncounters(){
        $pid =  $_SESSION['patient']['pid'];
        $this->setSQL("SELECT * FROM form_data_encounter WHERE pid = '$pid' AND close_date IS NULL");
        $total = $this->rowCount();
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
        $this->setSQL("SELECT * FROM form_data_encounter WHERE pid = '$pid' ".$ORDER);
        $rows = array();
        foreach($this->execStatement(PDO::FETCH_ASSOC) as $row){
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

        $sql = $this->sqlBind($data, "form_data_encounter", "I");
        $this->setSQL($sql);
        $this->execLog();
        $eid = $this->lastInsertId;
        return array('success'=>true,'encounter'=>array('eid'=>intval($eid), 'start_date'=>$params->start_date));
    }

    /**
     * @param stdClass $params
     * @return array|mixed
     */
    public function getEncounter(stdClass $params){

        $this->setSQL("SELECT * FROM form_data_encounter WHERE eid = '$params->eid'");
        $encounter = $this->fetch(PDO::FETCH_ASSOC);

        if($encounter != null){
            return $encounter;
        }else{
            echo '{"success": false}';
        }
    }

    /**
     * @return array
     */
    public function getVitals(){

        $pid =  $_SESSION['patient']['pid'];

        $this->setSQL("SELECT * FROM form_data_vitals WHERE pid = '$pid' ORDER BY date ASC");
        $total = $this->rowCount();
        $rows = array();
        foreach($this->execStatement(PDO::FETCH_ASSOC) as $row){
            $row['date'] = date('Y-m-d g:i a',strtotime ($row['date']));
            $row['height_in'] = intval($row['height_in']);
            $row['height_cn'] = intval($row['height_cn']);
            array_push($rows, $row);
        }
        if($total >= 1){
            return $rows;
        }else{
            echo '{"success": true}';
        }

    }

    /**
     * @param stdClass $params
     * @return array
     */
    public function closeEncounter(stdClass $params){
        $aes    = new AES($_SESSION['site']['AESkey']);
        $pass   = $aes->encrypt($params->signature);

        $uid    = $_SESSION['user']['id'];

        $data['close_date'] = $params->close_date;
        $data['close_uid'] = $_SESSION['user']['id'];

        $this->setSQL("SELECT username FROM users WHERE id = '$uid' AND password = '$pass' AND authorized = '1' LIMIT 1");
        $count = $this->rowCount();
        if($count != 0){
            $sql = $this->sqlBind($data, "form_data_encounter", "U", "eid='".$params->eid."'");
            $this->setSQL($sql);
            $this->execLog();
            return array('success'=> true);
        }else{
            return array('success'=> false);
        }
    }
}