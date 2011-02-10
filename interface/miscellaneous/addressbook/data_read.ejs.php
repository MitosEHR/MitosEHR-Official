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


$count = "0";
$sql = "SELECT 
          users.*, 
          list_options.option_id AS ab_name 
        FROM 
          users
        LEFT JOIN 
          list_options ON list_id = 'abook_type' AND option_id = users.abook_type
        WHERE 
          users.active = 1 AND ( users.authorized = 1 OR users.username = '' ) ";
          
        // if ($form_lname) $query .= "AND u.lname LIKE '$form_lname%' ";
        // if ($form_fname) $query .= "AND u.fname LIKE '$form_fname%' ";
        // if ($form_specialty) $query .= "AND u.specialty LIKE '%$form_specialty%' ";
        // if ($form_abook_type) $query .= "AND u.abook_type LIKE '$form_abook_type' ";
        // if ($form_external) $query .= "AND u.username = '' ";
        // $query .= "ORDER BY u.lname, u.fname, u.mname LIMIT 500";
$result = sqlStatement( $sql );

while ($myrow = sqlFetchArray($result)) {
  $count++;
  $buff .= "{";
  $buff .= " id: '" . htmlspecialchars( $myrow['id'], ENT_QUOTES) . "',";
  $buff .= " username: '" . htmlspecialchars( $myrow['username'], ENT_QUOTES) . "',";
  $buff .= " password: '" . htmlspecialchars( $myrow['password'], ENT_QUOTES) . "',";
  $buff .= " authorized: '" . htmlspecialchars( $myrow['authorized'], ENT_QUOTES) . "',";
  $buff .= " info: '" . htmlspecialchars( $myrow['info'], ENT_QUOTES) . "',";
  $buff .= " source: '" . htmlspecialchars( $myrow['source'], ENT_QUOTES) . "',";
  $buff .= " fname: '" . htmlspecialchars( $myrow['fname'], ENT_QUOTES) . "',";
  $buff .= " mname: '" . htmlspecialchars( $myrow['mname'], ENT_QUOTES) . "',";
  $buff .= " lname: '" . htmlspecialchars( $myrow['lname'], ENT_QUOTES) . "',";
  $buff .= " fullname: '" . htmlspecialchars( $myrow['lname'], ENT_QUOTES) . ", " . htmlspecialchars( $myrow['fname'], ENT_QUOTES) . " " . htmlspecialchars( $myrow['mname'], ENT_QUOTES) . "',";
  $buff .= " federaltaxid: '" . htmlspecialchars( $myrow['federaltaxid'], ENT_QUOTES) . "',";
  $buff .= " federaldrugid: '" . htmlspecialchars( $myrow['federaldrugid'], ENT_QUOTES) . "',";
  $buff .= " upin: '" . htmlspecialchars( $myrow['upin'], ENT_QUOTES) . "',";
  $buff .= " facility: '" . htmlspecialchars( $myrow['facility'], ENT_QUOTES) . "',";
  $buff .= " facility_id: '" . htmlspecialchars( $myrow['facility_id'], ENT_QUOTES) . "',";
  $buff .= " see_auth: '" . htmlspecialchars( $myrow['see_auth'], ENT_QUOTES) . "',";
  $buff .= " active: '" . htmlspecialchars( $myrow['active'], ENT_QUOTES) . "',";
  $buff .= " npi: '" . htmlspecialchars( $myrow['npi'], ENT_QUOTES) . "',";
  $buff .= " title: '" . htmlspecialchars( $myrow['title'], ENT_QUOTES) . "',";
  $buff .= " specialty: '" . htmlspecialchars( $myrow['specialty'], ENT_QUOTES) . "',";
  $buff .= " billname: '" . htmlspecialchars( $myrow['billname'], ENT_QUOTES) . "',";
  $buff .= " email: '" . htmlspecialchars( $myrow['email'], ENT_QUOTES) . "',";
  $buff .= " url: '" . htmlspecialchars( $myrow['url'], ENT_QUOTES) . "',";
  $buff .= " assistant: '" . htmlspecialchars( $myrow['assistant'], ENT_QUOTES) . "',";
  $buff .= " organization: '" . htmlspecialchars( $myrow['organization'], ENT_QUOTES) . "',";
  $buff .= " valedictory: '" . htmlspecialchars( $myrow['valedictory'], ENT_QUOTES) . "',";
  $buff .= " street: '" . htmlspecialchars( $myrow['street'], ENT_QUOTES) . "',";
  $buff .= " streetb: '" . htmlspecialchars( $myrow['streetb'], ENT_QUOTES) . "',";
  $buff .= " city: '" . htmlspecialchars( $myrow['city'], ENT_QUOTES) . "',";
  $buff .= " state: '" . htmlspecialchars( $myrow['state'], ENT_QUOTES) . "',";
  $buff .= " zip: '" . htmlspecialchars( $myrow['zip'], ENT_QUOTES) . "',";
  $buff .= " street2: '" . htmlspecialchars( $myrow['street2'], ENT_QUOTES) . "',";
  $buff .= " streetb2: '" . htmlspecialchars( $myrow['streetb2'], ENT_QUOTES) . "',";
  $buff .= " city2: '" . htmlspecialchars( $myrow['city2'], ENT_QUOTES) . "',";
  $buff .= " state2: '" . htmlspecialchars( $myrow['state2'], ENT_QUOTES) . "',";
  $buff .= " zip2: '" . htmlspecialchars( $myrow['zip2'], ENT_QUOTES) . "',";
  $buff .= " phone: '" . htmlspecialchars( $myrow['phone'], ENT_QUOTES) . "',";
  $buff .= " fax: '" . htmlspecialchars( $myrow['fax'], ENT_QUOTES) . "',";
  $buff .= " phonew1: '" . htmlspecialchars( $myrow['phonew1'], ENT_QUOTES) . "',";
  $buff .= " phonew2: '" . htmlspecialchars( $myrow['phonew2'], ENT_QUOTES) . "',";
  $buff .= " phonecell: '" . htmlspecialchars( $myrow['phonecell'], ENT_QUOTES) . "',";
  $buff .= " notes: '" . htmlspecialchars( $myrow['notes'], ENT_QUOTES) . "',";
  $buff .= " cal_ui: '" . htmlspecialchars( $myrow['cal_ui'], ENT_QUOTES) . "',";
  $buff .= " taxonomy: '" . htmlspecialchars( $myrow['taxonomy'], ENT_QUOTES) . "',";
  $buff .= " ssi_relayhealth: '" . htmlspecialchars( $myrow['ssi_relayhealth'], ENT_QUOTES) . "',";
  $buff .= " calendar: '" . htmlspecialchars( $myrow['calendar'], ENT_QUOTES) . "',";
  $buff .= " abook_type: '" . htmlspecialchars( $myrow['abook_type'], ENT_QUOTES) . "',";
  $buff .= " pwd_expiration_date: '" . htmlspecialchars( $myrow['pwd_expiration_date'], ENT_QUOTES) . "',";
  $buff .= " pwd_history1: '" . htmlspecialchars( $myrow['pwd_history1'], ENT_QUOTES) . "',";
  $buff .= " pwd_history2: '" . htmlspecialchars( $myrow['pwd_history2'], ENT_QUOTES) . "',";
  $buff .= " default_warehouse: '" . htmlspecialchars( $myrow['default_warehouse'], ENT_QUOTES) . "',";
  $buff .= " irnpool: '" . htmlspecialchars( $myrow['irnpool'], ENT_QUOTES) . "',";
  
  $buff .= " ab_name: '" . htmlspecialchars( $myrow['ab_name'], ENT_NOQUOTES) . "'}," . chr(13);
}

$buff = substr($buff, 0, -2); // Delete the last comma.
echo $_GET['callback'] . '({';
echo "results: " . $count . ", " . chr(13);
echo "row: [" . chr(13);
echo $buff;
echo "]})" . chr(13);
?>