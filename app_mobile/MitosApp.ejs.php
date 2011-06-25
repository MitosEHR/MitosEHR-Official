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
<title><?php echo $_SESSION['global_settings']['mitosehr_name'] ?></title>
<link rel="stylesheet" href="lib/touch-1.1.0/resources/css/sencha-touch.css" type="text/css">
<script type="text/javascript" src="lib/touch-1.1.0/sencha-touch-debug.js"></script>
<link rel="shortcut icon" href="favicon.ico" >
<script type="text/javascript">
// *************************************************************************************
// Start MitosEHR Mobile App
// *************************************************************************************
Ext.onReady(function() {


    
}); // End App
</script>
</head>
<body><span id="app-msg" style="display:none;"></span></body>
</html>