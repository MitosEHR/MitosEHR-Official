<?php 
include_once("../registry.php");
?>

<script type="text/javascript">

Ext.onReady(function(){


  //Suffix Combo Data
  Ext.namespace('Ext.suffixData');
  Ext.suffixData.suffix = [ [ 'Unassigned', 'Unassigned' ], [ 'Mr.', 'Mr.' ],
                          [ 'Mrs.', 'Mrs.' ], [ 'Ms.', 'Ms.' ], [ 'Dr.', 'Dr.' ], ];
  //simple array store
  var suffixStore = new Ext.data.ArrayStore( {
    fields : [ 'value', 'suffix' ],
    data : Ext.suffixData.suffix
  });

  //Yes and No Combo Data
  Ext.namespace('Ext.YesNoData');
  Ext.YesNoData.YesNo = [['Yes', 'Yes'], ['No','No']];

  //simple array store
  var YesNoStore = new Ext.data.ArrayStore( {
    fields : [ 'value', 'ans' ],
    data : Ext.YesNoData.YesNo
  });


////////////////////////////////////////////////////////
////////////TOP BASIC INFO FORM/////////////////////////
////////////////////////////////////////////////////////
var patientBasicForm = {
    title: 'Patient Basic Information',
    layout:'column',
    border:false,
    defaults: {labelAlign: 'top'},
    autoScroll: true, // <-- New
    items: [{
        layout: 'form',
        border:false,
        bodyStyle:'padding: 0 5px',
        items:
        [
          { xtype:'textfield', fieldLabel: 'First name', name: 'pfname'},
          { xtype:'textfield', fieldLabel: 'External ID', name: 'pexternalid' },
          { xtype:'textfield', fieldLabel: 'Marital Status', name: 'pmarital' }
        ]
        },{
          layout: 'form',
          border:false,
          bodyStyle:'padding: 0 5px',
          items:
          [
            { xtype:'textfield', fieldLabel: 'Middle name', name: 'pmname' },
            { xtype:'textfield', fieldLabel: 'Date of birth', name: 'pdob' },
            { xtype:'textfield', fieldLabel: 'User Defined', name: 'puserdefiined1' }
          ]
        },{
          layout: 'form',
          border:false,
          bodyStyle:'padding: 0 5px',
          items:
          [
            { xtype:'textfield', fieldLabel: 'Last name', name: 'plname' },
            { xtype:'textfield', fieldLabel: 'S.S.', name: 'pss' },
            { xtype:'textfield', fieldLabel: 'User Defined', name: 'puserdefiined2' }
          ]
        },{
          layout: 'form',
          border:false,
          bodyStyle:'padding: 0 5px',
          items:
          [
            { xtype:'textfield', fieldLabel: 'Mother mainden name', name: 'pmmname' },
            { xtype:'textfield', fieldLabel: 'License/ID', name: 'plicence' },
            { xtype:'textfield', fieldLabel: 'User Defined', name: 'userdefiined3' }
          ]
          },{
            width:'150',
            style:'padding: 0 5px; margin-left:10px; margin-top:4px;',
            html: '<img src="../../ui_app/missing_photo.png" width="128" height="128" alt="Patient Image">'
          }]
};

////////////////////////////////////////////////////////
////////////CONTACT PANEL///////////////////////////////
////////////////////////////////////////////////////////
var contactPanel = {
  title:'Contact',
  border:false,
  defaults: {labelAlign: 'top'},
  autoScroll: true, // <-- New
  items : [{
    layout : 'form',
    border : false,
    bodyStyle : 'padding: 0 5px',
    items :
    [
      { width : 200, xtype : 'textfield', fieldLabel : 'Address', name : 'address', tabIndex : 3 },
      { xtype : 'textfield', fieldLabel : 'City', name : 'city', tabIndex : 3 },
      { xtype : 'combo', fieldLabel : 'Sate', name : 'state', width : 130, emptyText : 'Select', tabIndex : 3, editable: false },
      { xtype : 'textfield', fieldLabel : 'Postal Code', name : 'postal_code', tabIndex : 3 },
      { xtype : 'combo', fieldLabel : 'Country', name : 'country', width : 130, emptyText : 'Select', tabIndex : 3, editable: false },
    ]
    },{
      layout : 'form',
      border : false,
      bodyStyle : 'padding: 0 10px',
      defaults : { width : 200 },
      items :
      [
        { xtype : 'textfield', fieldLabel : 'Guardian\'s Name', name : 'guardians_name', tabIndex : 3 },
        { xtype : 'textfield', fieldLabel : 'Mother\'s Name', name : 'mothers_name', tabIndex : 3 },
        { xtype : 'textfield', fieldLabel : 'Home Phone', name : 'home_phone', tabIndex : 3 },
        { xtype : 'textfield', fieldLabel : 'Work Phone', name : 'work_phone', tabIndex : 3 },
        { xtype : 'textfield', fieldLabel : 'Email', name : 'email', vtype : 'email', tabIndex : 3 }
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
            { xtype : 'textfield', fieldLabel : 'Full Name', name : 'emer_fullname', tabIndex : 5 },
            { xtype : 'textfield', fieldLabel : 'Home Phone', name : 'emer_home_phone', tabIndex : 6 },
            { xtype : 'textfield', fieldLabel : 'Cel. Phone', name : 'emer_cel_phone', tabIndex : 6 }
          ]
        }
        ]
      }]
};

////////////////////////////////////////////////////////
////////////CHOICES PANEL///////////////////////////////
////////////////////////////////////////////////////////
var choicesPanel = {
    title:'Choices',
    border: false,
    autoScroll: true, // <-- New
    defaults: {layout:'form',labelAlign: 'top'},
    items : [{
      layout : 'form',
      border : false,
      bodyStyle : 'padding: 0 10px',
      defaults : { width : 200 },
      items :
      [
        { xtype : 'combo', fieldLabel : 'Provider', name : 'none', emptyText : 'Select', store: YesNoStore, mode : 'local', displayField : 'ans', editable: false },
        { xtype : 'combo', fieldLabel : 'Parmacy', name : 'none', emptyText : 'Select', store: YesNoStore, mode : 'local', displayField : 'ans', editable: false },
        { xtype : 'combo', fieldLabel : 'HIPAA notice Received', name : 'none', emptyText : 'Select', store: YesNoStore, mode : 'local', displayField : 'ans', editable: false },
        { xtype : 'textfield', fieldLabel : 'Leave Message With', name : 'none' }
      ]
      },{
        layout : 'form',
        border : false,
        bodyStyle : 'padding: 0 10px',
        defaults : { width : 200 },
        items :
        [
          { xtype : 'combo', fieldLabel : 'Allow SMS', name : 'none', emptyText : 'Select', store: YesNoStore, mode : 'local', displayField : 'ans', editable: false },
          { xtype : 'combo', fieldLabel : 'Allow Immunization Registry Use', name : 'none', emptyText : 'Select', store: YesNoStore, mode : 'local', displayField : 'ans', editable: false },
          { xtype : 'combo', fieldLabel : 'Allow Health Information Exchange', name : 'none', emptyText : 'Select', store: YesNoStore, mode : 'local', displayField : 'ans', editable: false },
          { xtype : 'combo', fieldLabel : 'Allow Voice Message', name : 'none', emptyText : 'Select', store: YesNoStore, mode : 'local', displayField : 'ans', editable: false }
        ]
        },{
          layout : 'form',
          border : false,
          bodyStyle : 'padding: 0 10px',
          width : 220,
          defaults : { width : 200 },
          items :
          [
            { xtype : 'combo', fieldLabel : 'Allow Voice Message', name : 'none', emptyText : 'Select', store: YesNoStore, mode : 'local', displayField : 'ans', editable: false },
            { xtype : 'combo', fieldLabel : 'Allow Mail Message', name : 'none', emptyText : 'Select', store: YesNoStore, mode : 'local', displayField : 'ans', editable: false },
            { xtype : 'combo', fieldLabel : 'Allow Email', name : 'none', emptyText : 'Select', store: YesNoStore, mode : 'local', displayField : 'ans', editable: false },
            { xtype : 'combo', fieldLabel : 'Allow Immunization Info Sharing', name : 'none', emptyText : 'Select', store: YesNoStore, mode : 'local', displayField : 'ans', editable: false }
          ]
    }]
};

////////////////////////////////////////////////////////
////////////EMPLOYER PANEL//////////////////////////////
////////////////////////////////////////////////////////
var employerPanel = {
    title:'Employer',
    border: false,
    autoScroll: true, // <-- New
    defaults: {layout:'form',labelAlign: 'top'},
    items : [{
      layout : 'form',
      border : false,
      bodyStyle : 'padding: 0 10px',
      defaults : { width : 200 },
      items :
      [
        { xtype : 'textfield', fieldLabel : 'Occupation', name : 'company' },
        { xtype : 'textfield', fieldLabel : 'Employer Address', name : 'company' },
        { xtype : 'combo', fieldLabel : 'State', name : 'suffix', width : 130, emptyText : 'Select', editable: false },
        { xtype : 'combo', fieldLabel : 'Country', name : 'suffix', width : 130, emptyText : 'Select', editable: false }
      ]
    },{
      layout : 'form',
      border : false,
      bodyStyle : 'padding: 0 10px',
      defaults : { width : 200 },
      items :
      [
        { xtype : 'textfield', fieldLabel : 'Employer Name', name : 'first' },
        { xtype : 'textfield', fieldLabel : 'City', name : 'email', vtype : 'email' },
        { xtype : 'textfield', fieldLabel : 'Postal Code', name : 'email' }
      ]
    }]
};

////////////////////////////////////////////////////////
////////////STATS PANEL/////////////////////////////////
////////////////////////////////////////////////////////
var statsPanel = {
  title:'Stats',
  autoScroll: true, // <-- New
  border: false,
  defaults: {layout:'form',labelAlign: 'top'},
  items : [ {
    layout : 'form',
    border : false,
    bodyStyle : 'padding: 0 10px',
    defaults : { width : 200 },
    items :
    [
      { xtype : 'combo', fieldLabel : 'Language', name : 'planguage', width : 130, emptyText : 'Select', editable: false },
      { xtype : 'combo', fieldLabel : 'Race', name : 'prace', width : 130, emptyText : 'Select', editable: false },
      { xtype : 'textfield', fieldLabel : 'Family Size', name : 'company' },
      { xtype : 'textfield', fieldLabel : 'Homeless, etc.', name : 'company' },
      { xtype : 'textfield', fieldLabel : 'Migrant/Seasonal', name : 'pmigrant' }
    ]
    },{
    layout : 'form',
    border : false,
    bodyStyle : 'padding: 0 10px',
    defaults : { width : 200 },
    items :
    [
      { xtype : 'combo', fieldLabel : 'Ethnicity', name : 'pvfc', width : 130, emptyText : 'Select', editable: false },
      { xtype : 'textfield', fieldLabel : 'Financial Review Date', name : 'email' },
      { xtype : 'textfield', fieldLabel : 'Monthly Income', name : 'email' },
      { xtype : 'textfield', fieldLabel : 'Interpreter', name : 'email', vtype : 'email' },
      { xtype : 'combo', fieldLabel : 'Referral Source', name : 'pvfc', width : 130, emptyText : 'Select', editable: false }
    ]
    },{
    layout : 'form',
    border : false,
    bodyStyle : 'padding: 0 10px',
    width : 200,
    items :
    [
      { xtype : 'combo', fieldLabel : 'VFC', name : 'pvfc', width : 130, emptyText : 'Select', editable: false }
    ]
  }]
};

////////////////////////////////////////////////////////
////////////PRIMARY INSURANCE PANEL/////////////////////
////////////////////////////////////////////////////////
var primaryInsurancePanel = {
  title:'Primary Insurance',
  autoScroll: true, // <-- New
  border: false,
  defaults: {layout:'form', width : 200,labelAlign: 'top'},
  items : [{
    layout : 'form',
    border : false,
    bodyStyle : 'padding: 0 5px',
    defaults : { width : 180 },
    items :
    [
      { xtype : 'combo', fieldLabel : 'Provider', name : 'suffix', width : 130, emptyText : 'Select', editable: false },
      { xtype : 'textfield', fieldLabel : 'Plan Name', name : 'company' },
      { xtype : 'datefield', fieldLabel : 'Effective Date', name : 'company' },
      { xtype : 'textfield', fieldLabel : 'Policy Number', name : 'company' },
      { xtype : 'textfield', fieldLabel : 'Group Number', name : 'company' }
    ]
    },{
    xtype : 'fieldset',
    title: 'Subscriber Info',
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
        { xtype: 'textfield', fieldLabel: 'Full Name', name : 'company' },
        { xtype : 'combo', fieldLabel : 'Date of Birth', name : 'suffix', width : 130, emptyText : 'Select', editable: false },
        { xtype : 'textfield', fieldLabel : 'Subscriber Address', name : 'company' },
        { xtype : 'combo', fieldLabel : 'State', name : 'suffix', width : 130, emptyText : 'Select', editable: false },
        { xtype : 'textfield', fieldLabel : 'Zip Code', name : 'company' }
      ]
      },{
      layout: 'form',
      bodyStyle : 'padding: 0 5px',
      defaults : { width : 160 },
      items:
      [
        { xtype : 'combo', fieldLabel : 'Relationship', name : 'suffix', width : 130, emptyText : 'Select', editable: false },
        { xtype : 'combo', fieldLabel : 'Sex', name : 'suffix', width : 130, emptyText : 'Select', editable: false },
        { xtype : 'textfield', fieldLabel : 'City', name : 'company' },
        { xtype : 'combo', fieldLabel : 'Country', name : 'suffix', width : 130, emptyText : 'Select', editable: false },
        { xtype : 'textfield', fieldLabel : 'S.S.', name : 'company' }
      ]
      }]
      },{
      xtype : 'fieldset',
      title: 'Subscriber Employer (SE) Info',
      layout : 'form',
      autoHeight : true,
      style : 'padding: 5px 10px',
      defaults : { width : 160 },
      items :
      [
        { xtype : 'textfield', fieldLabel : 'Subscriber Employer', name : 'company' },
        { xtype : 'textfield', fieldLabel : 'SE Address', name : 'company' },
        { xtype : 'textfield', fieldLabel : 'SE City', name : 'company' },
        { xtype : 'combo', fieldLabel : 'State', name : 'suffix', width : 130, emptyText : 'Select', editable: false },
        { xtype : 'combo', fieldLabel : 'SE Country', name : 'suffix', width : 130, emptyText : 'Select', editable: false }
      ]
    }]
};

////////////////////////////////////////////////////////
////////////SECONDARY INSURANCE PANEL///////////////////
////////////////////////////////////////////////////////
var secondaryInsurancePanel = {
  title:'Secondary Insurance',
  autoScroll: true, // <-- New
  border: false,
  defaults: {layout:'form', width : 200,labelAlign: 'top'},
  items : [{
    layout : 'form',
    border : false,
    bodyStyle : 'padding: 0 5px',
    defaults : { width : 180 },
    items :
    [
      { xtype : 'combo', fieldLabel : 'Provider', name : 'suffix', width : 130, emptyText : 'Select',  editable: false },
      { xtype : 'textfield', fieldLabel : 'Plan Name', name : 'company' },
      { xtype : 'datefield', fieldLabel : 'Effective Date', name : 'company' },
      { xtype : 'textfield', fieldLabel : 'Policy Number', name : 'company' },
      { xtype : 'textfield', fieldLabel : 'Group Number', name : 'company' }
    ]
    },{
    xtype : 'fieldset',
    title: 'Subscriber Info',
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
        { xtype: 'textfield', fieldLabel: 'Full Name', name : 'company' },
        { xtype : 'combo', fieldLabel : 'Date of Birth', name : 'suffix', width : 130, emptyText : 'Select', editable: false },
        { xtype : 'textfield', fieldLabel : 'Subscriber Address', name : 'company' },
        { xtype : 'combo', fieldLabel : 'State', name : 'suffix', width : 130, emptyText : 'Select', editable: false },
        { xtype : 'textfield', fieldLabel : 'Zip Code', name : 'company' }
      ]
    },{
      layout: 'form',
      bodyStyle : 'padding: 0 5px',
      defaults : { width : 160 },
      items:
      [
        { xtype : 'combo', fieldLabel : 'Relationship', name : 'suffix', width : 130, emptyText : 'Select', editable: false },
        { xtype : 'combo', fieldLabel : 'Sex', name : 'suffix', width : 130, emptyText : 'Select', editable: false },
        { xtype : 'textfield', fieldLabel : 'City', name : 'company' },
        { xtype : 'combo', fieldLabel : 'Country', name : 'suffix', width : 130, emptyText : 'Select', editable: false },
        { xtype : 'textfield', fieldLabel : 'S.S.', name : 'company' }
      ]
    }]
  },{
  xtype : 'fieldset',
  title: 'Subscriber Employer (SE) Info',
  layout : 'form',
  autoHeight : true,
  style : 'padding: 5px 10px',
  defaults : { width : 160 },
  items :
  [
    { xtype : 'textfield', fieldLabel : 'Subscriber Employer', name : 'company' },
    { xtype : 'textfield', fieldLabel : 'SE Address', name : 'company' },
    { xtype : 'textfield', fieldLabel : 'SE City', name : 'company' },
    { xtype : 'combo', fieldLabel : 'State', name : 'suffix', width : 130, emptyText : 'Select', editable: false },
    { xtype : 'combo', fieldLabel : 'SE Country', name : 'suffix', width : 130, emptyText : 'Select', editable: false }
  ]
  }]
};

////////////////////////////////////////////////////////
////////////TERITARY INSURANCE PANEL////////////////////
////////////////////////////////////////////////////////
var teritaryInsurancePanel = {
  title:'Teritary Insurance',
  autoScroll: true, // <-- New
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
      { xtype : 'combo', fieldLabel : 'Provider', name : 'suffix', width : 130, emptyText : 'Select', editable: false },
      { xtype : 'textfield', fieldLabel : 'Plan Name', name : 'company' },
      { xtype : 'datefield', fieldLabel : 'Effective Date', name : 'company' },
      { xtype : 'textfield', fieldLabel : 'Policy Number', name : 'company' },
      { xtype : 'textfield', fieldLabel : 'Group Number', name : 'company' }
    ]
    },{
      xtype : 'fieldset',
      title: 'Subscriber Info',
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
          { xtype: 'textfield', fieldLabel: 'Full Name', name : 'company' },
          { xtype : 'combo', fieldLabel : 'Date of Birth', name : 'suffix', width : 130, emptyText : 'Select', editable: false },
          { xtype : 'textfield', fieldLabel : 'Subscriber Address', name : 'company' },
          { xtype : 'combo', fieldLabel : 'State', name : 'suffix', width : 130, emptyText : 'Select', editable: false },
          { xtype : 'textfield', fieldLabel : 'Zip Code', name : 'company' }
        ]
      },{
        layout: 'form',
        bodyStyle : 'padding: 0 5px',
        defaults : { width : 160 },
        items:
        [
          { xtype : 'combo', fieldLabel : 'Relationship', name : 'suffix', width : 130, emptyText : 'Select', editable: false },
          { xtype : 'combo', fieldLabel : 'Sex', name : 'suffix', width : 130, emptyText : 'Select', editable: false },
          { xtype : 'textfield', fieldLabel : 'City', name : 'company' },
          { xtype : 'combo', fieldLabel : 'Country', name : 'suffix', width : 130, emptyText : 'Select', editable: false },
          { xtype : 'textfield', fieldLabel : 'S.S.', name : 'company' }
        ]
      }]
      },{
      xtype : 'fieldset',
      title: 'Subscriber Employer (SE) Info',
      layout : 'form',
      autoHeight : true,
      style : 'padding: 5px 10px',
      defaults : { width : 160 },
      items :
      [
        { xtype : 'textfield', fieldLabel : 'Subscriber Employer', name : 'company' },
        { xtype : 'textfield', fieldLabel : 'SE Address', name : 'company' },
        { xtype : 'textfield', fieldLabel : 'SE City', name : 'company' },
        { xtype : 'combo', fieldLabel : 'State', name : 'suffix', width : 130, emptyText : 'Select', editable: false },
        { xtype : 'combo', fieldLabel : 'SE Country', name : 'suffix', width : 130, emptyText : 'Select', editable: false }
      ]
  }]
};

////////////////////////////////////////////////////////
////////////PATIENT NOTES PANEL/////////////////////////
////////////////////////////////////////////////////////
var patientNotesPanel = {
cls:'x-plain',
    title:'Notes',
    autoScroll: true, // <-- New
    layout:'fit',
    items: {
        xtype:'htmleditor',
        autoWidth: true,
        autoHeight: true,
        id:'bio2',
        fieldLabel:'Biography'
    }
};

////////////////////////////////////////////////////////
/////////////RENDER NEW PATIENT/////////////////////////
////////////////////////////////////////////////////////
//New patient Form Panel
var RenderPanel = new Ext.TabPanel({
  title: 'Patient Search or Add Patient',
  border  : false,
  stateful: true,
  monitorResize: true,                    // <-- Mandatory
  autoWidth: true,                        // <-- Mandatory
  id: 'RenderPanel',                      // <-- Mandatory
  renderTo: Ext.getCmp('TopPanel').body,  // <-- Mandatory
  viewConfig:{forceFit:true},             // <-- Mandatory
  labelAlign: 'top',
  bodyStyle:'padding: 10px',
  activeTab: 0,
  defaults:{bodyStyle:'padding:10px',autoScroll:true, layout:'column'},  
  items: [ 
    patientBasicForm,
    contactPanel, 
    choicesPanel, 
    employerPanel, 
    statsPanel, 
    primaryInsurancePanel, 
    secondaryInsurancePanel, 
    teritaryInsurancePanel, 
    patientNotesPanel 
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