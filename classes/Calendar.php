<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File: Calendar.php
 * Date: 2/2/12
 * Time: 11:28 AM
 */
if(!isset($_SESSION)){
    session_name ( 'MitosEHR' );
    session_start();
    session_cache_limiter('private');
}
include_once('dbHelper.php');
include_once('Person.php');
class Calendar {
    /**
     * @var dbHelper
     */
    private $db;
    /**
     * Creates the dbHelper instance
     */
    function __construct(){
        $this->db = new dbHelper();
        return;
    }
    public function getCalendars(){
        $color = -4;
        $sql = ("SELECT * FROM users WHERE calendar = '1' AND authorized = '1' AND active = '1' ORDER BY username");
        $this->db->setSQL($sql);
        $rows = array();
        foreach($this->db->execStatement(PDO::FETCH_ASSOC) as $row){
            if($color > 32){ $color = $color - 30; }
            $color = $color + 5;
            $cla_user['id'] = $row['id'];
            $cla_user['title'] =  $row['title'].' '. $row['lname'];
            $cla_user['color'] = strval($color);
            array_push($rows, $cla_user);
        }
        return  $rows;

    }

    public function getEvents(stdClass $params){

        $sql = ("SELECT * FROM calendar_events WHERE start BETWEEN '".$params->startDate." 00:00:00' AND '".$params->endDate." 23:59:59' ");
        $this->db->setSQL($sql);
        $rows = array();
        foreach($this->db->execStatement(PDO::FETCH_ASSOC) as $row){
            $row['id']                  = intval($row['id']);
            $row['user_id']             = intval($row['user_id']);
            $row['category']            = intval($row['category']);
            $row['facility']            = intval($row['facility']);
            $row['billing_facillity']   = intval($row['billing_facillity']);
            $row['patient_id']          = intval($row['patient_id']);

            $sql = ("SELECT * FROM form_data_demographics WHERE pid= '".$row['patient_id']."'");
            $this->db->setSQL($sql);
            foreach($this->db->execStatement(PDO::FETCH_ASSOC) as $urow){
            $row['title'] = Person::fullname($urow['fname'],$urow['mname'],$urow['lname']);
            }
            array_push($rows, $row);
        }
        //print_r(json_encode(array('success'=>true, 'message'=>'Loaded data', 'data'=>$rows)));    }
        return array('success'=>true, 'message'=>'Loaded data', 'data'=>$rows);
    }

    public function addEvent(stdClass $params){

        $sql = "SELECT fname, mname, lname FROM form_data_demographics WHERE pid='$params->patient_id'";
        $this->db->setSQL($sql);
        $rec = $this->db->fetch();
        $fullName = Person::fullname($rec['fname'],$rec['mname'],$rec['lname']);

        $row['user_id']             = $params->user_id;
        $row['category']            = $params->category;
        $row['facility']            = $params->facility;
        $row['billing_facillity']   = $params->billing_facillity;
        $row['patient_id']          = $params->patient_id;
        $row['title']               = $fullName;
        $row['status']              = $params->status;
        $row['start']               = $params->start;
        $row['end']                 = $params->end;
        $row['rrule']               = $params->rrule;
        $row['loc']                 = $params->loc;
        $row['notes']               = $params->notes;
        $row['url']                 = $params->url;
        $row['ad']                  = $params->ad;

        $sql = $this->db->sqlBind($row, "calendar_events", "I");
        $this->db->setSQL($sql);
        $ret = $this->db->execLog();
        // ********************************************************************
        // If no error found, return the same record back to the calendar
        // ********************************************************************
        if ($ret[2]){
            echo '{ success: false, errors: { reason: "'. $ret[2] .'" }}';
        } else {
            $sql = ("SELECT * FROM calendar_events WHERE id = '".$this->lastInsertId."' ");
            $this->db->setSQL($sql);
            $rows = array();
            foreach($this->db->execStatement(PDO::FETCH_ASSOC) as $row){
                array_push($rows, $row);
            }
            return array('success'=>true, 'message'=>'Loaded data', 'data'=>$rows);
        }
    }

    public function updateEvent(stdClass $params){

        $row['user_id']             = $params->user_id;
        $row['category']            = $params->category;
        $row['facility']            = $params->facility;
        $row['billing_facillity']   = $params->billing_facillity;
        $row['patient_id']          = $params->patient_id;
        $row['title']               = $params->title;
        $row['status']              = $params->status;
        $row['start']               = $params->start;
        $row['end']                 = $params->end;
        $row['rrule']               = $params->rrule;
        $row['loc']                 = $params->loc;
        $row['notes']               = $params->notes;
        $row['url']                 = $params->url;
        $row['ad']                  = $params->ad;

        $sql = $this->db->sqlBind($row, "calendar_events", "U", "id='" . $params->id . "'");
        $this->db->setSQL($sql);
        $this->db->execLog();
        return array('success'=> true);
    }

    public function deleteEvent(stdClass $params){
        $this->db->setSQL( "DELETE FROM calendar_events WHERE id='$params->id'");
        $this->db->execLog();
        return array('success'=> true);
    }
}
