<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File: Encounter.php
 * Date: 1/21/12
 * Time: 3:26 PM
 */
include_once($_SESSION['site']['root']."/classes/ext/Patient.php");

class Encounter extends Patient{


    private function getOpenEncounters(){

    }

    private function createEncounter($data){
        print_r($data);
//        $sql = $this->sqlBind($data, "facility", "I");
//        $this->setSQL($sql);
//        $ret = $this->execLog();


    }

    private function closeEncounter(){

    }


}
