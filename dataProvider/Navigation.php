<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File: Navigation.php
 * Date: 2/1/12
 * Time: 7:04 PM
 */
if(!isset($_SESSION)){
    session_name ( "MitosEHR" );
    session_start();
    session_cache_limiter('private');
}
include_once("ACL.php");

class Navigation {
    /**
     * @var \ACL
     */
    private $ACL;
    private $lang;
    private $t;

    function __construct(){
        $this->ACL = new ACL();
        $this->lang = $_SESSION['lang']['code'];
        $this->t = $this->getTexts();
    }

    public function getNavigation(){
        // *************************************************************************************
        // Renders the items of the navigation panel
        // Default Nav Data
        // *************************************************************************************
        $nav = array(
            array( 'text' => $this->t['dashboard'][$this->lang],     'disabled'=> ($this->ACL->hasPermission('access_dashboard')       ? false:true), 'leaf' => true, 'cls' => 'file', 'iconCls' => 'icoDash',      'id' => 'panelDashboard' ),
            array( 'text' => $this->t['calendar'][$this->lang],      'disabled'=> ($this->ACL->hasPermission('access_calendar')        ? false:true), 'leaf' => true, 'cls' => 'file', 'iconCls' => 'icoCalendar',  'id' => 'panelCalendar' ),
            array( 'text' => $this->t['messages'][$this->lang],      'disabled'=> ($this->ACL->hasPermission('access_messages')        ? false:true), 'leaf' => true, 'cls' => 'file', 'iconCls' => 'mail',         'id' => 'panelMessages' ),
            array( 'text' => $this->t['patient_Search'][$this->lang],'disabled'=> ($this->ACL->hasPermission('access_patient_search')  ? false:true), 'leaf' => true, 'cls' => 'file', 'iconCls' => 'searchUsers',  'id' => 'panelPatientSearch' ),
        );
        // *************************************************************************************
        // Patient Folder
        // *************************************************************************************
        array_push( $nav, array( 'text' => 'Patient', 'cls' => 'folder', 'expanded' => true, 'children' =>
            array(
                array( 'text' => $this->t['new_patient'][$this->lang],      'disabled'=> ($this->ACL->hasPermission('add_patient')           ? false:true), 'leaf' => true, 'cls' => 'file', 'id' => 'panelNewPatient' ),
                array( 'text' => $this->t['patient_summary'][$this->lang],  'disabled'=> ($this->ACL->hasPermission('access_patient_summary')? false:true), 'leaf' => true, 'cls' => 'file', 'id' => 'panelSummary' ),
                array( 'text' => $this->t['visist_history'][$this->lang],   'disabled'=> ($this->ACL->hasPermission('access_patient_visits') ? false:true), 'leaf' => true, 'cls' => 'file', 'id' => 'panelVisits' ),
                array( 'text' => $this->t['encounter'][$this->lang],        'disabled'=> ($this->ACL->hasPermission('access_encounters')     ? false:true), 'leaf' => true, 'cls' => 'file', 'id' => 'panelEncounter' ),
            )
        ));
        // *************************************************************************************
        // Fees Folder
        // *************************************************************************************
        array_push( $nav, array( 'text' => 'Fees', 'cls' => 'folder', 'expanded' => false, 'children' =>
            array(
                array( 'text' => $this->t['billing'][$this->lang],      'leaf' => true, 'cls' => 'file', 'id' => 'panelBilling' ),
                array( 'text' => $this->t['checkout'][$this->lang],     'leaf' => true, 'cls' => 'file', 'id' => 'panelCheckout' ),
                array( 'text' => $this->t['fees_sheet'][$this->lang],   'leaf' => true, 'cls' => 'file', 'id' => 'panelFeesSheet' ),
                array( 'text' => $this->t['payment'][$this->lang],      'leaf' => true, 'cls' => 'file', 'id' => 'panelPayments' ),
            )
        ));
        // *************************************************************************************
        // Administration Folder
        // *************************************************************************************
        if(
            $this->ACL->hasPermission('access_gloabal_settings') ||
            $this->ACL->hasPermission('access_facilities') ||
            $this->ACL->hasPermission('access_users') ||
            $this->ACL->hasPermission('access_practice') ||
            $this->ACL->hasPermission('access_services') ||
            $this->ACL->hasPermission('access_roles') ||
            $this->ACL->hasPermission('access_layouts') ||
            $this->ACL->hasPermission('access_lists') ||
            $this->ACL->hasPermission('access_event_log')
        ) array_push( $nav, array( 'text' => 'Administration', 'cls' => 'folder', 'expanded' => false, 'children' =>
            array(
                array( 'text' => 'Global Settings', 'disabled'=> ($this->ACL->hasPermission('access_gloabal_settings')? false:true), 'leaf' => true, 'cls' => 'file', 'id' => 'panelGlobals' ),
                array( 'text' => 'Facilities',      'disabled'=> ($this->ACL->hasPermission('access_facilities')      ? false:true), 'leaf' => true, 'cls' => 'file', 'id' => 'panelFacilities' ),
                array( 'text' => 'Users',           'disabled'=> ($this->ACL->hasPermission('access_users')           ? false:true), 'leaf' => true, 'cls' => 'file', 'id' => 'panelUsers' ),
                array( 'text' => 'Practice',        'disabled'=> ($this->ACL->hasPermission('access_practice')        ? false:true), 'leaf' => true, 'cls' => 'file', 'id' => 'panelPractice' ),
                array( 'text' => 'Services',        'disabled'=> ($this->ACL->hasPermission('access_services')        ? false:true), 'leaf' => true, 'cls' => 'file', 'id' => 'panelServices' ),
                array( 'text' => 'Roles',           'disabled'=> ($this->ACL->hasPermission('access_roles')           ? false:true), 'leaf' => true, 'cls' => 'file', 'id' => 'panelRoles' ),
                array( 'text' => 'Layouts',         'disabled'=> ($this->ACL->hasPermission('access_layouts')         ? false:true), 'leaf' => true, 'cls' => 'file', 'id' => 'panelLayout' ),
                array( 'text' => 'Lists',           'disabled'=> ($this->ACL->hasPermission('access_lists')           ? false:true), 'leaf' => true, 'cls' => 'file', 'id' => 'panelLists' ),
                array( 'text' => 'Event Log',       'disabled'=> ($this->ACL->hasPermission('access_event_log')       ? false:true), 'leaf' => true, 'cls' => 'file', 'id' => 'panelLog' ),
            )
        ));
        // *************************************************************************************
        // Miscellaneous Folder
        // *************************************************************************************
        array_push( $nav, array( 'text' => 'Miscellaneous', 'cls' => 'folder', 'expanded' => false, 'children' =>
            array(
                array( 'text' => 'Web Search',      'leaf' => true, 'cls' => 'file', 'id' => 'panelWebsearch' ),
                array( 'text' => 'Address Book',    'leaf' => true, 'cls' => 'file', 'id' => 'panelAddressbook' ),
                array( 'text' => 'Office Notes',    'leaf' => true, 'cls' => 'file', 'id' => 'panelOfficeNotes' ),
                array( 'text' => 'My Settings',     'leaf' => true, 'cls' => 'file', 'id' => 'panelMySettings' ),
                array( 'text' => 'My Account',      'leaf' => true, 'cls' => 'file', 'id' => 'panelMyAccount' ),
            )
        ));

        return $nav;

    }

    private function getTexts(){
        return array(
            'dashboard' => array(
                'en_US' => 'Dashboard',
                'es'    => 'Tablero',
            ),
            'calendar' => array(
                'en_US' => 'Calendar',
                'es'    => 'Calendario',
            ),
            'messages' => array(
                'en_US' => 'Messages',
                'es'    => 'Mensajes',
            ),
            'patient_Search' => array(
                'en_US' => 'Patient Search',
                'es'    => 'Busqueda de Paciente',
            ),
            'new_patient' => array(
                'en_US' => 'New Patient',
                'es'    => 'Nuevo Paciente',
            ),
            'patient_summary' => array(
                'en_US' => 'Patient Summary',
                'es'    => 'Resumen de Paciente',
            ),
            'visist_history' => array(
                'en_US' => 'Visits History',
                'es'    => 'Historial de Visitas',
            ),
            'encounter' => array(
                'en_US' => 'Encounter',
                'es'    => 'Encuentro',
            ),
            'billing' => array(
                'en_US' => 'Billing',
                'es'    => 'Cobro',
            ),
            'checkout' => array(
                'en_US' => 'Checkout',
                'es'    => 'Salida',
            ),
            'fees_sheet' => array(
                'en_US' => 'Fees Sheet',
                'es'    => 'Libreta de Pago',
            ),
            'payment' => array(
                'en_US' => 'Payment',
                'es'    => 'Pagos',
            )
        );
    }
}
