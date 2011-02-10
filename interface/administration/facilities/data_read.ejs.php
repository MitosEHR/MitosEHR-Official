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
	$buff .= " id: '" . htmlspecialchars( $myrow['id'], ENT_QUOTES) . "',";
	$buff .= " name: '" . htmlspecialchars( $myrow['name'], ENT_QUOTES) . "',";
	$buff .= " phone: '" . htmlspecialchars( $myrow['phone'], ENT_QUOTES) . "',";
	$buff .= " fax: '" . htmlspecialchars( $myrow['fax'], ENT_QUOTES) . "',";
	$buff .= " street: '" . htmlspecialchars( $myrow['street'], ENT_NOQUOTES) . "'," ;
	$buff .= " city: '" . htmlspecialchars( $myrow['city'], ENT_NOQUOTES) . "',";
	$buff .= " state: '" . htmlspecialchars( $myrow['state'], ENT_NOQUOTES) . "',";
	$buff .= " postal_code: '" . htmlspecialchars( $myrow['postal_code'], ENT_NOQUOTES ) . "',";
	$buff .= " federal_ein: '" . htmlspecialchars( $myrow['federal_ein'], ENT_NOQUOTES ) . "',";
	$buff .= " service_location: '" . $rec['service_location'] . "',";
	$buff .= " billing_location: '" . $rec['billing_location'] . "',";
	$buff .= " accepts_assignment: '" . $rec['accepts_assignment'] . "',";
	$buff .= " pos_code: '" . $rec['pos_code'] . "',";
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