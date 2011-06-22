<?php

session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once("../../library/dbHelper/dbHelper.inc.php");
include_once("../../library/I18n/I18n.inc.php");
require_once("../../repository/dataExchange/dataExchange.inc.php");

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;

// *************************************************************************************
// Renders the items of the navigation panel
// Default Nav Data
// *************************************************************************************
$buff = "[" . chr(13);

// -------------------------------------
// Dashboard
// -------------------------------------
$buff .= '{ "text":"' . i18n('Dashboard', 'r') . '", "leaf":true, "cls":"file", "hrefTarget":"dashboard/dashboard.ejs.php"},' . chr(13);
$buff .= '{ "text":"' . i18n('Messages', 'r') . '", "leaf":true, "cls":"file", "hrefTarget":"messages/messages.ejs.php"},' . chr(13);
// -------------------------------------
// Patient
// -------------------------------------
$buff .= '{"text":"' . i18n('Patient - TODO', 'r') . '", "cls":"folder", "expanded": true,' . chr(13);
	$buff .= '"children": [' . chr(13); // ^ Folder
	$buff .= '{"text":"' . i18n('New Patient', 'r') . '", "leaf":true, "cls":"file", "hrefTarget":"patient_file/new/new_patient.ejs.php"},' . chr(13);
	$buff .= '{"text":"' . i18n('Patient File - TODO', 'r') . '", "leaf":true, "cls":"file", "hrefTarget":"patient_file/patient_file.ejs.php"},' . chr(13);
	// -------------------------------------
	// Patient
	// -------------------------------------
	$buff .= '{"text":"' . i18n('Visits - TODO', 'r') . '", "cls":"folder", ' . chr(13);
		$buff .= '"children": [' . chr(13); // ^ Folder
		$buff .= '{"text":"' . i18n('Create Visit - TODO', 'r') . '", "leaf":true, "cls":"file", "hrefTarget":"patient_file/visit/create.ejs.php"},' . chr(13);
		$buff .= '{"text":"' . i18n('Current Visit - TODO', 'r') . '", "leaf":true, "cls":"file", "hrefTarget":"patient_file/visit/current.ejs.php"},' . chr(13);
		$buff .= '{"text":"' . i18n('Visit History - TODO', 'r') . '", "leaf":true, "cls":"file", "hrefTarget":"patient_file/visit/history.ejs.php"}' . chr(13);
	$buff .= ']}' . chr(13);
$buff .= ']},' . chr(13);
// -------------------------------------
// Administration
// -------------------------------------
$buff .= '{"text":"' . i18n('Administration', 'r') . '", "cls":"folder", "expanded": true, ' . chr(13);
	$buff .= '"children": [' . chr(13); // ^ Folder
	$buff .= '{"text":"' . i18n('Global Settings', 'r') . '", "leaf":true, "cls":"file", "hrefTarget":"administration/globals/globals.ejs.php"},' . chr(13);
	$buff .= '{"text":"' . i18n('Facilities', 'r') . '", "leaf":true, "cls":"file", "hrefTarget":"administration/facilities/facilities.ejs.php"},' . chr(13);
	$buff .= '{"text":"' . i18n('Users', 'r') . '", "leaf":true, "cls":"file", "hrefTarget":"administration/users/users.ejs.php"},' . chr(13);
	$buff .= '{"text":"' . i18n('Practice', 'r') . '", "leaf":true, "cls":"file", "hrefTarget":"administration/practice/practice.ejs.php"},' . chr(13);
    $buff .= '{"text":"' . i18n('Services', 'r') . '", "leaf":true, "cls":"file", "hrefTarget":"administration/services/services.ejs.php"},' . chr(13);
    $buff .= '{"text":"' . i18n('Roles', 'r') . '", "leaf":true, "cls":"file", "hrefTarget":"administration/roles/roles.ejs.php"},' . chr(13);
	$buff .= '{"text":"' . i18n('Layouts', 'r') . '", "leaf":true, "cls":"file", "hrefTarget":"administration/layout/layout.ejs.php"},' . chr(13);
	$buff .= '{"text":"' . i18n('Lists', 'r') . '", "leaf":true, "cls":"file", "hrefTarget":"administration/lists/lists.ejs.php"},' . chr(13);
    $buff .= '{"text":"' . i18n('Event Log', 'r') . '", "leaf":true, "cls":"file", "hrefTarget":"administration/log/log.ejs.php"}' . chr(13);
$buff .= ']},' . chr(13);
// -------------------------------------
// Administration
// -------------------------------------
$buff .= '{"text":"' . i18n('Miscellaneous', 'r') . '", "cls":"folder", "expanded": true, ' . chr(13);
	$buff .= '"children": [' . chr(13); // ^ Folder
    $buff .= '{"text":"' . i18n('Web Search', 'r') . '", "leaf":true, "cls":"file", "hrefTarget":"miscellaneous/websearch/websearch.ejs.php"},' . chr(13);
	$buff .= '{"text":"' . i18n('Address Book', 'r') . '", "leaf":true, "cls":"file", "hrefTarget":"miscellaneous/addressbook/addressbook.ejs.php"},' . chr(13);
	$buff .= '{"text":"' . i18n('Office Notes', 'r') . '", "leaf":true, "cls":"file", "hrefTarget":"miscellaneous/office_notes/office_notes.ejs.php"},' . chr(13);
	$buff .= '{"text":"' . i18n('My Settings', 'r') . '", "leaf":true, "cls":"file", "hrefTarget":"miscellaneous/my_settings/my_settings.ejs.php"},' . chr(13);
	$buff .= '{"text":"' . i18n('My Account', 'r') . '", "leaf":true, "cls":"file", "hrefTarget":"miscellaneous/my_account/my_account.ejs.php"}' . chr(13);
$buff .= ']},' . chr(13);
// -------------------------------------
// Test Folder
// -------------------------------------
$buff .= '{"text":"' . i18n('Test Area', 'r') . '", "cls":"folder", "expanded": true, ' . chr(13);
	$buff .= '"children": [' . chr(13); // ^ Folder
    $buff .= '{"text":"' . i18n('Calendar Test', 'r') . '", "leaf":true, "cls":"file", "hrefTarget":"calendar_t/calendar.ejs.php"}' . chr(13);

$buff .= ']}' . chr(13);
// *************************************************************************************
// End Nav Data JSON
// *************************************************************************************
$buff .= "]" . chr(13);
echo $buff;
?>