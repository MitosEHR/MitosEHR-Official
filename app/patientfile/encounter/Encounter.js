/**
 * Encounter.ejs.php
 * Encounter Panel
 * v0.0.1
 *
 * Author: Ernesto J. Rodriguez
 * Modified:
 *
 * MitosEHR (Electronic Health Records) 2011
 *
 * @namespace Encounter.getEncounter
 * @namespace Encounter.createEncounter
 * @namespace Encounter.ckOpenEncounters
 * @namespace Encounter.closeEncounter
 * @namespace Encounter.getVitals
 */
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

        me.timerTask = {
            scope:me,
            run:function () {
                me.encounterTimer();
            },
            interval:1000 //1 second
        };


        Ext.define('EncounterModel', {
            extend: 'Ext.data.Model',
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
            proxy: {
                type	    : 'direct',
                api:{
                    read: Encounter.getEncounter
                },
                extraParams : {eid:me.currEncounterEid},
                reader: {
                    type			: 'json',
                    root			: 'encounter'
                }
            },
            hasMany: {
                associatedModel  : 'VitalsModel',
                name             : 'getVitals',
                associationKey   : 'eid',
                autoLoad         : true
                //filterProperty: 'query'
            }
        });


        Ext.define('VitalsModel', {
            extend: 'Ext.data.Model',
            fields: [
               'id', 'pid', 'eid', 'uid', 'date', 'weight_lbs', 'weight_kg',
                {name:'height_in', type:'int'},
                {name:'height_cm', type:'int'},
               'bp_systolic', 'bp_diastolic', 'pulse', 'respiration', 'temp_f',
               'temp_c', 'temp_location', 'oxygen_saturation', 'head_circumference_in',
               'head_circumference_cm', 'waist_circumference_in', 'waist_circumference_cm',
               'bmi', 'bmi_status', 'other_notes'
            ],
            proxy: {
                type	    : 'direct',
                api:{
                    read: Encounter.getVitals
                },
                extraParams : {eid:me.currEncounterEid},
                reader: {
                    type			: 'json',
                    root			: 'encounter'
                }
            },
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

        me.chartsWindow = Ext.create('Ext.window.Window', {
            title       : 'Vector Chart',
            layout      : 'card',
            closeAction : 'hide',
            width       : '70%',
            height      : '70%',
            minHeight   : 400,
            minWidth    : 550,
            modal       : true,
            maximizable : true,
            maximized   : true,
            tbar: ['->',{
                text        : 'Growth Chart',
                action      : 'growChart',
                pressed     : true,
                enableToggle: true,
                toggleGroup : 'charts',
                scope       : me,
                handler     : me.onChartSwitch
            },'-',{
                text        : 'Head Circumference Chart',
                action      : 'headCirChart',
                enableToggle: true,
                toggleGroup : 'charts',
                scope       : me,
                handler     : me.onChartSwitch
            },'-',{
                text        : 'Weight for Age',
                action      : 'weightAge',
                enableToggle: true,
                toggleGroup : 'charts',
                scope       : me,
                handler     : me.onChartSwitch
            },'-',{
                text        : 'Height for Age',
                action      : 'heightAge',
                enableToggle: true,
                toggleGroup : 'charts',
                scope       : me,
                handler     : me.onChartSwitch
            },'-'],
            tools:[{
                type:'print',
                tooltip: 'Print Chart',
                handler: function(){
                    console.log(this.up('window').down('chart'));
                }
            }],
            items: [{
                xtype   : 'chart',
                style   : 'background:#fff',
                store   : me.vitalsStore,
                itemId  : 'growChart',
                animate : true,
                shadow  : true,
                theme   : 'Category1',
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
                            opacity         : 1,
                            fill            : '#ddd',
                            stroke          : '#bbb',
                            'stroke-width'  : 0.5
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
                }]
            },{
                xtype   : 'chart',
                style   : 'background:#fff',
                store   : this.vitalsStore,
                itemId  : 'headCirChart',
                animate : true,
                shadow  : true,
                hidden  : true,
                theme   : 'Category1',
                legend: {
                    position: 'right'
                },
                axes: [{
                    title           : 'Head Circumference (inches)',
                    type            : 'Numeric',
                    minimum         : 0,
                    maximum         : 100,
                    position        : 'left',
                    fields          : ['height_in'],
                    majorTickSteps  : 100,
                    minorTickSteps  : 1,
                    grid: {
                        odd: {
                            opacity         : 1,
                            fill            : '#ddd',
                            stroke          : '#bbb',
                            'stroke-width'  : 0.5
                        }
                    }
                },{
                    title           : 'Head Circumference (centimeters)',
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
                }]
            },{
                xtype   : 'chart',
                style   : 'background:#fff',
                store   : this.vitalsStore,
                itemId  : 'weightAge',
                animate : true,
                shadow  : true,
                hidden  : true,
                theme   : 'Category1',
                legend: {
                    position: 'right'
                },
                axes: [{
                    title           : 'Weight (lbs)',
                    type            : 'Numeric',
                    minimum         : 0,
                    maximum         : 100,
                    position        : 'left',
                    fields          : ['height_in'],
                    majorTickSteps  : 100,
                    minorTickSteps  : 1,
                    grid: {
                        odd: {
                            opacity         : 1,
                            fill            : '#ddd',
                            stroke          : '#bbb',
                            'stroke-width'  : 0.5
                        }
                    }
                },{
                    title           : 'Weight (kg)',
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
                }]
            },{
                xtype   : 'chart',
                style   : 'background:#fff',
                store   : this.vitalsStore,
                itemId  : 'heightAge',
                animate : true,
                shadow  : true,
                hidden  : true,
                theme   : 'Category1',
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
                            opacity         : 1,
                            fill            : '#ddd',
                            stroke          : '#bbb',
                            'stroke-width'  : 0.5
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
                        type            : 'circle',
                        size            : 5,
                        radius          : 5,
                        'stroke-width'  : 0
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
                }]
            }]
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
        me.MiscBillingOptionsPanel = Ext.create('Ext.form.Panel',{
            hidden  : true,
            border  : false,
            action  : 'administrative',
            title   : 'Misc. Billing Options HCFA',
            html    : '<h1>Misc. Billing Options HCFA form placeholder!</h1>'
        });
        me.procedurePanel = Ext.create('Ext.form.Panel',{
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
        me.reviewSysCkPanel = Ext.create('Ext.form.Panel',{
            border  : false,
            action  : 'encounter',
            title   : 'Review of Systems Checks',
            html    : '<h1>Review of Systems Checks form placeholder!</h1>'
        });

        me.soapPanel = Ext.create('Ext.form.Panel',{
            autoScroll  : true,
            border      : false,
            title       : 'SOAP',
            action      : 'encounter',
            fieldDefaults: { msgTarget:'side' }
        });
        me.speechDicPanel = Ext.create('Ext.form.Panel',{
            autoScroll  : true,
            border      : false,
            title       : 'Speech Dictation',
            action      : 'encounter',
            fieldDefaults: { msgTarget:'side' }
        });

        me.vitalsPanel = Ext.create('Ext.panel.Panel', {
            title       : 'Vitals',
            action      : 'encounter',
            cls         : 'vitals-panel',
            bodyPadding : '5 10',
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
                    handler : me.onChartWindowtShow
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


    onChartWindowtShow:function(){
        this.chartsWindow.show();
    },
    
    onChartSwitch:function(btn){
        var win = this.chartsWindow,
            layout  = win.getLayout();

        if(btn.action == 'growChart'){
            layout.setActiveItem(0);
        }else if(btn.action == 'headCirChart'){
            layout.setActiveItem(1);
        }else if(btn.action == 'weightAge'){
            layout.setActiveItem(2);
        }else if(btn.action == 'heightAge'){
            layout.setActiveItem(3);
        }


    },



    /**
     * This is the logic to create a new encounter
     */
    newEncounter:function(){
        var me = this;
        Encounter.ckOpenEncounters(function(provider, response){
            if(response.result.encounter){
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

        });
    },

    showNewEncounterWindow:function(){
        var me = this,
            form = me.newEncounterWindow.down('form');
        me.getFormItems( form, 'New Encounter', function(){
            form.getForm().findField('start_date').setValue(new Date());
            form.doLayout();
            me.newEncounterWindow.show();
        });
    },


    saveNewEnc:function(btn){
        var me = this,
            form = me.newEncounterWindow.down('form').getForm();
        if (form.isValid()){
            var data = form.getValues();

            Encounter.createEncounter(data,function(provider, response){
                if(response.result.success){
                    me.currEncounterStartDate = me.parseDate(response.result.encounter.start_date);
                    me.currEncounterEid = response.result.encounter.eid;
                    me.startTimer();
                    btn.up('window').close();
                }else{
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
        Ext.TaskManager.start(this.timerTask);
    },

    /**
     * This will update the timer every sec
     */
    encounterTimer:function(){
        var me = this;
        var timer = me.timer(me.currEncounterStartDate,new Date()),
            patient = me.getCurrPatient();
        me.updateTitle( patient.name+ ' - ' + Ext.Date.format(me.currEncounterStartDate, 'F j, Y, g:i a') + ' (Opened Encounter) <span class="timer">'+timer+'</span>' );
    },

    timer:function(start, stop){
        var ms = Ext.Date.getElapsed(start,stop), t,
            sec = Math.floor(ms/1000);
        function twoDigit(d){
            return (d >= 10) ? d : '0'+d;
        }

        var min = Math.floor(sec/60);
        sec = sec % 60;
        t = twoDigit(sec);

        var hr = Math.floor(min/60);
        min = min % 60;
        t = twoDigit(min) + ":" + t;

        var day = Math.floor(hr/24);
        hr = hr % 24;
        t = twoDigit(hr) + ":" + t;

        //t = day + ":" + t

        t = (day == 0 )? '<span class="time">'+t+'</span>' : '<span class="day">'+day+' day(s)</span><span class="time">'+t+'</span>';
        return t;
    },

    openEncounter:function(eid){
        var me = this;
        me.currEncounterEid = eid;
        me.encounterStore.getProxy().extraParams.eid = eid;
        me.encounterStore.load({
            scope   : me,
            callback: function(provider, operation) {
                var data = operation.response.result,
                    start_date = me.parseDate(data.start_date);
                me.currEncounterStartDate = start_date;

                if (data.close_date === null) {
                    me.startTimer();
                } else {
                    console.log(me.timerTask);
                    Ext.TaskManager.stop(me.timerTask);
                    var stop_date = me.parseDate(data.close_date),
                        timer = me.timer(start_date, stop_date),
                        patient = me.getCurrPatient();
                    me.updateTitle(patient.name + ' - ' + Ext.Date.format(me.currEncounterStartDate, 'F j, Y, g:i a') + ' (Closed Encounter) <span class="timer">' + timer + '</span>');
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
                var params = {
                    eid         : me.currEncounterEid,
                    close_date  : Ext.Date.format(new Date(), 'Y-m-d H:i:s'),
                    signature   : signature
                };
                Encounter.closeEncounter( params, function(provider, response){
                    if(response.result.success){
                        // TODO: after close encounter logic
                        Ext.TaskManager.stop(me.timerTask);
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

            this.getFormItems( me.vitalsPanel.down('form'), 'Vitals', function(){
                me.vitalsPanel.doLayout();
            });

            this.getFormItems( me.soapPanel, 'SOAP', function(){
                me.soapPanel.doLayout();
            });

            this.getFormItems( me.speechDicPanel, 'Speech Dictation', function(){
                me.speechDicPanel.doLayout();
            });


            callback(true);
        }else{
            callback(false);
            this.currPatientError();
        }
    }
});
