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
include_once($_SESSION['site']['root']."/classes/dbHelper.class.php");
include_once($_SESSION['site']['root']."/repo/global_functions/global_functions.php");
$_SESSION['site']['flops'] = 0;
$mitos_db = new dbHelper();

switch($_REQUEST['task']){
    case 'calendars':
        $sql = ("SELECT * FROM users WHERE calendar = '1' AND authorized = '1' AND active = '1' ORDER BY username");
        $mitos_db->setSQL($sql);
        $total = $mitos_db->rowCount();
        $rows = array();
        foreach($mitos_db->execStatement(PDO::FETCH_ASSOC) as $row){
            $color = $total + $row['id'] + 15;
            $cla_user['id'] = $row['id'];
            $cla_user['title'] =  $row['title'].' '. $row['lname'];
            $cla_user['color'] = $color;
            array_push($rows, $cla_user);
        }
        print_r(json_encode(array('calendars'=>$rows)));
    break;
    case 'events':

        $startDate  = $_REQUEST['startDate'];
        $endDate    = $_REQUEST['endDate'];

        $sql = ("SELECT * FROM calendar_events WHERE start BETWEEN '".$startDate."' AND '".$endDate."' ");
        $mitos_db->setSQL($sql);
        $total = $mitos_db->rowCount();
        $rows = array();
        foreach($mitos_db->execStatement(PDO::FETCH_ASSOC) as $row){
            array_push($rows, $row);
        }
        print_r(json_encode(array('success'=>true, 'message'=>'Loaded data', 'data'=>$rows)));
    break;
}



?>