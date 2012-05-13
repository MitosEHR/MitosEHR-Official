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
	/**
	 * @var PDF
	 */
	private $pdf;

	function __construct()
	{
		$this->db       = new dbHelper();
		$this->user     = new User();
		$this->patient  = new Patient();
		$this->services = new Services();
		$this->facility = new Facilities();
		$this->pdf      = new PDF();
		return;
	}

    private $patient_name='Julio Alisea Acosta';
    private $edad='23';
    private $direccion='Villas de Quintana APT 1324, Hato Rey, PR 00987';
    private $fecha='12/01/2012';
    private $doctor='Dr.Rodriguez';
    private $work = 'Yes';
    private $symptons = 'Headache';
    private $comment_number = '2';
    private $paragraph ='Has been under care of ';
    private $from ='12/01/2012';
    private $to ='12/01/2012';
    private $return ='12/01/2012';
    private $num ='787-787-8787';
    private $first='___';
    private $second='___';
    private $third='___';
    private $fourth='___';

	public function createSuperBillDoc(stdClass $params)
	{
        //Header of the pdf document
        $this->pdf->AddPage();

// patient          age
// adress    zipcode  fecha
        //First Blue Row contains Facility information
		//$this->pdf->AddPage();
        $this->pdf->SetFont('Arial', 'B', 16);
        $this->pdf->Cell(0, 6, 'CERTIFICATE TO RETURN TO WORK', 0, 1, 'C');
        $this->pdf->Ln(8);
		$this->pdf->SetFont('Arial', 'B', 16);
        $this->pdf->Cell(0, 6, 'Patient Information: ', 0, 1, 'L');
        $this->pdf->Ln(1);
		$this->pdf->SetFont('Arial', '', 14);
		$this->pdf->Cell(0, 6, 'Name: '.$this->patient_name.'    Age: '.$this->edad.'   Date: '.$this->fecha, 0, 1, 'L');
		$this->pdf->Cell(0, 6, 'Address: '.$this->direccion, 0, 1, 'L');

        $this->pdf->Ln(4);
        $this->pdf->Cell(0,6, $this->paragraph.$this->doctor,0,1,'L');
        $this->pdf->Cell(0,6, 'From: '.$this->from.' To:'.$this->to,0,1,'L');

        $this->pdf->Ln(4);
        $this->pdf->Cell(0,6,'Return to work on: '. $this->return,0,1,'L');

        $this->pdf->Ln(4);

        $this->pdf->Cell(0,6, 'Nature of illness or injury: '.$this->symptons,0,1,'L');

		//$this->pdf->MultiCell(0, 5, $this->patient->getPatientNameById($params->pid));
        //$this->pdf->MultiCell(0, 5, $this->patient->getPatientAdditionalInfoById($params->pid));
        $this->pdf->Ln(5);
        $this->pdf->SetFont('Arial', 'B', 16);
        $this->pdf->Cell(0,6, 'Physical activities: ',0,1,'L');
        $this->pdf->Ln(5);

        if($this->comment_number == 1){
            $this->first ='_X_';
        }else if($this->comment_number == 2){

            $this->second ='_X_';
        }else if($this->comment_number == 3){

            $this->third ='_X_';
        }else if($this->comment_number == 4){

            $this->fourth ='_X_';
        }

        $this->pdf->SetFont('Arial', '', 14);
        $this->pdf->Cell(0, 6,$this->first.' Patient can not drive.', 0, 1, 'L');
        $this->pdf->Cell(0, 6,$this->second.' Patient can not lift heavy objects.', 0, 1, 'L');
        $this->pdf->Cell(0, 6,$this->third.' Patient can not use stairs.', 0, 1, 'L');
        $this->pdf->Cell(0, 6,$this->fourth.' Other.', 0, 1, 'L');
        $this->pdf->Ln(5);

        $this->pdf->SetFont('Arial', '', 16);
        $this->pdf->Cell(0,6, 'For more information, please call ',0,1,'L');
        $this->pdf->Cell(0,6, $this->num,0,1,'L');
        $this->pdf->Ln(15);

        $this->pdf->SetFont('Arial', '', 14);
        $this->pdf->Cell(0, 6,' Physician:______________________________', 0, 1, 'L');



		//$this->pdf->Output('hello.pdf', 'F');
        $this->pdf->Output();

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

}

$params             = new stdClass();
$params->pid        = 1;
$params->fid        = 6;
$params->start_date = '2012-01-01';
$params->stop_date  = '2012-03-01';
$docs               = new Documents();
$docs->createSuperBillDoc($params);





