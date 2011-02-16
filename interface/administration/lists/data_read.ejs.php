<?php
//--------------------------------------------------------------------------------------------------------------------------
// manage_messages.ejs.php
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
// Load the MitosEMR Libraries
// *************************************************************************************
require_once("../../registry.php");
require_once("../../../repository/dataExchange/dataExchange.inc.php");

// Count records variable
$count = 0;

// *************************************************************************************
// Verify if a $_GET['id'] has passed to select a facility.
// and execute the apropriate SQL statement
// *************************************************************************************
if ($_GET['list_id']){
	$lang_id = empty($_SESSION['language_choice']) ? '1' : $_SESSION['language_choice'];
	if (($lang_id == '1' && !empty($GLOBALS['skip_english_translation'])) || !$GLOBALS['translate_lists']) {
  		$sql = sqlStatement("SELECT 
  									option_id, 
  									title 
	  							FROM 
  									list_options 
  								WHERE 
  									list_id = '" . $_GET['list_id'] . "' 
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
									lo.list_id = '" . $_GET['list_id'] . "' 
								ORDER BY 
									IF(LENGTH(ld.definition),ld.definition,lo.title), lo.seq");
	}

$result = sqlStatement( $sql );

while ($myrow = sqlFetchArray($result)) {
	$count++;
	$buff .= "{";
	$buff .= " list_id: '" . dataEncode( $myrow['list_id'] ) . "',";
	$buff .= " option_id: '" . dataEncode( $myrow['option_id'] ) . "',";
	$buff .= " title: '" . dataEncode( $myrow['title'] ) . "',";
	$buff .= " seq: '" . dataEncode( $myrow['seq'] ) . "',";
	$buff .= " is_default: '" . dataEncode( $myrow['is_default'] ) . "'," ;
	$buff .= " option_value: '" . dataEncode( $myrow['option_value'] ) . "',";
	$buff .= " mapping: '" . dataEncode( $myrow['mapping'] ) . "',";
	$buff .= " notes: '" . dataEncode( $myrow['notes'] ) . "'}," . chr(13);
}

$buff = substr($buff, 0, -2); // Delete the last comma.
echo $_GET['callback'] . '({';
echo "results: " . $count . ", " . chr(13);
echo "row: [" . chr(13);
echo $buff;
echo "]})" . chr(13);


?>