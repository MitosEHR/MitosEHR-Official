<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File: Messages.php
 * Date: 2/2/12
 * Time: 12:56 PM
 */
if(!isset($_SESSION)){
    session_name ( "MitosEHR" );
    session_start();
    session_cache_limiter('private');
}
include_once($_SESSION['site']['root']."/classes/dbHelper.php");
include_once($_SESSION['site']['root']."/classes/Person.php");
class Messages extends dbHelper {



    public function getMessages(stdClass $params){
        $currUser = $_SESSION['user']['id'];

        if($params->get == 'inbox'){
            $wherex = "pnotes.to_deleted = '0' AND users.id = '".$currUser."'";
        }elseif($params->get == 'sent'){
            $wherex = "pnotes.from_deleted = '0' AND pnotes.from_id = '".$currUser."'";
        }elseif($params->get == 'junk'){
            $wherex = "pnotes.to_deleted = '1' OR pnotes.from_deleted = '1' AND users.id = '".$currUser."'";
        }else{
            $wherex = "pnotes.to_deleted = '0' AND users.id = '".$currUser."'";
        }

        $this->setSQL("SELECT pnotes.* ,
                              users.title AS user_title,
                              users.fname AS user_fname,
                              users.mname AS user_mname,
                              users.lname AS user_lname,
                              form_data_demographics.fname AS patient_fname,
                              form_data_demographics.mname AS patient_mname,
                              form_data_demographics.lname AS patient_lname
                         FROM pnotes
              LEFT OUTER JOIN form_data_demographics ON pnotes.pid = form_data_demographics.pid
              LEFT OUTER JOIN users ON pnotes.to_id = users.id
                        WHERE $wherex
                     ORDER BY pnotes.date
                        LIMIT $params->start, $params->limit");
        $rows = array();
        foreach($this->execStatement(PDO::FETCH_ASSOC) as $row){
            $row['patient_name']    = Person::fullname($row['patient_fname'],$row['patient_mname'],$row['patient_lname']);

            $id = $row['from_id'];
            $this->setSQL("SELECT title, fname, mname, lname FROM users WHERE id ='$id' ");
            $record = $this->fetch();

            $row['from_user'] = $record['user_title'].' '.Person::fullname($record['fname'],$record['mname'],$record['lname']);
            $row['to_user']   = $row['user_title'].' '.Person::fullname($row['user_fname'],$row['user_mname'],$row['user_lname']);
            array_push($rows, $row);
        }
        return $rows;
    }

    public function sendNewMessage(stdClass $params){

        $t                      = date('l jS \of F Y h:i:s A');
        $row['body']            = 'On '.$t.' - <spam style="font-weight:bold">'.$_SESSION['user']['name'].'</spam> - Wrote:<br><br>'.$params->curr_msg;
        $row['pid']             = $params->pid;
        $row['from_id']         = $_SESSION['user']['id'];
        $row['to_id']           = $params->to_id;
        $row['facility_id']     = $_SESSION['site']['facility'];
        $row['authorized']      = $params->authorized;
        $row['message_status']  = $params->message_status;
        $row['subject']         = $params->subject;
        $row['note_type']       = $params->note_type;
        $sql = $this->sqlBind($row, "pnotes", "I");
        $this->setSQL($sql);
        $ret = $this->execLog();
        if($ret[2]){
            return array('success' => false);
        }else{
            return array('success' => true);
        }

        return $params;
    }

    public function replyMessage(stdClass $params){

            $t                      = date('l jS \of F Y h:i:s A');
            $row['body']            = 'On '.$t.' - <spam style="font-weight:bold">'.$_SESSION['user']['name'].'</spam> - Wrote:<br><br>'.$params->curr_msg.'<br><br>';
            $row['from_id']         = $_SESSION['user']['id'];
            $row['to_id']           = $params->to_id;
            $row['message_status']  = $params->message_status;
            $row['subject']         = $params->subject;
            $row['note_type']       = $params->note_type;
            $row['to_deleted']      = 0;
            $row['from_deleted']    = 0;

            $sql = $this->sqlBind($row, "pnotes", "U", "id='" . $params->id . "'");
            $this->setSQL($sql);
            $ret = $this->execLog();

            if($ret[2]){
                return array('success' => false);
            }else{
                return array('success' => true);
            }


        return $params;
    }

    public function deleteMessage(stdClass $params){
        $id         = $params->id;
        $currUser   = $_SESSION['user']['id'];

        $this->setSQL("SELECT to_id, from_id FROM pnotes WHERE id = '$id'");
        $record = $this->fetch();

        if($record['to_id'] == $currUser ){
            $sql = "UPDATE pnotes SET to_deleted = '1' WHERE id='$id'";
        }elseif($record['from_id'] == $currUser){
            $sql = "UPDATE pnotes SET from_deleted = '1' WHERE id='$id'";
        }

        $this->setSQL($sql);
        $ret = $this->execLog();

        if($ret[2]){
            return array('success' => false);
        }else{
            return array('success' => true);
        }
    }

    public function updateMessage(){

        $row[$_REQUEST['col']] = $_REQUEST['val'];

        $sql = $this->sqlBind($row, "pnotes", "U", "id='" . $_REQUEST['id'] . "'");
        $this->setSQL($sql);
        $ret = $this->execLog();
        if ( $ret[2] ){
            echo '{ success: false, errors: { reason: "'. $ret[2] .'" }}';
        } else {
            echo "{ success: true }";
        }





    }
}