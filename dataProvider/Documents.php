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

	public function createSuperBillDoc(stdClass $params)
	{
        //Header of the pdf document
        $this->pdf->AddPage();
        $this->pdf->Image('MitosEHRLogo.png', 10, 6, 30);
        $this->pdf->SetFont('Arial', 'B', 15);
        $this->pdf->Cell(70);
        $this->pdf->SetFillColor(200, 220, 255);
        $this->pdf->Cell(40, 10, 'Bill Statement', 1, 0, 'C');
        $this->pdf->SetFont('Arial', 'B', 10);
        $this->pdf->Cell(30);
        $this->pdf->SetFillColor(255, 255, 255);
        $this->pdf->multiCell(40, 5, $this->facility->getFacilityInfo($params->fid), 0, 0, 'C',true);
        $this->pdf->Ln(20);
        $this->pdf->AliasNbPages();

        //First Blue Row contains Facility information
		//$this->pdf->AddPage();
		$this->pdf->SetFont('Arial', 'B', 16);
		$this->pdf->SetFont('Arial', '', 12);
		$this->pdf->SetFillColor(100, 220, 255);
		$this->pdf->Cell(0, 6, 'Patient Information:', 0, 1, 'L', true);
		$this->pdf->Ln(4);

		//Patient Information
        $this->pdf->SetFont('Times', '', 8);
		$this->pdf->MultiCell(0, 5, $this->patient->getPatientNameById($params->pid));
        $this->pdf->MultiCell(0, 5, $this->patient->getPatientAdditionalInfoById($params->pid));
        $this->pdf->MultiCell(0, 5, $this->patient->getPatientAddressById($params->pid));
        $this->pdf->Ln(4);

        //Second blue row contains insured person information
        $this->pdf->SetFont('Arial', 'B', 16);
        $this->pdf->SetFont('Arial', '', 12);
        $this->pdf->SetFillColor(100, 220, 255);
        $this->pdf->Cell(0, 6, 'Insured Person:', 0, 1, 'L', true);
        $this->pdf->Ln(4);

        //Information of the insured Patient
        $this->pdf->SetFont('Times', '', 8);
		$this->pdf->MultiCell(0, 5, $this->patient->getPatientNameById($params->pid));
        $this->pdf->MultiCell(0, 5, $this->patient->getPatientAdditionalInfoById($params->pid));
        $this->pdf->Ln(4);

        //Thrid Blue Row contains insurance plan information
        $this->pdf->SetFont('Arial', 'B', 16);
        $this->pdf->SetFont('Arial', '', 12);
        $this->pdf->SetFillColor(100, 220, 255);
        $this->pdf->Cell(0, 6, 'Insurance Information', 0, 1, 'L', true);
        $this->pdf->Ln(8);

        //It needs SQL extraction of data for insurance plans
        $this->pdf->SetFont('Times', '', 8);
        $this->pdf->MultiCell(0, 5, 'Medical Plan Name: ');
        $this->pdf->MultiCell(0, 5, 'Policy Number: ');
        $this->pdf->MultiCell(0, 5, 'Effective Date: ');
        $this->pdf->MultiCell(0, 5, 'Expiration Date: ');
        $this->pdf->Ln(8);


        //Fourth Blue Row for extracion of Services Included's Data
        $this->pdf->SetFont('Arial', 'B', 16);
        $this->pdf->SetFont('Arial', '', 12);
        $this->pdf->SetFillColor(100, 220, 255);
        $this->pdf->Cell(0, 6, 'Services Included', 0, 1, 'L', true);
        $this->pdf->Ln(4);

        $this->pdf->SetFont('Arial', 'U', 9);
        $header = array('Services Number', 'Service', 'Date Of Service', 'Other Code');
        $data = 'Testing';
        $w = array(40, 35, 40, 45);
        for($i=0;$i<count($header);$i++){
            $this->pdf->Cell($w[$i],7,$header[$i],1,0,'C');
        }

        //Aqui se implementara un FOREACH
        $this->pdf->Ln();
        $this->pdf->SetFont('Arial', '', 7);
        $this->pdf->Cell($w[0],6,'testing','LR');
        $this->pdf->Cell($w[1],6,'testing','LR');
        $this->pdf->Cell($w[2],6,'testing','LR',0,'R');
        $this->pdf->Cell($w[3],6,'testing','LR',0,'R');
        $this->pdf->Ln();

            // Closing line
        $this->pdf->Cell(array_sum($w),0,'','T');



		$this->pdf->Ln();
		$this->pdf->SetFont('', 'I');
		$this->pdf->Cell(0, 5, 'End of bill statement');
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





