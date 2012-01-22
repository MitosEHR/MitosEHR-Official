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

include_once($_SESSION['site']['root']."/classes/Patient.class.php");

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


    public function getOpenEncounters(){
        $pid =  $this->getCurrPid();
        $this->setSQL("SELECT * FROM form_data_encounter WHERE pid = '$pid' AND close_date = NULL");
        $total = $this->rowCount();
        $rows = array();
        foreach($this->execStatement(PDO::FETCH_ASSOC) as $row){
        	array_push($rows, $row);
        }
        if($total >= 1){
            print(json_encode(array('totals'=>$total,'row'=>$rows)));
        }else{
            echo '{"success": false}';
        }
    }



    public function createEncounter($data){
        $data['pid'] = $this->getCurrPid();
        $data['uid'] = $_SESSION['user']['id'];

        print_r($data);
        $sql = $this->sqlBind($data, "form_data_encounter", "I");
        $this->setSQL($sql);
        $ret = $this->execLog();


    }

    private function closeEncounter(){

    }


}
