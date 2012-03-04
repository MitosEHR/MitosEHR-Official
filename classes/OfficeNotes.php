<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File: OfficeNotes.php
 * Date: 2/1/12
 * Time: 9:05 PM
 */
if(!isset($_SESSION)){
    session_name ( "MitosEHR" );
    session_start();
    session_cache_limiter('private');
}
include_once($_SESSION['site']['root']."/classes/dbHelper.php");
class OfficeNotes extends dbHelper {

    public function getOfficeNotes(stdClass $params){
        $wherex = ($params->show == "active")? "WHERE activity = 1" : "";
        $this->setSQL("SELECT * FROM onotes $wherex ORDER BY date DESC LIMIT $params->start, $params->limit");
        $rows = array();
        foreach($this->execStatement(PDO::FETCH_ASSOC) as $row){
        	array_push($rows, $row);
        }
        return $rows;
    }

    public function addOfficeNotes(stdClass $params){

        return;
    }

    public function updateOfficeNotes(stdClass $params){

        $data['user']       = $_SESSION['user']['name'];
        $data['body']       = $params->body;
        $data['groupname']  = $params->groupname;
        $data['activity']   = $params->activity;

        $params->date = $data['date'];
        $params->user = $data['user'];

        $sql = $this->sqlBind($data, "onotes", "U", "id='" . $params->id . "'");
        $this->setSQL($sql);
        $this->execLog();

        return $params;
    }
}
