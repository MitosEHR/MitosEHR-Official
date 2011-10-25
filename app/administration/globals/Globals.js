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
Ext.define('Ext.mitos.panel.administration.globals.Globals',{
    extend      : 'Ext.mitos.RenderPanel',
    id          : 'panelGlobals',
    pageTitle   : 'MitosEHR Global Settings',
    uses        : [ 'Ext.mitos.CRUDStore' ],
    initComponent: function(){
        var page = this;
        // *************************************************************************************
        // Global Model and Data store
        // *************************************************************************************
        page.globalStore = Ext.create('Ext.mitos.CRUDStore', {
            fields: [
                { name: 'data_id',								type:'int' },
                { name: 'fullname',						        type:'auto' },
                { name: 'default_top_pane',						type:'auto' },
                { name: 'concurrent_layout',					type:'auto' },
                { name: 'css_header',							type:'auto' },
                { name: 'gbl_nav_area_width',					type:'auto' },
                { name: 'mitosehr_name',						type:'auto' },
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
            model		: 'Globals',
            idProperty	: 'data_id',
            read		: 'app/administration/globals/data_read.ejs.php',
            update		: 'app/administration/globals/data_update.ejs.php'
        });
        //------------------------------------------------------------------------------
        // When the data is loaded semd values to de form
        //------------------------------------------------------------------------------
        page.globalStore.on('load',function(DataView, records, o){
            var rec = page.globalStore.getById(1); // get the record from the store
            page.globalFormPanel.getForm().loadRecord(rec);
        });
        // *************************************************************************************
        // Data Model for all selet lists
        // *************************************************************************************
        Ext.define("selectLists", {extend: "Ext.data.Model", fields: [
                { name: 'list_id',		type:'string' },
                { name: 'option_id',	type:'string' },
                { name: 'title',		type:'string' },
                { name: 'seq',			type:'int' },
                { name: 'is_default',	type:'int' }
            ],
            idProperty: 'list_id'
        });
        page.selectListsStore = Ext.data.Store({
            model		: 'selectLists',
            proxy		: {
                type	: 'ajax',
                url		: 'app/administration/globals/component_data.ejs.php?task=selectLists',
                reader: {
                    type			: 'json',
                    totalProperty	: 'totals',
                    root			: 'row'
                }
            },
            autoLoad: true
        });

        // *************************************************************************************
        // Data Model for Languages select list
        // *************************************************************************************
        Ext.define("Language", {extend: "Ext.data.Model", fields: [
                { name: 'lang_id',		type:'string' },
                { name: 'lang_code',	type:'string' },
                { name: 'lang_description',		type:'string' }
            ],
            idProperty: 'lang_id'
        });
        page.language_defaultStore = Ext.data.Store({
            model		: 'Language',
            proxy		: {
                type	: 'ajax',
                url		: 'app/administration/globals/component_data.ejs.php?task=langs',
                reader: {
                    type			: 'json',
                    totalProperty	: 'totals',
                    root			: 'row'
                }
            },
            autoLoad: true
        });
        // *************************************************************************************
        // Data Model for Main Screen
        // *************************************************************************************
        page.default_top_pane_store = Ext.create('Ext.data.Store', {
            fields: ['title', 'option_id'],
            data : [
                {"title":"Dashboard",   "option_id":"app/dashboard/dashboard.ejs.php"},
                {"title":"Calendar",    "option_id":"app/calendar/calendar.ejs.php"},
                {"title":"Messages",    "option_id":"app/messages/messages.ejs.php"}
            ]
        });
        // *************************************************************************************
        // Data Model for Fullname Format
        // *************************************************************************************
        page.fullname_store = Ext.create('Ext.data.Store', {
            fields: ['format', 'option_id'],
            data : [
                {"format":"Last, First Middle", "option_id":"0"},
                {"format":"First Middle Last", "option_id":"1"}
            ]
        });
        // *************************************************************************************
        // Data Model for Layout Styles
        // *************************************************************************************
        page.concurrent_layout_store = Ext.create('Ext.data.Store', {
            fields: ['title', 'option_id'],
            data : [
                {"title":"Main Navigation Menu (left)", "option_id":"west"},
                {"title":"Main Navigation Menu (right)", "option_id":"east"}
            ]
        });
        // *************************************************************************************
        // Data Model for Themes
        // *************************************************************************************
        page.css_header_store = Ext.create('Ext.data.Store', {
            fields: ['title', 'option_id'],
            data : [
                {"title":"Grey (default)", "option_id":"ext-all-gray.css"},
                {"title":"Blue", "option_id":"ext-all.css"},
                {"title":"Access", "option_id":"ext-all-access.css"}
            ]
        });
        // *************************************************************************************
        // Data Model for new patient form
        // *************************************************************************************
        page.full_new_patient_form_store = Ext.create('Ext.data.Store', {
            fields: ['title', 'option_id'],
            data : [
                {"title":"Old-style static form without search or duplication check", "option_id":"0"},
                {"title":"All demographics fields, with search and duplication check", "option_id":"1"},
                {"title":"Mandatory or specified fields only, search and dup check", "option_id":"2"},
                {"title":"Mandatory or specified fields only, dup check, no search", "option_id":"3"}
            ]
        });
        // *************************************************************************************
        // Data Model for Patient Search results styes
        // *************************************************************************************
        page.patient_search_results_style_store = Ext.create('Ext.data.Store', {
            fields: ['title', 'option_id'],
            data : [
                {"title":"Encounter statistics", "option_id":"0"},
                {"title":"Mandatory and specified fields", "option_id":"1"}
            ]
        });
        // *************************************************************************************
        // Data Model for
        // *************************************************************************************
        page.units_of_measurement_store = Ext.create('Ext.data.Store', {
            fields: ['title', 'option_id'],
            data : [
                {"title":"Show both US and metric (main unit is US)", "option_id":"1"},
                {"title":"Show both US and metric (main unit is metric)", "option_id":"2"},
                {"title":"Show US only", "option_id":"3"},
                {"title":"Show metric only", "option_id":"4"}
            ]
        });
        // *************************************************************************************
        // Data Model for date display format
        // *************************************************************************************
        page.date_display_format_store = Ext.create('Ext.data.Store', {
            fields: ['title', 'option_id'],
            data : [
                {"title":"YYYY-MM-DD", "option_id":"0"},
                {"title":"MM/DD/YYYY", "option_id":"1"},
                {"title":"DD/MM/YYYY", "option_id":"2"}
            ]
        });
        // *************************************************************************************
        // Data Model for
        // *************************************************************************************
        page.time_display_format_store = Ext.create('Ext.data.Store', {
            fields: ['title', 'option_id'],
            data : [
                {"title":"24 hr", "option_id":"0"},
                {"title":"12 hr", "option_id":"1"}
            ]
        });
        // *************************************************************************************
        // Data Model for currency decimals
        // *************************************************************************************
        page.currency_decimals_store = Ext.create('Ext.data.Store', {
            fields: ['title', 'option_id'],
            data : [
                {"title":"0", "option_id":"0"},
                {"title":"1", "option_id":"1"},
                {"title":"2", "option_id":"2"}
            ]
        });
        // *************************************************************************************
        // Data Model for currency decimal point
        // *************************************************************************************
        page.currency_dec_point_store = Ext.create('Ext.data.Store', {
            fields: ['title', 'option_id'],
            data : [
                {"title":"Comma", "option_id":","},
                {"title":"Period", "option_id":"."}
            ]
        });
        // *************************************************************************************
        // Data Model for thousands separator
        // *************************************************************************************
        page.currency_thousands_sep_store = Ext.create('Ext.data.Store', {
            fields: ['title', 'option_id'],
            data : [
                {"title":"Comma", "option_id":","},
                {"title":"Period", "option_id":"."},
                {"title":"Space", "option_id":" "},
                {"title":"None", "option_id":""}
            ]
        });
        // *************************************************************************************
        // Data Model for Email Method
        // *************************************************************************************
        page.EMAIL_METHOD_store = Ext.create('Ext.data.Store', {
            fields: ['title', 'option_id'],
            data : [
                {"title":"PHPMAIL", "option_id":"PHPMAIL"},
                {"title":"SENDMAIL", "option_id":"SENDMAIL"},
                {"title":"SMTP", "option_id":"SMTP"}
            ]
        });
        // *************************************************************************************
        // Data Model for State and Country types
        // *************************************************************************************
        page.state_country_data_type_store = Ext.create('Ext.data.Store', {
            fields: ['title', 'option_id'],
            data : [
                {"title":"Text field", "option_id":"2"},
                {"title":"Single-selection list", "option_id":"1"},
                {"title":"Single-selection list with ability to add to the list", "option_id":"26"}
            ]
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
        page.dummyStore = Ext.data.ArrayStore({
            fields: ['title', 'option_id'],
            data : Ext.data.dummy
        });
        //**************************************************************************
        // Global Form Panel
        //**************************************************************************
        page.globalFormPanel = Ext.create('Ext.mitos.FormPanel', {
            id				: 'globalFormPanel',
            frame			: true,
            border			: true,
            layout			: 'fit',
            autoScroll		: true,
            padding			: 0,
            fieldDefaults	: { msgTarget: 'side', labelWidth: 220, width: 520 },
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
                        fieldLabel	: 'Main Top Pane Screen',
                        name		: 'default_top_pane',
                        displayField: 'title',
                        valueField	: 'option_id',
                        editable	: false,
                        store		: page.default_top_pane_store
                    },{
                        xtype		: 'combo',
                        fieldLabel	: 'Layout Style',
                        name		: 'concurrent_layout',
                        displayField: 'title',
                        valueField	: 'option_id',
                        editable	: false,
                        store		: page.concurrent_layout_store
                    },{
                        xtype		: 'combo',
                        fieldLabel	: 'Theme',
                        name		: 'css_header',
                        displayField: 'title',
                        valueField	: 'option_id',
                        editable	: false,
                        store		: page.css_header_store
                    },{
                        xtype		: 'textfield',
                        fieldLabel	: 'Navigation Area Width',
                        name		: 'gbl_nav_area_width'
                    },{
                        xtype		: 'textfield',
                        fieldLabel	: 'Application Title',
                        name		: 'mitosehr_name'
                    },{
                        xtype		: 'combo',
                        fieldLabel	: 'New Patient Form',
                        name		: 'full_new_patient_form',
                        displayField: 'title',
                        valueField	: 'option_id',
                        editable	: false,
                        store		: page.full_new_patient_form_store
                    },{
                        xtype		: 'combo',
                        fieldLabel	: 'Patient Search Resuls Style',
                        name		: 'patient_search_results_style',
                        displayField: 'title',
                        valueField	: 'option_id',
                        editable	: false,
                        store		: page.patient_search_results_style_store
                    },{
                        xtype		: 'checkbox',
                        fieldLabel	: 'Simplified Demographics',
                        name		: 'simplified_demographics'
                    },{
                        xtype		: 'checkbox',
                        fieldLabel	: 'Simplified Prescriptions',
                        name		: 'simplified_prescriptions'
                    },{
                        xtype		: 'checkbox',
                        fieldLabel	: 'Simplified Co-Pay',
                        name		: 'simplified_copay'
                    },{
                        xtype		: 'checkbox',
                        fieldLabel	: 'User Charges Panel',
                        name		: 'use_charges_panel'
                    },{
                        xtype		: 'textfield',
                        fieldLabel	: 'Online Support Link',
                        name		: 'online_support_link'
                    }]
                },{
                    title:'Locale',
                    //defaults: {},
                    defaultType: 'textfield',
                    items: [{
                        xtype		: 'combo',
                        fieldLabel	: 'Fullname Format',
                        name		: 'fullname',
                        displayField: 'format',
                        valueField	: 'option_id',
                        editable	: false,
                        store		: page.fullname_store
                    },{
                        xtype		: 'combo',
                        fieldLabel	: 'Default Language',
                        name		: 'language_default',
                        displayField: 'lang_description',
                        valueField	: 'option_id',
                        editable	: false,
                        store		: page.language_defaultStore
                    },{
                        xtype		: 'checkbox',
                        fieldLabel	: 'All Language Allowed',
                        name		: 'language_menu_showall'
                    },{
                        xtype		: 'combo',
                        fieldLabel	: 'Allowed Languages -??-',
                        name		: 'lang_description2',  // ???????
                        id			: 'lang_description2',  // ???????
                        displayField: 'lang_description',
                        valueField	: 'lang_description',
                        multiSelect	: true,
                        editable	: false,
                        store		: page.language_defaultStore
                    },{
                        xtype		: 'checkbox',
                        fieldLabel	: 'Allow Debuging Language -??-',
                        name		: 'Loc4'  // ???????
                    },{
                        xtype		: 'checkbox',
                        fieldLabel	: 'Translate Layouts',
                        name		: 'translate_layout'
                    },{
                        xtype		: 'checkbox',
                        fieldLabel	: 'Translate List',
                        name		: 'translate_lists'
                    },{
                        xtype		: 'checkbox',
                        fieldLabel	: 'Translate Access Control Roles',
                        name		: 'translate_gacl_groups'
                    },{
                        xtype		: 'checkbox',
                        fieldLabel	: 'Translate Patient Note Titles',
                        name		: 'translate_form_titles'
                    },{
                        xtype		: 'checkbox',
                        fieldLabel	: 'Translate Documents Categoies',
                        name		: 'translate_document_categories',
                        id			: 'translate_document_categories'
                    },{
                        xtype		: 'checkbox',
                        fieldLabel	: 'Translate Appointment Categories',
                        name		: 'translate_appt_categories'
                    },{
                        xtype		: 'combo',
                        fieldLabel	: 'Units for Visits Forms',
                        name		: 'units_of_measurement',
                        displayField: 'title',
                        valueField	: 'option_id',
                        editable	: false,
                        store		: page.units_of_measurement_store
                    },{
                        xtype		: 'checkbox',
                        fieldLabel	: 'Disable Old Metric Vitals Form',
                        name		: 'disable_deprecated_metrics_form'
                    },{
                        xtype		: 'textfield',
                        fieldLabel	: 'Telephone Country Code',
                        name		: 'phone_country_code'
                    },{
                        xtype		: 'combo',
                        fieldLabel	: 'Date Display Format',
                        name		: 'date_display_format',
                        displayField: 'title',
                        valueField	: 'option_id',
                        editable	: false,
                        store		: page.date_display_format_store
                    },{
                        xtype		: 'combo',
                        fieldLabel	: 'Time Display Format -??-',
                        name		: 'date_display_format',   // ??????
                        displayField: 'title',
                        valueField	: 'option_id',
                        editable	: false,
                        store		: page.time_display_format_store
                    },{
                        xtype		: 'combo',
                        fieldLabel	: 'Currency Decimal Places',
                        name		: 'currency_decimals',
                        displayField: 'title',
                        valueField	: 'option_id',
                        editable	: false,
                        store		: page.currency_decimals_store
                    },{
                        xtype		: 'combo',
                        fieldLabel	: 'Currency Decimal Point Symbol',
                        name		: 'currency_dec_point',
                        displayField: 'title',
                        valueField	: 'option_id',
                        editable	: false,
                        store		: page.currency_dec_point_store
                    },{
                        xtype		: 'combo',
                        fieldLabel	: 'Currency Thousands Separator',
                        name		: 'currency_thousands_sep',
                        displayField: 'title',
                        valueField	: 'option_id',
                        editable	: false,
                        store		: page.currency_thousands_sep_store
                    },{
                        xtype		: 'textfield',
                        fieldLabel	: 'Currency Designator',
                        name		: 'gbl_currency_symbol'
                    }]
                },{
                    title:'Features',
                    defaultType: 'checkbox',
                    items: [{
                        xtype		: 'combo',
                        fieldLabel	: 'Specific Application',
                        name		: 'date_display_format',
                        displayField: 'title',
                        valueField	: 'option_id',
                        editable	: false,
                        store		: page.dummyStore
                    },{
                        xtype		: 'combo',
                        fieldLabel	: 'Drugs and Prodructs',
                        name		: 'date_display_format',
                        displayField: 'title',
                        valueField	: 'option_id',
                        editable	: false,
                        store		: page.dummyStore
                    },{
                        fieldLabel	: 'Disable Chart Tracker',
                        name		: 'date_display_format'
                    },{
                        fieldLabel	: 'Disable Immunizations',
                        name		: 'disable_immunizations'
                    },{
                        fieldLabel	: 'Disable Prescriptions',
                        name		: 'disable_prescriptions'
                    },{
                        fieldLabel	: 'Omit Employers',
                        name		: 'omit_employers'
                    },{
                        fieldLabel	: 'Support Multi-Provider Events',
                        name		: 'select_multi_providers'
                    },{
                        fieldLabel	: 'Disable User Groups',
                        name		: 'disable_non_default_groups'
                    },{
                        fieldLabel	: 'Skip Authorization of Patient Notes',
                        name		: 'ignore_pnotes_authorization'
                    },{
                        fieldLabel	: 'Allow Encounters Claims',
                        name		: 'support_encounter_claims'
                    },{
                        fieldLabel	: 'Advance Directives Warning',
                        name		: 'advance_directives_warning'
                    },{
                        fieldLabel	: 'Configuration Export/Import',
                        name		: 'configuration_import_export'
                    },{
                        fieldLabel	: 'Restrict Users to Facilities',
                        name		: 'restrict_user_facility'
                    },{
                        fieldLabel	: 'Remember Selected Facility',
                        name		: 'set_facility_cookie'
                    },{
                        fieldLabel	: 'Discounts as monetary Ammounts',
                        name		: 'discount_by_money'
                    },{
                        fieldLabel	: 'Referral Source for Encounters',
                        name		: 'gbl_visit_referral_source'
                    },{
                        fieldLabel	: 'Maks for Patients IDs',
                        xtype		: 'textfield',
                        name		: 'gbl_mask_patient_id'
                    },{
                        fieldLabel	: 'Mask of Invoice Numbers',
                        xtype		: 'textfield',
                        name		: 'gbl_mask_invoice_number'
                    },{
                        fieldLabel	: 'Mask for Product IDs',
                        xtype		: 'textfield',
                        name		: 'gbl_mask_product_id'
                    },{
                        fieldLabel	: 'Force Billing Widget Open',
                        name		: 'force_billing_widget_open'
                    },{
                        fieldLabel	: 'Actiate CCR/CCD Reporting',
                        name		: 'activate_ccr_ccd_report'
                    },{
                        fieldLabel	: 'Hide Encryption/Decryption Options in Document Managment -??-',
                        name		: 'Feat22'   // ?????
                    }]
                },{
                    title:'Calendar',
                    defaultType: 'combo',
                    items: [{
                        xtype		: 'checkbox',
                        fieldLabel	: 'Disable Calendar',
                        name		: 'Cal1'
                    },{
                        fieldLabel	: 'Calendar Starting Hour',
                        name		: 'Cal2',
                        displayField: 'title',
                        valueField	: 'option_id',
                        editable	: false,
                        store		: page.dummyStore
                    },{
                        fieldLabel	: 'Calendar Ending Hour',
                        name		: 'Cal3',
                        displayField: 'title',
                        valueField	: 'option_id',
                        editable	: false,
                        store		: page.dummyStore
                    },{
                        fieldLabel	: 'Calendar Interval',
                        name		: 'Cal4',
                        displayField: 'title',
                        valueField	: 'option_id',
                        editable	: false,
                        store		: page.dummyStore
                    },{
                        fieldLabel	: 'Appointment Display Style',
                        name		: 'Cal5',
                        displayField: 'title',
                        valueField	: 'option_id',
                        editable	: false,
                        store		: page.dummyStore
                    },{
                        xtype		: 'checkbox',
                        fieldLabel	: 'Provider See Entire Calendar',
                        name		: 'Cal6'
                    },{
                        xtype		: 'checkbox',
                        fieldLabel	: 'Auto-Create New Encounters',
                        name		: 'Cal7'
                    },{
                        fieldLabel	: 'Appointment/Event Color',
                        name		: 'Cal8',
                        displayField: 'title',
                        valueField	: 'option_id',
                        editable	: false,
                        store		: page.dummyStore
                    }]
                },{
                    title:'Security',
                    defaultType: 'textfield',
                    items: [{
                        fieldLabel	: 'Idle Session Timeout Seconds',
                        name		: 'timeout'
                    },{
                        xtype		: 'checkbox',
                        fieldLabel	: 'Require Strong Passwords',
                        name		: 'secure_password',
                        displayField: 'title',
                        valueField	: 'option_id',
                        editable	: false,
                        store		: page.dummyStore
                    },{
                        xtype		: 'checkbox',
                        fieldLabel	: 'Require Unique Passwords',
                        name		: 'password_history'
                    },{
                        fieldLabel	: 'Defaults Password Expiration Days',
                        name		: 'password_expiration_days'
                    },{
                        fieldLabel	: 'Password Expiration Grace Period',
                        name		: 'password_grace_time'
                    },{
                        xtype		: 'checkbox',
                        fieldLabel	: 'Enable Clients SSL',
                        name		: 'is_client_ssl_enabled'
                    },{
                        fieldLabel	: 'Path to CA Certificate File',
                        name		: 'certificate_authority_crt'
                    },{
                        fieldLabel	: 'Path to CA Key File',
                        name		: 'certificate_authority_key'
                    },{
                        fieldLabel	: 'Client Certificate Expiration Days',
                        name		: 'client_certificate_valid_in_days'
                    },{
                        fieldLabel	: 'Emergency Login Email Address',
                        name		: 'Emergency_Login_email_id'
                    }]
                },{
                    title:'Notifocations',
                    defaultType: 'textfield',
                    items: [{
                        fieldLabel	: 'Notification Email Address',
                        name		: 'practice_return_email_path'
                    },{
                        xtype		: 'combo',
                        fieldLabel	: 'Email Transport Method',
                        name		: 'EMAIL_METHOD',
                        displayField: 'title',
                        valueField	: 'option_id',
                        editable	: false,
                        store		: page.EMAIL_METHOD_store
                    },{
                        fieldLabel	: 'SMPT Server Hostname',
                        name		: 'SMTP_HOST'
                    },{
                        fieldLabel	: 'SMPT Server Port Number',
                        name		: 'SMTP_PORT'
                    },{
                        fieldLabel	: 'SMPT User for Authentication',
                        name		: 'SMTP_USER'
                    },{
                        fieldLabel	: 'SMPT Password for Authentication',
                        name		: 'SMTP_PASS'
                    },{
                        fieldLabel	: 'Email Notification Hours',
                        name		: 'EMAIL_NOTIFICATION_HOUR'
                    },{
                        fieldLabel	: 'SMS Notification Hours',
                        name		: 'SMS_NOTIFICATION_HOUR'
                    },{
                        fieldLabel	: 'SMS Gateway Usarname',
                        name		: 'SMS_GATEWAY_USENAME'
                    },{
                        fieldLabel	: 'SMS Gateway Password',
                        name		: 'SMS_GATEWAY_PASSWORD'
                    },{
                        fieldLabel	: 'SMS Gateway API Key',
                        name		: 'SMS_GATEWAY_APIKEY'
                    }]
                },{
                    title:'Loging',
                    defaultType: 'checkbox',
                    items: [{
                        fieldLabel	: 'Enable Audit Logging',
                        name		: 'enable_auditlog'
                    },{
                        fieldLabel	: 'Audid Logging Patient Record',
                        name		: 'audit_events_patient'
                    },{
                        fieldLabel	: 'Audid Logging Scheduling',
                        name		: 'audit_events_scheduling'
                    },{
                        fieldLabel	: 'Audid Logging Order',
                        name		: 'audit_events_order'
                    },{
                        fieldLabel	: 'Audid Logging Security Administration',
                        name		: 'audit_events_security'
                    },{
                        fieldLabel	: 'Audid Logging Backups',
                        name		: 'audit_events_backup'
                    },{
                        fieldLabel	: 'Audid Loging Miscellaeous',
                        name		: 'audit_events_other'
                    },{
                        fieldLabel	: 'Audid Logging SELECT Query',
                        name		: 'audit_events_query'
                    },{
                        fieldLabel	: 'Enable ATNA Auditing',
                        name		: 'enable_atna_audit'
                    },{
                        xtype		: 'textfield',
                        fieldLabel	: 'ATNA audit host',
                        name		: 'atna_audit_host'
                    },{
                        xtype		: 'textfield',
                        fieldLabel	: 'ATNA audit post',
                        name		: 'atna_audit_port'
                    },{
                        xtype		: 'textfield',
                        fieldLabel	: 'ATNA audit local certificate',
                        name		: 'atna_audit_localcert'
                    },{
                        xtype		: 'textfield',
                        fieldLabel	: 'ATNA audit CA certificate',
                        name		: 'atna_audit_cacert'
                    }]
                },{
                    title:'Miscellaneus',
                    defaultType: 'textfield',
                    items: [{
                        fieldLabel	: 'Path to MySQL Binaries',
                        name		: 'mysql_bin_dir'
                    },{
                        fieldLabel	: 'Path to Perl Binaries',
                        name		: 'perl_bin_dir'
                    },{
                        fieldLabel	: 'Path to Temporary Files',
                        name		: 'temporary_files_dir'
                    },{
                        fieldLabel	: 'Path for Event Log Backup',
                        name		: 'backup_log_dir'
                    },{
                        xtype		: 'combo',
                        fieldLabel	: 'State Data Type',
                        name		: 'state_data_type',
                        displayField: 'title',
                        valueField	: 'option_id',
                        editable	: false,
                        store		: page.state_country_data_type_store
                    },{
                        fieldLabel	: 'State Lsit',
                        name		: 'state_list'
                    },{
                        xtype 		: 'checkbox',
                        fieldLabel	: 'State List Widget Custom Fields',
                        name		: 'state_custom_addlist_widget'
                    },{
                        xtype		: 'combo',
                        fieldLabel	: 'Country Data Type',
                        name		: 'country_data_type',
                        displayField: 'title',
                        valueField	: 'option_id',
                        editable	: false,
                        store		: page.state_country_data_type_store
                    },{
                        fieldLabel	: 'Country list',
                        name		: 'country_list'
                    },{
                        fieldLabel	: 'Print Command',
                        name		: 'print_command'
                    },{
                        fieldLabel	: 'Default Reason for Visit',
                        name		: 'default_chief_complaint'
                    },{
                        fieldLabel	: 'Default Encounter Form ID',
                        name		: 'default_new_encounter_form'
                    },{
                        fieldLabel	: 'patient ID Category Name',
                        name		: 'patient_id_category_name'
                    },{
                        fieldLabel	: 'patient Photo Category name',
                        name		: 'patient_photo_category_name'
                    },{
                        xtype		: 'checkbox',
                        fieldLabel	: 'Medicare Referrer is Renderer',
                        name		: 'MedicareReferrerIsRenderer'
                    },{
                        fieldLabel	: 'Final Close Date (yyy-mm-dd)',
                        name		: 'post_to_date_benchmark'
                    },{
                        xtype		: 'checkbox',
                        fieldLabel	: 'Enable Hylafax Support',
                        name		: 'enable_hylafax'
                    },{
                        fieldLabel	: 'Halafax Server',
                        name		: 'hylafax_server'
                    },{
                        fieldLabel	: 'Halafax Directory',
                        name		: 'hylafax_basedir'
                    },{
                        fieldLabel	: 'Halafax Enscript Command',
                        name		: 'hylafax_enscript'
                    },{
                        xtype		: 'checkbox',
                        fieldLabel	: 'Enable Scanner Support',
                        name		: 'enable_scanner'
                    },{
                        fieldLabel	: 'Scanner Directory',
                        name		: 'scanner_output_directory'
                    }]
                },{
                    title:'Connectors',
                    defaultType: 'textfield',
                    items: [{
                        xtype		: 'checkbox',
                        fieldLabel	: 'Enable Lab Exchange',
                        name		: 'Conn1'
                    },{
                        fieldLabel	: 'Lab Exchange Site ID',
                        name		: 'Conn2'
                    },{
                        fieldLabel	: 'Lab Exchange Token ID',
                        name		: 'Conn3'
                    },{
                        fieldLabel	: 'Lab Exchange Site Address',
                        name		: 'Conn4'
                    }]
                }],
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [{
                        text      : 'Save Configuration',
                        iconCls   : 'save',
                        handler   : function(){
                            var record = page.globalStore.getAt('0');
                            var fieldValues = page.globalFormPanel.getForm().getValues();
                            for (var k=0; k <= record.fields.getCount()-1; k++) {
                                var i = record.fields.get(k).name;
                                record.set( i, fieldValues[i] );
                            }
                            page.globalStore.sync();	// Save the record to the dataStore
                            page.globalStore.load();	// Reload the dataSore from the database

                            Ext.topAlert.msg('New Global Configuration Saved', 'For some settings to take place you will have to refresh the application.');
                        }
                    }]
                }]
            }]
        });
        page.pageBody = [ page.globalFormPanel ];
        page.callParent(arguments);
    } // end of initComponent
}); //ens LogPage class