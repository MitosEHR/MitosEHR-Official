<?php
if (!isset($_SESSION)) {
    session_name("MitosEHR");
    session_start();
    session_cache_limiter('private');
}
include_once('dbhelper.php');
/**
 * @brief       Brief Description
 * @details     Detail Description ...
 *
 * @author      Ernesto J . Rodriguez(Certun) < erodriguez@certun . com >
 * @version     Vega 1.0
 * @copyright   Gnu Public License(GPLv3)
 */
class Immunization extends dbHelper
{

    public function getImmunizationsList() {

        $sql = "SELECT * FROM codes WHERE code_type='100'";
        $this->setSQL($sql);
        return $this->execStatement(PDO::FETCH_ASSOC);
    }

    public function getPatientImmunizations(stdClass $params){


         return $params;
    }

    public function addPatientImmunization($params){


        return $params;
    }

}

