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

include_once("../../../library/dbHelper/dbHelper.inc.php");
include_once("../../../library/I18n/I18n.inc.php");
require_once("../../../repository/dataExchange/dataExchange.inc.php");

//------------------------------------------
// Database class instance
//------------------------------------------
$mitos_db = new dbHelper();

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
  			$mitos_db->setSQL("SELECT 
  									option_id, 
  									title 
  								FROM 
  									list_options 
  								WHERE 
  									list_id = 'lists' 
  								ORDER BY title, seq");
		} else {
			// Use and sort by the translated list name.
			$mitos_db->setSQL("SELECT 
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
		$total = $mitos_db->rowCount();
		foreach ($mitos_db->execStatement() as $urow) {
			$buff .= '{"option_id":"'.dataDecode($urow['option_id']).'","title":"'.dataDecode($urow['title']).'"},'. chr(13);
		}
		$buff = substr($buff, 0, -2); // Delete the last comma.
		echo '{';
		echo '"totals": "' . $total . '", ' . chr(13);
		echo '"row": [' . chr(13);
		echo $buff;
		echo ']}' . chr(13);
	break;
}
?>