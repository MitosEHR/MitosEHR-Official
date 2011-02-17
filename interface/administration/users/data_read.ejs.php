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
$sql = "SELECT * FROM users WHERE users.active = 1 AND ( users.authorized = 1 OR users.username != '' )
        ORDER BY username LIMIT ".$start.",".$count;
$result = sqlStatement( $sql );
// Total of rows in database
$total = mysql_query("SELECT COUNT(id) FROM users");
$total = mysql_result($total, 0);

while ($myrow = sqlFetchArray($result)) {
  $rec['authorizedd'] = ($myrow['authorized'] == '1' ? 'Yes' : 'No');
  $buff .= "{";
  $buff .= " id: '" . dataEncode( $myrow['id'] ) . "',";
  $buff .= " username: '" . dataEncode( $myrow['username'] ) . "',";
  $buff .= " password: '" . $aes->decrypt( $myrow['password'] ) . "',";
  $buff .= " authorizedd: '" . dataEncode( $rec['authorizedd'] ) . "',";
  $buff .= " authorized: '" . dataEncode( $myrow['authorized'] ) . "',";
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
  $buff .= " email: '" . dataEncode( $myrow['email'] ) . "',";
  $buff .= " url: '" . dataEncode( $myrow['url'] ) . "',";
  $buff .= " assistant: '" . dataEncode( $myrow['assistant'] ) . "',";
  $buff .= " organization: '" . dataEncode( $myrow['organization'] ) . "',";
  $buff .= " valedictory: '" . dataEncode( $myrow['valedictory'] ) . "',";
  //append a <br> or "," to fulladdress if colounm not NULL or blank 
  if($myrow['street']  != NULL || $myrow['street']  != "" ) {
     $rec['street']   = dataEncode( $myrow['street']) . "<br>";} else { $rec['street'] = dataEncode( $myrow['street']) ;
  }
  if($myrow['streetb'] != NULL || $myrow['streetb'] != "" ) {
     $rec['streetb']  = dataEncode( $myrow['streetb']) . "<br>";} else { $rec['streetb'] = dataEncode( $myrow['streetb']) ;
  }
  if($myrow['city']    != NULL || $myrow['city']    != "" ) {
     $rec['city']     = dataEncode( $myrow['city']) . ", ";} else { $rec['city'] = dataEncode( $myrow['city']) ;
  }
  $buff .= " fulladdress: '" . $rec['street'] . $rec['streetb'] . $rec['city']  . " ".  dataEncode( $myrow['state']) . " " .  dataEncode( $myrow['zip'])  . "',";
  $buff .= " street: '" . dataEncode( $myrow['street'] ) . "',";
  $buff .= " streetb: '" . dataEncode( $myrow['streetb'] ) . "',";
  $buff .= " city: '" . dataEncode( $myrow['city'] ) . "',";
  $buff .= " state: '" . dataEncode( $myrow['state'] ) . "',";
  $buff .= " zip: '" . dataEncode( $myrow['zip'] ) . "',";
  $buff .= " street2: '" . dataEncode( $myrow['street2'] ) . "',";
  $buff .= " streetb2: '" . dataEncode( $myrow['streetb2'] ) . "',";
  $buff .= " city2: '" . dataEncode( $myrow['city2'] ) . "',";
  $buff .= " state2: '" . dataEncode( $myrow['state2'] ) . "',";
  $buff .= " zip2: '" . dataEncode( $myrow['zip2'] ) . "',";
  $buff .= " phone: '" . dataEncode( $myrow['phone'] ) . "',";
  $buff .= " fax: '" . dataEncode( $myrow['fax'] ) . "',";
  $buff .= " phonew1: '" . dataEncode( $myrow['phonew1'] ) . "',";
  $buff .= " phonew2: '" . dataEncode( $myrow['phonew2'] ) . "',";
  $buff .= " phonecell: '" . dataEncode( $myrow['phonecell'] ) . "',";
  $buff .= " notes: '" . dataEncode( $myrow['notes'] ) . "',";
  $buff .= " cal_ui: '" . dataEncode( $myrow['cal_ui'] ) . "',";
  $buff .= " taxonomy: '" . dataEncode( $myrow['taxonomy'] ) . "',";
  $buff .= " ssi_relayhealth: '" . dataEncode( $myrow['ssi_relayhealth'] ) . "',";
  $buff .= " calendar: '" . dataEncode( $myrow['calendar'] ) . "',";
  $buff .= " abook_type: '" . dataEncode( $myrow['abook_type'] ) . "',";
  $buff .= " pwd_expiration_date: '" . dataEncode( $myrow['pwd_expiration_date'] ) . "',";
  $buff .= " pwd_history1: '" . dataEncode( $myrow['pwd_history1'] ) . "',";
  $buff .= " pwd_history2: '" . dataEncode( $myrow['pwd_history2'] ) . "',";
  $buff .= " default_warehouse: '" . dataEncode( $myrow['default_warehouse'] ) . "',";
  $buff .= " irnpool: '" . dataEncode( $myrow['irnpool'] ) . "',";
  $buff .= " ab_name: '" . dataEncode( $myrow['ab_name'] ) . "',";
  $buff .= " ab_title: '" . dataEncode( $myrow['ab_title'] ) . "'}," . chr(13);
}

$buff = substr($buff, 0, -2); // Delete the last comma.
echo $_GET['callback'] . '({';
echo "totals: " . $total . ", " . chr(13);
echo "row: [" . chr(13);
echo $buff;
echo "]})" . chr(13);
?>