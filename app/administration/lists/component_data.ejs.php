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
	// Data for for storeTaxID
	// *************************************************************************************
	case "list":
		if ($_SESSION['lang']['code'] == "en_US") { // If the selected language is English, do not translate
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
		foreach ($mitos_db->execStatement(PDO::FETCH_ASSOC) as $urow) {
			$buff .= '{"option_id":"'.dataDecode($urow['option_id']).'","title":"'.dataDecode($urow['title']).'"},'. chr(13);
		}
		$buff = substr($buff, 0, -2); // Delete the last comma.
		echo '{';
		echo '"totals": "' . $total . '", ' . chr(13);
		echo '"row": [' . chr(13);
		echo $buff;
		echo ']}' . chr(13);
	break;
	
	// *************************************************************************************
	// Create a new list
	// This data creation is special, we don't nee a data_create.ejs.php to do this.
	// *************************************************************************************
	case "c_list":
		$mitos_db = new dbHelper();
		
		// check if this already exists
		$sql="SELECT count(*) as howmany FROM list_options WHERE title= '".$_POST['list_name']."' OR option_id = '".strtolower($_POST['option_id'])."'";
		$mitos_db->setSQL($sql);
		$ret = $mitos_db->execStatement(PDO::FETCH_ASSOC);
		if ($ret[0]['howmany']){
			echo '{ success: false, errors: { reason: "'. i18n('This record already exists', 'r') .'" }}';
			return;
		}			
			
		// Get last sequence of the list option
		$sql="SELECT count(seq) as last_seq FROM list_options WHERE list_id = 'lists' ORDER BY title, seq";
		$mitos_db->setSQL($sql);
		$ret = $mitos_db->execStatement(PDO::FETCH_ASSOC);
		$c = $ret[0]['last_seq'] + 1;
		
		// Finally - Insert the list option
		$sql = "INSERT INTO 
					list_options 
				SET 
					list_id='lists',
					option_id='" . strtolower($_POST['option_id']) . "',
					title='" . $_POST['list_name'] . "',
					seq='" . $c . "',
					is_default='0',
					option_value='0',
					mapping='',
					notes=''";
		$mitos_db->setSQL($sql);
		$ret = $mitos_db->execLog();

		if ( $ret == "" ){
			echo '{ success: false, errors: { reason: "'. $ret[2] .'" }}';
		} else {
			echo "{ success: true }";
		}
		return;
	break;
	
	// *************************************************************************************
	// Delete a existent list
	// *************************************************************************************
	case "d_list":
		$mitos_db = new dbHelper();

		$sql = "DELETE FROM list_options WHERE option_id='" . $_POST['option_id'] . "' AND list_id='lists'";
		$mitos_db->setSQL($sql);
		$ret = $mitos_db->execLog();
		
		// Delete the childs of this list
		$sql = "DELETE FROM list_options WHERE list_id='". $_POST['option_id'] ."'";
		$mitos_db->setSQL($sql);
		$ret = $mitos_db->execLog();
		
		// FIXME: When deleting, also delete the childs attached to this primary list.
		// To keep the database healthy.
		if ( $ret == "" ){
			echo '{ success: false, errors: { reason: "'. $ret[2] .'" }}';
		} else {
			echo "{ success: true }";
		}
		return;
	break;
}
?>