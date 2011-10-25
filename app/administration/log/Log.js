//******************************************************************************
// Users.ejs.php
// Description: Users Screen
// v0.0.4
//
// Author: Ernesto J Rodriguez
// Modified: n/a
//
// MitosEHR (Electronic Health Records) 2011
//******************************************************************************
Ext.define('Ext.mitos.panel.administration.log.Log',{
    extend      : 'Ext.mitos.RenderPanel',
    id          : 'panelLog',
    uses        : [ 'Ext.mitos.CRUDStore', 'Ext.mitos.GridPanel' ],
    pageTitle   : 'Event History Log',
    initComponent: function(){
        /** @namespace Ext.QuickTips */
        Ext.QuickTips.init();

        var page = this;
        var rowPos; // Stores the current Grid Row Position (int)
        var currRec; // Store the current record (Object)

        page.logStore = Ext.create('Ext.mitos.CRUDStore',{
            fields: [
                {name: 'id',             type: 'int'},
                {name: 'date',           type: 'string'},
                {name: 'event',          type: 'auto'},
                {name: 'user',           type: 'string'},
                {name: 'facility',       type: 'string'},
                {name: 'comments',       type: 'string'},
                {name: 'user_notes',     type: 'string'},
                {name: 'patient_id',     type: 'string'},
                {name: 'success',        type: 'int'},
                {name: 'checksum',       type: 'string'},
                {name: 'crt_user',       type: 'string'}
            ],
            model 		:'logModel',
            idProperty 	:'id',
            read		:'app/administration/log/data_read.ejs.php'
        });

        // *************************************************************************************
        // Create the GridPanel
        // *************************************************************************************
        page.logGrid = Ext.create('Ext.mitos.GridPanel', {
            store : page.logStore,
            columns: [
                { text: 'id', sortable: false, dataIndex: 'id', hidden: true},
                { width: 120, text: 'Date',       sortable: true, dataIndex: 'date' },
                { width: 160, text: 'User',       sortable: true, dataIndex: 'user' },
                { width: 100, text: 'Event',      sortable: true, dataIndex: 'event' },
                { flex: 1,    text: 'Activity',   sortable: true, dataIndex: 'comments' }
            ],
            listeners: {
                // -----------------------------------------
                // Single click to select the record
                // -----------------------------------------
                itemclick: {
                    fn: function(DataView, record, item, rowIndex, e){
                        page.frmLog.getForm().reset();
                        page.cmdDetail.enable();
                        var rec = page.logStore.getAt(rowIndex);
                        page.frmLog.getForm().loadRecord(rec);
                        currRec = rec;
                        page.rowPos = rowIndex;
                    }
                },
                // -----------------------------------------
                // Double click to select the record, and edit the record
                // -----------------------------------------
                itemdblclick: {
                    fn: function(DataView, record, item, rowIndex, e){
                        page.frmLog.getForm().reset();
                        page.cmdDetail.enable();
                        var rec = page.logStore.getAt(rowIndex); // get the record from the store
                        page.frmLog.getForm().loadRecord(rec); // load the record selected into the form
                        currRec = rec;
                        page.rowPos = rowIndex;
                        page.winLog.setTitle('Log Event Details');
                        page.winLog.show();
                    }
                }
            },
            tbar: Ext.create('Ext.PagingToolbar', {
                store: page.logStore,
                displayInfo: true,
                emptyMsg: "No Office Notes to display'); ?>",
                plugins: Ext.create('Ext.ux.SlidingPager', {}),
                items: [
                    page.cmdDetail = new Ext.create('Ext.Button', {
                        text      : 'View Log Event Details',
                        iconCls   : 'edit',
                        disabled  : true,
                        handler: function(){
                            page.winLog.setTitle('Log Event Details');
                            page.winLog.show();
                        }
                    })
                ]
            })
        });
        // *************************************************************************************
        // Event Detail Form
        // *************************************************************************************
        page.frmLog = Ext.form.FormPanel({
            bodyStyle   : 'padding: 10px;',
            autoWidth   : true,
            border      : false,
            hideLabels  : true,
            defaults: { labelWidth: 89, anchor: '100%',
                layout: { type: 'hbox', defaultMargins: {top: 0, right: 5, bottom: 0, left: 0} }
            },
            items: [
                { xtype: 'textfield', hidden: true, name: 'id'},
                { fieldLabel: 'Date',         xtype: 'displayfield', name: 'date'},
                { fieldLabel: 'Event',        xtype: 'displayfield', name: 'event'},
                { fieldLabel: 'User',         xtype: 'displayfield', name: 'user'},
                { fieldLabel: 'Facility',     xtype: 'displayfield', name: 'facility'},
                { fieldLabel: 'Comments',     xtype: 'displayfield', name: 'comments'},
                { fieldLabel: 'user Notes',   xtype: 'displayfield', name: 'user_notes'},
                { fieldLabel: 'Patient ID',   xtype: 'displayfield', name: 'patient_id'},
                { fieldLabel: 'Success',      xtype: 'displayfield', name: 'success'},
                { fieldLabel: 'Check Sum',    xtype: 'displayfield', name: 'checksum'},
                { fieldLabel: 'CRT USER',     xtype: 'displayfield', name: 'crt_user'}
            ]
        });
        // *************************************************************************************
        // Event Detail Window
        // *************************************************************************************
        page.winLog = Ext.window.Window({
            width       : 500,
            closeAction : 'hide',
            items       : [page.frmLog],
            buttons: [{
                text: 'Close',
                handler: function(){
                    this.up('window').hide();
                }
            }]
        });
        page.pageBody = [ page.logGrid ];
        page.callParent(arguments);
    } // end of initComponent
}); //ens LogPage class