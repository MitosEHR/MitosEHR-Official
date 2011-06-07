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
//---------------------------------------------------------------------------------------
// start the array
//---------------------------------------------------------------------------------------
$rows = array();
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
		
		foreach($mitos_db->execStatement() as $row){
			$mitos_db->setSQL("SELECT * FROM phone_numbers WHERE phone_numbers.foreign_id =".$row['id']."");
			foreach ($mitos_db->execStatement() as $phoneRow) {
				switch ($phoneRow['type']) {
					case "2":
						$row['phone_country_code'] 	= $phoneRow['country_code'];
						$row['phone_prefix'] 		= $phoneRow['country_code'];
						$row['phone_number'] 		= $phoneRow['country_code'];
						$row['phone_foreign_id'] 	= $phoneRow['country_code'];
						$row['phone_country_code'] 	= $phoneRow['country_code'];
						$row['phone_full'] 			= $phoneRow['country_code'].' '.$phoneRow['area_code'].'-'.$phoneRow['prefix'].'-'.$phoneRow['number'];
						
					break;
					case "5":
						$row['fax_country_code'] 	= $phoneRow['country_code'];
						$row['fax_prefix'] 			= $phoneRow['country_code'];
						$row['fax_number'] 			= $phoneRow['country_code'];
						$row['fax_foreign_id'] 		= $phoneRow['country_code'];
						$row['fax_country_code'] 	= $phoneRow['country_code'];
						$row['fax_full'] 			= $phoneRow['country_code'].' '.$phoneRow['area_code'].'-'.$phoneRow['prefix'].'-'.$phoneRow['number'];
					break;
				}	
			}
			$row['address_full'] = $row['line1'].' '.$row['line2'].' '.$row['city'].','.$row['state'].' '.$row['zip'].'-'.$row['plus_four'].' '.$row['country'];
			array_push($rows, $row);
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
		
		foreach($mitos_db->execStatement() as $row){
			$mitos_db->setSQL("SELECT * FROM phone_numbers WHERE phone_numbers.foreign_id =".$row['id']."");
			foreach ($mitos_db->execStatement() as $phoneRow) {
				switch ($phoneRow['type']) {
					case "2":
						$row['phone_country_code'] 	= $phoneRow['country_code'];
						$row['phone_prefix'] 		= $phoneRow['country_code'];
						$row['phone_number'] 		= $phoneRow['country_code'];
						$row['phone_foreign_id'] 	= $phoneRow['country_code'];
						$row['phone_country_code'] 	= $phoneRow['country_code'];
						$row['phone_full'] 			= $phoneRow['country_code'].' '.$phoneRow['area_code'].'-'.$phoneRow['prefix'].'-'.$phoneRow['number'];
						
					break;
					case "5":
						$row['fax_country_code'] 	= $phoneRow['country_code'];
						$row['fax_prefix'] 			= $phoneRow['country_code'];
						$row['fax_number'] 			= $phoneRow['country_code'];
						$row['fax_foreign_id'] 		= $phoneRow['country_code'];
						$row['fax_country_code'] 	= $phoneRow['country_code'];
						$row['fax_full'] 			= $phoneRow['country_code'].' '.$phoneRow['area_code'].'-'.$phoneRow['prefix'].'-'.$phoneRow['number'];
					break;
				}	
			}
			$row['address_full'] = $row['line1'].' '.$row['line2'].' '.$row['city'].','.$row['state'].' '.$row['zip'].'-'.$row['plus_four'].' '.$row['country'];
			array_push($rows, $row);
		}
	break;
}
print_r(json_encode(array('totals'=>$total,'row'=>$rows)));	

?>
