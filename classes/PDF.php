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

	function Header()
	{
		// Logo
		$this->Image('MitosEHRLogo.png', 10, 6, 30);
		// Arial bold 15
		$this->SetFont('Arial', 'B', 15);
		// Move to the right
		$this->Cell(80);
		// Title
		$this->SetFillColor(200, 220, 255);
		$this->Cell(40, 10, 'Bill Statement', 1, 0, 'C');
		// Line break
		$this->Ln(30);
	}

	// Page footer
	function Footer()
	{
		// Position at 1.5 cm from bottom
		$this->SetY(-15);
		// Arial italic 8
		$this->SetFont('Arial', 'I', 8);
		// Page number
		$this->Cell(0, 10, 'Page ' . $this->PageNo() . '/{nb}', 0, 1, 'C');
		// Arial Bold 6
		$this->SetFont('Arial', 'B', 6);
		$this->SetTextColor(128);
		//MitosEHR Signature
		$this->Cell(0, 0, 'MitosEHR Bill Statement', 0, 1, 'C');
	}



}
