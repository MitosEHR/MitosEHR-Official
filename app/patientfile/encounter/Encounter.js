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

        me.currEncounterStartDate = null;
        me.currEncounterEid = null;


        Ext.define('EncounterModel', {
            extend: 'Ext.data.Model',
            proxy: {
                type	    : 'ajax',
                url 	    : 'app/patientfile/encounter/data.php?task=getEncounter',
                extraParams : {eid:me.currEncounterEid},
                reader: {
                    type			: 'json',
                    root			: 'encounter'
                }
            },
            fields: [
                {name: 'eid', 		        type: 'int'},
                {name: 'pid', 	            type: 'int'},
                {name: 'open_uid', 	        type: 'string'},
                {name: 'close_uid', 	    type: 'string'},
                {name: 'brief_description', type: 'string'},
                {name: 'visit_category', 	type: 'string'},
                {name: 'facility', 	        type: 'string'},
                {name: 'billing_facility', 	type: 'string'},
                {name: 'sensitivity', 	    type: 'string'},
                {name: 'start_date', 	    type: 'string'},
                {name: 'close_date', 	    type: 'string'},
                {name: 'onset_date', 	    type: 'string'}
            ],
           hasMany: {
               associatedModel: 'VitalsModel',
               name : 'getVitals',
               associationKey:'eid',
               autoLoad:true
               //filterProperty: 'query'
           }
        });
        Ext.define('VitalsModel', {
            extend: 'Ext.data.Model',
            proxy: {
                type	    : 'ajax',
                url 	    : 'app/patientfile/encounter/data.php?task=getVitals',
                extraParams : {eid:me.currEncounterEid},
                reader: {
                    type			: 'json',
                    root			: 'vitals'
                }
            },
            fields: [
               'id', 'pid', 'eid', 'uid', 'date', 'weight_lbs', 'weight_kg',
                {name:'height_in', type:'int'},
                {name:'height_cm', type:'int'},
               'bp_systolic', 'bp_diastolic', 'pulse', 'respiration', 'temp_f',
               'temp_c', 'temp_location', 'oxygen_saturation', 'head_circumference_in',
               'head_circumference_cm', 'waist_circumference_in', 'waist_circumference_cm',
               'bmi', 'bmi_status', 'other_notes'
            ],
            belongsTo: 'EncounterModel'
        });


        me.encounterStore = Ext.create('Ext.data.Store', {
            pageSize	: 10,
            model		: 'EncounterModel'
        });

        me.vitalsStore = Ext.create('Ext.data.Store', {
            pageSize	: 10,
            model		: 'VitalsModel'
        });




        me.growChartWindow = Ext.create('Ext.window.Window', {
            width       : '90%',
            height      : '90%',
            minHeight   : 400,
            minWidth    : 550,
            closeAction : 'hide',
            modal       : true,
            maximizable : true,
            title       : 'Line Chart',
            layout      : 'fit',
            tbar: ['->',{
                text: 'Growth Chart',
                handler: function() {
                    me.vitalsStore.loadData();
                }
            },'-',{
                text: 'Head Circumference Chart',
                handler: function() {
                    me.vitalsStore.loadData();
                }
            },'-',{
                text: 'Weight for Age',
                handler: function() {
                    me.vitalsStore.loadData();
                }
            },'-',{
                text: 'Height for Age',
                handler: function() {
                    me.vitalsStore.loadData();
                }
            }],
            tools:[{
                type:'print',
                tooltip: 'Print Chart',
                // hidden:true,
                handler: function(event, toolEl, panel){
                    // refresh logic
                }
            }],
            items: {
                xtype: 'chart',
                style: 'background:#fff',
                animate: true,
                store: me.vitalsStore,
                shadow: true,
                theme: 'Category1',
                legend: {
                    position: 'right'
                },
                axes: [{
                    title           : 'Height (inches)',
                    type            : 'Numeric',
                    minimum         : 0,
                    maximum         : 100,
                    position        : 'left',
                    fields          : ['height_in'],
                    majorTickSteps  : 100,
                    minorTickSteps  : 1,
                    grid: {
                        odd: {
                            opacity: 1,
                            fill: '#ddd',
                            stroke: '#bbb',
                            'stroke-width': 0.5
                        }
                    }
                },{
                    title           : 'Height (centimeters)',
                    type            : 'Numeric',
                    minimum         : 0,
                    maximum         : 250,
                    position        : 'right',
                    majorTickSteps  : 125,
                    minorTickSteps  : 1
                },{
                    title           : 'Age (Years)',
                    type            : 'Numeric',
                    minimum         : 0,
                    maximum         : 20,
                    position        : 'bottom',
                    fields          : ['years'],
                    majorTickSteps  : 18,
                    minorTickSteps  : 2

                }],
                series: [{
                    title   : 'Actual Growth',
                    type    : 'line',
                    axis    : 'left',
                    xField  : 'years',
                    yField  : 'hight_in',
                    highlight: {
                        size    : 10,
                        radius  : 10
                    },
                    markerConfig: {
                        type    : 'circle',
                        size    : 5,
                        radius  : 5,
                        'stroke-width': 0
                    }
                },{
                    title   : 'Normal Growth',
                    type: 'line',
                    highlight: {
                        size    : 5,
                        radius  : 5
                    },
                    axis    : 'left',
                    xField  : 'years',
                    yField  : 'hight_in',
                    smooth  : true,
                    fill    : true
//                    markerConfig: {
//                        //type    : 'circle',
//                        size    : 4,
//                        radius  : 4,
//                        'stroke-width': 0
//                    }

                }]
            }
       });




        /**
         * New Encounter Panel this panel is located hidden at
         * the top of the Visit panel and will slide down if
         * the "New Encounter" button is pressed.
         */
        me.newEncounterWindow = Ext.create('Ext.window.Window', {
            title       : 'New Encounter Form',
            closeAction : 'hide',
            modal       : true,
            closable    : false,
            items:[{
                xtype   : 'form',
                url     : 'app/patientfile/encounter/data.php?task=new',
                border  : false,
                bodyPadding : '10 10 0 10'
            }],
            buttons:[{
                text    : 'Create Encounter',
                scope   : me,
                handler : me.saveNewEnc
            },{
                text    : 'Cancel',
                handler : me.cancelNewEnc

            }]
        });


        /**
         * Tap Panel panels and forms
         */
        me.MiscBillingOptionsPanel = Ext.create('Ext.panel.Panel',{
            hidden  : true,
            border  : false,
            action  : 'administrative',
            title   : 'Misc. Billing Options HCFA',
            html    : '<h1>Misc. Billing Options HCFA form placeholder!</h1>'
        });
        me.procedurePanel = Ext.create('Ext.panel.Panel',{
            hidden  : true,
            border  : false,
            action  : 'administrative',
            title   : 'Procedure Order',
            html    : '<h1>Procedure Order form placeholder!</h1>'
        });
        me.reviewSysPanel = Ext.create('Ext.panel.Panel',{
            border  : false,
            action  : 'encounter',
            title   : 'Review of Systems',
            html    : '<h1>Review of Systems form placeholder!</h1>'
        });
        me.reviewSysCkPanel = Ext.create('Ext.panel.Panel',{
            border  : false,
            action  : 'encounter',
            title   : 'Review of Systems Checks',
            html    : '<h1>Review of Systems Checks form placeholder!</h1>'
        });
        me.soapPanel = Ext.create('Ext.panel.Panel',{
            border  : false,
            title   : 'SOAP',
            action  : 'encounter',
            html    : '<h1>SOAP form placeholder!</h1>'
        });
        me.speechDicPanel = Ext.create('Ext.panel.Panel',{
            border  : false,
            action  : 'encounter',
            title   : 'Speech Dictation',
            html    : '<h1>Speech Dictation form placeholder!</h1>'
        });

        me.vitalsPanel = Ext.create('Ext.panel.Panel', {
            title       : 'Vitals',
            action      : 'encounter',
            cls         : 'vitals-panel',
            autoScroll  : true,
            border      : false,
            layout: {
                type: 'table',
                columns: 2
            },
            items: [{
                xtype        : 'form',
                columnWidth  : 325,
                width        : 325,
                border       : false,
                url          : '',
                layout       : 'anchor',
                fieldDefaults: { msgTarget:'side' }
            },{
                xtype   : 'dataview',
                cls     : 'vitals-data',
                loadMask: 'No Vitals Recorded',
                loadMask: false,
                tpl: '<table>' +
                    '<tr>' +
                        '<tpl for=".">' +
                            '<td>' +
                                '<div class="column">' +
                                    '<div class="row" style="white-space: nowrap">{date}</div>' +
                                    '<div class="row">{weight_lbs}</div>' +
                                    '<div class="row">{weight_kg}</div>' +
                                    '<div class="row">{height_in}</div>' +
                                    '<div class="row">{height_cm}</div>' +
                                    '<div class="row">{bp_systolic}</div>' +
                                    '<div class="row">{bp_diastolic}</div>' +
                                    '<div class="row">{pulse}</div>' +
                                    '<div class="row">{respiration}</div>' +
                                    '<div class="row">{temp_f}</div>' +
                                    '<div class="row">{temp_c}</div>' +
                                    '<div class="row">{temp_location}</div>' +
                                    '<div class="row">{oxygen_saturation}</div>' +
                                    '<div class="row">{head_circumference_in}</div>' +
                                    '<div class="row">{head_circumference_cm}</div>' +
                                    '<div class="row">{waist_circumference_in}</div>' +
                                    '<div class="row">{waist_circumference_cm}</div>' +
                                    '<div class="row">{bmi}</div>' +
                                    '<div class="row">{bmi_status}</div>' +
                                    '<div class="row">{other_notes}</div>' +
                                '</div>' +
                            '</td>' +
                        '</tpl>' +
                    '</tr>' +
                 '</table>',
                itemSelector: 'div.patient-pool-btn',
                overItemCls: 'patient-over',
                selectedItemClass: 'patient-selected',
                singleSelect: true,
                store: me.vitalsStore
            }],
            dockedItems:{
                xtype   : 'toolbar',
                dock    : 'top',
                items:[{
                    text    : 'Save Vitals',
                    iconCls : 'save',
                    scope   : me,
                    handler : me.onSave
                },'->',{
                    text    : 'Vector Charts',
                    iconCls : 'icoChart',
                    scope   : me,
                    handler : me.onGrowChart
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
            ]
//            bbar:[{
//                text      	: 'Save',
//                iconCls   	: 'save',
//                disabled	: true,
//                handler     : function(){
//
//                }
//            },'-',{
//                text      	: 'Reset Form',
//                iconCls   	: 'save',
//                disabled	: true,
//                handler   	: function(){
//
//                }
//            }]
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

        me.pageBody = [ me.centerPanel, me.progressNote ];

        me.callParent(arguments);

        me.down('panel').addDocked([{
            xtype   : 'toolbar',
            dock    : 'top',
            items:[{
                text      	: 'Encounter',
                enableToggle: true,
                pressed     : true,
                toggleGroup : '1',
                iconCls   	: '',
                scope       : me,
                handler: function() {
                    me.setTapPanel('encounter');
                }
            },'-',{
                text      	: 'Administrative',
                enableToggle: true,
                toggleGroup : '1',
                iconCls   	: '',
                scope       : me,
                handler: function() {
                    me.setTapPanel('administrative');
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

    onGrowChart:function(){
        this.growChartWindow.show();
    },

    /**
     * This is the logic to create a new encounter
     */
    newEncounter:function(){
        var me = this,
            form = me.newEncounterWindow.down('form');

        Ext.Ajax.request({
            url     : 'app/patientfile/encounter/data.php',
            params  : {task:'ckOpenEncounters'},
            scope   : this,
            success : function(response){
                var success = eval('('+response.responseText+')').success;
                if(success){
                    Ext.Msg.show({
                        title   : 'Oops! Open Encounters Found...',
                        msg     : 'Do you want to <strong>continue creating the New Encounters?</strong><br>"Click No to review Encounter History"',
                        buttons : Ext.Msg.YESNO,
                        icon    : Ext.Msg.QUESTION,
                        fn:function(btn){
                            if(btn == 'yes'){
                                me.showNewEncounterWindow();
                            }else{
                                App.openPatientVisits();
                            }
                        }
                    });
                }else{
                    me.showNewEncounterWindow();
                }


            }
        });
    },

    showNewEncounterWindow:function(){
        var me = this,
            form = me.newEncounterWindow.down('form');
        me.getFormItems( form, 'New Encounter', function(){
            form.getForm().findField('start_date').setValue(new Date());
            me.newEncounterWindow.show();
        });
    },


    saveNewEnc:function(btn){
        var me = this,
            form = me.newEncounterWindow.down('form').getForm();

        if (form.isValid()){
            form.submit({
                params: {
                    task: 'newEncounter'
                },
                success: function(form, action) {
                    me.currEncounterStartDate = me.parseDate(action.result.encounter.start_date);
                    me.currEncounterEid = action.result.encounter.eid;
                    me.startTimer();
                    btn.up('window').close();
                },
                failure: function(form, action) {
                    // TODO
                    btn.up('window').close();

                }
            });
        }
    },

    cancelNewEnc:function(btn){
        btn.up('window').close();
        App.openPatientSummary();
    },


    /**
     * This will start the timer task
     *
     * @param date
     */
    parseDate:function(date){
        var t = date.split(/[- :]/);
        return new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
    },

    /**
     * Start timer task...  runs every sec
     */
    startTimer:function(){
        this.timerTask = {
            scope:this,
            run:function () {
                this.encounterTimer();
            },
            interval:1000 //1 second
        };
        Ext.TaskManager.start(this.timerTask);
    },

    /**
     * This will update the timer every sec
     */
    encounterTimer:function(){

        var timer = this.timeElapsed(this.currEncounterStartDate,new Date()),
            patient = this.getCurrPatient();

        this.updateTitle( patient.name+ ' - ' + Ext.Date.format(this.currEncounterStartDate, 'F j, Y, g:i a') + ' (Encounter)  <span class="timer">'+timer+'</span>' );
    },

    timeElapsed:function(start, stop){
        var ms = Ext.Date.getElapsed(start,stop),
        s = Math.floor((ms/1000)%60),
        m = Math.floor((ms/(1000*60))%60),
        h = Math.floor((ms/(1000*60*60))%24);
        function twoDigit(d){
            return (d >= 10) ? d : '0'+d;
        }
        return twoDigit(h)+':'+twoDigit(m)+':'+twoDigit(s);
    },

    openEncounter:function(eid){
        var me = this;

        me.currEncounterEid = eid;
        me.encounterStore.getProxy().extraParams.eid = eid

        me.encounterStore.load({
            scope   : me,
            callback: function(records, operation, success) {

                var start_date = me.parseDate(records[0].data.start_date);
                me.currEncounterStartDate = start_date;

                if(records[0].data.stop_date != null){
                    me.startTimer();
                }else{
                    var stop_date = me.parseDate(records[0].data.close_date),
                        timer = me.timeElapsed(start_date,stop_date),
                        patient = me.getCurrPatient();

                    me.updateTitle( patient.name+ ' - ' + Ext.Date.format(this.currEncounterStartDate, 'F j, Y, g:i a') + ' (Encounter)  <span class="timer">'+timer+'</span>' );
                }

            }
        });
        this.vitalsStore.load({
            scope   : me,
            callback: function() {
                me.vitalsPanel.down('dataview').refresh();
            }
        });
    },

    /**
     * Function to close the encounter..
     * 1.
     */
    closeEncounter:function(){
        var me = this;
        var msg = Ext.Msg.prompt('Digital Signature', 'Please sign the encounter with your password:', function(btn, signature){
            if (btn == 'ok'){
                Ext.Ajax.request({
                    url     : 'app/patientfile/encounter/data.php',
                    params  : {
                        task        : 'closeEncounter',
                        eid         : me.currEncounterEid,
                        close_date  : Ext.Date.format(new Date(), 'Y-m-d H:i:s'),
                        signature: signature },
                    scope   : me,
                    success : function(response){
                        var success = eval('('+response.responseText+')').success
                        if(success){
                            // TODO: after close encounter logic
                            Ext.TaskManager.stop(this.timerTask);
                        }else{
                            Ext.Msg.show({
                                title:'Oops!',
                                msg: 'Incorrect password',
                                buttons: Ext.Msg.OKCANCEL,
                                icon: Ext.Msg.ERROR,
                                fn:function(btn){
                                    if(btn == 'ok'){
                                        me.closeEncounter();
                                    }

                                }
                           });
                        }
                    }
                });

            }
        }, this);
        var f = msg.textField.getInputId();
        document.getElementById(f).type = 'password';
    },


    progressNoteCollapseExpand:function(){
        this.centerPanel.doLayout();
    },

    setTapPanel:function(type){
        var me = this;
        me.centerPanel.getTabBar().items.each(function(t){
            if(t.card.action ==  type){
                t.show();
            }else{
                t.hide();
            }
        });
    },

    /**
     * This function is called from MitosAPP.js when
     * this panel is selected in the navigation panel.
     * place inside this function all the functions you want
     * to call every this panel becomes active
     */
    onActive:function(callback){
          var me = this;
        if(this.checkIfCurrPatient()){
            var patient = this.getCurrPatient();
            this.updateTitle( patient.name + ' (Visits)');

            this.getFormItems( me.vitalsPanel.down('form'), 'Vitals',function(){
                me.vitalsPanel.doLayout();
            });


            callback(true);
        }else{
            callback(false);
            this.currPatientError();
        }
    }
}); //ens oNotesPage class
