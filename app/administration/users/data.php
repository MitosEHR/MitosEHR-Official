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
include_once($_SESSION['site']['root']."/classes/AES.class.php");
include_once($_SESSION['site']['root']."/repo/global_functions/global_functions.php");

$aes        = new AES($_SESSION['site']['AESkey']);
$mitos_db   = new dbHelper();

$rawData    = file_get_contents("php://input");
$foo        = json_decode($rawData, true);
$data       = $foo['row'];

$start      = (!$_REQUEST["start"])? 0 : $_REQUEST["start"];
$limit      = (!$_REQUEST["limit"])? 30 : $_REQUEST["limit"];

switch($_SERVER['REQUEST_METHOD']){
    case 'GET':
        $mitos_db->setSQL("SELECT *
				             FROM users
				            WHERE users.authorized = 1 OR users.username != ''
        		         ORDER BY username
        		            LIMIT $start,$limit");
        $total = $mitos_db->rowCount();

        $rows = array();
        foreach($mitos_db->execStatement(PDO::FETCH_ASSOC) as $row){
            $row['password']    = $aes->decrypt($row['password']);
            $row['pwd_history1']= $aes->decrypt($row['pwd_history1']);
            $row['pwd_history2']= $aes->decrypt($row['pwd_history2']);
            $row['fullname']    = fullname($row['fname'],$row['mname'],$row['lname']);
            array_push($rows, $row);
        }
        print_r(json_encode(array('totals'=>$total,'row'=>$rows)));
        exit;
    case 'POST':
        unset($data['id']);
        unset($data['fullname']);
        $data['password']   = $aes->encrypt($data['password']);
        $data['authorized'] = ($data['authorized'] == 'on' ? 1 : 0);
        $data['active']   	= ($data['active']     == 'on' ? 1 : 0);
        if($data['taxonomy'] == ""){ unset($data['taxonomy']); }

        $sql = $mitos_db->sqlBind($data, "users", "I");
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
        unset($data['fullname']);
        $data['password']   = $aes->encrypt($data['password']);
        $data['authorized'] = ($data['authorized'] == 'on' ? 1 : 0);
        $data['active']   	= ($data['active']     == 'on' ? 1 : 0);

        $sql = $mitos_db->sqlBind($data, "users", "U", "id='$id'");
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
        $mitos_db->setSQL( "DELETE FROM users WHERE id='$id '");
        $ret = $mitos_db->execLog();

        if ($ret[2]){
            echo '{ success: false, errors: { reason: "'. $ret[2] .'" }}';
        } else {
            echo "{ success: true }";
        }
        exit;
}