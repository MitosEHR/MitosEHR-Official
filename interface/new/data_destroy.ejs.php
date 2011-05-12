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

session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once("library/dbHelper/dbHelper.inc.php");
include_once("library/I18n/I18n.inc.php");
require_once("repository/dataExchange/dataExchange.inc.php");

require_once("$srcdir/pnotes.inc.php");
require_once("$srcdir/patient.inc.php");
require_once("$srcdir/acl.inc.php");
require_once("$srcdir/log.inc.php");
require_once("$srcdir/options.inc.php");
require_once("$srcdir/formdata.inc.php");
require_once("$srcdir/classes/Document.class.php");
require_once("$srcdir/gprelations.inc.php");
require_once("$srcdir/formatting.inc.php");

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;

// Count records variable
$count = 0;

// *************************************************************************************
// Flag the message to delete
// *************************************************************************************

$data = json_decode ( $_POST['row'] );
$delete_id = $data[0];
deletePnote($delete_id);
newEvent("delete", $_SESSION['authUser'], $_SESSION['authProvider'], 1, "pnotes: id ".$delete_id);

?>