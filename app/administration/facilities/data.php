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
include_once($_SESSION['site']['root']."/classes/dbHelper.php");
include_once($_SESSION['site']['root']."/repo/global_functions/global_functions.php");

$mitos_db   = new dbHelper();

$rawData    = file_get_contents("php://input");
$foo        = json_decode($rawData, true);
$data       = $foo['row'];

$start      = (!$_REQUEST["start"])? 0 : $_REQUEST["start"];
$limit      = (!$_REQUEST["limit"])? 10 : $_REQUEST["limit"];

switch($_SERVER['REQUEST_METHOD']){
    case 'GET':
        if ($_GET['id']){
            $sql = "SELECT *
                      FROM facility
                  ORDER BY name
                     WHERE id=" . $_GET['id'] . "
                     LIMIT " . $start . "," . $limit;
        } else { // if not select all of them
            $sql = "SELECT *
                      FROM facility
                  ORDER BY name
                     LIMIT " . $start . "," . $limit;
        }
        $mitos_db->setSQL($sql);
        $total = $mitos_db->rowCount();
        $rows = array();
        foreach($mitos_db->execStatement(PDO::FETCH_ASSOC) as $row){
            $row['service_location']    = ($row['service_location']   == '1' ? 'on' : 'off');
            $row['billing_location']    = ($row['billing_location']   == '1' ? 'on' : 'off');
            $row['accepts_assignment']  = ($row['accepts_assignment'] == '1' ? 'on' : 'off');
            if (strlen($row['pos_code']) <= 1){
                $row['pos_code'] = '0'.$row['pos_code'];
            } else {
                $row['pos_code'] = $row['pos_code'];
            }
            array_push($rows, $row);
        }
        //---------------------------------------------------------------------------------------
        // here we are adding "totals" and the root "row" for sencha use
        //---------------------------------------------------------------------------------------
        print_r(json_encode(array('totals'=>$total,'row'=>$rows)));
        exit;
    case 'POST':
        unset($data['id']);
        $data['service_location'] 	= ($data['service_location']    == 'on' ? 1 : 0);
        $data['accepts_assignment'] = ($data['accepts_assignment']  == 'on' ? 1 : 0);
        $data['billing_location'] 	= ($data['billing_location']    == 'on' ? 1 : 0);

        $sql = $mitos_db->sqlBind($data, "facility", "I");
        $mitos_db->setSQL($sql);
        $ret = $mitos_db->execLog();
        if ( $ret[2] ){
            echo '{ "success": false, "errors": { "reason": "'. $ret[2] .'" }}';
        } else {
            echo '{ "success": true }';
        }
        exit;
    case 'PUT':
        $id = $data['id'];
        unset($data['id']);
        $data['service_location'] 	= ($data['service_location']    == 'on' ? 1 : 0);
        $data['accepts_assignment'] = ($data['accepts_assignment']  == 'on' ? 1 : 0);
        $data['billing_location'] 	= ($data['billing_location']    == 'on' ? 1 : 0);


        // *************************************************************************************
        // Finally that validated POST variables is inserted to the database
        // This one make the JOB of two, if it has an ID key run the UPDATE statement
        // if not run the INSERT stament
        // *************************************************************************************
        $sql = $mitos_db->sqlBind($data, "facility", "U", "id='$id'");
        $mitos_db->setSQL($sql);
        $ret = $mitos_db->execLog();

        if ( $ret[2] ){
            echo '{ "success": false, "errors": { "reason": "'. $ret[2] .'" }}';
        } else {
            echo '{ "success": true }';
        }
        exit;
    case 'DELETE':
        $id = $data['id'];
        $sql = "DELETE FROM facility WHERE id='$id'";

        $mitos_db->setSQL($sql);
        $ret = $mitos_db->execLog();

        if ( $ret[2] ){
            echo '{ "success": false, "errors": { "reason": "'. $ret[2] .'" }}';
        } else {
            echo '{ "success": true }';
        }
    exit;
}