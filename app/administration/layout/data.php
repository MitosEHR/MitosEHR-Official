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
     * @param $parent
     * @return arrays
     */
    function getChildItems($parent){
        global $mitos_db;
        $items = array();
        $mitos_db->setSQL("Select * FROM forms_fields WHERE item_of = '$parent' ORDER BY pos ASC");
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
    /**
     * @param $formPanel
     * @return array
     */
    function getFileds($formPanel){
        global $fields;
        global $mitos_db;
        // *********************************************************************************************************
        // Get Parent Items
        // *********************************************************************************************************
        $mitos_db->setSQL("Select * FROM forms_fields WHERE form_id = '$formPanel' AND (item_of IS NULL OR item_of = '0') ORDER BY pos ASC");
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
                if($item['xtype'] != 'fieldset' && $item['xtype'] != 'fieldcontainer') $item['leaf'] = true;
            }else{
                $item['expanded'] = true;
            }
            array_push($fields,$item);
        }
        return $fields;
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
    if($_REQUEST['id'] == null){
        /**
         * This will handle the New item Request where fiels id is not set
         * to handle the update please go to the "else" statement after
         * this arond line 213
         */
        $field = array();
        $data = $_POST;

        foreach($data as $option => $val){
            /**
             * unset all the empty vars
             */
            if($val == '') {
                unset($data[$option]);
            }
            /**
             * change the checkbox values form on/off => true/false (string)
             */
            if($val == 'on'){
                $data[$option] = 'true';
            }elseif($val == 'off'){
                $data[$option] = 'false';
            }
        }
        /**
         * get the form_fields values and unset them from $data array
         */
        $field['form_id']   = $data['form_id'];
        $field['xtype']     = $data['xtype'];
        if(isset($data['item_of'])){
            $field['item_of'] = $data['item_of'];
            unset($data['item_of']);
        }
        if($data['xtype'] != 'fieldcontainer' && $data['xtype'] != 'fieldset' ){
            if(!isset($data['margin'])) $data['margin'] = '0 5 0 0';
        }
        unset($data['form_id'],$data['xtype']);
        /**
         * Exec the new field sql statement and store the its ID
         * in $field_id to then store its options
         */
        $sql = $mitos_db->sqlBind($field, "forms_fields", "I");
        $mitos_db->setSQL($sql);
        $ret = $mitos_db->execLog();
        $field_id = $mitos_db->lastInsertId;
        /**
         * take each option and insert it in the orms_field_options
         * table using $field_id
         */
        foreach($data as $key => $val){
            $opt['field_id'] = $field_id;
            $opt['oname']    = $key;
            $opt['ovalue']   = $val;
            $sql = $mitos_db->sqlBind($opt, "forms_field_options", "I");
            $mitos_db->setSQL($sql);
            $mitos_db->execOnly();
        }
        /**
         * catch eny error
         */
        if ( $ret[2] ){
            echo '{ "success": false, "errors": { "reason": "'. $ret[2] .'" }}';
        } else {
            echo '{ "success": true }';
        }

    }else{
        /**
         * This will handle the UPDATE item Request where fiels id is set
         */
        $field = array();
        $data = $_POST;

        foreach($data as $option => $val){
            /**
             * unset all the empty vars
             */
            if($val == '') {
                unset($data[$option]);
            }
            /**
             * change the checkbox values form on/off => true/false (string)
             */
            if($val == 'on'){
                $data[$option] = 'true';
            }elseif($val == 'off'){
                $data[$option] = 'false';
            }
        }
        /**
         * get the form_fields values and unset them from $data array
         */
        $id                 = $data['id'];
        $field['form_id']   = $data['form_id'];
        $field['xtype']     = $data['xtype'];
        if(isset($data['item_of'])){
            $field['item_of'] = $data['item_of'];
            unset($data['item_of']);
        }
        if($field['xtype'] != 'fieldcontainer' && $field['xtype'] != 'fieldset' ){
            if(!isset($data['margin'])) $data['margin'] = '0 5 0 0';
        }
        unset($data['form_id'],$data['xtype'],$data['id']);
        /**
         * Exec the new field sql statement and store the its ID
         * in $field_id to then store its options
         */
        $sql = $mitos_db->sqlBind($field, "forms_fields", "U", "id='$id'");
        $mitos_db->setSQL($sql);
        $ret = $mitos_db->execLog();



        $mitos_db->setSQL("DELETE FROM forms_field_options WHERE field_id='$id'");
        $ret = $mitos_db->execOnly();
        /**
         * take each option and insert it in the orms_field_options
         * table using $field_id
         */
        foreach($data as $key => $val){
            $opt['field_id'] = $id;
            $opt['oname']    = $key;
            $opt['ovalue']   = $val;
            $sql = $mitos_db->sqlBind($opt, "forms_field_options", "I");
            $mitos_db->setSQL($sql);
            $mitos_db->execOnly();
        }
        /**
         * catch eny error
         */
        if ( $ret[2] ){
            echo '{ "success": false, "errors": { "reason": "'. $ret[2] .'" }}';
        } else {
            echo '{ "success": true }';
        }
    }
}elseif($_REQUEST['task'] == 'deleteRequest'){
    $id = $_REQUEST['id'];
    /**
     * working!
     */
    $mitos_db->setSQL("DELETE FROM forms_fields WHERE id='$id'");
    $ret = $mitos_db->execOnly();
    $mitos_db->setSQL("DELETE FROM forms_field_options WHERE field_id='$id'");
    $ret = $mitos_db->execOnly();
    print '{"success":true}';
}elseif($_REQUEST['task'] == 'sortRequest'){

    $data = json_decode($_REQUEST['item'], true);
    $field =array();

    $item       = $data['id'];
    $parentItem = $data['parentNode'];
    $childItems = $data['parentNodeChilds'];

    $field['item_of'] = $parentItem;
    $sql = $mitos_db->sqlBind($field, "forms_fields", "U", "id='$item'");
    $mitos_db->setSQL($sql);
    $mitos_db->execOnly();

    $pos = 10;
    foreach($childItems as $child){
        $field['pos'] = $pos;
        $sql = $mitos_db->sqlBind($field, "forms_fields", "U", "id='$child'");
        $mitos_db->setSQL($sql);
        $mitos_db->execOnly();
        $pos = $pos + 10;
    }

}