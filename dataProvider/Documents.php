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
include_once($_SESSION['site']['root'] . '/classes/PDF.php');
include_once($_SESSION['site']['root'] . '/lib/fpdf17/fpdf.php');
class Documents
{
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
	/**
	 * @var Services
	 */
	private $services;
	/**
	 * @var Facilities
	 */
	private $facility;

	function __construct()
	{
		$this->db       = new dbHelper();
		$this->user     = new User();
		$this->patient  = new Patient();
		$this->services = new Services();
		$this->facility = new Facilities();
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

    public function getTemplateBodyById($id){
        $this->db->setSQL("SELECT title,
                                  body
                           	 FROM documents_templates
                            WHERE id = '$id' ");
        $record =$this->db->fetchRecord(PDO::FETCH_ASSOC);




        return $record['body'];
    }

    public function findAndReplaceTokens($body){

        $find = array(
            '[PATIENT_NAME]',
            '[PATIENT_FULL_NAME]',
            '[PATIENT_MAIDEN_NAME]',
            '[PATIENT_LAST_NAME]',
            '[PATIENT_BIRTHDATE]',
            '[PATIENT_MARITAL_STATUS]',
            '[PATIENT_HOME_PHONE]',
            '[PATIENT_MOBILE_PHONE]',
            '[PATIENT_WORK_PHONE]',
            '[PATIENT_EMAIL]',
            '[PATIENT_SOCIAL_SECURITY]',
            '[PATIENT_SEX]',
            '[PATIENT_AGE]',
            '[PATIENT_TOWN]',
            '[PATIENT_STATE]',
            '[PATIENT_HOME_ADDRESS_LINE_ONE]',
            '[PATIENT_HOME_ADDRESS_LINE_TWO]',
            '[PATIENT_HOME_ADDRESS_ZIP_CODE]',
            '[PATIENT_HOME_ADDRESS_CITY]',
            '[PATIENT_HOME_ADDRESS_STATE]',
            '[PATIENT_POSTAL_ADDRESS_LINE_ONE]',
            '[PATIENT_POSTAL_ADDRESS_LINE_TWO]',
            '[PATIENT_POSTAL_ADDRESS_ZIP_CODE]',
            '[PATIENT_POSTAL_ADDRESS_CITY]',
            '[PATIENT_POSTAL_ADDRESS_STATE]',
            '[PATIENT_TABACCO]',
            '[PATIENT_ALCOHOL]',
            '[PATIENT_DRIVERS_LICENSE]',
            '[PATIENT_EMPLOYEER]',
            '[PATIENT_FIRST_EMERGENCY_CONTACT]',
            '[PATIENT_REFERRAL]',
            '[PATIENT_REFERRAL_DATE]',
            '[PATIENT_BALANCE]',
            '[PATIENT_PICTURE]',
            '[PATIENT_PRIMARY_PLAN]',
            '[PATIENT_PRIMARY_INSURED_PERSON]',
            '[PATIENT_PRIMARY_CONTRACT_NUMBER]',
            '[PATIENT_PRIMARY_EXPIRATION_DATE]',
            '[PATIENT_SECONDARY_PLAN]',
            '[PATIENT_SECONDARY_INSURED_PERSON]',
            '[PATIENT_SECONDARY_CONTRACT_NUMBER]',
            '[PATIENT_SECONDARY_EXPIRATION_DATE]',
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
            '[PATIENT_INACTIVE_SURGERY_LIST]',
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
            '[ENCOUNTER_SIGNATURE]',
            '[ORDERS_LABORATORIES]',
            '[ORDERS_XRAYS]',
            '[ORDERS_REFERRAL]',
            '[ORDERS_OTHER]',
            '[CURRENT_DATE]',
            '[CURRENT_TIME]',
            '[CURRENT_USER_NAME]',
            '[CURRENT_USER_FULL_NAME]',
            '[CURRENT_USER_LICENSE_NUMBER]',
            '[CURRENT_USER_DEA_LICENSE_NUMBER]',
            '[CURRENT_USER_DM_LICENSE_NUMBER]',
            '[CURRENT_USER_NPI_LICENSE_NUMBER]',
          /*  '[]',
            '[]',
            '[]' */);
        $replace   = array(
            '[PATIENT_NAME]',
            '[PATIENT_FULL_NAME]',
            '[PATIENT_MAIDEN_NAME]',
            '[PATIENT_LAST_NAME]',
            '[PATIENT_BIRTHDATE]',
            '[PATIENT_MARITAL_STATUS]',
            '[PATIENT_HOME_PHONE]',
            '[PATIENT_MOBILE_PHONE]',
            '[PATIENT_WORK_PHONE]',
            '[PATIENT_EMAIL]',
            '[PATIENT_SOCIAL_SECURITY]',
            '[PATIENT_SEX]',
            '[PATIENT_AGE]',
            '[PATIENT_TOWN]',
            '[PATIENT_STATE]',
            '[PATIENT_HOME_ADDRESS_LINE_ONE]',
            '[PATIENT_HOME_ADDRESS_LINE_TWO]',
            '[PATIENT_HOME_ADDRESS_ZIP_CODE]',
            '[PATIENT_HOME_ADDRESS_CITY]',
            '[PATIENT_HOME_ADDRESS_STATE]',
            '[PATIENT_POSTAL_ADDRESS_LINE_ONE]',
            '[PATIENT_POSTAL_ADDRESS_LINE_TWO]',
            '[PATIENT_POSTAL_ADDRESS_ZIP_CODE]',
            '[PATIENT_POSTAL_ADDRESS_CITY]',
            '[PATIENT_POSTAL_ADDRESS_STATE]',
            '[PATIENT_TABACCO]',
            '[PATIENT_ALCOHOL]',
            '[PATIENT_DRIVERS_LICENSE]',
            '[PATIENT_EMPLOYEER]',
            '[PATIENT_FIRST_EMERGENCY_CONTACT]',
            '[PATIENT_REFERRAL]',
            '[PATIENT_REFERRAL_DATE]',
            '[PATIENT_BALANCE]',
            '[PATIENT_PICTURE]',
            '[PATIENT_PRIMARY_PLAN]',
            '[PATIENT_PRIMARY_INSURED_PERSON]',
            '[PATIENT_PRIMARY_CONTRACT_NUMBER]',
            '[PATIENT_PRIMARY_EXPIRATION_DATE]',
            '[PATIENT_SECONDARY_PLAN]',
            '[PATIENT_SECONDARY_INSURED_PERSON]',
            '[PATIENT_SECONDARY_CONTRACT_NUMBER]',
            '[PATIENT_SECONDARY_EXPIRATION_DATE]',
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
            '[PATIENT_INACTIVE_SURGERY_LIST]',
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
            '[ENCOUNTER_SIGNATURE]',
            '[ORDERS_LABORATORIES]',
            '[ORDERS_XRAYS]',
            '[ORDERS_REFERRAL]',
            '[ORDERS_OTHER]',
            '[CURRENT_DATE]',
            '[CURRENT_TIME]',
            '[CURRENT_USER_NAME]',
            '[CURRENT_USER_FULL_NAME]',
            '[CURRENT_USER_LICENSE_NUMBER]',
            '[CURRENT_USER_DEA_LICENSE_NUMBER]',
            '[CURRENT_USER_DM_LICENSE_NUMBER]',
            '[CURRENT_USER_NPI_LICENSE_NUMBER]',
            /*  '[]',
           '[]',
           '[]' */);

        $newphrase = str_replace($find, $replace, $body);

    }

}





