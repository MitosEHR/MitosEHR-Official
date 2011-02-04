<?php

// *************************************************************************************
// Load MitosEHR Globals
// This code produces JSON formatted data
// *************************************************************************************
include_once("../registry.php");
include_once($GLOBALS['fileroot']."/library/acl.inc.php");
include_once($GLOBALS['fileroot']."/custom/code_types.inc.php");
include_once($GLOBALS['fileroot']."/library/patient.inc.php");

// *************************************************************************************
// This array defines the list of primary documents that may be
// chosen.  Each element value is an array of 3 values:
//
// * Name to appear in the navigation table
// * Usage: 0 = global, 1 = patient-specific, 2 = encounter-specific
// * The URL relative to the interface directory
// *************************************************************************************
$primary_docs = array(
	'ros' => array(xl('Roster')    , 0, 'reports/players_report.php?embed=1'),
	'cal' => array(xl('Calendar')  , 0, '../../calendar/calendar.ejs.php'),
	'msg' => array(xl('Messages')  , 0, 'messages/messages.ejs.php'),
	'pwd' => array(xl('Password')  , 0, 'usergroup/user_info.php'),
	'adm' => array(xl('Admin')     , 0, 'usergroup/admin_frameset.php'),
	'rep' => array(xl('Reports')   , 0, 'reports/index.php'),
	'ono' => array(xl('Ofc Notes') , 0, 'main/onotes/office_comments.php'),
	'fax' => array(xl('Fax/Scan')  , 0, 'fax/faxq.php'),
	'adb' => array(xl('Addr Bk')   , 0, 'usergroup/addrbook_list.php'),
	'ort' => array(xl('Proc Cat')  , 0, 'orders/types.php'),
	'orb' => array(xl('Proc Bat')  , 0, 'orders/orders_results.php?batch=1'),
	'cht' => array(xl('Chart Trk') , 0, '../custom/chart_tracker.php'),
	'imp' => array(xl('Import')    , 0, '../custom/import.php'),
	'bil' => array(xl('Billing')   , 0, 'billing/billing_report.php'),
	'sup' => array(xl('Superbill') , 0, 'patient_file/encounter/superbill_custom_full.ejs.php'),
	'aun' => array(xl('Authorizations'), 0, 'main/authorizations/authorizations.php'),
	'new' => array(xl('New Pt')    , 0, 'new/new.ejs.php'),
	'dem' => array(xl('Patient')   , 1,  "patient_file/summary/demographics.php"),
	'his' => array(xl('History')   , 1, 'patient_file/history/history.php'),
	'ens' => array(xl('Visit History'), 1, 'patient_file/history/encounters.php'),
	'nen' => array(xl('Create Visit'), 1, 'forms/newpatient/new.php?autoloaded=1&calenc='),
	'pre' => array(xl('Rx')        , 1, 'patient_file/summary/rx_frameset.php'),
	'iss' => array(xl('Issues')    , 1, 'patient_file/summary/stats_full.php?active=all'),
	'imm' => array(xl('Immunize')  , 1, 'patient_file/summary/immunizations.ejs.php'),
	'doc' => array(xl('Documents') , 1, '../controller.php?document&list&patient_id={PID}'),
	'orp' => array(xl('Proc Pending Rev'), 1, 'orders/orders_results.php?review=1'),
	'orr' => array(xl('Proc Res')  , 1, 'orders/orders_results.php'),
	'prp' => array(xl('Pt Report') , 1, 'patient_file/report/patient_report.php'),
	'pno' => array(xl('Pt Notes')  , 1, 'patient_file/summary/pnotes.php'),
	'tra' => array(xl('Transact')  , 1, 'patient_file/transaction/transactions.php'),
	'sum' => array(xl('Summary')   , 1, 'patient_file/summary/summary_bottom.php'),
	'enc' => array(xl('Encounter') , 2, 'patient_file/encounter/encounter_top.php'),
);
if ($GLOBALS['use_charges_panel'] || $GLOBALS['concurrent_layout'] == 2) {
	$primary_docs['cod'] = array(xl('Charges'), 2, 'patient_file/encounter/encounter_bottom.php');
}

// *************************************************************************************
// This section decides which navigation items will not appear.
// *************************************************************************************
$disallowed = array();

// Administration Rules
$disallowed['adm'] = !(acl_check('admin', 'calendar') ||
						acl_check('admin', 'database') || 
						acl_check('admin', 'forms') ||
						acl_check('admin', 'practice') || 
						acl_check('admin', 'users') ||
						acl_check('admin', 'acl') || 
						acl_check('admin', 'super') ||
						acl_check('admin', 'superbill'));

// Billing Rules
$disallowed['bil'] = !(acl_check('acct', 'rep') || 
						acl_check('acct', 'eob') ||
						acl_check('acct', 'bill'));

$tmp = acl_check('patients', 'demo');
$disallowed['new'] = !($tmp == 'write' || $tmp == 'addonly');

// Hylafax Service Rules
if ( isset ($GLOBALS['hylafax_server']) && isset ($GLOBALS['scanner_output_directory']) ) {
    $disallowed['fax'] = !($GLOBALS['hylafax_server'] || $GLOBALS['scanner_output_directory']);
}

$disallowed['ros'] = !$GLOBALS['athletic_team'];

$disallowed['iss'] = !((acl_check('encounters', 'notes') == 'write' ||
						acl_check('encounters', 'notes_a') == 'write') &&
						acl_check('patients', 'med') == 'write');

$disallowed['imp'] = $disallowed['new'] || !is_readable("$webserver_root/custom/import.php");

$disallowed['cht'] = !is_readable("$webserver_root/custom/chart_tracker.php");

$disallowed['pre'] = !(acl_check('patients', 'med'));

// *************************************************************************************
// Renders the items of the navigation panel
// Non-Athletic Clinic
// *************************************************************************************
$buff .= "[" . chr(13);

// -------------------------------------
// Calendar Item (Non-Athletic Clinic)
// -------------------------------------
$buff .= '{ "text":"' . xl('Calendar') . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['cal'][2] . '"},' . chr(13);

// -------------------------------
// Messages Item
// -------------------------------
$buff .= '{ "text":"' . xl('Messages') . '", "pos":"bot", "leaf":true, "cls":"file", "id":"' . $primary_docs['msg'][2] . '"},' . chr(13);

// -------------------------------
// Patient/Client Folder
// -------------------------------
$buff .= '{ "text":"' . xl('Patient/Client') . '", "cls":"folder", ' . chr(13);
$buff .= 'children: [' . chr(13); // ^ Folder
$buff .= '	{ "text":"' . ($GLOBALS["full_new_patient_form"] ? xl("New/Search") : xl("New")) . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['new'][2] . '"},' . chr(13);
$buff .= '	{ "text":"' . xl('Summary') . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['dem'][2] . '"},' . chr(13);

// -------------------------------
// Patient/Client->Visits Folder
// -------------------------------
$buff .= '	{ "text":"' . xl('Visits') . '", "cls":"folder", ' . chr(13);
$buff .= '		children: [' . chr(13); // ^ Folder
if ($GLOBALS['ippf_specific'] && !$GLOBALS['disable_calendar']) $buff .= '			{ "text":"' . xl('Calendar') . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['cal'][2] . '"},' . chr(13);
$buff .= '			{ "text":"' . xl('Create Visit') . '", "pos":"bot", "leaf":true, "cls":"file", "id":"' . $primary_docs['nen'][2] . '"},' . chr(13);
$buff .= '			{ "text":"' . xl('Current') . '", "pos":"bot", "leaf":true, "cls":"file", "id":"' . $primary_docs['enc'][2] . '"},' . chr(13);
$buff .= '			{ "text":"' . xl('Visit History') . '", "pos":"bot", "leaf":true, "cls":"file", "id":"' . $primary_docs['ens'][2] . '"}' . chr(13);
$buff .= '		]},' . chr(13);

// -------------------------------
// Patient/Client->Visit Forms Folder
// -------------------------------
$buff .= '{ "text":"' . xl('Visit Forms') . '", "cls":"folder", ' . chr(13);
$buff .= '		children: [' . chr(13); // ^ Folder
// Render Visit Forms
// Generate the items for visit forms, both traditional and LBF.
$lres = sqlStatement("SELECT * FROM list_options WHERE list_id = 'lbfnames' ORDER BY seq, title");
if (sqlNumRows($lres)) {
	while ($lrow = sqlFetchArray($lres)) {
		$option_id = $lrow['option_id']; // should start with LBF
		$title = $lrow['title'];
		$buff .= '{ "text":"' . xl_form_title($title) . '", "pos":"bot", "leaf":true, "cls":"file", "id":"patient_file/encounter/load_form.php?formname=$option_id"},' .chr(13);
	}
}
include_once("$srcdir/registry.inc.php");
$reg = getRegistered();
if (!empty($reg)) {
	foreach ($reg as $entry) {
		$option_id = $entry['directory'];
		$title = trim($entry['nickname']);
		if ($option_id == 'fee_sheet' ) continue;
		if ($option_id == 'newpatient') continue;
		if (empty($title)) $title = $entry['name'];
		$buff .= '{ "text":"' . xl_form_title($title) . '", "pos":"bot", "leaf":true, "cls":"file", "id":"patient_file/encounter/load_form.php?formname=' . urlencode($option_id) . '"},' . chr(13);
  }
}
$buff = substr($buff, 0, -2); // Delete the last comma
$buff .= '		]}' . chr(13);
$buff .= ']},' . chr(13);

// -------------------------------
// Fees Folder
// -------------------------------
$buff .= '{ "text":"' . xl('Fees') . '", "cls":"folder", ' . chr(13);
$buff .= '		children: [' . chr(13); // ^ Folder
$buff .= '			{"text":"' . xl('Fee Sheet') . '", "pos":"bot", "leaf":true, "cls":"file", "id":"patient_file/encounter/load_form.php?formname=fee_sheet"},' . chr(13);
if ($GLOBALS['use_charges_panel']){	$buff .= '			{"text":"' . xl('Charges') . '", "pos":"bot", "leaf":true, "cls":"file", "id":"' . $primary_docs['cod'][2] . '"},' . chr(13); }
$buff .= '			{"text":"' . xl('Checkout') . '", "pos":"bot", "leaf":true, "cls":"file", "id":"patient_file/pos_checkout.php?framed=1"},' . chr(13);
if (! $GLOBALS['simplified_demographics']){ $buff .= '			{"text":"' . xl('Billing') . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['bil'][2] . '"}' . chr(13); }
$buff .= '		]},' . chr(13);

// -------------------------------
// Inventory Folder
// -------------------------------
$buff .= '{ "text":"' . xl('Inventory') . '", "cls":"folder", ' . chr(13);
$buff .= '		children: [' . chr(13); // ^ Folder
$buff .= '			{"text":"' . xl('Management') . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['adm'][2] . '"},' . chr(13);
$buff .= '			{"text":"' . xl('Destroyed') . '", "pos":"pop", "leaf":true, "cls":"file", "id":"../reports/destroyed_drugs_report.php"}' . chr(13);
$buff .= '		]},' . chr(13);

// -------------------------------
// Procedures Folder
// -------------------------------
$buff .= '{ "text":"' . xl('Procedures') . '", "cls":"folder", ' . chr(13);
$buff .= '		children: [' . chr(13); // ^ Folder
$buff .= '			{"text":"' . xl('Configuration') . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['ort'][2] . '"},'.chr(13);
$buff .= '			{"text":"' . xl('Pending Review') . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['orp'][2] . '"},'.chr(13);
$buff .= '			{"text":"' . xl('Patient Results') . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['orr'][2] . '"},'.chr(13);
$buff .= '			{"text":"' . xl('Batch Results') . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['orb'][2] . '"}'.chr(13);
$buff .= '		]},' . chr(13);

// -------------------------------
// Administration Folder
// -------------------------------
$buff .= '{ "text":"' . xl('Administration') . '", "cls":"folder", ' . chr(13);
$buff .= '		children: [' . chr(13); // ^ Folder
if (acl_check('admin', 'super')) $buff .= '		{"text":"' . xl('Globals') . '", "pos":"top", "leaf":true, "cls":"file", "id":"super/edit_registry.php"},'.chr(13);
if (acl_check('admin', 'users')) $buff .= '		{"text":"' . xl('Facilities') . '", "pos":"top", "leaf":true, "cls":"file", "id":"usergroup/facilities.php"},'.chr(13);
if (acl_check('admin', 'users')) $buff .= '		{"text":"' . xl('Users') . '", "pos":"top", "leaf":true, "cls":"file", "id":"usergroup/usergroup_admin.php"},'.chr(13);
if (acl_check('admin', 'practice')) $buff .= '		{"text":"' . xl('Practice') . '", "pos":"top", "leaf":true, "cls":"file", "id":"../controller.php?practice_settings&pharmacy&action=list"},'.chr(13);
if (acl_check('admin', 'superbill')) $buff .= '		{"text":"' . xl('Services') . '", "pos":"top", "leaf":true, "cls":"file", "id":"super/edit_layout.php"},'.chr(13);
if (acl_check('admin', 'super')) $buff .= '		{"text":"' . xl('Layouts') . '", "pos":"top", "leaf":true, "cls":"file", "id":"super/edit_registry.php"},'.chr(13);
if (acl_check('admin', 'super')) $buff .= '		{"text":"' . xl('Lists') . '", "pos":"top", "leaf":true, "cls":"file", "id":"super/edit_list.php"},'.chr(13);
if (acl_check('admin', 'acl')) $buff .= '		{"text":"' . xl('ACL') . '", "pos":"top", "leaf":true, "cls":"file", "id":"usergroup/adminacl.php"},'.chr(13);
if (($GLOBALS['include_de_identification']) && acl_check('admin', 'super')) $buff .= '		{"text":"' . xl('De Identification') . '", "pos":"top", "leaf":true, "cls":"file", "id":"de_identification_forms/de_identification_screen1.php"},'.chr(13);
if (($GLOBALS['include_de_identification']) && acl_check('admin', 'super')) $buff .= '		{"text":"' . xl('Re Identification') . '", "pos":"top", "leaf":true, "cls":"file", "id":"de_identification_forms/re_identification_input_screen.php"},'.chr(13);
if (acl_check('admin', 'super') && !empty($GLOBALS['code_types']['IPPF'])) $buff .= '		{"text":"' . xl('Export') . '", "pos":"top", "leaf":true, "cls":"file", "id":"main/ippf_export.php"},'.chr(13);
// -------------------------------
// Administration->Other Folder
// -------------------------------
$buff .= '{ "text":"' . xl('Other') . '", "cls":"folder", ' . chr(13);
$buff .= '		children: [' . chr(13); // ^ Folder
if (acl_check('admin', 'language')) $buff .= '		{"text":"' . xl('Language') . '", "pos":"top", "leaf":true, "cls":"file", "id":"language/language.php"},'.chr(13);
if (acl_check('admin', 'forms')) $buff .= '		{"text":"' . xl('Forms') . '", "pos":"top", "leaf":true, "cls":"file", "id":"forms_admin/forms_admin.php"},'.chr(13);
if (acl_check('admin', 'calendar') && !$GLOBALS['disable_calendar']) $buff .= '		{"text":"' . xl('Calendar') . '", "pos":"top", "leaf":true, "cls":"file", "id":"main/calendar/calendar.ejs.php?module=PostCalendar&type=admin&func=modifyconfig"},'.chr(13);
if (acl_check('admin', 'users')) $buff .= '		{"text":"' . xl('Logs') . '", "pos":"top", "leaf":true, "cls":"file", "id":"logview/logview.php"},'.chr(13);
if ((!$GLOBALS['disable_phpmyadmin_link']) && acl_check('admin', 'database')) $buff .= '		{"text":"' . xl('Database') . '", "pos":"top", "leaf":true, "cls":"file", "id":"../phpmyadmin/index.php"},'.chr(13);
if (acl_check('admin', 'users')) $buff .= '		{"text":"' . xl('Certificates') . '", "pos":"top", "leaf":true, "cls":"file", "id":"usergroup/ssl_certificates_admin.php"}'.chr(13);
$buff .= '		]}' . chr(13);
$buff .= '		]},' . chr(13);

// -------------------------------
// Reports Folder
// -------------------------------
$buff .= '{ "text":"' . xl('Reports') . '", "cls":"folder", ' . chr(13);
$buff .= '	children: [' . chr(13); // ^ Folder
							   
// -------------------------------
// Reports->Clients Folder
// -------------------------------
$buff .= '		{"text":"' . xl('Clients') . '", "cls":"folder", ' . chr(13);
$buff .= '			children: [' . chr(13); // ^ Folder
$buff .= '			{"text":"' . xl('List') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/patient_list.php"},'.chr(13);
if (acl_check('patients', 'med') && !$GLOBALS['disable_prescriptions']) $buff .= '			{"text":"' . xl('Rx') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/prescriptions_report.php"},'.chr(13);
$buff .= '			{"text":"' . xl('Referrals') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/referrals_report.php"},'.chr(13);
$buff .= '			]},' . chr(13);

// -------------------------------
// Reports->Visits Folder
// -------------------------------
$buff .= '		{"text":"' . xl('Visits') . '", "cls":"folder", ' . chr(13);
$buff .= '			children: [' . chr(13); // ^ Folder
if (!$GLOBALS['disable_calendar']) $buff .= '			{"text":"' . xl('Appointments') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/appointments_report.php"},'.chr(13);
$buff .= '			{"text":"' . xl('Encounters') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/encounters_report.php"},'.chr(13);
if (!$GLOBALS['disable_calendar']) $buff .= '			{"text":"' . xl('Appt-Enc') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/appt_encounter_report.php"},'.chr(13);
if (empty($GLOBALS['code_types']['IPPF'])) $buff .= '			{"text":"' . xl('Superbill') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/custom_report_range.php"},'.chr(13);
if (!$GLOBALS['disable_chart_tracker']) $buff .= '			{"text":"' . xl('Chart Activity') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/chart_location_activity.php"},'.chr(13);
if (!$GLOBALS['disable_chart_tracker']) $buff .= '			{"text":"' . xl('Charts Out') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/charts_checked_out.php"},'.chr(13);
$buff .= '			{"text":"' . xl('Services') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/services_by_category.php"},'.chr(13);
$buff .= '			{"text":"' . xl('Syndromic Surveillance') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/non_reported.php"}'.chr(13);
$buff .= '			]},' . chr(13);

// -------------------------------
// Reports->Financial Folder
// -------------------------------
if (acl_check('acct', 'rep_a')) {
	$buff .= '		{"text":"' . xl('Financial') . '", "cls":"folder", ' . chr(13);
	$buff .= '			children: [' . chr(13); // ^ Folder
	$buff .= '			{"text":"' . xl('Sales') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/sales_by_item.php"},'.chr(13);
	$buff .= '			{"text":"' . xl('Cash Rec') . '", "pos":"top", "leaf":true, "cls":"file", "id":"billing/sl_receipts_report.php"},'.chr(13);
	$buff .= '			{"text":"' . xl('Front Rec') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/front_receipts_report.php"},'.chr(13);
	$buff .= '			{"text":"' . xl('Pmt Method') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/receipts_by_method_report.php"},'.chr(13);
	$buff .= '			{"text":"' . xl('Collections') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/collections_report.php"}'.chr(13);
	$buff .= '			]},' . chr(13);
}

// -------------------------------
// Reports->Inventory Folder
// -------------------------------
$buff .= '		{"text":"' . xl('Inventory') . '", "cls":"folder", ' . chr(13);
$buff .= '			children: [' . chr(13); // ^ Folder
$buff .= '			{"text":"' . xl('List') . '", "pos":"pop", "leaf":true, "cls":"file", "id":"../reports/inventory_list.php"},'.chr(13);
$buff .= '			{"text":"' . xl('Activity') . '", "pos":"pop", "leaf":true, "cls":"file", "id":"../reports/inventory_activity.php"}'.chr(13);
$buff .= '			]},' . chr(13);

// -------------------------------
// Reports->Procedures Folder
// -------------------------------
$buff .= '		{"text":"' . xl('Procedures') . '", "cls":"folder", ' . chr(13);
$buff .= '			children: [' . chr(13); // ^ Folder
$buff .= '			{"text":"' . xl('Pending Res') . '", "pos":"pop", "leaf":true, "cls":"file", "id":"../orders/pending_orders.php"},'.chr(13);
if (!empty($GLOBALS['code_types']['IPPF']))$buff .= '			{"text":"' . xl('Pending F/U') . '", "pos":"pop", "leaf":true, "cls":"file", "id":"../orders/pending_followup.php"},'.chr(13);
$buff .= '			{"text":"' . xl('Statistics') . '", "pos":"pop", "leaf":true, "cls":"file", "id":"../orders/procedure_stats.php"}'.chr(13);
$buff .= '			]},' . chr(13);

// -------------------------------
// Reports->Insurance Folder
// -------------------------------
if (! $GLOBALS['simplified_demographics']) {
	$buff .= '		{"text":"' . xl('Insurance') . '", "cls":"folder", ' . chr(13);
	$buff .= '			children: [' . chr(13); // ^ Folder
	$buff .= '			{"text":"' . xl('Distribution') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/insurance_allocation_report.php"},'.chr(13);
	$buff .= '			{"text":"' . xl('Indigents') . '", "pos":"top", "leaf":true, "cls":"file", "id":"billing/indigent_patients_report.php"},'.chr(13);
	$buff .= '			{"text":"' . xl('Unique SP') . '", "pos":"top", "leaf":true, "cls":"file", "id":"reports/unique_seen_patients_report.php"}'.chr(13);
	$buff .= '			]},' . chr(13);
}

// -------------------------------
// Reports->Statistics Folder
// -------------------------------
if (!empty($GLOBALS['code_types']['IPPF'])) {
	$buff .= '		{"text":"' . xl('Insurance') . '", "cls":"folder", ' . chr(13);
	$buff .= '			children: [' . chr(13); // ^ Folder
	$buff .= '			{"text":"' . xl('IPPF Stats') . '", "pos":"pop", "leaf":true, "cls":"file", "id":"ippf_statistics.php?t=i"},'.chr(13);
	$buff .= '			{"text":"' . xl('GCAC Stats') . '", "pos":"pop", "leaf":true, "cls":"file", "id":"ippf_statistics.php?t=g"},'.chr(13);
	$buff .= '			{"text":"' . xl('MA Stats') . '", "pos":"pop", "leaf":true, "cls":"file", "id":"ippf_statistics.php?t=m"},'.chr(13);
	$buff .= '			{"text":"' . xl('CYP') . '", "pos":"pop", "leaf":true, "cls":"file", "id":"ippf_cyp_report.php"},'.chr(13);
	$buff .= '			{"text":"' . xl('Daily Record') . '", "pos":"pop", "leaf":true, "cls":"file", "id":"ippf_daily.php"}'.chr(13);
	$buff .= '			]},' . chr(13);
}

// -------------------------------
// Reports->Blank Forms Folder
// -------------------------------
$buff .= '		{"text":"' . xl('Blank Forms') . '", "cls":"folder", ' . chr(13);
$buff .= '			children: [' . chr(13); // ^ Folder
$buff .= '			{"text":"' . xl('Demographics') . '", "pos":"pop", "leaf":true, "cls":"file", "id":"../patient_file/summary/demographics_print.php"},'.chr(13);
$buff .= '			{"text":"' . xl('Fee Sheet') . '", "pos":"pop", "leaf":true, "cls":"file", "id":"../patient_file/printed_fee_sheet.php"},'.chr(13);
$buff .= '			{"text":"' . xl('Referral') . '", "pos":"pop", "leaf":true, "cls":"file", "id":"../patient_file/transaction/print_referral.php"},'.chr(13);
$lres = sqlStatement("SELECT * FROM list_options WHERE list_id = 'lbfnames' ORDER BY seq, title");
while ($lrow = sqlFetchArray($lres)) {
	$option_id = $lrow['option_id']; // should start with LBF
	$title = $lrow['title'];
	$buff .= '			{"text":"' . $title . '", "pos":"pop", "leaf":true, "cls":"file", "id":"../forms/LBF/printable.php?formname=$option_id"},'.chr(13);
}
$buff .= '			]},' . chr(13);

$buff .= '	]},' . chr(13); // End Report Folder

// -------------------------------
// Miscellaneous Folder
// -------------------------------
$buff .= '	{"text":"' . xl('Miscellaneous') . '", "cls":"folder", ' . chr(13);
$buff .= '		children: [' . chr(13); // ^ Folder
$buff .= '		{"text":"' . xl('Authorizations') . '", "pos":"bot", "leaf":true, "cls":"file", "id":"' . $primary_docs['aun'][2] . '"},'.chr(13);
$buff .= '		{"text":"' . xl('Fax/Scan') . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['fax'][2] . '"},'.chr(13);
$buff .= '		{"text":"' . xl('Addr Book') . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['adb'][2] . '"},'.chr(13);
$buff .= '		{"text":"' . xl('Order Catalog') . '",  "pos":"top","leaf":true, "cls":"file", "id":"' . $primary_docs['ort'][2] . '"},'.chr(13);
if (!$GLOBALS['disable_chart_tracker']) $buff .= '		{"text":"' . xl('Chart Tracker') . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['cht'][2] . '"},'.chr(13);
$buff .= '		{"text":"' . xl('Ofc Notes') . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['ono'][2] . '"},'.chr(13);
$buff .= '		{"text":"' . xl('BatchCom') . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['adm'][2] . '"},'.chr(13);
$buff .= '		{"text":"' . xl('Password') . '", "pos":"top", "leaf":true, "cls":"file", "id":"' . $primary_docs['pwd'][2] . '"},'.chr(13);
$buff .= '		]}' . chr(13);

$buff .= "]" . chr(13);

echo $buff;
?>