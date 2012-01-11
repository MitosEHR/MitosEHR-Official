<?php
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');
include_once($_SESSION['site']['root']."/classes/I18n.class.php");
// *************************************************************************************
// Renders the items of the navigation panel
// Default Nav Data
// *************************************************************************************
$nav = array(
    array( 'text' => i18n('Dashboard', 'r'),        'leaf' => true, 'cls' => 'file', 'iconCls' => 'icoDash',      'hrefTarget' => 'panelDashboard' ),
    array( 'text' => i18n('Calendar', 'r'),         'leaf' => true, 'cls' => 'file', 'iconCls' => 'icoCalendar',  'hrefTarget' => 'panelCalendar' ),
    array( 'text' => i18n('Messages', 'r'),         'leaf' => true, 'cls' => 'file', 'iconCls' => 'mail',         'hrefTarget' => 'panelMessages' ),
    array( 'text' => i18n('Patient Search', 'r'),   'leaf' => true, 'cls' => 'file', 'iconCls' => 'searchUsers',  'hrefTarget' => 'panelPatientSearch' ),
);
// *************************************************************************************
// Patient Folder
// *************************************************************************************
$patient_folder = array( 'text' => i18n('Patient', 'r'), 'cls' => 'folder', 'expanded' => true, 'children' =>
    array(
        array( 'text' => i18n('New Patient', 'r'),      'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'panelNewPatient' ),
        array( 'text' => i18n('Patient Summary', 'r'),  'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'panelSummary' ),
        array( 'text' => i18n('Visits', 'r'),           'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'panelVisits' ),
    )
);
// *************************************************************************************
// Fees Folder
// *************************************************************************************
$fees_folder = array( 'text' => i18n('Fees', 'r'), 'cls' => 'folder', 'expanded' => true, 'children' =>
    array(
        array( 'text' => i18n('Billing', 'r'),         'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'panelBilling' ),
        array( 'text' => i18n('Checkout', 'r'),        'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'panelCheckout' ),
        array( 'text' => i18n('Fees Sheet', 'r'),      'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'panelFeesSheet' ),
        array( 'text' => i18n('Payments', 'r'),        'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'panelPayments' ),
    )
);
// *************************************************************************************
// Administration Folder
// *************************************************************************************
$admin_folder = array( 'text' => i18n('Administration', 'r'), 'cls' => 'folder', 'expanded' => false, 'children' =>
    array(
        array( 'text' => i18n('Global Settings', 'r'), 'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'panelGlobals' ),
        array( 'text' => i18n('Facilities', 'r'),      'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'panelFacilities' ),
        array( 'text' => i18n('Users', 'r'),           'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'panelUsers' ),
        array( 'text' => i18n('Practice', 'r'),        'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'panelPractice' ),
        array( 'text' => i18n('Services', 'r'),        'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'panelServices' ),
        array( 'text' => i18n('Roles', 'r'),           'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'panelRoles' ),
        array( 'text' => i18n('Layouts', 'r'),         'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'panelLayout' ),
        array( 'text' => i18n('Lists', 'r'),           'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'panelLists' ),
        array( 'text' => i18n('Event Log', 'r'),       'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'panelLog' ),
    )
);
// *************************************************************************************
// Miscellaneous Folder
// *************************************************************************************
$misc_folder = array( 'text' => i18n('Miscellaneous', 'r'), 'cls' => 'folder', 'expanded' => false, 'children' =>
    array(
        array( 'text' => i18n('Web Search', 'r'),      'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'panelWebsearch' ),
        array( 'text' => i18n('Address Book', 'r'),    'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'panelAddressbook' ),
        array( 'text' => i18n('Office Notes', 'r'),    'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'panelOfficeNotes' ),
        array( 'text' => i18n('My Settings', 'r'),     'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'panelMySettings' ),
        array( 'text' => i18n('My Account', 'r'),      'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'panelMyAccount' ),
    )
);
// *************************************************************************************
// Test Folder
// *************************************************************************************
$test_folder = array( 'text' => i18n('Test', 'r'), 'cls' => 'folder', 'expanded' => true, 'children' =>
    array(
        array( 'text' => i18n('Layouts', 'r'),         'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'panelLayout' ),
        array( 'text' => i18n('New Patient', 'r'),     'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'panelNewPatient' ),

    )
);
// *************************************************************************************
// Here we can parse and edit folders keys values, before pushing them into $nav
// ei. $admin_folder['expanded'] = false;
// *************************************************************************************

// $patient_folder['expanded']  = $_SESSION['nav']['patient_folder']['expanded'];
// $fees_folder['expanded']     = $_SESSION['nav']['fees_folder']['expanded'];
// $admin_folder['expanded']    = $_SESSION['nav']['admin_folder']['expanded'];
// $misc_folder['expanded']     = $_SESSION['nav']['misc_folder']['expanded'];


// TODO: ACL will determine which folders will be push to $nav array. IMPORTANT!
// *************************************************************************************
// Lets push all the folders into $nav and print json return
// *************************************************************************************
array_push( $nav, $patient_folder, $fees_folder, $admin_folder, $misc_folder, $test_folder );
print_r(json_encode($nav));
?>