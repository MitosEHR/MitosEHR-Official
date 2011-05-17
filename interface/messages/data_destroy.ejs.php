<?php
//--------------------------------------------------------------------------------------------------------------------------
// manage_messages.ejs.php
// v0.0.1
// Under GPLv3 License
//
// Integration Sencha ExtJS Framework
//
// Integrated by: IdeasGroup Inc. in 2010
//
// OpenEMR is a free medical practice management, electronic medical records, prescription writing,
// and medical billing application. These programs are also referred to as electronic health records.
// OpenEMR is licensed under the General Gnu Public License (General GPL). It is a free open source replacement
// for medical applications such as Medical Manager, Health Pro, and Misys. It features support for EDI billing
// to clearing houses such as Availity, MD-Online, MedAvant and ZirMED using ANSI X12.
//
// Sencha ExtJS
// Ext JS is a cross-browser JavaScript library for building rich internet applications. Build rich,
// sustainable web applications faster than ever. It includes:
// * High performance, customizable UI widgets
// * Well designed and extensible Component model
// * An intuitive, easy to use API
// * Commercial and Open Source licenses available
//
// Remember, this file is called via the Framework Store, this is the AJAX thing.
//--------------------------------------------------------------------------------------------------------------------------

session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;

include_once($_SESSION['site']['root']."/library/dbHelper/dbHelper.inc.php");
include_once($_SESSION['site']['root']."/library/I18n/I18n.inc.php");
require_once($_SESSION['site']['root']."/repository/dataExchange/dataExchange.inc.php");

//------------------------------------------
// Database class instance
//------------------------------------------
$mitos_db = new dbHelper();

// *************************************************************************************
// Flag the message to delete
// *************************************************************************************
$data = json_decode ( $_POST['row'] );
$sql = "UPDATE 
			pnotes
		SET
			deleted = '1' " . "
		WHERE
			id='". $data[0]->id ."'";

$mitos_db->setSQL($sql);
$ret = $mitos_db->execLog();

if ( $ret[2] ){
	echo '{ success: false, errors: { reason: "'. $ret[2] .'" }}';
} else {
	echo "{ success: true }";
}

?>