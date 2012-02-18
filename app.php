<?php
/* Main Screen Application
 *
 * Description: This is the main application, with all the panels
 * also this is the viewport of the application, this will call
 * all the app->screen panels
 *
 * version 0.0.3
 * revision: N/A
 * author: GI Technologies, 2011
 * modified: Ernesto J Rodriguez (Certun)
 *
 * @namespace Ext.mitos.data.REMOTING_API
 */
if(!defined('_MitosEXEC')) die('No direct access allowed.');
/**
 * Reset session flop count
 */
$_SESSION['site']['flops'] = 0;

/*
 * Include Globals and run setGlobals static method to set the global settings
 */
include_once($_SESSION['site']['root'].'/classes/Globals.php');
Globals::setGlobals();

?>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title><?php echo $_SESSION['global_settings']['mitosehr_name'] ?></title>
<!--test stuff-->
<link rel="stylesheet" type="text/css" href="ui_app/dashboard.css" >
<!--end test stuff-->
<link rel="stylesheet" type="text/css" href="themes/resources/css/<?php echo $_SESSION['global_settings']['css_header'] ?>">
<!--calendar css-->
<link rel="stylesheet" type="text/css" href="lib/<?php echo $_SESSION['dir']['ext_cal'] ?>/resources/css/extensible-all.css" />
<!--ens calendar css-->
<link rel="stylesheet" type="text/css" href="ui_app/style_newui.css" >
<link rel="stylesheet" type="text/css" href="ui_app/mitosehr_app.css" >
<link rel="shortcut icon" href="favicon.ico" >
<!--<script type="text/javascript" src="app/view/App.js"></script>-->
</head>
    <body>
        <div id="mainapp-loading-mask" class="x-mask mitos-mask"></div>
        <div id="mainapp-x-mask-msg">
            <div id="mainapp-loading" class="x-mask-msg mitos-mask-msg">
                <div>Loading MitosEHR...</div>
            </div>
        </div>
        <span id="app-msg" style="display:none;"></span>

        <script type="text/javascript" src="lib/<?php echo $_SESSION['dir']['ext']; ?>/bootstrap.js"></script>
        <script type="text/javascript" src="lib/webcam_control/swfobject.js"></script>
        <script type="text/javascript" src="repo/formValidation/formValidation.js"></script>
        <script type="text/javascript" src="lib/<?php echo $_SESSION['dir']['ext_cal'] ?>/src/Extensible.js"></script>



        <!-- Languages -->
        <script type="text/javascript" src="langs/<?php echo $_SESSION['lang']['code'] ?>.js"></script>

        <!-- JS Registry -->
        <script type="text/javascript" src="registry.js.php"></script>

        <script type="text/javascript">
            Ext.Loader.setConfig({
                enabled			: true,
                disableCaching	: false,
                paths			: {
                    'Ext.ux'            : 'app/classes/ux',
                    'Ext.mitos'         : 'app',
                    'Extensible'        : 'lib/extensible-1.5.1/src'
                }
            });
        </script>

        <script src="data/api.php"></script>

        <script type="text/javascript" src="lib/ext-4.0.7/src/grid/plugin/RowEditing.js"></script>
        <script type="text/javascript" src="app/classes/Overrides.js"></script>



        <script type="text/javascript" src="app/classes/NodeDisabled.js"></script>

        <script type="text/javascript" src="app/classes/RenderPanel.js"></script>

        <script type="text/javascript" src="app/view/dashboard/Dashboard.js"></script>
        <script type="text/javascript" src="lib/extensible-1.5.1/src/calendar/data/EventStore.js"></script>
        <script type="text/javascript" src="app/classes/ux/SlidingPager.js"></script>


        <script type="text/javascript" src="app/classes/GridPanel.js"></script>
        <script type="text/javascript" src="app/classes/LivePatientSearch.js"></script>
        <script type="text/javascript" src="app/classes/ManagedIframe.js"></script>
        <script type="text/javascript" src="app/classes/PhotoIdWindow.js"></script>
        <script type="text/javascript" src="app/classes/restStoreModel.js"></script>
        <script type="text/javascript" src="app/classes/CalCategoryComboBox.js"></script>
        <script type="text/javascript" src="app/classes/CalStatusComboBox.js"></script>

        <script type="text/javascript" src="app/classes/combo/Authorizations.js"></script>
        <script type="text/javascript" src="app/classes/combo/CodesTypes.js"></script>
        <script type="text/javascript" src="app/classes/combo/Facilities.js"></script>
        <script type="text/javascript" src="app/classes/combo/InsurancePayerType.js"></script>
        <script type="text/javascript" src="app/classes/combo/Languages.js"></script>
        <script type="text/javascript" src="app/classes/combo/Lists.js"></script>
        <script type="text/javascript" src="app/classes/combo/MsgNoteType.js"></script>
        <script type="text/javascript" src="app/classes/combo/MsgStatus.js"></script>
        <script type="text/javascript" src="app/classes/combo/posCodes.js"></script>
        <script type="text/javascript" src="app/classes/combo/Roles.js"></script>
        <script type="text/javascript" src="app/classes/combo/AllergyTypes.js"></script>
        <script type="text/javascript" src="app/classes/combo/TaxId.js"></script>
        <script type="text/javascript" src="app/classes/combo/Titles.js"></script>
        <script type="text/javascript" src="app/classes/combo/Outcome.js"></script>
        <script type="text/javascript" src="app/classes/combo/Occurrence.js"></script>
        <script type="text/javascript" src="app/classes/combo/TransmitMedthod.js"></script>
        <script type="text/javascript" src="app/classes/combo/Types.js"></script>
        <script type="text/javascript" src="app/classes/combo/Users.js"></script>


        <script type="text/javascript" src="app/classes/form/fields/Checkbox.js"></script>
        <script type="text/javascript" src="app/classes/form/fields/DateTime.js"></script>


        <script type="text/javascript" src="app/view/patientfile/visits/Visits.js"></script>
        <script type="text/javascript" src="app/view/patientfile/summary/Summary.js"></script>
        <script type="text/javascript" src="app/view/patientfile/encounter/Encounter.js"></script>
        <script type="text/javascript" src="app/view/patientfile/new/NewPatient.js"></script>
        <script type="text/javascript" src="app/view/patientfile/Immunization.js"></script>


        <script type="text/javascript" src="app/view/administration/Facilities.js"></script>
        <script type="text/javascript" src="app/view/administration/Globals.js"></script>
        <script type="text/javascript" src="app/view/administration/Layout.js"></script>
        <script type="text/javascript" src="app/view/administration/Lists.js"></script>
        <script type="text/javascript" src="app/view/administration/Log.js"></script>
        <script type="text/javascript" src="app/view/administration/Practice.js"></script>
        <script type="text/javascript" src="app/view/administration/Roles.js"></script>
        <script type="text/javascript" src="app/view/administration/Services.js"></script>
        <script type="text/javascript" src="app/view/administration/Users.js"></script>

        <script type="text/javascript" src="app/view/messages/Messages.js"></script>
        <script type="text/javascript" src="app/view/search/PatientSearch.js"></script>

        <script type="text/javascript" src="app/view/miscellaneous/Addressbook.js"></script>
        <script type="text/javascript" src="app/view/miscellaneous/MyAccount.js"></script>
        <script type="text/javascript" src="app/view/miscellaneous/MySettings.js"></script>
        <script type="text/javascript" src="app/view/miscellaneous/OfficeNotes.js"></script>
        <script type="text/javascript" src="app/view/miscellaneous/Websearch.js"></script>


        <script type="text/javascript" src="app/view/MitosApp.js"></script>


        <script type="text/javascript" src="app/classes/Overrides.js"></script>


        <script type="text/javascript">
            var App;
            function say(a){
                console.log(a);
            }


            Ext.direct.Manager.addProvider(Ext.mitos.data.REMOTING_API);

            Ext.onReady(function(){
                App = Ext.create('Ext.mitos.view.MitosApp');
            });
        </script>


    </body>
</html>