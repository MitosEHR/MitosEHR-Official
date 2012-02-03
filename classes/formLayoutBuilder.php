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
if(!isset($_SESSION)){
    session_name ("MitosEHR" );
    session_start();
    session_cache_limiter('private');
}
include_once($_SESSION['site']['root']."/classes/dbHelper.php");
class formLayoutBuilder extends dbHelper {

    private $form_data_table;
    private $col;

    public function addField($data){
        $this->getFormDataTable($data['form_id']);
        $this->col  = $data['name'];
        $container  = false;
        /**
         * lets defines what is a container for later use.
         */
        if( $data['xtype'] == 'fieldcontainer' || $data['xtype'] == 'fieldset' ) $container = true;
        /**
         * if getFieldDataCol returns true, means there is a colunm in the
         * current database form table. in that case we need to return that
         * error leting the user know there is a duplicated field or duplicated
         * name property. The user has 2 options, verify the form to make sure
         * the the field is not getting duplicated or change the name property
         * to save the field data inside another column.
         */
        if($this->fieldHasColumn() && $data['xtype'] != 'radiofield') {
            echo '{ "success": false, "errors": { "reason": "Field \"'.$this->col.'\" exist, please verify the form or change the Field \"name\" preoperty" }}';
        }else{
            /**
             * since now we know the column doesn't exist, lets create one for the new field
             */
            if(!$container){

                if(!$this->fieldHasColumn()){
                    $this->addColumn('VARCHAR(255)');
                }
            }
            /**
             * sinatizedData check the data array and if
             * the value is empty delete it form the array
             * then checck the value and if is equal to "on"
             * set it to true, and "off" set it to false
             */
            $data = $this->sinatizedData($data);
            /**
             * if not xtype fieldcontainer and fieldset the add some
             * defaul values.
             */
            $data = $this->setDefults($data);
            /**
             * now lets start creating the field in the database
             */
            $field              = array();
            $field['form_id']   = $data['form_id'];
            $field['xtype']     = $data['xtype'];

            if(isset($data['item_of'])){
                $field['item_of'] = $data['item_of'];
                unset($data['item_of']);
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
             * take each option and insert it in the forms_field_options
             * table using $field_id
             */
            $this->insertOptions($data, $field_id);

            print '{"success":true}';
        }
    }

    /**
     * This function will update the fields and print
     * the success callback if no errors found alog the way
     *
     * @param $data
     */
    public function updateField($data){
        /**
         * sinatizedData check the data array and if
         * the value is empty delete it form the array
         * then checck the value and if is equal to "on"
         * set it to true, and "off" set it to false
         */
        $data = $this->sinatizedData($data);
        /**
         * if not xtype fieldcontainer and fieldset the add some
         * defaul values.
         */
        $data = $this->setDefults($data);
        /**
         * Here we start the $field array and add a few
         * things from the $data array.
         *
         * The $field arrray is use to update the forms_fields
         * table. with the new xtype, form_id, item_of.
         *
         * The $data array is use later to update the forms_field_options
         * table.
         */
        $field              = array();
        $id                 = $data['id'];
        $field['form_id']   = $data['form_id'];
        $field['xtype']     = $data['xtype'];
        /**
         * if item_of is not empty add it the the $field array
         * and remove it from the $data array
         */
        if(isset($data['item_of'])){
            $field['item_of'] = $data['item_of'];
            unset($data['item_of']);
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
         * take the remaining $data array and insert it in the
         * forms_field_options table one by one.
         */
        $this->insertOptions($data, $id);

        print '{"success": true }';
    }

    /**
     * This function will delete the field and print success is no
     * error were found along the way.
     *
     * @param $data
     */
    public function deleteField($data){

        $this->getFormDataTable($data['form_id']);
        $this->col = $data['name'];
        $container = false;
        /**
         * lets defines what is a container for later use.
         */
        if( $data['xtype'] == 'fieldcontainer' || $data['xtype'] == 'fieldset' ) $container = true;

        /**
         * check for all kind ao error combination and exit the
         * script if error found. If not, then continue.
         */
        if($container){
            /**
             * for fieldcontainers and fieldsets lets make sure the
             * field does NOT have child items
             */
            if($this->fieldHasChild($data['id'])){
                echo '{ "success": false, "errors": { "reason": "This field has one or more child field(s). Please, remove or moved the child fields before removeing this field." }}';
                exit;
            }
        }else{
            /**
             * for all other fields lats check that the item has a
             * column in the database and that the column is empty
             * the user can NOT delete field with data in it.
             */
            if(!$this->fieldHasColumn()) {
                echo '{ "success": false, "errors": { "reason": "This field does NOT have a column in the database.<br> This is very odd... please cotact Technical Support for help" }}';
                exit;
            }else{
                if($this->filedInUsed()){
                    echo '{ "success": false, "errors": { "reason": "Can NOT delete this field. This field already has data store in the database." }}';
                    exit;
                }
            }
        }

        /**
         * If the field is NOT a container the remove database
         * column for this field
         */
        if(!$container && !$this->fieldHasBrother()){
            $this->dropColumn();
        }
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
     * @param $conf
     * @return mixed
     */
    private function addColumn($conf){

        $this->setSQL("ALTER TABLE $this->form_data_table ADD $this->col $conf");
        $ret = $this->alterTable();
        $this->checkError($ret);

        if(!$this->fieldHasColumn()) {
            $ret[2] = 'Database column for this field could NOT be created.';
            $this->checkError($ret);
        }
        return;

    }

    /**
     * @return mixed
     */
    private function dropColumn(){
    
        $this->setSQL("ALTER TABLE $this->form_data_table DROP $this->col");
        $ret = $this->execOnly();
        $this->checkError($ret);

        if($this->fieldHasColumn()) {
            $ret[2] = 'Database column for this field could NOT be removed.';
            $this->checkError($ret);
        }
        return;
    }

    /**
     * @param $data
     * @param $id
     * @return mixed
     */
    private function insertOptions($data , $id){
        foreach($data as $key => $val){
            $opt['field_id'] = $id;
            $opt['oname']    = $key;
            $opt['ovalue']   = $val;
            $sql = $this->sqlBind($opt, "forms_field_options", "I");
            $this->setSQL($sql);
            $ret = $this->execOnly();
            $this->checkError($ret);
        }
        return;
    }
    /**
     * @param $data
     * @return array
     */
    private function setDefults($data){
        if($data['xtype'] != 'fieldcontainer' && $data['xtype'] != 'fieldset' ){
            if(!isset($data['margin'])) $data['margin'] = '0 5 0 0';
        }
        return $data;
    }

    /**
     * @param $form_id
     * @return mixed
     */
    private function getFormDataTable($form_id){
        $this->setSQL("SELECT form_data FROM forms_layout WHERE id = '$form_id'");
        $form_data_table = $this->fetch();
        $this->form_data_table = $form_data_table['form_data'];
        return;
    }

    /**
     * @return bool
     */
    private function fieldHasColumn(){
        $this->setSQL("SELECT * FROM information_schema.COLUMNS WHERE TABLE_NAME = '$this->form_data_table' AND COLUMN_NAME = '$this->col'");
        $ret = $this->execStatement(PDO::FETCH_ASSOC);
        if(isset($ret[0]['COLUMN_NAME'])) {
            return true;
        }else{
            return false;
        }
    }

    /**
     * @param $id
     * @return bool
     */
    private function fieldHasChild($id){
        $this->setSQL("SELECT id FROM forms_fields WHERE item_of ='$id'");
        $this->execStatement(PDO::FETCH_ASSOC);
        $count = $this->rowCount();
        if($count >= 1 ) {
            return true;
        }else{
            return false;
        }
    }

    /**
     * @return bool
     */
    private function fieldHasBrother(){
        $this->setSQL("SELECT id FROM forms_field_options WHERE oname = 'name' AND ovalue ='$this->col'");
        $this->execStatement(PDO::FETCH_ASSOC);
        $count = $this->rowCount();
        if($count >= 2 ) {
            return true;
        }else{
            return false;
        }
    }

    /**
     * @return bool
     */
    private function filedInUsed(){
        $this->setSQL("SELECT $this->col FROM $this->form_data_table");
        $ret = $this->execStatement(PDO::FETCH_ASSOC);
        if($ret[0]){
            return true;
        }else{
            return false;
        }
    }

    /**
     * @param $data
     * @return array
     */
    private function sinatizedData($data){
        foreach($data as $option => $val){
            if($val == '') unset($data[$option]);
            if($val == 'on'){
                $data[$option] = 'true';
            }elseif($val == 'off'){
                $data[$option] = 'false';
            }
        }
        return $data;
    }

    /**
     * This function is call after every sql statement and
     * will print the success callback with the errors found
     * then, stop the script.
     *
     * @param $err
     * @return mixed
     */
    private function checkError($err){
        if($err[2]){
            print '{success:false,errors:{reason:"'.$err[2].'"}}';
            exit;
        }else{
            return;
        }
    }

    /**
     * @return array
     */
    public function getForms(){
        $this->setSQL("SELECT * FROM forms_layout");
        $rows = array();
        foreach($this->execStatement(PDO::FETCH_ASSOC) as $row){
            array_push($rows, $row);
        }
        return $rows;
    }

    /**
     * @param stdClass $params
     * @return array
     */
    public function getParentFields(stdClass $params){
        $this->setSQL("Select CONCAT(fo.ovalue, ' (',ff.xtype ,')' ) AS name, ff.id as value
                         FROM forms_fields AS ff
                    LEFT JOIN forms_field_options AS fo
                           ON ff.id = fo.field_id
                    LEFT JOIN forms_layout AS fl
                           ON fl.id = ff.form_id
                        WHERE (fl.name  = '$params->currForm' OR fl.id    = '$params->currForm')
                          AND (ff.xtype = 'fieldcontainer'    OR ff.xtype = 'fieldset')
                          AND (fo.oname = 'title'             OR fo.oname = 'fieldLabel')
                     ORDER BY pos");
        $rows = array();
        array_push($rows, array('name' => 'Root', 'value' => 0));
        foreach($this->execStatement(PDO::FETCH_ASSOC) as $row){
            array_push($rows, $row);
        }
       return $rows;
    }

    /**
     * @param stdClass $params
     * @return array
     */
    public function getFormFieldsTree(stdClass $params){
        $fields = array();

        $this->setSQL("Select * FROM forms_fields WHERE form_id = '$params->currForm' AND (item_of IS NULL OR item_of = '0') ORDER BY pos ASC, id ASC");
        $results = $this->execStatement(PDO::FETCH_ASSOC);
        foreach($results as $item){
            $opts = $this->getItmesOptions($item['id']);
            foreach($opts as $opt => $val){
                $item[$opt] = $val;
            }
            $item['children'] = $this->getChildItems($item['id']);
            if($item['children'] == null) {
                unset($item['children']);
                if($item['xtype'] != 'fieldset' && $item['xtype'] != 'fieldcontainer') $item['leaf'] = true;
            }else{
                if($item['collapsed'] == 'collapsed'){
                    $item['expanded'] = false;
                }else{
                    $item['expanded'] = true;
                }
            }
            array_push($fields,$item);
        }
        return $fields;
    }

    /**
     * @param $parent
     * @return arrays
     */
    private function getChildItems($parent){
        $items = array();
        $this->setSQL("Select * FROM forms_fields WHERE item_of = '$parent' ORDER BY pos ASC");
        foreach($this->execStatement(PDO::FETCH_ASSOC) as $item){
            $opts = $this->getItmesOptions($item['id']);
            foreach($opts as $opt => $val){
                $item[$opt] = $val;
            }
            $item['children'] = $this->getChildItems($item['id']);
            if($item['children'] == null) {
                unset($item['children']);
                if($item['xtype'] != 'fieldset' && $item['xtype'] != 'fieldcontainer') $item['leaf'] = true;
            }else{
                if($item['collapsed'] == 'true'){
                    $item['expanded'] = false;
                }else{
                    $item['expanded'] = true;
                }
            }
            array_push($items,$item);
        }
        return $items;
    }

    /**
     * @param $item_id
     * @return array
     */
    private function getItmesOptions($item_id){
        $foo = array();
        $this->setSQL("Select * FROM forms_field_options WHERE field_id = '$item_id'");
        foreach($this->execStatement(PDO::FETCH_ASSOC) as $option){
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

}