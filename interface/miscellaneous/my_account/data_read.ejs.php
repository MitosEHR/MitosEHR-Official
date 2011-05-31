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
session_cache_limiter('private');
include_once("../../../library/dbHelper/dbHelper.inc.php");
include_once("../../../library/I18n/I18n.inc.php");
require_once("../../../repository/dataExchange/dataExchange.inc.php");
require_once("../../../library/phpAES/AES.class.php");
//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;
//-------------------------------------------
// password to AES and validate
//-------------------------------------------
$aes = new AES($_SESSION['site']['AESkey']);
//------------------------------------------
// Database class instance
//------------------------------------------
$mitos_db = new dbHelper();
$user = $_SESSION['user']['id'];
$mitos_db->setSQL("SELECT users.*, 
          				  list_options.option_id AS ab_name,
          				  list_options.title AS ab_title  
        			 FROM users
        		LEFT JOIN list_options ON list_id = 'abook_type' AND option_id = users.abook_type
        			WHERE users.id = ".$user);
$total = $mitos_db->rowCount();
$buff = '';        			
foreach ($mitos_db->execStatement() as $myrow) {
  $buff .= '{';
  $buff .= '"id":"' 					.dataEncode($myrow['id']).'",';
  $buff .= '"username":"' 				.dataEncode($myrow['username']).'",';
  $buff .= '"password":"' 				.$aes->decrypt($myrow['password']).'",';
  $buff .= '"authorized":"' 			.dataEncode($myrow['authorized']).'",';
  $buff .= '"info":"'					.dataEncode($myrow['info']).'",';
  $buff .= '"source":"' 				.dataEncode($myrow['source']).'",';
  $buff .= '"fname":"' 					.dataEncode($myrow['fname']).'",';
  $buff .= '"mname":"' 					.dataEncode($myrow['mname']).'",';
  $buff .= '"lname":"' 					.dataEncode($myrow['lname']).'",';
  $buff .= '"federaltaxid":"' 			.dataEncode($myrow['federaltaxid']).'",';
  $buff .= '"federaldrugid":"' 			.dataEncode($myrow['federaldrugid']).'",';
  $buff .= '"upin":"' 					.dataEncode($myrow['upin']).'",';
  $buff .= '"facility":"' 				.dataEncode($myrow['facility']).'",';
  $buff .= '"facility_id":"'		 	.dataEncode($myrow['facility_id']).'",';
  $buff .= '"see_auth":"' 				.dataEncode($myrow['see_auth']).'",';
  $buff .= '"active":"' 				.dataEncode($myrow['active']).'",';
  $buff .= '"npi":"' 					.dataEncode($myrow['npi']).'",';
  $buff .= '"title":"' 					.dataEncode($myrow['title']).'",';
  $buff .= '"specialty":"' 				.dataEncode($myrow['specialty']).'",';
  $buff .= '"billname":"' 				.dataEncode($myrow['billname']).'",';
  $buff .= '"email":"' 					.dataEncode($myrow['email']).'",';
  $buff .= '"url":"' 					.dataEncode($myrow['url']).'",';
  $buff .= '"assistant":"' 				.dataEncode($myrow['assistant']).'",';
  $buff .= '"organization":"'		 	.dataEncode($myrow['organization']).'",';
  $buff .= '"valedictory":"' 			.dataEncode($myrow['valedictory']).'",';
  $buff .= '"street":"' 				.dataEncode($myrow['street'] ).'",';
  $buff .= '"streetb":"' 				.dataEncode($myrow['streetb'] ).'",';
  $buff .= '"city":"' 					.dataEncode($myrow['city'] ).'",';
  $buff .= '"state":"' 					.dataEncode($myrow['state'] ).'",';
  $buff .= '"zip":"'					.dataEncode($myrow['zip'] ).'",';
  $buff .= '"street2":"' 				.dataEncode($myrow['street2'] ).'",';
  $buff .= '"streetb2":"' 				.dataEncode($myrow['streetb2'] ).'",';
  $buff .= '"city2":"'					.dataEncode($myrow['city2'] ).'",';
  $buff .= '"state2":"' 				.dataEncode($myrow['state2'] ).'",';
  $buff .= '"zip2":"'					.dataEncode($myrow['zip2'] ).'",';
  $buff .= '"phone":"' 					.dataEncode($myrow['phone'] ).'",';
  $buff .= '"fax":"' 					.dataEncode($myrow['fax'] ).'",';
  $buff .= '"phonew1":"' 				.dataEncode($myrow['phonew1'] ).'",';
  $buff .= '"phonew2":"' 				.dataEncode($myrow['phonew2'] ).'",';
  $buff .= '"phonecell":"'			 	.dataEncode($myrow['phonecell'] ).'",';
  $buff .= '"cal_ui":"' 				.dataEncode($myrow['cal_ui'] ).'",';
  $buff .= '"taxonomy":"' 				.dataEncode($myrow['taxonomy'] ).'",';
  $buff .= '"ssi_relayhealth":"' 		.dataEncode($myrow['ssi_relayhealth'] ).'",';
  $buff .= '"calendar":"' 				.dataEncode($myrow['calendar'] ).'",';
  $buff .= '"abook_type":"' 			.dataEncode($myrow['abook_type'] ).'",';
  $buff .= '"pwd_expiration_date":"' 	.dataEncode($myrow['pwd_expiration_date'] ).'",';
  $buff .= '"pwd_history1":"' 			.dataEncode($myrow['pwd_history1'] ).'",';
  $buff .= '"pwd_history2":"' 			.dataEncode($myrow['pwd_history2'] ).'",';
  $buff .= '"default_warehouse":"' 		.dataEncode($myrow['default_warehouse'] ).'",';
  $buff .= '"irnpool":"' 				.dataEncode($myrow['irnpool'] ).'",';
  $buff .= '"ab_name":"' 				.dataEncode($myrow['ab_name'] ).'",';
  $buff .= '"ab_title":"' 				.dataEncode($myrow['ab_title'] ).'"},'.chr(13);
}
$buff = substr($buff, 0, -2); // Delete the last comma.
echo '{';
echo '"totals": "' . $total . '", ' . chr(13);
echo '"row": [' . chr(13);
echo $buff;
echo ']}' . chr(13);
?>