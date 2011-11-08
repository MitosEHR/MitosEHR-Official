<?php
//--------------------------------------------------------------------------------------------------------------------------
// component_data.ejs.php / List Options
// v0.0.1
// Under GPLv3 License
//
// Integrated by: Gi Technologies. in 2011
//
// Remember, this file is called via the Framework Store, this is the AJAX thing.
//--------------------------------------------------------------------------------------------------------------------------

session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once($_SESSION['site']['root']."/classes/dbHelper.class.php");
include_once($_SESSION['site']['root']."/classes/I18n.class.php");
include_once($_SESSION['site']['root']."/lib/layoutEngine/dataTypes.array.php");
require_once($_SESSION['site']['root']."/classes/dataExchange.class.php");

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;

//------------------------------------------
// Database class instance
//------------------------------------------
$mitos_db = new dbHelper();

// *************************************************************************************
// Deside what to do with the $_GET['task']
// *************************************************************************************
switch ($_GET['task']) {
	case "field_types":
		$field_types = array(
			0 => array("id"=> 1,   "name" => "Fieldset",                "value" => "fieldset"),
			1 => array("id"=> 2,   "name" => "Field Container",         "value" => "fieldcontainer"),
			2 => array("id"=> 3,   "name" => "Text Field",              "value" => "textfield"),
			3 => array("id"=> 4,   "name" => "TextArea Field",          "value" => "textareafield"),
			4 => array("id"=> 5,   "name" => "CheckBox Field",          "value" => ".mitos.checkbox"),
			5 => array("id"=> 6,   "name" => "Slelect List / Combo Box","value" => "combobox"),
			6 => array("id"=> 7,   "name" => "Radio Field",             "value" => "radiofield"),
			7 => array("id"=> 8,   "name" => "Date Field",              "value" => "datefield"),
			8 => array("id"=> 9,   "name" => "Time Field",              "value" => "timefield"),
			9 => array("id"=> 10,  "name" => "Number Field",            "value" => "numberfield")
		);
		$totals = count($field_types);
		print_r(json_encode(array('totals'=>$totals,'row'=>$field_types)));
	    break;
    case "field_properties":
		$field_properties = array(
			0  => array("id"=> 1,  "name" => "title",           "value" => "title"),
			1  => array("id"=> 2,  "name" => "xtype",           "value" => "xtype"),
			2  => array("id"=> 3,  "name" => "width",           "value" => "width"),
			3  => array("id"=> 4,  "name" => "height",          "value" => "height"),
			4  => array("id"=> 5,  "name" => "flex",            "value" => "flex"),
			5  => array("id"=> 6,  "name" => "name",            "value" => "name"),
			6  => array("id"=> 7,  "name" => "inputValue",      "value" => "inputValue"),
			7  => array("id"=> 8,  "name" => "labelWidth",      "value" => "labelWidth"),
			8  => array("id"=> 9,  "name" => "allowBlank",      "value" => "allowBlank"),
			9  => array("id"=> 10, "name" => "value",           "value" => "value"),
			10 => array("id"=> 11, "name" => "maxValue",        "value" => "maxValue"),
			11 => array("id"=> 12, "name" => "minValue",        "value" => "minValue"),
			12 => array("id"=> 13, "name" => "boxLabel",        "value" => "boxLabel"),
			13 => array("id"=> 14, "name" => "grow",            "value" => "grow"),
			14 => array("id"=> 15, "name" => "increment",       "value" => "increment")
		);
		$totals = count($field_properties);
		print(json_encode(array('totals'=>$totals,'row'=>$field_properties)));
	    break;

    case 'parent_fields':
        $currForm = $_REQUEST['currForm'];
        $mitos_db->setSQL("Select CONCAT(fo.ovalue, ' (',ff.xtype ,')' ) AS name, ff.id as value
                             FROM forms_fields AS ff
                        LEFT JOIN forms_field_options AS fo
                               ON ff.id = fo.field_id
                        LEFT JOIN forms_layout AS fl
                               ON fl.id = ff.form_id
                            WHERE fl.name   = '$currForm'
                              AND (ff.xtype = 'fieldcontainer' OR ff.xtype = 'fieldset')
                              AND (fo.oname = 'title' OR fo.oname = 'fieldLabel')");
        $totals = $mitos_db->rowCount();
		//---------------------------------------------------------------------------------------
		// start the array
		//---------------------------------------------------------------------------------------
		$rows = array();
        //echo '<pre>';
        //print_r($mitos_db->execStatement(PDO::FETCH_ASSOC));
        //exit;
            array_push($rows, array('name' => 'None', 'value' => null));
		foreach($mitos_db->execStatement(PDO::FETCH_ASSOC) as $row){
            array_push($rows, $row);
		}

		//---------------------------------------------------------------------------------------
		// here we are adding "totals" and the root "row" for sencha use
		//---------------------------------------------------------------------------------------
		print(json_encode(array('totals'=>$totals,'row'=>$rows)));
           

        break;
	// *************************************************************************************
	// Data for Form List
	// *************************************************************************************
	case "form_list":
		$mitos_db->setSQL("SELECT DISTINCT form_id FROM layout_options");
		$totals = $mitos_db->rowCount();
		//---------------------------------------------------------------------------------------
		// start the array
		//---------------------------------------------------------------------------------------
		$rows = array();
		foreach($mitos_db->execStatement(PDO::FETCH_ASSOC) as $row){
			$row['id'] = $row['form_id'];
			array_push($rows, $row);
		}
		//---------------------------------------------------------------------------------------
		// here we are adding "totals" and the root "row" for sencha use
		//---------------------------------------------------------------------------------------
		print(json_encode(array('totals'=>$totals,'row'=>$rows)));
	    break;
	
	// *************************************************************************************
	// Available Data Types for the Form Editor
	// *************************************************************************************
	case "data_types":
		$totals = count($dataTypes_json);
		print(json_encode(array('totals'=>$totals,'row'=>$dataTypes_json)));
	    break;

	//---------------------------------------------------------------------------------------
	// UOR
	//---------------------------------------------------------------------------------------	
	case "uor":
		$uorTypes = array(
			0 => array("id"=> 0, "uor" => i18n('Unused', 'r')),
			1 => array("id"=> 1, "uor" => i18n('Optional', 'r')),
			2 => array("id"=> 2, "uor" => i18n('Required', 'r'))
		);
		$totals = count($uorTypes);
		print(json_encode(array('totals'=>$totals,'row'=>$uorTypes)));
	    break;
	
	// *************************************************************************************
	// Returns the available groups in the selected form
	// *************************************************************************************
	case "groups":
        $form_id = $_REQUEST['form_id'];
		$mitos_db->setSQL("SELECT DISTINCT group_name FROM layout_options WHERE form_id ='$form_id' ORDER BY group_order, seq");
		$totals = $mitos_db->rowCount();
		$rows = array();
		foreach($mitos_db->execStatement(PDO::FETCH_ASSOC) as $row){
			array_push($rows, $row);
		}
		print(json_encode(array('totals'=>$totals,'row'=>$rows)));
	    break;
	
	// *************************************************************************************
	// Available List for the available data types
	// *************************************************************************************
	case "lists":
		if ($_SESSION['lang']['code'] == "en_US") { // If the selected language is English, do not translate
			$mitos_db->setSQL("SELECT
						*
					FROM
						list_options
					WHERE
						list_id = 'lists'
					ORDER BY
						seq");
		} else {
			// If a language is selected, translate the list.
            $lang = $_SESSION['lang']['code'];
			$mitos_db->setSQL("SELECT
						lo.id,
						lo.list_id,
						lo.option_id,
						IF(LENGTH(ld.definition),ld.definition,lo.title) AS title ,
						lo.seq,
						lo.is_default,
						lo.option_value,
						lo.mapping,
						lo.notes
					FROM
						list_options AS lo
						LEFT JOIN lang_constants AS lc ON lc.constant_name = lo.title
						LEFT JOIN lang_definitions AS ld ON ld.cons_id = lc.cons_id AND ld.lang_id = '$lang'
					WHERE
						lo.list_id = 'lists'
					ORDER BY
						IF(LENGTH(ld.definition), ld.definition, lo.title), lo.seq " );
		}
		$totals = $mitos_db->rowCount();
		//---------------------------------------------------------------------------------------
		// start the array
		//---------------------------------------------------------------------------------------
		$rows = array();
		foreach($mitos_db->execStatement(PDO::FETCH_ASSOC) as $row){
			array_push($rows, $row);
		}
		//---------------------------------------------------------------------------------------
		// here we are adding totals and the root row for sencha use
		//---------------------------------------------------------------------------------------
		print(json_encode(array('totals'=>$totals,'row'=>$rows)));
	    break;
}