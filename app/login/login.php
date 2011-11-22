<?php
if(!defined('_MitosEXEC')) die('No direct access allowed.');
/* Logon Screen Window
 * Description: Obviously the Logon Window. I think every WebApp has one.
 * 
 * author: GI Technologies, 2011
 * Version 0.0.3
 * Revision: N/A
 */
?>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title>MitosEHR Logon Screen</title>
<script type="text/javascript" src="lib/<?php echo $_SESSION['dir']['ext']; ?>/bootstrap.js"></script>
<script type="text/javascript" src="repo/global_functions/global_functions.js"></script>
<link rel="stylesheet" type="text/css" href="themes/resources/css/ext-all-gray.css">
    <link rel="stylesheet" type="text/css" href="lib/<?php echo $_SESSION['dir']['ext_cal'] ?>/examples/examples.css" />
<link rel="stylesheet" type="text/css" href="ui_app/style_newui.css" >
<link rel="stylesheet" type="text/css" href="ui_app/mitosehr_app.css" >

<link rel="shortcut icon" href="favicon.ico" >
<script type="text/javascript" src="app/login/Login.js"></script>
<script type="text/javascript">
Ext.onReady(function(){
    Ext.create('Ext.mitos.panel.login.Login');
}); // End App
</script>
</head>
<body id="login">
<span id="app-msg" style="display:none;"></span>
<div id="copyright">MitosEHR | <a href="javascript:void(0)" onClick="Ext.getCmp('winCopyright').show();" >Copyright Notice</a></div>
</body>
</html>