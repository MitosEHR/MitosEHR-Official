Ext.define('Ext.mitos.view.MitosApp',{
    extend:'Ext.Viewport',
    uses:[

        'Ext.mitos.classes.RenderPanel',
        'Ext.mitos.classes.CRUDStore',
        'Ext.mitos.classes.restStoreModel',

        'Ext.chart.*',
        'Ext.fx.target.Sprite',

        'Ext.dd.DropZone',
        'Ext.dd.DragZone',

        'Extensible.calendar.CalendarPanel',
        'Extensible.calendar.gadget.CalendarListPanel',
        'Extensible.calendar.data.MemoryCalendarStore',
        'Extensible.calendar.data.MemoryEventStore',

        'Ext.mitos.classes.combo.*',
        'Ext.mitos.classes.combo.Users',
        'Ext.mitos.classes.combo.Roles',
        'Ext.mitos.classes.combo.TaxId',
        'Ext.mitos.classes.combo.Lists',
        'Ext.mitos.classes.combo.posCodes',
        'Ext.mitos.classes.combo.Titles',
        'Ext.mitos.classes.combo.CodesTypes',
        'Ext.mitos.classes.combo.Languages',
        'Ext.mitos.classes.combo.Authorizations',
        'Ext.mitos.classes.combo.Facilities',
        'Ext.mitos.classes.combo.TransmitMedthod',
        'Ext.mitos.classes.combo.InsurancePayerType',


        'Ext.mitos.classes.form.FormPanel',
        'Ext.mitos.classes.form.fields.Checkbox',
        'Ext.mitos.classes.window.Window',
        'Ext.mitos.classes.NodeDisabled',

        'Ext.mitos.view.dashboard.Dashboard',
        'Ext.mitos.view.calendar.Calendar',
        'Ext.mitos.view.messages.Messages',

        'Ext.mitos.view.patientfile.new.NewPatient',
        'Ext.mitos.view.patientfile.summary.Summary',
        'Ext.mitos.view.patientfile.visits.Visits',
        'Ext.mitos.view.patientfile.encounter.Encounter',


        'Ext.mitos.view.fees.Billing',
        'Ext.mitos.view.fees.Checkout',
        'Ext.mitos.view.fees.FeesSheet',
        'Ext.mitos.view.fees.Payments',

        'Ext.mitos.view.administration.Facilities',
        'Ext.mitos.view.administration.Globals',
        'Ext.mitos.view.administration.Layout',
        'Ext.mitos.view.administration.Lists',
        'Ext.mitos.view.administration.Log',
        'Ext.mitos.view.administration.Practice',
        'Ext.mitos.view.administration.Roles',
        'Ext.mitos.view.administration.Services',
        'Ext.mitos.view.administration.Users',

        'Ext.mitos.view.miscellaneous.Addressbook',
        'Ext.mitos.view.miscellaneous.MyAccount',
        'Ext.mitos.view.miscellaneous.MySettings',
        'Ext.mitos.view.miscellaneous.OfficeNotes',
        'Ext.mitos.view.miscellaneous.Websearch'

    ],
    initComponent: function(){

        var me = this;

        me.lastCardNode = null;
        me.currCardCmp = null;

        me.currPatient = null;
        /**
         * TaskScheduler
         * This will run all the procedures inside the checkSession
         */
        Ext.TaskManager.start({
            run		    : function(){
                me.checkSession();
                me.patientPoolStore.load();
            },
            interval    : 100000
        });


        /**
         * Navigation Panel Tree Data
         */
        Ext.define('NavTreeModel', {
            extend: 'Ext.data.Model',
            fields: [
                'text',
                {name: 'disabled', type:'bool', defaultValue:false}
            ]
        });
        me.storeTree = Ext.create('Ext.data.TreeStore',{
            model: 'NavTreeModel',
            proxy: {
                type: 'direct',
                api: {
                    read: Navigation.getNavigation
                }
            },
            listeners:{
                scope: me,
                load : me.navNodeDefault
            }
        });

        /**
         * This store will handle the patient pool area
         */
        me.patientPoolStore = Ext.create('Ext.data.Store', {
            fields: ['name', 'pid', 'pic'],
            data : [
                {"name":"Ernesto J Rodriguez",  "pid":"123", "pic":"ui_icons/user_32.png"},
                {"name":"Juan Pablo",           "pid":"634", "pic":"ui_icons/user_32.png"},
                {"name":"Joe Smith",            "pid":"867", "pic":"ui_icons/user_32.png"}
                //...
            ]
        });


        /**
         * MitosEHR Support Page
         */
        me.winSupport = Ext.create('Ext.window.Window', {
            title			: 'Support',
            closeAction		: 'hide',
            bodyStyle		: 'background-color: #ffffff; padding: 5px;',
            animateTarget	: me.Footer,
            resizable		: false,
            draggable		: false,
            maximizable		: false,
            autoScroll		: true,
            maximized       : true,
            dockedItems:{
                xtype   : 'toolbar',
                dock    : 'top',
                items:['-',{
                    text    : lang.issuesBugs,
                    iconCls : 'list',
                    scope   : me,
                    handler:function(){
                        me.showMiframe('http://mitosehr.org/projects/mitosehr001/issues');
                    }
                },'-',{
                    text    : lang.newIssueBug,
                    iconCls : 'icoAddRecord',
                    scope   : me,
                    handler:function(){
                        me.showMiframe('http://mitosehr.org/projects/mitosehr001/issues/new');
                    }
                }]
            }
        });


        /**
         * header Panel
         */
        me.Header = Ext.create('Ext.container.Container', {
            region		: 'north',
            height		: 44,
            split		: false,
            collapsible : false,
            frame		: false,
            border		: false,
            bodyStyle	: 'background: transparent',
            margins		: '0 0 0 0',
            items		: [{
                xtype	: 'container',
                html	: '<img src="ui_app/app_logo.png" height="40" width="200" style="float:left">',
                style	: 'float:left',
                border	: false
            },{
                xtype   : 'button',
                scale	: 'large',
                style 	: 'float:left',
                margin	: '0 0 0 5',
                itemId  : 'patientButton',
                scope   : me,
                handler : me.openPatientSummary,
                listeners: {
                    scope       : me,
                    afterrender : me.patientUnset
                },
                tpl : me.patientBtn()
            },{
                xtype   : 'button',
                scale	: 'large',
                style 	: 'float:left',
                margin	: '0 0 0 3',
                cls     : 'headerLargeBtn',
                padding : 0,
                itemId  : 'patientOpenVisits',
                iconCls : 'icoBackClock',
                scope   : me,
                handler : me.openPatientVisits,
                tooltip : 'Open Patient Visits History'
            },{
                xtype   : 'button',
                scale	: 'large',
                style 	: 'float:left',
                margin	: '0 0 0 3',
                cls     : 'headerLargeBtn',
                padding : 0,
                itemId  : 'patientCreateEncounter',
                iconCls : 'icoClock',
                scope   : me,
                handler : me.createNewEncounter,
                tooltip : 'Crate New Encounter'
            },{
                xtype   : 'button',
                scale	: 'large',
                style 	: 'float:left',
                margin	: '0 0 0 3',
                cls     : 'headerLargeBtn',
                padding : 0,
                itemId  : 'patientPushFor',
                iconCls : 'icoArrowRight',
                scope   : me,
                tooltip : 'Sent Current Patient Record To...',
                arrowCls: 'none',
                menu: [{
                    text     : 'Front Office',
                    iconCls	: 'icoArrowRight',
                    action  : 'fronOffice',
                    handler : me.sendPatientTo
                },{
                    text    : 'Triage',
                    iconCls	: 'icoArrowRight',
                    action  : 'triage',
                    handler : me.sendPatientTo
                },{
                    text    : 'Doctor',
                    iconCls	: 'icoArrowRight',
                    action  : 'doctor',
                    scope   : me,
                    handler : me.sendPatientTo
                }]
            },{
                xtype   : 'button',
                scale	: 'large',
                style 	: 'float:left',
                margin	: '0 0 0 3',
                cls     : 'headerLargeBtn',
                padding : 0,
                itemId  : 'patientCloseCurrEncounter',
                iconCls : 'icoArrowDown',
                scope   : me,
                handler : me.stowPatientRecord,
                tooltip : 'Stow Patient Record'
            },{
                xtype   : 'button',
                scale	: 'large',
                style 	: 'float:left',
                margin	: '0 0 0 3',
                cls     : 'headerLargeBtn',
                padding : 0,
                itemId  : 'patientCheckOut',
                iconCls : 'icoCheck',
                scope   : me,
                handler : me.checkOutPatient,
                tooltip : 'Check Out Patient'
            },{
                xtype       : 'panel',
                width		: 260,
                bodyPadding	: '8 11 5 11',
                margin		: '0 0 0 3',
                style 		: 'float:left',
                layout		: 'anchor',
                items: [{
                    xtype       : 'patienlivetsearch',
                    emptyText   : 'Patient Live Search...',
                    listeners   : {
                        scope   : me,
                        select  : me.liveSearchSelect,
                        blur: function(combo){
                            combo.reset();
                        }
                    }
                }]
            },{
                xtype   : 'button',
                scale	: 'large',
                style 	: 'float:left',
                margin	: '0 0 0 3',
                padding : 4,
                itemId  : 'patientNewReset',
                iconCls : 'icoAddPatient',
                scope   : me,
                handler : me.newPatient,
                tooltip : 'Create a new patient'
            },{
                xtype   : 'button',
                scale	: 'large',
                style 	: 'float:left',
                margin	: '0 0 0 3',
                cls     : 'headerLargeBtn emerBtn',
                overCls : 'emerBtnOver',
                padding : 0,
                itemId  : 'createEmergency',
                iconCls : 'icoEmer',
                scope   : me,
                handler : me.createEmergency,
                tooltip : 'Create New Ememercency'
            },{
                xtype		: 'button',
                text		: user.name,
                scale	    : 'large',
                iconCls		: 'icoDoctor',
                iconAlign	: 'left',
                cls         : 'drButton',
                style 		: 'float:right',
                margin		: '0 0 0 3',
                menu: [{
                    text    : 'My account',
                    iconCls	: 'icoArrowRight',
                    handler : function(){
                        me.MainPanel.getLayout().setActiveItem('panelMyAccount');
                    }
                },{
                    text    : 'My settings',
                    iconCls	: 'icoArrowRight',
                    handler : function(){
                        me.MainPanel.getLayout().setActiveItem('panelMySettings');
                    }
                },{
                    text    : 'Logout',
                    iconCls	: 'icoArrowRight',
                    scope   : me,
                    handler : me.appLogout
                }]
            }]
        });


        /**
         * The panel definition for the the TreeMenu & the support button
         */
        me.navColumn = Ext.create('Ext.panel.Panel', {
            title		: lang.navigation,
            stateId     : 'navColumn',
            layout      : 'border',
            region		: 'west',
            width		: 200,
            split		: true,
            collapsible	: true,
            items		: [{
                xtype       : 'treepanel',
                region		: 'center',
                cls         : 'nav_tree',
                hideHeaders	: true,
                rootVisible	: false,
                border      : false,
                store		: me.storeTree,
                width		: 200,
                plugins     : [{ptype:'nodedisabled'}],
                root		: {
                    nodeType	: 'async',
                    draggable	: false
                },
                listeners:{
                    scope           : me,
                    selectionchange : me.navNodeSelected
                }
            },{
                xtype       : 'panel',
                title       : lang.patientPoolArea,
                layout      : 'vbox',
                region      : 'south',
                itemId      : 'patientPoolArea',
                bodyPadding : 5,
                height      : 300,
                collapsible : true,
                border      : false,
                items:[{
                    xtype   : 'dataview',
                    cls     : 'patient-pool-view',
                    tpl: '<tpl for=".">' +
                            '<div class="patient-pool-btn x-btn x-btn-default-large">' +
                                '<div class="patient_btn_img"><img src="ui_icons/user_32.png"></div>' +
                                '<div class="patient_btn_info">' +
                                    '<div class="patient-name">{name}</div>' +
                                    '<div class="patient-name">({pid})</div>' +
                                '</div>' +
                            '</div>' +
                         '</tpl>',
                    itemSelector: 'div.patient-pool-btn',
                    overItemCls: 'patient-over',
                    selectedItemClass: 'patient-selected',
                    singleSelect: true,
                    store: me.patientPoolStore,
                    listeners: {
                        scope   : me,
                        render  : me.initializePatientDragZone
                    }
                }]
            }],
            dockedItems : [{
                xtype   : 'toolbar',
                dock    : 'bottom',
                border  : true,
                margin      : '3 0 0 0',
                padding : 5,
                layout  : {
                    type : 'hbox',
                    pack : 'center'
                },
                items: ['-',{
                    xtype   : 'button',
                    frame   : true,
                    text    : 'MithosEHR '+lang.support,
                    iconCls : 'icoHelp',
                    scope   : me,
                    handler : function(){
                        me.showMiframe('http://mitosehr.org/projects/mitosehr001/wiki');
                    }
                },'-']
            }],
            listeners:{
                scope:me,
                beforecollapse: me.navCollapsed,
                beforeexpand: me.navExpanded

            }
        });


        /**
         * MainPanel is where all the pages are display
         */
        me.MainPanel = Ext.create('Ext.container.Container', {
            region			: 'center',
            layout          : 'card',
            border			: true,
            itemId          : 'MainPanel',
            defaults        : { layout: 'fit', xtype:'container' },
            items: [

            /**
             * General Area
             */
                Ext.create('Ext.mitos.view.dashboard.Dashboard'),                      // done  TODO: panels
                Ext.create('Ext.mitos.view.calendar.Calendar'),                        // done
                Ext.create('Ext.mitos.view.messages.Messages'),                        // done
                Ext.create('Ext.mitos.view.search.PatientSearch'),                     //

            /**
             * Patient Area
             */
                Ext.create('Ext.mitos.view.patientfile.new.NewPatient'),
                Ext.create('Ext.mitos.view.patientfile.summary.Summary'),
                Ext.create('Ext.mitos.view.patientfile.visits.Visits'),
                Ext.create('Ext.mitos.view.patientfile.encounter.Encounter'),


            /**
             * Fees Area
             */
                Ext.create('Ext.mitos.view.fees.Billing'),
                Ext.create('Ext.mitos.view.fees.Checkout'),
                Ext.create('Ext.mitos.view.fees.FeesSheet'),
                Ext.create('Ext.mitos.view.fees.Payments'),




            /**
             * Miscellaneous
             */
                Ext.create('Ext.mitos.view.miscellaneous.Addressbook'),
                Ext.create('Ext.mitos.view.miscellaneous.MyAccount'),
                Ext.create('Ext.mitos.view.miscellaneous.MySettings'),
                Ext.create('Ext.mitos.view.miscellaneous.OfficeNotes'),
                Ext.create('Ext.mitos.view.miscellaneous.Websearch')

            ],
            listeners:{
                scope       : me,
                afterrender : me.initializeHospitalDropZone
            }
        });


        /**
         * Add Administration Area Panels
         */
        if(perm.access_gloabal_settings){
            me.MainPanel.add(Ext.create('Ext.mitos.view.administration.Globals'));
        }
        if(perm.access_facilities){
            me.MainPanel.add(Ext.create('Ext.mitos.view.administration.Facilities'));
        }
        if(perm.access_users){
            me.MainPanel.add(Ext.create('Ext.mitos.view.administration.Users'));
        }
        if(perm.access_practice){
            me.MainPanel.add(Ext.create('Ext.mitos.view.administration.Practice'));
        }
        if(perm.access_services){
            me.MainPanel.add(Ext.create('Ext.mitos.view.administration.Services'));
        }
        if(perm.access_roles){
            me.MainPanel.add(Ext.create('Ext.mitos.view.administration.Roles'));
        }
        if(perm.access_layouts){
            me.MainPanel.add(Ext.create('Ext.mitos.view.administration.Layout'));
        }
        if(perm.access_lists){
            me.MainPanel.add(Ext.create('Ext.mitos.view.administration.Lists'));
        }
        if(perm.access_event_log){
            me.MainPanel.add(Ext.create('Ext.mitos.view.administration.Log'));
        }


        /**
         * Footer Panel
         */
        me.Footer = Ext.create('Ext.container.Container', {
            height      : 30,
            split       : false,
            padding     : '3 0',
            region      : 'south',
            items:[{
                xtype   : 'dataview',
                margin  : '0 0 3 0',
                hidden  : true,
                cls     : 'patient-pool-view-footer x-toolbar x-toolbar-default x-box-layout-ct',
                tpl:'<div class="x-toolbar-separator x-toolbar-item x-toolbar-separator-horizontal" style="float:left; margin-top:5px;" role="presentation" tabindex="-1"></div>'+
                    '<tpl for=".">' +
                        '<div class="patient-pool-btn-small x-btn x-btn-default-small" style="float:left">' +
                            '<div class="patient_btn_info">' +
                                '<div class="patient-name">{name} ({pid})</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="x-toolbar-separator x-toolbar-item x-toolbar-separator-horizontal" style="float:left; margin-top:5px; margin-left:3px;" role="presentation" tabindex="-1"></div>'+
                     '</tpl>',
                itemSelector: 'div.patient-pool-btn-small',
                overItemCls: 'patient-over',
                selectedItemClass: 'patient-selected',
                singleSelect: true,
                store: me.patientPoolStore,
                listeners: {
                    scope   : me,
                    render  : me.initializePatientDragZone
                }
            },{
                xtype   : 'toolbar',
                dock    : 'bottom',
                items:[{
                    text    : 'Copyright (C) 2011 MitosEHR (Electronic Health Records) |:|  Open Source Software operating under GPLv3 ',
                    iconCls : 'icoGreen',
                    disabled: true,
                    scope   : me,
                    handler : function(){
                        me.showMiframe('http://mitosehr.org/projects/mitosehr001');
                    }
                },'->',{
                    text    : 'news',
                    scope   : me,
                    handler : function(){
                        me.showMiframe('http://mitosehr.org/projects/mitosehr001/news');
                    }
                },'-',{
                    text    : 'wiki',
                    scope   : me,
                    handler : function(){
                        me.showMiframe('http://mitosehr.org/projects/mitosehr001/wiki');
                    }
                },'-',{
                    text    : 'issues',
                    scope   : me,
                    handler : function(){
                        me.showMiframe('http://mitosehr.org/projects/mitosehr001/issues');
                    }
                },'-',{
                    text    : 'forums',
                    scope   : me,
                    handler : function(){
                        me.showMiframe('http://mitosehr.org/projects/mitosehr001/boards');
                    }
                }]
            }]
        });

        me.layout    = { type:'border', padding:3 };
        me.defaults	 = { split:true };
        me.items     = [ me.Header, me.navColumn, me.MainPanel, me.Footer ];

        me.listeners = {
            afterrender: me.afterAppRender
        };

        me.callParent(arguments);
    },


    newPatient:function(){
        var me = this;
        me.remoteNavNodeSelecte('panelNewPatient', function(){
            me.patientUnset();

        });
        console.log(this.currCardCmp);
    },

    createEmergency:function(){
        alert('Emergency Button Clicked');
    },

    createNewEncounter:function(){
        var me = this;

        me.remoteNavNodeSelecte('panelEncounter', function(success){
            if(success){
                me.currCardCmp.newEncounter();
            }
        });
    },

    sendPatientTo:function(btn){
        var area = btn.action;
        alert('TODO: Patient will be sent to '+area );
    },


    openPatientSummary:function(){
        var me = this;

        if(me.currCardCmp == Ext.getCmp('panelSummary')){
            var same = true;
        }

        me.remoteNavNodeSelecte('panelSummary',function(){
            if(same){
                me.currCardCmp.onActive();
            }
        });
    },

    stowPatientRecord:function(){
        this.patientUnset();
        this.remoteNavNodeSelecte('panelDashboard');
    },

    openCurrEncounter:function(){
        this.remoteNavNodeSelecte('panelEncounter');
    },

    openEncounter:function(eid){
        var me = this;

        me.remoteNavNodeSelecte('panelEncounter', function(success){
            if(success){
                me.currCardCmp.openEncounter(eid);
            }
        });
    },

    checkOutPatient:function(){

    },

    openPatientVisits:function(){
        this.remoteNavNodeSelecte('panelVisits');
    },

    remoteNavNodeSelecte:function(id, callback){
        var tree        = this.navColumn.down('treepanel'),
            treeStore   = tree.getStore(),
            sm          = tree.getSelectionModel(),
            node        = treeStore.getNodeById(id);

        sm.select(node);
        if(typeof callback == 'function'){
            callback(true);
        }
    },

    navNodeDefault:function(){
        this.remoteNavNodeSelecte('panelDashboard');
    },

    navNodeSelected:function(model, selected){

        var me = this;

        if(selected[0].data.leaf){

            var tree        = me.navColumn.down('treepanel'),
                sm          = tree.getSelectionModel();

            var card    = selected[0].data.id,
                layout  = me.MainPanel.getLayout(),
                cardCmp = Ext.getCmp(card);

            this.currCardCmp = cardCmp;

            layout.setActiveItem(card);

            cardCmp.onActive(function(success){
                if(success) {
                    me.lastCardNode = sm.getLastSelected();
                }else{
                    me.goBack();
                }
            });
        }
    },

    navCollapsed:function(){
        var navView = this.navColumn.getComponent('patientPoolArea'),
            foot    = this.Footer,
            footView = foot.down('dataview');

        navView.hide();
        foot.setHeight(60);
        footView.show();
    },

    navExpanded:function(){
        var navView = this.navColumn.getComponent('patientPoolArea'),
            foot    = this.Footer,
            footView = foot.down('dataview');

        navView.show();
        foot.setHeight(30);
        footView.hide();
    },

    goBack:function(){
        var tree        = this.navColumn.down('treepanel'),
            sm          = tree.getSelectionModel();
        sm.select(this.lastCardNode);
    },

    liveSearchSelect:function(combo, selection) {
        var me   = this,
            post = selection[0],
            btn  = me.Header.getComponent('patientButton');

        if (post) {
            /**
             * Ext.direct function
             * @param pid int
             */
            Patient.currPatientSet({pid: post.get('pid')}, function(){
                me.currPatient = {
                    pid : post.get('pid'),
                    name: post.get('fullname')
                };

                btn.update( {name:post.get('fullname'), info:'('+post.get('pid')+')'} );
                btn.enable();

                me.openPatientSummary();
            });
        }
    },

    setCurrPatient:function(pid, fullname, callback){
        var btn  = this.Header.getComponent('patientButton');

        this.currPatient = {
            pid : pid,
            name: fullname
        };

        btn.update( {name:fullname, info:'(' + pid + ')'} );
        btn.enable();

        callback(true);
    },

    patientUnset:function(){
        var btn  = this.Header.getComponent('patientButton');
        /**
         * Ext.direct function
         */
        Patient.currPatientUnset(function(){
            btn.update( {name:'No Patient Selected', info:'( record )'} );
        });
    },

    afterAppRender:function(){
        Ext.get('mainapp-loading').remove();
        Ext.get('mainapp-loading-mask').fadeOut({remove:true});

    },

    showMiframe:function(src){
        this.winSupport.remove(this.miframe);
        this.winSupport.add(this.miframe = Ext.create('Ext.mitos.ManagedIframe',{src:src}));
        this.winSupport.show();
    },

    msg: function(title, format){
        if(!this.msgCt){
            this.msgCt = Ext.core.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
        }
        this.msgCt.alignTo(document, 't-t');
        var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
        var m = Ext.core.DomHelper.append(this.msgCt, {html:'<div class="msg"><h3>'+title+'</h3><p>'+s+'</p></div>'}, true);

        m.slideIn('t').pause(3000).ghost('t', {remove:true});
    },

    checkSession: function(){
        /**
         * Ext.direct functions
         */
        authProcedures.ckAuth(function(provider, response) {
            if(!response.result.authorized){
                authProcedures.unAuth(function(){
                    window.location="./"
                });
            }
        });
    },

    patientBtn:function(){
        return new Ext.create('Ext.XTemplate',
            '<div class="patient_btn">',
                '<div class="patient_btn_img"><img src="ui_icons/user_32.png"></div>',
                '<div class="patient_btn_info">',
                    '<div class="patient_btn_name">{name}</div>',
                    '<div class="patient_btn_record">{info}</div>',
                '</div>',
            '</div>',{
            defaultValue: function(v){
                return (v) ? v : 'No Patient Selected';
            }
        });
    },

    appLogout:function(){
        Ext.Msg.show({
            title   : 'Please confirm...',
            msg     : 'Are you sure to quit MitosEHR?',
            icon    : Ext.MessageBox.QUESTION,
            buttons : Ext.Msg.YESNO,
            fn:function(btn){
                if(btn=='yes'){
                    authProcedures.unAuth(function(){
                        window.location = "./"
                    });
                }
            }
        });
    },


    /**
     *
     * @param panel
     */
    initializePatientDragZone:function(panel) {
        panel.dragZone = Ext.create('Ext.dd.DragZone', panel.getEl(), {

            ddGroup:'patient',

            // On receipt of a mousedown event, see if it is within a draggable element.
            // Return a drag data object if so. The data object can contain arbitrary application
            // data, but it should also contain a DOM element in the ddel property to provide
            // a proxy to drag.
            getDragData: function(e) {
                var sourceEl = e.getTarget(panel.itemSelector, 10), d;

                App.MainPanel.el.mask('Drop Here To Open <strong>"'+panel.getRecord(sourceEl).data.name+'"</strong> Current Encounter');

                if (sourceEl) {
                    d = sourceEl.cloneNode(true);
                    d.id = Ext.id();
                    return panel.dragData = {
                        sourceEl: sourceEl,
                        repairXY: Ext.fly(sourceEl).getXY(),
                        ddel: d,
                        patientData: panel.getRecord(sourceEl).data
                    };
                }
            },


            // Provide coordinates for the proxy to slide back to on failed drag.
            // This is the original XY coordinates of the draggable element.
            getRepairXY: function() {

                App.MainPanel.el.unmask();

                return this.dragData.repairXY;
            }
        });
    },

    /**
     *
     * @param panel
     */
    initializeHospitalDropZone: function(panel) {
        var me = this;
        panel.dropZone = Ext.create('Ext.dd.DropZone', panel.getEl(), {
            ddGroup:'patient',
            notifyOver:function(){
                return Ext.dd.DropZone.prototype.dropAllowed;
            },
            notifyDrop:function(dd, e, data){
                App.MainPanel.el.unmask();
                me.setCurrPatient(data.patientData.pid,data.patientData.name,function(){
                    me.openCurrEncounter();
                });
            }
        });
    },

    getCurrPatient:function(){
        return this.currPatient;
    },

    getMitosApp:function(){
        return this;
    }

});