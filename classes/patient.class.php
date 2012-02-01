<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File: patient.class.php
 * Date: 1/13/12
 * Time: 7:10 AM
 */

include_once($_SESSION['site']['root']."/classes/dbHelper.class.php");

class patient extends dbHelper {

    /**
     * @static
     * @param $fname
     * @param $mname
     * @param $lname
     * @return string
     */
    public static function fullname($fname, $mname, $lname){
        if($_SESSION['global_settings'] && $_SESSION['global_settings']['fullname']){
            switch($_SESSION['global_settings']['fullname']){
                case '0':
                    $fullname = $lname.', '.$fname.' '.$mname;
                break;
                case '1':
                   $fullname = $fname.' '.$mname.' '.$lname;
                break;
            }
        }else{
            $fullname =  $lname.', '.$fname.' '.$mname;
        }
        $fullname = ($fullname == ',  ') ? '' : $fullname;

        return $fullname;
    }

    /**
     * @param $pid
     * @return mixed
     */
    public function currPatientSet($pid){
        $this->setSQL("SELECT fname,mname,lname FROM form_data_demographics WHERE pid = '$pid'");
        $p = $this->fetch();
        $fullname = $this->fullname($p['fname'],$p['mname'],$p['lname']);
        $_SESSION['patient']['pid']  = $pid;
        $_SESSION['patient']['name'] = $fullname;
        return;
    }

    /**
     * @return mixed
     */
    public function currPatientUnset(){
        $_SESSION['patient']['pid']  = null;
        $_SESSION['patient']['name'] = null;
        return;
    }

    /**
     * @param $search
     * @param $start
     * @param $limit
     * @return array
     */
    public function patientLiveSearch($search, $start, $limit){
        $this->setSQL("SELECT count(pid) as total
                             FROM form_data_demographics
                            WHERE fname LIKE '".$search."%'
                               OR lname LIKE '".$search."%'
                               OR mname LIKE '".$search."%'
                               OR pid 	LIKE '".$search."%'
                               OR SS 	LIKE '%".$search."'");
        $total = $this->rowCount();
        // ------------------------------------------------------------------------------
        // sql statement and json to get patients
        // ------------------------------------------------------------------------------
        $this->setSQL("SELECT pid,pubpid,fname,lname,mname,DOB,SS
                             FROM form_data_demographics
                            WHERE fname LIKE '".$search."%'
                               OR lname LIKE '".$search."%'
                               OR mname LIKE '".$search."%'
                               OR pid 	LIKE '".$search."%'
                               OR SS 	LIKE '%".$search."'
                            LIMIT ".$start.",".$limit);
        $rows = array();
        foreach($this->execStatement(PDO::FETCH_ASSOC) as $row){
            $row['fullname'] = $this->fullname($row['fname'],$row['mname'],$row['lname']);
            unset($row['fname'],$row['mname'],$row['lname']);
            array_push($rows, $row);
        }
        return array('totals'=>$total,'row'=>$rows);
    }

}
