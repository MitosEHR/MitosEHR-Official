<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File: data.php
 * Date: 10/30/11
 * Time: 10:53 AM
 */
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');
$_SESSION['site']['flops'] = 0;
include_once($_SESSION['site']['root']."/classes/dbHelper.php");

$mitos_db   = new dbHelper();

$rawData    = file_get_contents("php://input");
$foo        = json_decode($rawData, true);
$data       = $foo['row'];

$start      = (!$_REQUEST["start"])? 0 : $_REQUEST["start"];
$limit      = (!$_REQUEST["limit"])? 10 : $_REQUEST["limit"];
$rows       = array();
switch($_SERVER['REQUEST_METHOD']){
    case 'GET':
        switch ($_GET['task']) {
            case "pharmacy":
                //******************************************************************
                // Lets get the pharmacies and address and order by name
                //******************************************************************
                $mitos_db->setSQL("SELECT pharmacies.id AS id,
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
                foreach($mitos_db->execStatement(PDO::FETCH_ASSOC) as $row){
                    $mitos_db->setSQL("SELECT * FROM phone_numbers WHERE phone_numbers.foreign_id =".$row['id']."");
                    foreach ($mitos_db->execStatement(PDO::FETCH_ASSOC) as $phoneRow) {
                        switch ($phoneRow['type']) {
                            case "2":
                                $row['phone_id'] 	        = $phoneRow['id'];
                                $row['phone_country_code'] 	= $phoneRow['country_code'];
                                $row['phone_area_code'] 	= $phoneRow['area_code'];
                                $row['phone_prefix'] 		= $phoneRow['prefix'];
                                $row['phone_number'] 		= $phoneRow['number'];
                                $row['phone_full'] 			= $phoneRow['country_code'].' '.$phoneRow['area_code'].'-'.$phoneRow['prefix'].'-'.$phoneRow['number'];
                                break;
                            case "5":
                                $row['fax_id'] 	            = $phoneRow['id'];
                                $row['fax_country_code'] 	= $phoneRow['country_code'];
                                $row['fax_area_code'] 		= $phoneRow['area_code'];
                                $row['fax_prefix'] 			= $phoneRow['prefix'];
                                $row['fax_number'] 			= $phoneRow['number'];
                                $row['fax_full'] 			= $phoneRow['country_code'].' '.$phoneRow['area_code'].'-'.$phoneRow['prefix'].'-'.$phoneRow['number'];
                                break;
                        }
                    }
                    $row['address_full'] = $row['line1'].' '.$row['line2'].' '.$row['city'].','.$row['state'].' '.$row['zip'].'-'.$row['plus_four'].' '.$row['country'];
                    array_push($rows, $row);
                }
                break;
            case "insurance":
                $mitos_db->setSQL("SELECT insurance_companies.id AS id,
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
                foreach($mitos_db->execStatement(PDO::FETCH_ASSOC) as $row){
                    $mitos_db->setSQL("SELECT * FROM phone_numbers WHERE phone_numbers.foreign_id =".$row['id']."");
                    foreach ($mitos_db->execStatement(PDO::FETCH_ASSOC) as $phoneRow) {
                        switch ($phoneRow['type']) {
                            case "2":
                                $row['phone_id'] 	        = $phoneRow['id'];
                                $row['phone_country_code'] 	= $phoneRow['country_code'];
                                $row['phone_area_code'] 	= $phoneRow['area_code'];
                                $row['phone_prefix'] 		= $phoneRow['prefix'];
                                $row['phone_number'] 		= $phoneRow['number'];
                                $row['phone_full'] 			= $phoneRow['country_code'].' '.$phoneRow['area_code'].'-'.$phoneRow['prefix'].'-'.$phoneRow['number'];
                                break;
                            case "5":
                                $row['fax_id'] 	            = $phoneRow['id'];
                                $row['fax_country_code'] 	= $phoneRow['country_code'];
                                $row['fax_area_code'] 		= $phoneRow['area_code'];
                                $row['fax_prefix'] 			= $phoneRow['prefix'];
                                $row['fax_number'] 			= $phoneRow['number'];
                                $row['fax_full'] 			= $phoneRow['country_code'].' '.$phoneRow['area_code'].'-'.$phoneRow['prefix'].'-'.$phoneRow['number'];
                                break;
                        }
                    }
                    $row['address_full'] = $row['line1'].' '.$row['line2'].' '.$row['city'].','.$row['state'].' '.$row['zip'].'-'.$row['plus_four'].' '.$row['country'];
                    array_push($rows, $row);
                }
                break;
            case "insuranceNumbers":

                break;
            case "x12Partners":

                break;
        }
        print_r(json_encode(array('totals'=>$total,'row'=>$rows)));
        exit;
    case 'POST':
        // *************************************************************************************
        // Get last "id" add 1 and use $new_id to insert the new data
        // *************************************************************************************
        $mitos_db->setSQL("SELECT id FROM pharmacies ORDER BY id DESC");
        $prec = $mitos_db->fetch();
        $mitos_db->setSQL("SELECT id FROM insurance_companies ORDER BY id DESC");
        $irec = $mitos_db->fetch();
        $new_id = max($prec['id'], $irec['id']) +1;
        // *************************************************************************************
        // Validate and pass the POST variables to an array
        // This is the moment to validate the entered values from the user
        // although Sencha EXTJS make good validation, we could check again
        // just in case
        // *************************************************************************************
        switch ($_GET['task']) {
            case "pharmacy":
                $row['id']                      = $new_id;
                $row['name'] 					= $data['name'];
                $row['transmit_method'] 		= $data['transmit_method'];
                $row['email'] 					= $data['email'];

                $sql = $mitos_db->sqlBind($row, "pharmacies", "I");
                break;
            case "insurance":
                $row['id']                      = $new_id;
                $row['name'] 					= $data['name'];
                $row['attn'] 					= $data['attn'];
                $row['cms_id'] 					= $data['cms_id'];
                $row['freeb_type'] 				= $data['freeb_type'];
                $row['x12_receiver_id'] 		= $data['x12_receiver_id'];
                $row['x12_default_partner_id'] 	= $data['x12_default_partner_id'];
                $row['alt_cms_id'] 				= $data['alt_cms_id'];

                $sql = $mitos_db->sqlBind($row, "insurance_companies", "I");
                break;
            case "insuranceNumbers":

                break;
            case "x12Partners":

                break;
        }
        $mitos_db->setSQL($sql);
        $ret = $mitos_db->execLog();

        // *************************************************************************************
        // Lets get the last Inserted ID  and use it to insert the address and phone/fax numbers
        // *************************************************************************************
        $arow['line1'] 			= $data['line1'];
        $arow['line2'] 			= $data['line2'];
        $arow['city'] 			= $data['city'];
        $arow['state'] 			= $data['state'];
        $arow['zip'] 			= $data['zip'];
        $arow['plus_four'] 		= $data['plus_four'];
        $arow['country'] 		= $data['country'];
        $arow['foreign_id'] 	= $new_id;
        
        $prow['country_code'] 	= $data['phone_country_code'];
        $prow['area_code'] 		= $data['phone_area_code'];
        $prow['prefix'] 		= $data['phone_prefix'];
        $prow['number'] 		= $data['phone_number'];
        $prow['type'] 		    = 2;
        $prow['foreign_id'] 	= $new_id;

        $frow['country_code'] 	= $data['fax_country_code'];
        $frow['area_code'] 		= $data['fax_area_code'];
        $frow['prefix'] 		= $data['fax_prefix'];
        $frow['number'] 		= $data['fax_number'];
        $frow['type'] 		    = 5;
        $frow['foreign_id'] 	= $new_id;
        // *************************************************************************************
        // Lets Insert the address for the new pharmacy or insurance
        // *************************************************************************************
        $sql = $mitos_db->sqlBind($arow, "addresses", "I");
        $mitos_db->setSQL($sql);
        $mitos_db->execOnly();
        // *************************************************************************************
        // Lets Insert the phone number for the new pharmacy or insurance
        // *************************************************************************************
        $sql = $mitos_db->sqlBind($prow, "phone_numbers", "I");
        $mitos_db->setSQL($sql);
        $mitos_db->execOnly();
        // *************************************************************************************
        // Lets Insert the Fax number for the new pharmacy or insurance
        // *************************************************************************************
        $sql = $mitos_db->sqlBind($frow, "phone_numbers", "I");
        $mitos_db->setSQL($sql);
        $mitos_db->execOnly();
        if ( $ret[2] ){
            echo '{ success: false, errors: { reason: "'. $ret[2] .'" }}';
        } else {
            echo "{ success: true }";
        }
    exit;
    case 'PUT':
        switch ($_GET['task']) {
            case "pharmacy":
                $row['name'] 					= $data['name'];
                $row['transmit_method'] 		= $data['transmit_method'];
                $row['email'] 					= $data['email'];
                break;
            case "insurance":
                $row['name'] 					= $data['name'];
                $row['attn'] 					= $data['attn'];
                $row['cms_id'] 					= $data['cms_id'];
                $row['freeb_type'] 				= $data['freeb_type'];
                $row['x12_receiver_id'] 		= $data['x12_receiver_id'];
                $row['x12_default_partner_id'] 	= $data['x12_default_partner_id'];
                $row['alt_cms_id'] 				= $data['alt_cms_id'];
                break;
            case "insuranceNumbers":

                break;
            case "x12Partners":

                break;
        }
        $prow['country_code'] 		        = $data['phone_country_code'];
        $prow['area_code'] 		            = $data['phone_area_code'];
        $prow['prefix'] 			        = $data['phone_prefix'];
        $prow['number'] 			        = $data['phone_number'];

        $frow['country_code'] 		        = $data['fax_country_code'];
        $frow['area_code'] 			        = $data['fax_area_code'];
        $frow['prefix'] 				    = $data['fax_prefix'];
        $frow['number'] 				    = $data['fax_number'];

        $arow['line1'] 					    = $data['line1'];
        $arow['line2'] 					    = $data['line2'];
        $arow['city'] 					    = $data['city'];
        $arow['state'] 					    = $data['state'];
        $arow['zip'] 					    = $data['zip'];
        $arow['plus_four'] 				    = $data['plus_four'];
        $arow['country'] 				    = $data['country'];
        // *************************************************************************************
        // Finally that validated POST variables is inserted to the database
        // This one make the JOB of two, if it has an ID key run the UPDATE statement
        // if not run the INSERT statement
        // *************************************************************************************
        switch ($_GET['task']) {
            case 'pharmacy':
                $sql = $mitos_db->sqlBind($row, "pharmacies", "U", "id='" . $data['id'] . "'");
                $mitos_db->setSQL($sql);
                $ret = $mitos_db->execLog();
            break;
            case 'insurance':
                $sql = $mitos_db->sqlBind($row, "insurance_companies", "U", "id='" . $data['id'] . "'");
                $mitos_db->setSQL($sql);
                $ret = $mitos_db->execLog();
            break;
        }
        // *************************************************************************************
        // Lets Insert the address for the new pharmacy or insurance
        // *************************************************************************************
        $sql = $mitos_db->sqlBind($arow, "addresses", "U", "id='" .$data['address_id'] . "'");
        $mitos_db->setSQL($sql);
        $ret = $mitos_db->execLog();

        // *************************************************************************************
        // Lets Insert the phone number for the new pharmacy or insurance
        // *************************************************************************************
        $sql = $mitos_db->sqlBind($prow, "phone_numbers", "U", "id='" . $data['phone_id'] . "'");
        $mitos_db->setSQL($sql);
        $ret = $mitos_db->execLog();

        // *************************************************************************************
        // Lets Insert the Fax number for the new pharmacy or insurance
        // *************************************************************************************
        $sql = $mitos_db->sqlBind($frow, "phone_numbers", "U", "id='" . $data['fax_id'] . "'");
        $mitos_db->setSQL($sql);
        $ret = $mitos_db->execLog();

        if ( $ret[2] ){
            echo '{ success: false, errors: { reason: "'. $ret[2] .'" }}';
        } else {
            echo "{ success: true }";
        }
        exit;
        exit;
    case 'DELETE':
        $delete_id = $data['id'];
        switch ($_GET['task']) {
            case "pharmacy":
                $sql = "DELETE FROM pharmacies WHERE id='$delete_id' ";
                break;
            case "insurance":
                $sql = "DELETE FROM insurance_companies WHERE id='$delete_id'";
                break;
            case "insuranceNumbers":

                break;
            case "x12Partners":

                break;
        }
        $mitos_db->setSQL($sql);
        $ret = $mitos_db->execLog();
        if ( $ret[2] ){
            echo '{ success: false, errors: { reason: "'. $ret[2] .'" }}';
        } else {
            echo "{ success: true }";
        }
        // *************************************************************************************
        // delete related address and phone/fax numbers
        // *************************************************************************************
        $mitos_db->setSQL("DELETE FROM addresses WHERE foreign_id='" . $delete_id . "'");
        $mitos_db->execOnly();
        $mitos_db->setSQL("DELETE FROM phone_numbers WHERE foreign_id='" . $delete_id . "'");
        $mitos_db->execOnly();
    exit;
}
 
