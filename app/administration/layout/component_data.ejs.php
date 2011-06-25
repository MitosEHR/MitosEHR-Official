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
		foreach($mitos_db->execStatement() as $row){
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
		$mitos_db->setSQL("SELECT DISTINCT 
								group_name
							FROM
  								layout_options
							WHERE
  								form_id = '". $_REQUEST['form_id'] . "'
							ORDER BY
  								group_order, seq");
		$totals = $mitos_db->rowCount();
		$rows = array();
		foreach($mitos_db->execStatement() as $row){
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
						LEFT JOIN lang_definitions AS ld ON ld.cons_id = lc.cons_id AND ld.lang_id = '" . $_SESSION['lang']['code'] . "
					WHERE 
						lo.list_id = 'lists' 
					ORDER BY 
						IF(LENGTH(ld.definition),ld.definition,lo.title), lo.seq");
		}
		$totals = $mitos_db->rowCount();
		//---------------------------------------------------------------------------------------
		// start the array
		//---------------------------------------------------------------------------------------
		$rows = array();
		foreach($mitos_db->execStatement() as $row){
			array_push($rows, $row);
		}
		//---------------------------------------------------------------------------------------
		// here we are adding "totals" and the root "row" for sencha use 
		//---------------------------------------------------------------------------------------
		print(json_encode(array('totals'=>$totals,'row'=>$rows)));
	break;

}
?>