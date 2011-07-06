<?php
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');
include_once($_SESSION['site']['root']."/classes/I18n.class.php");
//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;
// *************************************************************************************
// Renders the items of the navigation panel
// Default Nav Data
// *************************************************************************************
$nav = array(
    array( 'text' => 'Dashboard', 'leaf' => true, 'cls' => 'file', 'iconCls' => 'icoDash',      'hrefTarget' => 'dashboard/dashboard.ejs.php' ),
    array( 'text' => 'Calendar',  'leaf' => true, 'cls' => 'file', 'iconCls' => 'icoCalendar',  'hrefTarget' => 'calendar/calendar.ejs.php' ),
    array( 'text' => 'Messages',  'leaf' => true, 'cls' => 'file', 'iconCls' => 'mail',         'hrefTarget' => 'messages/messages.ejs.php' ),
    // Patient Folder
    array( 'text' => 'Patient', 'cls' => 'folder', 'expanded' => true, 'children' =>
        array(
            array( 'text' => 'New Patient',     'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'patient_file/new/new_patient.ejs.php' ),
            array( 'text' => 'Patient Summary', 'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'patient_file/summary/summary.ejs.php' ),
            // Patient Visits Folder
            array( 'text' => 'Visits', 'cls' => 'folder', 'expanded' => true, 'children' =>
                array(
                    array( 'text' => 'Create Visit',    'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'patient_file/visits/visit_create/visit_create.ejs.php' ),
                    array( 'text' => 'Current Visit',   'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'patient_file/visits/visit_current/visit_current.ejs.php' ),
                    array( 'text' => 'Visit History',   'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'patient_file/visits/visit_history/visit_history.ejs.php' ),
                )
            ), // End Visits Folder
        )
    ), // End Patient Folder
    // Fees Folder
    array( 'text' => 'Fees', 'cls' => 'folder', 'expanded' => true, 'children' =>
        array(
            array( 'text' => 'Billing',         'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'fees/billing/billing.ejs.php' ),
            array( 'text' => 'Checkout',        'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'fees/checkout/checkout.ejs.php' ),
            array( 'text' => 'Fees Sheet',      'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'fees/fees_sheet/fees_sheet.ejs.php' ),
            array( 'text' => 'Payments',        'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'fees/payments/payments.ejs.php' ),
        )
    ), // End Fees Folder
    // Administration Folder
    array( 'text' => 'Administration', 'cls' => 'folder', 'expanded' => true, 'children' =>
        array(
            array( 'text' => 'Global Settings', 'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'administration/globals/globals.ejs.php' ),
            array( 'text' => 'Facilities',      'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'administration/facilities/facilities.ejs.php' ),
            array( 'text' => 'Users',           'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'administration/users/users.ejs.php' ),
            array( 'text' => 'Practice',        'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'administration/practice/practice.ejs.php' ),
            array( 'text' => 'Services',        'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'administration/services/services.ejs.php' ),
            array( 'text' => 'Roles',           'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'administration/roles/roles.ejs.php' ),
            array( 'text' => 'Layouts',         'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'administration/layout/layout.ejs.php' ),
            array( 'text' => 'Lists',           'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'administration/lists/lists.ejs.php' ),
            array( 'text' => 'Event Log',       'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'administration/log/log.ejs.php' ),
        )
    ), // End Administration Folder
    // Miscellaneous Folder
    array( 'text' => 'Miscellaneous','cls' => 'folder', 'expanded' => true, 'children' =>
        array(
            array( 'text' => 'Web Search',      'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'miscellaneous/websearch/websearch.ejs.php' ),
            array( 'text' => 'Address Book',    'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'miscellaneous/addressbook/addressbook.ejs.php' ),
            array( 'text' => 'Office Notes',    'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'miscellaneous/office_notes/office_notes.ejs.php' ),
            array( 'text' => 'My Settings',     'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'miscellaneous/my_settings/my_settings.ejs.php' ),
            array( 'text' => 'My Account',      'leaf' => true, 'cls' => 'file', 'hrefTarget' => 'miscellaneous/my_account/my_account.ejs.php' ),
        )
    ), // End Fees Folder
    // Test Folder
    array( 'text' => 'Test', 'cls' => 'folder', 'expanded' => true, 'children' =>
        array(
        )
    ), // End Test Folder
);
// Lets json encode and print $nav array
print_r(json_encode($nav));
?>