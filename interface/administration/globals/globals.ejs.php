<?php 
//******************************************************************************
// Users.ejs.php
// Description: Users Screen
// v0.0.4
// 
// Author: Ernesto J Rodriguez
// Modified: n/a
// 
// MitosEHR (Eletronic Health Records) 2011
//******************************************************************************

session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once("../../../library/I18n/I18n.inc.php");

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;
?>

<script type="text/javascript">

Ext.onReady(function(){


var globalFormPanel = Ext.create('Ext.form.Panel', {
		border: false,
		layout: 'fit',
        fieldDefaults: { labelAlign: 'top', msgTarget: 'side' },
        defaults: { anchor: '100%' },
        items: [{
            xtype:'tabpanel',
            activeTab: 0,
            defaults:{bodyStyle:'padding:10px'},
            items:[{
                title:'Appearance',
                defaults: {width: 230},
                defaultType: 'textfield',
                items: [
				
				]
            },{
                title:'Locale',
                defaults: {width: 230},
                defaultType: 'textfield',
                items: [
				
				]
			},{
                title:'Calendar',
                defaults: {width: 230},
                defaultType: 'textfield',
                items: [
				
				]
			},{
                title:'Security',
                defaults: {width: 230},
                defaultType: 'textfield',
                items: [
				
				]
			},{
                title:'Notifocations',
                defaults: {width: 230},
                defaultType: 'textfield',
                items: [
				
				]
			},{
                title:'Loging',
                defaults: {width: 230},
                defaultType: 'textfield',
                items: [
				
				]
			},{
                title:'Miscellaneus',
                defaults: {width: 230},
                defaultType: 'textfield',
                items: [
				
				]
			},{
                title:'Conectors',
                defaults: {width: 230},
                defaultType: 'textfield',
                items: [
				
				]
            }],
			dockedItems: [{
		  	  	xtype: 'toolbar',
			  	dock: 'bottom',
			  	items: [{
					id        : 'addAddressbook',
				    text      : '<?php i18n("Save Configuration"); ?>',
				    iconCls   : 'icoAddressBook',
				    handler   : function(){
						//*** SAVE FUNCTION - TODO ***//
				    }
			  	}]
			}]
        }]	
    });

	//******************************************************************************
	// Render panel
	//******************************************************************************
	var topRenderPanel = Ext.create('Ext.panel.Panel', {
		title		: '<?php i18n('MitosEHR Globals'); ?>',
		renderTo	: Ext.getCmp('MainApp').body,
		layout		: 'fit',
		height		: Ext.getCmp('MainApp').getHeight(),
	  	frame 		: false,
		border 		: false,
		id			: 'topRenderPanel',
		items		: [globalFormPanel]
	});
}); // End ExtJS
</script>