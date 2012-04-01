<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File: Encounter.php
 * Date: 1/21/12
 * Time: 3:26 PM
 */
if(!isset($_SESSION)){
    session_name ("MitosEHR");
    session_start();
    session_cache_limiter('private');
}

include_once($_SESSION['site']['root'].'/dataProvider/Patient.php');
include_once($_SESSION['site']['root'].'/dataProvider/User.php');
include_once($_SESSION['site']['root'].'/classes/dbHelper.php');

class Fees {
    /**
     * @var dbHelper
     */
    private $db;
    /**
     * @var User
     */
    private $user;
    /**
     * @var Patient
     */
    private $patient;

    function __construct()
    {
        $this->db = new dbHelper();
        $this->user = new User();
        $this->patient = new Patient();
        return;
    }


    /*********************************************
     * METHODS USED BY SENCHA                    *
     *********************************************/


    /**
     * @return mixed
     */
    /*************************************************************************************************************/
    public function getPatientList()
    {
        $sql = "SELECT * FROM patient_data ";
        $this->db->setSQL($sql);
        return $this->db->fetchRecords(PDO::FETCH_ASSOC);
    }



}

