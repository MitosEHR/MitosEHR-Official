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
include_once($_SESSION['site']['root']."/classes/dbHelper.class.php");
class layoutEngine extends dbHelper {
    private $items = array();
    /**
     * We can get the form fields by form name or form if
     * example: getFields('Demographics') or getFields('1')
     * The logic of the function is to get the form parent field
     * and its options, then get the child items if any with it options.
     * Then.. use reg Expression to remove the double quotes from all
     * the options and leave the double quotes to all options values,
     * unless the value is a int or bool.
     *
     * @param $formPanel
     * @return string
     */
    function getFields($formPanel = null){
        /**
         * get the form parent fields
         */
        $this->setSQL("Select ff.*
                         FROM forms_fields AS ff
                    LEFT JOIN forms_layout AS fl
                           ON ff.form_id = fl.id
                        WHERE (fl.name = '$formPanel' OR fl.id = '$formPanel')
                          AND (ff.item_of IS NULL OR ff.item_of = '0')
                     ORDER BY pos DESC ");
        /**
         * for each field lets get...
         */
        foreach($this->execStatement(PDO::FETCH_ASSOC) as $item){
            /**
             * get parent field options using the parent item ID parameter and catch
             * the return array in $opts.
             */
            $opts = $this->getItemsOptions($item['id']);
            /**
             * now take each option and add it to this $item array
             */
            foreach($opts as $opt => $val){
                $item[$opt] = $val;
            }
            if($item['xtype'] == 'combobox'){
                $item['displayField'] = 'name';
                $item['valueField']   = 'value';
                $item['queryMode']    = 'local';
                $item['editable']     = false;
                $item['emptyText']    = 'Select';
                $item['store']        = $this->getStore();
            }
            /**
             * now lets get the the child items using the parent item ID parameter
             */
            $item['items'] = $this->getChildItems($item['id']);
            /**
             * lets check if this item has a child items. If not, the unset the $item['Items']
             * this way we make sure the we done return a items property
             */
            if($item['items'] == null) unset($item['items']);
            /**
             * unset the stuff that are not properties
             */
            unset($item['id'],$item['form_id'],$item['item_of']);
            /**
             * push this item into the $items Array
             */
            array_push($this->items,$item);
        }
        /**
         * in this new block of code we are going to clean the json output using a reg expression
         * to remove the unnecessary double quotes from the properties, bools, and ints values.
         * basically we start we this input..
         * [{
         *      "xtype":"fieldset",
         *      "title":"Who",
         *      "collapsible":"true",
         *      "items":[{
         *          "xtype":"fieldcontainer",
         *          "fieldLabel":"Name",
         *          "layout":"hbox",
         *          "anchor":"100%",
         *       }]
         * }]
         *
         * and finish with this output...
         * [{
         *      xtype:'fieldset',
         *      title:'Who',
         *      collapsible:true,
         *      items:[{
         *          xtype:'fieldcontainer',
         *          fieldLabel:'Name',
         *          layout:'hbox',
         *          anchor:'100%',
         *       }]
         * }]
         *
         * The regular expression will select any string that...
         *
         * is surrounded by double quotes and follow by :   for example   "xtype":
         *
         * or "Ext.create
         *
         * or }]})"
         *
         * Then remove the double quotes form that selection.
         *
         * Then replace remaining double quotes for single quotes <-- not required but...
         * we do it because MitosEHR user single quotes to define strings.
         */
        $rawStr     = json_encode($this->items);
        $regex      = '("\w*?":|"Ext\.create|}\]}\)")';
        $cleanItems = array();

        preg_match_all( $regex, $rawStr, $rawItems );

        foreach($rawItems[0] as $item){
            array_push( $cleanItems, str_replace( '"', '', $item) );
        }

        $itemsJsArray = str_replace( '"', '\'', str_replace( $rawItems[0], $cleanItems, $rawStr ));
        return $itemsJsArray;
    }
    /**
     * @param $parent
     * @return array
     *
     * Here we use the parent id to get the child items and it options
     * using basically the same logic of getFields() function and returning
     * an array of child items
     */
    function getChildItems($parent){
        $items = array();
        $this->setSQL("Select * FROM forms_fields WHERE item_of = '$parent' ORDER BY pos DESC");
        foreach($this->execStatement(PDO::FETCH_ASSOC) as $item){
            $opts = $this->getItemsOptions($item['id']);
            foreach($opts as $opt => $val){
                $item[$opt] = $val;
            }
            /**
             * If the item is a combo box lets create a store...
             */
            if($item['xtype'] == 'combobox'){
                $item['displayField'] = 'name';
                $item['valueField']   = 'value';
                $item['queryMode']    = 'local';
                $item['editable']     = false;
                $item['emptyText']    = 'Select';
                $item['store']        = $this->getStore();
            }
            /**
             * this if what makes this function reclusive this function will keep
             * calling it self
             */
            $item['items'] = $this->getChildItems($item['id']);
            if($item['items'] == null) unset($item['items']);
            unset($item['id'],$item['form_id'],$item['item_of']);
            array_push($items,$item);
        }
        return $items;
    }
    /*
     * @param $item_id
     * @return array
     */
    function getItemsOptions($item_id){
        $foo = array();
        $this->setSQL("Select * FROM forms_field_options WHERE field_id = '$item_id'");
        foreach($this->execStatement(PDO::FETCH_ASSOC) as $option){
            if(is_numeric($option['ovalue'])){      // if the string is numeric intval() the value to remove the comas
                $option['ovalue'] = intval($option['ovalue']);
            }elseif($option['ovalue'] == 'true'){   // if the string is true let change the value to a bool
                $option['ovalue'] = true;
            }elseif($option['ovalue'] == 'false'){  // if the string is false let change the value to a bool
                $option['ovalue'] = false;
            }
            $foo[$option['oname']] = $option['ovalue'];
        }
        return $foo;
    }
    /**
     * The return of this function is use for testing only
     *
     * @return string
     */
    function getStore(){
        return "Ext.create('Ext.data.Store',{fields:['name','value'],data:[{name:'Option 1',value:'1'},{name:'Option 2',value:'2'},{name:'Option 3',value:'3'}]})";
    }
}
/**
 * make sure the $_REQUEST['form'] is set, then create an instance of
 * layoutEngine class and request the fields
 */
if(isset($_REQUEST['form'])){
    $formFields = new layoutEngine();
    print $formFields->getFields($_REQUEST['form']);
}