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
	// *************************************************************************************
	// Global Model and Data store
	// *************************************************************************************
	var usersRecord = Ext.define("Globals", {extend: "Ext.data.Model", fields: [
			{ name: 'data_id',								type:'int' },
			{ name: 'default_top_pane',						type:'auto', 	mapping: 'Appear1' },
			{ name: 'concurrent_layout',					type:'auto', 	mapping: 'Appear2' },
			{ name: 'css_header',							type:'auto', 	mapping: 'Appear3' },
			{ name: 'gbl_nav_area_width',					type:'string' },
			{ name: 'openemr_name',							type:'auto' },
			{ name: 'full_new_patient_form',				type:'auto', 	mapping: 'Appear6' },
			{ name: 'patient_search_results_style',			type:'auto', 	mapping: 'Appear7' },
			{ name: 'simplified_demographics',				type:'auto', 	mapping: 'Appear10' },
			{ name: 'simplified_prescriptions',				type:'auto', 	mapping: 'Appear11' },
			{ name: 'simplified_copay',						type:'auto', 	mapping: 'Appear12' },
			{ name: 'use_charges_panel',					type:'auto', 	mapping: 'Appear13' },
			{ name: 'online_support_link',					type:'auto', 	mapping: 'Appear14' },
			{ name: 'language_default',						type:'auto', 	mapping: 'Loc1' },
			{ name: 'language_menu_showall',				type:'auto', 	mapping: 'Loc2' },
			{ name: 'translate_layout',						type:'auto', 	mapping: 'Loc5' },
			{ name: 'translate_lists',						type:'auto', 	mapping: 'Loc6' },
			{ name: 'translate_gacl_groups',				type:'auto', 	mapping: 'Loc7' },
			{ name: 'translate_form_titles',				type:'auto', 	mapping: 'Loc8' },
			{ name: 'translate_document_categories',		type:'auto', 	mapping: 'Loc9' },
			{ name: 'translate_appt_categories',			type:'auto', 	mapping: 'Loc10' },
			{ name: 'units_of_measurement',					type:'auto', 	mapping: 'Loc11' },
			{ name: 'disable_deprecated_metrics_form',		type:'auto', 	mapping: 'Loc12' },
			{ name: 'phone_country_code',					type:'auto', 	mapping: 'Loc13' },
			{ name: 'date_display_format',					type:'auto', 	mapping: 'Loc14' },
			{ name: 'currency_decimals',					type:'auto', 	mapping: 'Loc16' },
			{ name: 'currency_dec_point',					type:'auto', 	mapping: 'Loc17' },
			{ name: 'currency_thousands_sep',				type:'auto', 	mapping: 'Loc18' },
			{ name: 'gbl_currency_symbol',					type:'auto' },
			{ name: 'specific_application',					type:'auto', 	mapping: 'Feat1' },
			{ name: 'inhouse_pharmacy',						type:'auto', 	mapping: 'Feat2' },
			{ name: 'disable_chart_tracker',				type:'auto', 	mapping: 'Feat3' },
			{ name: 'disable_phpmyadmin_link',				type:'auto', 	mapping: 'sadfadsfdsafs' },
			{ name: 'disable_immunizations',				type:'auto', 	mapping: 'Feat4' },
			{ name: 'disable_prescriptions',				type:'auto', 	mapping: 'Feat5' },
			{ name: 'omit_employers',						type:'auto', 	mapping: 'Feat5' },
			{ name: 'select_multi_providers',				type:'auto', 	mapping: 'Feat7' },
			{ name: 'disable_non_default_groups',			type:'auto', 	mapping: 'Feat8' },
			{ name: 'ignore_pnotes_authorization',			type:'auto', 	mapping: 'Feat9' },
			{ name: 'support_encounter_claims',				type:'auto', 	mapping: 'Feat10' },
			{ name: 'advance_directives_warning',			type:'auto', 	mapping: 'Feat11' },
			{ name: 'configuration_import_export',			type:'auto', 	mapping: 'Feat12' },
			{ name: 'restrict_user_facility',				type:'auto', 	mapping: 'Feat13' },
			{ name: 'set_facility_cookie',					type:'auto', 	mapping: 'Feat14' },
			{ name: 'discount_by_money',					type:'auto', 	mapping: 'Feat15' },
			{ name: 'gbl_visit_referral_source',			type:'auto', 	mapping: 'Feat16' },
			{ name: 'gbl_mask_patient_id',					type:'auto', 	mapping: 'Feat17' },
			{ name: 'gbl_mask_invoice_number',				type:'auto', 	mapping: 'Feat18' },
			{ name: 'gbl_mask_product_id',					type:'auto', 	mapping: 'Feat19' },
			{ name: 'force_billing_widget_open',			type:'auto', 	mapping: 'Feat20' },
			{ name: 'activate_ccr_ccd_report',				type:'auto', 	mapping: 'Feat21' },
			{ name: 'disable_calendar',						type:'auto', 	mapping: 'Cal1' },
			{ name: 'schedule_start',						type:'auto', 	mapping: 'Cal2' },
			{ name: 'schedule_end',							type:'auto', 	mapping: 'Cal3' },
			{ name: 'calendar_interval',					type:'auto', 	mapping: 'Cal4' },
			{ name: 'calendar_appt_style',					type:'auto', 	mapping: 'Cal5' },
			{ name: 'docs_see_entire_calendar',				type:'auto', 	mapping: 'asfdADSADa' },
			{ name: 'auto_create_new_encounters',			type:'auto', 	mapping: '' },
			{ name: 'timeout',								type:'auto', 	mapping: 'Sec1' },
			{ name: 'secure_password',						type:'auto', 	mapping: 'Sec2' },
			{ name: 'password_history',						type:'auto', 	mapping: 'Sec3' },
			{ name: 'password_expiration_days',				type:'auto', 	mapping: 'Sec4' },
			{ name: 'password_grace_time',					type:'auto', 	mapping: 'Sec5' },
			{ name: 'is_client_ssl_enabled',				type:'auto', 	mapping: 'Sec6' },
			{ name: 'certificate_authority_crt',			type:'auto', 	mapping: 'Sec7' },
			{ name: 'certificate_authority_key',			type:'auto', 	mapping: 'asdasadfghfgsd' },
			{ name: 'client_certificate_valid_in_days',		type:'auto', 	mapping: 'fghfdfhggfhd' },
			{ name: 'Emergency_Login_email_id',				type:'auto', 	mapping: 'Sec8' },
			{ name: 'practice_return_email_path',			type:'auto', 	mapping: 'Noti1' },
			{ name: 'EMAIL_METHOD',							type:'auto', 	mapping: 'Noti2' },
			{ name: 'SMTP_HOST',							type:'auto', 	mapping: 'Noti3' },
			{ name: 'SMTP_PORT',							type:'auto', 	mapping: 'Noti4' },
			{ name: 'SMTP_USER',							type:'auto', 	mapping: 'Noti5' },
			{ name: 'SMTP_PASS',							type:'auto', 	mapping: 'Noti6' },
			{ name: 'EMAIL_NOTIFICATION_HOUR',				type:'auto', 	mapping: 'Noti7' },
			{ name: 'SMS_NOTIFICATION_HOUR',				type:'auto', 	mapping: 'Noti8' },
			{ name: 'SMS_GATEWAY_USENAME',					type:'auto', 	mapping: 'Noti9' },
			{ name: 'SMS_GATEWAY_PASSWORD',					type:'auto', 	mapping: 'Noti10' },
			{ name: 'SMS_GATEWAY_APIKEY',					type:'auto', 	mapping: 'Noti11' },
			{ name: 'enable_auditlog',						type:'auto', 	mapping: 'Log1' },
			{ name: 'audit_events_patient-record',			type:'auto', 	mapping: 'Log2' },
			{ name: 'audit_events_scheduling',				type:'auto', 	mapping: 'Log3' },
			{ name: 'audit_events_order',					type:'auto', 	mapping: 'Log4' },
			{ name: 'audit_events_security-administration',	type:'auto', 	mapping: 'Log5' },
			{ name: 'audit_events_backup',					type:'auto', 	mapping: 'Log6' },
			{ name: 'audit_events_other',					type:'auto', 	mapping: 'Log7' },
			{ name: 'audit_events_query',					type:'auto', 	mapping: 'Log8' },
			{ name: 'enable_atna_audit',					type:'auto', 	mapping: 'Log9' },
			{ name: 'atna_audit_host',						type:'auto', 	mapping: 'Log10' },
			{ name: 'atna_audit_port',						type:'auto', 	mapping: 'Log11' },
			{ name: 'atna_audit_localcert',					type:'auto', 	mapping: 'Log12' },
			{ name: 'atna_audit_cacert',					type:'auto', 	mapping: 'Log13' },
			{ name: 'mysql_bin_dir',						type:'auto', 	mapping: 'Misc1' },
			{ name: 'perl_bin_dir',							type:'auto', 	mapping: 'Misc2' },
			{ name: 'temporary_files_dir',					type:'auto', 	mapping: 'Misc3' },
			{ name: 'backup_log_dir',						type:'auto', 	mapping: 'Misc4' },
			{ name: 'state_data_type',						type:'auto', 	mapping: 'Misc5' },
			{ name: 'state_list',							type:'auto', 	mapping: 'Misc6' },
			{ name: 'state_custom_addlist_widget',			type:'auto', 	mapping: 'Misc7' },
			{ name: 'country_data_type',					type:'auto', 	mapping: 'Misc8' },
			{ name: 'country_list',							type:'auto', 	mapping: 'Misc9' },
			{ name: 'print_command',						type:'auto', 	mapping: 'Misc10' },
			{ name: 'default_chief_complaint',				type:'auto', 	mapping: 'Misc11' },
			{ name: 'default_new_encounter_form',			type:'auto', 	mapping: 'Misc12' },
			{ name: 'patient_id_category_name',				type:'auto', 	mapping: 'Misc13' },
			{ name: 'patient_photo_category_name',			type:'auto', 	mapping: 'Misc14' },
			{ name: 'MedicareReferrerIsRenderer',			type:'auto', 	mapping: 'Misc15' },
			{ name: 'post_to_date_benchmark',				type:'auto', 	mapping: 'Misc16' },
			{ name: 'enable_hylafax',						type:'auto', 	mapping: 'Misc17' },
			{ name: 'hylafax_server',						type:'auto', 	mapping: 'Misc18' },
			{ name: 'hylafax_basedir',						type:'auto', 	mapping: 'Misc19' },
			{ name: 'hylafax_enscript',						type:'auto', 	mapping: 'Misc20' },
			{ name: 'enable_scanner',						type:'auto', 	mapping: 'Misc21' },
			{ name: 'scanner_output_directory',				type:'auto', 	mapping: 'Misc22' }
		],
		idProperty: 'data_id',
	});
	var globalStore = new Ext.data.Store({
	    model		: 'Globals',
	    proxy		: {
	    	type	: 'ajax',
			api		: {
				read	: 'interface/administration/globals/data_read.ejs.php',
				create	: 'interface/administration/globals/data_create.ejs.php',
				update	: 'interface/administration/globals/data_update.ejs.php',
				destroy : 'interface/administration/globals/data_destroy.ejs.php'
			},
	        reader: {
	            type			: 'json',
	            totalProperty	: 'totals',
   	        	idProperty		: 'data_id',
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
	//------------------------------------------------------------------------------
	// When the data is loaded semd values to de form
	//------------------------------------------------------------------------------
	globalStore.on('load',function(DataView, records, o){
		var rec = globalStore.getById(1); // get the record from the store
		Ext.getCmp('globalFormPanel').getForm().loadRecord(rec);
	});
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
	// Global Form Panel
	//**************************************************************************
	var globalFormPanel = Ext.create('Ext.form.Panel', {
		id				: 'globalFormPanel',
		border			: false,
		layout			: 'fit',
		autoScroll		: true,
        fieldDefaults	: { msgTarget: 'side', labelWidth: 220, width: 500 },
        defaults		: { anchor: '100%' },
        items: [{
            xtype		:'tabpanel',
            activeTab	: 0,
            defaults	:{bodyStyle:'padding:10px', autoScroll:true },
            items:[{
                title		:'Appearance',
                defaults	: {anchor: '100%'},
                items: [{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Main Top Pane Screen'); ?>',
					name		: 'Appear1',
					id			: 'Appear1',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Layout Style'); ?>',
					name		: 'Appear2',
					id			: 'Appear2',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Theme'); ?>',
					name		: 'Appear3',
					id			: 'Appear3',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'textfield',
					fieldLabel	: '<?php i18n('Navigation Area Width'); ?>',
					name		: 'gbl_nav_area_width',
					id			: 'gbl_nav_area_width'
				},{
					xtype		: 'textfield',
					fieldLabel	: '<?php i18n('Application Title'); ?>',
					name		: 'openemr_name',
					id			: 'openemr_name'
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('New Patient Form'); ?>',
					name		: 'Appear6',
					id			: 'Appear6', 
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Patient Search Resuls Style'); ?>',
					name		: 'Appear7',
					id			: 'Appear7',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Tall Navigation Area'); ?>',
					name		: 'Appear8',
					id			: 'Appear8'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Navigation Area Visit Form'); ?>',
					name		: 'Appear9',
					id			: 'Appear9'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Simplified Demographics'); ?>',
					name		: 'Appear10',
					id			: 'Appear10'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Simplified Prescriptions'); ?>',
					name		: 'Appear11',
					id			: 'Appear11'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Simplified Co-Pay'); ?>',
					name		: 'Appear12',
					id			: 'Appear12'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('User Charges Panel'); ?>',
					name		: 'Appear13',
					id			: 'Appear13'
				},{
					xtype		: 'textfield',
					fieldLabel	: '<?php i18n('Online Support Link'); ?>',
					name		: 'online_support_link',
					id			: 'online_support_link'
				}]
            },{
                title:'Locale',
                //defaults: {},
                defaultType: 'textfield',
                items: [{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Default Language'); ?>',
					name		: 'Loc1',
					id			: 'Loc1',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('All Language Allowed'); ?>',
					name		: 'Loc2',
					id			: 'Loc2'
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Allowed Languages'); ?>',
					name		: 'Loc3',
					id			: 'Loc3',
					displayField: 'name',
					valueField	: 'value',
					multiSelect	: true,
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Allow Debuging Language'); ?>',
					name		: 'Loc4',
					id			: 'Loc4'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Translate Layouts'); ?>',
					name		: 'Loc5',
					id			: 'Loc5'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Translate List'); ?>',
					name		: 'Loc6',
					id			: 'Loc6'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Translate Access Control Roles'); ?>',
					name		: 'Loc7',
					id			: 'Loc7'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Translate Patient Note Titles'); ?>',
					name		: 'Loc8',
					id			: 'Loc8'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Translate Documents Categoies'); ?>',
					name		: 'Loc9',
					id			: 'Loc9'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Translate Appointment Categories'); ?>',
					name		: 'Loc10',
					id			: 'Loc10'
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Units for Visits Forms'); ?>',
					name		: 'Loc11',
					id			: 'Loc11',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Disable Old Metric Vitals Form'); ?>',
					name		: 'Loc12',
					id			: 'Loc12'
				},{
					xtype		: 'textfield',
					fieldLabel	: '<?php i18n('Telephone Country Code'); ?>',
					name		: 'Loc13',
					id			: 'Loc13'
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Date Display Format'); ?>',
					name		: 'Loc14',
					id			: 'Loc14',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Time Display Format'); ?>',
					name		: 'Loc15',
					id			: 'Loc15',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Currency Decimal Places'); ?>',
					name		: 'Loc16',
					id			: 'Loc16',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Currency Decimal Point Symbol'); ?>',
					name		: 'Loc17',
					id			: 'Loc17',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Currency Thousands Separator'); ?>',
					name		: 'Loc18',
					id			: 'Loc18',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'textfield',
					fieldLabel	: '<?php i18n('Currency Designator'); ?>',
					name		: 'gbl_currency_symbol',
					id			: 'gbl_currency_symbol'
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
				    iconCls   : 'save',
				    handler   : function(){
						// TODO //
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