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
        fieldDefaults: { msgTarget: 'side', labelWidth: 220, width: 500 },
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
                title:'Features',
                defaultType: 'checkbox',
                items: [{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Specific Application'); ?>',
					name		: 'Feat1',
					id			: 'Feat1',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Drugs and Prodructs'); ?>',
					name		: 'Feat2',
					id			: 'Feat2',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					fieldLabel	: '<?php i18n('Disable Chart Tracker'); ?>',
					name		: 'Feat3',
					id			: 'Feat3'
				},{
					fieldLabel	: '<?php i18n('Disable Immunizations'); ?>',
					name		: 'Feat4',
					id			: 'Feat4'
				},{
					fieldLabel	: '<?php i18n('Disable Prescriptions'); ?>',
					name		: 'Feat5',
					id			: 'Feat5'
				},{
					fieldLabel	: '<?php i18n('Imit Employers'); ?>',
					name		: 'Feat6',
					id			: 'Feat6'
				},{
					fieldLabel	: '<?php i18n('Support Multi-Provider Events'); ?>',
					name		: 'Feat7',
					id			: 'Feat7'
				},{
					fieldLabel	: '<?php i18n('Disable User Groups'); ?>',
					name		: 'Feat8',
					id			: 'Feat8'
				},{
					fieldLabel	: '<?php i18n('Skip Authorization of Patient Notes'); ?>',
					name		: 'Feat9',
					id			: 'Feat9'
				},{
					fieldLabel	: '<?php i18n('Allow Encounters Claims'); ?>',
					name		: 'Feat10',
					id			: 'Feat10'
				},{
					fieldLabel	: '<?php i18n('Advance Directives Warning'); ?>',
					name		: 'Feat11',
					id			: 'Feat11'
				},{
					fieldLabel	: '<?php i18n('Configuration Export/Import'); ?>',
					name		: 'Feat12',
					id			: 'Feat12'
				},{
					fieldLabel	: '<?php i18n('Restrict Users to Facilities'); ?>',
					name		: 'Feat13',
					id			: 'Feat13'
				},{
					fieldLabel	: '<?php i18n('Remember Selected Facility'); ?>',
					name		: 'Feat14',
					id			: 'Feat14'
				},{
					fieldLabel	: '<?php i18n('Discounts as monetary Ammounts'); ?>',
					name		: 'Feat15',
					id			: 'Feat15'
				},{
					fieldLabel	: '<?php i18n('Referral Source for Encounters'); ?>',
					name		: 'Feat16',
					id			: 'Feat16'
				},{
					fieldLabel	: '<?php i18n('Maks for Patients IDs'); ?>',
					xtype		: 'textfield',
					name		: 'Feat17',
					id			: 'Feat17'
				},{
					fieldLabel	: '<?php i18n('Mask of Invoice Numbers'); ?>',
					xtype		: 'textfield',
					name		: 'Feat18',
					id			: 'Feat18'
				},{
					fieldLabel	: '<?php i18n('Mask for Product IDs'); ?>',
					xtype		: 'textfield',
					name		: 'Feat19',
					id			: 'Feat19'
				},{
					fieldLabel	: '<?php i18n('Force Billing Widget Open'); ?>',
					name		: 'Feat20',
					id			: 'Feat20'
				},{
					fieldLabel	: '<?php i18n('Actiate CCR/CCD Reporting'); ?>',
					name		: 'Feat21',
					id			: 'Feat21'
				},{
					fieldLabel	: '<?php i18n('Hide Encryption/Decryption Options in Document Managment'); ?>',
					name		: 'Feat22',
					id			: 'Feat22'
				}]
			},{
                title:'Calendar',
                defaultType: 'combo',
                items: [{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Disable Calendar'); ?>',
					name		: 'Cal1',
					id			: 'Cal1'
				},{
					fieldLabel	: '<?php i18n('Calendar Starting Hour'); ?>',
					name		: 'Cal2',
					id			: 'Cal2',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					fieldLabel	: '<?php i18n('Calendar Ending Hour'); ?>',
					name		: 'Cal3',
					id			: 'Cal3',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					fieldLabel	: '<?php i18n('Calendar Interval'); ?>',
					name		: 'Cal4',
					id			: 'Cal4',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					fieldLabel	: '<?php i18n('Appointment Display Style'); ?>',
					name		: 'Cal5',
					id			: 'Cal5',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Provider See Entire Calendar'); ?>',
					name		: 'Cal6',
					id			: 'Cal6',
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Auto-Create New Encounters'); ?>',
					name		: 'Cal7',
					id			: 'Cal7',
				},{
					fieldLabel	: '<?php i18n('Appointment/Event Color'); ?>',
					name		: 'Cal8',
					id			: 'Cal8',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				}]
			},{
                title:'Security',
                defaultType: 'textfield',
                items: [{
					fieldLabel	: '<?php i18n('Idle Session Timeout Seconds'); ?>',
					name		: 'Sec1',
					id			: 'Sec1',
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Require Strong Passwords'); ?>',
					name		: 'Sec2',
					id			: 'Sec2',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Require Unique Passwords'); ?>',
					name		: 'Sec3',
					id			: 'Sec3',
				},{
					fieldLabel	: '<?php i18n('Defaults Password Expiration Days'); ?>',
					name		: 'Sec4',
					id			: 'Sec4',
				},{
					fieldLabel	: '<?php i18n('Password Expiration Grace Period'); ?>',
					name		: 'Sec5',
					id			: 'Sec5',
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Enable Clients SSL'); ?>',
					name		: 'Sec6',
					id			: 'Sec6',
				},{
					fieldLabel	: '<?php i18n('Path to CA Certificate File'); ?>',
					name		: 'Sec7',
					id			: 'Sec7',
				},{
					fieldLabel	: '<?php i18n('Path to CA Key File'); ?>',
					name		: 'Sec8',
					id			: 'Sec8',
				},{
					fieldLabel	: '<?php i18n('Client Certificate Expiration Days'); ?>',
					name		: 'Sec8',
					id			: 'Sec8',
				},{
					fieldLabel	: '<?php i18n('Emergency Login Email Address'); ?>',
					name		: 'Sec8',
					id			: 'Sec8',
				}]
			},{
                title:'Notifocations',
                defaultType: 'textfield',
                items: [{
					fieldLabel	: '<?php i18n('Notification Email Address'); ?>',
					name		: 'Noti1',
					id			: 'Noti1'
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Email Transport Method'); ?>',
					name		: 'Noti2',
					id			: 'Noti2',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					fieldLabel	: '<?php i18n('SMPT Server Hostname'); ?>',
					name		: 'Noti3',
					id			: 'Noti3',
				},{
					fieldLabel	: '<?php i18n('SMPT Server Port Number'); ?>',
					name		: 'Noti4',
					id			: 'Noti4',
				},{
					fieldLabel	: '<?php i18n('SMPT User for Authentication'); ?>',
					name		: 'Noti5',
					id			: 'Noti5',
				},{
					fieldLabel	: '<?php i18n('SMPT Password for Authentication'); ?>',
					name		: 'Noti6',
					id			: 'Noti6',
				},{
					fieldLabel	: '<?php i18n('Email Notification Hours'); ?>',
					name		: 'Noti7',
					id			: 'Noti7',
				},{
					fieldLabel	: '<?php i18n('SMS Notification Hours'); ?>',
					name		: 'Noti8',
					id			: 'Noti8',
				},{
					fieldLabel	: '<?php i18n('SMS Gateway Usarname'); ?>',
					name		: 'Noti9',
					id			: 'Noti9',
				},{
					fieldLabel	: '<?php i18n('SMS Gateway Password'); ?>',
					name		: 'Noti10',
					id			: 'Noti10',
				},{
					fieldLabel	: '<?php i18n('SMS Gateway API Key'); ?>',
					name		: 'Noti11',
					id			: 'Noti11',
				}]
			},{
                title:'Loging',
                defaultType: 'checkbox',
                items: [{
					fieldLabel	: '<?php i18n('Enable Audit Logging'); ?>',
					name		: 'Log1',
					id			: 'Log1'
				},{
					fieldLabel	: '<?php i18n('Audid Logging Patient Record'); ?>',
					name		: 'Log2',
					id			: 'Log2'
				},{
					fieldLabel	: '<?php i18n('Audid Logging Scheduling'); ?>',
					name		: 'Log3',
					id			: 'Log3'
				},{
					fieldLabel	: '<?php i18n('Audid Logging Order'); ?>',
					name		: 'Log4',
					id			: 'Log4'
				},{
					fieldLabel	: '<?php i18n('Audid Logging Security Administration'); ?>',
					name		: 'Log5',
					id			: 'Log5'
				},{
					fieldLabel	: '<?php i18n('Audid Logging Backups'); ?>',
					name		: 'Log6',
					id			: 'Log6'
				},{
					fieldLabel	: '<?php i18n('Audid Loging Miscellaeous'); ?>',
					name		: 'Log7',
					id			: 'Log7'
				},{
					fieldLabel	: '<?php i18n('Audid Logging SELECT Query'); ?>',
					name		: 'Log8',
					id			: 'Log8'
				},{
					fieldLabel	: '<?php i18n('Enable ATNA Auditing'); ?>',
					name		: 'Log9',
					id			: 'Log9'
				},{
					xtype		: 'textfield',
					fieldLabel	: '<?php i18n('ATNA audit host'); ?>',
					name		: 'Log10',
					id			: 'Log10'
				},{
					xtype		: 'textfield',
					fieldLabel	: '<?php i18n('ATNA audit post'); ?>',
					name		: 'Log11',
					id			: 'Log11'
				},{
					xtype		: 'textfield',
					fieldLabel	: '<?php i18n('ATNA audit local certificate'); ?>',
					name		: 'Log12',
					id			: 'Log12'
				},{
					xtype		: 'textfield',
					fieldLabel	: '<?php i18n('ATNA audit CA certificate'); ?>',
					name		: 'Log13',
					id			: 'Log13'
				}]
			},{
                title:'Miscellaneus',
                defaultType: 'textfield',
                items: [{
					fieldLabel	: '<?php i18n('Path to MySQL Binaries'); ?>',
					name		: 'Misc1',
					id			: 'Misc1'
				},{
					fieldLabel	: '<?php i18n('Path to Perl Binaries'); ?>',
					name		: 'Misc2',
					id			: 'Misc2'
				},{
					fieldLabel	: '<?php i18n('Path to Temporary Files'); ?>',
					name		: 'Misc3',
					id			: 'Misc3'
				},{
					fieldLabel	: '<?php i18n('Path for Event Log Backup'); ?>',
					name		: 'Misc4',
					id			: 'Misc4'
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('State data Type'); ?>',
					name		: 'Misc5',
					id			: 'Misc5',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype 		: 'checkbox',
					fieldLabel	: '<?php i18n('State List Widget Custom Fields'); ?>',
					name		: 'Misc6',
					id			: 'Misc6'
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Country Data Type'); ?>',
					name		: 'Misc7',
					id			: 'Misc7',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					fieldLabel	: '<?php i18n('Country list'); ?>',
					name		: 'Misc8',
					id			: 'Misc8'
				},{
					fieldLabel	: '<?php i18n('Print Command'); ?>',
					name		: 'Misc9',
					id			: 'Misc9'
				},{
					fieldLabel	: '<?php i18n('Default Reason for Visit'); ?>',
					name		: 'Misc10',
					id			: 'Misc10'
				},{
					fieldLabel	: '<?php i18n('Default Encounter Form ID'); ?>',
					name		: 'Misc11',
					id			: 'Misc11'
				},{
					fieldLabel	: '<?php i18n('patient ID Category Name'); ?>',
					name		: 'Misc12',
					id			: 'Misc12'
				},{
					fieldLabel	: '<?php i18n('patient Photo Category name'); ?>',
					name		: 'Misc13',
					id			: 'Misc13'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Medicare Referrer is Renderer'); ?>',
					name		: 'Misc14',
					id			: 'Misc14'
				},{
					fieldLabel	: '<?php i18n('Final Close Date (yyy-mm-dd)'); ?>',
					name		: 'Misc15',
					id			: 'Misc15'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Enable Hylafax Support'); ?>',
					name		: 'Misc16',
					id			: 'Misc16'
				},{
					fieldLabel	: '<?php i18n('Halafax Server'); ?>',
					name		: 'Misc17',
					id			: 'Misc17'
				},{
					fieldLabel	: '<?php i18n('Halafax Directory'); ?>',
					name		: 'Misc18',
					id			: 'Misc18'
				},{
					fieldLabel	: '<?php i18n('Halafax Enscript Command'); ?>',
					name		: 'Misc19',
					id			: 'Misc19'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Enable Scanner Support'); ?>',
					name		: 'Misc19',
					id			: 'Misc19'
				},{
					fieldLabel	: '<?php i18n('Scanner Directory'); ?>',
					name		: 'Misc19',
					id			: 'Misc19'
				}]
			},{
                title:'Connectors',
                defaultType: 'textfield',
                items: [{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Enable Lab Exchange'); ?>',
					name		: 'Conn1',
					id			: 'Conn1'
				},{
					fieldLabel	: '<?php i18n('Lab Exchange Site ID'); ?>',
					name		: 'Conn2',
					id			: 'Conn2'
				},{
					fieldLabel	: '<?php i18n('Lab Exchange Token ID'); ?>',
					name		: 'Conn3',
					id			: 'Conn3'
				},{
					fieldLabel	: '<?php i18n('Lab Exchange Site Address'); ?>',
					name		: 'Conn4',
					id			: 'Conn4'
				}]
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