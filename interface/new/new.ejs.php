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
//
//******************************************************************************

session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');
?>

<script type="text/javascript">

Ext.onReady(function(){


  //Suffix Combo Data
  Ext.namespace('Ext.suffixData');
  Ext.suffixData.suffix = [ [ 'Unassigned', 'Unassigned' ], [ 'Mr.', 'Mr.' ], [ 'Mrs.', 'Mrs.' ], [ 'Ms.', 'Ms.' ], [ 'Dr.', 'Dr.' ], ];
  //simple array store
  var suffixStore = new Ext.data.ArrayStore( {
    fields : [ 'value', 'suffix' ],
    data : Ext.suffixData.suffix
  });

// *************************************************************************************
// turn on validation errors beside the field globally
// *************************************************************************************
Ext.form.Field.prototype.msgTarget = 'under';


// *************************************************************************************
// Structure of the patient record
// creates a subclass of Ext.data.Record
//
// This should be the structure of the database table too
// *************************************************************************************
var PatientRecord = Ext.data.Record.create([
  {name: 'id', type: 'int',  mapping: 'id'},
  {name: 'title', type: 'string', mapping: 'title'},
  {name: 'language', type: 'string', mapping: 'language'},
  {name: 'financial', type: 'string', mapping: 'financial'},
  {name: 'fname', type: 'string', mapping: 'fname'},
  {name: 'lname', type: 'string', mapping: 'lname'},
  {name: 'mname', type: 'string', mapping: 'mname'},
  {name: 'DOB', type: 'date', mapping: 'DOB'},
  {name: 'reply_to',  type: 'string',  mapping: 'reply_to'},
  {name: 'street',  type: 'string',  mapping: 'street'},
  {name: 'postal_code',  type: 'string',  mapping: 'postal_code'},
  {name: 'city',  type: 'string',  mapping: 'city'},
  {name: 'state',  type: 'string',  mapping: 'state'},
  {name: 'country_code',  type: 'string',  mapping: 'country_code'},
  {name: 'drivers_license',  type: 'string',  mapping: 'drivers_license'},
  {name: 'ss',  type: 'string',  mapping: 'ss'},
  {name: 'occupation',  type: 'string',  mapping: 'occupation'},
  {name: 'phone_home',  type: 'string',  mapping: 'phone_home'},
  {name: 'phone_biz',  type: 'string',  mapping: 'phone_biz'},
  {name: 'phone_contact',  type: 'string',  mapping: 'phone_contact'},
  {name: 'phone_cell',  type: 'string',  mapping: 'phone_cell'},
  {name: 'pharmacy_id',  type: 'int',  mapping: 'pharmacy_id'},
  {name: 'status',  type: 'string',  mapping: 'status'},
  {name: 'contact_relationship',  type: 'string',  mapping: 'contact_relationship'},
  {name: 'date',  type: 'date',  mapping: 'date'},
  {name: 'sex',  type: 'string',  mapping: 'sex'},
  {name: 'referrer',  type: 'string',  mapping: 'referrer'},
  {name: 'referrerID',  type: 'int',  mapping: 'referrerID'},
  {name: 'providerID',  type: 'int',  mapping: 'providerID'},
  {name: 'email',  type: 'string',  mapping: 'email'},
  {name: 'ethnoracial',  type: 'string',  mapping: 'ethnoracial'},
  {name: 'race',  type: 'string',  mapping: 'race'},
  {name: 'ethnicity',  type: 'string',  mapping: 'ethnicity'},
  {name: 'interpretter',  type: 'string',  mapping: 'interpretter'},
  {name: 'migrantseasonal',  type: 'string',  mapping: 'migrantseasonal'},
  {name: 'family_size',  type: 'string',  mapping: 'family_size'},
  {name: 'monthly_income',  type: 'string',  mapping: 'monthly_income'},
  {name: 'homeless',  type: 'string',  mapping: 'homeless'},
  {name: 'financial_review',  type: 'string',  mapping: 'financial_review'},
  {name: 'pubpid',  type: 'int',  mapping: 'pubpid'},
  {name: 'pid',  type: 'int',  mapping: 'pid'},
  {name: 'genericname1',  type: 'string',  mapping: 'genericname1'},
  {name: 'genericval1',  type: 'string',  mapping: 'genericval1'},
  {name: 'genericname2',  type: 'string',  mapping: 'genericname2'},
  {name: 'genericval2',  type: 'string',  mapping: 'genericval2'},
  {name: 'hipaa_mail',  type: 'string',  mapping: 'hipaa_mail'},
  {name: 'hipaa_voice',  type: 'string',  mapping: 'hipaa_voice'},
  {name: 'hipaa_notice',  type: 'string',  mapping: 'hipaa_notice'},
  {name: 'hipaa_message',  type: 'string',  mapping: 'hipaa_message'},
  {name: 'hipaa_allowsms',  type: 'string',  mapping: 'hipaa_allowsms'},
  {name: 'hipaa_allowemail',  type: 'string',  mapping: 'hipaa_allowemail'},
  {name: 'squad',  type: 'string',  mapping: 'squad'},
  {name: 'fitness',  type: 'string',  mapping: 'fitness'},
  {name: 'referral_source',  type: 'string',  mapping: 'referral_source'},
  {name: 'usertext1',  type: 'string',  mapping: 'usertext1'},
  {name: 'usertext2',  type: 'string',  mapping: 'usertext2'},
  {name: 'usertext3',  type: 'string',  mapping: 'usertext3'},
  {name: 'usertext4',  type: 'string',  mapping: 'usertext4'},
  {name: 'usertext5',  type: 'string',  mapping: 'usertext5'},
  {name: 'usertext6',  type: 'string',  mapping: 'usertext6'},
  {name: 'usertext7',  type: 'string',  mapping: 'usertext7'},
  {name: 'usertext8',  type: 'string',  mapping: 'usertext8'},
  {name: 'userlist1',  type: 'string',  mapping: 'userlist1'},
  {name: 'userlist2',  type: 'string',  mapping: 'userlist2'},
  {name: 'userlist3',  type: 'string',  mapping: 'userlist3'},
  {name: 'userlist4',  type: 'string',  mapping: 'userlist4'},
  {name: 'userlist5',  type: 'string',  mapping: 'userlist5'},
  {name: 'userlist6',  type: 'string',  mapping: 'userlist6'},
  {name: 'userlist7',  type: 'string',  mapping: 'userlist7'},
  {name: 'pricelevel',  type: 'string',  mapping: 'pricelevel'},
  {name: 'regdate',  type: 'string',  mapping: 'regdate'},
  {name: 'contrastart',  type: 'string',  mapping: 'contrastart'},
  {name: 'completed_ad',  type: 'string',  mapping: 'completed_ad'},
  {name: 'ad_reviewed',  type: 'string',  mapping: 'ad_reviewed'},
  {name: 'vfc',  type: 'string',  mapping: 'vfc'},
  {name: 'mothersname',  type: 'string',  mapping: 'mothersname'},
  {name: 'guardiansname',  type: 'string',  mapping: 'guardiansname'},
  {name: 'allow_imm_reg_use',  type: 'string',  mapping: 'allow_imm_reg_use'},
  {name: 'allow_imm_info_share',  type: 'string',  mapping: 'allow_imm_info_share'},
  {name: 'allow_health_info_ex',  type: 'string',  mapping: 'allow_health_info_ex'},
  {name: 'street',  type: 'string',  mapping: 'street'}
]);

// *************************************************************************************
// Structure and load the data for storeSex
// AJAX -> component_data.ejs.php
// *************************************************************************************
var storeSex = new Ext.data.Store({
	proxy: new Ext.data.ScriptTagProxy({
		url: '../new/component_data.ejs.php?task=sex'
	}),
	reader: new Ext.data.JsonReader({
		idProperty: 'option_id',
		totalProperty: 'results',
		root: 'row'
	},[
		{name: 'option_id', type: 'string', mapping: 'option_id'},
		{name: 'title', type: 'string', mapping: 'title'}
	])
});
storeSex.load();

// *************************************************************************************
// Structure and load the data for storeMarital
// AJAX -> component_data.ejs.php
// *************************************************************************************
var storeMarital = new Ext.data.Store({
	proxy: new Ext.data.ScriptTagProxy({
		url: '../new/component_data.ejs.php?task=marital'
	}),
	reader: new Ext.data.JsonReader({
		idProperty: 'option_id',
		totalProperty: 'results',
		root: 'row'
	},[
		{name: 'option_id', type: 'string', mapping: 'option_id'},
		{name: 'title', type: 'string', mapping: 'title'}
	])
});
storeMarital.load();

// *************************************************************************************
// Structure and load the data for storeState
// AJAX -> component_data.ejs.php
// *************************************************************************************
var storeState = new Ext.data.Store({
	proxy: new Ext.data.ScriptTagProxy({
		url: '../new/component_data.ejs.php?task=state'
	}),
	reader: new Ext.data.JsonReader({
		idProperty: 'option_id',
		totalProperty: 'results',
		root: 'row'
	},[
		{name: 'option_id', type: 'string', mapping: 'option_id'},
		{name: 'title', type: 'string', mapping: 'title'}
	])
});
storeState.load();

// *************************************************************************************
// Structure and load the data for storeCountry
// AJAX -> component_data.ejs.php
// *************************************************************************************
var storeCountry = new Ext.data.Store({
	proxy: new Ext.data.ScriptTagProxy({
		url: '../new/component_data.ejs.php?task=country'
	}),
	reader: new Ext.data.JsonReader({
		idProperty: 'option_id',
		totalProperty: 'results',
		root: 'row'
	},[
		{name: 'option_id', type: 'string', mapping: 'option_id'},
		{name: 'title', type: 'string', mapping: 'title'}
	])
});
storeCountry.load();

// *************************************************************************************
// Structure and load the data for storeRelationship
// AJAX -> component_data.ejs.php
// *************************************************************************************
var storeRelationship = new Ext.data.Store({
	proxy: new Ext.data.ScriptTagProxy({
		url: '../new/component_data.ejs.php?task=relationship'
	}),
	reader: new Ext.data.JsonReader({
		idProperty: 'option_id',
		totalProperty: 'results',
		root: 'row'
	},[
		{name: 'option_id', type: 'string', mapping: 'option_id'},
		{name: 'title', type: 'string', mapping: 'title'}
	])
});
storeRelationship.load();

// *************************************************************************************
// Structure and load the data for storeProvider
// AJAX -> component_data.ejs.php
// *************************************************************************************
var storeProvider = new Ext.data.Store({
	proxy: new Ext.data.ScriptTagProxy({
		url: '../new/component_data.ejs.php?task=users'
	}),
	reader: new Ext.data.JsonReader({
		idProperty: 'user',
		totalProperty: 'results',
		root: 'row'
	},[
		{name: 'user', type: 'string', mapping: 'user'},
		{name: 'full_name', type: 'string', mapping: 'full_name'}
	])
});
storeProvider.load();

// *************************************************************************************
// Structure and load the data for storeYesNo
// AJAX -> component_data.ejs.php
// *************************************************************************************
var storeYesNo = new Ext.data.Store({
	proxy: new Ext.data.ScriptTagProxy({
		url: '../new/component_data.ejs.php?task=yesno'
	}),
	reader: new Ext.data.JsonReader({
		idProperty: 'option_id',
		totalProperty: 'results',
		root: 'row'
	},[
		{name: 'option_id', type: 'string', mapping: 'option_id'},
		{name: 'title', type: 'string', mapping: 'title'}
	])
});
storeYesNo.load();

// *************************************************************************************
// Structure and load the data for storeEthnicity
// AJAX -> component_data.ejs.php
// *************************************************************************************
var storeEthnicity = new Ext.data.Store({
	proxy: new Ext.data.ScriptTagProxy({
		url: '../new/component_data.ejs.php?task=ethnicity'
	}),
	reader: new Ext.data.JsonReader({
		idProperty: 'option_id',
		totalProperty: 'results',
		root: 'row'
	},[
		{name: 'option_id', type: 'string', mapping: 'option_id'},
		{name: 'title', type: 'string', mapping: 'title'}
	])
});
storeEthnicity.load();

// *************************************************************************************
// Structure and load the data for storeLanguage
// AJAX -> component_data.ejs.php
// *************************************************************************************
var storeLanguage = new Ext.data.Store({
	proxy: new Ext.data.ScriptTagProxy({
		url: '../new/component_data.ejs.php?task=language'
	}),
	reader: new Ext.data.JsonReader({
		idProperty: 'option_id',
		totalProperty: 'results',
		root: 'row'
	},[
		{name: 'option_id', type: 'string', mapping: 'option_id'},
		{name: 'title', type: 'string', mapping: 'title'}
	])
});
storeLanguage.load();

// *************************************************************************************
// Structure and load the data for storeLanguage
// AJAX -> component_data.ejs.php
// *************************************************************************************
var storeRace = new Ext.data.Store({
	proxy: new Ext.data.ScriptTagProxy({
		url: '../new/component_data.ejs.php?task=race'
	}),
	reader: new Ext.data.JsonReader({
		idProperty: 'option_id',
		totalProperty: 'results',
		root: 'row'
	},[
		{name: 'option_id', type: 'string', mapping: 'option_id'},
		{name: 'title', type: 'string', mapping: 'title'}
	])
});
storeRace.load();

// *************************************************************************************
// Structure and load the data for storeLanguage
// AJAX -> component_data.ejs.php
// *************************************************************************************
var storeReferral = new Ext.data.Store({
	proxy: new Ext.data.ScriptTagProxy({
		url: '../new/component_data.ejs.php?task=refsource'
	}),
	reader: new Ext.data.JsonReader({
		idProperty: 'option_id',
		totalProperty: 'results',
		root: 'row'
	},[
		{name: 'option_id', type: 'string', mapping: 'option_id'},
		{name: 'title', type: 'string', mapping: 'title'}
	])
});
storeReferral.load();

// *************************************************************************************
// Structure and load the data for Patient New Screen
// AJAX -> data_*.ejs.php
// *************************************************************************************
var storePatient = new Ext.data.Store({
  autoSave  : false,

  // HttpProxy will only allow requests on the same domain.
  // Good for security
  proxy : new Ext.data.HttpProxy({
    method    : 'POST',
    api: {
      read    : '../new/data_read.ejs.php',
      create  : '../new/data_create.ejs.php',
      update  : '../new/data_update.ejs.php',
      destroy : '../new/data_destroy.ejs.php'
    }
  }),

  // JSON Writer options
  writer: new Ext.data.JsonWriter({
    returnJson		: true,
    writeAllFields	: true,
    listful			: true,
    writeAllFields	: true
  }, 
    PatientRecord
  ),

  // JSON Reader options
  reader: new Ext.data.JsonReader({
    idProperty		: 'id',
    totalProperty	: 'results',
    root			: 'row'
  }, 
    PatientRecord 
  )
  
});
storePatient.load();

////////////////////////////////////////////////////////
////////////TOP BASIC INFO FORM/////////////////////////
////////////////////////////////////////////////////////
var patientBasicForm = {
    title		: '<?php i18n('Patient Basic Information'); ?>',
    layout		:'column',
    name		: 'frm_PBF',
    border		:false,
    defaults	: {labelAlign: 'top'},
    autoScroll	: true,
    items: [{
          width:'150',
          style:'padding: 0 5px; margin-left: 10px; margin-top:4px;',
          html: '<img src="../../ui_app/missing_photo.png" width="128" height="128" alt="Patient Image">'
        },{
          layout: 'form',
          border:false,
          bodyStyle:'padding: 0 5px',
          items:
          [
            { xtype:'textfield', maxLength: 25, width: 170, vtype: 'empty_3chr', fieldLabel: '<?php i18n('First name'); ?>', name: 'fname'},
            { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeSex, fieldLabel : '<?php i18n('Sex'); ?>', name : 'sex', width: 80, emptyText: 'Unassigned', tabIndex : 3, editable: false },
            { xtype:'textfield', fieldLabel: '<?php i18n('External ID'); ?>', name: 'pexternalid' },
            { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeMarital, fieldLabel : '<?php i18n('Marital Status'); ?>', name : 'storeMarital', width : 130, emptyText: 'Unassigned', tabIndex : 3, editable: false },
          ]
        },{
          layout: 'form',
          border:false,
          bodyStyle:'padding: 0 5px',
          items:
          [
            { xtype:'textfield', maxLength: 25, width: 50, fieldLabel: '<?php i18n('Middle name'); ?>', name: 'pmname' },
            { xtype:'datefield', vtype: 'dateVal', format: 'Y-m-d', fieldLabel: '<?php i18n('Date of birth'); ?>', name: 'pdob' },
            { xtype:'textfield', fieldLabel: '<?php i18n('User Defined'); ?>', name: 'puserdefiined1' }
          ]
        },{
          layout: 'form',
          border:false,
          bodyStyle:'padding: 0 5px',
          items:
          [
            { xtype:'textfield', maxLength: 25, width: 170, vtype: 'empty_3chr', fieldLabel: '<?php i18n('Last name'); ?>', name: 'plname' },
            { xtype:'textfield', maxLength: 11, vtype: 'SSN', fieldLabel: '<?php i18n('S.S.'); ?>', name: 'pss' },
            { xtype:'textfield', fieldLabel: '<?php i18n('User Defined'); ?>', name: 'puserdefiined2' }
          ]
        },{
          layout: 'form',
          border:false,
          bodyStyle:'padding: 0 5px',
          items:
          [
            { xtype:'textfield', maxLength: 25, fieldLabel: '<?php i18n('Mother mainden name'); ?>', name: 'pmmname' },
            { xtype:'textfield', maxLength: 10, fieldLabel: '<?php i18n('License/ID'); ?>', name: 'plicence' },
            { xtype:'textfield', fieldLabel: '<?php i18n('User Defined'); ?>', name: 'userdefiined3' }
          ]
        }
      ]
};

////////////////////////////////////////////////////////
////////////CONTACT PANEL///////////////////////////////
////////////////////////////////////////////////////////
var contactPanel = {
  title:'<?php i18n('Contact Information'); ?>',
  border:false,
  name  : 'frm_C',
  defaults: {labelAlign: 'top'},
  autoScroll: true, 
  items : [{
    layout : 'form',
    border : false,
    bodyStyle : 'padding: 0 5px',
    items :
    [
      { width : 200, xtype : 'textfield', fieldLabel : '<?php i18n('Address'); ?>', name : 'address', tabIndex : 3 },
      { xtype : 'textfield', fieldLabel : '<?php i18n('City'); ?>', name : 'city', tabIndex : 3 },
      { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeState, fieldLabel : '<?php i18n('State'); ?>', name : 'storeState', width : 80, emptyText : 'Unassigned', tabIndex : 3, editable: false },
      { xtype : 'textfield', fieldLabel : '<?php i18n('Postal Code'); ?>', name : 'postal_code', tabIndex : 3 },
      { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeCountry, fieldLabel : '<?php i18n('Country'); ?>', name : 'country', width : 130, emptyText : 'Unassigned', tabIndex : 3, editable: true },
    ]
    },{
      layout : 'form',
      border : false,
      bodyStyle : 'padding: 0 10px',
      defaults : { width : 200 },
      items :
      [
        { xtype : 'textfield', fieldLabel : '<?php i18n('Guardians Name'); ?>', name : 'guardians_name', tabIndex : 3 },
        { xtype : 'textfield', fieldLabel : '<?php i18n('Mothers Name'); ?>', name : 'mothers_name', tabIndex : 3 },
        { xtype : 'textfield', fieldLabel : '<?php i18n('Home Phone'); ?>', name : 'home_phone', tabIndex : 3 },
        { xtype : 'textfield', fieldLabel : '<?php i18n('Work Phone'); ?>', name : 'work_phone', tabIndex : 3 },
        { xtype : 'textfield', fieldLabel : '<?php i18n('Email'); ?>', name : 'email', vtype : 'checkEmail', tabIndex : 3 }
      ]
      },{
        layout : 'form',
        border : false,
        bodyStyle : 'padding: 0 10px',
        items :
        [
        {
          xtype : 'fieldset',
          title : 'Emergancy Contact Info',
          layout : 'form',
          style : 'background-color:#ffe4e1',
          labelAlign: 'top',
          width : 230,
          defaults : { width : 200 },
          items :
          [
            { xtype : 'textfield', fieldLabel : '<?php i18n('Full Name'); ?>', name : 'emer_fullname', tabIndex : 5 },
            { xtype : 'textfield', fieldLabel : '<?php i18n('Home Phone'); ?>', name : 'emer_home_phone', tabIndex : 6 },
            { xtype : 'textfield', fieldLabel : '<?php i18n('Cel. Phone'); ?>', name : 'emer_cel_phone', tabIndex : 6 }
          ]
        }
        ]
      }]
};

////////////////////////////////////////////////////////
////////////CHOICES PANEL///////////////////////////////
////////////////////////////////////////////////////////
var choicesPanel = {
    title:'<?php i18n('Choices'); ?>',
    border: false,
    name  : 'frm_Choice',
    autoScroll: true, 
    defaults: {layout:'form',labelAlign: 'top'},
    items : [{
      layout : 'form',
      border : false,
      bodyStyle : 'padding: 0 10px',
      defaults : { width : 200 },
      items :
      [
        { xtype : 'combo', hiddenName: 'assigned_to', displayField: 'full_name', valueField: 'user', mode: 'local', triggerAction: 'all', store: storeProvider, fieldLabel : '<?php i18n('Provider'); ?>', name : 'storeProvider', emptyText : 'Unassigned', editable: false },
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeYesNo, fieldLabel : '<?php i18n('Parmacy'); ?>', name : 'none', emptyText : 'Unassigned', editable: false },
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeYesNo, fieldLabel : '<?php i18n('HIPAA notice Received'); ?>', name : 'none', emptyText : 'Unassigned', editable: false },
        { xtype : 'textfield', fieldLabel : '<?php i18n('Leave Message With'); ?>', name : 'none' }
      ]
      },{
        layout : 'form',
        border : false,
        bodyStyle : 'padding: 0 10px',
        defaults : { width : 200 },
        items :
        [
          { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeYesNo, fieldLabel : '<?php i18n('Allow SMS'); ?>', name : 'none', emptyText : 'Unassigned', editable: false },
          { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeYesNo, fieldLabel : '<?php i18n('Allow Immunization Registry Use'); ?>', name : 'none', emptyText : 'Unassigned', editable: false },
          { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeYesNo, fieldLabel : '<?php i18n('Allow Health Information Exchange'); ?>', name : 'none', emptyText : 'Unassigned', editable: false },
          { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeYesNo, fieldLabel : '<?php i18n('Allow Voice Message'); ?>', name : 'none', emptyText : 'Unassigned', editable: false }
        ]
        },{
          layout : 'form',
          border : false,
          bodyStyle : 'padding: 0 10px',
          width : 220,
          defaults : { width : 200 },
          items :
          [
            { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeYesNo, fieldLabel : '<?php i18n('Allow Voice Message'); ?>', name : 'none', emptyText : 'Unassigned', editable: false },
            { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeYesNo, fieldLabel : '<?php i18n('Allow Mail Message'); ?>', name : 'none', emptyText : 'Unassigned', editable: false },
            { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeYesNo, fieldLabel : '<?php i18n('Allow Email'); ?>', name : 'none', emptyText : 'Unassigned', editable: false },
            { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeYesNo, fieldLabel : '<?php i18n('Allow Immunization Info Sharing'); ?>', name : 'none', emptyText : 'Unassigned', editable: false }
          ]
    }]
};

////////////////////////////////////////////////////////
////////////EMPLOYER PANEL//////////////////////////////
////////////////////////////////////////////////////////
var employerPanel = {
    title:'<?php i18n('Employer'); ?>',
    border: false,
    autoScroll: true, 
    defaults: {layout:'form',labelAlign: 'top'},
    items : [{
      layout : 'form',
      border : false,
      bodyStyle : 'padding: 0 10px',
      defaults : { width : 200 },
      items :
      [
        { xtype : 'textfield', fieldLabel : '<?php i18n('Occupation'); ?>', name : 'employer_company' },
        { xtype : 'textfield', fieldLabel : '<?php i18n('Employer Address'); ?>', name : 'employer_address' },
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeState, fieldLabel : '<?php i18n('State'); ?>', name : 'employer_state', width : 130, emptyText : 'Unassigned', editable: false },
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeCountry, fieldLabel : '<?php i18n('Country'); ?>', name : 'employer_country', width : 130, emptyText : 'Unassigned', editable: false }

      ]
    },{
      layout : 'form',
      border : false,
      bodyStyle : 'padding: 0 10px',
      defaults : { width : 200 },
      items :
      [
        { xtype : 'textfield', fieldLabel : '<?php i18n('Employer Name'); ?>', name : 'employer_name' },
        { xtype : 'textfield', fieldLabel : '<?php i18n('City'); ?>', name : 'employer_city' },
        { xtype : 'textfield', fieldLabel : '<?php i18n('Postal Code'); ?>', name : 'employer_postalcode' }
      ]
    }]
};

////////////////////////////////////////////////////////
////////////STATS PANEL/////////////////////////////////
////////////////////////////////////////////////////////
var statsPanel = {
  title:'<?php i18n('Stats'); ?>',
  autoScroll: true,
  border: false,
  defaults: {layout:'form',labelAlign: 'top'},
  items : [ {
    layout : 'form',
    border : false,
    bodyStyle : 'padding: 0 10px',
    defaults : { width : 200 },
    items :
    [
      { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeLanguage, fieldLabel : '<?php i18n('Language'); ?>', name : 'slanguage', width : 130, emptyText : 'Unassigned', editable: false },
      { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeRace, fieldLabel : '<?php i18n('Race'); ?>', name : 'srace', width : 250, emptyText : 'Unassigned', editable: false },
      { xtype : 'textfield', fieldLabel : '<?php i18n('Family Size'); ?>', name : 'sfamily_size' },
      { xtype : 'textfield', fieldLabel : '<?php i18n('Homeless, etc.'); ?>', name : 'shomeless' },
      { xtype : 'textfield', fieldLabel : '<?php i18n('Migrant/Seasonal'); ?>', name : 'smigrant' }
    ]
    },{
    layout : 'form',
    border : false,
    bodyStyle : 'padding: 0 10px',
    defaults : { width : 200 },
    items :
    [
      { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeEthnicity, fieldLabel : '<?php i18n('Ethnicity'); ?>', name : 'pvfc', width : 130, emptyText : 'Unassigned', editable: false },
      { xtype : 'textfield', fieldLabel : '<?php i18n('Financial Review Date'); ?>', name : 'email' },
      { xtype : 'textfield', fieldLabel : '<?php i18n('Monthly Income'); ?>', name : 'email' },
      { xtype : 'textfield', fieldLabel : '<?php i18n('Interpreter'); ?>', name : 'email', vtype : 'checkEmail' },
      { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeReferral, fieldLabel : '<?php i18n('Referral Source'); ?>', name : 'pvfc', width : 130, emptyText : 'Unassigned', editable: false }
    ]
    },{
    layout : 'form',
    border : false,
    bodyStyle : 'padding: 0 10px',
    width : 200,
    items :
    [
      { xtype : 'combo', fieldLabel : '<?php i18n('VFC'); ?>', name : 'pvfc', width : 130, emptyText : 'Select', editable: false }
    ]
  }]
};

////////////////////////////////////////////////////////
////////////PRIMARY INSURANCE PANEL/////////////////////
////////////////////////////////////////////////////////
var primaryInsurancePanel = {
  title:'<?php i18n('Primary Insurance'); ?>',
  autoScroll: true,
  border: false,
  defaults: {layout:'form', width : 200,labelAlign: 'top'},
  items : [{
    layout : 'form',
    name  : 'pi',
    border : false,
    bodyStyle : 'padding: 0 5px',
    defaults : { width : 180 },
    items :
    [
      { xtype : 'combo', fieldLabel : '<?php i18n('Provider'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
      { xtype : 'textfield', fieldLabel : '<?php i18n('Plan Name'); ?>', name : 'company' },
      { xtype : 'datefield', fieldLabel : '<?php i18n('Effective Date'); ?>', name : 'company' },
      { xtype : 'textfield', fieldLabel : '<?php i18n('Policy Number'); ?>', name : 'company' },
      { xtype : 'textfield', fieldLabel : '<?php i18n('Group Number'); ?>', name : 'company' }
    ]
    },{
    xtype : 'fieldset',
    title: '<?php i18n('Subscriber Info'); ?>',
    layout : 'column',
    autoHeight : true,
    width : 370,
    style : 'padding: 5px 10px; margin-right:10px',
    defaults : { width : 170, border:false,labelAlign: 'top'},
    items: [{
      layout : 'form',
      bodyStyle : 'padding: 0 5px',
      defaults : { width : 160 },
      items:
      [
        { xtype: 'textfield', fieldLabel: '<?php i18n('Full Name'); ?>', name : 'company' },
        { xtype : 'datefield', vtype: 'dateVal', fieldLabel : '<?php i18n('Date of Birth'); ?>', name : 'subs_dob', width : 130},
        { xtype : 'textfield', fieldLabel : '<?php i18n('Subscriber Address'); ?>', name : 'company' },
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeState, fieldLabel : '<?php i18n('State'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
        { xtype : 'textfield', fieldLabel : '<?php i18n('Zip Code'); ?>', name : 'company' }
      ]
      },{
      layout: 'form',
      bodyStyle : 'padding: 0 5px',
      defaults : { width : 160 },
      items:
      [
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeRelationship, fieldLabel : '<?php i18n('Relationship'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeSex, fieldLabel : '<?php i18n('Sex'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
        { xtype : 'textfield', fieldLabel : '<?php i18n('City'); ?>', name : 'company' },
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeCountry, fieldLabel : '<?php i18n('Country'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
        { xtype : 'textfield', vtype: 'SSN', fieldLabel : '<?php i18n('S.S.'); ?>', name : 'company' }
      ]
      }]
      },{
      xtype : 'fieldset',
      title: '<?php i18n('Subscriber Employer (SE) Info'); ?>',
      layout : 'form',
      autoHeight : true,
      style : 'padding: 5px 10px',
      defaults : { width : 160 },
      items :
      [
        { xtype : 'textfield', fieldLabel : '<?php i18n('Subscriber Employer'); ?>', name : 'company' },
        { xtype : 'textfield', fieldLabel : '<?php i18n('SE Address'); ?>', name : 'company' },
        { xtype : 'textfield', fieldLabel : '<?php i18n('SE City'); ?>', name : 'company' },
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeState, fieldLabel : '<?php i18n('State'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeCountry, fieldLabel : '<?php i18n('SE Country'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false }
      ]
    }]
};

////////////////////////////////////////////////////////
////////////SECONDARY INSURANCE PANEL///////////////////
////////////////////////////////////////////////////////
var secondaryInsurancePanel = {
  title:'<?php i18n('Secondary Insurance'); ?>',
  autoScroll: true, 
  border: false,
  defaults: {layout:'form', width : 200,labelAlign: 'top'},
  items : [{
    layout : 'form',
    name  : 'frm_si',
    border : false,
    bodyStyle : 'padding: 0 5px',
    defaults : { width : 180 },
    items :
    [
      { xtype : 'combo', fieldLabel : '<?php i18n('Provider'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned',  editable: false },
      { xtype : 'textfield', fieldLabel : '<?php i18n('Plan Name'); ?>', name : 'company' },
      { xtype : 'datefield', fieldLabel : '<?php i18n('Effective Date'); ?>', name : 'company' },
      { xtype : 'textfield', fieldLabel : '<?php i18n('Policy Number'); ?>', name : 'company' },
      { xtype : 'textfield', fieldLabel : '<?php i18n('Group Number'); ?>', name : 'company' }
    ]
    },{
    xtype : 'fieldset',
    title: '<?php i18n('Subscriber Info'); ?>',
    layout : 'column',
    autoHeight : true,
    width : 370,
    style : 'padding: 5px 10px; margin-right:10px',
    defaults : { width : 170, border:false,labelAlign: 'top'},
    items: [{
      layout : 'form',
      bodyStyle : 'padding: 0 5px',
      defaults : { width : 160 },
      items:
      [
        { xtype: 'textfield', fieldLabel: '<?php i18n('Full Name'); ?>', name : 'company' },
        { xtype : 'datefield', vtype: 'dateVal', format: 'Y-m-d', fieldLabel : '<?php i18n('Date of Birth'); ?>', name : 'secondaryInsuranceDate', width : 130 },
        { xtype : 'textfield', fieldLabel : '<?php i18n('Subscriber Address'); ?>', name : 'company' },
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeState, fieldLabel : '<?php i18n('State'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
        { xtype : 'textfield', fieldLabel : '<?php i18n('Zip Code'); ?>', name : 'si_zipcode' }
      ]
    },{
      layout: 'form',
      bodyStyle : 'padding: 0 5px',
      defaults : { width : 160 },
      items:
      [
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeRelationship, fieldLabel : '<?php i18n('Relationship'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeSex, fieldLabel : '<?php i18n('Sex'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
        { xtype : 'textfield', fieldLabel : '<?php i18n('City'); ?>', name : 'company' },
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeCountry, fieldLabel : '<?php i18n('Country'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
        { xtype : 'textfield', vtype: 'SSN', fieldLabel : '<?php i18n('S.S.'); ?>', name : 'company' }
      ]
    }]
  },{
  xtype : 'fieldset',
  title: '<?php i18n('Subscriber Employer (SE) Info'); ?>',
  layout : 'form',
  name  : 'frm_se',
  autoHeight : true,
  style : 'padding: 5px 10px',
  defaults : { width : 160 },
  items :
  [
    { xtype : 'textfield', fieldLabel : '<?php i18n('Subscriber Employer'); ?>', name : 'company' },
    { xtype : 'textfield', fieldLabel : '<?php i18n('SE Address'); ?>', name : 'company' },
    { xtype : 'textfield', fieldLabel : '<?php i18n('SE City'); ?>', name : 'company' },
    { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeState, fieldLabel : '<?php i18n('State'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
    { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeCountry, fieldLabel : '<?php i18n('SE Country'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false }
  ]
  }]
};

////////////////////////////////////////////////////////
////////////TERITARY INSURANCE PANEL////////////////////
////////////////////////////////////////////////////////
var teritaryInsurancePanel = {
  title:'<?php i18n('Teritary Insurance'); ?>',
  autoScroll: true, 
  border: false,
  labelAlign: 'top',
  defaults: {layout:'form', width : 200,labelAlign: 'top'},
  items : [{
    layout : 'form',
    border : false,
    bodyStyle : 'padding: 0 5px',
    defaults : { width : 180 },
    items :
    [
      { xtype : 'combo', fieldLabel : '<?php i18n('Provider'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
      { xtype : 'textfield', fieldLabel : '<?php i18n('Plan Name'); ?>', name : 'company' },
      { xtype : 'datefield', fieldLabel : '<?php i18n('Effective Date'); ?>', name : 'company' },
      { xtype : 'textfield', fieldLabel : '<?php i18n('Policy Number'); ?>', name : 'company' },
      { xtype : 'textfield', fieldLabel : '<?php i18n('Group Number'); ?>', name : 'company' }
    ]
    },{
      xtype : 'fieldset',
      title: '<?php i18n('Subscriber Info'); ?>',
      layout : 'column',
      autoHeight : true,
      width : 370,
      style : 'padding: 5px 10px; margin-right:10px',
      defaults : { width : 170, border:false,labelAlign: 'top' },
      items: [{
        layout : 'form',
        bodyStyle : 'padding: 0 5px',
        defaults : { width : 160 },
        items:
        [
          { xtype: 'textfield', fieldLabel: '<?php i18n('Full Name'); ?>', name : 'company' },
          { xtype : 'datefield', vtype: 'dateVal', format: 'Y-m-d', fieldLabel : '<?php i18n('Date of Birth'); ?>', name : 'suffix', width : 130, emptyText : 'Select', editable: false },
          { xtype : 'textfield', fieldLabel : '<?php i18n('Subscriber Address'); ?>', name : 'company' },
          { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeState, fieldLabel : '<?php i18n('State'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
          { xtype : 'textfield', fieldLabel : '<?php i18n('Zip Code'); ?>', name : 'company' }
        ]
      },{
        layout: 'form',
        bodyStyle : 'padding: 0 5px',
        defaults : { width : 160 },
        items:
        [
          { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeRelationship, fieldLabel : '<?php i18n('Relationship'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
          { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeSex, fieldLabel : '<?php i18n('Sex'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
          { xtype : 'textfield', fieldLabel : '<?php i18n('City'); ?>', name : 'company' },
          { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeCountry, fieldLabel : '<?php i18n('Country'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
          { xtype : 'textfield', vtype: 'SSN', fieldLabel : '<?php i18n('S.S.'); ?>', name : 'company' }
        ]
      }]
      },{
      xtype : 'fieldset',
      title: '<?php i18n('Subscriber Employer (SE) Info'); ?>',
      layout : 'form',
      autoHeight : true,
      style : 'padding: 5px 10px',
      defaults : { width : 160 },
      items :
      [
        { xtype : 'textfield', fieldLabel : '<?php i18n('Subscriber Employer'); ?>', name : 'company' },
        { xtype : 'textfield', fieldLabel : '<?php i18n('SE Address'); ?>', name : 'company' },
        { xtype : 'textfield', fieldLabel : '<?php i18n('SE City'); ?>', name : 'company' },
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeState, fieldLabel : '<?php i18n('State'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeCountry, fieldLabel : '<?php i18n('SE Country'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false }
      ]
  }]
};

////////////////////////////////////////////////////////
/////////////RENDER NEW PATIENT/////////////////////////
////////////////////////////////////////////////////////
//New patient Form Panel
var RenderPanel = new Ext.TabPanel({
  title: '<?php i18n('Patient Search or Add Patient'); ?>',
  border  : false,
  stateful: true,
  monitorResize: true,                    
  autoWidth: true,                        
  id: 'RenderPanel',                      
  renderTo: Ext.getCmp('TopPanel').body,  
  viewConfig:{forceFit:true},             
  labelAlign: 'top',
  activeTab: 0,
  defaults:{ bodyStyle:'padding:10px',autoScroll:true, layout:'column' },  
  items: [ 
    patientBasicForm,
    contactPanel, 
    choicesPanel, 
    employerPanel, 
    statsPanel, 
    primaryInsurancePanel, 
    secondaryInsurancePanel, 
    teritaryInsurancePanel
  ],
  
  bbar:[{
    text :'<?php i18n('Save'); ?>',
    iconCls : 'save',
    ref : '../paSave',
    formBind : true,
    disabled : true
    },'-',{
        text :'<?php i18n('Search Patient'); ?>
        ',
        iconCls : 'searchUsers',
        ref : '../paSave',
        formBind : true,
        disabled : false
    }]
});

}); // END EXTJS

</script>