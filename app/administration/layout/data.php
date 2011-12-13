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
include_once($_SESSION['site']['root']."/classes/formLayoutBuilder.class.php");
$mitos_db           = new dbHelper();
$formLayoutBuilder  = new formLayoutBuilder();

$rawData    = file_get_contents("php://input");
$foo        = json_decode($rawData, true);
$data       = $foo['row'];

/**
 * This File handles the sencha request diferent. It use a normal POST do to the
 * the wat the TreeStpre is setup. The TreeStore is use to pull the fields ans their
 * proerties aut of the database, but can not save the data. For that reason we
 * are using a normal POST request from direcly from the FormPanel url.
 *
 * This is a map of how the request are handle
 *
 * if($_REQUEST['task'] == 'treeRequest'){
 *      ( SELECT ) <<------------------------------------// Send TreeStore json Back
 * }elseif($_REQUEST['task'] == 'optionsRequest'){
 *      ( SELECT ) <<------------------------------------// Send Options json Back
 * }elseif($_REQUEST['task'] == 'formRequest'){
 *     if($_REQUEST['id'] == null){
 *          ( INSERT ) <<--------------------------------// Insert New Item
 *      }else{
 *          ( UPDATE ) <<--------------------------------// Update Item
 *      }
 * }elseif($_REQUEST['task'] == 'deleteRequest'){
 *      ( DELETE ) <<------------------------------------// Delete Item
 * }elseif($_REQUEST['task'] == 'sortRequest'){
 *      ( UPDATE ) <<------------------------------------// Update the item pos and item_of
 * }
 *
 */

if($_SERVER['REQUEST_METHOD'] == 'DELETE'){
    // THIS IS TO HANDLE A BUG WITH THE STORE.LOAD() FUNCTION
}elseif($_REQUEST['task'] == 'treeRequest'){


    $formPanel = $_REQUEST["currForm"];
    $fields = array();

    /**
     * @param $formPanel
     * @return array
     */
    function getFileds($formPanel){
        global $fields;
        global $mitos_db;
        $mitos_db->setSQL("Select * FROM forms_fields WHERE form_id = '$formPanel' AND (item_of IS NULL OR item_of = '0') ORDER BY pos ASC");
        $results = $mitos_db->execStatement(PDO::FETCH_ASSOC);
        foreach($results as $item){
            $opts = getItmesOptions($item['id']);
            foreach($opts as $opt => $val){
                $item[$opt] = $val;
            }
            $item['children'] = getChildItems($item['id']);
            if($item['children'] == null) {
                unset($item['children']);
                if($item['xtype'] != 'fieldset' && $item['xtype'] != 'fieldcontainer') $item['leaf'] = true;
            }else{
                $item['expanded'] = true;
            }
            array_push($fields,$item);
        }
        return $fields;
    }

    /**
     * @param $parent
     * @return arrays
     */
    function getChildItems($parent){
        global $mitos_db;
        $items = array();
        $mitos_db->setSQL("Select * FROM forms_fields WHERE item_of = '$parent' ORDER BY pos ASC");
        foreach($mitos_db->execStatement(PDO::FETCH_ASSOC) as $item){
            $opts = getItmesOptions($item['id']);
            foreach($opts as $opt => $val){
                $item[$opt] = $val;
            }
            $item['children'] = getChildItems($item['id']);
            if($item['children'] == null) {
                unset($item['children']);
                if($item['xtype'] != 'fieldset' && $item['xtype'] != 'fieldcontainer') $item['leaf'] = true;
            }else{
                $item['expanded'] = true;
            }
            array_push($items,$item);
        }
        return $items;
    }

    /**
     * @param $item_id
     * @return array
     */
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

    $tree = getFileds($formPanel);
    print json_encode(array('text'=>'.','children'=>$tree));


}elseif($_REQUEST['task'] == 'optionsRequest'){


    $currList = $_REQUEST["list_id"];
    $mitos_db->setSQL("SELECT * FROM list_options WHERE list_id = '$currList' ORDER BY seq");
    $total = $mitos_db->rowCount();
    $rows = array();
    foreach($mitos_db->execStatement(PDO::FETCH_ASSOC) as $row){
        array_push($rows, $row);
    }
    print_r(json_encode(array('totals'=>$total,'row'=>$rows)));



}elseif($_REQUEST['task'] == 'formRequest'){
    /**
     * This will handle the New item Request where fiels id is not set
     * to handle the update please go to the "else" statement after
     */
    if($_REQUEST['id'] == null){
        /**
         * This will handle the new field
         */
        $formLayoutBuilder->addField($_POST);

    }else{
        /**
         * This will handle the update field
         */
        $formLayoutBuilder->updateField($_POST);

    }
}elseif($_REQUEST['task'] == 'deleteRequest'){
    /**
     * This will handle the Delete Request
     */
    $formLayoutBuilder->deleteField($_REQUEST);

}elseif($_REQUEST['task'] == 'sortRequest'){
    /**
     * This will handle the Sort Request
     */
    $formLayoutBuilder->sortFields(json_decode($_REQUEST['item'], true));

}