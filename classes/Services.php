<?php
if(!isset($_SESSION)){
    session_name ("MitosEHR" );
    session_start();
    session_cache_limiter('private');
}
include_once($_SESSION['site']['root']."/classes/dbHelper.php");
/**
 * @brief       Services Class.
 * @details     This class will handle all services
 *
 * @author      Ernesto J. Rodriguez (Certun) <erodriguez@certun.com>
 * @version     Vega 1.0
 * @copyright   Gnu Public License (GPLv3)
 *
 */
class Services extends dbHelper {

    /**
     * @param stdClass $params
     * @return array
     */
    public function getServices(stdClass $params)
    {
        $sortx = $params->sort ? $params->sort[0]->property.' '.$params->sort[0]->direction : 'code ASC';

        $this->setSQL("SELECT *
                         FROM codes
                        WHERE code_text      LIKE '%$params->query%'
                           OR code_text_short LIKE '%$params->query%'
                           OR code            LIKE '$params->query%'
                           OR modifier 	      LIKE '$params->query%'
                           OR units 	      LIKE '$params->query%'
                           OR fee 	          LIKE '$params->query%'
                           OR related_code 	  LIKE '$params->query%'
                     ORDER BY $sortx");

        $records = $this->execStatement(PDO::FETCH_CLASS);

        if($params->code_type != 'all'){
            $records = $this->filterByQuery($records, 'code_type', $params->code_type);
        }

        $records = $this->filterByQuery($records, 'active', $params->active);

        $total   = count($records);
        $records = $this->filterByStartLimit($records,$params);

        return array('totals'=>$total,'rows'=>$records);

    }

    /**
     * @param stdClass $params
     * @return stdClass
     */
    public function addService(stdClass $params)
    {

        $data = get_object_vars($params);

        $data['active']     = ($data['active']      == 'on' ? 1 : 0);
        $data['reportable'] = ($data['reportable']  == 'on' ? 1 : 0);

        $sql = $this->sqlBind($data, "codes", "I");
        $this->setSQL($sql);
        $this->execLog();

        $params->id = $this->lastInsertId;

        return $params;
    }

    /**
     * @param stdClass $params
     * @return stdClass
     */
    public function updateService(stdClass $params)
    {

        $data = get_object_vars($params);

        $id = $data['id'];
        unset($data['id']);

        $data['active']     = ($data['active']      == 'on' ? 1 : 0);
        $data['reportable'] = ($data['reportable']  == 'on' ? 1 : 0);

        $sql = $this->sqlBind($data, "codes", "U", "id='$id'");
        $this->setSQL($sql);
        $this->execLog();

        return $params;
    }

}
