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

    public function addOption(stdClass $params)
    {

        return array('success');
    }

    public function updateOption(stdClass $params)
    {

        return array('success');
    }

    public function deleteOption(stdClass $params)
    {

        return array('success');
    }

    public function sortOptions(stdClass $params)
    {
        $data = get_object_vars($params);
        $pos = 10;
        foreach($data['fields'] as $field){
            $row['seq'] = $pos;
            $sql = $this->sqlBind($row, "combo_lists_options", "U", "id = '".$field."'");
            $this->setSQL($sql);
            $this->execLog();
            $pos = $pos + 10;
        }
        return array('success');
    }

    public function addList(stdClass $params){
        $data = get_object_vars($params);
        $sql = $this->sqlBind($data, "combo_lists", "I");
        $this->setSQL($sql);
        $this->execLog();
        $list_id = $this->lastInsertId;
        return array('success'=> true, 'list_id'=> $list_id );

    }

}
