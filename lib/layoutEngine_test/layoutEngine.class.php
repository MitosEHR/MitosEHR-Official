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
//session_name ( "MitosEHR" );
//session_start();
//session_cache_limiter('private');
//include_once($_SESSION['site']['root']."/classes/dbHelper.class.php");
class layoutEngineTest extends dbHelper {
    private $items = array();

    function getFileds($formPanel = null){
        // *********************************************************************************************************
        // Get the Form ID from Database
        // *********************************************************************************************************
        $this->setSQL("Select * FROM forms_layout WHERE name = '$formPanel'");
        $foo = $this->fetch(PDO::FETCH_ASSOC);
        $fid = $foo['id'];
        // *********************************************************************************************************
        // Get Parent Items
        // *********************************************************************************************************
        $this->setSQL("Select * FROM forms_fields WHERE form_id = '$fid'");
        foreach($this->execStatement(PDO::FETCH_ASSOC) as $item){
            // *****************************************************************************************************
            // Get Option for main parent item
            // *****************************************************************************************************
            $opts = $this->getItmesOptions($item['id']);
            foreach($opts as $opt => $val){
                $item[$opt] = $val;
            }
            // *****************************************************************************************************
            // Get Child Items
            // *****************************************************************************************************
            $item['items'] = $this->getChildItems($item['id']);
            if($item['items'] == null) unset($item['items']);
            // *****************************************************************************************************
            // Delete unused by Sencha
            // *****************************************************************************************************
            unset($item['id']);
            unset($item['form_id']);
            unset($item['item_of']);
            // Push the Items into Items Array!
            array_push($this->items,$item);
        }
        // echo '<pre>';
        // print_r($this->items);
        // *********************************************************************************************************
        // Lets use json_decode to return all the fields
        // *********************************************************************************************************
        return json_encode($this->items);
    }
    // *************************************************************************************************************
    // Reclusive function to get all child items
    // *************************************************************************************************************
    function getChildItems($parent){
        $items = array();
        $this->setSQL("Select * FROM forms_fields WHERE item_of = '$parent'");
        foreach($this->execStatement(PDO::FETCH_ASSOC) as $item){
            // *****************************************************************************************************
            // Get option for Item
            // *****************************************************************************************************
            $opts = $this->getItmesOptions($item['id']);
            foreach($opts as $opt => $val){
                $item[$opt] = $val;
            }
            // *****************************************************************************************************
            // Lets run this function again. This is what makes this function reclusive
            // *****************************************************************************************************
            $item['items'] = $this->getChildItems($item['id']);
            if($item['items'] == null) unset($item['items']);
            // *****************************************************************************************************
            // Delete unused by Sencha
            // *****************************************************************************************************
            unset($item['id']);
            unset($item['form_id']);
            unset($item['item_of']);

            array_push($items,$item);
        }
        return $items;
    }
    // *************************************************************************************************************
    // Function to get items options/params
    // *************************************************************************************************************
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

	//**********************************************************************
	// renderForm 
	// This will render the selected form, and returns the Sencha ExtJS v4
	// code.
	//**********************************************************************
	public function renderForm($formPanel, $path, $title, $labelWidth, $saveText){
	    $bBuff = "";
	    $bBuff .= "panel." . $formPanel . " = Ext.create('Ext.form.Panel', {";
	    $bBuff .= "title: '" . $title . "',";
		$bBuff .= "frame: true, bodyStyle: 'padding: 5px', layout: 'anchor', height:300,";
		$bBuff .= "fieldDefaults: { msgTarget: 'side' },";
		$bBuff .= "items:";
        $bBuff .= $this->getFileds($formPanel);
		$bBuff .= "";
		$bBuff .= "}); // End of ".$formPanel . chr(13);
		print $bBuff;
	}
}

//$classname = new layoutEngineTest();
//$classname->renderForm("Demographics", "app/patient_file/new", "New Patient", 300, "Save new patient");

?>