<?php 
//******************************************************************************
// facilities.ejs.php
// Description: Facilities Screen
// v0.0.3
// 
// Author: Gino Rivera Falú
// Modified: n/a
// 
// MitosEHR (Eletronic Health Records) 2011
//******************************************************************************

include_once("../../../registry.php");
include_once("../../../library/I18n/I18n.inc.php");

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;

?>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title>MitosEHR</title>
<script type="text/javascript" src="../../../library/<?php echo $_SESSION['dir']['ext']; ?>/bootstrap.js"></script>

<link rel="stylesheet" type="text/css" href="l../../../ibrary/<?php echo $_SESSION['dir']['ext']; ?>/resources/css/ext-all.css">
<link rel="stylesheet" type="text/css" href="../../../ui_app/style_newui.css" >
<link rel="stylesheet" type="text/css" href="../../../ui_app/mitosehr_app.css" >

<script type="text/javascript">
Ext.require([
	'Ext.form.*',
	'Ext.button.*',
	'Ext.window.*',
	'Ext.data.*',
	'Ext.Loader',
	'Ext.tip.QuickTips'
]);
Ext.onReady(function(){

var topRenderPanel = Ext.create('Ext.Panel', {
	title: '<?php i18n('Facilities'); ?>',
	renderTo: Ext.getCmp('MainApp').body,
  	frame : false,
	border : false,
	id: 'topRenderPanel',
});

}); // End ExtJS

</script>