<?php

session_name ( "MitosEHR" );
session_start();

include_once("../../library/dbHelper/dbHelper.inc.php");
include_once("../../library/I18n/I18n.inc.php");
require_once("../../repository/dataExchange/dataExchange.inc.php");

// *************************************************************************************
// Renders the items of the navigation panel
// Non-Athletic Clinic
// *************************************************************************************
$buff .= "[" . chr(13);

// -------------------------------------
// Calendar Item (Non-Athletic Clinic)
// -------------------------------------
$buff .= '{ "text":"' . i18n('Calendar', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"calendar/calendar.ejs.php"},' . chr(13);

// -------------------------------
// Messages Item
// -------------------------------
$buff .= '{ "text":"' . i18n('Messages', 'r') . '", "pos":"bot", "leaf":true, "cls":"file", "id":"messages/messages.ejs.php"},' . chr(13);

// -------------------------------
// Patient/Client Folder
// -------------------------------
$buff .= '{ "text":"' . i18n('Patient/Client', 'r') . '", "cls":"folder", ' . chr(13);
$buff .= '	children: [' . chr(13); // ^ Folder
$buff .= '		{ "text":"' . i18n('New/Search', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"new/new.ejs.php"},' . chr(13);
$buff .= '		{ "text":"' . i18n('Summary', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"patient_file/summary/demographics.ejs.php"},' . chr(13);
$buff .= '		]},' . chr(13);

// -------------------------------
// Patient/Client->Visits Folder
// -------------------------------
$buff .= '	{ "text":"' . i18n('Visits', 'r') . '", "cls":"folder", ' . chr(13);
$buff .= '		children: [' . chr(13); // ^ Folder
$buff .= '			{ "text":"' . i18n('Create Visit', 'r') . '", "pos":"bot", "leaf":true, "cls":"file", "id":""},' . chr(13);
$buff .= '			{ "text":"' . i18n('Current', 'r') . '", "pos":"bot", "leaf":true, "cls":"file", "id":""},' . chr(13);
$buff .= '			{ "text":"' . i18n('Visit History', 'r') . '", "pos":"bot", "leaf":true, "cls":"file", "id":""}' . chr(13);
$buff .= '		]},' . chr(13);

// -------------------------------
// Patient/Client->Visit Forms Folder
// -------------------------------

// -------------------------------
// Fees Folder
// -------------------------------
$buff .= '{ "text":"' . i18n('Fees', 'r') . '", "cls":"folder", ' . chr(13);
$buff .= '		children: [' . chr(13); // ^ Folder
$buff .= '			{"text":"' . i18n('Fee Sheet', 'r') . '", "pos":"bot", "leaf":true, "cls":"file", "id":""},' . chr(13);
$buff .= '			{"text":"' . i18n('Charges', 'r') . '", "pos":"bot", "leaf":true, "cls":"file", "id":""},' . chr(13);
$buff .= '			{"text":"' . i18n('Checkout', 'r') . '", "pos":"bot", "leaf":true, "cls":"file", "id":""},' . chr(13);
$buff .= '			{"text":"' . i18n('Billing', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""}' . chr(13);
$buff .= '		]},' . chr(13);

// -------------------------------
// Inventory Folder
// -------------------------------
$buff .= '{ "text":"' . i18n('Inventory', 'r') . '", "cls":"folder", ' . chr(13);
$buff .= '		children: [' . chr(13); // ^ Folder
$buff .= '			{"text":"' . i18n('Management', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},' . chr(13);
$buff .= '			{"text":"' . i18n('Destroyed', 'r') . '", "pos":"pop", "leaf":true, "cls":"file", "id":""}' . chr(13);
$buff .= '		]},' . chr(13);

// -------------------------------
// Procedures Folder
// -------------------------------
$buff .= '{ "text":"' . i18n('Procedures', 'r') . '", "cls":"folder", ' . chr(13);
$buff .= '		children: [' . chr(13); // ^ Folder
$buff .= '			{"text":"' . i18n('Configuration', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '			{"text":"' . i18n('Pending Review', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '			{"text":"' . i18n('Patient Results', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '			{"text":"' . i18n('Batch Results', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""}'.chr(13);
$buff .= '		]},' . chr(13);

// -------------------------------
// Administration Folder
// -------------------------------
$buff .= '{ "text":"' . i18n('Administration', 'r') . '", "cls":"folder", ' . chr(13);
$buff .= '		children: [' . chr(13); // ^ Folder
$buff .= '			{"text":"' . i18n('Globals', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '			{"text":"' . i18n('Facilities', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"administration/facilities/facilities.ejs.php"},'.chr(13);
$buff .= '			{"text":"' . i18n('Users', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"administration/users/users.ejs.php"},'.chr(13);
$buff .= '			{"text":"' . i18n('Practice', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '			{"text":"' . i18n('Services', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '			{"text":"' . i18n('Layouts', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '			{"text":"' . i18n('Lists', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"administration/lists/lists.ejs.php"},'.chr(13);
$buff .= '			{"text":"' . i18n('ACL', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '			{"text":"' . i18n('De Identification', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '			{"text":"' . i18n('Re Identification', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '			{"text":"' . i18n('Export', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '		]},' . chr(13);

// -------------------------------
// Administration->Other Folder
// -------------------------------
$buff .= '{ "text":"' . i18n('Other', 'r') . '", "cls":"folder", ' . chr(13);
$buff .= '		children: [' . chr(13); // ^ Folder
$buff .= '			{"text":"' . i18n('Language', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '			{"text":"' . i18n('Forms', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '			{"text":"' . i18n('Calendar', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"main/calendar/calendar.ejs.php?module=PostCalendar&type=admin&func=modifyconfig"},'.chr(13);
$buff .= '			{"text":"' . i18n('Logs', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '			{"text":"' . i18n('Certificates', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""}'.chr(13);
$buff .= '		]},' . chr(13);

// -------------------------------
// Reports Folder
// -------------------------------
$buff .= '{ "text":"' . i18n('Reports', 'r') . '", "cls":"folder", ' . chr(13);
$buff .= '	children: [' . chr(13); // ^ Folder
$buff .= '	]},' . chr(13);
 
// -------------------------------
// Reports->Clients Folder
// -------------------------------
$buff .= '		{"text":"' . i18n('Clients', 'r') . '", "cls":"folder", ' . chr(13);
$buff .= '			children: [' . chr(13); // ^ Folder
$buff .= '				{"text":"' . i18n('List', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '				{"text":"' . i18n('Rx', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '				{"text":"' . i18n('Referrals', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '			]},' . chr(13);

// -------------------------------
// Reports->Visits Folder
// -------------------------------
$buff .= '		{"text":"' . i18n('Visits', 'r') . '", "cls":"folder", ' . chr(13);
$buff .= '			children: [' . chr(13); // ^ Folder
$buff .= '				{"text":"' . i18n('Appointments', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '				{"text":"' . i18n('Encounters', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '				{"text":"' . i18n('Appt-Enc', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '				{"text":"' . i18n('Superbill', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '				{"text":"' . i18n('Chart Activity', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '				{"text":"' . i18n('Charts Out', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '				{"text":"' . i18n('Services', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '				{"text":"' . i18n('Syndromic Surveillance', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""}'.chr(13);
$buff .= '			]},' . chr(13);

// -------------------------------
// Reports->Financial Folder
// -------------------------------
$buff .= '		{"text":"' . i18n('Financial', 'r') . '", "cls":"folder", ' . chr(13);
$buff .= '			children: [' . chr(13); // ^ Folder
$buff .= '				{"text":"' . i18n('Sales', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '				{"text":"' . i18n('Cash Rec', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '				{"text":"' . i18n('Front Rec', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '				{"text":"' . i18n('Pmt Method', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '				{"text":"' . i18n('Collections', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""}'.chr(13);
$buff .= '			]},' . chr(13);

// -------------------------------
// Reports->Inventory Folder
// -------------------------------
$buff .= '		{"text":"' . i18n('Inventory', 'r') . '", "cls":"folder", ' . chr(13);
$buff .= '			children: [' . chr(13); // ^ Folder
$buff .= '				{"text":"' . i18n('List', 'r') . '", "pos":"pop", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '				{"text":"' . i18n('Activity', 'r') . '", "pos":"pop", "leaf":true, "cls":"file", "id":""}'.chr(13);
$buff .= '			]},' . chr(13);

// -------------------------------
// Reports->Procedures Folder
// -------------------------------
$buff .= '		{"text":"' . i18n('Procedures', 'r') . '", "cls":"folder", ' . chr(13);
$buff .= '			children: [' . chr(13); // ^ Folder
$buff .= '				{"text":"' . i18n('Pending Res', 'r') . '", "pos":"pop", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '				{"text":"' . i18n('Pending F/U', 'r') . '", "pos":"pop", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '				{"text":"' . i18n('Statistics', 'r') . '", "pos":"pop", "leaf":true, "cls":"file", "id":""}'.chr(13);
$buff .= '			]},' . chr(13);

// -------------------------------
// Reports->Insurance Folder
// -------------------------------

// -------------------------------
// Reports->Statistics Folder
// -------------------------------
$buff .= '		{"text":"' . i18n('Insurance', 'r') . '", "cls":"folder", ' . chr(13);
$buff .= '			children: [' . chr(13); // ^ Folder
$buff .= '				{"text":"' . i18n('IPPF Stats', 'r') . '", "pos":"pop", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '				{"text":"' . i18n('GCAC Stats', 'r') . '", "pos":"pop", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '				{"text":"' . i18n('MA Stats', 'r') . '", "pos":"pop", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '				{"text":"' . i18n('CYP', 'r') . '", "pos":"pop", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '				{"text":"' . i18n('Daily Record', 'r') . '", "pos":"pop", "leaf":true, "cls":"file", "id":""}'.chr(13);
$buff .= '			]},' . chr(13);

// -------------------------------
// Reports->Blank Forms Folder
// -------------------------------

// -------------------------------
// Miscellaneous Folder
// -------------------------------
$buff .= '	{"text":"' . i18n('Miscellaneous', 'r') . '", "cls":"folder", ' . chr(13);
$buff .= '		children: [' . chr(13); // ^ Folder
$buff .= '			{"text":"' . i18n('Authorizations', 'r') . '", "pos":"bot", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '			{"text":"' . i18n('Fax/Scan', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '			{"text":"' . i18n('Address Book', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '			{"text":"' . i18n('Order Catalog', 'r') . '",  "pos":"top","leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '			{"text":"' . i18n('Chart Tracker', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '			{"text":"' . i18n('Ofc Notes', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '			{"text":"' . i18n('BatchCom', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '			{"text":"' . i18n('Password', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":""},'.chr(13);
$buff .= '		]}' . chr(13);

$buff .= "]" . chr(13);

echo $buff;

?>