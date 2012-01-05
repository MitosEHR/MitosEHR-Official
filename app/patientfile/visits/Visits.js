//******************************************************************************
// visits.ejs.php
// Visits Forms
// v0.0.1
// 
// Author: Ernesto J. Rodriguez
// Modified:
//
// MitosEHR (Electronic Health Records) 2011
//******************************************************************************
Ext.define('Ext.mitos.panel.patientfile.visits.Visits',{
    extend      : 'Ext.mitos.RenderPanel',
    id          : 'panelVisits',
    pageTitle   : 'Visit',
    pageLayout  : 'border',
    uses        : ['Ext.mitos.restStoreModel','Ext.mitos.GridPanel'],
    initComponent: function(){
        var me = this;
        //******************************************************************
        // Stores...
        //******************************************************************
        me.historyStore = Ext.create('Ext.mitos.restStoreModel',{
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
            url      	: 'app/miscellaneous/officenotes/data_read.ejs.php',
            autoLoad	: false
        });

        /**
         * New Encounter Panel this panel is located hidden at
         * the top of the Visit panel and will slide down if
         * the "New Encounter" button is pressed.
         */
        me.newEncounterPanel = Ext.create('Ext.panel.Panel',{
            title       : 'Create Visit',
            region      : 'north',
            height      : 300,
            margin      : '0 0 2 0',
            bodyStyle   : 'padding:15px',
            hidden      : true,
            collapsible : true,
            collapsed   : true,
            animCollapse: true,
            titleCollapse:true,
            hideCollapseTool: true,
            collapseMode: 'header',
            html        : '<h1>Create Encounter form placeholder!</h1>'
        });




        //******************************************************************
        // Panels/Forms...
        //******************************************************************
        me.MiscBillingOptionsPanel = Ext.create('Ext.panel.Panel',{
            border      : false,
            title:'Misc. Billing Options HCFA',
            html: '<h1>Misc. Billing Options HCFA form placeholder!</h1>'
        });
        me.procedurePanel = Ext.create('Ext.panel.Panel',{
            border      : false,
            title:'Procedure Order',
            html: '<h1>Procedure Order form placeholder!</h1>'
        });
        me.reviewSysPanel = Ext.create('Ext.panel.Panel',{
            border      : false,
            title:'Review of Systems',
            html: '<h1>Review of Systems form placeholder!</h1>'
        });
        me.reviewSysCkPanel = Ext.create('Ext.panel.Panel',{
            border      : false,
            title:'Review of Systems Checks',
            html: '<h1>Review of Systems Checks form placeholder!</h1>'
        });
        me.soapPanel = Ext.create('Ext.panel.Panel',{
            border      : false,
            title:'SOAP',
            html: '<h1>SOAP form placeholder!</h1>'
        });
        me.speechDicPanel = Ext.create('Ext.panel.Panel',{
            border      : false,
            title:'Speech Dictation',
            html: '<h1>Speech Dictation form placeholder!</h1>'
        });
        me.vitalsPanel = Ext.create('Ext.panel.Panel',{
            border      : false,
            title:'Vitals',
            html: '<h1>Vitals form placeholder!</h1>'
        });

        /**
         * Encounter panel
         */
        me.centerPanel = Ext.create('Ext.panel.Panel',{
            region:'center',
            layout:'hbox',
            width: '100%',
            items: [{
                xtype       : 'tabpanel',
                itemId      : 'encounter',
                activeItem  : 0,
                flex        : 1,
                border      : false,
                defaults:{
                    bodyStyle   : 'padding:15px',
                    border      : false,
                    bodyBorder  : false,
                    layout      : 'fit'
                },
                items: [
                    me.reviewSysPanel,
                    me.reviewSysCkPanel,
                    me.soapPanel,
                    me.speechDicPanel,
                    me.vitalsPanel
                ]
            },{
                xtype       : 'tabpanel',
                itemId      : 'administrative',
                activeItem  : 0,
                flex        : 1,
                border      : false,
                hidden      : true,
                defaults:{
                    bodyStyle   : 'padding:15px',
                    border      : false,
                    bodyBorder  : false,
                    layout      : 'fit'
                },
                items: [
                    me.MiscBillingOptionsPanel,
                    me.procedurePanel
                ]

            }],
            bbar:[{
                text      	: 'Save',
                iconCls   	: 'save',
                disabled	: true,
                handler   : function(){

                }
            },'-',{
                text      	: 'Reset Form',
                iconCls   	: 'save',
                disabled	: true,
                handler   	: function(){

                }
            }]
        });


        //******************************************************************
        // Visit History Grid
        //******************************************************************
        me.historyGrid = Ext.create('Ext.mitos.GridPanel',{
            title           : 'Encounter History',
            hidden          : true,
            collapsible     : true,
            collapsed       : true,
            animCollapse    : true,
            hideCollapseTool: true,
            collapseMode    : 'header',
            margin          : '2 0 0 0',
            region	        : 'south',
            height          : 300,
            store           : me.historyStore,
            columns : [
                { header: 'id', sortable: false, dataIndex: 'id', hidden: true},
                { width: 150, header: 'Date',     sortable: true, dataIndex: 'date', renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s') },
                { width: 150, header: 'Issue',    sortable: true, dataIndex: 'user' },
                { flex: 1,    header: 'Reason',   sortable: true, dataIndex: 'body' },
                { flex: 1,    header: 'Provider', sortable: true, dataIndex: 'body' },
                { flex: 1,    header: 'Billing',  sortable: true, dataIndex: 'body' },
                { flex: 1,    header: 'Insurance',sortable: true, dataIndex: 'body' }
            ],
            listeners	: {
                itemclick: function(){

                }
            }
        });

        /**
         * Progress Note
         */
        me.progressNote = Ext.create('Ext.panel.Panel',{
            title       : 'Encounter Progress Note',
            region      : 'east',
            margin      : '0 0 0 2',
            bodyStyle   : 'padding:15px',
            width       : 500,
            collapsible : true,
            animCollapse: true,
            html        : '<h2>Progress Note Placeholder</h2>',
            listeners:{
                scope       : this,
                collapse    : me.progressNoteCollapseExpand,
                expand      : me.progressNoteCollapseExpand
            },
            tbar:[{
                text    : 'View (CCD)',
                tooltip : 'View (Continuity of Care Document)',
                handler : function(event, toolEl, panel){
                    // refresh logic
                }
            },'-',{
                text    : 'Print (CCD)',
                tooltip : 'Print (Continuity of Care Document)',
                handler : function(event, toolEl, panel){
                    // refresh log

                }
            },'->',{
                text    : 'Export (CCD)',
                tooltip : 'Export (Continuity of Care Document)',
                handler : function(event, toolEl, panel){
                    // refresh log

                }

            }]


        })

        me.pageBody = [ me.newEncounterPanel, me.centerPanel, me.historyGrid, me.progressNote ];

        me.callParent(arguments);

        me.down('panel').addDocked([{
            xtype   : 'toolbar',
            dock    : 'top',
            items:[{
                text      	: 'Encounter',
                enableToggle: true,
                toggleGroup : '1',
                iconCls   	: '',
                listeners	: {
                    afterrender: function(){
                        this.toggle(true);
                    }
                },
                handler: function() {
                    me.setFormPanel('encounter');
                }
            },'-',{
                text      	: 'Administrative',
                enableToggle: true,
                toggleGroup : '1',
                iconCls   	: '',
                handler: function() {
                    me.setFormPanel('administrative');
                }
            },'->',{
                text      	: 'New Encounter',
                iconCls   	: 'icoAddRecord',
                scope       : me,
                handler     : me.newEncounter
            },'-',{
                text      	: 'Close Encounter',
                iconCls   	: 'icoAddRecord',
                scope       : me,
                handler     : me.closeEncounter
            },'-',{
                text      	: 'Show Encounter History',
                itemId      : 'encounterHistory',
                iconCls   	: 'icoListOptions',
                enableToggle: true,
                listeners:{
                    scope   : me,
                    toggle  : me.historyToggle
                }
            }]
        }]);
    },


    /**
     * This is the logic to create a new encounter
     */
    newEncounter:function(){
        Ext.Msg.show({
            title   : 'Please confirm...',
            msg     : 'Do you want to create a new encounter?',
            icon    : Ext.MessageBox.QUESTION,
            buttons : Ext.Msg.YESNO,
            scope   : this,
            fn:function(btn){
                if(btn=='yes'){
                    this.encounterTime = new Date();
                    this.timerTask = {
                        scope:this,
                        run: function(){
                            this.encounterTimer();
                        },
                        interval: 1000 //1 second
                    }
                    Ext.TaskManager.start(this.timerTask);
                }
            }
        });
    },

    /**
     * function to
     */
    encounterTimer:function(){
        var ms = Ext.Date.getElapsed(this.encounterTime,new Date()),
        s = Math.round((ms/1000)%60),
        m = Math.round((ms/(1000*60))%60),
        h = Math.round((ms/(1000*60*60))%24);
        function twoDigit(d){
            return (d >= 10) ? d : '0'+d;
        }
        var timer = twoDigit(h)+':'+twoDigit(m)+':'+twoDigit(s);
        this.updateTitle('Encounter [patient name] - '+Ext.Date.format(this.encounterTime, 'F j, Y, g:i a')+'<span class="timer">'+timer+'</span>' );
    },

    closeEncounter:function(){

        var msg = Ext.Msg.prompt('Digital Signature', 'Please sign the encounter:', function(btn, text){

            if (btn == 'ok'){
                Ext.TaskManager.stop(this.timerTask);
            }
        }, this);
        var f = msg.textField.getInputId();
        document.getElementById(f).type = 'password';
    },

    /**
     *
     * @param btn
     * @param pressed
     */
    historyToggle:function(btn, pressed){
        if(pressed){
            btn.setText('Hide Encounter History');
            this.historyGrid.setVisible(true);
            this.historyGrid.toggleCollapse();
            this.centerPanel.doLayout();

        }else{
            btn.setText('Show Encounter History');
            this.historyGrid.toggleCollapse();
            this.historyGrid.setVisible(false);
        }
    },

    progressNoteCollapseExpand:function(){
        this.centerPanel.doLayout();
    },

    setFormPanel:function(type){
        var encounterPanel      = this.centerPanel.getComponent('encounter'),
            administrativePanel = this.centerPanel.getComponent('administrative');
        if(type == 'encounter'){
            administrativePanel.setVisible(false);
            encounterPanel.setVisible(true);
        }else if(type == 'administrative'){
            encounterPanel.setVisible(false);
            administrativePanel.setVisible(true);

        }

    },

    /**
     * This function is called from MitosAPP.js when
     * this panel is selected in the navigation panel.
     * place inside this function all the functions you want
     * to call every this panel becomes active
     */
    onActive:function(){

    }
}); //ens oNotesPage class
