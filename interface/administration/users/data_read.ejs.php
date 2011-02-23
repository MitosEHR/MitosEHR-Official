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

session_name ( "MitosEHR" );
session_start();

include_once($_SESSION['site']['root']."/library/adoHelper/adoHelper.inc.php");
include_once($_SESSION['site']['root']."/library/I18n/I18n.inc.php");
require_once($_SESSION['site']['root']."/repository/dataExchange/dataExchange.inc.php");

require_once("../../../library/phpAES/AES.class.php");
$z = "abcdefghijuklmno0123456789012345"; // 256-bit key
$aes = new AES($z);

// Setting defults incase no request is sent by sencha
$start = ($_REQUEST["start"] == null)? 0 : $_REQUEST["start"];
$count = ($_REQUEST["limit"] == null)? 10 : $_REQUEST["limit"];
$sql = "SELECT * FROM users WHERE users.authorized = 1 OR users.username != '' 
        ORDER BY username LIMIT ".$start.",".$count;

// Total of rows in database
$total = mysql_query("SELECT COUNT(id) FROM users");
$total = mysql_result($total, 0);

foreach (sqlStatement($sql) as $urow) {
  // returns "Yes" or "NO" for main grid		
  $rec['authorizedd']= ($urow['authorized'] == '1' ? 'Yes' : 'No');
  $rec['actived'] 	 = ($urow['active'] 	== '1' ? 'Yes' : 'No');
  
  // returns "on" or "off" for checkboxes
  $rec['active'] 	 = ($urow['active'] 	 == '1' ? 'on' : 'off');
  $rec['authorized'] = ($urow['authorized'] == '1' ? 'on' : 'off');
  
  $buff .= "{";
  $buff .= " id: '" . dataEncode( $urow['id'] ) . "',";
  $buff .= " username: '" . dataEncode( $urow['username'] ) . "',";
  $buff .= " password: '" . $aes->decrypt( $urow['password'] ) . "',";
  $buff .= " authorizedd: '" . dataEncode( $rec['authorizedd'] ) . "',";
  $buff .= " authorized: '" . dataEncode( $rec['authorized'] ) . "',";
  $buff .= " actived: '" . dataEncode( $rec['actived'] ) . "',";
  $buff .= " active: '" . dataEncode( $rec['active'] ) . "',";
  $buff .= " info: '" . dataEncode( $urow['info'] ) . "',";
  $buff .= " source: '" . dataEncode( $urow['source'] ) . "',";
  $buff .= " fname: '" . dataEncode( $urow['fname'] ) . "',";
  $buff .= " mname: '" . dataEncode( $urow['mname'] ) . "',";
  $buff .= " lname: '" . dataEncode( $urow['lname'] ) . "',";
  $buff .= " fullname: '" . dataEncode( $urow['lname'] ) . ", " . dataEncode( $urow['fname'] ) . " " . dataEncode( $urow['mname'] ) . "',";
  $buff .= " federaltaxid: '" . dataEncode( $urow['federaltaxid'] ) . "',";
  $buff .= " federaldrugid: '" . dataEncode( $urow['federaldrugid'] ) . "',";
  $buff .= " upin: '" . dataEncode( $urow['upin'] ) . "',";
  $buff .= " facility: '" . dataEncode( $urow['facility'] ) . "',";
  $buff .= " facility_id: '" . dataEncode( $urow['facility_id'] ) . "',";
  $buff .= " see_auth: '" . dataEncode( $urow['see_auth'] ) . "',";
  $buff .= " active: '" . dataEncode( $urow['active'] ) . "',";
  $buff .= " npi: '" . dataEncode( $urow['npi'] ) . "',";
  $buff .= " title: '" . dataEncode( $urow['title'] ) . "',";
  $buff .= " specialty: '" . dataEncode( $urow['specialty'] ) . "',";
  $buff .= " billname: '" . dataEncode( $urow['billname'] ) . "',";
  $buff .= " valedictory: '" . dataEncode( $urow['valedictory'] ) . "',";
  $buff .= " cal_ui: '" . dataEncode( $urow['cal_ui'] ) . "',";
  $buff .= " taxonomy: '" . dataEncode( $urow['taxonomy'] ) . "',";
  $buff .= " ssi_relayhealth: '" . dataEncode( $urow['ssi_relayhealth'] ) . "',";
  $buff .= " calendar: '" . dataEncode( $urow['calendar'] ) . "',";
  $buff .= " pwd_expiration_date: '" . dataEncode( $urow['pwd_expiration_date'] ) . "',";
  $buff .= " pwd_history1: '" . dataEncode( $urow['pwd_history1'] ) . "',";
  $buff .= " pwd_history2: '" . dataEncode( $urow['pwd_history2'] ) . "',";
  $buff .= " default_warehouse: '" . dataEncode( $urow['default_warehouse'] ) . "',";
  $buff .= " irnpool: '" . dataEncode( $urow['irnpool'] ) . "'}," . chr(13);
}

$buff = substr($buff, 0, -2); // Delete the last comma.
echo $_GET['callback'] . '({';
echo "totals: " . $total . ", " . chr(13);
echo "row: [" . chr(13);
echo $buff;
echo "]})" . chr(13);
?>