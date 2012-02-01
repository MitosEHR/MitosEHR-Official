<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File: data.php
 * Date: 1/10/12
 * Time: 6:02 PM
 */
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');
$_SESSION['site']['flops'] = 0;

include_once($_SESSION['site']['root']."/classes/dbHelper.php");

$mitos_db   = new dbHelper();

$rawData    = file_get_contents("php://input");
$data        = json_decode($rawData, true);

$start      = (!$_REQUEST["start"])? 0 : $_REQUEST["start"];
$limit      = (!$_REQUEST["limit"])? 30 : $_REQUEST["limit"];

switch($_SERVER['REQUEST_METHOD']){
    case 'GET':

        $data_table = $_REQUEST['data_table'];
        $pid        = $_REQUEST['pid'];

        $mitos_db->setSQL("SELECT *
				             FROM $data_table
				            WHERE pid = '$pid'");
        $total = $mitos_db->rowCount();

        $rows = array();
        foreach($mitos_db->execStatement(PDO::FETCH_ASSOC) as $row){
            array_push($rows, $row);
        }
        print_r(json_encode(array('totals'=>$total,'row'=>$rows)));

        exit;
    case 'POST':

        exit;
    case 'PUT':

        exit;
    case 'DELETE':

        exit;
}
