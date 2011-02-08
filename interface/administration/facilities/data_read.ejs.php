<?php
//--------------------------------------------------------------------------------------------------------------------------
// manage_messages.ejs.php
// v0.0.1
// Under GPLv3 License
//
// Integrated by: Gi Technologies. in 2011
//
// Remember, this file is called via the Framework Store, this is the AJAX thing.
//--------------------------------------------------------------------------------------------------------------------------

// *************************************************************************************
//SANITIZE ALL ESCAPES
// *************************************************************************************
$sanitize_all_escapes=true;

// *************************************************************************************
//STOP FAKE REGISTER GLOBALS
// *************************************************************************************
$fake_register_globals=false;

// *************************************************************************************
// Load the OpenEMR Libraries
// *************************************************************************************
require_once("../../registry.php");

// Count records variable
$count = 0;

$sql = "SELECT
			* 
		FROM
			facility
		ORDER BY name";
$result = sqlStatement( $sql );

while ($myrow = sqlFetchArray($result)) {
	$count++;
	$buff .= "{";
	$buff .= " id: '" . htmlspecialchars( $myrow['id'], ENT_QUOTES) . "',";
	$buff .= " name: '" . htmlspecialchars( $myrow['name'], ENT_QUOTES) . "',";
	$buff .= " phone: '" . htmlspecialchars( $myrow['phone'], ENT_QUOTES) . "',";
	$buff .= " street: '" . htmlspecialchars( $myrow['street'], ENT_NOQUOTES) . "'," ;
	$buff .= " city: '" . htmlspecialchars( $myrow['city'], ENT_NOQUOTES) . "',";
	$buff .= " state: '" . htmlspecialchars( $myrow['state'], ENT_NOQUOTES) . "',";
	$buff .= " postal_code: '" . htmlspecialchars( $myrow['postal_code'], ENT_NOQUOTES ) . "',";
	$buff .= " federal_ein: '" . htmlspecialchars( $myrow['federal_ein'], ENT_NOQUOTES ) . "',";
	$buff .= " service_location: '" . htmlspecialchars( $myrow['service_location'], ENT_NOQUOTES ) . "',";
	$buff .= " billing_location: '" . htmlspecialchars( $myrow['billing_location'], ENT_NOQUOTES ) . "',";
	$buff .= " accepts_assignment: '" . htmlspecialchars( $myrow['accepts_assignment'], ENT_NOQUOTES ) . "',";
	$buff .= " pos_code: '" . htmlspecialchars( $myrow['pos_code'], ENT_NOQUOTES ) . "',";
	$buff .= " x12_sender_id: '" . htmlspecialchars( $myrow['x12_sender_id'], ENT_NOQUOTES ) . "',";
	$buff .= " attn: '" . htmlspecialchars( $myrow['attn'], ENT_NOQUOTES ) . "',";
	$buff .= " domain_identifier: '" . htmlspecialchars( $myrow['domain_identifier'], ENT_NOQUOTES ) . "',";
	$buff .= " facility_npi: '" . htmlspecialchars( $myrow['facility_npi'], ENT_NOQUOTES ) . "',";
	$buff .= " tax_id_type: '" . htmlspecialchars( $myrow['tax_id_type'], ENT_NOQUOTES ) . "',";
	$buff .= " country_code: '" . htmlspecialchars( $myrow['country_code'], ENT_NOQUOTES) . "'}," . chr(13);
}

$buff = substr($buff, 0, -2); // Delete the last comma.
echo $_GET['callback'] . '({';
echo "results: " . $count . ", " . chr(13);
echo "row: [" . chr(13);
echo $buff;
echo "]})" . chr(13);


?>