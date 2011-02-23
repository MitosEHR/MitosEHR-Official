<?php

session_name ( "MitosEHR" );
session_start();

include_once("library/adoHelper/adoHelper.inc.php");
include_once("library/I18n/I18n.inc.php");
require_once("repository/dataExchange/dataExchange.inc.php");

// *************************************************************************************
// This array defines the list of primary documents that may be
// chosen.  Each element value is an array of 3 values:
//
// * Name to appear in the navigation table
// * Usage: 0 = global, 1 = patient-specific, 2 = encounter-specific
// * The URL relative to the interface directory
// *************************************************************************************
$primary_docs = array(
	'ros' => array(i18n('Roster', 'r')    , 0, 'reports/players_report.php?embed=1'),
	'cal' => array(i18n('Calendar', 'r')  , 0, 'calendar/calendar.ejs.php'),
	'msg' => array(i18n('Messages', 'r')  , 0, 'messages/messages.ejs.php'),
	'pwd' => array(i18n('Password', 'r')  , 0, 'usergroup/user_info.php'),
	'adm' => array(i18n('Admin', 'r')     , 0, 'usergroup/admin_frameset.php'),
	'rep' => array(i18n('Reports', 'r')   , 0, 'reports/index.php'),
	'ono' => array(i18n('Ofc Notes', 'r') , 0, 'onotes/office_comments.php'),
	'fax' => array(i18n('Fax/Scan', 'r')  , 0, 'fax/faxq.php'),
	'adb' => array(i18n('Addr Bk', 'r')   , 0, 'miscellaneous/addressbook/addressbook.ejs.php'),
	'ort' => array(i18n('Proc Cat', 'r')  , 0, 'orders/types.php'),
	'orb' => array(i18n('Proc Bat', 'r')  , 0, 'orders/orders_results.php?batch=1'),
	'cht' => array(i18n('Chart Trk', 'r') , 0, '../custom/chart_tracker.php'),
	'imp' => array(i18n('Import', 'r')    , 0, '../custom/import.php'),
	'bil' => array(i18n('Billing', 'r')   , 0, 'billing/billing_report.php'),
	'sup' => array(i18n('Superbill', 'r') , 0, 'patient_file/encounter/superbill_custom_full.ejs.php'),
	'aun' => array(i18n('Authorizations', 'r'), 0, 'main/authorizations/authorizations.php'),
	'new' => array(i18n('New Pt', 'r')    , 0, 'new/new.ejs.php'),
	'dem' => array(i18n('Patient', 'r')   , 1,  "patient_file/summary/demographics.ejs.php"),
	'his' => array(i18n('History', 'r')   , 1, 'patient_file/history/history.php'),
	'ens' => array(i18n('Visit History', 'r'), 1, 'patient_file/history/encounters.php'),
	'nen' => array(i18n('Create Visit', 'r'), 1, 'forms/newpatient/new.php?autoloaded=1&calenc='),
	'pre' => array(i18n('Rx', 'r')        , 1, 'patient_file/summary/rx_frameset.php'),
	'iss' => array(i18n('Issues', 'r')    , 1, 'patient_file/summary/stats_full.php?active=all'),
	'imm' => array(i18n('Immunize', 'r')  , 1, 'patient_file/summary/immunizations.ejs.php'),
	'doc' => array(i18n('Documents', 'r') , 1, '../controller.php?document&list&patient_id={PID}'),
	'orp' => array(i18n('Proc Pending Rev', 'r'), 1, 'orders/orders_results.php?review=1'),
	'orr' => array(i18n('Proc Res', 'r')  , 1, 'orders/orders_results.php'),
	'prp' => array(i18n('Pt Report', 'r') , 1, 'patient_file/report/patient_report.php'),
	'pno' => array(i18n('Pt Notes', 'r')  , 1, 'patient_file/summary/pnotes.php'),
	'tra' => array(i18n('Transact', 'r')  , 1, 'patient_file/transaction/transactions.php'),
	'sum' => array(i18n('Summary', 'r')   , 1, 'patient_file/summary/summary_bottom.php'),
	'enc' => array(i18n('Encounter', 'r') , 2, 'patient_file/encounter/encounter_top.php'),
);
$primary_docs['cod'] = array(i18n('Charges', 'r'), 2, 'patient_file/encounter/encounter_bottom.php');

// *************************************************************************************
// Renders the items of the navigation panel
// Non-Athletic Clinic
// *************************************************************************************
$buff .= "[" . chr(13);

// -------------------------------------
// Calendar Item (Non-Athletic Clinic)
// -------------------------------------
$buff .= '{ "text":"' . i18n('Calendar', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['cal'][2] . '"},' . chr(13);

// -------------------------------
// Messages Item
// -------------------------------
$buff .= '{ "text":"' . i18n('Messages', 'r') . '", "pos":"bot", "leaf":true, "cls":"file", "id":"' . $primary_docs['msg'][2] . '"},' . chr(13);

// -------------------------------
// Patient/Client Folder
// -------------------------------
$buff .= '{ "text":"' . i18n('Patient/Client', 'r') . '", "cls":"folder", ' . chr(13);
$buff .= 'children: [' . chr(13); // ^ Folder
$buff .= '	{ "text":"' . ($GLOBALS["full_new_patient_form"] ? i18n('New/Search', 'r') : i18n('New', 'r')) . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['new'][2] . '"},' . chr(13);
$buff .= '	{ "text":"' . i18n('Summary', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['dem'][2] . '"},' . chr(13);

// -------------------------------
// Patient/Client->Visits Folder
// -------------------------------
$buff .= '	{ "text":"' . i18n('Visits', 'r') . '", "cls":"folder", ' . chr(13);
$buff .= '		children: [' . chr(13); // ^ Folder
if ($GLOBALS['ippf_specific'] && !$GLOBALS['disable_calendar']) $buff .= '			{ "text":"' . i18n('Calendar') . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['cal'][2] . '"},' . chr(13);
$buff .= '			{ "text":"' . i18n('Create Visit', 'r') . '", "pos":"bot", "leaf":true, "cls":"file", "id":"' . $primary_docs['nen'][2] . '"},' . chr(13);
$buff .= '			{ "text":"' . i18n('Current', 'r') . '", "pos":"bot", "leaf":true, "cls":"file", "id":"' . $primary_docs['enc'][2] . '"},' . chr(13);
$buff .= '			{ "text":"' . i18n('Visit History', 'r') . '", "pos":"bot", "leaf":true, "cls":"file", "id":"' . $primary_docs['ens'][2] . '"}' . chr(13);
$buff .= '		]},' . chr(13);

// -------------------------------
// Patient/Client->Visit Forms Folder
// -------------------------------
$buff .= '{ "text":"' . i18n('Visit Forms', 'r') . '", "cls":"folder", ' . chr(13);
$buff .= '		children: [' . chr(13); // ^ Folder
// Render Visit Forms
// Generate the items for visit forms, both traditional and LBF.
$lres = sqlStatement("SELECT * FROM list_options WHERE list_id = 'lbfnames' ORDER BY seq, title");
if (sqlTotalCount($lres)) {
	foreach ($lres as $urow) {
		$option_id = $urow['option_id']; // should start with LBF
		$title = $urow['title'];
		$buff .= '{ "text":"' . i18n($title, 'r') . '", "pos":"bot", "leaf":true, "cls":"file", "id":"patient_file/encounter/load_form.php?formname=$option_id"},' .chr(13);
	}
}

$reg = '';
if (!empty($reg)) {
	foreach ($reg as $entry) {
		$option_id = $entry['directory'];
		$title = trim($entry['nickname']);
		if ($option_id == 'fee_sheet' ) continue;
		if ($option_id == 'newpatient') continue;
		if (empty($title)) $title = $entry['name'];
		$buff .= '{ "text":"' . i18n($title, 'r') . '", "pos":"bot", "leaf":true, "cls":"file", "id":"patient_file/encounter/load_form.php?formname=' . urlencode($option_id) . '"},' . chr(13);
  }
}
$buff = substr($buff, 0, -2); // Delete the last comma
$buff .= '		]}' . chr(13);
$buff .= ']},' . chr(13);

// -------------------------------
// Fees Folder
// -------------------------------
$buff .= '{ "text":"' . i18n('Fees', 'r') . '", "cls":"folder", ' . chr(13);
$buff .= '		children: [' . chr(13); // ^ Folder
$buff .= '			{"text":"' . i18n('Fee Sheet', 'r') . '", "pos":"bot", "leaf":true, "cls":"file", "id":"patient_file/encounter/load_form.php?formname=fee_sheet"},' . chr(13);
if ($GLOBALS['use_charges_panel']){	$buff .= '			{"text":"' . i18n('Charges') . '", "pos":"bot", "leaf":true, "cls":"file", "id":"' . $primary_docs['cod'][2] . '"},' . chr(13); }
$buff .= '			{"text":"' . i18n('Checkout', 'r') . '", "pos":"bot", "leaf":true, "cls":"file", "id":"patient_file/pos_checkout.php?framed=1"},' . chr(13);
if (! $GLOBALS['simplified_demographics']){ $buff .= '			{"text":"' . i18n('Billing') . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['bil'][2] . '"}' . chr(13); }
$buff .= '		]},' . chr(13);

// -------------------------------
// Inventory Folder
// -------------------------------
$buff .= '{ "text":"' . i18n('Inventory', 'r') . '", "cls":"folder", ' . chr(13);
$buff .= '		children: [' . chr(13); // ^ Folder
$buff .= '			{"text":"' . i18n('Management', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['adm'][2] . '"},' . chr(13);
$buff .= '			{"text":"' . i18n('Destroyed', 'r') . '", "pos":"pop", "leaf":true, "cls":"file", "id":"../reports/destroyed_drugs_report.php"}' . chr(13);
$buff .= '		]},' . chr(13);

// -------------------------------
// Procedures Folder
// -------------------------------
$buff .= '{ "text":"' . i18n('Procedures', 'r') . '", "cls":"folder", ' . chr(13);
$buff .= '		children: [' . chr(13); // ^ Folder
$buff .= '			{"text":"' . i18n('Configuration', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['ort'][2] . '"},'.chr(13);
$buff .= '			{"text":"' . i18n('Pending Review', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['orp'][2] . '"},'.chr(13);
$buff .= '			{"text":"' . i18n('Patient Results', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['orr'][2] . '"},'.chr(13);
$buff .= '			{"text":"' . i18n('Batch Results', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['orb'][2] . '"}'.chr(13);
$buff .= '		]},' . chr(13);

// -------------------------------
// Administration Folder
// -------------------------------
$buff .= '{ "text":"' . i18n('Administration', 'r') . '", "cls":"folder", ' . chr(13);
$buff .= '		children: [' . chr(13); // ^ Folder
$buff .= '		{"text":"' . i18n('Globals', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"super/edit_registry.php"},'.chr(13);
$buff .= '		{"text":"' . i18n('Facilities', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"administration/facilities/facilities.ejs.php"},'.chr(13);
$buff .= '		{"text":"' . i18n('Users', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"administration/users/users.ejs.php"},'.chr(13);
$buff .= '		{"text":"' . i18n('Practice', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"../controller.php?practice_settings&pharmacy&action=list"},'.chr(13);
$buff .= '		{"text":"' . i18n('Services', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"super/edit_layout.php"},'.chr(13);
$buff .= '		{"text":"' . i18n('Layouts', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"super/edit_registry.php"},'.chr(13);
$buff .= '		{"text":"' . i18n('Lists', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"administration/lists/lists.ejs.php"},'.chr(13);
$buff .= '		{"text":"' . i18n('ACL', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"usergroup/adminacl.php"},'.chr(13);
$buff .= '		{"text":"' . i18n('De Identification') . '", "pos":"top", "leaf":true, "cls":"file", "id":"de_identification_forms/de_identification_screen1.php"},'.chr(13);
$buff .= '		{"text":"' . i18n('Re Identification') . '", "pos":"top", "leaf":true, "cls":"file", "id":"de_identification_forms/re_identification_input_screen.php"},'.chr(13);
$buff .= '		{"text":"' . i18n('Export') . '", "pos":"top", "leaf":true, "cls":"file", "id":"main/ippf_export.php"},'.chr(13);

// -------------------------------
// Administration->Other Folder
// -------------------------------
$buff .= '{ "text":"' . i18n('Other', 'r') . '", "cls":"folder", ' . chr(13);
$buff .= '		children: [' . chr(13); // ^ Folder
$buff .= '		{"text":"' . i18n('Language', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"language/language.php"},'.chr(13);
$buff .= '		{"text":"' . i18n('Forms', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"forms_admin/forms_admin.php"},'.chr(13);
$buff .= '		{"text":"' . i18n('Calendar', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"main/calendar/calendar.ejs.php?module=PostCalendar&type=admin&func=modifyconfig"},'.chr(13);
$buff .= '		{"text":"' . i18n('Logs', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"logview/logview.php"},'.chr(13);
$buff .= '		{"text":"' . i18n('Certificates', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"usergroup/ssl_certificates_admin.php"}'.chr(13);
$buff .= '		]}' . chr(13);
$buff .= '		]},' . chr(13);

// -------------------------------
// Reports Folder
// -------------------------------
$buff .= '{ "text":"' . i18n('Reports', 'r') . '", "cls":"folder", ' . chr(13);
$buff .= '	children: [' . chr(13); // ^ Folder
							   
// -------------------------------
// Reports->Clients Folder
// -------------------------------
$buff .= '		{"text":"' . i18n('Clients', 'r') . '", "cls":"folder", ' . chr(13);
$buff .= '			children: [' . chr(13); // ^ Folder
$buff .= '			{"text":"' . i18n('List') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/patient_list.php"},'.chr(13);
$buff .= '			{"text":"' . i18n('Rx', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/prescriptions_report.php"},'.chr(13);
$buff .= '			{"text":"' . i18n('Referrals', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/referrals_report.php"},'.chr(13);
$buff .= '			]},' . chr(13);

// -------------------------------
// Reports->Visits Folder
// -------------------------------
$buff .= '		{"text":"' . i18n('Visits', 'r') . '", "cls":"folder", ' . chr(13);
$buff .= '			children: [' . chr(13); // ^ Folder
$buff .= '			{"text":"' . i18n('Appointments', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/appointments_report.php"},'.chr(13);
$buff .= '			{"text":"' . i18n('Encounters') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/encounters_report.php"},'.chr(13);
$buff .= '			{"text":"' . i18n('Appt-Enc', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/appt_encounter_report.php"},'.chr(13);
$buff .= '			{"text":"' . i18n('Superbill', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/custom_report_range.php"},'.chr(13);
$buff .= '			{"text":"' . i18n('Chart Activity', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/chart_location_activity.php"},'.chr(13);
$buff .= '			{"text":"' . i18n('Charts Out', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/charts_checked_out.php"},'.chr(13);
$buff .= '			{"text":"' . i18n('Services', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/services_by_category.php"},'.chr(13);
$buff .= '			{"text":"' . i18n('Syndromic Surveillance', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/non_reported.php"}'.chr(13);
$buff .= '			]},' . chr(13);

// -------------------------------
// Reports->Financial Folder
// -------------------------------
if (acl_check('acct', 'rep_a')) {
	$buff .= '		{"text":"' . i18n('Financial', 'r') . '", "cls":"folder", ' . chr(13);
	$buff .= '			children: [' . chr(13); // ^ Folder
	$buff .= '			{"text":"' . i18n('Sales', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/sales_by_item.php"},'.chr(13);
	$buff .= '			{"text":"' . i18n('Cash Rec', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"billing/sl_receipts_report.php"},'.chr(13);
	$buff .= '			{"text":"' . i18n('Front Rec', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/front_receipts_report.php"},'.chr(13);
	$buff .= '			{"text":"' . i18n('Pmt Method', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/receipts_by_method_report.php"},'.chr(13);
	$buff .= '			{"text":"' . i18n('Collections', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/collections_report.php"}'.chr(13);
	$buff .= '			]},' . chr(13);
}

// -------------------------------
// Reports->Inventory Folder
// -------------------------------
$buff .= '		{"text":"' . i18n('Inventory', 'r') . '", "cls":"folder", ' . chr(13);
$buff .= '			children: [' . chr(13); // ^ Folder
$buff .= '			{"text":"' . i18n('List', 'r') . '", "pos":"pop", "leaf":true, "cls":"file", "id":"../reports/inventory_list.php"},'.chr(13);
$buff .= '			{"text":"' . i18n('Activity', 'r') . '", "pos":"pop", "leaf":true, "cls":"file", "id":"../reports/inventory_activity.php"}'.chr(13);
$buff .= '			]},' . chr(13);

// -------------------------------
// Reports->Procedures Folder
// -------------------------------
$buff .= '		{"text":"' . i18n('Procedures', 'r') . '", "cls":"folder", ' . chr(13);
$buff .= '			children: [' . chr(13); // ^ Folder
$buff .= '			{"text":"' . i18n('Pending Res', 'r') . '", "pos":"pop", "leaf":true, "cls":"file", "id":"../orders/pending_orders.php"},'.chr(13);
$buff .= '			{"text":"' . i18n('Pending F/U') . '", "pos":"pop", "leaf":true, "cls":"file", "id":"../orders/pending_followup.php"},'.chr(13);
$buff .= '			{"text":"' . i18n('Statistics', 'r') . '", "pos":"pop", "leaf":true, "cls":"file", "id":"../orders/procedure_stats.php"}'.chr(13);
$buff .= '			]},' . chr(13);

// -------------------------------
// Reports->Insurance Folder
// -------------------------------
if (! $GLOBALS['simplified_demographics']) {
	$buff .= '		{"text":"' . i18n('Insurance', 'r') . '", "cls":"folder", ' . chr(13);
	$buff .= '			children: [' . chr(13); // ^ Folder
	$buff .= '			{"text":"' . i18n('Distribution', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/insurance_allocation_report.php"},'.chr(13);
	$buff .= '			{"text":"' . i18n('Indigents', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"billing/indigent_patients_report.php"},'.chr(13);
	$buff .= '			{"text":"' . i18n('Unique SP', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/unique_seen_patients_report.php"}'.chr(13);
	$buff .= '			]},' . chr(13);
}

// -------------------------------
// Reports->Statistics Folder
// -------------------------------
if (!empty($GLOBALS['code_types']['IPPF'])) {
	$buff .= '		{"text":"' . i18n('Insurance', 'r') . '", "cls":"folder", ' . chr(13);
	$buff .= '			children: [' . chr(13); // ^ Folder
	$buff .= '			{"text":"' . i18n('IPPF Stats', 'r') . '", "pos":"pop", "leaf":true, "cls":"file", "id":"ippf_statistics.php?t=i"},'.chr(13);
	$buff .= '			{"text":"' . i18n('GCAC Stats', 'r') . '", "pos":"pop", "leaf":true, "cls":"file", "id":"ippf_statistics.php?t=g"},'.chr(13);
	$buff .= '			{"text":"' . i18n('MA Stats', 'r') . '", "pos":"pop", "leaf":true, "cls":"file", "id":"ippf_statistics.php?t=m"},'.chr(13);
	$buff .= '			{"text":"' . i18n('CYP', 'r') . '", "pos":"pop", "leaf":true, "cls":"file", "id":"ippf_cyp_report.php"},'.chr(13);
	$buff .= '			{"text":"' . i18n('Daily Record', 'r') . '", "pos":"pop", "leaf":true, "cls":"file", "id":"ippf_daily.php"}'.chr(13);
	$buff .= '			]},' . chr(13);
}

// -------------------------------
// Reports->Blank Forms Folder
// -------------------------------
$buff .= '		{"text":"' . i18n('Blank Forms', 'r') . '", "cls":"folder", ' . chr(13);
$buff .= '			children: [' . chr(13); // ^ Folder
$buff .= '			{"text":"' . i18n('Demographics', 'r') . '", "pos":"pop", "leaf":true, "cls":"file", "id":"../patient_file/summary/demographics_print.php"},'.chr(13);
$buff .= '			{"text":"' . i18n('Fee Sheet', 'r') . '", "pos":"pop", "leaf":true, "cls":"file", "id":"../patient_file/printed_fee_sheet.php"},'.chr(13);
$buff .= '			{"text":"' . i18n('Referral', 'r') . '", "pos":"pop", "leaf":true, "cls":"file", "id":"../patient_file/transaction/print_referral.php"},'.chr(13);
$lres = sqlStatement("SELECT * FROM list_options WHERE list_id = 'lbfnames' ORDER BY seq, title");
foreach ($lres as $urow) {
	$option_id = $urow['option_id']; // should start with LBF
	$title = $urow['title'];
	$buff .= '			{"text":"' . $title . '", "pos":"pop", "leaf":true, "cls":"file", "id":"../forms/LBF/printable.php?formname=$option_id"},'.chr(13);
}
$buff .= '			]},' . chr(13);

$buff .= '	]},' . chr(13); // End Report Folder

// -------------------------------
// Miscellaneous Folder
// -------------------------------
$buff .= '	{"text":"' . i18n('Miscellaneous', 'r') . '", "cls":"folder", ' . chr(13);
$buff .= '		children: [' . chr(13); // ^ Folder
$buff .= '		{"text":"' . i18n('Authorizations', 'r') . '", "pos":"bot", "leaf":true, "cls":"file", "id":"' . $primary_docs['aun'][2] . '"},'.chr(13);
$buff .= '		{"text":"' . i18n('Fax/Scan', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['fax'][2] . '"},'.chr(13);
$buff .= '		{"text":"' . i18n('Address Book', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['adb'][2] . '"},'.chr(13);
$buff .= '		{"text":"' . i18n('Order Catalog', 'r') . '",  "pos":"top","leaf":true, "cls":"file", "id":"' . $primary_docs['ort'][2] . '"},'.chr(13);
$buff .= '		{"text":"' . i18n('Chart Tracker') . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['cht'][2] . '"},'.chr(13);
$buff .= '		{"text":"' . i18n('Ofc Notes', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['ono'][2] . '"},'.chr(13);
$buff .= '		{"text":"' . i18n('BatchCom', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['adm'][2] . '"},'.chr(13);
$buff .= '		{"text":"' . i18n('Password', 'r') . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['pwd'][2] . '"},'.chr(13);
$buff .= '		]}' . chr(13);

$buff .= "]" . chr(13);

echo $buff;

?>