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

    /**
     * @param stdClass $params
     * @return array
     */
    public function getOptions(stdClass $params)
    {

        $this->setSQL("SELECT o.*
                         FROM combo_lists_options AS o
                    LEFT JOIN combo_lists AS l ON l.id = o.list_id
                        WHERE l.id = '$params->list_id'
                     ORDER BY o.seq");
        return $this->execStatement(PDO::FETCH_ASSOC);

    }

    /**
     * @param stdClass $params
     * @return stdClass
     */
    public function addOption(stdClass $params)
    {
        $data = get_object_vars($params);
        unset($data['id']);

        $sql = $this->sqlBind($data, "combo_lists_options", "I");
        $this->setSQL($sql);
        $this->execLog();

        $params->id = $this->lastInsertId;
        return $params;
    }

    /**
     * @param stdClass $params
     * @return stdClass
     */
    public function updateOption(stdClass $params)
    {
        $data = get_object_vars($params);
        unset($data['id']);

        $sql = $this->sqlBind($data, "combo_lists_options", "U", "id = '".$params->id."'");
        $this->setSQL($sql);
        $this->execLog();

        return $params;
    }

    public function deleteOption(stdClass $params)
    {

        return array('success' => true);
    }

    /**
     * @param stdClass $params
     * @return array
     */
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
        return array('success' => true);
    }


    public function getLists(stdClass $params)
    {
        $this->setSQL("SELECT id, title  FROM combo_lists ORDER BY title");
        return $this->execStatement(PDO::FETCH_ASSOC);
    }

    /**
     * @param stdClass $params
     * @return array
     */
    public function addList(stdClass $params)
    {
        $data = get_object_vars($params);
        unset($data['id']);

        $sql = $this->sqlBind($data, "combo_lists", "I");
        $this->setSQL($sql);
        $this->execLog();
        $params->id = $this->lastInsertId;

        return $params;
    }

    public function updateList(stdClass $params)
    {
        $data = get_object_vars($params);
        unset($data['id']);

        $sql = $this->sqlBind($data, "combo_lists", "U", "id = '".$params->id."'");
        $this->setSQL($sql);
        $this->execLog();

        return $params;
    }

    /**
     * @param stdClass $params
     * @return array|stdClass
     */
    public function deleteList(stdClass $params)
    {
        $this->setSQL("SELECT count(*)
                         FROM forms_field_options
                        WHERE oname = 'list_id'
                          AND ovalue = '$params->id'");
        $rec = $this->fetch();

        if($rec['count(*)'] == 0){

            $this->setSQL("DELETE FROM combo_lists_options WHERE list_id = '$params->id'");
            $this->execLog();

            $this->setSQL("DELETE FROM combo_lists WHERE id = '$params->id'");
            $this->execLog();

            return array('success' => true);
        }else{
            return array('success' => false);
        }
    }

}
//$l = new Lists();
//$l->deleteLists();