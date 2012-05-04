<?php
if(!isset($_SESSION)) {
	session_name('MitosEHR');
	session_start();
	session_cache_limiter('private');
}
include_once($_SESSION['site']['root'] . '/classes/dbHelper.php');
include_once($_SESSION['site']['root'] . '/dataProvider/Patient.php');
/**
 * @brief       Services Class.
 * @details     This class will handle all services
 *
 * @author      Ernesto J. Rodriguez (Certun) <erodriguez@certun.com>
 * @version     Vega 1.0
 * @copyright   Gnu Public License (GPLv3)
 *
 */


class PreventiveCare
{
	/**
	 * @var dbHelper
	 */
	private $db;

    /**
	 * @var Patient
	 */
	private $patient;


	function __construct()
	{
		$this->db = new dbHelper();
		$this->patient = new Patient();
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
		if($params->code_type == 'Laboratories') {
			$code_table = 'immunizations';
		} elseif($params->code_type == 'Diagnostic Tests') {
			$code_table = 'immunizations';
		} else {
			$code_table = 'immunizations';
		}
		$sortx = $params->sort ? $params->sort[0]->property . ' ' . $params->sort[0]->direction : 'code ASC';
		$this->db->setSQL("SELECT DISTINCT *
                         FROM $code_table
                        WHERE code_text       LIKE '%$params->query%'
                           OR code            LIKE '$params->query%'
                     ORDER BY $sortx");
		$records = $this->db->fetchRecords(PDO::FETCH_CLASS);
		$records = $this->db->filterByQuery($records, 'active', $params->active);
		$total   = count($records);
		$recs    = $this->db->filterByStartLimit($records, $params);
		$records = array();
		foreach($recs as $rec) {
			$rec->code_type = $params->code_type;
			$records[]      = $rec;
		}
		return array('totals'=> $total,
		             'rows'  => $records);
	}

	/**
	 * @param stdClass $params
	 * @return stdClass
	 */
	public function addService(stdClass $params)
	{
					/*
					 * define $code_table
					 */

		if($params->code_type == 'cpt' || $params->code_type == 1) {
				$code_table = 'cpt_codes';
			} elseif($params->code_type == 'icd' || $params->code_type == 2) {
				$code_table = 'icd_codes';
			} elseif($params->code_type == 'hcpcs' || $params->code_type == 3) {
				$code_table = 'hcpcs_codes';
			} else {
				$code_table = 'immunizations';
			}



		$data = get_object_vars($params);

		foreach($data as $key=>$val ){
			if($val == null || $val == '')
			unset($data[$key]);
		}
		unset($data['id']);
		$sql = $this->db->sqlBind($data, $code_table, 'I');
		$this->db->setSQL($sql);
		$this->db->execLog();
		$params->id = $this->db->lastInsertId;
		return array('totals'=> 1, 'rows'  => $params);
	}

	/**
	 * @param stdClass $params
	 * @return stdClass
	 */
	public function updateService(stdClass $params)
	{
					/*
					 * define $code_table
					 */

		if($params->code_type == 'cpt' || $params->code_type == 1) {
				$code_table = 'cpt_codes';
			} elseif($params->code_type == 'icd' || $params->code_type == 2) {
				$code_table = 'icd_codes';
			} elseif($params->code_type == 'hcpcs' || $params->code_type == 3) {
				$code_table = 'hcpcs_codes';
			} else {
				$code_table = 'immunizations';
			}



		$data = get_object_vars($params);

		foreach($data as $key=>$val ){
			if($val == null || $val == '')
			unset($data[$key]);
		}
		unset($data['id']);

		$sql = $this->db->sqlBind($data, $code_table, 'U', "id='$params->id'");
		$this->db->setSQL($sql);
		$this->db->execLog();
		return $params;
	}

	public function liveCodeSearch(stdClass $params)
	{
		/*
				 * define $code_table
				 */
		if($params->code_type == 'cpt') {
			$code_table = 'cpt_codes';
		} elseif($params->code_type == 'icd') {
			$code_table = 'icd_codes';
		} elseif($params->code_type == 'hcpcs') {
			$code_table = 'hcpcs_codes';
		} else {
			$code_table = 'immunizations';
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
		$Str = explode(',', $params->query);
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
		foreach($queries as $query) {
			$this->db->setSQL("SELECT *
                                 FROM $code_table
                                WHERE (code_text      LIKE '%$query%'
                                   OR code_text_short LIKE '%$query%'
                                   OR code            LIKE '$query%')
                             ORDER BY code ASC");
			/**
			 * loop for each sql record as $row
			 */
			foreach($this->db->fetchRecords(PDO::FETCH_ASSOC) as $row) {
				/**
				 * if the id of the IDC9 code is in $idHaystack increase its ['weight'] by 1
				 */
				if(array_key_exists($row['id'], $idHaystack)) {
					$records[$row['id']]['weight']++;
					/**
					 * else add the code ID to $idHaystack
					 * then add ['weight'] with a value of 1
					 * finally add the $row to $records
					 */
				} else {
					$idHaystack[$row['id']] = true;
					$row['weight']          = 1;
					$records[$row['id']]    = $row;
				}
			}
		}
		function cmp($a, $b)
		{
			if($a['weight'] === $b['weight']) {
				return 0;
			} else {
				return $a['weight'] < $b['weight'] ? 1 : -1; // reverse order
			}
		}

		usort($records, 'cmp');
		$total   = count($records);
		$records = array_slice($records, $params->start, $params->limit);
		return array('totals'=> $total,
		             'rows'  => $records);
	}

	/**
	 * @param stdClass $params
	 * @return array
	 */
	public function liveIDCXSearch(stdClass $params)
	{
		$params->code_type = 2;
		return $this->liveCodeSearch($params);
	}

	public function getIcdxByEid($eid)
	{
		$this->db->setSQL("SELECT eci.code, ic.code_text
                             FROM encounter_codes_icdx as eci
                             LEFT JOIN icd_codes as ic ON ic.code = eci.code
                            WHERE eci.eid = '$eid' ORDER BY eci.id ASC");
		return $this->db->fetchRecords(PDO::FETCH_ASSOC);
	}

	public function getIcdxUsedBPid($pid)
	{
		$this->db->setSQL("SELECT DISTINCT eci.code, codes.code_text
                             FROM encounter_codes_icdx AS eci
                        left JOIN codes ON eci.code = codes.code
                        LEFT JOIN form_data_encounter AS e ON eci.eid = e.eid
                            WHERE e.pid = '$pid'
                         ORDER BY e.start_date DESC");
		return $this->db->fetchRecords(PDO::FETCH_ASSOC);
	}



	public function getMedications(stdClass $params)
	{
		$this->db->setSQL("SELECT *
                           FROM medications
                          WHERE (PRODUCTNDC LIKE '%$params->query%'
                             OR PROPRIETARYNAME LIKE '%$params->query%'
                             OR NONPROPRIETARYNAME LIKE '$params->query%')
                       ORDER BY PRODUCTNDC ASC");
		$records = $this->db->fetchRecords(PDO::FETCH_CLASS);
		$totals  = count($records);
		$records = array_slice($records, $params->start, $params->limit);
		return array('totals'=> $totals, 'rows'  => $records);

	}

	public function updateMedications(stdClass $params)
	{
		$data = get_object_vars($params);
		unset($data['id']);
		$sql = $this->db->sqlBind($data, "medications", "U", "id='$params->id'");
		$this->db->setSQL($sql);
		$this->db->execLog();
		return array('totals'=> 1, 'rows'  => $params);

	}

	public function addMedications(stdClass $params)
	{
		$data = get_object_vars($params);
		unset($data['id']);

		$sql = $this->db->sqlBind($data, "medications", "I");
		$this->db->setSQL($sql);
		$this->db->execLog();
		$params->id = $this->db->lastInsertId;
		return array('totals'=> 1, 'rows'  => $params);
	}

	public function removeMedications(stdClass $params)
	{
		$this->db->setSQL("DELETE FROM medications WHERE id ='$params->id'");
		$this->db->execLog();
		return array('totals'=> 1, 'rows'  => $params);
	}

    public function getRelations(stdClass $params)
	{
        if($params->code_type == 'problems'){
            return $this->getImmunizationProblems($params->selected_id);
        }else if($params->code_type == 'medications'){
            return $this->getImmunizationMedications($params->selected_id);
        }
	}

    public function getImmunizationProblems($id)
    {
        $this->db->setSQL("SELECT ir.id,
                                  ir.immunization_id,
                                  ir.foreign_id,
                                  ir.code_type,
                                  icd.code,
                                  icd.code_text
                             FROM immunizations_relations as ir
                        LEFT JOIN icd_codes as icd on ir.foreign_id = icd.id
                            WHERE ir.immunization_id = '$id'
                              AND ir.code_type = 'problems'");
        return $this->db->fetchRecords(PDO::FETCH_CLASS);
    }

    public function getImmunizationMedications($id)
    {
        $this->db->setSQL("SELECT ir.id,
                                  ir.immunization_id,
                                  ir.foreign_id,
                                  ir.code_type,
                                  med.PRODUCTNDC as code,
                                  med.PROPRIETARYNAME as code_text
                             FROM immunizations_relations as ir
                        LEFT JOIN medications as med on ir.foreign_id = med.id
                            WHERE ir.immunization_id = '$id'
                              AND ir.code_type = 'medications'");
        return $this->db->fetchRecords(PDO::FETCH_CLASS);
    }

	public function addRelations(stdClass $params)
	{
		$data = get_object_vars($params);
		unset($data['id']);
        unset($data['code']);
        unset($data['code_text']);
		$sql = $this->db->sqlBind($data, "immunizations_relations", "I");
		$this->db->setSQL($sql);
		$this->db->execLog();
		$params->id = $this->db->lastInsertId;
		return $params;
	}

	public function removeRelations(stdClass $params)
	{
		$this->db->setSQL("DELETE FROM immunizations_relations WHERE id ='$params->id'");
		$this->db->execLog();
		return $params;
	}

    public function checkAge($pid, $immu_id){

        $age = $this ->patient->getPatientAgeByDOB($this->patient->getPatientDOBByPid($pid));
        $range = $this->getImmunizationAgeRangeById($immu_id);
        if( $age >= $range['age_start'] || $age <= $range['age_end']){
            return true;
        }
        else{
            return false;
        }
    }

    public function checkSex($pid, $immu_id){

        $pSex = $this->patient->getPatientSexByPid($pid);

        $iSex = $this->getImmunizationSexById($immu_id);
        if($iSex == $pSex){
            return true;
        }
        else{
            return false;
        }
    }

    public function checkPregnant($pid, $immu_id){

        $ppreg =  $this->patient->getPatientPregnantStatusByPid($pid);
        $ipreg =  $this->getImmunizationPregnantById($immu_id);

        if($ppreg == $ipreg){
            return true;
        }
        else{
            return false;
        }

    }
    public function getImmunizationPregnantById($id){
        $this->db->setSQL("SELECT pregnant
                           FROM immunizations
                           WHERE id='$id'");
        $u = $this->db->fetchRecords(PDO::FETCH_ASSOC);
        return $u['pregnant'];
    }
    public function getImmunizationSexById($id){
        $this->db->setSQL("SELECT sex
                           FROM immunizations
                           WHERE id='$id'");
        $u = $this->db->fetchRecord(PDO::FETCH_ASSOC) ;

        return $u['sex'];
    }

    public function getImmunizationAgeRangeById($id){
        $this->db->setSQL("SELECT age_start,
                                  age_end
                           FROM immunizations
                           WHERE id='$id'");
        return $this->db->fetchRecord(PDO::FETCH_ASSOC);
    }

    public function getImmunizationsCheck(stdClass $params)
    {
        $this->db->setSQL("SELECT * FROM immunizations");
        $records = array();
        foreach($this->db->fetchRecords(PDO::FETCH_ASSOC) as $rec){
            $rec['alert'] = ($this->checkAge($params->pid, $rec['id'])
                          && $this->checkSex($params->pid, $rec['id'])) ? true : false ;
//            && $this->checkPregnant($params->pid, $rec['id'])
            if($rec['alert']){
                $records[]= $rec;
            }

        }
        return $records;
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