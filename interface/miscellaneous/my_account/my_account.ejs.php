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
	
	Ext.QuickTips.init();

	var rowPos; // Stores the current Grid Row Position (int)
	var currRec; // Store the current record (Object)

	// *************************************************************************************
	// If a object called winUser exists destroy it, to create a new one.
	// *************************************************************************************
	if ( Ext.getCmp('winUsers') ){ Ext.getCmp('winUsers').destroy(); }

	// *************************************************************************************
	// Users Model and Data store
	// *************************************************************************************
	if (!Ext.ModelManager.isRegistered('Users')){
	Ext.define("Users", {extend: "Ext.data.Model", fields: [
			{name: 'id',                    type: 'int'},
			{name: 'username',              type: 'string'},
			{name: 'password',              type: 'auto'},
			{name: 'authorizedd',           type: 'string'},
			{name: 'authorized',            type: 'string'},
			{name: 'actived',            	type: 'string'},
			{name: 'active',            	type: 'string'},
			{name: 'info',                  type: 'string'},
			{name: 'source',                type: 'int'},
			{name: 'fname',                 type: 'string'},
			{name: 'mname',                 type: 'string'},
			{name: 'lname',                 type: 'string'},
			{name: 'fullname',              type: 'string'},
			{name: 'federaltaxid',          type: 'string'},
			{name: 'federaldrugid',         type: 'string'},
			{name: 'upin',                  type: 'string'},
			{name: 'facility',              type: 'string'},
			{name: 'facility_id',           type: 'auto'},
			{name: 'see_auth',              type: 'auto'},
			{name: 'active',                type: 'auto'},
			{name: 'npi',                   type: 'string'},
			{name: 'title',                 type: 'string'},
			{name: 'specialty',             type: 'string'},
			{name: 'billname',              type: 'string'},
			{name: 'email',                 type: 'string'},
			{name: 'url',                   type: 'string'},
			{name: 'assistant',             type: 'string'},
			{name: 'organization',          type: 'string'},
			{name: 'valedictory',           type: 'string'},
			{name: 'fulladdress',           type: 'string'},
			{name: 'cal_ui',                type: 'string'},
			{name: 'taxonomy',              type: 'string'},
			{name: 'ssi_relayhealth',       type: 'string'},
			{name: 'calendar',              type: 'int'},
			{name: 'abook_type',            type: 'string'},
			{name: 'pwd_expiration_date',   type: 'string'},
			{name: 'pwd_history1',          type: 'string'},
			{name: 'pwd_history2',          type: 'string'},
			{name: 'default_warehouse',     type: 'string'},
			{name: 'ab_name',               type: 'string'},
			{name: 'ab_title',              type: 'string'}
		],
	});
	}
	var storeUsers = new Ext.data.Store({
	    model		: 'Users',
		noCache		: true,
    	autoSync	: false,
	    proxy		: {
	    	type	: 'ajax',
			api		: {
				read	: 'interface/administration/users/data_read.ejs.php',
				create	: 'interface/administration/users/data_create.ejs.php',
				update	: 'interface/administration/users/data_update.ejs.php',
				destroy : 'interface/administration/users/data_destroy.ejs.php'
			},
	        reader: {
	            type			: 'json',
	            idProperty		: 'id',
	            totalProperty	: 'totals',
	            root			: 'row'
	    	},
	    	writer: {
				type	 		: 'json',
				writeAllFields	: true,
				allowSingle	 	: true,
				encode	 		: true,
				root	 		: 'row'
			}
	    },
	    autoLoad: true
	});
	function authCk(val) {
	    if (val == 'Yes') {
	        return '<img src="ui_icons/yes.gif" />';
	    } else if(val == 'No') {
	        return '<img src="ui_icons/no.gif" />';
	    } 
	    return val;
	}
	// *************************************************************************************
	// Structure, data for Titles
	// AJAX -> component_data.ejs.php
	// *************************************************************************************
	if (!Ext.ModelManager.isRegistered('Titles')){
	Ext.define("Titles", {extend: "Ext.data.Model", fields: [
		{name: 'option_id', type: 'string'},
	    {name: 'title', type: 'string'}
	],
		idProperty: 'option_id'
	});
	}
	var storeTitles = new Ext.data.Store({
		model		: 'Titles',
		proxy		: {
			type	: 'ajax',
			url		: 'interface/administration/users/component_data.ejs.php?task=titles',
			reader	: {
				type			: 'json',
				idProperty		: 'option_id',
				totalProperty	: 'totals',
				root			: 'row'
			}
		},
		autoLoad: true
	}); // End storeTitles

	// *************************************************************************************
	// Structure, data for Types
	// AJAX -> component_data.ejs.php
	// *************************************************************************************
	if (!Ext.ModelManager.isRegistered('Types')){
	Ext.define("Types", {extend: "Ext.data.Model", fields: [
		{name: 'option_id', type: 'string'},
	    {name: 'title', type: 'string'}
	],
		idProperty: 'option_id'
	});
	}
	var storeTypes = new Ext.data.Store({
		model		: 'Types',
		proxy		: {
			type	: 'ajax',
			url		: 'interface/administration/users/component_data.ejs.php?task=types',
			reader	: {
				type			: 'json',
				idProperty		: 'option_id',
				totalProperty	: 'totals',
				root			: 'row'
			}
		},
		autoLoad: true
	}); // End storeTypes
	
	// *************************************************************************************
	// Structure, data for Facilities
	// AJAX -> component_data.ejs.php
	// *************************************************************************************
	if (!Ext.ModelManager.isRegistered('Facilities')){
	Ext.define("Facilities", {extend: "Ext.data.Model", fields: [
		{name: 'id', type: 'string'},
	    {name: 'name', type: 'string'}
	],
		idProperty: 'id'
	});
	}
	var storeFacilities = new Ext.data.Store({
		model		: 'Facilities',
		proxy		: {
			type	: 'ajax',
			url		: 'interface/administration/users/component_data.ejs.php?task=facilities',
			reader	: {
				type			: 'json',
				idProperty		: 'id',
				totalProperty	: 'totals',
				root			: 'row'
			}
		},
		autoLoad: true
	}); // End storeFacilities
	
	// *************************************************************************************
	// Structure, data for AccessControls
	// AJAX -> component_data.ejs.php
	// *************************************************************************************
	if (!Ext.ModelManager.isRegistered('AccessControls')){
	Ext.define("AccessControls", {extend: "Ext.data.Model", fields: [
		{name: 'id', type: 'string'},
	    {name: 'role_name', type: 'string'}
	],
		idProperty: 'id'
	});
	}
	var storeAccessControls = new Ext.data.Store({
		model		: 'AccessControls',
		proxy		: {
			type	: 'ajax',
			url		: 'interface/administration/users/component_data.ejs.php?task=accessControls',
			reader	: {
				type			: 'json',
				idProperty		: 'id',
				totalProperty	: 'totals',
				root			: 'row'
			}
		},
		autoLoad: true
	}); // End storeFacilities
	
	
	// *************************************************************************************
	// Structure, data for storeSeeAuthorizations
	// AJAX -> component_data.ejs.php
	// *************************************************************************************
	Ext.namespace('Ext.data');
	Ext.data.authorizations = [
	    ['1', 'None'],
	    ['2', 'Only Mine'],
	    ['3', 'All']
	];
	var storeSeeAuthorizations = new Ext.data.ArrayStore({
	    fields: ['id', 'name'],
	    data : Ext.data.authorizations
	});
	// *************************************************************************************
	// User Settinga Form
	// Add or Edit purpose
	// *************************************************************************************
	var myAccountForm = new Ext.form.FormPanel({
		id          : 'myAccountForm',
		bodyStyle   : 'padding: 5px;',
		autoWidth   : true,
		border      : false,
		cls			: 'form-white-bg',
		frame       : true,
		hideLabels  : true,
		defaults: {
			labelWidth: 89,
		    //anchor: '100%',
		    layout: {
		    	type: 'hbox',
		        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
		    }
		},
		items: [{
			xtype: 'textfield', hidden: true, id: 'id', name: 'id'
		},{ 
			xtype:'fieldset',
	        title: '<?php i18n('Personal Info'); ?>',
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
		      xtype: 'fieldcontainer',
		      	defaults: { hideLabel: true },
		      	msgTarget : 'under', 
		      	xtype: 'fieldcontainer',
		      	defaults: { hideLabel: true },
		      	msgTarget : 'under', 
		      	items: [
		        	{ width: 110, xtype: 'displayfield', value: '<?php i18n('First, Middle, Last'); ?>: '},
		        	{ width: 60,  xtype: 'combo',     id: 'cb_title', name: 'title', editable: false, displayField: 'title', queryMode: 'local', store: storeTitles },
		        	{ width: 105,  xtype: 'textfield', id: 'fname', name: 'fname' },
		        	{ width: 100,  xtype: 'textfield', id: 'mname', name: 'mname' },
		        	{ width: 175, xtype: 'textfield', id: 'lname', name: 'lname' },
		      	]
		    }]
		},{
	    	xtype:'fieldset',
	        title: '<?php i18n('Login Info'); ?>',
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
		      xtype: 'fieldcontainer',
		      	defaults: { hideLabel: true },
		      	msgTarget : 'under', 
		      	items: [
		        	{ width: 110, xtype: 'displayfield', value: '<?php i18n('Username'); ?>: '},
		        	{ width: 150, xtype: 'textfield', id: 'username', name: 'username' },
		        	{ width: 120, xtype: 'displayfield', value: '<?php i18n('Password'); ?>: '},
		        	{ width: 175, xtype: 'textfield', id: 'password', name: 'password',  inputType: 'password' }
		      	]
		    }]
	    },{
	    	xtype:'fieldset',
	        title: '<?php i18n('Other Info'); ?>',
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
		      	xtype: 'fieldcontainer',
		      	defaults: { hideLabel: true },
		      	msgTarget : 'under', 
		      	items: [
		        	{ width: 110, xtype: 'displayfield', value: '<?php i18n('Default Facility'); ?>: '},
		        	{ width: 170, xtype: 'combo', id: 'cb_facility_id', name: 'facility_id', editable: false, displayField: 'name', valueField: 'id', queryMode: 'local', store: storeFacilities, emptyText:'Select ' },
		        	{ width: 100, xtype: 'displayfield', value: '<?php i18n('Authorizations'); ?>: '},
		        	{ width: 175, xtype: 'combo', id: 'cb_see_auth', name: 'see_auth', editable: false, displayField: 'name', valueField: 'id', queryMode: 'local', store: storeSeeAuthorizations, emptyText:'Select ' }
		      	] 
		    },{ 
		      	xtype: 'fieldcontainer',
		      	defaults: { hideLabel: true },
		      	items: [
		        	{ width: 110, xtype: 'displayfield', value: '<?php i18n('Access Control'); ?>: '},
		        	{ width: 170, xtype: 'combo', id: 'cb_none', name: 'none', autoSelect: true, displayField: 'name', valueField: 'value', queryMode: 'local', store: storeAccessControls, emptyText:'Select ' },
		        	{ width: 100, xtype: 'displayfield', value: '<?php i18n('Taxonomy'); ?>: '},
		        	{ width: 175, xtype: 'textfield', id: 'taxonomy',  name: 'taxonomy' }
		      	]
		    },{ 
		      	xtype: 'fieldcontainer',
		      	defaults: { hideLabel: true },
		      	items: [
		        	{ width: 110, xtype: 'displayfield', value: '<?php i18n('Federal Tax ID'); ?>: '},
		        	{ width: 170, xtype: 'textfield', id: 'federaltaxid', name: 'federaltaxid' },
		        	{ width: 100, xtype: 'displayfield', value: '<?php i18n('Fed Drug ID'); ?>: '},
		        	{ width: 175, xtype: 'textfield', id: 'federaldrugid', name: 'federaldrugid' }
		      	]
		    },{
		      	xtype: 'fieldcontainer',
		      	defaults: { hideLabel: true },
		      	items: [
		       		{ width: 110, xtype: 'displayfield', value: '<?php i18n('UPIN'); ?>: '},
		        	{ width: 170, xtype: 'textfield', id: 'upin', name: 'upin' },
		        	{ width: 100, xtype: 'displayfield', value: '<?php i18n('NPI'); ?>: '},
		        	{ width: 175, xtype: 'textfield', id: 'npi', name: 'npi' }
		      	]
		    },{ 
		      	xtype: 'fieldcontainer',
		      	defaults: { hideLabel: true },
		      	items: [
		       		{ width: 110, xtype: 'displayfield', value: '<?php i18n('Job Description'); ?>: '},
		        	{ width: 455, xtype: 'textfield', id: 'specialty', name: 'specialty' },
		      	]  
		    },{
		    	width: 110, xtype: 'displayfield', value: '<?php i18n('Notes'); ?>: '
		    },{
		    	xtype: 'htmleditor', id: 'info', name: 'info', emptyText: 'info'
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
		  	},'-',{
		  		text      	: '<?php i18n("Change Password"); ?>',
			    iconCls   	: 'save',
			    id        	: 'cmdSavePass',
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




