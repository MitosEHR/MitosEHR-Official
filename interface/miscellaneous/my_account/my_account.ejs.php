<?php 
//******************************************************************************
// new.ejs.php
// New Patient Entry Form
// v0.0.1
// 
// Author: Ernest Rodriguez
// Modified: Gino Rivera
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
// *************************************************************************************
// Sencha trying to be like a language
// using requiered to load diferent components
// *************************************************************************************
Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux', '<?php echo $_SESSION['dir']['ux']; ?>');
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.toolbar.Paging',
    'Ext.TaskManager.*',
    'Ext.ux.SlidingPager'
]);

Ext.onReady(function(){
	// *************************************************************************************
	// User Settinga Form
	// Add or Edit purpose
	// *************************************************************************************
	var myAccountForm = new Ext.form.FormPanel({
	  	id          : 'myAccountForm',
	  	bodyStyle   : 'padding: 10px;',
		frame		: true,
		cls			: 'form-white-bg',
	  	autoWidth   : true,
		hideLabels  : true,
	 	items: [{
	 		xtype: 'textfield', hidden: true, id: 'id', name: 'id'
	 	},{
		 	xtype:'fieldset',
	        title: '<?php i18n('Personal'); ?>',
	        collapsible: true,
	        defaultType: 'textfield',
	        defaults: {anchor: '100%'},
	        layout: 'anchor',
	        defaults: {
				labelWidth: 89,
			    anchor: '100%',
			    layout: {
			    	type: 'hbox',
			        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
			    }
			},
	        items :[{
				// fileds
			},{
			
			},{
			
			},{
			
			},{
			
			},{
			
		    }]
	    },{
	    	xtype:'fieldset',
	        title: '<?php i18n('Cahnge Password'); ?>',
	        collapsible: true,
	        defaultType: 'textfield',
	        defaults: {anchor: '100%'},
	        layout: 'anchor',
	        defaults: {
				labelWidth: 89,
			    anchor: '100%',
			    layout: {
			    	type: 'hbox',
			        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
			    }
			},
	        items :[{
		       // fileds
		    },{
			
			},{
			
		    }]
	    },{ 
	    	xtype:'fieldset',
	        title: '<?php i18n('Other'); ?>',
	        collapsible: true,
	        defaultType: 'textfield',
	        defaults: {anchor: '100%'},
	        layout: 'anchor',
	        defaults: {
				labelWidth: 89,
			    anchor: '100%',
			    layout: {
			    	type: 'hbox',
			        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
			    }
			},
	        items :[{
		    	// fileds
		    },{
			
			},{
			
		    }]  
		}],
		dockedItems: [{
	  	  	xtype: 'toolbar',
		  	dock: 'top',
		  	items: [{
			    text      	: '<?php i18n("Save"); ?>',
			    iconCls   	: 'save',
			    id        	: 'cmdSave',
			   // disabled	: true,
			    handler   : function(){

			    }
		  	}]
		}]
	});

	
	//******************************************************************************
	// Render panel
	//******************************************************************************
	var topRenderPanel = Ext.create('Ext.panel.Panel', {
		renderTo	: Ext.getCmp('MainApp').body,
		layout		: 'border',
		height		: Ext.getCmp('MainApp').getHeight(),
	  	frame 		: false,
		border 		: false,
		id			: 'topRenderPanel',
		items		: [{
			id: 'topRenderPanel-header',
			xtype: 'box',
			region: 'north',
			height: 40,
			html: '<?php i18n('My Account'); ?>'
		
		},{
			id		: 'topRenderPanel-body',
			xtype	: 'panel',
			region	: 'center',
			layout	: 'fit',
			height	: Ext.getCmp('MainApp').getHeight() - 40,
			border 	: false,
			defaults: {frame:true, border:true, autoScroll:true},
			items	: [myAccountForm]
		}]
	});
}); // End ExtJS
</script>




