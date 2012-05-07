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

	/******************************************************************************************************************/
	/**** PUBLIC METHODS || PUBLIC METHODS || PUBLIC METHODS || PUBLIC METHODS || PUBLIC METHODS || PUBLIC METHODS ****/
	/******************************************************************************************************************/

	/**
	 * get preventive care guideline by category id
	 * @param stdClass $params
	 * @return array
	 */
	public function getGuideLinesByCategory(stdClass $params){
		$this->db->setSQL("SELECT * FROM preventive_care_guidelines WHERE category_id = '$params->category_id'");
		return $this->db->fetchRecords(PDO::FETCH_CLASS);
	}
	/**
	 * update preventive care guideline by category id
	 * @param stdClass $params
	 * @return stdClass
	 */
	public function addGuideLine(stdClass $params){
		$data = get_object_vars($params);
		unset($data['id']);
		$this->db->setSQL($this->db->sqlBind($data,'preventive_care_guidelines','I'));
		$this->db->execLog();
		$params->id = $this->db->lastInsertId;
		return $params;
	}
	/**
	 * update preventive care guideline by category id
	 * @param stdClass $params
	 * @return stdClass
	 */
	public function updateGuideLine(stdClass $params){
		$data = get_object_vars($params);
		unset($data['id']);
		$this->db->setSQL($this->db->sqlBind($data, 'preventive_care_guidelines', 'U', "id='$params->id'"));
		$this->db->execLog();
		return $params;
	}
	/**
	 * get guideline active problem by guideline id
	 * @param stdClass $params
	 * @return \stdClass
	 */
	public function getGuideLineActiveProblems(stdClass $params){
		$active_problems = array();
		$foo = explode(';',$this->getGuideLineActiveProblemsById($params->id));
		if($foo[0]){
			foreach($foo as $fo){
				$this->db->setSQL("SELECT code, code_text FROM codes_icds WHERE code = '$fo' AND code IS NOT NULL");
				$problem = $this->db->fetchRecord(PDO::FETCH_ASSOC);
				$problem['guideline_id'] = $params->id;
				$active_problems[] = $problem;
			}
		}
		return $active_problems;
	}
	/**
	 * @param $params
	 * @return mixed
	 */
	public function addGuideLineActiveProblems($params){
		if(is_array($params)){
			foreach($params as $p){
				$this->addCode($p->guideline_id,$p->code,'active_problems');
			}
		}else{
			$this->addCode($params->guideline_id,$params->code,'active_problems');
		}
		return $params;
	}
	/**
	 * @param stdClass $params
	 * @return stdClass
	 */
	public function removeGuideLineActiveProblems(stdClass $params){
		if(is_array($params)){
			foreach($params as $p){
				$this->removeCode($p->guideline_id,$p->code,'active_problems');
			}
		}else{
			$this->removeCode($params->guideline_id,$params->code,'active_problems');
		}
		return $params;
	}
	/**
	 * get guideline medications by guideline id
	 * @param stdClass $params
	 * @return \stdClass
	 */
	public function getGuideLineMedications(stdClass $params){
		$medications = array();
		$foo = explode(';',$this->getGuideLineMedicationsById($params->id));
		if($foo[0]){
			foreach($foo AS $fo){
				$this->db->setSQL("SELECT PRODUCTNDC AS code,
										  CONCAT(PROPRIETARYNAME,
										  ' (',ACTIVE_NUMERATOR_STRENGTH,') ',
										  ACTIVE_INGRED_UNIT) AS code_text
								     FROM medications
								    WHERE id = '$fo' AND code IS NOT NULL");
				$medication = $this->db->fetchRecord(PDO::FETCH_CLASS);
				$medication['guideline_id'] = $params->id;
				$medications[] = $medication;
			}
		}
		return $medications;
	}
	/**
	 * @param stdClass $params
	 * @return stdClass
	 */
	public function addGuideLineMedications(stdClass $params){
		if(is_array($params)){
			foreach($params as $p){
				$this->addCode($p->guideline_id,$p->code,'medications');
			}
		}else{
			$this->addCode($params->guideline_id,$params->code,'medications');
		}
		return $params;
	}
	/**
	 * @param stdClass $params
	 * @return stdClass
	 */
	public function removeGuideLineMedications(stdClass $params){
		if(is_array($params)){
			foreach($params as $p){
				$this->removeCode($p->guideline_id,$p->code,'medications');
			}
		}else{
			$this->removeCode($params->guideline_id,$params->code,'medications');
		}
		return $params;
	}

	/******************************************************************************************************************/
	/* PRIVATE METHODS || PRIVATE METHODS || PRIVATE METHODS || PRIVATE METHODS || PRIVATE METHODS || PRIVATE METHODS */
	/******************************************************************************************************************/

	/**
	 * @param $id
	 * @return mixed
	 */
	private function getGuideLineActiveProblemsById($id){
		return $this->getCodes($id, 'active_problems');
	}
	/**
	 * @param $id
	 * @return mixed
	 */
	private function getGuideLineMedicationsById($id){
		return $this->getCodes($id, 'medications');
	}
	/**
	 * @param $id
	 * @param $codeColumn
	 * @return mixed
	 */
	private function getCodes($id, $codeColumn){
		$this->db->setSQL("SELECT $codeColumn FROM preventive_care_guidelines WHERE id = '$id' AND $codeColumn IS NOT NULL");
		$foo = $this->db->fetchRecord(PDO::FETCH_CLASS);
		return $foo[$codeColumn];
	}
	/**
	 * @param $id
	 * @param $code
	 * @param $codeColumn
	 * @return mixed
	 */
	private function removeCode($id, $code, $codeColumn){
		$codes = explode(';',$this->getCodes($id,$codeColumn));
		$key = array_search($code, $codes);
		if($key) unset($codes[$key]);
		$codes = implode(';',$codes);
		$data[$codeColumn] = $codes;
		$this->db->setSQL($this->db->sqlBind($data,'preventive_care_guidelines','U',"id='$id'"));
		$this->db->execLog();
		return;
	}
	/**
	 * @param $id
	 * @param $code
	 * @param $codeColumn
	 * @return mixed
	 */
	private function addCode($id, $code, $codeColumn){
		$codes = explode(';',$this->getCodes($id,$codeColumn));
		$codes[] = $code;
		$codes = implode(';',$codes);
		$data[$codeColumn] = $codes;
		$this->db->setSQL($this->db->sqlBind($data,'preventive_care_guidelines','U',"id='$id'"));
		$this->db->execLog();
		return;
	}



	/******************************************************************************************************************/



    public function getImmunizationMedications($id){
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
	public function addRelations(stdClass $params){
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
	public function removeRelations(stdClass $params){
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
    public function getImmunizationsCheck(stdClass $params){
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
//$params->id = 6;
//$params->start = 0;
//$params->limit = 25;
//$params->guideline_id = 6;
//$params->code = 283.11;
//$t = new PreventiveCare();
//print '<pre>';
//print_r($t->getGuideLineActiveProblems($params));