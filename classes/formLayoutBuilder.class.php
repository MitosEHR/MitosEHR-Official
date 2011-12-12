<?php
/* 
 * layoutEngine.class.php
 * 
 * @DESCRIPTION@: This class object will create dynamic ExtJS v4 form, previously created or edited
 * from the Layout Form Editor. Gathering all it's data and parameters from the layout_options table. 
 * Most of the structural database table was originally created by OpenEMR developers.
 * 
 * What this class will not do: This class will not create the entire Screen Panel for you, this
 * will only create the form object with the fields names & dataStores configured on the layout_options table.
 * 
 * version: 0.1.0
 * author: GI Technologies, 2011
 * modified: Ernesto J Rodriguez
 * 
 */
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');
/** @noinspection PhpIncludeInspection */
include_once($_SESSION['site']['root']."/classes/dbHelper.class.php");

class formLayoutBuilder extends dbHelper {


    public function addField($data){
        /**
         * Verified if the column exist in the databse...
         */
        $exist = null;
        $this->setSQL("SELECT form_data FROM forms_layout WHERE id = '".$data['form_id']."'");
        $form_data_table = $this->fetch();
        $form_data_table = $form_data_table['form_data'];
        $col = $data['name'];
        $this->setSQL("SELECT * FROM information_schema.COLUMNS WHERE TABLE_NAME = '$form_data_table' AND COLUMN_NAME = '$col'");
        $ret = $this->execStatement(PDO::FETCH_ASSOC);
        if(isset($ret[0]['COLUMN_NAME'])) $exist = true;
        /**
         * if exist if grater thatn 0 send an error
         */
        if($exist == true) {
            echo '{ "success": false, "errors": { "reason": "Field \"'.$col.'\" exist, please verify the form or change the Field \"name\" preoperty" }}';
        }else{
            /**
             * since now we know the column doesn't exist, lets create one for the new field
             */
            $this->setSQL("ALTER TABLE $form_data_table ADD $col VARCHAR(255)");
            $ret = $this->alterTable();
            $this->checkError($ret);
            /**
             * now lets start creating the field in the database
             */
            $field = array();
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
            $sql = $this->sqlBind($field, "forms_fields", "I");
            $this->setSQL($sql);
            $ret = $this->execLog();
            $this->checkError($ret);
            $field_id = $this->lastInsertId;
            /**
             * take each option and insert it in the orms_field_options
             * table using $field_id
             */
            foreach($data as $key => $val){
                $opt['field_id'] = $field_id;
                $opt['oname']    = $key;
                $opt['ovalue']   = $val;
                $sql = $this->sqlBind($opt, "forms_field_options", "I");
                $this->setSQL($sql);
                $ret = $this->execOnly();
                $this->checkError($ret);
            }

            print '{"success":true}';
        }
    }



    public function updateField($data){

        foreach($data as $option => $val){
            if($val == '') unset($data[$option]);
            if($val == 'on'){
                $data[$option] = 'true';
            }elseif($val == 'off'){
                $data[$option] = 'false';
            }
        }
        /**
         * get the form_fields values and unset them from $data array
         */
        $field              = array();
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
        $sql = $this->sqlBind($field, "forms_fields", "U", "id='$id'");
        $this->setSQL($sql);
        $ret = $this->execLog();
        $this->checkError($ret);
        /**
         * delete old field options
         */
        $this->setSQL("DELETE FROM forms_field_options WHERE field_id='$id'");
        $ret = $this->execOnly();
        $this->checkError($ret);
        /**
         * take each option and insert it in the orms_field_options
         * table using $field_id
         */
        foreach($data as $key => $val){
            $opt['field_id'] = $id;
            $opt['oname']    = $key;
            $opt['ovalue']   = $val;
            $sql = $this->sqlBind($opt, "forms_field_options", "I");
            $this->setSQL($sql);
            $this->execOnly();
            $this->checkError($ret);
        }

        print '{"success": true }';

    }


    /**
     * This function will delete the field and print success is no
     * error were found along the way.
     *
     * @param $data
     */
    public function deleteField($data){
        // delete the column form data base
        // TODO verify for data first
        $form_id = $data['form_id'];
        $this->setSQL("SELECT form_data FROM forms_layout WHERE id = '$form_id'");
        $form_data_table = $this->fetch();
        $form_data_table = $form_data_table['form_data'];
        $col = $data['col'];
        /**
         * sql to drop the table
         */
        $this->setSQL("ALTER TABLE $form_data_table DROP $col");
        $ret = $this->execOnly();
        $this->checkError($ret);
        /**
         * remove field and field options
         */
        $id = $data['id'];
        $this->setSQL("DELETE FROM forms_fields WHERE id='$id'");
        $ret = $this->execOnly();
        $this->checkError($ret);
        $this->setSQL("DELETE FROM forms_field_options WHERE field_id='$id'");
        $ret = $this->execOnly();
        $this->checkError($ret);

        print '{"success":true}';
    }


    /**
     * This function sorts the fields when the drag and drop is use and
     * print success if no error found along the way.
     *
     * @param $data
     */
    public function sortFields($data){
        $pos        = 10;
        $field      = array();
        $item       = $data['id'];
        $parentItem = $data['parentNode'];
        $childItems = $data['parentNodeChilds'];
        /**
         * set the field item_of to the paretn id and run the sql to
         * update the item item_of column
         */
        $field['item_of'] = $parentItem;
        $sql = $this->sqlBind($field, "forms_fields", "U", "id='$item'");
        $this->setSQL($sql);
        $ret = $this->execOnly();
        $this->checkError($ret);
        /**
         * here we set the pos column value, starting from 10.
         * after updating the item pos, we add 10 to $pos and
         * loop for each child item
         */
        foreach($childItems as $child){
            $field['pos'] = $pos;
            $sql = $this->sqlBind($field, "forms_fields", "U", "id='$child'");
            $this->setSQL($sql);
            $ret = $this->execOnly();
            $this->checkError($ret);
            $pos = $pos + 10;
        }

        print '{"success":true}';
    }


    /**
     * @param $err
     * @return mixed
     */
    private function checkError($err){
        if($err[2]){
            echo '{success:false,errors:{reason:"'.$err[2].'"}}';
            exit;
        }else{
            return;
        }
    }
}
