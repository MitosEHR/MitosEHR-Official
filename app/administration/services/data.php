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
        if(isset($_REQUEST['code']) || isset($_REQUEST['search'])){
            if(isset($_REQUEST['code'])){
                $_SESSION['filter']['service']['code']   = $_REQUEST['code'];
            }
            if(isset($_REQUEST['search'])){
                if($_REQUEST['search'] == ''){
                    unset($_SESSION['filter']['service']['search']);
                }else{
                    $_SESSION['filter']['service']['search'] = $_REQUEST['search'];
                }

            }
        }
        if(isset($_SESSION['filter']['service']['code']) || isset($_SESSION['filter']['service']['search'])){
            $WHERE = ' WHERE ';
        } else {
            $WHERE = '';
        }
        if(isset($_SESSION['filter']['service']['code']) && isset($_SESSION['filter']['service']['search'])){
            $AND = ' AND ';
        } else {
            $AND = '';
        }
        if (isset($_SESSION['filter']['service']['code'])) {
          $code = "code_type = '".$_SESSION['filter']['service']['code']."'";
        }
        if (isset($_SESSION['filter']['service']['search'])) {
          $q = $_SESSION['filter']['service']['search'];
          $search = "code LIKE '$q%' OR code_text LIKE '%$q%'";
        }
            
        $mitos_db->setSQL("SELECT id FROM codes $WHERE $code $AND $search");
        $total = $mitos_db->rowCount();
        $mitos_db->setSQL("SELECT * FROM codes $WHERE $code $AND $search ORDER BY code_type, code, code_text LIMIT $start,$limit");
        $rows = array();
        foreach($mitos_db->execStatement(PDO::FETCH_ASSOC) as $row){
            array_push($rows, $row);
        }
        //------------------------------------------------------------------------------
        // here we are adding "totals" and the root "row" for sencha use
        //------------------------------------------------------------------------------
        print_r(json_encode(array('totals'=>$total,'row'=>$rows)));
        exit;
    case 'POST':
        unset($data['id']);
        $data['active']     = ($data['active']      == 'on' ? 1 : 0);
        $data['reportable'] = ($data['reportable']  == 'on' ? 1 : 0);
        $sql = $mitos_db->sqlBind($data, "codes", "I");
        $mitos_db->setSQL($sql);
        $ret = $mitos_db->execLog();
        if ($ret[2]){
            echo '{ success: false, errors: { reason: "'. $ret[2] .'" }}';
        } else {
            echo "{ success: true }";
        }
        exit;
    case 'PUT':
        $id = $data['id'];
        unset($data['id']);
        $data['active']     = ($data['active']      == 'on' ? 1 : 0);
        $data['reportable'] = ($data['reportable']  == 'on' ? 1 : 0);
        $sql = $mitos_db->sqlBind($data, "codes", "U", "id='$id'");
        $mitos_db->setSQL($sql);
        $ret = $mitos_db->execLog();
        if ($ret[2]){
            echo '{ success: false, errors: { reason: "'. $ret[2] .'" }}';
        } else {
            echo "{ success: true }";
        }
        exit;
    case 'DELETE':
        $id = $data['id'];


        exit;
}