<?php 
//******************************************************************************
// new.ejs.php
// New Patient Entry Form
// v0.0.1
// 
// Author: Ernest Rodriguez
// Modified: Gino Rivera
// 
// MitosEHR (Electronic Health Records) 2011
//******************************************************************************
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');
include_once($_SESSION['site']['root']."/library/I18n/I18n.inc.php");
//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;
?>
<script type="text/javascript">
Ext.onReady(function(){
    Ext.define('Ext.mitos.addressBookPage',{
		extend:'Ext.panel.Panel',
		uses:[
			'Ext.mitos.CRUDStore',
			'Ext.mitos.GridPanel',
			'Ext.mitos.RenderPanel',
			'Ext.mitos.TitlesComboBox',
			'Ext.mitos.SaveCancelWindow',
			'Ext.mitos.TypesComboBox'
		],
		initComponent: function(){
			var page = this;
            var rowPos;
            var currRec;
            page.storeAddressbook = new Ext.create('Ext.mitos.CRUDStore',{
                fields: [
                    {name: 'id',                    type: 'int'},
                    {name: 'username',              type: 'string'},
                    {name: 'password',              type: 'string'},
                    {name: 'authorized',            type: 'string'},
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
                    {name: 'facility_id',           type: 'int'},
                    {name: 'see_auth',              type: 'int'},
                    {name: 'active',                type: 'int'},
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
                    {name: 'street',                type: 'string'},
                    {name: 'streetb',               type: 'string'},
                    {name: 'city',                  type: 'string'},
                    {name: 'state',                 type: 'string'},
                    {name: 'zip',                   type: 'string'},
                    {name: 'street2',               type: 'string'},
                    {name: 'streetb2',              type: 'string'},
                    {name: 'city2',                 type: 'string'},
                    {name: 'state2',                type: 'string'},
                    {name: 'zip2',                  type: 'string'},
                    {name: 'phone',                 type: 'string'},
                    {name: 'fax',                   type: 'string'},
                    {name: 'phonew1',               type: 'string'},
                    {name: 'phonew2',               type: 'string'},
                    {name: 'phonecell',             type: 'string'},
                    {name: 'notes',                 type: 'string'},
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
                model		: 'addressbookRecord',
                idProperty	: 'id',
                read      	: 'interface/miscellaneous/addressbook/data_read.ejs.php',
                create    	: 'interface/miscellaneous/addressbook/data_create.ejs.php',
                update    	: 'interface/miscellaneous/addressbook/data_update.ejs.php',
                destroy 	: 'interface/miscellaneous/addressbook/data_destroy.ejs.php'
            });
            function localck(val) {
                if (val != '' ) {
                    return '<img src="ui_icons/yes.gif" />';
                }
                return val;
            }
            // *************************************************************************************
            // Facility Form
            // Add or Edit purpose
            // *************************************************************************************
            page.frmAddressbook = new Ext.create('Ext.mitos.FormPanel', {
                hideLabels  : true,
                items: [{
                    xtype: 'textfield', hidden: true, name: 'id'
                },{
                    xtype:'fieldset',
                    title: '<?php i18n('Primary Info'); ?>',
                    collapsible: true,
                    defaultType: 'textfield',
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
                            { width: 100, xtype: 'displayfield', value: '<?php i18n('Type'); ?>: '},
                              Ext.create('Ext.mitos.TypesComboBox', {width: 130 })
                        ]
                    },{
                        xtype: 'fieldcontainer',
                        defaults: { hideLabel: true },
                        msgTarget : 'under',
                        items: [
                            { width: 100, xtype: 'displayfield', value: '<?php i18n('First, Middle, Last'); ?>: '},
                              Ext.create('Ext.mitos.TitlesComboBox', {width: 50 }),
                            { width: 130, xtype: 'textfield', name: 'fname' },
                            { width: 100, xtype: 'textfield', name: 'mname' },
                            { width: 280, xtype: 'textfield', name: 'lname' }
                        ]
                    },{
                        xtype: 'fieldcontainer',
                        msgTarget : 'side',
                        items: [
                            { width: 100, xtype: 'displayfield', value: '<?php i18n('Specialty'); ?>: '},
                            { width: 130, xtype: 'textfield', name: 'specialty' },
                            { width: 90,  xtype: 'displayfield', value: '<?php i18n('Organization'); ?>: '},
                            { width: 120, xtype: 'textfield', name: 'organization' },
                            { width: 80,  xtype: 'displayfield', value: '<?php i18n('Valedictory'); ?>: '},
                            { width: 135, xtype: 'textfield', name: 'valedictory' }
                        ]
                    }]
                },{
                    xtype:'fieldset',
                    title: '<?php i18n('Primary Address'); ?>',
                    collapsible: true,
                    defaultType: 'textfield',
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
                        items: [
                            { width: 100, xtype: 'displayfield', value: '<?php i18n('Address'); ?>: '},
                            { width: 130, xtype: 'textfield', name: 'street' },
                            { width: 100, xtype: 'displayfield', value: '<?php i18n('Addrress Cont'); ?>: '},
                            { width: 335, xtype: 'textfield', name: 'streetb' }
                        ]
                    },{
                        xtype: 'fieldcontainer',
                        items: [
                            { width: 100, xtype: 'displayfield', value: '<?php i18n('City'); ?>: '},
                            { width: 130, xtype: 'textfield', name: 'city' },
                            { width: 100, xtype: 'displayfield', value: '<?php i18n('State'); ?>: '},
                            { width: 120, xtype: 'textfield', name: 'state' },
                            { width: 80,  xtype: 'displayfield', value: '<?php i18n('Postal Code'); ?>: '},
                            { width: 125, xtype: 'textfield', name: 'zip' }
                        ]
                    }]
                },{
                    xtype:'fieldset',
                    title: '<?php i18n('Secondary Address'); ?>',
                    collapsible: true,
                    collapsed: true,
                    defaultType: 'textfield',
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
                        items: [
                            { width: 100, xtype: 'displayfield', value: '<?php i18n('Address'); ?>: '},
                            { width: 130, xtype: 'textfield', name: 'street2' },
                            { width: 100, xtype: 'displayfield', value: '<?php i18n('Cont.'); ?>: '},
                            { width: 335, xtype: 'textfield', name: 'streetb2' }
                        ]
                    },{
                        xtype: 'fieldcontainer',
                        items: [
                            { width: 100, xtype: 'displayfield', value: '<?php i18n('City'); ?>: '},
                            { width: 130, xtype: 'textfield', name: 'city2' },
                            { width: 100, xtype: 'displayfield', value: '<?php i18n('State'); ?>: '},
                            { width: 120, xtype: 'textfield', name: 'state2' },
                            { width: 80,  xtype: 'displayfield', value: '<?php i18n('Postal Code'); ?>: '},
                            { width: 125, xtype: 'textfield', name: 'zip2' }
                        ]
                    }]
                },{
                    xtype:'fieldset',
                    title: '<?php i18n('Phone Numbers'); ?>',
                    collapsible: true,
                    collapsed: true,
                    defaultType: 'textfield',
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
                        items: [
                            { width: 100, xtype: 'displayfield', value: '<?php i18n('Home Phone'); ?>: '},
                            { width: 130, xtype: 'textfield', name: 'phone' },
                            { width: 90,  xtype: 'displayfield', value: '<?php i18n('Mobile Phone'); ?>: '},
                            { width: 130, xtype: 'textfield', name: 'phonecell' }
                        ]
                    },{
                        xtype: 'fieldcontainer',
                        items: [
                            { width: 100, xtype: 'displayfield', value: '<?php i18n('Work Phone'); ?>: '},
                            { width: 130, xtype: 'textfield', name: 'phonew1' },
                            { width: 90,  xtype: 'displayfield', value: '<?php i18n('Work Phone'); ?>: '},
                            { width: 130, xtype: 'textfield', name: 'phonew2' },
                            { width: 60,  xtype: 'displayfield', value: '<?php i18n('FAX'); ?>: '},
                            { width: 140, xtype: 'textfield', name: 'fax'   }
                        ]
                    }]
                },{
                    xtype:'fieldset',
                    title: '<?php i18n('Online Info'); ?>',
                    collapsible: true,
                    collapsed: true,
                    defaultType: 'textfield',
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
                        items: [
                            { width: 100, xtype: 'displayfield', value: '<?php i18n('Email'); ?>: '},
                            { width: 130, xtype: 'textfield', name: 'email' },
                            { width: 90,  xtype: 'displayfield', value: '<?php i18n('Assistant'); ?>: '},
                            { width: 130, xtype: 'textfield', name: 'assistant' },
                            { width: 60,  xtype: 'displayfield', value: '<?php i18n('Website'); ?>: '},
                            { width: 140, xtype: 'textfield', name: 'url' }
                        ]
                     }]
                },{
                    xtype:'fieldset',
                    title: '<?php i18n('Other Info'); ?>',
                    collapsible: true,
                    collapsed: true,
                    defaultType: 'textfield',
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
                        items: [
                            { width: 50,  xtype: 'displayfield', value: '<?php i18n('UPIN'); ?>: '},
                            { width: 80,  xtype: 'textfield', name: 'upin' },
                            { width: 50,  xtype: 'displayfield', value: '<?php i18n('NPI'); ?>: '},
                            { width: 80,  xtype: 'textfield', name: 'npi' },
                            { width: 50,  xtype: 'displayfield', value: '<?php i18n('TIN'); ?>: '},
                            { width: 80,  xtype: 'textfield', name: 'federaltaxid' },
                            { width: 80,  xtype: 'displayfield', value: '<?php i18n('Taxonomy'); ?>: '},
                            { width: 90,  xtype: 'textfield', name: 'taxonomy' }
                        ]
                    }]
                },{
                    width: 720, xtype: 'htmleditor', name: 'notes', emptyText: 'Notes'
                }]
            });
            // *************************************************************************************
            // Create the GridPanel
            // *************************************************************************************
            page.addressBookGrid = new Ext.grid.GridPanel({
                store       : page.storeAddressbook,
                layout	    : 'fit',
                frame		: true,
                loadMask    : true,
                viewConfig  : {stripeRows: true},
                listeners	: {
                    // -----------------------------------------
                    // Single click to select the record
                    // -----------------------------------------
                    itemclick: {
                        fn: function(DataView, record, item, rowIndex, e){
                            page.frmAddressbook.getForm().reset();
                            var rec = page.storeAddressbook.getAt(rowIndex);
                            page.cmdEdit.enable();
                            page.cmdDelete.enable();
                            page.frmAddressbook.getForm().loadRecord(rec);
                            currRec = rec;
                            page.rowPos = rowIndex;
                        }
                    },
                    // -----------------------------------------
                    // Double click to select the record, and edit the record
                    // -----------------------------------------
                    itemdblclick: {
                        fn: function(DataView, record, item, rowIndex, e){
                            page.frmAddressbook.getForm().reset();
                            page.cmdEdit.enable();
                            var rec = page.storeAddressbook.getAt(rowIndex); // get the record from the store
                            page.frmAddressbook.getForm().loadRecord(rec); // load the record selected into the form
                            currRec = rec;
                            page.rowPos = rowIndex;
                            page.winAddressbook.setTitle('<?php i18n("Edit Contact"); ?>');
                            page.winAddressbook.show();
                        }
                    }
                },
                columns: [
                    { header: 'id', sortable: false, dataIndex: 'id', hidden: true},
                    { width: 150, header: '<?php i18n('Name'); ?>', sortable: true, dataIndex: 'fullname' },
                    { width: 50,  header: '<?php i18n('Local'); ?>', sortable: true, dataIndex: 'username', renderer : localck },
                    { header: '<?php i18n('Type'); ?>', sortable: true, dataIndex: 'ab_title' },
                    { header: '<?php i18n('Specialty'); ?>', sortable: true, dataIndex: 'specialty' },
                    { header: '<?php i18n('Work Phone'); ?>', sortable: true, dataIndex: 'phonew1' },
                    { header: '<?php i18n('Mobile'); ?>', sortable: true, dataIndex: 'phonecell' },
                    { header: '<?php i18n('Fax'); ?>', sortable: true, dataIndex: 'fax' },
                    { flex:1, header: '<?php i18n('Email'); ?>', sortable: true, dataIndex: 'email' },
                    { flex:1, header: '<?php i18n('Primary Address'); ?>', sortable: true, dataIndex: 'fulladdress' }
                ],
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        page.cmdAdd = new Ext.create('Ext.Button', {
                            id        : 'cmdAdd',
                            text      : '<?php i18n("Add Contact"); ?>',
                            iconCls   : 'icoAddressBook',
                            handler   : function(){
                                page.frmAddressbook.getForm().reset(); // Clear the form
                                page.winAddressbook.show();
                                page.winAddressbook.setTitle('<?php i18n("Add Contact"); ?>');
                            }
                        }),'-',
                        page.cmdEdit = new Ext.create('Ext.Button', {
                            text      : '<?php i18n("Edit Contact"); ?>',
                            iconCls   : 'edit',
                            disabled  : true,
                            handler: function(){
                                page.winAddressbook.setTitle('<?php i18n("Edit Contact"); ?>');
                                page.winAddressbook.show();
                            }
                        }),'-',
                        page.cmdDelete = new Ext.create('Ext.Button', {
                            text: '<?php i18n("Delete Contact"); ?>',
                            iconCls: 'delete',
                            disabled: true,
                            handler: function(){
                                Ext.Msg.show({
                                    title: '<?php i18n('Please confirm...'); ?>',
                                    icon: Ext.MessageBox.QUESTION,
                                    msg:'<?php i18n('Are you sure to delete this Contact?'); ?>',
                                    buttons: Ext.Msg.YESNO,
                                    fn:function(btn,msgGrid){
                                        if(btn=='yes'){
                                            page.storeAddressbook.remove( currRec );
                                            page.storeAddressbook.save();
                                            page.storeAddressbook.load();
                                        }
                                    }
                                });
                            }
                        })
                    ]
                }]
            }); // END GRID
            // *************************************************************************************
            // Message Window Dialog
            // *************************************************************************************
            page.winAddressbook = new Ext.create('Ext.mitos.SaveCancelWindow', {
                width   : 755,
                title   : '<?php i18n('Add or Edit Contact'); ?>',
                form    : page.frmAddressbook,
                store   : page.storeAddressbook,
                scope   : page,
                idField : 'id'
            }); // END WINDOW
            //***********************************************************************************
            // Top Render Panel
            // This Panel needs only 3 arguments...
            // PageTitle 	- Title of the current page
            // PageLayout 	- default 'fit', define this argument if using other than the default value
            // PageBody 	- List of items to display [form 1, grid 1, grid 2]
            //***********************************************************************************
            Ext.create('Ext.mitos.RenderPanel', {
                pageTitle: '<?php i18n('Address Book'); ?>',
                pageBody: [page.addressBookGrid]
            });
			page.callParent(arguments);
		} // end of initComponent
	}); //ens oNotesPage class
    Ext.create('Ext.mitos.addressBookPage');
}); // End ExtJS
</script>