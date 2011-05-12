<?php
//--------------------------------------------------------------------------------------------------------------------------
// data_read.ejs.php / Permissions List with values for role
// v0.0.1
// Under GPLv3 License
// Integrated by: Ernesto Rodriguez
// Remember, this file is called via the Framework Store, this is the AJAX thing.
//--------------------------------------------------------------------------------------------------------------------------
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once("../../../library/dbHelper/dbHelper.inc.php");
include_once("../../../library/I18n/I18n.inc.php");
require_once("../../../repository/dataExchange/dataExchange.inc.php");

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;

//------------------------------------------
// Database class instance
//------------------------------------------
$mitos_db = new dbHelper();

$start = ($_REQUEST["start"] == null)? 0 : $_REQUEST["start"];
$count = ($_REQUEST["limit"] == null)? 10 : $_REQUEST["limit"];
$buff = "";
switch ($_GET['task']) {
	//**********************************************************************
	// SQL for parmacies, pharmacy address, and phone numbers
	//**********************************************************************
	case "pharmacy":
		//******************************************************************
		// Lets get the pharmacies and address and order by name
		//******************************************************************
		$mitos_db->setSQL("SELECT pharmacies.id, 
								  pharmacies.name,
								  pharmacies.transmit_method,
								  pharmacies.email,
								  addresses.id AS address_id,
								  addresses.line1,
								  addresses.line2,
								  addresses.city,
								  addresses.state,
								  addresses.zip,
								  addresses.plus_four,
								  addresses.country,
								  addresses.foreign_id AS address_foreign_id
			  				 FROM pharmacies
	  					LEFT JOIN addresses ON pharmacies.id = addresses.foreign_id
	  		 			 ORDER BY pharmacies.name DESC");
		$total = $mitos_db->rowCount();
		foreach ($mitos_db->execStatement() as $urow) {
			$buff .= '{';
			$buff .= '"id":"' 					. $urow['id'] . '",';
			$buff .= '"name":"' 				. $urow['name'] . '",';
			$buff .= '"transmit_method":"' 		. $urow['transmit_method'] . '",';
			$buff .= '"email":"' 				. $urow['email'] . '",';
			//***************************************************************
			// Now lets get phone all the numbers and identified them by type
			//***************************************************************
			$mitos_db->setSQL("SELECT * FROM phone_numbers WHERE phone_numbers.foreign_id =".$urow['id']."");
			foreach ($mitos_db->execStatement() as $phoneRow) {
				switch ($phoneRow['type']) {
					case "2":
						$buff .= '"phone_country_code":"' 	. $phoneRow['country_code'] . '",';
						$buff .= '"phone_area_code":"' 		. $phoneRow['area_code'] . '",';
						$buff .= '"phone_prefix":"' 		. $phoneRow['prefix'] . '",';
						$buff .= '"phone_number":"' 		. $phoneRow['number'] . '",';
						$buff .= '"phone_foreign_id":"' 	. $phoneRow['foreign_id'] . '",';
						$buff .= '"phone_full":"' 			. $phoneRow['country_code'].' '.$phoneRow['area_code'].'-'.$phoneRow['prefix'].'-'.$phoneRow['number'].'",';
						
					break;
					case "5":
						$buff .= '"fax_country_code":"' 	. $phoneRow['country_code'] . '",';
						$buff .= '"fax_area_code":"' 		. $phoneRow['area_code'] . '",';
						$buff .= '"fax_prefix":"' 			. $phoneRow['prefix'] . '",';
						$buff .= '"fax_number":"' 			. $phoneRow['number'] . '",';
						$buff .= '"fax_foreign_id":"' 		. $phoneRow['foreign_id'] . '",';
						$buff .= '"fax_full":"' 			. $phoneRow['country_code'].' '.$phoneRow['area_code'].'-'.$phoneRow['prefix'].'-'.$phoneRow['number'].'",';
					break;
				}
			}
			$buff .= '"address_id":"' 				. $urow['address_id'] . '",';
			$buff .= '"line1":"' 					. $urow['line1'] . '",';
			$buff .= '"line2":"' 					. $urow['line2'] . '",';
			$buff .= '"city":"' 					. $urow['city'] . '",';
			$buff .= '"state":"' 					. $urow['state'] . '",';
			$buff .= '"zip":"' 						. $urow['zip'] . '",';
			$buff .= '"plus_four":"' 				. $urow['plus_four'] . '",';
			$buff .= '"country":"' 					. $urow['country'] . '",';
			$buff .= '"address_foreign_id":"' 		. $urow['address_foreign_id'] . '",';
			$buff .= '"address_full":"' 			. $urow['line1'].' '.$urow['line2'].' '.$urow['city'].','.$urow['state'].' '.$urow['zip'].'-'.$urow['plus_four'].' '.$urow['country']. '"},'.chr(13);
		}
	break;
	//**********************************************************************
	// SQL for insurances co., insurances co. address, and phone numbers
	//**********************************************************************
	case "insurance":
		//******************************************************************
		// Lets get the pharmacies and address and order by name
		//******************************************************************
		$mitos_db->setSQL("SELECT insurance_companies.id, 
								  insurance_companies.name,
								  insurance_companies.attn,
								  insurance_companies.cms_id,
								  insurance_companies.freeb_type,
								  insurance_companies.x12_receiver_id,
								  insurance_companies.x12_default_partner_id,
								  insurance_companies.alt_cms_id,
								  addresses.id AS address_id,
								  addresses.line1,
								  addresses.line2,
								  addresses.city,
								  addresses.state,
								  addresses.zip,
								  addresses.plus_four,
								  addresses.country,
								  addresses.foreign_id AS address_foreign_id
			  				 FROM insurance_companies
	  					LEFT JOIN addresses ON insurance_companies.id = addresses.foreign_id
	  		 			 ORDER BY insurance_companies.name DESC");
		$total = $mitos_db->rowCount();
		foreach ($mitos_db->execStatement() as $urow) {
			$buff .= '{';
			$buff .= '"id":"' 						. $urow['id'] . '",';
			$buff .= '"name":"' 					. $urow['name'] . '",';
			$buff .= '"attn":"' 					. $urow['attn'] . '",';
			$buff .= '"cms_id":"' 					. $urow['cms_id'] . '",';
			$buff .= '"freeb_type":"' 				. $urow['freeb_type'] . '",';
			$buff .= '"x12_receiver_id":"' 			. $urow['x12_receiver_id'] . '",';
			$buff .= '"x12_default_partner_id":"' 	. $urow['x12_default_partner_id'] . '",';
			$buff .= '"alt_cms_id":"' 				. $urow['alt_cms_id'] . '",';	
			//***************************************************************
			// Now lets get phone all the numbers and identified them by type
			//***************************************************************
			$mitos_db->setSQL("SELECT * FROM phone_numbers WHERE phone_numbers.foreign_id =".$urow['id']."");
			foreach ($mitos_db->execStatement() as $phoneRow) {
				switch ($phoneRow['type']) {
					case "2":
						$buff .= '"phone_country_code":"' 	. $phoneRow['country_code'] . '",';
						$buff .= '"phone_area_code":"' 		. $phoneRow['area_code'] . '",';
						$buff .= '"phone_prefix":"' 		. $phoneRow['prefix'] . '",';
						$buff .= '"phone_number":"' 		. $phoneRow['number'] . '",';
						$buff .= '"phone_foreign_id":"' 	. $phoneRow['foreign_id'] . '",';
						$buff .= '"phone_full":"' 			. $phoneRow['country_code'].' '.$phoneRow['area_code'].'-'.$phoneRow['prefix'].'-'.$phoneRow['number'].'",';
						
					break;
					case "5":
						$buff .= '"fax_country_code":"' 	. $phoneRow['country_code'] . '",';
						$buff .= '"fax_area_code":"' 		. $phoneRow['area_code'] . '",';
						$buff .= '"fax_prefix":"' 			. $phoneRow['prefix'] . '",';
						$buff .= '"fax_number":"' 			. $phoneRow['number'] . '",';
						$buff .= '"fax_foreign_id":"' 		. $phoneRow['foreign_id'] . '",';
						$buff .= '"fax_full":"' 			. $phoneRow['country_code'].' '.$phoneRow['area_code'].'-'.$phoneRow['prefix'].'-'.$phoneRow['number'].'",';
					break;
				}
			}
			$buff .= '"address_id":"' 				. $urow['address_id'] . '",';
			$buff .= '"line1":"' 					. $urow['line1'] . '",';
			$buff .= '"line2":"' 					. $urow['line2'] . '",';
			$buff .= '"city":"' 					. $urow['city'] . '",';
			$buff .= '"state":"' 					. $urow['state'] . '",';
			$buff .= '"zip":"' 						. $urow['zip'] . '",';
			$buff .= '"plus_four":"' 				. $urow['plus_four'] . '",';
			$buff .= '"country":"' 					. $urow['country'] . '",';
			$buff .= '"address_foreign_id":"' 		. $urow['address_foreign_id'] . '",';
			$buff .= '"address_full":"' 			. $urow['line1'].' '.$urow['line2'].' '.$urow['city'].','.$urow['state'].' '.$urow['zip'].'-'.$urow['plus_four'].' '.$urow['country']. '"},'.chr(13);
		}
	break;
}

$buff = substr($buff, 0, -2); // Delete the last comma.
echo '{';
echo '"totals": "' . $total . '", ' . chr(13);
echo '"row": [' . chr(13);
echo $buff;
echo ']}' . chr(13);
?>