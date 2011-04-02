<?php

session_name ( "MitosEHR" );
session_start();

include_once("../../library/dbHelper/dbHelper.inc.php");
include_once("../../library/I18n/I18n.inc.php");
require_once("../../repository/dataExchange/dataExchange.inc.php");

// *************************************************************************************
// Renders the items of the navigation panel
// Default Nav Data
// *************************************************************************************
$buff .= "[" . chr(13);

// -------------------------------------
// Dashboard
// -------------------------------------
$buff .= '{ "text":"' . i18n('Dashboard', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"dashboard/dashboard.ejs.php"},' . chr(13);


// -------------------------------------
// Calendar Item (Non-Athletic Clinic)
// -------------------------------------
//$buff .= '{ "text":"' . i18n('Calendar', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"calendar/calendar.ejs.php"},' . chr(13);

// -------------------------------
// Messages Item
// -------------------------------
//$buff .= '{ "text":"' . i18n('Messages', 'r') . '", "pos":"bot", "leaf":true, "cls":"file", "id":"messages/messages.ejs.php"},' . chr(13);


// *************************************************************************************
// End Nav Data JSON
// *************************************************************************************
$buff .= "]" . chr(13);

echo $buff;

?>