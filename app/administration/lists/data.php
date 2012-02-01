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
    case 'GET':
        $currList = $_REQUEST["list_id"];

        if ($_SESSION['lang']['code'] == "en_US") { // If the selected language is English, do not translate
            $mitos_db->setSQL("SELECT * FROM list_options WHERE list_id = '$currList' ORDER BY seq");
        } else {
            // Use and sort by the translated list name.
            $mitos_db->setSQL("SELECT lo.id, lo.list_id, lo.option_id, IF(LENGTH(ld.definition),ld.definition,lo.title) AS title ,
                                      lo.seq, lo.is_default, lo.option_value, lo.mapping, lo.notes
                                 FROM list_options AS lo
                            LEFT JOIN lang_constants AS lc ON lc.constant_name = lo.title
                            LEFT JOIN lang_definitions AS ld ON ld.cons_id = lc.cons_id AND ld.lang_id = '$lang_id'
                                WHERE lo.list_id = '$currList'
                             ORDER BY IF(LENGTH(ld.definition),ld.definition,lo.title), lo.seq");
        }
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
 
