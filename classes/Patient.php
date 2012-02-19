<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File: patient.class.php
 * Date: 1/13/12
 * Time: 7:10 AM
 */
if(!isset($_SESSION)){
    session_name ("MitosEHR" );
    session_start();
    session_cache_limiter('private');
}

include_once("Person.php");

class Patient extends Person {


    /**
     * @return mixed
     */
    protected function getCurrPid(){
        return $_SESSION['patient']['pid'];
    }

    /**
     * @param \stdClass $params
     * @internal param $pid
     * @return mixed
     */
    public function currPatientSet(stdClass $params){

        $this->setSQL("SELECT fname,mname,lname FROM form_data_demographics WHERE pid = '$params->pid'");
        $p = $this->fetch();
        $fullname = $this->fullname($p['fname'],$p['mname'],$p['lname']);
        $_SESSION['patient']['pid']  = $params->pid;
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
     * @param \stdClass $params
     * @internal param $search
     * @internal param $start
     * @internal param $limit
     * @return array
     */
    public function patientLiveSearch(stdClass $params){
        $this->setSQL("SELECT pid,pubpid,fname,lname,mname,DOB,SS
                             FROM form_data_demographics
                            WHERE fname LIKE '$params->query%'
                               OR lname LIKE '$params->query%'
                               OR mname LIKE '$params->query%'
                               OR pid 	LIKE '$params->query%'
                               OR SS 	LIKE '%$params->query'");
        $rows = array();
        foreach($this->execStatement(PDO::FETCH_CLASS) as $row){
            $row->fullname = $this->fullname($row->fname,$row->mname,$row->lname);
            unset($row->fname,$row->mname,$row->lname);
            array_push($rows, $row);
        }
        $total  = count($rows);
        $rows = $this->filertByStartLimit($rows,$params);
        return array('totals'=>$total ,'rows'=>$rows);
    }

    /**
     * @param stdClass $params
     * @return array
     */
    public function getPatientDemographicData(stdClass $params){
        $pid = $_SESSION['patient']['pid'];
        $this->setSQL("SELECT * FROM form_data_demographics WHERE pid = '$pid'");

        $rows = array();
        foreach($this->execStatement(PDO::FETCH_ASSOC) as $row){
            array_push($rows, $row);
        }
        return $rows;

    }

    /**
     * Form now this is just getting the latest open encounter for all the patients.
     * TODO: create the table to handle tha pool area and fix this function
     * @return array
     */
    public function getPatientsByPoolArea(){
    //public function getPatientsByPoolArea(stdClass $params){
        $rows = array();
        $this->setSQL("SELECT DISTINCT p.pid, p.title, p.fname, p.mname, p.lname, MAX(e.eid)
                         FROM form_data_demographics AS p
                   RIGHT JOIN form_data_encounter AS e
                           ON p.pid = e.pid
                        WHERE e.close_date IS NULL
                     GROUP BY p.pid");
        foreach($this->execStatement(PDO::FETCH_ASSOC) as $row){
            $foo['name'] = Person::fullname($row['fname'],$row['mname'],$row['lname']);
            $foo['pid'] = $row['pid'];
            $foo['eid'] = $row['MAX(e.eid)'];
            $foo['img'] = 'ui_icons/user_32.png';
            array_push($rows, $foo);
        }
        return $rows;
    }
}
//$p = new Patient();
//echo '<pre>';
//print_r($p->getPatientsByPoolArea());