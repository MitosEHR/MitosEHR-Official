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
    array( 'text' => i18n('Dashboard', 'r'),        'leaf' => true, 'cls' => 'file', 'iconCls' => 'icoDash',      'id' => 'panelDashboard' ),
    array( 'text' => i18n('Calendar', 'r'),         'leaf' => true, 'cls' => 'file', 'iconCls' => 'icoCalendar',  'id' => 'panelCalendar' ),
    array( 'text' => i18n('Messages', 'r'),         'leaf' => true, 'cls' => 'file', 'iconCls' => 'mail',         'id' => 'panelMessages' ),
    array( 'text' => i18n('Patient Search', 'r'),   'leaf' => true, 'cls' => 'file', 'iconCls' => 'searchUsers',  'id' => 'panelPatientSearch' ),
);
// *************************************************************************************
// Patient Folder
// *************************************************************************************
$patient_folder = array( 'text' => i18n('Patient', 'r'), 'cls' => 'folder', 'expanded' => true, 'children' =>
    array(
        array( 'text' => i18n('New Patient', 'r'),      'leaf' => true, 'cls' => 'file', 'id' => 'panelNewPatient' ),
        array( 'text' => i18n('Patient Summary', 'r'),  'leaf' => true, 'cls' => 'file', 'id' => 'panelSummary' ),
        array( 'text' => i18n('Visits', 'r'),           'leaf' => true, 'cls' => 'file', 'id' => 'panelVisits' ),
    )
);
// *************************************************************************************
// Fees Folder
// *************************************************************************************
$fees_folder = array( 'text' => i18n('Fees', 'r'), 'cls' => 'folder', 'expanded' => true, 'children' =>
    array(
        array( 'text' => i18n('Billing', 'r'),         'leaf' => true, 'cls' => 'file', 'id' => 'panelBilling' ),
        array( 'text' => i18n('Checkout', 'r'),        'leaf' => true, 'cls' => 'file', 'id' => 'panelCheckout' ),
        array( 'text' => i18n('Fees Sheet', 'r'),      'leaf' => true, 'cls' => 'file', 'id' => 'panelFeesSheet' ),
        array( 'text' => i18n('Payments', 'r'),        'leaf' => true, 'cls' => 'file', 'id' => 'panelPayments' ),
    )
);
// *************************************************************************************
// Administration Folder
// *************************************************************************************
$admin_folder = array( 'text' => i18n('Administration', 'r'), 'cls' => 'folder', 'expanded' => false, 'children' =>
    array(
        array( 'text' => i18n('Global Settings', 'r'), 'leaf' => true, 'cls' => 'file', 'id' => 'panelGlobals' ),
        array( 'text' => i18n('Facilities', 'r'),      'leaf' => true, 'cls' => 'file', 'id' => 'panelFacilities' ),
        array( 'text' => i18n('Users', 'r'),           'leaf' => true, 'cls' => 'file', 'id' => 'panelUsers' ),
        array( 'text' => i18n('Practice', 'r'),        'leaf' => true, 'cls' => 'file', 'id' => 'panelPractice' ),
        array( 'text' => i18n('Services', 'r'),        'leaf' => true, 'cls' => 'file', 'id' => 'panelServices' ),
        array( 'text' => i18n('Roles', 'r'),           'leaf' => true, 'cls' => 'file', 'id' => 'panelRoles' ),
        array( 'text' => i18n('Layouts', 'r'),         'leaf' => true, 'cls' => 'file', 'id' => 'panelLayout' ),
        array( 'text' => i18n('Lists', 'r'),           'leaf' => true, 'cls' => 'file', 'id' => 'panelLists' ),
        array( 'text' => i18n('Event Log', 'r'),       'leaf' => true, 'cls' => 'file', 'id' => 'panelLog' ),
    )
);
// *************************************************************************************
// Miscellaneous Folder
// *************************************************************************************
$misc_folder = array( 'text' => i18n('Miscellaneous', 'r'), 'cls' => 'folder', 'expanded' => false, 'children' =>
    array(
        array( 'text' => i18n('Web Search', 'r'),      'leaf' => true, 'cls' => 'file', 'id' => 'panelWebsearch' ),
        array( 'text' => i18n('Address Book', 'r'),    'leaf' => true, 'cls' => 'file', 'id' => 'panelAddressbook' ),
        array( 'text' => i18n('Office Notes', 'r'),    'leaf' => true, 'cls' => 'file', 'id' => 'panelOfficeNotes' ),
        array( 'text' => i18n('My Settings', 'r'),     'leaf' => true, 'cls' => 'file', 'id' => 'panelMySettings' ),
        array( 'text' => i18n('My Account', 'r'),      'leaf' => true, 'cls' => 'file', 'id' => 'panelMyAccount' ),
    )
);
// *************************************************************************************
// Test Folder
// *************************************************************************************
$test_folder = array( 'text' => i18n('Test', 'r'), 'cls' => 'folder', 'expanded' => true, 'children' =>
    array(
//        array( 'text' => i18n('Layouts', 'r'),         'leaf' => true, 'cls' => 'file', 'id' => 'panelLayout' ),
//        array( 'text' => i18n('New Patient', 'r'),     'leaf' => true, 'cls' => 'file', 'id' => 'panelNewPatient' ),
//
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