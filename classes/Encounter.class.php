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


    public function ckOpenEncounters(){
        $pid =  $this->getCurrPid();
        $this->setSQL("SELECT * FROM form_data_encounter WHERE pid = '$pid' AND close_date IS NULL");
        $total = $this->rowCount();
        if($total >= 1){
            echo '{"success": true}';
        }else{
            echo '{"success": false}';
        }
    }


    public function getEncounters($params){
        if(isset($params['sort'])){
            $sort = json_decode($params['sort']);
            $ORDER = 'ORDER BY ' . $sort[0]->property . ' ' . $sort[0]->direction;
        } else {
            $ORDER = 'ORDER BY start_date DESC';
        }
        $pid =  $this->getCurrPid();
        $this->setSQL("SELECT * FROM form_data_encounter WHERE pid = '$pid' ".$ORDER);
        $total = $this->rowCount();
        $rows = array();
        foreach($this->execStatement(PDO::FETCH_ASSOC) as $row){
            $row['status'] = ($row['close_date']== null)? 'open' : 'close';
        	array_push($rows, $row);
        }

        print(json_encode(array('totals'=>$total,'row'=>$rows)));

    }


    public function createEncounter($data){
        $data['pid'] = $this->getCurrPid();
        $data['open_uid'] = $_SESSION['user']['id'];

        $sql = $this->sqlBind($data, "form_data_encounter", "I");
        $this->setSQL($sql);
        $this->execLog();
        $eid = $this->lastInsertId;
        print(json_encode(array('success'=>true,'encounter'=>array('eid'=>intval($eid), 'start_date'=>$data['start_date']))));
    }

    public function getEncounter($eid){

        $this->setSQL("SELECT * FROM form_data_encounter WHERE eid = '$eid'");
        $encounter = $this->fetch(PDO::FETCH_ASSOC);

        if($encounter != null){
            print(json_encode(array('encounter'=>$encounter)));
        }else{
            echo '{"success": false}';
        }
    }

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
            print(json_encode(array('totals'=>$total,'vitals'=>$rows)));
        }else{
            echo '{"success": true}';
        }

    }

    public function closeEncounter($data){
        $aes    = new AES($_SESSION['site']['AESkey']);
        $pass   = $aes->encrypt($data['signature']);
        $eid    = $data['eid'];
        $uid    = $_SESSION['user']['id'];
        unset($data['eid'], $data['signature']);
        $data['close_uid'] = $_SESSION['user']['id'];
        $this->setSQL("SELECT username FROM users WHERE id = '$uid' AND password = '$pass' AND authorized = '1' LIMIT 1");
        $count = $this->rowCount();
        if($count != 0){
            $sql = $this->sqlBind($data, "form_data_encounter", "U", "eid='".$eid."'");
            $this->setSQL($sql);
            $this->execLog();
            print '{"success":true}';
        }else{
            print '{"success":false}';
        }
    }
}
