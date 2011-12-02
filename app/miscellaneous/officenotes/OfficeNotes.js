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
        'Ext.mitos.CRUDStore',
        'Ext.mitos.GridPanel',
        'Ext.mitos.RenderPanel'
    ],
    initComponent: function(){
        var page = this;
        var rowPos;
        var currRec;
        page.storeOnotes = Ext.create('Ext.mitos.CRUDStore',{
            fields: [
                {name: 'id',      		type: 'int'},
                {name: 'date',          type: 'date', dateFormat: 'c'},
                {name: 'body',          type: 'string'},
                {name: 'user',          type: 'string'},
                {name: 'facility_id',   type: 'string'},
                {name: 'activity',   	type: 'string'}
            ],
            model		: 'modelOnotes',
            idProperty	: 'id',
            read      	: 'app/miscellaneous/officenotes/data_read.ejs.php',
            create    	: 'app/miscellaneous/officenotes/data_create.ejs.php',
            update    	: 'app/miscellaneous/officenotes/data_update.ejs.php',
          //destroy		: <-- No need to delete Office Notes -->
            autoLoad	: false
        });
        page.onotesFormPanel = Ext.create('Ext.form.FormPanel', {
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
                        page.cmdNew.show();
                        if (this.isValid()) {
                            page.cmdSave.enable();
                            page.cmdNew.enable();
                        } else {
                            page.cmdSave.disable();
                        }
                    }
                }
            }],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [
                    page.cmdSave = Ext.create('Ext.Button', {
                        text      	: 'Save',
                        iconCls   	: 'save',
                        disabled	: true,
                        handler   : function(){
                            var form = this.up('form').getForm();
                            if (form.findField('id').getValue()){ // Update
                                var record = page.storeOnotes.getAt(rowPos);
                                var fieldValues = form.getValues();
                                for (var k=0; k <= record.fields.getCount()-1; k++) {
                                    var i = record.fields.get(k).name;
                                    record.set( i, fieldValues[i] );
                                }
                                record.set( 'activity', '1' );
                            } else { // Add
                                var obj = eval( '(' + Ext.JSON.encode(form.getValues()) + ')' );
                                page.storeOnotes.add( obj );
                            }
                            page.storeOnotes.sync();	// Save the record to the dataStore
                            page.storeOnotes.load({params:{show: 'active' }});
                            page.onotesFormPanel.getForm().reset();
                            page.cmdHide.disable();
                        }
                    }),'-',
                    page.cmdHide = Ext.create('Ext.Button', {
                        text		: 'Hide This Note',
                        iconCls   	: 'save',
                        tooltip		: 'Hide Selected Office Note',
                        disabled	: true,
                        handler		: function(){
                            var form = this.up('form').getForm();
                            var record = page.storeOnotes.getAt(rowPos);
                            var fieldValues = form.getValues();
                            for (var k=0; k <= record.fields.getCount()-1; k++) {
                                var i = record.fields.get(k).name;
                                record.set( i, fieldValues[i] );
                            }
                            record.set( 'activity', '0' );
                            page.storeOnotes.sync();	// Save the record to the dataStore
                            page.storeOnotes.load({params:{show: 'active' }});	// Reload the dataSore from the database
                            page.onotesFormPanel.getForm().reset();
                            page.cmdHide.disable();
                        }
                    }),'-',
                    page.cmdNew = Ext.create('Ext.Button', {
                        text      	: 'Reset Form',
                        iconCls   	: 'save',
                        disabled	: true,
                        handler   	: function(){
                            var form = this.up('form').getForm();
                            page.cmdHide.disable();
                            page.cmdSave.setText('Save');
                            form.reset();
                            this.disable();
                        }
                    })
                ]
            }]
        });
        page.onotesGrid = Ext.create('Ext.mitos.GridPanel', {
            region		: 'center',
            store       : page.storeOnotes,
            listeners	: {
                itemclick: {
                    fn: function(DataView, record, item, rowIndex){
                        page.onotesFormPanel.getForm().reset();
                        var rec = page.storeOnotes.getAt(rowIndex);
                        page.cmdNew.enable();
                        page.cmdHide.enable();
                        page.cmdSave.setText('Update');
                        page.onotesFormPanel.getForm().loadRecord(rec);
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
                store: page.storeOnotes,
                displayInfo: true,
                emptyMsg: "No Office Notes to display",
                plugins: Ext.create('Ext.ux.SlidingPager', {}),
                items: [
                    page.cmdShow = Ext.create('Ext.Button', {
                        text      	: 'Show Only Active Notes',
                        iconCls   	: 'save',
                        enableToggle: true,
                        listeners	: {
                            afterrender: function(){
                                this.toggle(true);
                                page.storeOnotes.load({params:{show: 'active' }});
                            }
                        },
                        handler   	: function(){
                            page.cmdShowAll.toggle(false);
                            page.storeOnotes.load({params:{show: 'active' }});
                        }
                    }),'-',
                    page.cmdShowAll = Ext.create('Ext.Button', {
                        text      	: 'Show All Notes',
                        iconCls   	: 'save',
                        enableToggle: true,
                        handler   : function(){
                            page.cmdShow.toggle(false);
                            page.storeOnotes.load({params:{show: 'all' }});
                        }
                    })
                ]
            })
        }); // END GRID
        page.pageBody = [ page.onotesFormPanel,page.onotesGrid ];
        page.callParent(arguments);
    }, // end of initComponent
    /**
    * This function is called from MitosAPP.js when
    * this panel is selected in the navigation panel.
    * place inside this function all the functions you want
    * to call every this panel becomes active
    */
    onActive:function(){

    }
}); //ens oNotesPage class