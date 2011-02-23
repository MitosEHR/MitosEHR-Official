<?php
//--------------------------------------------------------------------------------------------------------------------------
// data_read.ejs.php / List Options
// v0.0.1
// Under GPLv3 License
//
// Integrated by: Gi Technologies. in 2011
//
// Remember, this file is called via the Framework Store, this is the AJAX thing.
//--------------------------------------------------------------------------------------------------------------------------

session_name ( "MitosEHR" );
session_start();

include_once("library/adoHelper/adoHelper.inc.php");
include_once("library/I18n/I18n.inc.php");
require_once("repository/dataExchange/dataExchange.inc.php");

// Count records variable
$count = 0;

// *************************************************************************************
// Get the $_GET['list_id'] 
// and execute the apropriate SQL statement
// *************************************************************************************
$currList = $_REQUEST['list_id'];
	
	$lang_id = empty($_SESSION['language_choice']) ? '1' : $_SESSION['language_choice'];
	if (($lang_id == '1' && !empty($GLOBALS['skip_english_translation'])) || !$GLOBALS['translate_lists']) {
  		$sql = "SELECT 
					*
				FROM 
					list_options 
				WHERE 
					list_id = '$currList' 
  				ORDER BY 
  					title, seq";
	} else {
		// Use and sort by the translated list name.
		$sql = "SELECT 
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
					LEFT JOIN lang_definitions AS ld ON ld.cons_id = lc.cons_id AND ld.lang_id = '$lang_id' 
				WHERE 
					lo.list_id = '$currList' 
				ORDER BY 
					IF(LENGTH(ld.definition),ld.definition,lo.title), lo.seq";
	}

	$buff = "";
	foreach (sqlStatement($sql) as $urow) {
		$count++;
		$buff .= "{";
		$buff .= " id: '" . $urow['id'] . "',";
		$buff .= " list_id: '" . dataEncode( $urow['list_id'] ) . "',";
		$buff .= " option_id: '" . dataEncode( $urow['option_id'] ) . "',";
		$buff .= " title: '" . dataEncode( $urow['title'] ) . "',";
		$buff .= " seq: '" . dataEncode( $urow['seq'] ) . "',";
		$buff .= " is_default: '" . dataEncode( $urow['is_default'] ) . "'," ;
		$buff .= " option_value: '" . dataEncode( $urow['option_value'] ) . "',";
		$buff .= " mapping: '" . dataEncode( $urow['mapping'] ) . "',";
		$buff .= " notes: '" . dataEncode( $urow['notes'] ) . "'}," . chr(13);
	}

	$buff = substr($buff, 0, -2); // Delete the last comma.
	echo $_GET['callback'] . '({';
	echo "results: " . $count . ", " . chr(13);
	echo "row: [" . chr(13);
	echo $buff;
	echo "]})" . chr(13);


?>