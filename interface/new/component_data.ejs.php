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

session_name ( "MitosEHR" );
session_start();

include_once("library/dbHelper/dbHelper.inc.php");
include_once("library/I18n/I18n.inc.php");
require_once("repository/dataExchange/dataExchange.inc.php");

// Count records variable
$count = 0;

// *************************************************************************************
// Deside what to do with the $_GET['task']
// *************************************************************************************
switch ($_GET['task']) {

	// *************************************************************************************
	// Data for for cmbSex
	// *************************************************************************************
	case "sex":
		$sql = "SELECT
					*
				FROM
					list_options
				WHERE
					list_id = 'sex'
				ORDER BY
					seq, title";
		$result = sqlStatement($sql);
		$buff .= " { option_id: 'unassigned', title: 'Unassigned' },". chr(13);
		while($row = sqlFetchArray($result)){
			$count++;
			$buff .= " { option_id: '" . htmlspecialchars( $row{'option_id'}, ENT_QUOTES) . "', title: '" . htmlspecialchars( $row{'title'}, ENT_NOQUOTES) . "' },". chr(13);
		}
		$buff = substr($buff, 0, -2); // Delete the last comma and clear the buff.
		echo $_GET['callback'] . '({';
		echo "results: " . $count . ", " . chr(13);
		echo "row: [" . chr(13);
		echo $buff;
		echo "]})" . chr(13);
	break;
	
	// *************************************************************************************
	// Data for for cmbMarital
	// *************************************************************************************
	case "marital":
		$sql = "SELECT
					*
				FROM
					list_options
				WHERE
					list_id = 'marital'
				ORDER BY
					seq, title";
		$result = sqlStatement($sql);
		$buff .= " { option_id: 'unassigned', title: 'Unassigned' },". chr(13);
		while($row = sqlFetchArray($result)){
			$count++;
			$buff .= " { option_id: '" . htmlspecialchars( $row{'option_id'}, ENT_QUOTES) . "', title: '" . htmlspecialchars( $row{'title'}, ENT_NOQUOTES) . "' },". chr(13);
		}
		$buff = substr($buff, 0, -2); // Delete the last comma and clear the buff.
		echo $_GET['callback'] . '({';
		echo "results: " . $count . ", " . chr(13);
		echo "row: [" . chr(13);
		echo $buff;
		echo "]})" . chr(13);
	break;
	
	// *************************************************************************************
	// Data for for cmbState
	// *************************************************************************************
	case "state":
		$sql = "SELECT
					*
				FROM
					list_options
				WHERE
					list_id = 'state'
				ORDER BY
					seq, title";
		$result = sqlStatement($sql);
		$buff .= " { option_id: 'unassigned', title: 'Unassigned' },". chr(13);
		while($row = sqlFetchArray($result)){
			$count++;
			$buff .= " { option_id: '" . htmlspecialchars( $row{'option_id'}, ENT_QUOTES) . "', title: '" . htmlspecialchars( $row{'title'}, ENT_NOQUOTES) . "' },". chr(13);
		}
		$buff = substr($buff, 0, -2); // Delete the last comma and clear the buff.
		echo $_GET['callback'] . '({';
		echo "results: " . $count . ", " . chr(13);
		echo "row: [" . chr(13);
		echo $buff;
		echo "]})" . chr(13);
	break;
	
	// *************************************************************************************
	// Data for for cmbCountry
	// *************************************************************************************
	case "country":
		$sql = "SELECT
					*
				FROM
					list_options
				WHERE
					list_id = 'country'
				ORDER BY
					seq, title";
		$result = sqlStatement($sql);
		$buff .= " { option_id: 'unassigned', title: 'Unassigned' },". chr(13);
		while($row = sqlFetchArray($result)){
			$count++;
			$buff .= " { option_id: '" . htmlspecialchars( $row{'option_id'}, ENT_QUOTES) . "', title: '" . htmlspecialchars( $row{'title'}, ENT_NOQUOTES) . "' },". chr(13);
		}
		$buff = substr($buff, 0, -2); // Delete the last comma and clear the buff.
		echo $_GET['callback'] . '({';
		echo "results: " . $count . ", " . chr(13);
		echo "row: [" . chr(13);
		echo $buff;
		echo "]})" . chr(13);
	break;
	
	// *************************************************************************************
	// Pull users from the database
	// *************************************************************************************
	case "users":
		$sql = sqlStatement("SELECT
							 	username,
								fname,
								lname
							FROM
								users
							WHERE
								username != '' AND active = 1 AND ( info IS NULL OR info NOT LIKE '%Inactive%' )
							ORDER BY
								lname,
								fname");
		while ($urow = sqlFetchArray($sql)) {
			$count++;
			// Merge firstname with lastname
			if ($urow['fname']){
				$username = $urow['fname'] . ", " . $urow['lname'];
			} else {
				$username = $urow['lname'];
			}
			$buff .= " { user: '" . htmlspecialchars( $urow['username'], ENT_NOQUOTES) . "', full_name: '" . $username . "' },". chr(13);
		}
		$buff = substr($buff, 0, -2); // Delete the last comma and clear the buff.
		echo $_GET['callback'] . '({';
		echo "results: " . $count . ", " . chr(13);
		echo "row: [" . chr(13);
		echo $buff;
		echo "]})" . chr(13);
	break;

	// *************************************************************************************
	// Pull Relationship from the database
	// *************************************************************************************
	case "relationship":
		$sql = "SELECT
					*
				FROM
					list_options
				WHERE
					list_id = 'sub_relation'
				ORDER BY
					seq, title";
		$result = sqlStatement($sql);
		$buff .= " { option_id: 'unassigned', title: 'Unassigned' },". chr(13);
		while($row = sqlFetchArray($result)){
			$count++;
			$buff .= " { option_id: '" . htmlspecialchars( $row{'option_id'}, ENT_QUOTES) . "', title: '" . htmlspecialchars( $row{'title'}, ENT_NOQUOTES) . "' },". chr(13);
		}
		$buff = substr($buff, 0, -2); // Delete the last comma and clear the buff.
		echo $_GET['callback'] . '({';
		echo "results: " . $count . ", " . chr(13);
		echo "row: [" . chr(13);
		echo $buff;
		echo "]})" . chr(13);
	break;
	
	// *************************************************************************************
	// Pull Relationship from the database
	// *************************************************************************************
	case "yesno":
		$sql = "SELECT
					*
				FROM
					list_options
				WHERE
					list_id = 'yesno'
				ORDER BY
					seq, title";
		$result = sqlStatement($sql);
		$buff .= " { option_id: 'unassigned', title: 'Unassigned' },". chr(13);
		while($row = sqlFetchArray($result)){
			$count++;
			$buff .= " { option_id: '" . htmlspecialchars( $row{'option_id'}, ENT_QUOTES) . "', title: '" . htmlspecialchars( $row{'title'}, ENT_NOQUOTES) . "' },". chr(13);
		}
		$buff = substr($buff, 0, -2); // Delete the last comma and clear the buff.
		echo $_GET['callback'] . '({';
		echo "results: " . $count . ", " . chr(13);
		echo "row: [" . chr(13);
		echo $buff;
		echo "]})" . chr(13);
	break;
	
	// *************************************************************************************
	// Pull Ethnicity from the database
	// *************************************************************************************
	case "ethnicity":
		$sql = "SELECT
					*
				FROM
					list_options
				WHERE
					list_id = 'ethrace'
				ORDER BY
					seq, title";
		$result = sqlStatement($sql);
		$buff .= " { option_id: 'unassigned', title: 'Unassigned' },". chr(13);
		while($row = sqlFetchArray($result)){
			$count++;
			$buff .= " { option_id: '" . htmlspecialchars( $row{'option_id'}, ENT_QUOTES) . "', title: '" . htmlspecialchars( $row{'title'}, ENT_NOQUOTES) . "' },". chr(13);
		}
		$buff = substr($buff, 0, -2); // Delete the last comma and clear the buff.
		echo $_GET['callback'] . '({';
		echo "results: " . $count . ", " . chr(13);
		echo "row: [" . chr(13);
		echo $buff;
		echo "]})" . chr(13);
	break;
	
	// *************************************************************************************
	// Pull Language from the database
	// *************************************************************************************
	case "language":
		$sql = "SELECT
					*
				FROM
					list_options
				WHERE
					list_id = 'language'
				ORDER BY
					seq, title";
		$result = sqlStatement($sql);
		$buff .= " { option_id: 'unassigned', title: 'Unassigned' },". chr(13);
		while($row = sqlFetchArray($result)){
			$count++;
			$buff .= " { option_id: '" . htmlspecialchars( $row{'option_id'}, ENT_QUOTES) . "', title: '" . htmlspecialchars( $row{'title'}, ENT_NOQUOTES) . "' },". chr(13);
		}
		$buff = substr($buff, 0, -2); // Delete the last comma and clear the buff.
		echo $_GET['callback'] . '({';
		echo "results: " . $count . ", " . chr(13);
		echo "row: [" . chr(13);
		echo $buff;
		echo "]})" . chr(13);
	break;
	
	// *************************************************************************************
	// Pull Race from the database
	// *************************************************************************************
	case "race":
		$sql = "SELECT
					*
				FROM
					list_options
				WHERE
					list_id = 'race'
				ORDER BY
					seq, title";
		$result = sqlStatement($sql);
		$buff .= " { option_id: 'unassigned', title: 'Unassigned' },". chr(13);
		while($row = sqlFetchArray($result)){
			$count++;
			$buff .= " { option_id: '" . htmlspecialchars( $row{'option_id'}, ENT_QUOTES) . "', title: '" . htmlspecialchars( $row{'title'}, ENT_NOQUOTES) . "' },". chr(13);
		}
		$buff = substr($buff, 0, -2); // Delete the last comma and clear the buff.
		echo $_GET['callback'] . '({';
		echo "results: " . $count . ", " . chr(13);
		echo "row: [" . chr(13);
		echo $buff;
		echo "]})" . chr(13);
	break;
	
	// *************************************************************************************
	// Pull Referral Source from the database
	// *************************************************************************************
	case "refsource":
		$sql = "SELECT
					*
				FROM
					list_options
				WHERE
					list_id = 'refsource'
				ORDER BY
					seq, title";
		$result = sqlStatement($sql);
		$buff .= " { option_id: 'unassigned', title: 'Unassigned' },". chr(13);
		while($row = sqlFetchArray($result)){
			$count++;
			$buff .= " { option_id: '" . htmlspecialchars( $row{'option_id'}, ENT_QUOTES) . "', title: '" . htmlspecialchars( $row{'title'}, ENT_NOQUOTES) . "' },". chr(13);
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