<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File: Logs.php
 * Date: 2/4/12
 * Time: 12:27 AM
 */
if(!isset($_SESSION)){
    session_name ("MitosEHR" );
    session_start();
    session_cache_limiter('private');
}
include_once('dbhelper.php');
class Logs extends dbHelper {

    public function getLogs(stdClass $params){

        $this->setSQL("SELECT * FROM log ORDER BY id DESC");
        $rows   = $this->execStatement(PDO::FETCH_CLASS);
        $total  = count($rows);
        $rows = $this->filertByStartLimit($rows,$params);

        return array('totals'=>$total ,'rows'=>$rows);

    }
}