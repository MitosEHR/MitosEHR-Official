<?php
//--------------------------------------------------------------------------------------------------------------------------
// listOrganization.json.php
// 
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

include_once($_SESSION['site']['root']."/classes/dbHelper.class.php");

// **************************************************************************************
// Reset session count 10 secs = 1 Flop
// **************************************************************************************
$_SESSION['site']['flops'] = 0;

// **************************************************************************************
// Database class instance
// **************************************************************************************
$mitos_db = new dbHelper();
$mitos_db->setSQL("SELECT 
						users.*,
						option_id AS ab_name,
     					title AS ab_title
					FROM
  						users
					LEFT OUTER JOIN 
						list_options
					ON list_id = 'abook_type' AND option_id = abook_type
					WHERE
  						active = 1
  						AND (authorized = 1 OR username = '')
  						AND organization <> ''");

$total = $mitos_db->rowCount();
$rows = array();
foreach ($mitos_db->execStatement(PDO::FETCH_ASSOC) as $row) {
	$row['cName'] = $row['fname'] ." ". $row['mname'] ." ". $row['lname'];  
	array_push($rows, $row);
}
print(json_encode(array('totals'=>$total,'row'=>$rows)));
?>