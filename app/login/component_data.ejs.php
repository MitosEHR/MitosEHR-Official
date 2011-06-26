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

// Count records variable
$count = 0;
$buff = '';
// *************************************************************************************
// Deside what to do with the $_GET['task']
// *************************************************************************************
switch ($_GET['task']) {

	// *************************************************************************************
	// Data for storeSites
	// *************************************************************************************
	case "sites":
		foreach ($_SESSION['site']['sites'] as $urow) {
			$buff .= ' { "site_id": "' . $urow . '", "site": "' . $urow . '" },'. chr(13);
			$count++;
		}
		$buff = substr($buff, 0, -2); // Delete the last comma and clear the buff.
		echo '{';
		echo '"results": ' . $count . ', ' . chr(13);
		echo '"row": [' . chr(13);
		echo $buff;
		echo ']}' . chr(13);
	break;
	
}

?>