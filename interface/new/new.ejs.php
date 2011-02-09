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

include_once("../registry.php");

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
    title		: '<?php xl('Patient Basic Information', 'e'); ?>',
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
            { xtype:'textfield', maxLength: 25, width: 170, vtype: 'empty_3chr', fieldLabel: '<?php xl('First name', 'e'); ?>', name: 'fname'},
            { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeSex, fieldLabel : '<?php xl('Sex', 'e'); ?>', name : 'sex', width: 80, emptyText: 'Unassigned', tabIndex : 3, editable: false },
            { xtype:'textfield', fieldLabel: '<?php xl('External ID', 'e'); ?>', name: 'pexternalid' },
            { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeMarital, fieldLabel : '<?php xl('Marital Status', 'e'); ?>', name : 'storeMarital', width : 130, emptyText: 'Unassigned', tabIndex : 3, editable: false },
          ]
        },{
          layout: 'form',
          border:false,
          bodyStyle:'padding: 0 5px',
          items:
          [
            { xtype:'textfield', maxLength: 25, width: 50, fieldLabel: '<?php xl('Middle name', 'e'); ?>', name: 'pmname' },
            { xtype:'datefield', vtype: 'dateVal', format: 'Y-m-d', fieldLabel: '<?php xl('Date of birth', 'e'); ?>', name: 'pdob' },
            { xtype:'textfield', fieldLabel: '<?php xl('User Defined', 'e'); ?>', name: 'puserdefiined1' }
          ]
        },{
          layout: 'form',
          border:false,
          bodyStyle:'padding: 0 5px',
          items:
          [
            { xtype:'textfield', maxLength: 25, width: 170, vtype: 'empty_3chr', fieldLabel: '<?php xl('Last name', 'e'); ?>', name: 'plname' },
            { xtype:'textfield', maxLength: 11, vtype: 'SSN', fieldLabel: '<?php xl('S.S.', 'e'); ?>', name: 'pss' },
            { xtype:'textfield', fieldLabel: '<?php xl('User Defined', 'e'); ?>', name: 'puserdefiined2' }
          ]
        },{
          layout: 'form',
          border:false,
          bodyStyle:'padding: 0 5px',
          items:
          [
            { xtype:'textfield', maxLength: 25, fieldLabel: '<?php xl('Mother mainden name', 'e'); ?>', name: 'pmmname' },
            { xtype:'textfield', maxLength: 10, fieldLabel: '<?php xl('License/ID', 'e'); ?>', name: 'plicence' },
            { xtype:'textfield', fieldLabel: '<?php xl('User Defined', 'e'); ?>', name: 'userdefiined3' }
          ]
        }
      ]
};

////////////////////////////////////////////////////////
////////////CONTACT PANEL///////////////////////////////
////////////////////////////////////////////////////////
var contactPanel = {
  title:'<?php xl('Contact Information', 'e'); ?>',
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
      { width : 200, xtype : 'textfield', fieldLabel : '<?php xl('Address', 'e'); ?>', name : 'address', tabIndex : 3 },
      { xtype : 'textfield', fieldLabel : '<?php xl('City', 'e'); ?>', name : 'city', tabIndex : 3 },
      { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeState, fieldLabel : '<?php xl('State', 'e'); ?>', name : 'storeState', width : 80, emptyText : 'Unassigned', tabIndex : 3, editable: false },
      { xtype : 'textfield', fieldLabel : '<?php xl('Postal Code', 'e'); ?>', name : 'postal_code', tabIndex : 3 },
      { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeCountry, fieldLabel : '<?php xl('Country', 'e'); ?>', name : 'country', width : 130, emptyText : 'Unassigned', tabIndex : 3, editable: true },
    ]
    },{
      layout : 'form',
      border : false,
      bodyStyle : 'padding: 0 10px',
      defaults : { width : 200 },
      items :
      [
        { xtype : 'textfield', fieldLabel : '<?php xl('Guardians Name', 'e'); ?>', name : 'guardians_name', tabIndex : 3 },
        { xtype : 'textfield', fieldLabel : '<?php xl('Mothers Name', 'e'); ?>', name : 'mothers_name', tabIndex : 3 },
        { xtype : 'textfield', fieldLabel : '<?php xl('Home Phone', 'e'); ?>', name : 'home_phone', tabIndex : 3 },
        { xtype : 'textfield', fieldLabel : '<?php xl('Work Phone', 'e'); ?>', name : 'work_phone', tabIndex : 3 },
        { xtype : 'textfield', fieldLabel : '<?php xl('Email', 'e'); ?>', name : 'email', vtype : 'checkEmail', tabIndex : 3 }
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
            { xtype : 'textfield', fieldLabel : '<?php xl('Full Name', 'e'); ?>', name : 'emer_fullname', tabIndex : 5 },
            { xtype : 'textfield', fieldLabel : '<?php xl('Home Phone', 'e'); ?>', name : 'emer_home_phone', tabIndex : 6 },
            { xtype : 'textfield', fieldLabel : '<?php xl('Cel. Phone', 'e'); ?>', name : 'emer_cel_phone', tabIndex : 6 }
          ]
        }
        ]
      }]
};

////////////////////////////////////////////////////////
////////////CHOICES PANEL///////////////////////////////
////////////////////////////////////////////////////////
var choicesPanel = {
    title:'<?php xl('Choices', 'e'); ?>',
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
        { xtype : 'combo', hiddenName: 'assigned_to', displayField: 'full_name', valueField: 'user', mode: 'local', triggerAction: 'all', store: storeProvider, fieldLabel : '<?php xl('Provider', 'e'); ?>', name : 'storeProvider', emptyText : 'Unassigned', editable: false },
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeYesNo, fieldLabel : '<?php xl('Parmacy', 'e'); ?>', name : 'none', emptyText : 'Unassigned', editable: false },
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeYesNo, fieldLabel : '<?php xl('HIPAA notice Received', 'e'); ?>', name : 'none', emptyText : 'Unassigned', editable: false },
        { xtype : 'textfield', fieldLabel : '<?php xl('Leave Message With', 'e'); ?>', name : 'none' }
      ]
      },{
        layout : 'form',
        border : false,
        bodyStyle : 'padding: 0 10px',
        defaults : { width : 200 },
        items :
        [
          { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeYesNo, fieldLabel : '<?php xl('Allow SMS', 'e'); ?>', name : 'none', emptyText : 'Unassigned', editable: false },
          { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeYesNo, fieldLabel : '<?php xl('Allow Immunization Registry Use', 'e'); ?>', name : 'none', emptyText : 'Unassigned', editable: false },
          { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeYesNo, fieldLabel : '<?php xl('Allow Health Information Exchange', 'e'); ?>', name : 'none', emptyText : 'Unassigned', editable: false },
          { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeYesNo, fieldLabel : '<?php xl('Allow Voice Message', 'e'); ?>', name : 'none', emptyText : 'Unassigned', editable: false }
        ]
        },{
          layout : 'form',
          border : false,
          bodyStyle : 'padding: 0 10px',
          width : 220,
          defaults : { width : 200 },
          items :
          [
            { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeYesNo, fieldLabel : '<?php xl('Allow Voice Message', 'e'); ?>', name : 'none', emptyText : 'Unassigned', editable: false },
            { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeYesNo, fieldLabel : '<?php xl('Allow Mail Message', 'e'); ?>', name : 'none', emptyText : 'Unassigned', editable: false },
            { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeYesNo, fieldLabel : '<?php xl('Allow Email', 'e'); ?>', name : 'none', emptyText : 'Unassigned', editable: false },
            { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeYesNo, fieldLabel : '<?php xl('Allow Immunization Info Sharing', 'e'); ?>', name : 'none', emptyText : 'Unassigned', editable: false }
          ]
    }]
};

////////////////////////////////////////////////////////
////////////EMPLOYER PANEL//////////////////////////////
////////////////////////////////////////////////////////
var employerPanel = {
    title:'<?php xl('Employer', 'e'); ?>',
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
        { xtype : 'textfield', fieldLabel : '<?php xl('Occupation', 'e'); ?>', name : 'employer_company' },
        { xtype : 'textfield', fieldLabel : '<?php xl('Employer Address', 'e'); ?>', name : 'employer_address' },
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeState, fieldLabel : '<?php xl('State', 'e'); ?>', name : 'employer_state', width : 130, emptyText : 'Unassigned', editable: false },
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeCountry, fieldLabel : '<?php xl('Country', 'e'); ?>', name : 'employer_country', width : 130, emptyText : 'Unassigned', editable: false }

      ]
    },{
      layout : 'form',
      border : false,
      bodyStyle : 'padding: 0 10px',
      defaults : { width : 200 },
      items :
      [
        { xtype : 'textfield', fieldLabel : '<?php xl('Employer Name', 'e'); ?>', name : 'employer_name' },
        { xtype : 'textfield', fieldLabel : '<?php xl('City', 'e'); ?>', name : 'employer_city' },
        { xtype : 'textfield', fieldLabel : '<?php xl('Postal Code', 'e'); ?>', name : 'employer_postalcode' }
      ]
    }]
};

////////////////////////////////////////////////////////
////////////STATS PANEL/////////////////////////////////
////////////////////////////////////////////////////////
var statsPanel = {
  title:'<?php xl('Stats', 'e'); ?>',
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
      { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeLanguage, fieldLabel : '<?php xl('Language', 'e'); ?>', name : 'slanguage', width : 130, emptyText : 'Unassigned', editable: false },
      { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeRace, fieldLabel : '<?php xl('Race', 'e'); ?>', name : 'srace', width : 250, emptyText : 'Unassigned', editable: false },
      { xtype : 'textfield', fieldLabel : '<?php xl('Family Size', 'e'); ?>', name : 'sfamily_size' },
      { xtype : 'textfield', fieldLabel : '<?php xl('Homeless, etc.', 'e'); ?>', name : 'shomeless' },
      { xtype : 'textfield', fieldLabel : '<?php xl('Migrant/Seasonal', 'e'); ?>', name : 'smigrant' }
    ]
    },{
    layout : 'form',
    border : false,
    bodyStyle : 'padding: 0 10px',
    defaults : { width : 200 },
    items :
    [
      { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeEthnicity, fieldLabel : '<?php xl('Ethnicity', 'e'); ?>', name : 'pvfc', width : 130, emptyText : 'Unassigned', editable: false },
      { xtype : 'textfield', fieldLabel : '<?php xl('Financial Review Date', 'e'); ?>', name : 'email' },
      { xtype : 'textfield', fieldLabel : '<?php xl('Monthly Income', 'e'); ?>', name : 'email' },
      { xtype : 'textfield', fieldLabel : '<?php xl('Interpreter', 'e'); ?>', name : 'email', vtype : 'checkEmail' },
      { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeReferral, fieldLabel : '<?php xl('Referral Source', 'e'); ?>', name : 'pvfc', width : 130, emptyText : 'Unassigned', editable: false }
    ]
    },{
    layout : 'form',
    border : false,
    bodyStyle : 'padding: 0 10px',
    width : 200,
    items :
    [
      { xtype : 'combo', fieldLabel : '<?php xl('VFC', 'e'); ?>', name : 'pvfc', width : 130, emptyText : 'Select', editable: false }
    ]
  }]
};

////////////////////////////////////////////////////////
////////////PRIMARY INSURANCE PANEL/////////////////////
////////////////////////////////////////////////////////
var primaryInsurancePanel = {
  title:'<?php xl('Primary Insurance', 'e'); ?>',
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
      { xtype : 'combo', fieldLabel : '<?php xl('Provider', 'e'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
      { xtype : 'textfield', fieldLabel : '<?php xl('Plan Name', 'e'); ?>', name : 'company' },
      { xtype : 'datefield', fieldLabel : '<?php xl('Effective Date', 'e'); ?>', name : 'company' },
      { xtype : 'textfield', fieldLabel : '<?php xl('Policy Number', 'e'); ?>', name : 'company' },
      { xtype : 'textfield', fieldLabel : '<?php xl('Group Number', 'e'); ?>', name : 'company' }
    ]
    },{
    xtype : 'fieldset',
    title: '<?php xl('Subscriber Info', 'e'); ?>',
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
        { xtype: 'textfield', fieldLabel: '<?php xl('Full Name', 'e'); ?>', name : 'company' },
        { xtype : 'datefield', vtype: 'dateVal', fieldLabel : '<?php xl('Date of Birth', 'e'); ?>', name : 'subs_dob', width : 130},
        { xtype : 'textfield', fieldLabel : '<?php xl('Subscriber Address', 'e'); ?>', name : 'company' },
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeState, fieldLabel : '<?php xl('State', 'e'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
        { xtype : 'textfield', fieldLabel : '<?php xl('Zip Code', 'e'); ?>', name : 'company' }
      ]
      },{
      layout: 'form',
      bodyStyle : 'padding: 0 5px',
      defaults : { width : 160 },
      items:
      [
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeRelationship, fieldLabel : '<?php xl('Relationship', 'e'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeSex, fieldLabel : '<?php xl('Sex', 'e'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
        { xtype : 'textfield', fieldLabel : '<?php xl('City', 'e'); ?>', name : 'company' },
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeCountry, fieldLabel : '<?php xl('Country', 'e'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
        { xtype : 'textfield', vtype: 'SSN', fieldLabel : '<?php xl('S.S.', 'e'); ?>', name : 'company' }
      ]
      }]
      },{
      xtype : 'fieldset',
      title: '<?php xl('Subscriber Employer (SE) Info', 'e'); ?>',
      layout : 'form',
      autoHeight : true,
      style : 'padding: 5px 10px',
      defaults : { width : 160 },
      items :
      [
        { xtype : 'textfield', fieldLabel : '<?php xl('Subscriber Employer', 'e'); ?>', name : 'company' },
        { xtype : 'textfield', fieldLabel : '<?php xl('SE Address', 'e'); ?>', name : 'company' },
        { xtype : 'textfield', fieldLabel : '<?php xl('SE City', 'e'); ?>', name : 'company' },
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeState, fieldLabel : '<?php xl('State', 'e'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeCountry, fieldLabel : '<?php xl('SE Country', 'e'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false }
      ]
    }]
};

////////////////////////////////////////////////////////
////////////SECONDARY INSURANCE PANEL///////////////////
////////////////////////////////////////////////////////
var secondaryInsurancePanel = {
  title:'<?php xl('Secondary Insurance', 'e'); ?>',
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
      { xtype : 'combo', fieldLabel : '<?php xl('Provider', 'e'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned',  editable: false },
      { xtype : 'textfield', fieldLabel : '<?php xl('Plan Name', 'e'); ?>', name : 'company' },
      { xtype : 'datefield', fieldLabel : '<?php xl('Effective Date', 'e'); ?>', name : 'company' },
      { xtype : 'textfield', fieldLabel : '<?php xl('Policy Number', 'e'); ?>', name : 'company' },
      { xtype : 'textfield', fieldLabel : '<?php xl('Group Number', 'e'); ?>', name : 'company' }
    ]
    },{
    xtype : 'fieldset',
    title: '<?php xl('Subscriber Info', 'e'); ?>',
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
        { xtype: 'textfield', fieldLabel: '<?php xl('Full Name', 'e'); ?>', name : 'company' },
        { xtype : 'datefield', vtype: 'dateVal', format: 'Y-m-d', fieldLabel : '<?php xl('Date of Birth', 'e'); ?>', name : 'secondaryInsuranceDate', width : 130 },
        { xtype : 'textfield', fieldLabel : '<?php xl('Subscriber Address', 'e'); ?>', name : 'company' },
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeState, fieldLabel : '<?php xl('State', 'e'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
        { xtype : 'textfield', fieldLabel : '<?php xl('Zip Code', 'e'); ?>', name : 'si_zipcode' }
      ]
    },{
      layout: 'form',
      bodyStyle : 'padding: 0 5px',
      defaults : { width : 160 },
      items:
      [
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeRelationship, fieldLabel : '<?php xl('Relationship', 'e'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeSex, fieldLabel : '<?php xl('Sex', 'e'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
        { xtype : 'textfield', fieldLabel : '<?php xl('City', 'e'); ?>', name : 'company' },
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeCountry, fieldLabel : '<?php xl('Country', 'e'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
        { xtype : 'textfield', vtype: 'SSN', fieldLabel : '<?php xl('S.S.', 'e'); ?>', name : 'company' }
      ]
    }]
  },{
  xtype : 'fieldset',
  title: '<?php xl('Subscriber Employer (SE) Info', 'e'); ?>',
  layout : 'form',
  name  : 'frm_se',
  autoHeight : true,
  style : 'padding: 5px 10px',
  defaults : { width : 160 },
  items :
  [
    { xtype : 'textfield', fieldLabel : '<?php xl('Subscriber Employer', 'e'); ?>', name : 'company' },
    { xtype : 'textfield', fieldLabel : '<?php xl('SE Address', 'e'); ?>', name : 'company' },
    { xtype : 'textfield', fieldLabel : '<?php xl('SE City', 'e'); ?>', name : 'company' },
    { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeState, fieldLabel : '<?php xl('State', 'e'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
    { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeCountry, fieldLabel : '<?php xl('SE Country', 'e'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false }
  ]
  }]
};

////////////////////////////////////////////////////////
////////////TERITARY INSURANCE PANEL////////////////////
////////////////////////////////////////////////////////
var teritaryInsurancePanel = {
  title:'<?php xl('Teritary Insurance', 'e'); ?>',
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
      { xtype : 'combo', fieldLabel : '<?php xl('Provider', 'e'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
      { xtype : 'textfield', fieldLabel : '<?php xl('Plan Name', 'e'); ?>', name : 'company' },
      { xtype : 'datefield', fieldLabel : '<?php xl('Effective Date', 'e'); ?>', name : 'company' },
      { xtype : 'textfield', fieldLabel : '<?php xl('Policy Number', 'e'); ?>', name : 'company' },
      { xtype : 'textfield', fieldLabel : '<?php xl('Group Number', 'e'); ?>', name : 'company' }
    ]
    },{
      xtype : 'fieldset',
      title: '<?php xl('Subscriber Info', 'e'); ?>',
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
          { xtype: 'textfield', fieldLabel: '<?php xl('Full Name', 'e'); ?>', name : 'company' },
          { xtype : 'datefield', vtype: 'dateVal', format: 'Y-m-d', fieldLabel : '<?php xl('Date of Birth', 'e'); ?>', name : 'suffix', width : 130, emptyText : 'Select', editable: false },
          { xtype : 'textfield', fieldLabel : '<?php xl('Subscriber Address', 'e'); ?>', name : 'company' },
          { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeState, fieldLabel : '<?php xl('State', 'e'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
          { xtype : 'textfield', fieldLabel : '<?php xl('Zip Code', 'e'); ?>', name : 'company' }
        ]
      },{
        layout: 'form',
        bodyStyle : 'padding: 0 5px',
        defaults : { width : 160 },
        items:
        [
          { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeRelationship, fieldLabel : '<?php xl('Relationship', 'e'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
          { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeSex, fieldLabel : '<?php xl('Sex', 'e'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
          { xtype : 'textfield', fieldLabel : '<?php xl('City', 'e'); ?>', name : 'company' },
          { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeCountry, fieldLabel : '<?php xl('Country', 'e'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
          { xtype : 'textfield', vtype: 'SSN', fieldLabel : '<?php xl('S.S.', 'e'); ?>', name : 'company' }
        ]
      }]
      },{
      xtype : 'fieldset',
      title: '<?php xl('Subscriber Employer (SE) Info', 'e'); ?>',
      layout : 'form',
      autoHeight : true,
      style : 'padding: 5px 10px',
      defaults : { width : 160 },
      items :
      [
        { xtype : 'textfield', fieldLabel : '<?php xl('Subscriber Employer', 'e'); ?>', name : 'company' },
        { xtype : 'textfield', fieldLabel : '<?php xl('SE Address', 'e'); ?>', name : 'company' },
        { xtype : 'textfield', fieldLabel : '<?php xl('SE City', 'e'); ?>', name : 'company' },
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeState, fieldLabel : '<?php xl('State', 'e'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false },
        { xtype : 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeCountry, fieldLabel : '<?php xl('SE Country', 'e'); ?>', name : 'suffix', width : 130, emptyText : 'Unassigned', editable: false }
      ]
  }]
};

////////////////////////////////////////////////////////
/////////////RENDER NEW PATIENT/////////////////////////
////////////////////////////////////////////////////////
//New patient Form Panel
var RenderPanel = new Ext.TabPanel({
  title: '<?php xl('Patient Search or Add Patient', 'e'); ?>',
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
    text :'<?php echo htmlspecialchars( xl('Save'), ENT_NOQUOTES); ?>',
    iconCls : 'save',
    ref : '../paSave',
    formBind : true,
    disabled : true
    },'-',{
        text :'<?php echo htmlspecialchars( xl('Search Patient'), ENT_NOQUOTES); ?>
        ',
        iconCls : 'searchUsers',
        ref : '../paSave',
        formBind : true,
        disabled : false
    }]
});

  //*********************************************************************************************************
  // Make sure that the RenderPanel height has the same height of the TopPanel
  // at first run.
  // This is mandatory.
  //*********************************************************************************************************
  Ext.getCmp('RenderPanel').setHeight( Ext.getCmp('TopPanel').getHeight() );

}); // END EXTJS

</script>