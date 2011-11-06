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
                $mitos_db->setSQL("Select * FROM forms_fields WHERE form_id = '$fid'");
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
        exit; // END GET
    case 'POST':

        exit; // END POST
    case 'PUT':

        exit; // END OUT
    case 'DELETE':

        exit; // END DELETE
}
 
