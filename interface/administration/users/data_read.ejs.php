<?php
//--------------------------------------------------------------------------------------------------------------------------
// manage_messages.ejs.php
// v0.0.1
// Under GPLv3 License
//
// Integrated by: Ernesto Rodriguez. in 2011
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
require_once("../../../repository/dataExchange/dataExchange.inc.php");
require_once("../../../library/phpAES/AES.class.php");
$z = "abcdefghijuklmno0123456789012345"; // 256-bit key
$aes = new AES($z);
// Setting defults incase no request is sent by sencha
$start = ($_REQUEST["start"] == null)? 0 : $_REQUEST["start"];
$count = ($_REQUEST["limit"] == null)? 10 : $_REQUEST["limit"];
$sql = "SELECT * FROM users WHERE users.authorized = 1 OR users.username != '' 
        ORDER BY username LIMIT ".$start.",".$count;
$result = sqlStatement( $sql );
// Total of rows in database
$total = mysql_query("SELECT COUNT(id) FROM users");
$total = mysql_result($total, 0);

while ($myrow = sqlFetchArray($result)) {
  // returns "Yes" or "NO" for main grid		
  $rec['authorizedd'] = ($myrow['authorized'] == '1' ? 'Yes' : 'No');
  
  // returns "on" or "off" for checkboxes
  $rec['active'] 	 = ($myrow['active'] 	 == '1' ? 'on' : 'off');
  $rec['authorized'] = ($myrow['authorized'] == '1' ? 'on' : 'off');
  
  $buff .= "{";
  $buff .= " id: '" . dataEncode( $myrow['id'] ) . "',";
  $buff .= " username: '" . dataEncode( $myrow['username'] ) . "',";
  $buff .= " password: '" . $aes->decrypt( $myrow['password'] ) . "',";
  $buff .= " authorizedd: '" . dataEncode( $rec['authorizedd'] ) . "',";
  $buff .= " authorized: '" . dataEncode( $rec['authorized'] ) . "',";
  $buff .= " active: '" . dataEncode( $rec['active'] ) . "',";
  $buff .= " info: '" . dataEncode( $myrow['info'] ) . "',";
  $buff .= " source: '" . dataEncode( $myrow['source'] ) . "',";
  $buff .= " fname: '" . dataEncode( $myrow['fname'] ) . "',";
  $buff .= " mname: '" . dataEncode( $myrow['mname'] ) . "',";
  $buff .= " lname: '" . dataEncode( $myrow['lname'] ) . "',";
  $buff .= " fullname: '" . dataEncode( $myrow['lname'] ) . ", " . dataEncode( $myrow['fname'] ) . " " . dataEncode( $myrow['mname'] ) . "',";
  $buff .= " federaltaxid: '" . dataEncode( $myrow['federaltaxid'] ) . "',";
  $buff .= " federaldrugid: '" . dataEncode( $myrow['federaldrugid'] ) . "',";
  $buff .= " upin: '" . dataEncode( $myrow['upin'] ) . "',";
  $buff .= " facility: '" . dataEncode( $myrow['facility'] ) . "',";
  $buff .= " facility_id: '" . dataEncode( $myrow['facility_id'] ) . "',";
  $buff .= " see_auth: '" . dataEncode( $myrow['see_auth'] ) . "',";
  $buff .= " active: '" . dataEncode( $myrow['active'] ) . "',";
  $buff .= " npi: '" . dataEncode( $myrow['npi'] ) . "',";
  $buff .= " title: '" . dataEncode( $myrow['title'] ) . "',";
  $buff .= " specialty: '" . dataEncode( $myrow['specialty'] ) . "',";
  $buff .= " billname: '" . dataEncode( $myrow['billname'] ) . "',";
  $buff .= " valedictory: '" . dataEncode( $myrow['valedictory'] ) . "',";
  $buff .= " cal_ui: '" . dataEncode( $myrow['cal_ui'] ) . "',";
  $buff .= " taxonomy: '" . dataEncode( $myrow['taxonomy'] ) . "',";
  $buff .= " ssi_relayhealth: '" . dataEncode( $myrow['ssi_relayhealth'] ) . "',";
  $buff .= " calendar: '" . dataEncode( $myrow['calendar'] ) . "',";
  $buff .= " pwd_expiration_date: '" . dataEncode( $myrow['pwd_expiration_date'] ) . "',";
  $buff .= " pwd_history1: '" . dataEncode( $myrow['pwd_history1'] ) . "',";
  $buff .= " pwd_history2: '" . dataEncode( $myrow['pwd_history2'] ) . "',";
  $buff .= " default_warehouse: '" . dataEncode( $myrow['default_warehouse'] ) . "',";
  $buff .= " irnpool: '" . dataEncode( $myrow['irnpool'] ) . "'}," . chr(13);
}

$buff = substr($buff, 0, -2); // Delete the last comma.
echo $_GET['callback'] . '({';
echo "totals: " . $total . ", " . chr(13);
echo "row: [" . chr(13);
echo $buff;
echo "]})" . chr(13);
?>