//******************************************************************************
// ofice_notes.ejs.php
// office Notes Page
// v0.0.1
// 
// Author: Ernest Rodriguez
// Modified:
// 
// MitosEHR (Electronic Health Records) 2011
//******************************************************************************
Ext.define('Ext.mitos.panel.miscellaneous.officenotes.OfficeNotes',{
    extend      : 'Ext.mitos.RenderPanel',
    id          : 'panelOfficeNotes',
    pageTitle   : 'Office Notes',
    pageLayout  : 'border',
    uses:[
        'Ext.mitos.GridPanel',
        'Ext.mitos.RenderPanel'
    ],
    initComponent: function(){
        var me = this;
        var rowPos;
        var currRec;

        Ext.define('OfficeNotesModel', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'id',      		type: 'int'},
                {name: 'date',          type: 'date', dateFormat: 'c'},
                {name: 'body',          type: 'string'},
                {name: 'user',          type: 'string'},
                {name: 'facility_id',   type: 'string'},
                {name: 'activity',   	type: 'string'}
            ],
            proxy: {
                type: 'direct',
                api: {
                    read    : OfficeNotes.getOfficeNotes,
                    create  : OfficeNotes.addOfficeNotes,
                    update  : OfficeNotes.updateOfficeNotes
                }
            }
        });
        me.storeOnotes = Ext.create('Ext.data.Store', {
            model: 'OfficeNotesModel',
            autoLoad: true
        });
        me.onotesFormPanel = Ext.create('Ext.form.FormPanel', {
            id: 'onotesFormPanel',
            region		: 'north',
            frame 		: true,
            height      : 97,
            margin		: '0 0 3 0',
            items		:[{
                xtype: 'textfield', hidden: true, name: 'id'
            },{
                xtype   : 'textareafield',
                allowBlank	: false,
                grow    : true,
                margin	: 0,
                name    : 'body',
                anchor  : '100%',
                emptyText: 'Type new note here...',
                listeners: {
                    validitychange: function(){
                        me.cmdNew.show();
                        if (this.isValid()) {
                            me.cmdSave.enable();
                            me.cmdNew.enable();
                        } else {
                            me.cmdSave.disable();
                        }
                    }
                }
            }],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [
                    me.cmdSave = Ext.create('Ext.Button', {
                        text      	: 'Save',
                        iconCls   	: 'save',
                        disabled	: true,
                        handler   : function(){
                            var form = this.up('form').getForm();
                            if (form.findField('id').getValue()){ // Update
                                var record = me.storeOnotes.getAt(rowPos);
                                var fieldValues = form.getValues();
                                for (var k=0; k <= record.fields.getCount()-1; k++) {
                                    var i = record.fields.get(k).name;
                                    record.set( i, fieldValues[i] );
                                }
                                record.set( 'activity', '1' );
                            } else { // Add
                                var obj = eval( '(' + Ext.JSON.encode(form.getValues()) + ')' );
                                me.storeOnotes.add( obj );
                            }
                            me.storeOnotes.sync();	// Save the record to the dataStore
                            //me.storeOnotes.load({params:{show: 'active' }});
                            me.onotesFormPanel.getForm().reset();
                            me.cmdHide.disable();
                        }
                    }),'-',
                    me.cmdHide = Ext.create('Ext.Button', {
                        text		: 'Hide This Note',
                        iconCls   	: 'save',
                        tooltip		: 'Hide Selected Office Note',
                        disabled	: true,
                        handler		: function(){
                            var form = this.up('form').getForm();
                            var record = me.storeOnotes.getAt(rowPos);
                            var fieldValues = form.getValues();
                            for (var k=0; k <= record.fields.getCount()-1; k++) {
                                var i = record.fields.get(k).name;
                                record.set( i, fieldValues[i] );
                            }
                            record.set( 'activity', '0' );
                            me.storeOnotes.sync();	// Save the record to the dataStore
                            me.storeOnotes.load({params:{show: 'active' }});	// Reload the dataSore from the database
                            me.onotesFormPanel.getForm().reset();
                            me.cmdHide.disable();
                        }
                    }),'-',
                    me.cmdNew = Ext.create('Ext.Button', {
                        text      	: 'Reset Form',
                        iconCls   	: 'save',
                        disabled	: true,
                        handler   	: function(){
                            var form = this.up('form').getForm();
                            me.cmdHide.disable();
                            me.cmdSave.setText('Save');
                            form.reset();
                            this.disable();
                        }
                    })
                ]
            }]
        });
        me.onotesGrid = Ext.create('Ext.mitos.GridPanel', {
            region		: 'center',
            store       : me.storeOnotes,
            listeners	: {
                itemclick: {
                    fn: function(DataView, record, item, rowIndex){
                        me.onotesFormPanel.getForm().reset();
                        var rec = me.storeOnotes.getAt(rowIndex);
                        me.cmdNew.enable();
                        me.cmdHide.enable();
                        me.cmdSave.setText('Update');
                        me.onotesFormPanel.getForm().loadRecord(rec);
                        currRec = rec;
                        rowPos = rowIndex;
                    }
                }
            },
            columns: [
                { header: 'id', sortable: false, dataIndex: 'id', hidden: true},
                { width: 150, header: 'Date', sortable: true, dataIndex: 'date', renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s') },
                { width: 150,  header: 'User', sortable: true, dataIndex: 'user' },
                { flex: 1, header: 'Note', sortable: true, dataIndex: 'body' }

            ],
            tbar: Ext.create('Ext.PagingToolbar', {
                store: me.storeOnotes,
                displayInfo: true,
                emptyMsg: "No Office Notes to display",
                plugins: Ext.create('Ext.ux.SlidingPager', {}),
                items: [
                    me.cmdShow = Ext.create('Ext.Button', {
                        text      	: 'Show Only Active Notes',
                        iconCls   	: 'save',
                        enableToggle: true,
                        listeners	: {
                            afterrender: function(){
                                this.toggle(true);

                            }
                        },
                        handler   	: function(){
                            me.cmdShowAll.toggle(false);
                            me.storeOnotes.load({params:{show: 'active' }});
                        }
                    }),'-',
                    me.cmdShowAll = Ext.create('Ext.Button', {
                        text      	: 'Show All Notes',
                        iconCls   	: 'save',
                        enableToggle: true,
                        handler   : function(){
                            me.cmdShow.toggle(false);
                            me.storeOnotes.load({params:{show: 'all' }});
                        }
                    })
                ]
            })
        }); // END GRID
        me.pageBody = [ me.onotesFormPanel,me.onotesGrid ];
        me.callParent(arguments);
    }, // end of initComponent
    /**
    * This function is called from MitosAPP.js when
    * this panel is selected in the navigation panel.
    * place inside this function all the functions you want
    * to call every this panel becomes active
    */
    onActive:function(callback){
        this.storeOnotes.load({params:{show: 'active' }});
        callback(true);
    }
}); //ens oNotesPage class