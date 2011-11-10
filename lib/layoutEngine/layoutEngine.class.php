<?php
/* 
 * layoutEngine.class.php
 * 
 * @DESCRIPTION@: This class object will create dynamic ExtJS v4 form, previuosly created or edited 
 * from the Layout Form Editor. Gathering all it's data and parameters from the layout_options table. 
 * Most of the structural database table was originally created by OpenEMR developers.
 * 
 * What this class will not do: This class will not create the entire Screen Panel for you, this
 * will only create the form object with the fields names & dataStores configured on the layout_options table.
 * 
 * version: 0.1.0
 * author: GI Technologies, 2011
 * modifed: Ernesto J Rodriguez
 * 
 */
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');
include_once($_SESSION['site']['root']."/classes/dbHelper.class.php");
class layoutEngine extends dbHelper {
    private $items = array();
    /**
     * @param $formPanel
     * @return string
     *
     * We can get the form fields by form name or form if
     * example: getFileds('Demographics') or getFileds('1')
     * The logic of the function is to get the form parent field
     * and its options, then get the child items if any with it options.
     * Then.. use reg Expression to remove the double quotes from all
     * the options and leave the double quotes to all options values,
     * unless the value is a int or bool.
     */
    function getFileds($formPanel = null){
        /**
         * get the form parent fields
         */
        $this->setSQL("Select ff.*
                         FROM forms_fields AS ff
                    LEFT JOIN forms_layout AS fl
                           ON ff.form_id = fl.id
                        WHERE (fl.name = '$formPanel' OR fl.id = '$formPanel')
                          AND (ff.item_of IS NULL OR ff.item_of = '0')");
        /**
         * for each field lets get...
         */
        foreach($this->execStatement(PDO::FETCH_ASSOC) as $item){
            /**
             * get parent field options using the parent item ID parameter and catch
             * the retun array in $opts.
             */
            $opts = $this->getItmesOptions($item['id']);
            /**
             * now take each option and add it to this $item array
             */
            foreach($opts as $opt => $val){
                $item[$opt] = $val;
            }
            /**
             * now lets get the the child items using the parent item ID parameter
             */
            $item['items'] = $this->getChildItems($item['id']);
            /**
             * lets check if this item has a child items. If not, the unset the $item['Itmes']
             * this way we make sure the we done return a items property
             */
            if($item['items'] == null) unset($item['items']);
            /**
             * unset the stuff taht are not properties
             */
            unset($item['id'],$item['form_id'],$item['item_of']);
            /**
             * push this item into the $items Array
             */
            array_push($this->items,$item);
        }

        /**
         * in this new block of code we are goin to clean the json output using a reg expression
         * to remove the unnessesary double quotes fromthe properties, bools, and ints values.
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
         * and get this output...
         * [{
         *      xtype:"fieldset",
         *      title:"Who",
         *      collapsible:true,
         *      items:[{
         *          xtype:"fieldcontainer",
         *          fieldLabel:"Name",
         *          layout:"hbox",
         *          anchor:"100%",
         *       }]
         * }]
         */
        $rawStr = json_encode($this->items);
        $reg = '([?!,|?{](\"(.*?)\")[:])';
        preg_match_all ($reg,$rawStr,$rawItems );
        $cleanItems = array();
        foreach($rawItems[0] as $item){
            array_push($cleanItems,str_replace('"','',$item) );
        }
        $cleanStr = str_replace($rawItems[0],$cleanItems,$rawStr );
        return $cleanStr;
    }
    /**
     * @param $parent
     * @return array
     *
     * Here we use the parent id to get the child items and it options
     * using basically the same logic of getFileds() function and returning
     * an array of child items
     */
    function getChildItems($parent){
        $items = array();
        $this->setSQL("Select * FROM forms_fields WHERE item_of = '$parent'");
        foreach($this->execStatement(PDO::FETCH_ASSOC) as $item){

            $opts = $this->getItmesOptions($item['id']);
            foreach($opts as $opt => $val){
                $item[$opt] = $val;
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
    function getItmesOptions($item_id){
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
/**
 * make sure the $_REQUEST['form'] is set, then create an instance of
 * layoutEngine class and recuest the fields
 */
if(isset($_REQUEST['form'])){
    $classname = new layoutEngine();
    print $classname->getFileds($_REQUEST['form']);
}