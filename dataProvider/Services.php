<?php
if(!isset($_SESSION)){
    session_name ('MitosEHR');
    session_start();
    session_cache_limiter('private');
}
include_once($_SESSION['site']['root'].'/classes/dbHelper.php');
/**
 * @brief       Services Class.
 * @details     This class will handle all services
 *
 * @author      Ernesto J. Rodriguez (Certun) <erodriguez@certun.com>
 * @version     Vega 1.0
 * @copyright   Gnu Public License (GPLv3)
 *
 */
class Services {
    /**
     * @var dbHelper
     */
    private $db;

    function __construct(){
        return $this->db = new dbHelper();
    }

    /**
     * @param stdClass $params
     * @return array
     */
    public function getServices(stdClass $params)
    {
        /*
         * define $code_table
         */
        if($params->code_type == 'cpt' || $params->code_type == 1){
            $code_table = 'cpt_codes';
        }elseif($params->code_type == 'icd' || $params->code_type == 2){
            $code_table = 'icd_codes';
        }elseif($params->code_type == 'hcpcs' || $params->code_type == 3){
            $code_table = 'hcpcs_codes';
        }else{
            $code_table = 'cvx_codes';
        }

        $sortx = $params->sort ? $params->sort[0]->property.' '.$params->sort[0]->direction : 'code ASC';

        $this->db->setSQL("SELECT DISTINCT *
                         FROM $code_table
                        WHERE code_text       LIKE '%$params->query%'
                           OR code_text_short LIKE '%$params->query%'
                           OR code            LIKE '$params->query%'
                     ORDER BY $sortx");
        $records = $this->db->fetchRecords(PDO::FETCH_CLASS);
        $records = $this->db->filterByQuery($records, 'active', $params->active);
        $total   = count($records);
        $recs = $this->db->filterByStartLimit($records,$params);
	    $records = array();
	    foreach($recs as $rec){
		    $rec->code_type = $params->code_type;
			$records[] = $rec;
	    }
        return array('totals'=>$total,'rows'=>$records);
    }

    /**
     * @param stdClass $params
     * @return stdClass
     */
    public function addService(stdClass $params)
    {
        $data = get_object_vars($params);
        unset($data['id']);
        $sql = $this->db->sqlBind($data, "codes", "I");
        $this->db->setSQL($sql);
        $this->db->execLog();
        $params->id = $this->db->lastInsertId;
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
        $sql = $this->db->sqlBind($data, "codes", "U", "id='$id'");
        $this->db->setSQL($sql);
        $this->db->execLog();
        return $params;
    }

    public function liveCodeSearch(stdClass $params){
        /*
         * define $code_table
         */
        if($params->code_type == 'cpt'){
            $code_table = 'cpt_codes';
        }elseif($params->code_type == 'icd'){
            $code_table = 'icd_codes';
        }elseif($params->code_type == 'hcpcs'){
            $code_table = 'hcpcs_codes';
        }else{
            $code_table = 'cvx_codes';
        }
        /**
         * brake the $params->query coming form sencha using into an array using "commas"
         * example:
         * $params->query = '123.24, 123.4, 142.0, head skin '
         * $Str = array(
         *      [0] => 123.34,
         *      [1] => 123.4,
         *      [2] => 142.0,
         *      [3] => 'head skin '
         * )
         */
        $Str = explode(',', $params->query );
        /**
         * get the las value and trim white spaces
         * $queryStr = 'head skin'
         */
        $queryStr = trim(end(array_values($Str)));
        /**
         * break the $queryStr into an array usin white spaces
         * $queries = array(
         *      [0] => 'head',
         *      [1] => 'skin'
         * )
         */
        $queries = explode(' ', $queryStr);

//////////////////////////////////////////////////////////////////////////////////
////////////   NO TOCAR  /////////   NO TOCAR  /////////   NO TOCAR  /////////////
//////////////////////////////////////////////////////////////////////////////////
//        $sql = "SELECT * FROM codes WHERE ";
//        foreach($queries as $query){
//            $sql .= "(code_text LIKE '%$query%' OR code_text_short LIKE '%$query%' OR code LIKE '$query%' OR related_code LIKE '$query%') AND ";
//        }
//        $sql .= "code_type = '2'";
//
//        //print $sql;
//
//        $this->db->setSQL($sql);
//        $records = $this->db->fetchRecords(PDO::FETCH_ASSOC);
///////////////////////////////////////////////////////////////////////////////////


        /**
         * start empty array to store the records to return
         */
        $records = array();
        /**
         * start empty array to store the ids of the records already in $records
         */
        $idHaystack = array();
        /**
         * loop for every word in $queries
         */
        foreach($queries as $query){
            $this->db->setSQL("SELECT *
                                 FROM $code_table
                                WHERE (code_text      LIKE '%$query%'
                                   OR code_text_short LIKE '%$query%'
                                   OR code            LIKE '$query%')
                             ORDER BY code ASC");
            /**
             * loop for each sql record as $row
             */
            foreach($this->db->fetchRecords(PDO::FETCH_ASSOC) as $row){
                /**
                 * if the id of the IDC9 code is in $idHaystack increase its ['weight'] by 1
                 */
                if(array_key_exists($row['id'], $idHaystack)){
                    $records[$row['id']]['weight']++;
                /**
                 * else add the code ID to $idHaystack
                 * then add ['weight'] with a value of 1
                 * finally add the $row to $records
                 */
                }else{
                    $idHaystack[$row['id']] = true;
                    $row['weight'] = 1;
                    $records[$row['id']] = $row;
                }
            }
        }


        function cmp($a, $b) {
          if ($a['weight'] === $b['weight']) {
            return 0;
          } else {
            return $a['weight'] < $b['weight'] ? 1 : -1; // reverse order
          }
        }
        usort($records, 'cmp');

        $total   = count($records);
        $records = array_slice($records,$params->start,$params->limit);
        return array('totals'=>$total,'rows'=>$records);
    }

    /**
     * @param stdClass $params
     * @return array
     */
    public function liveIDCXSearch(stdClass $params){
        $params->code_type = 2;
        return $this->liveCodeSearch($params);
    }

    public function getIcdxByEid($eid){
        $this->db->setSQL("SELECT eci.code, ic.code_text
                             FROM encounter_codes_icdx as eci
                             LEFT JOIN icd_codes as ic ON ic.code = eci.code
                            WHERE eci.eid = '$eid' ORDER BY eci.id ASC");
        return $this->db->fetchRecords(PDO::FETCH_ASSOC);
    }

    public function getIcdxUsedBPid($pid){
        $this->db->setSQL("SELECT DISTINCT eci.code, codes.code_text
                             FROM encounter_codes_icdx AS eci
                        left JOIN codes ON eci.code = codes.code
                        LEFT JOIN form_data_encounter AS e ON eci.eid = e.eid
                            WHERE e.pid = '$pid'
                         ORDER BY e.start_date DESC");
        return $this->db->fetchRecords(PDO::FETCH_ASSOC);
    }

    /**
     * CPT CODES SECCION!!!
     */

    /**
     * @param stdClass $params
     * @return array|stdClass
     */
    public function getCptCodes(stdClass $params){

        if($params->filter === 0){
            $record =  $this->getCptRelatedByEidIcds($params->eid);
        }elseif($params->filter === 1){
            $record = $this->getCptUsedByPid($params->pid);
        }elseif($params->filter === 2){
            $record = $this->getCptUsedByClinic($params->pid);
        }else{
            $record = $this->getCptByEid($params->eid);
        }

        return $record;
    }

    public function addCptCode(stdClass $params){
        $data = get_object_vars($params);
        unset($data['code_text'], $data['code_text_medium']);

        foreach($data as $key => $val){
            if($val == null || $val == '') {
                unset($data[$key]);
            }
        }
        $this->db->setSQL($this->db->sqlBind($data, 'encounter_codes_cpt', 'I'));
        $this->db->execLog();
        $params->id = $this->db->lastInsertId;
        return $params;
    }

    public function updateCptCode(stdClass $params){
        $data = get_object_vars($params);

        unset($data['id'],$data['eid'],$data['code'],$data['code_text'],$data['code_text_medium']);
        $params->id = intval($params->id);
        $this->db->setSQL($this->db->sqlBind($data, 'encounter_codes_cpt', 'U', "id='$params->id'"));
        $this->db->execLog();
        return $params;
    }

    public function deleteCptCode(stdClass $params){
		$this->db->setSQL("SELECT status FROM encounter_codes_cpt WHERE id = '$params->id'");
		$cpt = $this->db->fetchRecord();
	    if($cpt['status'] == 0){
		    $this->db->setSQL("DELETE FROM encounter_codes_cpt WHERE id ='$params->id'");
            $this->db->execLog();
	    }
        return $params;
    }

    /**
     * @param $eid
     * @return array
     */
    public function getCptRelatedByEidIcds($eid){
        $this->db->setSQL("SELECT DISTINCT cpt.code, cpt.code_text, cpt.code_text_medium, cpt.code_text_short
                             FROM cpt_codes as cpt
                       RIGHT JOIN cpt_icd as ci ON ci.cpt = cpt.code
                        LEFT JOIN encounter_codes_icdx as eci ON eci.code = ci.icd
                            WHERE eci.eid = '$eid'");
        $records = array();
        foreach($this->db->fetchRecords(PDO::FETCH_ASSOC) as $row){
            if($row['code'] != null || $row['code'] != ''){
                $records[] = $row;
            }
        }
        return array('totals'=>count($records),'rows'=>$records);
    }

    /**
     * @param $eid
     * @return array
     */
    public function getCptByEid($eid){
        $this->db->setSQL("SELECT DISTINCT ecc.*, cpt.code, cpt.code_text, cpt.code_text_medium, cpt.code_text_short
                             FROM encounter_codes_cpt AS ecc
                        left JOIN cpt_codes AS cpt ON ecc.code = cpt.code
                            WHERE ecc.eid = '$eid' ORDER BY ecc.id ASC");
        $records = $this->db->fetchRecords(PDO::FETCH_ASSOC);

        return array('totals'=>count($records),'rows'=>$records);
    }

    /**
     * @param $pid
     * @return array
     */
    public function getCptUsedByPid($pid){
        $this->db->setSQL("SELECT DISTINCT cpt.code, cpt.code_text, cpt.code_text_medium, cpt.code_text_short
                             FROM encounter_codes_cpt AS ecc
                        left JOIN cpt_codes AS cpt ON ecc.code = cpt.code
                        LEFT JOIN form_data_encounter AS e ON ecc.eid = e.eid
                            WHERE e.pid = '$pid'
                         ORDER BY e.start_date DESC");
        $records = $this->db->fetchRecords(PDO::FETCH_ASSOC);
        return array('totals'=>count($records),'rows'=>$records);
    }

    /**
     * @return array
     */
    public function getCptUsedByClinic(){
        $this->db->setSQL("SELECT DISTINCT cpt.code, cpt.code_text, cpt.code_text_medium, cpt.code_text_short
                             FROM encounter_codes_cpt AS ecc
                        left JOIN cpt_codes AS cpt ON ecc.code = cpt.code
                         ORDER BY cpt.code DESC");
        $records = $this->db->fetchRecords(PDO::FETCH_ASSOC);
        return array('totals'=>count($records),'rows'=>$records);
    }


	public function getActiveProblems(stdClass $params){

		return $params;
	}

	public function addActiveProblems(stdClass $params){

		return $params;
	}

	public function removeActiveProblems(stdClass $params){

		return $params;
	}
    public function getMedications(stdClass $params){

		return $params;
	}

	public function addMedications(stdClass $params){

		return $params;
	}

	public function removeMedications(stdClass $params){

		return $params;
	}

}

//$params = new stdClass();
//$params->filter = 2;
//$params->pid = '7';
//$params->eid = '1';
//$params->start = 0;
//$params->limit = 25;
//
//$t = new Services();
//print '<pre>';
//print_r($t->getCptCodes($params));
