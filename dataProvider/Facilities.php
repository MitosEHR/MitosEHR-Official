<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File: Facilities.php
 * Date: 2/3/12
 * Time: 10:38 AM
 */
if(!isset($_SESSION)){
    session_name ( "MitosEHR" );
    session_start();
    session_cache_limiter('private');
}
include_once('../classes/dbHelper.php');

class Facilities {
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
    /**
     * @param stdClass $params
     * @return array
     */
    public function getFacilities(stdClass $params){

        if(isset($params->active)){
            $wherex = 'active = '.$params->active ;
        } else {
            $wherex = 'active = 1';
        }
        if(isset($params->sort)){
            $orderx = $params->sort[0]->property.' '.$params->sort[0]->direction;
        } else {
            $orderx = 'name';
        }
        $sql = "SELECT * FROM facility WHERE $wherex ORDER BY $orderx LIMIT $params->start,$params->limit";
        $this->db->setSQL($sql);
        $rows = array();
        foreach($this->db->fetchRecords(PDO::FETCH_ASSOC) as $row){

            if (strlen($row['pos_code']) <= 1){
                $row['pos_code'] = '0'.$row['pos_code'];
            } else {
                $row['pos_code'] = $row['pos_code'];
            }
            array_push($rows, $row);
        }

        return $rows;

    }

    /**
     * @param stdClass $params
     * @return stdClass
     */
    public function addFacility(stdClass $params){

        $data = get_object_vars($params);

        $sql = $this->db->sqlBind($data, "facility", "I");
        $this->db->setSQL($sql);
        $this->db->execLog();

        $params->id = $this->db->lastInsertId;

        return $params;
    }

    /**
     * @param stdClass $params
     * @return stdClass
     */
    public function updateFacility(stdClass $params){

        $data = get_object_vars($params);

        $id = $data['id'];
        unset($data['id']);

        $sql = $this->db->sqlBind($data, "facility", "U", "id='$id'");
        $this->db->setSQL($sql);
        $this->db->execLog();

        return $params;
    }

    /**
     * Not in used. For Now you can only set the Facility "inactive"
     *
     * @param stdClass $params
     * @return stdClass
     */
    public function deleteFacility(stdClass $params){


        $sql = "UPDATE facility SET active = '0' WHERE id='$params->id'";

        $this->db->setSQL($sql);
        $this->db->execLog();

        return $params;
    }
}