<?php
if(!isset($_SESSION)){
    session_name ("MitosEHR" );
    session_start();
    session_cache_limiter('private');
}
include_once('dbhelper.php');
/**
 * This Class is used to handle all the log requests
 *
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File: Logs.php
 * Date: 2/4/12
 * Time: 12:27 AM
 *
 * @package default
 */
class Logs extends dbHelper {

    /**
     * Get Logs
     *
     * This will return the total recods and the filtered
     * record by Start and Limit params.
     *
     * <code>
     * public function getLogs(stdClass $params){
     *
     *        $this->setSQL("SELECT * FROM log ORDER BY id DESC");
     *        $rows   = $this->execStatement(PDO::FETCH_CLASS);
     *        $total  = count($rows);
     *        $rows = $this->filertByStartLimit($rows,$params);
     *        return array('totals'=>$total ,'rows'=>$rows);
     *
     *    }
     *</code>
     *
     * @param stdClass $params
     * @return array
     */
    public function getLogs(stdClass $params){

        $this->setSQL("SELECT * FROM log ORDER BY id DESC");
        $rows   = $this->execStatement(PDO::FETCH_CLASS);
        $total  = count($rows);
        $rows = $this->filertByStartLimit($rows,$params);

        return array('totals'=>$total ,'rows'=>$rows);

    }
}