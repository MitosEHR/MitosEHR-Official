<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File: data.php
 * Date: 10/30/11
 * Time: 10:53 AM
 */
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');
$_SESSION['site']['flops'] = 0;
include_once($_SESSION['site']['root']."/classes/dbHelper.php");

$mitos_db   = new dbHelper();

$rawData    = file_get_contents("php://input");
$foo        = json_decode($rawData, true);
$data       = $foo['row'];

$start      = (!$_REQUEST["start"])? 0 : $_REQUEST["start"];
$limit      = (!$_REQUEST["limit"])? 10 : $_REQUEST["limit"];
$rows       = array();
switch($_SERVER['REQUEST_METHOD']){

    case 'DELETE':
        $delete_id = $data['id'];
        switch ($_GET['task']) {
            case "pharmacy":
                $sql = "DELETE FROM pharmacies WHERE id='$delete_id' ";
                break;
            case "insurance":
                $sql = "DELETE FROM insurance_companies WHERE id='$delete_id'";
                break;
            case "insuranceNumbers":

                break;
            case "x12Partners":

                break;
        }
        $mitos_db->setSQL($sql);
        $ret = $mitos_db->execLog();
        if ( $ret[2] ){
            echo '{ success: false, errors: { reason: "'. $ret[2] .'" }}';
        } else {
            echo "{ success: true }";
        }
        // *************************************************************************************
        // delete related address and phone/fax numbers
        // *************************************************************************************
        $mitos_db->setSQL("DELETE FROM addresses WHERE foreign_id='" . $delete_id . "'");
        $mitos_db->execOnly();
        $mitos_db->setSQL("DELETE FROM phone_numbers WHERE foreign_id='" . $delete_id . "'");
        $mitos_db->execOnly();
    exit;
}
 
