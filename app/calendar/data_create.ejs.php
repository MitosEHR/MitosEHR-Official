<?php
/**
 * Created by JetBrains PhpStorm.
 * User: ernesto
 * Date: 6/26/11
 * Time: 9:25 AM
 * To change this template use File | Settings | File Templates.
 */
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');
include_once($_SESSION['site']['root']."/classes/dbHelper.php");
include_once($_SESSION['site']['root']."/repo/global_functions/global_functions.php");
$_SESSION['site']['flops'] = 0;

$mitos_db = new dbHelper();


$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);
// ********************************************************************
// Lets get the patient full name to use it as the event title
// ********************************************************************
$sql = "SELECT fname, mname, lname FROM patient_data WHERE id='".$data['patient_id']."'";
$mitos_db->setSQL($sql);
$rec = $mitos_db->fetch();
$fullName = fullname($rec['fname'],$rec['mname'],$rec['lname']);

$row['user_id']             = $data['user_id'];
$row['category']            = $data['category'];
$row['facility']            = $data['facility'];
$row['billing_facillity']   = $data['billing_facillity'];
$row['patient_id']          = $data['patient_id'];
$row['title']               = $fullName;
$row['status']              = $data['status'];
$row['start']               = $data['start'];
$row['end']                 = $data['end'];
$row['rrule']               = $data['rrule'];
$row['loc']                 = $data['loc'];
$row['notes']               = $data['notes'];
$row['url']                 = $data['url'];
$row['ad']                  = $data['ad'];

$sql = $mitos_db->sqlBind($row, "calendar_events", "I");
$mitos_db->setSQL($sql);
$ret = $mitos_db->execLog();
// ********************************************************************
// If no error found, return the same record back to the calendar
// ********************************************************************
if ($ret[2]){
    echo '{ success: false, errors: { reason: "'. $ret[2] .'" }}';
} else {
    $row = array();
    $sql = ("SELECT * FROM calendar_events WHERE id = '".$mitos_db->lastInsertId."' ");
    $mitos_db->setSQL($sql);
    $total = $mitos_db->rowCount();
    $rows = array();
    foreach($mitos_db->execStatement(PDO::FETCH_ASSOC) as $row){
        array_push($rows, $row);
    }
    print_r(json_encode(array('success'=>true, 'message'=>'Loaded data', 'data'=>$rows)));
}
?>