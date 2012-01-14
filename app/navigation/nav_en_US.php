<?php
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');
// *************************************************************************************
// Renders the items of the navigation panel
// Default Nav Data
// *************************************************************************************
$nav = array(
    array( 'text' => 'Dashboard',        'leaf' => true, 'cls' => 'file', 'iconCls' => 'icoDash',      'id' => 'panelDashboard' ),
    array( 'text' => 'Calendar',         'leaf' => true, 'cls' => 'file', 'iconCls' => 'icoCalendar',  'id' => 'panelCalendar' ),
    array( 'text' => 'Messages',         'leaf' => true, 'cls' => 'file', 'iconCls' => 'mail',         'id' => 'panelMessages' ),
    array( 'text' => 'Patient Search',   'leaf' => true, 'cls' => 'file', 'iconCls' => 'searchUsers',  'id' => 'panelPatientSearch' ),
);
// *************************************************************************************
// Patient Folder
// *************************************************************************************
$patient_folder = array( 'text' => 'Patient', 'cls' => 'folder', 'expanded' => true, 'children' =>
    array(
        array( 'text' => 'New Patient',      'leaf' => true, 'cls' => 'file', 'id' => 'panelNewPatient' ),
        array( 'text' => 'Patient Summary',  'leaf' => true, 'cls' => 'file', 'id' => 'panelSummary' ),
        array( 'text' => 'Visits',           'leaf' => true, 'cls' => 'file', 'id' => 'panelVisits' ),
    )
);
// *************************************************************************************
// Fees Folder
// *************************************************************************************
$fees_folder = array( 'text' => 'Fees', 'cls' => 'folder', 'expanded' => true, 'children' =>
    array(
        array( 'text' => 'Billing',         'leaf' => true, 'cls' => 'file', 'id' => 'panelBilling' ),
        array( 'text' => 'Checkout',        'leaf' => true, 'cls' => 'file', 'id' => 'panelCheckout' ),
        array( 'text' => 'Fees Sheet',      'leaf' => true, 'cls' => 'file', 'id' => 'panelFeesSheet' ),
        array( 'text' => 'Payments',        'leaf' => true, 'cls' => 'file', 'id' => 'panelPayments' ),
    )
);
// *************************************************************************************
// Administration Folder
// *************************************************************************************
$admin_folder = array( 'text' => 'Administration', 'cls' => 'folder', 'expanded' => false, 'children' =>
    array(
        array( 'text' => 'Global Settings', 'leaf' => true, 'cls' => 'file', 'id' => 'panelGlobals' ),
        array( 'text' => 'Facilities',      'leaf' => true, 'cls' => 'file', 'id' => 'panelFacilities' ),
        array( 'text' => 'Users',           'leaf' => true, 'cls' => 'file', 'id' => 'panelUsers' ),
        array( 'text' => 'Practice',        'leaf' => true, 'cls' => 'file', 'id' => 'panelPractice' ),
        array( 'text' => 'Services',        'leaf' => true, 'cls' => 'file', 'id' => 'panelServices' ),
        array( 'text' => 'Roles',           'leaf' => true, 'cls' => 'file', 'id' => 'panelRoles' ),
        array( 'text' => 'Layouts',         'leaf' => true, 'cls' => 'file', 'id' => 'panelLayout' ),
        array( 'text' => 'Lists',           'leaf' => true, 'cls' => 'file', 'id' => 'panelLists' ),
        array( 'text' => 'Event Log',       'leaf' => true, 'cls' => 'file', 'id' => 'panelLog' ),
    )
);
// *************************************************************************************
// Miscellaneous Folder
// *************************************************************************************
$misc_folder = array( 'text' => 'Miscellaneous', 'cls' => 'folder', 'expanded' => false, 'children' =>
    array(
        array( 'text' => 'Web Search',      'leaf' => true, 'cls' => 'file', 'id' => 'panelWebsearch' ),
        array( 'text' => 'Address Book',    'leaf' => true, 'cls' => 'file', 'id' => 'panelAddressbook' ),
        array( 'text' => 'Office Notes',    'leaf' => true, 'cls' => 'file', 'id' => 'panelOfficeNotes' ),
        array( 'text' => 'My Settings',     'leaf' => true, 'cls' => 'file', 'id' => 'panelMySettings' ),
        array( 'text' => 'My Account',      'leaf' => true, 'cls' => 'file', 'id' => 'panelMyAccount' ),
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
array_push( $nav, $patient_folder, $fees_folder, $admin_folder, $misc_folder );
print_r(json_encode($nav));