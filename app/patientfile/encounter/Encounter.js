//******************************************************************************
// Encounter.ejs.php
// Encounter Forms
// v0.0.1
// 
// Author: Ernesto J. Rodriguez
// Modified:
//
// MitosEHR (Electronic Health Records) 2011
//******************************************************************************
Ext.define('Ext.mitos.panel.patientfile.encounter.Encounter',{
    extend      : 'Ext.mitos.RenderPanel',
    id          : 'panelEncounter',
    pageTitle   : 'Encounter',
    pageLayout  : 'border',
    uses        : ['Ext.mitos.restStoreModel'],
    initComponent: function(){
        var me = this;

        me.currEncounter = false;

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
            hidden  : true,
            border  : false,
            title   : 'Misc. Billing Options HCFA',
            html    : '<h1>Misc. Billing Options HCFA form placeholder!</h1>'
        });
        me.procedurePanel = Ext.create('Ext.panel.Panel',{
            hidden  : true,
            border  : false,
            title   : 'Procedure Order',
            html    : '<h1>Procedure Order form placeholder!</h1>'
        });
        me.reviewSysPanel = Ext.create('Ext.panel.Panel',{
            border  : false,
            title   : 'Review of Systems',
            html    : '<h1>Review of Systems form placeholder!</h1>'
        });
        me.reviewSysCkPanel = Ext.create('Ext.panel.Panel',{
            border  : false,
            title   : 'Review of Systems Checks',
            html    : '<h1>Review of Systems Checks form placeholder!</h1>'
        });
        me.soapPanel = Ext.create('Ext.panel.Panel',{
            border  : false,
            title   : 'SOAP',
            html    : '<h1>SOAP form placeholder!</h1>'
        });
        me.speechDicPanel = Ext.create('Ext.panel.Panel',{
            border  : false,
            title   : 'Speech Dictation',
            html    : '<h1>Speech Dictation form placeholder!</h1>'
        });

        me.vitalsPanel = Ext.create('Ext.panel.Panel', {
            title       : 'Vitals',
            border      : false,
            autoScroll  : true,
            layout      : 'hbox',
            items: [{
                xtype:'form',
                width:350,
                border  : false,
                url             : '',
                layout          : 'anchor',
                fieldDefaults   : { msgTarget:'side' }

            }],
            dockedItems:{
                xtype   : 'toolbar',
                dock    : 'top',
                items:[{
                   text    : 'Save Vitals',
                   iconCls : 'save',
                   scope   : me,
                   handler : me.onSave

                }]
            }

       });





        /**
         * Encounter panel
         */
        me.centerPanel = Ext.create('Ext.tab.Panel',{
            xtype       : 'tabpanel',
            region      : 'center',
            activeItem  : 0,
            defaults:{
                bodyStyle   : 'padding:15px',
                border      : false,
                bodyBorder  : false,
                layout      : 'fit'
            },
            items:[
                me.vitalsPanel,
                me.reviewSysPanel,
                me.reviewSysCkPanel,
                me.soapPanel,
                me.speechDicPanel,
                me.MiscBillingOptionsPanel,
                me.procedurePanel
            ],
            bbar:[{
                text      	: 'Save',
                iconCls   	: 'save',
                disabled	: true,
                handler     : function(){

                }
            },'-',{
                text      	: 'Reset Form',
                iconCls   	: 'save',
                disabled	: true,
                handler   	: function(){

                }
            }]
        });


        /**
         * Progress Note
         */
        me.progressNote = Ext.create('Ext.panel.Panel',{
            title       : 'Encounter Progress Note',
            region      : 'east',
            margin      : '0 0 0 2',
            bodyStyle   : 'padding:15px',
            width       : 400,
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
                handler : function(){
                    // refresh logic
                }
            },'-',{
                text    : 'Print (CCD)',
                tooltip : 'Print (Continuity of Care Document)',
                handler : function(){
                    // refresh log

                }
            },'->',{
                text    : 'Export (CCD)',
                tooltip : 'Export (Continuity of Care Document)',
                handler : function(){
                    // refresh log

                }

            }]


        });

        me.pageBody = [ me.newEncounterPanel, me.centerPanel, me.progressNote ];

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
                        run:function () {
                            this.encounterTimer();
                        },
                        interval:1000 //1 second
                    };
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
        s = Math.floor((ms/1000)%60),
        m = Math.floor((ms/(1000*60))%60),
        h = Math.floor((ms/(1000*60*60))%24);
        function twoDigit(d){
            return (d >= 10) ? d : '0'+d;
        }
        var timer = twoDigit(h)+':'+twoDigit(m)+':'+twoDigit(s);
        var patient = this.getCurrPatient();

        this.updateTitle( patient.name+ ' - ' + Ext.Date.format(this.encounterTime, 'F j, Y, g:i a') + ' (Encounter)  <span class="timer">'+timer+'</span>' );
    },

    closeEncounter:function(){

        var msg = Ext.Msg.prompt('Digital Signature', 'Please sign the encounter:', function(btn, pass){

            if (btn == 'ok'){
                Ext.TaskManager.stop(this.timerTask);
            }
        }, this);
        var f = msg.textField.getInputId();
        document.getElementById(f).type = 'password';
    },

    encounterSelected:function(){
        this.currEncounter = true;
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
    onActive:function(callback){
          var me = this;
//        if(this.checkIfCurrPatient()){
//            var patient = this.getCurrPatient();
//            this.updateTitle( patient.name + ' (Visits)');

            this.getFormItems( me.vitalsPanel.down('form'), 'Vitals',function(){
                me.vitalsPanel.doLayout();
            });


            callback(true);
//        }else{
//            callback(false);
//            this.currPatientError();
//        }
    }
}); //ens oNotesPage class
