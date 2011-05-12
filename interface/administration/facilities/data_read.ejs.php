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

session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once("../../../library/dbHelper/dbHelper.inc.php");
include_once("../../../library/I18n/I18n.inc.php");
require_once("../../../repository/dataExchange/dataExchange.inc.php");

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;

// Count records variable
$mitos_db = new dbHelper();

// catch the total records
$sql = "SELECT count(*) as total FROM facility";
$mitos_db->setSQL($sql);
$urow = $mitos_db->execStatement();
$total = $urow[0]['total'];

// Setting defults incase no request is sent by sencha
$start = ($_REQUEST["start"] == null)? 0 : $_REQUEST["start"];
$count = ($_REQUEST["limit"] == null)? 30 : $_REQUEST["limit"];

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
			WHERE id=" . $_GET['id'] . "
			LIMIT " . $start . "," . $count;
} else { // if not select all of them
	$sql = "SELECT
				* 
			FROM
				facility
			ORDER BY 
				name
			LIMIT " . $start . "," . $count;
}
$mitos_db->setSQL($sql);
foreach ($mitos_db->execStatement() as $urow) {
	
	//----------------------------------------------------
	// Parse some data
	//----------------------------------------------------
	$rec['service_location'] = ($urow['service_location'] == '1' ? 'on' : 'off');
	$rec['billing_location'] = ($urow['billing_location'] == '1' ? 'on' : 'off');
	$rec['accepts_assignment'] = ($urow['accepts_assignment'] == '1' ? 'on' : 'off');
	if (strlen($urow['pos_code']) <= 1){
		$rec['pos_code'] = '0'.$urow['pos_code'];
	} else {
		$rec['pos_code'] = $urow['pos_code'];
	}
	
	$buff .= "{";
	$buff .= " id: '" 					. dataEncode( $urow['id'] ) . "',";
	$buff .= " name: '" 				. dataEncode( $urow['name'] ) . "',";
	$buff .= " phone: '" 				. dataEncode( $urow['phone'] ) . "',";
	$buff .= " fax: '" 					. dataEncode( $urow['fax'] ) . "',";
	$buff .= " street: '" 				. dataEncode( $urow['street'] ) . "'," ;
	$buff .= " city: '" 				. dataEncode( $urow['city'] ) . "',";
	$buff .= " state: '" 				. dataEncode( $urow['state'] ) . "',";
	$buff .= " postal_code: '" 			. dataEncode( $urow['postal_code'] ) . "',";
	$buff .= " federal_ein: '" 			. dataEncode( $urow['federal_ein'] ) . "',";
	$buff .= " service_location: '" 	. dataEncode( $rec['service_location'] ) . "',";
	$buff .= " billing_location: '" 	. dataEncode( $rec['billing_location'] ) . "',";
	$buff .= " accepts_assignment: '" 	. dataEncode( $rec['accepts_assignment'] ) . "',";
	$buff .= " pos_code: '" 			. dataEncode( $rec['pos_code'] ) . "',";
	$buff .= " attn: '" 				. dataEncode( $urow['attn'] ) . "',";
	$buff .= " domain_identifier: '" 	. dataEncode( $urow['domain_identifier'] ) . "',";
	$buff .= " facility_npi: '" 		. dataEncode( $urow['facility_npi'] ) . "',";
	$buff .= " tax_id_type: '" 			. dataEncode( $urow['tax_id_type'] ) . "',";
	$buff .= " country_code: '" 		. dataEncode( $urow['country_code'] ) . "'}," . chr(13);
}

$buff = substr($buff, 0, -2); // Delete the last comma.
echo $_GET['callback'] . '({';
echo "totals: " . $total . ", " . chr(13);
echo "row: [" . chr(13);
echo $buff;
echo "]})" . chr(13);


?>