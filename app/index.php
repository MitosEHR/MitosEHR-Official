<?php
if(!defined('_MitosEXEC')) die('No direct access allowed.');
/* Main Screen Application
 *
 * Description: This is the main application, with all the panels
 * also this is the viewport of the application, this will call
 * all the app->screen panels
 *
 * version 0.0.3
 * revision: N/A
 * author: GI Technologies, 2011
 *
 */
// Reset session count
$_SESSION['site']['flops'] = 0;
/*
 * Include the necessary libraries, so the web application
 * can work.
 */
include_once($_SESSION['site']['root'].'/lib/compressor/compressor.inc.php');
include_once($_SESSION['site']['root'].'/classes/dbHelper.class.php');
include_once($_SESSION['site']['root'].'/repo/global_settings/global_settings.php');
include_once($_SESSION['site']['root'].'/repo/global_functions/global_functions.php');
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
<link rel="stylesheet" type="text/css" href="lib/<?php echo $_SESSION['dir']['ext_cal'] ?>/resources/css/calendar.css" />
<link rel="stylesheet" type="text/css" href="lib/<?php echo $_SESSION['dir']['ext_cal'] ?>/resources/css/calendar-colors.css" />
<link rel="stylesheet" type="text/css" href="lib/<?php echo $_SESSION['dir']['ext_cal'] ?>/examples/examples.css" />
<!--ens calendar css-->
<link rel="stylesheet" type="text/css" href="ui_app/style_newui.css" >
<link rel="stylesheet" type="text/css" href="ui_app/mitosehr_app.css" >
<link rel="shortcut icon" href="favicon.ico" >
<!--<script type="text/javascript" src="app/App.js"></script>-->
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
                    'Ext.ux'            : '<?php echo $_SESSION["dir"]["ext_classes"]; ?>/ux',
                    'Ext.mitos'         : '<?php echo $_SESSION["dir"]["ext_classes"]; ?>',
                    'Ext.mitos.panel'   : 'app',
                    'Extensible'        : 'lib/extensible-1.5.0/src'
                }
            });

            window.onbeforeunload = function() {
                Ext.Ajax.request({
                    url     : 'app/login/data.php?task=unAuth'
                });
                alert('You have been logged off MitosEHR');

            };
        </script>

        <script type="text/javascript" src="classes/ext/NodeDisabled.js"></script>

        <script type="text/javascript" src="classes/ext/RenderPanel.js"></script>

        <script type="text/javascript" src="app/dashboard/Dashboard.js"></script>
        <script type="text/javascript" src="lib/extensible-1.5.0/src/calendar/data/EventStore.js"></script>
        <script type="text/javascript" src="classes/ext/ux/SlidingPager.js"></script>


        <script type="text/javascript" src="classes/ext/GridPanel.js"></script>
        <script type="text/javascript" src="classes/ext/LivePatientSearch.js"></script>
        <script type="text/javascript" src="classes/ext/ManagedIframe.js"></script>
        <script type="text/javascript" src="classes/ext/PhotoIdWindow.js"></script>
        <script type="text/javascript" src="classes/ext/restStoreModel.js"></script>
        <script type="text/javascript" src="classes/ext/CalCategoryComboBox.js"></script>
        <script type="text/javascript" src="classes/ext/CalStatusComboBox.js"></script>

        <script type="text/javascript" src="classes/ext/combo/Authorizations.js"></script>
        <script type="text/javascript" src="classes/ext/combo/CodesTypes.js"></script>
        <script type="text/javascript" src="classes/ext/combo/Facilities.js"></script>
        <script type="text/javascript" src="classes/ext/combo/InsurancePayerType.js"></script>
        <script type="text/javascript" src="classes/ext/combo/Languages.js"></script>
        <script type="text/javascript" src="classes/ext/combo/Lists.js"></script>
        <script type="text/javascript" src="classes/ext/combo/MsgNoteType.js"></script>
        <script type="text/javascript" src="classes/ext/combo/MsgStatus.js"></script>
        <script type="text/javascript" src="classes/ext/combo/PermValues.js"></script>
        <script type="text/javascript" src="classes/ext/combo/posCodes.js"></script>
        <script type="text/javascript" src="classes/ext/combo/Roles.js"></script>
        <script type="text/javascript" src="classes/ext/combo/TaxId.js"></script>
        <script type="text/javascript" src="classes/ext/combo/Titles.js"></script>
        <script type="text/javascript" src="classes/ext/combo/TransmitMedthod.js"></script>
        <script type="text/javascript" src="classes/ext/combo/Types.js"></script>
        <script type="text/javascript" src="classes/ext/combo/Users.js"></script>


        <script type="text/javascript" src="classes/ext/form/fields/Checkbox.js"></script>
        <script type="text/javascript" src="classes/ext/form/fields/DateTime.js"></script>


        <script type="text/javascript" src="app/patientfile/visits/Visits.js"></script>
        <script type="text/javascript" src="app/patientfile/summary/Summary.js"></script>
        <script type="text/javascript" src="app/patientfile/encounter/Encounter.js"></script>
        <script type="text/javascript" src="app/patientfile/new/NewPatient.js"></script>


        <script type="text/javascript" src="app/administration/facilities/Facilities.js"></script>
        <script type="text/javascript" src="app/administration/globals/Globals.js"></script>
        <script type="text/javascript" src="app/administration/layout/Layout.js"></script>
        <script type="text/javascript" src="app/administration/lists/Lists.js"></script>
        <script type="text/javascript" src="app/administration/log/Log.js"></script>
        <script type="text/javascript" src="app/administration/practice/Practice.js"></script>
        <script type="text/javascript" src="app/administration/roles/Roles.js"></script>
        <script type="text/javascript" src="app/administration/services/Services.js"></script>
        <script type="text/javascript" src="app/administration/users/Users.js"></script>

        <script type="text/javascript" src="app/messages/Messages.js"></script>
        <script type="text/javascript" src="app/search/PatientSearch.js"></script>

        <script type="text/javascript" src="app/miscellaneous/addressbook/Addressbook.js"></script>
        <script type="text/javascript" src="app/miscellaneous/myaccount/MyAccount.js"></script>
        <script type="text/javascript" src="app/miscellaneous/mysettings/MySettings.js"></script>
        <script type="text/javascript" src="app/miscellaneous/officenotes/OfficeNotes.js"></script>
        <script type="text/javascript" src="app/miscellaneous/websearch/Websearch.js"></script>


        <script type="text/javascript" src="app/MitosApp.js"></script>



        <script type="text/javascript">
            var App;
            Ext.onReady(function(){
                App = Ext.create('Ext.mitos.panel.MitosApp');
            });
        </script>
    </body>
</html>