<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File: Lists.php
 * Date: 2/8/12
 * Time: 4:12 PM
 */
if(!isset($_SESSION)){
    session_name ("MitosEHR" );
    session_start();
    session_cache_limiter('private');
}
include_once("dbHelper.php");

class Lists extends dbHelper {

    public function getOptions(stdClass $params)
    {

        $this->setSQL("SELECT o.*
                         FROM combo_lists_options AS o
                    LEFT JOIN combo_lists AS l ON l.id = o.list_id
                        WHERE l.id = '$params->list_id'
                     ORDER BY o.seq");
        return $this->execStatement(PDO::FETCH_ASSOC);

    }

    public function createOption(stdClass $params)
    {


    }

    public function updateOption(stdClass $params)
    {


    }

    public function deleteOption(stdClass $params)
    {


    }

}
