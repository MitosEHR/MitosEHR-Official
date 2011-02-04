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

// *************************************************************************************
//SANITIZE ALL ESCAPES
// *************************************************************************************
$sanitize_all_escapes=true;

// *************************************************************************************
//STOP FAKE REGISTER GLOBALS
// *************************************************************************************
$fake_register_globals=false;

// *************************************************************************************
// Load the OpenEMR Libraries
// *************************************************************************************
require_once("../registry.php");
require_once("$srcdir/pnotes.inc.php");
require_once("$srcdir/patient.inc.php");
require_once("$srcdir/acl.inc.php");
require_once("$srcdir/log.inc.php");
require_once("$srcdir/options.inc.php");
require_once("$srcdir/formdata.inc.php");
require_once("$srcdir/classes/Document.class.php");
require_once("$srcdir/gprelations.inc.php");
require_once("$srcdir/formatting.inc.php");

// Count records variable
$count = 0;

// *************************************************************************************
// Update the message record
// *************************************************************************************
$data = json_decode ( $_POST['row'] );
updatePnoteMessageStatus($data[0]->noteid, $data[0]->status);
updatePnote($data[0]->noteid, // Internal OpenEMR Function
			$data[0]->body,
			$data[0]->type,
			$data[0]->user,
			$data[0]->status);

?>