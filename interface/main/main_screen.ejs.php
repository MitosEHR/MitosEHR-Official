<?php
/* Logon Screen Window
 * 
 * version 0.0.2
 * revision: N/A
 * author: Gino Rivera Falu
 */

include_once ("../registry.php");
include_once($_SESSION['site']['root']."/library/adoHelper/adoHelper.inc.php");
include_once($_SESSION['site']['root']."/library/I18n/I18n.inc.php");

?>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<TITLE><?php i18n('Login'); ?></TITLE>

<script type="text/javascript" src="../../library/<?php echo $_SESSION['dir']['ext']; ?>/bootstrap.js"></script>

<link rel="stylesheet" type="text/css" href="../../library/<?php echo $_SESSION['dir']['ext']; ?>/resources/css/ext.css">
<link rel="stylesheet" type="text/css" href="../../library/<?php echo $_SESSION['dir']['ext']; ?>/resources/css/ext4.css">
<link rel="stylesheet" type="text/css" href="../../ui_app/style_newui.css" >
<link rel="stylesheet" type="text/css" href="../../ui_app/mitosehr_app.css" >

<script type="text/javascript">
Ext.require([
	'Ext.form.*',
    'Ext.window.*',
    'Ext.data.*',
    'Ext.tip.QuickTips'
]);
Ext.onReady(function() {

Ext.create('Ext.Viewport', {
	layout: {
		type: 'border',
		padding: 5
	},
	defaults: {
		split: true
	},
	items: [{
		region: 'west',
		collapsible: true,
		floatable: true,
		title: '<?php i18n('Navigation'); ?>',
		split: true,
		width: 200,
		html: 'west<br>I am floatable'
	},{
		region: 'center',
		title: 'Center',
		layout: 'border',
		border: false,
		items: [{
			region: 'center',
			html: 'center center',
			items: [cw = Ext.create('Ext.Window', {
				xtype: 'window',
				closable: false,
				minimizable: true,
				title: 'Constrained Window',
				height: 200,
				width: 400,
				constrain: true,
				html: 'I am in a Container',
				itemId: 'center-window',
				minimize: function() {
					this.floatParent.down('button#toggleCw').toggle();
				}
			})],
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'bottom',
				items: [{
					itemId: 'toggleCw',
					text: 'Constrained Window',
					enableToggle: true,
					toggleHandler: function() {
						cw.setVisible(!cw.isVisible());
					}
					}]
                }]
            },{
                region: 'south',
                height: 100,
                split: true,
                collapsible: true,
                title: 'Splitter above me',
                margins: '0 0 0 0',
                html: 'center south'
            }]
        }]
    });
});

</script>