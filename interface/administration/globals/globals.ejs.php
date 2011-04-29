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
			{ name: 'default_top_pane',						type:'auto' },
			{ name: 'concurrent_layout',					type:'auto' },
			{ name: 'css_header',							type:'auto' },
			{ name: 'gbl_nav_area_width',					type:'auto' },
			{ name: 'openemr_name',							type:'auto' },
			{ name: 'full_new_patient_form',				type:'auto' },
			{ name: 'patient_search_results_style',			type:'auto' },
			{ name: 'simplified_demographics',				type:'auto' },
			{ name: 'simplified_prescriptions',				type:'auto' },
			{ name: 'simplified_copay',						type:'auto' },
			{ name: 'use_charges_panel',					type:'auto' },
			{ name: 'online_support_link',					type:'auto' },
			{ name: 'language_default',						type:'auto' },
			{ name: 'language_menu_showall',				type:'auto' },
			{ name: 'translate_layout',						type:'auto' },
			{ name: 'translate_lists',						type:'auto' },
			{ name: 'translate_gacl_groups',				type:'auto' },
			{ name: 'translate_form_titles',				type:'auto' },
			{ name: 'translate_document_categories',		type:'auto' },
			{ name: 'translate_appt_categories',			type:'auto' },
			{ name: 'units_of_measurement',					type:'auto' },
			{ name: 'disable_deprecated_metrics_form',		type:'auto' },
			{ name: 'phone_country_code',					type:'auto' },
			{ name: 'date_display_format',					type:'auto' },
			{ name: 'currency_decimals',					type:'auto' },
			{ name: 'currency_dec_point',					type:'auto' },
			{ name: 'currency_thousands_sep',				type:'auto' },
			{ name: 'gbl_currency_symbol',					type:'auto' },
			{ name: 'specific_application',					type:'auto' },
			{ name: 'inhouse_pharmacy',						type:'auto' },
			{ name: 'disable_chart_tracker',				type:'auto' },
			{ name: 'disable_phpmyadmin_link',				type:'auto' },
			{ name: 'disable_immunizations',				type:'auto' },
			{ name: 'disable_prescriptions',				type:'auto' },
			{ name: 'omit_employers',						type:'auto' },
			{ name: 'select_multi_providers',				type:'auto' },
			{ name: 'disable_non_default_groups',			type:'auto' },
			{ name: 'ignore_pnotes_authorization',			type:'auto' },
			{ name: 'support_encounter_claims',				type:'auto' },
			{ name: 'advance_directives_warning',			type:'auto' },
			{ name: 'configuration_import_export',			type:'auto' },
			{ name: 'restrict_user_facility',				type:'auto' },
			{ name: 'set_facility_cookie',					type:'auto' },
			{ name: 'discount_by_money',					type:'auto' },
			{ name: 'gbl_visit_referral_source',			type:'auto' },
			{ name: 'gbl_mask_patient_id',					type:'auto' },
			{ name: 'gbl_mask_invoice_number',				type:'auto' },
			{ name: 'gbl_mask_product_id',					type:'auto' },
			{ name: 'force_billing_widget_open',			type:'auto' },
			{ name: 'activate_ccr_ccd_report',				type:'auto' },
			{ name: 'disable_calendar',						type:'auto' },
			{ name: 'schedule_start',						type:'auto' },
			{ name: 'schedule_end',							type:'auto' },
			{ name: 'calendar_interval',					type:'auto' },
			{ name: 'calendar_appt_style',					type:'auto' },
			{ name: 'docs_see_entire_calendar',				type:'auto' },
			{ name: 'auto_create_new_encounters',			type:'auto' },
			{ name: 'timeout',								type:'auto' },
			{ name: 'secure_password',						type:'auto' },
			{ name: 'password_history',						type:'auto' },
			{ name: 'password_expiration_days',				type:'auto' },
			{ name: 'password_grace_time',					type:'auto' },
			{ name: 'is_client_ssl_enabled',				type:'auto' },
			{ name: 'certificate_authority_crt',			type:'auto' },
			{ name: 'certificate_authority_key',			type:'auto' },
			{ name: 'client_certificate_valid_in_days',		type:'auto' },
			{ name: 'Emergency_Login_email_id',				type:'auto' },
			{ name: 'practice_return_email_path',			type:'auto' },
			{ name: 'EMAIL_METHOD',							type:'auto' },
			{ name: 'SMTP_HOST',							type:'auto' },
			{ name: 'SMTP_PORT',							type:'auto' },
			{ name: 'SMTP_USER',							type:'auto' },
			{ name: 'SMTP_PASS',							type:'auto' },
			{ name: 'EMAIL_NOTIFICATION_HOUR',				type:'auto' },
			{ name: 'SMS_NOTIFICATION_HOUR',				type:'auto' },
			{ name: 'SMS_GATEWAY_USENAME',					type:'auto' },
			{ name: 'SMS_GATEWAY_PASSWORD',					type:'auto' },
			{ name: 'SMS_GATEWAY_APIKEY',					type:'auto' },
			{ name: 'enable_auditlog',						type:'auto' },
			{ name: 'audit_events_patient-record',			type:'auto' },
			{ name: 'audit_events_scheduling',				type:'auto' },
			{ name: 'audit_events_order',					type:'auto' },
			{ name: 'audit_events_security-administration',	type:'auto' },
			{ name: 'audit_events_backup',					type:'auto' },
			{ name: 'audit_events_other',					type:'auto' },
			{ name: 'audit_events_query',					type:'auto' },
			{ name: 'enable_atna_audit',					type:'auto' },
			{ name: 'atna_audit_host',						type:'auto' },
			{ name: 'atna_audit_port',						type:'auto' },
			{ name: 'atna_audit_localcert',					type:'auto' },
			{ name: 'atna_audit_cacert',					type:'auto' },
			{ name: 'mysql_bin_dir',						type:'auto' },
			{ name: 'perl_bin_dir',							type:'auto' },
			{ name: 'temporary_files_dir',					type:'auto' },
			{ name: 'backup_log_dir',						type:'auto' },
			{ name: 'state_data_type',						type:'auto' },
			{ name: 'state_list',							type:'auto' },
			{ name: 'state_custom_addlist_widget',			type:'auto' },
			{ name: 'country_data_type',					type:'auto' },
			{ name: 'country_list',							type:'auto' },
			{ name: 'print_command',						type:'auto' },
			{ name: 'default_chief_complaint',				type:'auto' },
			{ name: 'default_new_encounter_form',			type:'auto' },
			{ name: 'patient_id_category_name',				type:'auto' },
			{ name: 'patient_photo_category_name',			type:'auto' },
			{ name: 'MedicareReferrerIsRenderer',			type:'auto' },
			{ name: 'post_to_date_benchmark',				type:'auto' },
			{ name: 'enable_hylafax',						type:'auto' },
			{ name: 'hylafax_server',						type:'auto' },
			{ name: 'hylafax_basedir',						type:'auto' },
			{ name: 'hylafax_enscript',						type:'auto' },
			{ name: 'enable_scanner',						type:'auto' },
			{ name: 'scanner_output_directory',				type:'auto' }
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
					name		: 'default_top_pane',
					id			: 'default_top_pane',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Layout Style'); ?>',
					name		: 'concurrent_layout',
					id			: 'concurrent_layout',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Theme'); ?>',
					name		: 'css_header',
					id			: 'css_header',
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
					name		: 'full_new_patient_form',
					id			: 'full_new_patient_form', 
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Patient Search Resuls Style'); ?>',
					name		: 'patient_search_results_style',
					id			: 'patient_search_results_style',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Tall Navigation Area'); ?>',
					name		: 'Appear8',  // ??????????
					id			: 'Appear8'   // ??????????
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Navigation Area Visit Form'); ?>',
					name		: 'Appear9',   // ?????????
					id			: 'Appear9'    // ?????????
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Simplified Demographics'); ?>',
					name		: 'simplified_demographics',
					id			: 'simplified_demographics'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Simplified Prescriptions'); ?>',
					name		: 'simplified_prescriptions',
					id			: 'simplified_prescriptions'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Simplified Co-Pay'); ?>',
					name		: 'simplified_copay',
					id			: 'simplified_copay'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('User Charges Panel'); ?>',
					name		: 'use_charges_panel',
					id			: 'use_charges_panel'
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
					name		: 'online_support_link',
					id			: 'online_support_link',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('All Language Allowed'); ?>',
					name		: 'language_menu_showall',
					id			: 'language_menu_showall'
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Allowed Languages'); ?>',
					name		: 'Loc3',  // ???????
					id			: 'Loc3',  // ???????
					displayField: 'name',
					valueField	: 'value',
					multiSelect	: true,
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Allow Debuging Language'); ?>',
					name		: 'Loc4',  // ???????
					id			: 'Loc4'   // ???????
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Translate Layouts'); ?>',
					name		: 'translate_layout',
					id			: 'translate_layout'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Translate List'); ?>',
					name		: 'translate_lists',
					id			: 'translate_lists'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Translate Access Control Roles'); ?>',
					name		: 'translate_gacl_groups',
					id			: 'translate_gacl_groups'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Translate Patient Note Titles'); ?>',
					name		: 'translate_form_titles',
					id			: 'translate_form_titles'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Translate Documents Categoies'); ?>',
					name		: 'translate_document_categories',
					id			: 'translate_document_categories'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Translate Appointment Categories'); ?>',
					name		: 'translate_appt_categories',
					id			: 'translate_appt_categories'
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Units for Visits Forms'); ?>',
					name		: 'units_of_measurement',
					id			: 'units_of_measurement',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Disable Old Metric Vitals Form'); ?>',
					name		: 'disable_deprecated_metrics_form',
					id			: 'disable_deprecated_metrics_form'
				},{
					xtype		: 'textfield',
					fieldLabel	: '<?php i18n('Telephone Country Code'); ?>',
					name		: 'phone_country_code',
					id			: 'phone_country_code'
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Date Display Format'); ?>',
					name		: 'date_display_format',
					id			: 'date_display_format',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Time Display Format'); ?>',
					name		: 'Loc15',   // ??????
					id			: 'Loc15',   // ??????
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Currency Decimal Places'); ?>',
					name		: 'currency_decimals',
					id			: 'currency_decimals',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Currency Decimal Point Symbol'); ?>',
					name		: 'currency_dec_point',
					id			: 'currency_dec_point',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Currency Thousands Separator'); ?>',
					name		: 'currency_thousands_sep',
					id			: 'currency_thousands_sep',
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
					name		: 'date_display_format',
					id			: 'date_display_format',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Drugs and Prodructs'); ?>',
					name		: 'date_display_format',
					id			: 'date_display_format',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					fieldLabel	: '<?php i18n('Disable Chart Tracker'); ?>',
					name		: 'date_display_format',
					id			: 'date_display_format'
				},{
					fieldLabel	: '<?php i18n('Disable Immunizations'); ?>',
					name		: 'disable_immunizations',
					id			: 'disable_immunizations'
				},{
					fieldLabel	: '<?php i18n('Disable Prescriptions'); ?>',
					name		: 'disable_prescriptions',
					id			: 'disable_prescriptions'
				},{
					fieldLabel	: '<?php i18n('Omit Employers'); ?>',
					name		: 'omit_employers',
					id			: 'omit_employers'
				},{
					fieldLabel	: '<?php i18n('Support Multi-Provider Events'); ?>',
					name		: 'select_multi_providers',
					id			: 'select_multi_providers'
				},{
					fieldLabel	: '<?php i18n('Disable User Groups'); ?>',
					name		: 'disable_non_default_groups',
					id			: 'disable_non_default_groups'
				},{
					fieldLabel	: '<?php i18n('Skip Authorization of Patient Notes'); ?>',
					name		: 'ignore_pnotes_authorization',
					id			: 'ignore_pnotes_authorization'
				},{
					fieldLabel	: '<?php i18n('Allow Encounters Claims'); ?>',
					name		: 'support_encounter_claims',
					id			: 'support_encounter_claims'
				},{
					fieldLabel	: '<?php i18n('Advance Directives Warning'); ?>',
					name		: 'advance_directives_warning',
					id			: 'advance_directives_warning'
				},{
					fieldLabel	: '<?php i18n('Configuration Export/Import'); ?>',
					name		: 'configuration_import_export',
					id			: 'configuration_import_export'
				},{
					fieldLabel	: '<?php i18n('Restrict Users to Facilities'); ?>',
					name		: 'restrict_user_facility',
					id			: 'restrict_user_facility'
				},{
					fieldLabel	: '<?php i18n('Remember Selected Facility'); ?>',
					name		: 'set_facility_cookie',
					id			: 'set_facility_cookie'
				},{
					fieldLabel	: '<?php i18n('Discounts as monetary Ammounts'); ?>',
					name		: 'discount_by_money',
					id			: 'discount_by_money'
				},{
					fieldLabel	: '<?php i18n('Referral Source for Encounters'); ?>',
					name		: 'gbl_visit_referral_source',
					id			: 'gbl_visit_referral_source'
				},{
					fieldLabel	: '<?php i18n('Maks for Patients IDs'); ?>',
					xtype		: 'textfield',
					name		: 'gbl_mask_patient_id',
					id			: 'gbl_mask_patient_id'
				},{
					fieldLabel	: '<?php i18n('Mask of Invoice Numbers'); ?>',
					xtype		: 'textfield',
					name		: 'gbl_mask_invoice_number',
					id			: 'gbl_mask_invoice_number'
				},{
					fieldLabel	: '<?php i18n('Mask for Product IDs'); ?>',
					xtype		: 'textfield',
					name		: 'gbl_mask_product_id',
					id			: 'gbl_mask_product_id'
				},{
					fieldLabel	: '<?php i18n('Force Billing Widget Open'); ?>',
					name		: 'force_billing_widget_open',
					id			: 'force_billing_widget_open'
				},{
					fieldLabel	: '<?php i18n('Actiate CCR/CCD Reporting'); ?>',
					name		: 'activate_ccr_ccd_report',
					id			: 'activate_ccr_ccd_report'
				},{
					fieldLabel	: '<?php i18n('Hide Encryption/Decryption Options in Document Managment'); ?>',
					name		: 'Feat22',   // ?????
					id			: 'Feat22'    // ?????
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
					name		: 'timeout',
					id			: 'timeout',
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Require Strong Passwords'); ?>',
					name		: 'secure_password',
					id			: 'secure_password',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Require Unique Passwords'); ?>',
					name		: 'password_history',
					id			: 'password_history',
				},{
					fieldLabel	: '<?php i18n('Defaults Password Expiration Days'); ?>',
					name		: 'password_expiration_days',
					id			: 'password_expiration_days',
				},{
					fieldLabel	: '<?php i18n('Password Expiration Grace Period'); ?>',
					name		: 'password_grace_time',
					id			: 'password_grace_time',
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Enable Clients SSL'); ?>',
					name		: 'is_client_ssl_enabled',
					id			: 'is_client_ssl_enabled',
				},{
					fieldLabel	: '<?php i18n('Path to CA Certificate File'); ?>',
					name		: 'certificate_authority_crt',
					id			: 'certificate_authority_crt',
				},{
					fieldLabel	: '<?php i18n('Path to CA Key File'); ?>',
					name		: 'certificate_authority_key',
					id			: 'certificate_authority_key',
				},{
					fieldLabel	: '<?php i18n('Client Certificate Expiration Days'); ?>',
					name		: 'client_certificate_valid_in_days',
					id			: 'client_certificate_valid_in_days',
				},{
					fieldLabel	: '<?php i18n('Emergency Login Email Address'); ?>',
					name		: 'Emergency_Login_email_id',
					id			: 'Emergency_Login_email_id',
				}]
			},{
                title:'Notifocations',
                defaultType: 'textfield',
                items: [{
					fieldLabel	: '<?php i18n('Notification Email Address'); ?>',
					name		: 'practice_return_email_path',
					id			: 'practice_return_email_path'
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Email Transport Method'); ?>',
					name		: 'EMAIL_METHOD',
					id			: 'EMAIL_METHOD',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					fieldLabel	: '<?php i18n('SMPT Server Hostname'); ?>',
					name		: 'SMTP_HOST',
					id			: 'SMTP_HOST',
				},{
					fieldLabel	: '<?php i18n('SMPT Server Port Number'); ?>',
					name		: 'SMTP_PORT',
					id			: 'SMTP_PORT',
				},{
					fieldLabel	: '<?php i18n('SMPT User for Authentication'); ?>',
					name		: 'SMTP_USER',
					id			: 'SMTP_USER',
				},{
					fieldLabel	: '<?php i18n('SMPT Password for Authentication'); ?>',
					name		: 'SMTP_PASS',
					id			: 'SMTP_PASS',
				},{
					fieldLabel	: '<?php i18n('Email Notification Hours'); ?>',
					name		: 'EMAIL_NOTIFICATION_HOUR',
					id			: 'EMAIL_NOTIFICATION_HOUR',
				},{
					fieldLabel	: '<?php i18n('SMS Notification Hours'); ?>',
					name		: 'SMS_NOTIFICATION_HOUR',
					id			: 'SMS_NOTIFICATION_HOUR',
				},{
					fieldLabel	: '<?php i18n('SMS Gateway Usarname'); ?>',
					name		: 'SMS_GATEWAY_USENAME',
					id			: 'SMS_GATEWAY_USENAME',
				},{
					fieldLabel	: '<?php i18n('SMS Gateway Password'); ?>',
					name		: 'SMS_GATEWAY_PASSWORD',
					id			: 'SMS_GATEWAY_PASSWORD',
				},{
					fieldLabel	: '<?php i18n('SMS Gateway API Key'); ?>',
					name		: 'SMS_GATEWAY_APIKEY',
					id			: 'SMS_GATEWAY_APIKEY',
				}]
			},{
                title:'Loging',
                defaultType: 'checkbox',
                items: [{
					fieldLabel	: '<?php i18n('Enable Audit Logging'); ?>',
					name		: 'enable_auditlog',
					id			: 'enable_auditlog'
				},{
					fieldLabel	: '<?php i18n('Audid Logging Patient Record'); ?>',
					name		: 'audit_events_patient',
					id			: 'audit_events_patient'
				},{
					fieldLabel	: '<?php i18n('Audid Logging Scheduling'); ?>',
					name		: 'audit_events_scheduling',
					id			: 'audit_events_scheduling'
				},{
					fieldLabel	: '<?php i18n('Audid Logging Order'); ?>',
					name		: 'audit_events_order',
					id			: 'audit_events_order'
				},{
					fieldLabel	: '<?php i18n('Audid Logging Security Administration'); ?>',
					name		: 'audit_events_security',
					id			: 'audit_events_security'
				},{
					fieldLabel	: '<?php i18n('Audid Logging Backups'); ?>',
					name		: 'audit_events_backup',
					id			: 'audit_events_backup'
				},{
					fieldLabel	: '<?php i18n('Audid Loging Miscellaeous'); ?>',
					name		: 'audit_events_other',
					id			: 'audit_events_other'
				},{
					fieldLabel	: '<?php i18n('Audid Logging SELECT Query'); ?>',
					name		: 'audit_events_query',
					id			: 'audit_events_query'
				},{
					fieldLabel	: '<?php i18n('Enable ATNA Auditing'); ?>',
					name		: 'enable_atna_audit',
					id			: 'enable_atna_audit'
				},{
					xtype		: 'textfield',
					fieldLabel	: '<?php i18n('ATNA audit host'); ?>',
					name		: 'atna_audit_host',
					id			: 'atna_audit_host'
				},{
					xtype		: 'textfield',
					fieldLabel	: '<?php i18n('ATNA audit post'); ?>',
					name		: 'atna_audit_port',
					id			: 'atna_audit_port'
				},{
					xtype		: 'textfield',
					fieldLabel	: '<?php i18n('ATNA audit local certificate'); ?>',
					name		: 'atna_audit_localcert',
					id			: 'atna_audit_localcert'
				},{
					xtype		: 'textfield',
					fieldLabel	: '<?php i18n('ATNA audit CA certificate'); ?>',
					name		: 'atna_audit_cacert',
					id			: 'atna_audit_cacert'
				}]
			},{
                title:'Miscellaneus',
                defaultType: 'textfield',
                items: [{
					fieldLabel	: '<?php i18n('Path to MySQL Binaries'); ?>',
					name		: 'mysql_bin_dir',
					id			: 'mysql_bin_dir'
				},{
					fieldLabel	: '<?php i18n('Path to Perl Binaries'); ?>',
					name		: 'perl_bin_dir',
					id			: 'perl_bin_dir'
				},{
					fieldLabel	: '<?php i18n('Path to Temporary Files'); ?>',
					name		: 'temporary_files_dir',
					id			: 'temporary_files_dir'
				},{
					fieldLabel	: '<?php i18n('Path for Event Log Backup'); ?>',
					name		: 'backup_log_dir',
					id			: 'backup_log_dir'
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('State Data Type'); ?>',
					name		: 'state_data_type',
					id			: 'state_data_type',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('State Lsit'); ?>',
					name		: 'state_list',
					id			: 'state_list',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					xtype 		: 'checkbox',
					fieldLabel	: '<?php i18n('State List Widget Custom Fields'); ?>',
					name		: 'state_custom_addlist_widget',
					id			: 'state_custom_addlist_widget'
				},{
					xtype		: 'combo',
					fieldLabel	: '<?php i18n('Country Data Type'); ?>',
					name		: 'country_data_type',
					id			: 'country_data_type',
					displayField: 'name',
					valueField	: 'value',
					editable	: false,
					store		: dummyStore
				},{
					fieldLabel	: '<?php i18n('Country list'); ?>',
					name		: 'country_list',
					id			: 'country_list'
				},{
					fieldLabel	: '<?php i18n('Print Command'); ?>',
					name		: 'print_command',
					id			: 'print_command'
				},{
					fieldLabel	: '<?php i18n('Default Reason for Visit'); ?>',
					name		: 'default_chief_complaint',
					id			: 'default_chief_complaint'
				},{
					fieldLabel	: '<?php i18n('Default Encounter Form ID'); ?>',
					name		: 'default_new_encounter_form',
					id			: 'default_new_encounter_form'
				},{
					fieldLabel	: '<?php i18n('patient ID Category Name'); ?>',
					name		: 'patient_id_category_name',
					id			: 'patient_id_category_name'
				},{
					fieldLabel	: '<?php i18n('patient Photo Category name'); ?>',
					name		: 'patient_photo_category_name',
					id			: 'patient_photo_category_name'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Medicare Referrer is Renderer'); ?>',
					name		: 'MedicareReferrerIsRenderer',
					id			: 'MedicareReferrerIsRenderer'
				},{
					fieldLabel	: '<?php i18n('Final Close Date (yyy-mm-dd)'); ?>',
					name		: 'post_to_date_benchmark',
					id			: 'post_to_date_benchmark'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Enable Hylafax Support'); ?>',
					name		: 'enable_hylafax',
					id			: 'enable_hylafax'
				},{
					fieldLabel	: '<?php i18n('Halafax Server'); ?>',
					name		: 'hylafax_server',
					id			: 'hylafax_server'
				},{
					fieldLabel	: '<?php i18n('Halafax Directory'); ?>',
					name		: 'hylafax_basedir',
					id			: 'hylafax_basedir'
				},{
					fieldLabel	: '<?php i18n('Halafax Enscript Command'); ?>',
					name		: 'hylafax_enscript',
					id			: 'hylafax_enscript'
				},{
					xtype		: 'checkbox',
					fieldLabel	: '<?php i18n('Enable Scanner Support'); ?>',
					name		: 'enable_scanner',
					id			: 'enable_scanner'
				},{
					fieldLabel	: '<?php i18n('Scanner Directory'); ?>',
					name		: 'scanner_output_directory',
					id			: 'scanner_output_directory'
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