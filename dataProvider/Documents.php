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
		$this->pdf->AddPage();
		$this->pdf->SetFont('Arial', 'B', 16);
		$this->pdf->SetFont('Arial', '', 12);
		$this->pdf->SetFillColor(100, 220, 255);
		$this->pdf->Cell(0, 6, $this->facility->getFacilityInfo($params->fid), 0, 1, 'L', true);
		$this->pdf->Ln(4);

		$txt = file_get_contents('information.txt');
		$this->pdf->SetFont('Times', '', 12);
		$this->pdf->MultiCell(0, 5, $txt);
		$this->pdf->Ln();
		$this->pdf->SetFont('', 'I');
		$this->pdf->Cell(0, 5, 'End of bill statement');
		$this->pdf->Output('hello.pdf', 'F');

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





