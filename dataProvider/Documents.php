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

class Documents {

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


	function __construct()
	{
		$this->db       = new dbHelper();
		$this->user     = new User();
		$this->patient  = new Patient();
		$this->services = new Services();
		return;
	}

	/**
	 * COMIANZA A LEER EN LA LINEA 114!!!!!!!!!!
	 *
	 *
	 * @param stdClass $params
	 * @return array
	 */

	public function createSuperBillDoc(stdClass $params){
		/**
		 * estoy printeando los params para que veas lo que hay en el objeto @params..
		 *
		 * By The Way... print_r() es para printear Arrays/Objects
		 */
		print_r($params);

		/**
		 * Aqui printeo los valores individuales para que veas como usarlos
		 *
		 * los <br> con para crear una linea nueva en HTML...  picheale...
		 */
		print '<br>';
		print 'Patient ID: ' . $params->pid;
		print '<br>';
		print 'Start Date: ' . $params->start_date;
		print '<br>';
		print 'Stop Date: ' .  $params->stop_date;
		print '<br>';

		/**
		 * Ejemplo como usar una funcion de otra classe
		 * que este definida en __construct()
		 */
		$currentUser = $this->user->getCurrentUserTitleLastName();
		print 'Current User Name :' . $currentUser;

		print '<br>';
		$patientName = $this->patient->getPatientFullNameByPid($params->pid);
		print 'Patient FullName :' . $patientName;
		print '<br>';


		/**
		 * Ejemplo de como usar los valores en SQLs
		 * y printear la info
		 */
		$this->db->setSQL( "SELECT * FROM form_data_demographics WHERE pid = '$params->pid'" );
		$patient = $this->db->fetchRecord();
		print 'Patient Info Array :';
		print_r($patient);

		/**
		 * este return es para sencha...
		 * el success = true, es para decirle a sencha que el documento se creo
		 * y el doc = va a ser un array con la metadata de documento. (name, type, created by, created date, last updated... etc etc)
		 */
		return array('success' => true, 'doc' => array('document_info'));
	}


	/**
	 * @param stdClass $params
	 * @return mixed
	 */
	public function createOrder(stdClass $params){

		return;
	}

	/**
	 * @param stdClass $params
	 * @return mixed
	 */
	public function createReferral(stdClass $params){

		return;
	}

	/**
	 * @param stdClass $params
	 * @return mixed
	 */
	public function createDrNotes(stdClass $params){

		return;
	}


}


/**
 * el <pre> y los <br> son HTML tags...  picheale a esto.
 */
print '<pre>';
/**
 * PARA QUE ESTE EJEMPLO FUNCIONE TIENES QUE LOGIADO EN MITOS!!!!!!!!!!!
 *
 * Eto es lo que sencha te va a enviar...
 * Sencha envia un Objeto stdClass con propiedades.
 *
 */
$params = new stdClass();
/**
 * Estos son las propiedades vas a necesitar para crear el Super Bill del paciente.
 *
 * $params->pid = Patient ID
 * $params->start_date = Fecha del comienzo del reporte
 * $params->stop_date = Fecha del final del reporte
 */
$params->pid = 1;
$params->start_date = '2012-01-01';
$params->stop_date = '2012-03-01';

/**
 * Aqui creo una instancia de la classe Document
 */
$docs = new Documents();
/**
 * Aqui llamo la funcion createSuperBillDoc() con los parametros
 */
$docs->createSuperBillDoc($params);