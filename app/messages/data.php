<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File: data.php
 * Date: 10/28/11
 * Time: 1:41 PM
 */
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');
$_SESSION['site']['flops'] = 0;
include_once($_SESSION['site']['root']."/classes/dbHelper.class.php");
include_once($_SESSION['site']['root']."/repo/global_functions/global_functions.php");

$mitos_db   = new dbHelper();

$rawData    = file_get_contents("php://input");
$foo        = json_decode($rawData, true);
$data       = $foo['row'];

$start      = (!$_REQUEST["start"])? 0 : $_REQUEST["start"];
$limit      = (!$_REQUEST["limit"])? 30 : $_REQUEST["limit"];

switch($_SERVER['REQUEST_METHOD']){
    case 'GET':
        $mitos_db->setSQL("SELECT pnotes.* ,
                                  users.fname AS username_fname,
                                  users.mname AS username_mname,
                                  users.lname AS username_lname,
                                  patient_data.fname AS patient_fname,
                                  patient_data.mname AS patient_mname,
                                  patient_data.lname AS patient_lname
                             FROM pnotes
                  LEFT OUTER JOIN patient_data ON pnotes.pid = patient_data.id
                  LEFT OUTER JOIN users ON pnotes.user_id = users.id
                            WHERE pnotes.deleted = '0'
                         ORDER BY pnotes.date
                            LIMIT $start, $limit");
        $total = $mitos_db->rowCount();
        $rows = array();
        foreach($mitos_db->execStatement(PDO::FETCH_ASSOC) as $row){
            $row['patient_name']    = fullname($row['patient_fname'],$row['patient_mname'],$row['patient_lname']);
            $row['user']            = fullname($row['username_fname'],$row['username_mname'],$row['username_lname']);
            array_push($rows, $row);
        }
        //------------------------------------------------------------------------------
        // here we are adding "totals" and the root "row" for sencha use
        //------------------------------------------------------------------------------
        print_r(json_encode(array('totals'=>$total,'row'=>$rows)));
    exit;
    case 'POST':
        $t                      = date('l jS \of F Y h:i:s A');
        $row['body']            = 'On '.$t.' - '.$_SESSION['user']['name'].' - Wrote:<br><br>'.$data['curr_msg'];
        $row['pid']             = $data['pid'];
        $row['user_id']         = $_SESSION['user']['id'];
        $row['facility_id']     = $_SESSION['site']['facility'];
        $row['activity']        = $data['activity'];
        $row['authorized']      = $data['authorized'];
        $row['assigned_to']     = $data['assigned_to'];
        $row['message_status']  = $data['message_status'];
        $row['subject']         = $data['subject'];
        $row['reply_id']        = $data['reply_id'];
        $row['note_type']       = $data['note_type'];
        $sql = $mitos_db->sqlBind($row, "pnotes", "I");
        $mitos_db->setSQL($sql);
        $ret = $mitos_db->execLog();
        if ( $ret[2] ){
            echo '{ success: false, errors: { reason: "'. $ret[2] .'" }}';
        } else {
            echo "{ success: true }";
        }
    exit;
    case 'PUT':
        $t                      = date('l jS \of F Y h:i:s A');
        $row['body']            = 'On '.$t.' - <spam style="font-weight:bold">'.$_SESSION['user']['name'].'</spam> - Wrote:<br><br>'.$data['curr_msg'].'<br><br>';
        $row['user_id']         = $_SESSION['user']['id'];
        $row['facility_id']     = $_SESSION['site']['facility'];
        $row['activity']        = $data['activity'];
        $row['authorized']      = $data['authorized'];
        $row['message_status']  = $data['message_status'];
        $row['subject']         = $data['subject'];
        $row['reply_id']        = $data['reply_id'];
        $row['note_type']       = $data['note_type'];
        $sql = $mitos_db->sqlBind($row, "pnotes", "U", "id='" . $data['id'] . "'");
        $mitos_db->setSQL($sql);
        $ret = $mitos_db->execLog();
        if ( $ret[2] ){
            echo '{ success: false, errors: { reason: "'. $ret[2] .'" }}';
        } else {
            echo "{ success: true }";
        }
    exit;
    case 'DELETE':
        $id = $data['id'];
        $sql = "UPDATE pnotes SET deleted = '1' WHERE id='$id'";
        $mitos_db->setSQL($sql);
        $ret = $mitos_db->execLog();
        if ( $ret[2] ){
            echo '{ success: false, errors: { reason: "'. $ret[2] .'" }}';
        } else {
            echo "{ success: true }";
        }
    exit;
}