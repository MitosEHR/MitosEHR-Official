<?php
/**
 * Created by JetBrains PhpStorm.
 * User: erodriguez
 * Date: 4/14/12
 * Time: 12:24 PM
 * To change this template use File | Settings | File Templates.
 */
if(!isset($_SESSION)) {
	session_name("MitosEHR");
	session_start();
	session_cache_limiter('private');
}
include_once($_SESSION['site']['root'] . '/classes/dbHelper.php');
include_once($_SESSION['site']['root'] . '/dataProvider/Patient.php');
include_once($_SESSION['site']['root'] . '/dataProvider/User.php');
include_once($_SESSION['site']['root'] . '/dataProvider/Encounter.php');
include_once($_SESSION['site']['root'] . '/dataProvider/Services.php');
include_once($_SESSION['site']['root'] . '/dataProvider/Facilities.php');
include_once($_SESSION['site']['root'] . '/lib/dompdf_0-6-0_beta3/dompdf_config.inc.php');
class Documents
{
	/**
	 * @var dbHelper
	 */
	private $db;
	/**
	 * @var user
	 */
	private $user;
	/**
	 * @var Patient
	 */
	private $patient;
	/**
	 * @var Services
	 */
	private $services;
	/**
	 * @var Facilities
	 */
	private $facility;

    private $dompdf;

	function __construct()
	{
		$this->db       = new dbHelper();
		$this->user     = new User();
		$this->patient  = new Patient();
		$this->services = new Services();
		$this->facility = new Facilities();
        $this->dompdf   = new DOMPDF();
		return;
	}

	public function createSuperBillDoc(stdClass $params)
	{
        return;
	}

	/**
	 * @param stdClass $params
	 * @return mixed
	 */
	public function createOrder(stdClass $params)
	{
		return;
	}

	/**
	 * @param stdClass $params
	 * @return mixed
	 */
	public function createReferral(stdClass $params)
	{
		return;
	}

	/**
	 * @param stdClass $params
	 * @return mixed
	 */
	public function createDrNotes(stdClass $params)
	{
		return;
	}

    public function getDocumentWithTokens(){}

    public function getArrayWithTokensNeededByDocumentID($id){
        $this->db->setSQL("SELECT title,
                                  body
                           	 FROM documents_templates
                            WHERE id = '$id' ");
        $record =$this->db->fetchRecord(PDO::FETCH_ASSOC);

        $regex ='(\[\w*?\])';
        $body = $record['body'];
        preg_match_all($regex,$body,$tokensfound);



        return $tokensfound;
    }
    public function getTemplateBodyById($id){
        $this->db->setSQL("SELECT title,
                                  body
                           	 FROM documents_templates
                            WHERE id = '$id' ");
        return $this->db->fetchRecord(PDO::FETCH_ASSOC);
    }

    public function getAllPatientData($pid){
        $this->db->setSQL("SELECT *
                           	 FROM form_data_demographics
                            WHERE pid = '$pid' ");
        $record =$this->db->fetchRecord(PDO::FETCH_ASSOC);
        return $record;
    }

    public function findAndReplaceTokens($pid){

        $patientData = $this->getAllPatientData($pid);

        $age =$this->patient->getPatientAgeByDOB($patientData['DOB']);

        $patienInformation = array
        (
            '[PATIENT_NAME]' => $patientData['fname'],
            '[PATIENT_FULL_NAME]'=>$this->patient->getPatientFullNameByPid($patientData['pid']),
            '[PATIENT_LAST_NAME]'=>$patientData['lname'],
            '[PATIENT_BIRTHDATE]'=>$patientData['DOB'],
            '[PATIENT_MARITAL_STATUS]'=>$patientData['marital_status'],
            '[PATIENT_HOME_PHONE]'=>$patientData['home_phone'],
            '[PATIENT_MOBILE_PHONE]'=>$patientData['mobile_phone'],
            '[PATIENT_WORK_PHONE]'=>$patientData['work_phone'],
            '[PATIENT_EMAIL]'=>$patientData['email'],
            '[PATIENT_SOCIAL_SECURITY]'=>$patientData['SS'],
            '[PATIENT_SEX]'=>$patientData['sex'],
            '[PATIENT_AGE]'=>$age['years'],
            '[PATIENT_CITY]'=>$patientData['city'],
            '[PATIENT_STATE]'=>$patientData['state'],
            '[PATIENT_COUNTRY]'=>$patientData['country'],
            '[PATIENT_ADDRESS]'=>$patientData['address'],
            '[PATIENT_ZIP_CODE]'=>$patientData['zipcode'],/////////////////////////////////////
            '[PATIENT_TABACCO]'=>$patientData['tabacco'],//////////////////////////////////////
            '[PATIENT_ALCOHOL]'=>$patientData['alcohol'],//////////////////////////////////////
            '[PATIENT_DRIVERS_LICENSE]'=>$patientData['drivers_license'],
            '[PATIENT_EMPLOYEER]'=>$patientData['employer_name'],
            '[PATIENT_EMERGENCY_CONTACT]'=>$patientData['emer_contact'],
            '[PATIENT_EMERGENCY_PHONE]'=>$patientData['emer_phone'],
            '[PATIENT_REFERRAL]'=>$patientData['referral'],/////////////////////////////////////
            '[PATIENT_REFERRAL_DATE]'=>$patientData['referral_date'],////////////////////////////////
            '[PATIENT_BALANCE]'=>'working on it',//////////////////////////////////////////////////
            '[PATIENT_PICTURE]'=>'working on it',/////////////////////////////////////////////////
            '[PATIENT_PRIMARY_PLAN]'=>$patientData['primary_plan_name'],
            '[PATIENT_PRIMARY_INSURANCE_PROVIDER]'=>$patientData['primary_insurance_provider'],
            '[PATIENT_PRIMARY_INSURED_PERSON]'=>$patientData['primary_subscriber_fname'].' '.$patientData['primary_subscriber_mname'].' '.$patientData['primary_subscriber_lname'],
            '[PATIENT_PRIMARY_POLICY_NUMBER]'=>$patientData['primary_policy_number'],
            '[PATIENT_PRIMARY_GROUP_NUMBER]'=>$patientData['primary_group_number'],
            '[PATIENT_PRIMARY_EXPIRATION_DATE]'=>$patientData['primary_effective_date'],
            '[PATIENT_REFERRAL_DETAILS]',
            '[PATIENT_REFERRAL_REASON]',
            '[PATIENT_HEAD_CIRCUMFERENCE]',
            '[PATIENT_HEIGHT]',
            '[PATIENT_PULSE]',
            '[PATIENT_RESPIRATORY_RATE]',
            '[PATIENT_TEMPERATURE]',
            '[PATIENT_WEIGHT]',
            '[PATIENT_PULSE_OXIMETER]',
            '[PATIENT_BLOOD_PREASURE]',
            '[PATIENT_BMI]',
            '[PATIENT_ACTIVE_ALLERGIES_LIST]',
            '[PATIENT_INACTIVE_ALLERGIES_LIST]',
            '[PATIENT_ACTIVE_MEDICATIONS_LIST]',
            '[PATIENT_INACTIVE_MEDICATIONS_LIST]',
            '[PATIENT_ACTIVE_PROBLEMS_LIST]',
            '[PATIENT_INACTIVE_PROBLEMS_LIST]',
            '[PATIENT_ACTIVE_IMMUNIZATIONS_LIST]',
            '[PATIENT_INACTIVE_IMMUNIZATIONS_LIST]',
            '[PATIENT_ACTIVE_DENTAL_LIST]',
            '[PATIENT_INACTIVE_DENTAL_LIST]',
            '[PATIENT_ACTIVE_SURGERY_LIST]',
            '[PATIENT_INACTIVE_SURGERY_LIST]'

        );

        $encounterInformation = array
        (
            '[ENCOUNTER_DATE]',
            '[ENCOUNTER_SUBJECTIVE]',
            '[ENCOUNTER_OBJECTIVE]',
            '[ENCOUNTER_ASSESMENT]',
            '[ENCOUNTER_ASSESMENT_LIST]',
            '[ENCOUNTER_ASSESMENT_CODE_LIST]',
            '[ENCOUNTER_ASSESMENT_FULL_LIST]',
            '[ENCOUNTER_PLAN]',
            '[ENCOUNTER_MEDICATIONS]',
            '[ENCOUNTER_IMMUNIZATIONS]',
            '[ENCOUNTER_ALLERGIES]',
            '[ENCOUNTER_ACTIVE_PROBLEMS]',
            '[ENCOUNTER_SURGERIES]',
            '[ENCOUNTER_DENTAL]',
            '[ENCOUNTER_LABORATORIES]',
            '[ENCOUNTER_PROCEDURES_TERMS]',
            '[ENCOUNTER_CPT_CODES]',
            '[ENCOUNTER_SIGNATURE]'
        );
        $ordersInformation = array(
            '[ORDERS_LABORATORIES]',
            '[ORDERS_XRAYS]',
            '[ORDERS_REFERRAL]',
            '[ORDERS_OTHER]'
        );
        $currentInformation= array(
            '[CURRENT_DATE]'=>date('d-m-Y'),
            '[CURRENT_USER_NAME]'=>$_SESSION['user']['name'],
            '[CURRENT_USER_LICENSE_NUMBER]',
            '[CURRENT_USER_DEA_LICENSE_NUMBER]',
            '[CURRENT_USER_DM_LICENSE_NUMBER]',
            '[CURRENT_USER_NPI_LICENSE_NUMBER]',
            '[LINE]'=>'<hr>',
        );
        $clinicInformation=array(


        );

        $tokens=$this->getArrayWithTokensNeededByDocumentID(1);//getting the template

        $body=$this->getTemplateBodyById(1);
        $pos=0;

        $givingValuesToTokens=array();
        //Creating a empty array to assign values to the tokens
        foreach($tokens[0] as $tok){

            array_push($givingValuesToTokens,'');


        }

        foreach($tokens[0] as $tok){

            if($givingValuesToTokens[$pos]=='' || $givingValuesToTokens[$pos]== null){
                $givingValuesToTokens[$pos]=$patienInformation[$tok];
            };

            $pos=$pos+1;

        }

        $pos=0;
        foreach($tokens[0] as $tok){

            if($givingValuesToTokens[$pos]=='' || $givingValuesToTokens[$pos]== null){
                $givingValuesToTokens[$pos]=$currentInformation[$tok];
            };

            $pos=$pos+1;
        }
        $pos=0;
        foreach($tokens[0] as $tok){

            if($givingValuesToTokens[$pos]=='' || $givingValuesToTokens[$pos]== null){
                $givingValuesToTokens[$pos]=$ordersInformation[$tok];
            };

            $pos=$pos+1;
        }
        $pos=0;
        foreach($tokens[0] as $tok){

            if($givingValuesToTokens[$pos]=='' || $givingValuesToTokens[$pos]== null){
                $givingValuesToTokens[$pos]=$encounterInformation[$tok];
            };

            $pos=$pos+1;
        }
        $pos=0;
        foreach($tokens[0] as $tok){

            if($givingValuesToTokens[$pos]=='' || $givingValuesToTokens[$pos]== null){
                $givingValuesToTokens[$pos]=$clinicInformation[$tok];
            };

            $pos=$pos+1;
        }



        $newphrase = str_replace($tokens[0], $givingValuesToTokens, $body);
        print_r($newphrase);
//Crear html to PDF y grabarlo/////////////////////////////////////////////////////////////////////////
//        $this->dompdf->load_html($newphrase['body']);
//        $this->dompdf->set_paper('letter', 'portrait');
//        $this->dompdf->render();
//
//        $pdf=$this->dompdf->output();
//        $fp = fopen('data.pdf', 'w');
//        fwrite($fp, $pdf);
//        fclose($fp);



    }


}

$e = new Documents();
echo '<pre>';
$e->findAndReplaceTokens(39);
