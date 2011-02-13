<?php
//--------------------------------------------------------------------------------------------------------------------------
// component_data.ejs.php
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
		$sql = sqlStatement("SELECT 
								option_id, 
								title 
							FROM 
								list_options 
							WHERE 
								list_id = 'lists' 
							ORDER BY 
								title, seq");
		while ($urow = sqlFetchArray($sql)) {
			$count++;
			$buff .= " { option_id: '" . dataDecode( $urow['option_id'] ) . "', full_name: '" . dataDecode( $urow['title'] ) . "' },". chr(13);
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