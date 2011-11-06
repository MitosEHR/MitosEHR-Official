//******************************************************************************
// new.ejs.php
// New Patient Entry Form
// v0.0.1
// 
// Author: Ernest Rodriguez
// Modified: GI Technologies, 2011
// 
// MitosEHR (Electronic Health Records) 2011
//******************************************************************************
Ext.define('Ext.mitos.panel.miscellaneous.addressbook.Addressbook',{
    extend      : 'Ext.mitos.RenderPanel',
    id          : 'panelAddressbook',
    pageTitle   : 'Address Book',
    uses:[
        'Ext.mitos.CRUDStore',
        'Ext.mitos.GridPanel',
        'Ext.mitos.TitlesComboBox',
        'Ext.mitos.SaveCancelWindow',
        'Ext.mitos.TypesComboBox'
    ],
    initComponent: function(){
        var page = this;
        var rowPos;
        var currRec;
        page.storeAddressbook = Ext.create('Ext.mitos.CRUDStore',{
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
            read      	: 'app/miscellaneous/addressbook/data_read.ejs.php',
            create    	: 'app/miscellaneous/addressbook/data_create.ejs.php',
            update    	: 'app/miscellaneous/addressbook/data_update.ejs.php',
            destroy 	: 'app/miscellaneous/addressbook/data_destroy.ejs.php'
        });
        function localck(val) {
            if (val !== '' ) {
                return '<img src="ui_icons/yes.gif" />';
            }
            return val;
        }
        // *************************************************************************************
        // Facility Form
        // Add or Edit purpose
        // *************************************************************************************
        page.frmAddressbook = Ext.create('Ext.mitos.FormPanel', {
            hideLabels  : true,
            items: [{
                xtype: 'textfield', hidden: true, name: 'id'
            },{
                xtype:'fieldset',
                title: 'Primary Info',
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
                        { width: 100, xtype: 'displayfield', value: 'Type: '},
                          Ext.create('Ext.mitos.TypesComboBox', {width: 130 })
                    ]
                },{
                    xtype: 'fieldcontainer',
                    defaults: { hideLabel: true },
                    msgTarget : 'under',
                    items: [
                        { width: 100, xtype: 'displayfield', value: 'First, Middle, Last: '},
                          Ext.create('Ext.mitos.TitlesComboBox', {width: 50 }),
                        { width: 130, xtype: 'textfield', name: 'fname' },
                        { width: 100, xtype: 'textfield', name: 'mname' },
                        { width: 280, xtype: 'textfield', name: 'lname' }
                    ]
                },{
                    xtype: 'fieldcontainer',
                    msgTarget : 'side',
                    items: [
                        { width: 100, xtype: 'displayfield', value: 'Specialty: '},
                        { width: 130, xtype: 'textfield', name: 'specialty' },
                        { width: 90,  xtype: 'displayfield', value: 'Organization: '},
                        { width: 120, xtype: 'textfield', name: 'organization' },
                        { width: 80,  xtype: 'displayfield', value: 'Valedictory: '},
                        { width: 135, xtype: 'textfield', name: 'valedictory' }
                    ]
                }]
            },{
                xtype:'fieldset',
                title: 'Primary Address',
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
                        { width: 100, xtype: 'displayfield', value: 'Address: '},
                        { width: 130, xtype: 'textfield', name: 'street' },
                        { width: 100, xtype: 'displayfield', value: 'Addrress Cont: '},
                        { width: 335, xtype: 'textfield', name: 'streetb' }
                    ]
                },{
                    xtype: 'fieldcontainer',
                    items: [
                        { width: 100, xtype: 'displayfield', value: 'City: '},
                        { width: 130, xtype: 'textfield', name: 'city' },
                        { width: 100, xtype: 'displayfield', value: 'State: '},
                        { width: 120, xtype: 'textfield', name: 'state' },
                        { width: 80,  xtype: 'displayfield', value: 'Postal Code: '},
                        { width: 125, xtype: 'textfield', name: 'zip' }
                    ]
                }]
            },{
                xtype:'fieldset',
                title: 'Secondary Address',
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
                        { width: 100, xtype: 'displayfield', value: 'Address: '},
                        { width: 130, xtype: 'textfield', name: 'street2' },
                        { width: 100, xtype: 'displayfield', value: 'Cont.: '},
                        { width: 335, xtype: 'textfield', name: 'streetb2' }
                    ]
                },{
                    xtype: 'fieldcontainer',
                    items: [
                        { width: 100, xtype: 'displayfield', value: 'City: '},
                        { width: 130, xtype: 'textfield', name: 'city2' },
                        { width: 100, xtype: 'displayfield', value: 'State: '},
                        { width: 120, xtype: 'textfield', name: 'state2' },
                        { width: 80,  xtype: 'displayfield', value: 'Postal Code: '},
                        { width: 125, xtype: 'textfield', name: 'zip2' }
                    ]
                }]
            },{
                xtype:'fieldset',
                title: 'Phone Numbers',
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
                        { width: 100, xtype: 'displayfield', value: 'Home Phone: '},
                        { width: 130, xtype: 'textfield', name: 'phone' },
                        { width: 90,  xtype: 'displayfield', value: 'Mobile Phone: '},
                        { width: 130, xtype: 'textfield', name: 'phonecell' }
                    ]
                },{
                    xtype: 'fieldcontainer',
                    items: [
                        { width: 100, xtype: 'displayfield', value: 'Work Phone: '},
                        { width: 130, xtype: 'textfield', name: 'phonew1' },
                        { width: 90,  xtype: 'displayfield', value: 'Work Phone: '},
                        { width: 130, xtype: 'textfield', name: 'phonew2' },
                        { width: 60,  xtype: 'displayfield', value: 'FAX: '},
                        { width: 140, xtype: 'textfield', name: 'fax'   }
                    ]
                }]
            },{
                xtype:'fieldset',
                title: 'Online Info',
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
                        { width: 100, xtype: 'displayfield', value: 'Email: '},
                        { width: 130, xtype: 'textfield', name: 'email' },
                        { width: 90,  xtype: 'displayfield', value: 'Assistant: '},
                        { width: 130, xtype: 'textfield', name: 'assistant' },
                        { width: 60,  xtype: 'displayfield', value: 'Website: '},
                        { width: 140, xtype: 'textfield', name: 'url' }
                    ]
                 }]
            },{
                xtype:'fieldset',
                title: 'Other Info',
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
                        { width: 50,  xtype: 'displayfield', value: 'UPIN: '},
                        { width: 80,  xtype: 'textfield', name: 'upin' },
                        { width: 50,  xtype: 'displayfield', value: 'NPI: '},
                        { width: 80,  xtype: 'textfield', name: 'npi' },
                        { width: 50,  xtype: 'displayfield', value: 'TIN: '},
                        { width: 80,  xtype: 'textfield', name: 'federaltaxid' },
                        { width: 80,  xtype: 'displayfield', value: 'Taxonomy: '},
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
        page.addressBookGrid = Ext.grid.GridPanel({
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
                        page.winAddressbook.setTitle('Edit Contact');
                        page.winAddressbook.show();
                    }
                }
            },
            columns: [
                { header: 'id', sortable: false, dataIndex: 'id', hidden: true},
                { width: 150, header: 'Name', sortable: true, dataIndex: 'fullname' },
                { width: 50,  header: 'Local', sortable: true, dataIndex: 'username', renderer : localck },
                { header: 'Type', sortable: true, dataIndex: 'ab_title' },
                { header: 'Specialty', sortable: true, dataIndex: 'specialty' },
                { header: 'Work Phone', sortable: true, dataIndex: 'phonew1' },
                { header: 'Mobile', sortable: true, dataIndex: 'phonecell' },
                { header: 'Fax', sortable: true, dataIndex: 'fax' },
                { flex:1, header: 'Email', sortable: true, dataIndex: 'email' },
                { flex:1, header: 'Primary Address', sortable: true, dataIndex: 'fulladdress' }
            ],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [
                    page.cmdAdd = Ext.create('Ext.Button', {
                        id        : 'cmdAdd',
                        text      : 'Add Contact',
                        iconCls   : 'icoAddressBook',
                        handler   : function(){
                            page.frmAddressbook.getForm().reset(); // Clear the form
                            page.winAddressbook.show();
                            page.winAddressbook.setTitle('Add Contact');
                        }
                    }),'-',
                    page.cmdEdit = Ext.create('Ext.Button', {
                        text      : 'Edit Contact',
                        iconCls   : 'edit',
                        disabled  : true,
                        handler: function(){
                            page.winAddressbook.setTitle('Edit Contact');
                            page.winAddressbook.show();
                        }
                    }),'-',
                    page.cmdDelete = Ext.create('Ext.Button', {
                        text: 'Delete Contact',
                        iconCls: 'delete',
                        disabled: true,
                        handler: function(){
                            Ext.Msg.show({
                                title: 'Please confirm...',
                                icon: Ext.MessageBox.QUESTION,
                                msg:'Are you sure to delete this Contact?',
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
        page.winAddressbook = Ext.create('Ext.mitos.SaveCancelWindow', {
            width   : 755,
            title   : 'Add or Edit Contact',
            form    : page.frmAddressbook,
            store   : page.storeAddressbook,
            scope   : page,
            idField : 'id'
        }); // END WINDOW

        page.pageBody = [ page.addressBookGrid ];
        page.callParent(arguments);
    } // end of initComponent
}); //ens oNotesPage class