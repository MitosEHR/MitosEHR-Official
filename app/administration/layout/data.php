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
include_once($_SESSION['site']['root']."/classes/dbHelper.class.php");

$mitos_db   = new dbHelper();

$rawData    = file_get_contents("php://input");
$foo        = json_decode($rawData, true);
$data       = $foo['row'];

switch($_SERVER['REQUEST_METHOD']){
    case 'GET':

        if($_REQUEST['task'] == 'options'){
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
            
        }else{
            
            $formPanel = $_REQUEST["currForm"];
            $fields = array();
            function getChildItems($parent){
                global $mitos_db;
                $items = array();
                $mitos_db->setSQL("Select * FROM forms_fields WHERE item_of = '$parent'");
                foreach($mitos_db->execStatement(PDO::FETCH_ASSOC) as $item){
                    // *****************************************************************************************************
                    // Get option for Item
                    // *****************************************************************************************************
                    $opts = getItmesOptions($item['id']);
                    foreach($opts as $opt => $val){
                        $item[$opt] = $val;
                    }
                    // *****************************************************************************************************
                    // Lets run this function again. This is what makes this function reclusive
                    // *****************************************************************************************************
                    $item['children'] = getChildItems($item['id']);
                    if($item['children'] == null) {
                        unset($item['children']);
                        $item['leaf'] = true;
                    }
                    array_push($items,$item);
                }
                return $items;
            }
            // *************************************************************************************************************
            // Function to get items options/params
            // *************************************************************************************************************
            function getItmesOptions($item_id){
                $foo = array();
                global  $mitos_db;

                $mitos_db->setSQL("Select * FROM forms_field_options WHERE field_id = '$item_id'");
                foreach($mitos_db->execStatement(PDO::FETCH_ASSOC) as $option){

                    if(is_numeric($option['ovalue'])){      // if the string is numeric intval() the value to remove the comas
                        $option['ovalue'] = intval($option['ovalue']);
                    }elseif($option['ovalue'] == 'true'){   // if the sring is true let change the value to a bool
                        $option['ovalue'] = true;
                    }elseif($option['ovalue'] == 'false'){  // if the sring is false let change the value to a bool
                        $option['ovalue'] = false;
                    }

                    $foo[$option['oname']] = $option['ovalue'];
                }
                return $foo;
            }
            function getFileds($formPanel){
                global $fields;
                global $mitos_db;

                $mitos_db->setSQL("Select * FROM forms_layout WHERE name = '$formPanel'");
                $foo    = $mitos_db->fetch(PDO::FETCH_ASSOC);
                $fid    = $foo['id'];
                // *********************************************************************************************************
                // Get Parent Items
                // *********************************************************************************************************

                $mitos_db->setSQL("Select * FROM forms_fields WHERE form_id = '$fid' AND (item_of IS NULL OR item_of = '')");
                $results = $mitos_db->execStatement(PDO::FETCH_ASSOC);
                foreach($results as $item){
                    // *****************************************************************************************************
                    // Get Option for main parent item
                    // *****************************************************************************************************
                    $opts = getItmesOptions($item['id']);
                    foreach($opts as $opt => $val){
                        $item[$opt] = $val;
                    }
                    // *****************************************************************************************************
                    // Get Child Items
                    // *****************************************************************************************************
                    $item['children'] = getChildItems($item['id']);
                    if($item['children'] == null) {
                        unset($item['children']);
                        $item['leaf'] = true;
                    }
                    array_push($fields,$item);
                }
                return $fields;
            }
            $tree = getFileds($formPanel);
            print json_encode(array('text'=>'.','children'=>$tree));
        }
        exit; // END GET
    case 'POST':

        exit; // END POST
    case 'PUT':

        exit; // END OUT
    case 'DELETE':

        exit; // END DELETE
}
 
