<?php
//--------------------------------------------------------------------------------------------------------------------------
// listOptions.json.php
// 
// This is a json factorer, to deal with the table list_options
// depending on the panel.store.load({params:{filter: lists }}); 
// option passed trough ExtJS v4 dataStore
// it will return the list
//
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

// **************************************************************************************
// filter params passed by ExtJS Data Store
// **************************************************************************************
if(isset($_REQUEST)){$filter = $_REQUEST['filter'];}else{return;}

include_once($_SESSION['site']['root']."/classes/dbHelper.class.php");

// **************************************************************************************
// Reset session count 10 secs = 1 Flop
// **************************************************************************************
$_SESSION['site']['flops'] = 0;

// **************************************************************************************
// Database class instance
// **************************************************************************************
$mitos_db = new dbHelper();

if ($_SESSION['lang']['code'] == "en_US") { // If the selected language is English, do not translate
		$mitos_db->setSQL("SELECT 
								*
							FROM 
								list_options 
							WHERE 
								list_id = '".$filter."' 
							ORDER BY title, seq");
} else {
	// Use and sort by the translated list name.
	$mitos_db->setSQL("SELECT 
							*, 
							IF(LENGTH(ld.definition),ld.definition,lo.title) AS title 
						FROM list_options AS lo 
							LEFT JOIN lang_constants AS lc ON lc.constant_name = lo.title 
							LEFT JOIN lang_definitions AS ld ON ld.cons_id = lc.cons_id AND ld.lang_id = '" . $_SESSION['lang']['code'] . "' 
						WHERE 
							lo.list_id = '".$filter."' 
						ORDER BY 
							IF(LENGTH(ld.definition),ld.definition,lo.title), lo.seq");
}
$total = $mitos_db->rowCount();
$rows = array();
foreach ($mitos_db->execStatement(PDO::FETCH_ASSOC) as $row) {
	array_push($rows, $row);
}
print(json_encode(array('totals'=>$total,'row'=>$rows)));
?>