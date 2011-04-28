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
	//**************************************************************************
	// Dummy Store
	//**************************************************************************
	Ext.namespace('Ext.data');
	Ext.data.dummy = [
	    ['Option 1', 'Option 1'],
	    ['Option 2', 'Option 2'],
	    ['Option 3', 'Option 3'],
	    ['Option 5', 'Option 5'],
	    ['Option 6', 'Option 6'],
	    ['Option 7', 'Option 7']
	];
	var dummyStore = new Ext.data.ArrayStore({
	    fields: ['name', 'value'],
	    data : Ext.data.dummy
	});
	//**************************************************************************
	// Dummy Store
	//**************************************************************************
	var globalFormPanel = Ext.create('Ext.form.Panel', {
		border: false,
		layout: 'fit',
		autoScroll:true,
        fieldDefaults: { msgTarget: 'side', labelWidth: 200, width: 500 },
        defaults: { anchor: '100%' },
        items: [{
            xtype:'tabpanel',
            activeTab: 0,
            defaults:{bodyStyle:'padding:10px', autoScroll:true },
            items:[{
                title:'Appearance',
                defaults: {anchor: '100%'},
                items: [{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Main Top Pane Screen'); ?>',
					name		: 'mainPaneScreen',
					id			: 'mainPaneScreen',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Layout Style'); ?>',
					name		: 'layoutStyle',
					id			: 'layoutStyle',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Theme'); ?>',
					name		: 'theme',
					id			: 'theme',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'textfield',
					fieldLabel	: '<?php i18n('Navigation Area Width'); ?>',
					name		: 'navWidth',
					id			: 'navWidth'
				},{
					xtype		: 'textfield',
					fieldLabel	: '<?php i18n('Application Title'); ?>',
					name		: 'appTitle',
					id			: 'appTitle'
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('New Patient Form'); ?>',
					name		: 'newPatientForm',
					id			: 'newPatientForm', 
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Patient Search Resuls Style'); ?>',
					name		: 'patientSearchStyle',
					id			: 'patientSearchStyle',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Tall Navigation Area'); ?>',
					name		: 'tallNavArea',
					id			: 'tallNavArea'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Navigation Area Visit Form'); ?>',
					name		: 'navAreaVisitForm',
					id			: 'navAreaVisitForm'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Simplified Demographics'); ?>',
					name		: 'simpleDemo',
					id			: 'simpleDemo'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Simplified Prescriptions'); ?>',
					name		: 'simplePrescription',
					id			: 'simplePrescription'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Simplified Co-Pay'); ?>',
					name		: 'simpleCoPay',
					id			: 'simpleCoPay'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('User Charges Panel'); ?>',
					name		: 'userChargesPanel',
					id			: 'userChargesPanel'
				},{
					xtype		: 'textfield',
					fieldLabel	: '<?php i18n('Online Support Link'); ?>',
					name		: 'supportLink',
					id			: 'supportLink'
				}]
            },{
                title:'Locale',
                //defaults: {},
                defaultType: 'textfield',
                items: [{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Default Language'); ?>',
					name		: 'deflang',
					id			: 'deflang',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('All Language Allowed'); ?>',
					name		: 'allLangAllowed',
					id			: 'allLangAllowed'
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Allowed Languages'); ?>',
					name		: 'allowedlang',
					id			: 'allowedlang',
					displayField: 'name',
					valueField	: 'value',
					multiSelect	: true,
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Allow Debuging Language'); ?>',
					name		: 'debugLang',
					id			: 'debugLang'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Translate Layouts'); ?>',
					name		: 'transLayout',
					id			: 'transLayout'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Translate List'); ?>',
					name		: 'transList',
					id			: 'transList'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Translate Access Control Roles'); ?>',
					name		: 'transACL',
					id			: 'transACL'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Translate Patient Note Titles'); ?>',
					name		: 'transPattientNotes',
					id			: 'transPattientNotes'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Translate Documents Categoies'); ?>',
					name		: 'transDocsCat',
					id			: 'transDocsCat'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Translate Appointment Categories'); ?>',
					name		: 'transAppCat',
					id			: 'transAppCat'
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Units for Visits Forms'); ?>',
					name		: 'unitVisitsForm',
					id			: 'unitVisitsForm',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Disable Old Metric Vitals Form'); ?>',
					name		: 'disableMetrilVit',
					id			: 'disableMetrilVit'
				},{
					xtype		: 'textfield',
					fieldLabel	: '<?php i18n('Telephone Country Code'); ?>',
					name		: 'telCode',
					id			: 'telCode'
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Date Display Format'); ?>',
					name		: 'dateFormat',
					id			: 'dateFormat',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Time Display Format'); ?>',
					name		: 'timeFormat',
					id			: 'timeFormat',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Currency Decimal Paoint Symbol'); ?>',
					name		: 'currencyDecSym',
					id			: 'currencyDecSym',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Currency Thousands Separator'); ?>',
					name		: 'currThousandsSep',
					id			: 'currThousandsSep',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'textfield',
					fieldLabel	: '<?php i18n('Currency Designator'); ?>',
					name		: 'currdesig',
					id			: 'currdesig'
				}]
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
				    iconCls   : 'icoSave',
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