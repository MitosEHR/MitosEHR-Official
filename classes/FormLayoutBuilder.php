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
include_once("dbHelper.php");
class FormLayoutBuilder {

    /**
     * @var
     */
    private $form_data_table;
    /**
     * @var
     */
    private $col;
    /**
     * @var dbHelper
     */
    private $db;
    /**
     * Creates the dbHelper instance
     */
    function __construct(){
        $this->db = new dbHelper();
        return;
    }
    /**
     * @param stdClass $params
     * @return array
     */
    public function addField(stdClass $params){

        $data = get_object_vars($params);

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
            return array('success' => false, 'error'=> 'Field \"'.$this->col.'\" exist, please verify the form or change the Field \"name\" preoperty');
        }else{
            /**
             * since now we know the column doesn't exist, lets create one for the new field
             */
            if(!$container){

                if(!$this->fieldHasColumn()){
                    $this->addColumn('TEXT');
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
            $sql = $this->db->sqlBind($field, "forms_fields", "I");
            $this->db->setSQL($sql);
            $ret = $this->db->execLog();
            $this->checkError($ret);
            $field_id = $this->db->lastInsertId;
            /**
             * take each option and insert it in the forms_field_options
             * table using $field_id
             */
            $this->insertOptions($data, $field_id);

            return array('success' => true);
        }
    }

    /**
     * This function will update the fields and print
     * the success callback if no errors found alog the way
     *
     * @param stdClass $params
     * @return array
     */
    public function updateField(stdClass $params){

        $data = get_object_vars($params);

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
        $sql = $this->db->sqlBind($field, "forms_fields", "U", "id='$id'");
        $this->db->setSQL($sql);
        $ret = $this->db->execLog();
        $this->checkError($ret);
        /**
         * delete old field options
         */
        $this->db->setSQL("DELETE FROM forms_field_options WHERE field_id='$id'");
        $ret = $this->db->execOnly();
        $this->checkError($ret);
        /**
         * take the remaining $data array and insert it in the
         * forms_field_options table one by one.
         */
        $this->insertOptions($data, $id);

        return array('success' => true);
    }

    /**
     * This function will delete the field and print success is no
     * error were found along the way.
     *
     * @param stdClass $params
     * @return array
     */
    public function deleteField(stdClass $params){

        $data = get_object_vars($params);

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
        $this->db->setSQL("DELETE FROM forms_fields WHERE id='$id'");
        $ret = $this->db->execOnly();
        $this->checkError($ret);
        $this->db->setSQL("DELETE FROM forms_field_options WHERE field_id='$id'");
        $ret = $this->db->execOnly();
        $this->checkError($ret);

        return array('success' => true);
    }

    /**
     * This function sorts the fields when the drag and drop is use and
     * print success if no error found along the way.
     *
     * @param stdClass $params
     * @return array
     */
    public function sortFields(stdClass $params){

        $data = get_object_vars($params);

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
        $sql = $this->db->sqlBind($field, "forms_fields", "U", "id='$item'");
        $this->db->setSQL($sql);
        $ret = $this->db->execOnly();
        $this->checkError($ret);
        /**
         * here we set the pos column value, starting from 10.
         * after updating the item pos, we add 10 to $pos and
         * loop for each child item
         */
        foreach($childItems as $child){
            $field['pos'] = $pos;
            $sql = $this->db->sqlBind($field, "forms_fields", "U", "id='$child'");
            $this->db->setSQL($sql);
            $ret = $this->db->execOnly();
            $this->checkError($ret);
            $pos = $pos + 10;
        }

        return array('success' => true);
    }

    /**
     * @brief       Add a column to the form data table
     * @details     Simple exec SQL Statement, with no Event LOG injection
     *
     * @author      Ernesto J Rodriguez (Certun) <erodriguez@certun.com>
     * @version     Vega 1.0
     * @copyright   Gnu Public License (GPLv3)
     *
     * @param       $conf
     * @return      mixed
     */
    private function addColumn($conf){

        $this->db->setSQL("ALTER TABLE $this->form_data_table ADD $this->col $conf");
        $ret = $this->db->execOnly();
        $this->checkError($ret);

        if(!$this->fieldHasColumn()) {
            $ret[2] = 'Database column for this field could NOT be created.';
            $this->checkError($ret);
        }
        return;

    }

    /**
     * @brief       drop a column to the form data table
     * @details     Simple exec SQL Statement, with no Event LOG injection
     *
     * @author      Ernesto J Rodriguez (Certun) <erodriguez@certun.com>
     * @version     Vega 1.0
     * @copyright   Gnu Public License (GPLv3)
     *
     * @return      mixed
     */
    private function dropColumn(){
    
        $this->db->setSQL("ALTER TABLE $this->form_data_table DROP $this->col");
        $ret = $this->db->execOnly();
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

            $json = json_encode($data, JSON_NUMERIC_CHECK);
            $options = array('field_id' => $id, 'options' => $json);

            $sql = ("SELECT count(*) FROM forms_field_options WHERE field_id = '$id'");
            $this->db->setSQL($sql);
            $field = $this->db->fetch();

            if($field['count(*)'] == 0){
                $sql = $this->db->sqlBind($options, "forms_field_options", "I");
            }else{
                $sql = $this->db->sqlBind($options, "forms_field_options", "U", "field_id ='".$id."'" );
            }

            $this->db->setSQL($sql);
            $ret = $this->db->execOnly();
            $this->checkError($ret);

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
        if($data['xtype'] == 'radiofield'){
          // $data['flex'] = 1;
        }

        return $data;
    }

    /**
     * @param $form_id
     * @return mixed
     */
    private function getFormDataTable($form_id){
        $this->db->setSQL("SELECT form_data FROM forms_layout WHERE id = '$form_id'");
        $form_data_table = $this->db->fetch();
        $this->form_data_table = $form_data_table['form_data'];
        return;
    }

    /**
     * @return bool
     */
    private function fieldHasColumn(){
        $this->db->setSQL("SELECT * FROM information_schema.COLUMNS WHERE TABLE_NAME = '$this->form_data_table' AND COLUMN_NAME = '$this->col'");
        $ret = $this->db->execStatement(PDO::FETCH_ASSOC);
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
        $this->db->setSQL("SELECT id FROM forms_fields WHERE item_of ='$id'");
        $this->db->execStatement(PDO::FETCH_ASSOC);
        $count = $this->db->rowCount();
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
        $this->db->setSQL("SELECT id FROM forms_field_options WHERE oname = 'name' AND ovalue ='$this->col'");
        $this->db->execStatement(PDO::FETCH_ASSOC);
        $count = $this->db->rowCount();
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
        $this->db->setSQL("SELECT $this->col FROM $this->form_data_table");
        $ret = $this->db->execStatement(PDO::FETCH_ASSOC);
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
            if($val == '' || $val == null) unset($data[$option]);
            if($option == 'hideLabel' || $option == 'checkboxToggle' || $option == 'collapsed' || $option == 'collapsible'){
                if($val == 0){
                    $data[$option] = false;
                }else{
                    $data[$option] = true;
                }

            }

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
        $this->db->setSQL("SELECT * FROM forms_layout");
        $rows = array();
        foreach($this->db->execStatement(PDO::FETCH_ASSOC) as $row){
            array_push($rows, $row);
        }
        return $rows;
    }

    /**
     * @param stdClass $params
     * @return array
     */
    public function getParentFields(stdClass $params){
        $this->db->setSQL("Select ff.id, ff.xtype
                         FROM forms_fields AS ff
                    LEFT JOIN forms_layout AS fl
                           ON fl.id = ff.form_id
                        WHERE (fl.name  = '$params->currForm' OR fl.id    = '$params->currForm')
                          AND (ff.xtype = 'fieldcontainer'    OR ff.xtype = 'fieldset')
                     ORDER BY ff.pos");
        $parentFields = array();
        array_push($parentFields, array('name' => 'Root', 'value' => 0));
        foreach($this->db->execStatement(PDO::FETCH_ASSOC) as $parentField){
            $id = $parentField['id'];
            $this->db->setSQL("SELECT options FROM forms_field_options WHERE field_id = '$id'");
            $fo = $this->db->fetch();
            $foo = json_decode($fo['options'],true);
            $row['name']  =  $foo['title'].$foo['fieldLabel'].' ('.$parentField['xtype'].')';
            $row['value'] =  $parentField['id'];
            array_push($parentFields, $row);
        }
       return $parentFields;
    }

    /**
     * @param stdClass $params
     * @return array
     */
    public function getFormFieldsTree(stdClass $params){
        $fields = array();
        if(isset($params->currForm)){
            $this->db->setSQL("Select * FROM forms_fields WHERE form_id = '$params->currForm' AND (item_of IS NULL OR item_of = '0') ORDER BY pos ASC, id ASC");
            $results = $this->db->execStatement(PDO::FETCH_ASSOC);
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
                    if($item['collapsed']== 0){
                        $item['expanded'] = true;
                    }else{
                        $item['expanded'] = false;
                    }
                }
                array_push($fields,$item);
            }
        }
        return $fields;
    }

    /**
     * @param $parent
     * @return arrays
     */
    private function getChildItems($parent){
        $items = array();
        $this->db->setSQL("Select * FROM forms_fields WHERE item_of = '$parent' ORDER BY pos ASC");
        foreach($this->db->execStatement(PDO::FETCH_ASSOC) as $item){
            $opts = $this->getItmesOptions($item['id']);
            foreach($opts as $opt => $val){
                $item[$opt] = $val;
            }
            $item['children'] = $this->getChildItems($item['id']);
            if($item['children'] == null) {
                unset($item['children']);
                if($item['xtype'] != 'fieldset' && $item['xtype'] != 'fieldcontainer') $item['leaf'] = true;
            }else{
                if($item['collapsed'] == 0){
                    $item['expanded'] = true;
                }else{
                    $item['expanded'] = false;
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
        $this->db->setSQL("Select options FROM forms_field_options WHERE field_id = '$item_id'");
        $options = $this->db->fetch();
        $options = json_decode($options['options'],true);
        foreach($options as $option => $value){
            $foo[$option] = $value;
        }
        return $foo;
    }

}
