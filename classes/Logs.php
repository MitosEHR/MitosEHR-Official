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

include_once($_SESSION['site']['root']."/classes/dbHelper.php");
set_include_path($_SESSION['site']['root'].'/lib/LINQ_040/Classes/');
require_once 'PHPLinq/LinqToObjects.php';

class Logs extends dbHelper {

    public function getLogs(stdClass $params){

        $this->setSQL("SELECT * FROM log ORDER BY id DESC");
        $rows   = $this->execStatement(PDO::FETCH_CLASS);
        $total  = count($rows);
        $result = from('$row')->in($rows)->skip($params->start)->take($params->limit)->select('$row');

        return array('totals'=>$total ,'rows'=>$result);

    }
}