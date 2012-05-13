<?php
/**
 * Created by JetBrains PhpStorm.
 * User: erodriguez
 * Date: 4/14/12
 * Time: 11:51 PM
 * To change this template use File | Settings | File Templates.
 */
if(!isset($_SESSION)) {
	session_name("MitosEHR");
	session_start();
	session_cache_limiter('private');
}
include_once($_SESSION['site']['root'] . '/lib/fpdf17/fpdf.php');
class PDF extends FPDF
{
	private $clinic_name='Ernesto Clinic';
	private $address_1='Parque de las Flores 3301';
	private $address_2='Carolina, PR 00987';
	private $tel_1='787-923-8880';
	private $tel_2='787-923-8880';
	private $fax='787-923-8880';
	private $email='tecato@cojelotuyo.com';
	function Header()
	{
		// Logo
		//$this->Image('MitosEHRLogo.png', 10, 6, 30);
		// Arial bold 15

		$this->Ln(10);
		$this->SetFont('Arial','', 12);
		$this->Ln(9);
		$this->Cell(190, 0,'Tel: '.  $this->tel_1, 0, 2, 'R');
		$this->Ln(5);
		$this->Cell(190, 0,'Tel: '.  $this->tel_2, 0, 2, 'R');
		$this->Ln(5);
		$this->Cell(190, 0,'Fax: '.  $this->fax, 0, 2, 'R');
		$this->SetY(20);


		$this->SetFont('Arial', 'B', 25);
		$this->SetFillColor(200, 220, 255);
		$this->Cell(0, 0, $this->clinic_name, 0, 2, 'C');
		$this->Ln(7);
		$this->SetFont('Arial','', 14);
		$this->Cell(0, 0,$this->address_1, 0, 2, 'C');
		$this->Ln(6);
		$this->Cell(0, 0, $this->address_2, 0, 2, 'C');

		$this->SetFont('Arial','', 14);
		$this->Ln(6);
		$this->Cell(0, 0, $this->email, 0, 2, 'C');
		// Line break
		$this->Ln(35);
		$this->SetDrawColor(150);
		$this->SetLineWidth(0.5);
		$this->Line(11, 58,199,58);
		$this->SetLineWidth(0.1);
		$this->Line(11,59,199,59);
	}

	// Page footer
	function Footer()
	{
		$this->SetDrawColor(150);
		$this->SetLineWidth(0.1);
		$this->Line(11,259,199,259);
		$this->SetLineWidth(0.5);
		$this->Line(11,260,199,260);

		$this->SetY(-35);

		$this->SetFont('Arial', 'B', 6);
		$this->SetTextColor(128);
		//MitosEHR Signature
		$this->Cell(0, 0, 'Created by MitosEHR (Electronic Health Record)', 0, 1, 'L');
	}



}
