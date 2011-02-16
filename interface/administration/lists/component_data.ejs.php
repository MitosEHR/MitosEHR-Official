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

// *************************************************************************************
//SANITIZE ALL ESCAPES
// *************************************************************************************
$sanitize_all_escapes=true;

// *************************************************************************************
//STOP FAKE REGISTER GLOBALS
// *************************************************************************************
$fake_register_globals=false;

// *************************************************************************************
// Load the MitosEHR Libraries
// *************************************************************************************
require_once("../../registry.php");
require_once("../../../repository/dataExchange/dataExchange.inc.php");

// Count records variable
$count = 0;

// *************************************************************************************
// Deside what to do with the $_GET['task']
// *************************************************************************************
switch ($_GET['task']) {

	// *************************************************************************************
	// Data for for storeTaxID
	// *************************************************************************************
	case "editlist":
		
		$lang_id = empty($_SESSION['language_choice']) ? '1' : $_SESSION['language_choice'];
		if (($lang_id == '1' && !empty($GLOBALS['skip_english_translation'])) || !$GLOBALS['translate_lists']) {
  			$sql = sqlStatement("SELECT 
  									option_id, 
  									title 
  								FROM 
  									list_options 
  								WHERE 
  									list_id = 'lists' 
  								ORDER BY title, seq");
		} else {
			// Use and sort by the translated list name.
			$sql = sqlStatement("SELECT 
									lo.option_id, 
									IF(LENGTH(ld.definition),ld.definition,lo.title) AS title 
								FROM list_options AS lo 
									LEFT JOIN lang_constants AS lc ON lc.constant_name = lo.title 
									LEFT JOIN lang_definitions AS ld ON ld.cons_id = lc.cons_id AND ld.lang_id = '$lang_id' 
								WHERE 
									lo.list_id = 'lists' 
								ORDER BY 
									IF(LENGTH(ld.definition),ld.definition,lo.title), lo.seq");
		}
		while ($urow = sqlFetchArray($sql)) {
			$buff .= " { option_id: '" . dataDecode( $urow['option_id'] ) . "', title: '" . dataDecode( $urow['title'] ) . "' },". chr(13);
			$count++;
		}
		$buff = substr($buff, 0, -2); // Delete the last comma and clear the buff.
		echo $_GET['callback'] . '({';
		echo "results: " . $count . ", " . chr(13);
		echo "row: [" . chr(13);
		echo $buff;
		echo "]})" . chr(13);
	break;
	
}

?>