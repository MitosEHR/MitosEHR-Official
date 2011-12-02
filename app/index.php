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
        <script type="text/javascript" src="repo/global_functions/global_functions.js"></script>
        <script type="text/javascript" src="lib/<?php echo $_SESSION['dir']['ext_cal'] ?>/src/Extensible.js"></script>
        <script type="text/javascript" src="lib/<?php echo $_SESSION['dir']['ext_cal'] ?>/examples/examples.js"></script>
        <script type="text/javascript">
        Ext.Loader.setConfig({
            enabled			: true,
            disableCaching	: false,
            paths			: {
                'Ext.ux'            : '<?php echo $_SESSION["dir"]["ext_classes"]; ?>/ux',
                'Ext.mitos'         : '<?php echo $_SESSION["dir"]["ext_classes"]; ?>/mitos',
                'Ext.mitos.panel'   : 'app',
                'Extensible'        : 'lib/extensible-1.5.0/src'
            }
        });
        Ext.onReady(function(){
            Ext.create('Ext.mitos.panel.MitosApp');
        });
        </script>
    </body>
</html>