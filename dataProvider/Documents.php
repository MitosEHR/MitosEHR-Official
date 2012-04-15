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
include_once($_SESSION['site']['root'] . '/lib/fpdf17/fpdf.php');

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

class PDF extends FPDF
{

    private $facility;

    function __construct()
    {
        $this->facility = new Facilities();
    }
// Page header
    function Header()
    {
        // Logo
        $this->Image('MitosEHRLogo.png',10,6,30);
        // Arial bold 15
        $this->SetFont('Arial','B',15);
        // Move to the right
        $this->Cell(80);
        // Title
        $this->SetFillColor(200,220,255);
        $this->Cell(40,10,'Bill Statement',1,0,'C');
        // Line break
        $this->Ln(30);
    }

    // Page footer
    function Footer()
    {
        // Position at 1.5 cm from bottom
        $this->SetY(-15);
        // Arial italic 8
        $this->SetFont('Arial','I',8);
        // Page number
        $this->Cell(0,10,'Page '.$this->PageNo().'/{nb}',0,1,'C');
        // Arial Bold 6
        $this->SetFont('Arial','B',6);
        $this->SetTextColor(128);
        //MitosEHR Signature
        $this->Cell(0,0,'MitosEHR Bill Statement',0,1,'C');
    }

    function ChapterTitle($label)
    {
        // Arial 12
        $this->SetFont('Arial','',12);
        // Background color
        $this->SetFillColor(100,220,255);
        // Title
        $this->Cell(0,6,"$label",0,1,'L',true);
        // Line break
        $this->Ln(4);
    }

    function ChapterBody($file)
    {
        // Read text file
        $txt = file_get_contents($file);
        // Times 12
        $this->SetFont('Times','',12);
        // Output justified text
        $this->MultiCell(0,5,$txt);
        // Line break
        $this->Ln();
        // Mention in italics
        $this->SetFont('','I');
        $this->Cell(0,5,'End of bill statement');
    }


}


print '<pre>';
/**
 * PARA QUE ESTE EJEMPLO FUNCIONE TIENES QUE LOGIADO EN MITOS!!!!!!!!!!!
 *
 * Eto es lo que sencha te va a enviar...
 * Sencha envia un Objeto stdClass con propiedades.
 *
 */
$params = new stdClass();
$params->pid = 1;
$params->fid = 6;
$params->start_date = '2012-01-01';
$params->stop_date = '2012-03-01';


//$docs = new Documents();

//$docs->createSuperBillDoc($params);


//Generate the PDF Bill statement


$pdf = new PDF();
$pdf->AliasNbPages();
$pdf->AddPage();
$pdf->SetFont('Times','',12);
$pdf->ChapterTitle('hdsbvksdbvasdasdf');
$pdf->ChapterBody('Information.txt');
//$pdf->Output();
$pdf->Output('hello.pdf', 'F');




