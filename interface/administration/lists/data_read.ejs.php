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
// Load the MitosEMR Libraries
// *************************************************************************************
require_once("../../registry.php");
require_once("../../../repository/dataExchange/dataExchange.inc.php");

// Count records variable
$count = 0;

// *************************************************************************************
// Verify if a $_GET['id'] has passed to select a facility.
// and execute the apropriate SQL statement
// *************************************************************************************
if ($_GET['id']){
	$sql = "SELECT
				* 
			FROM
				facility
			ORDER BY 
				name
			WHERE id=" . $_GET['id'];
} else { // if not select all of them
	$sql = "SELECT
				* 
			FROM
				facility
			ORDER BY 
				name";
}
$result = sqlStatement( $sql );

while ($myrow = sqlFetchArray($result)) {
	$count++;
	
	// Parse some data
	$rec['service_location'] = ($myrow['service_location'] == '1' ? 'on' : 'off');
	$rec['billing_location'] = ($myrow['billing_location'] == '1' ? 'on' : 'off');
	$rec['accepts_assignment'] = ($myrow['accepts_assignment'] == '1' ? 'on' : 'off');
	if (strlen($myrow['pos_code']) <= 1){
		$rec['pos_code'] = '0'.$myrow['pos_code'];
	} else {
		$rec['pos_code'] = $myrow['pos_code'];
	}
	
	$buff .= "{";
	$buff .= " id: '" . dataEncode( $myrow['id'] ) . "',";
	$buff .= " name: '" . dataEncode( $myrow['name'] ) . "',";
	$buff .= " phone: '" . dataEncode( $myrow['phone'] ) . "',";
	$buff .= " fax: '" . dataEncode( $myrow['fax'] ) . "',";
	$buff .= " street: '" . dataEncode( $myrow['street'] ) . "'," ;
	$buff .= " city: '" . dataEncode( $myrow['city'] ) . "',";
	$buff .= " state: '" . dataEncode( $myrow['state'] ) . "',";
	$buff .= " postal_code: '" . dataEncode( $myrow['postal_code'] ) . "',";
	$buff .= " federal_ein: '" . dataEncode( $myrow['federal_ein'] ) . "',";
	$buff .= " service_location: '" . $rec['service_location'] . "',";
	$buff .= " billing_location: '" . $rec['billing_location'] . "',";
	$buff .= " accepts_assignment: '" . $rec['accepts_assignment'] . "',";
	$buff .= " pos_code: '" . $rec['pos_code'] . "',";
	$buff .= " x12_sender_id: '" . dataEncode( $myrow['x12_sender_id'] ) . "',";
	$buff .= " attn: '" . dataEncode( $myrow['attn'] ) . "',";
	$buff .= " domain_identifier: '" . dataEncode( $myrow['domain_identifier'] ) . "',";
	$buff .= " facility_npi: '" . dataEncode( $myrow['facility_npi'] ) . "',";
	$buff .= " tax_id_type: '" . dataEncode( $myrow['tax_id_type'] ) . "',";
	$buff .= " country_code: '" . dataEncode( $myrow['country_code'] ) . "'}," . chr(13);
}

$buff = substr($buff, 0, -2); // Delete the last comma.
echo $_GET['callback'] . '({';
echo "results: " . $count . ", " . chr(13);
echo "row: [" . chr(13);
echo $buff;
echo "]})" . chr(13);


?>