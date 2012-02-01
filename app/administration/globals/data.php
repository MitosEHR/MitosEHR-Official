<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File: data.php
 * Date: 10/29/11
 * Time: 8:45 PM
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
switch($_SERVER['REQUEST_METHOD']){
    case 'GET':
        $mitos_db->setSQL("SELECT gl_name, gl_index, gl_value FROM globals");
        // ****************************************************************************************************
        // $rows = $mitos_db->execStatement(PDO::FETCH_ASSOC) because we wwant to print all recods into one row
        // ****************************************************************************************************
        $rows = array();
        foreach($mitos_db->execStatement() as $row){
            $rows['data_id'] = '1';
            $rows[$row[0]] = $row[2];
        }
        print_r(json_encode(array('totals'=>'1','row'=>$rows)));
    exit;
    case 'PUT':
        foreach($data as $key => $value ){
            //--------------------------------------------------------------------------
            // lets skip data_id, it doesn't exist in the database
            // this id is for ExtJs use only
            //--------------------------------------------------------------------------
            if($key != 'data_id'){
                //---------------------------------------------------------------------
                // check value is an int and trim it, else dateDecode it
                //---------------------------------------------------------------------
                if(is_int($value)){
                    $rec = trim($value);
                } else {
                    $rec = $value;
                }
                //---------------------------------------------------------------------
                // now lets update new values for each key
                //---------------------------------------------------------------------
                $mitos_db->setSQL("UPDATE globals
                    SET   gl_value ='". $rec ."'"."
                    WHERE gl_name  ='". $key ."'");
                $mitos_db->execLog();
            }
        }
        include_once($_SESSION['site']['root']."/repo/global_settings/global_settings.php");
        echo "{ success: true }";
    exit;
}
