<?php
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');
// *************************************************************************************
// Renders the items of the navigation panel
// Default Nav Data
// *************************************************************************************
$nav = array(
    array( 'text' => 'Tablero',             'leaf' => true, 'cls' => 'file', 'iconCls' => 'icoDash',      'id' => 'panelDashboard' ),
    array( 'text' => 'Calendario',          'leaf' => true, 'cls' => 'file', 'iconCls' => 'icoCalendar',  'id' => 'panelCalendar' ),
    array( 'text' => 'Mensages',            'leaf' => true, 'cls' => 'file', 'iconCls' => 'mail',         'id' => 'panelMessages' ),
    array( 'text' => 'Busqueda Avanzada',   'leaf' => true, 'cls' => 'file', 'iconCls' => 'searchUsers',  'id' => 'panelPatientSearch' ),
);
// *************************************************************************************
// Patient Folder
// *************************************************************************************
$patient_folder = array( 'text' => 'Paciente', 'cls' => 'folder', 'expanded' => true, 'children' =>
    array(
        array( 'text' => 'Crear Paciente',      'leaf' => true, 'cls' => 'file', 'id' => 'panelNewPatient' ),
        array( 'text' => 'Resumen de Paciente', 'leaf' => true, 'cls' => 'file', 'id' => 'panelSummary' ),
        array( 'text' => 'Visitas',             'leaf' => true, 'cls' => 'file', 'id' => 'panelVisits' ),
    )
);
// *************************************************************************************
// Fees Folder
// *************************************************************************************
$fees_folder = array( 'text' => 'Cargos', 'cls' => 'folder', 'expanded' => true, 'children' =>
    array(
        array( 'text' => 'Facturacion',         'leaf' => true, 'cls' => 'file', 'id' => 'panelBilling' ),
        array( 'text' => 'Salida de Paciente',  'leaf' => true, 'cls' => 'file', 'id' => 'panelCheckout' ),
        array( 'text' => 'Ribreta de Cobro',    'leaf' => true, 'cls' => 'file', 'id' => 'panelFeesSheet' ),
        array( 'text' => 'Pagos',               'leaf' => true, 'cls' => 'file', 'id' => 'panelPayments' ),
    )
);
// *************************************************************************************
// Administration Folder
// *************************************************************************************
$admin_folder = array( 'text' => 'Administracion', 'cls' => 'folder', 'expanded' => false, 'children' =>
    array(
        array( 'text' => 'Global Settings', 'leaf' => true, 'cls' => 'file', 'id' => 'panelGlobals' ),
        array( 'text' => 'Facilidades',     'leaf' => true, 'cls' => 'file', 'id' => 'panelFacilities' ),
        array( 'text' => 'Usuarios',        'leaf' => true, 'cls' => 'file', 'id' => 'panelUsers' ),
        array( 'text' => 'Practicas',       'leaf' => true, 'cls' => 'file', 'id' => 'panelPractice' ),
        array( 'text' => 'Servicios',       'leaf' => true, 'cls' => 'file', 'id' => 'panelServices' ),
        array( 'text' => 'Roles',           'leaf' => true, 'cls' => 'file', 'id' => 'panelRoles' ),
        array( 'text' => 'Layouts',         'leaf' => true, 'cls' => 'file', 'id' => 'panelLayout' ),
        array( 'text' => 'Lists',           'leaf' => true, 'cls' => 'file', 'id' => 'panelLists' ),
        array( 'text' => 'Event Log',       'leaf' => true, 'cls' => 'file', 'id' => 'panelLog' ),
    )
);
// *************************************************************************************
// Miscellaneous Folder
// *************************************************************************************
$misc_folder = array( 'text' => 'Otros', 'cls' => 'folder', 'expanded' => false, 'children' =>
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