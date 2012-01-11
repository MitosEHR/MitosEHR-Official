Ext.define('Ext.mitos.panel.MitosApp',{
    extend:'Ext.Viewport',
    uses:[

        'Ext.mitos.RenderPanel',
        'Ext.mitos.CRUDStore',
        'Ext.mitos.restStoreModel',

        'Extensible.calendar.CalendarPanel',
        'Extensible.calendar.gadget.CalendarListPanel',
        'Extensible.calendar.data.MemoryCalendarStore',
        'Extensible.calendar.data.MemoryEventStore',

        'Ext.mitos.combo.*',
        'Ext.mitos.combo.Users',
        'Ext.mitos.combo.Roles',
        'Ext.mitos.combo.TaxId',
        'Ext.mitos.combo.Lists',
        'Ext.mitos.combo.PermValues',
        'Ext.mitos.combo.posCodes',
        'Ext.mitos.combo.Titles',
        'Ext.mitos.combo.CodesTypes',
        'Ext.mitos.combo.Languages',
        'Ext.mitos.combo.Authorizations',
        'Ext.mitos.combo.Facilities',
        'Ext.mitos.combo.TransmitMedthod',
        'Ext.mitos.combo.InsurancePayerType',

        'Ext.mitos.form.FormPanel',
        'Ext.mitos.form.fields.Checkbox',
        'Ext.mitos.window.Window',

        'Ext.mitos.panel.dashboard.Dashboard',
        'Ext.mitos.panel.calendar.Calendar',
        'Ext.mitos.panel.messages.Messages',

        'Ext.mitos.panel.patientfile.new.NewPatient',
        'Ext.mitos.panel.patientfile.summary.Summary',
        'Ext.mitos.panel.patientfile.visits.Visits',
        'Ext.mitos.panel.fees.billing.Billing',
        'Ext.mitos.panel.fees.checkout.Checkout',
        'Ext.mitos.panel.fees.fees_sheet.FeesSheet',
        'Ext.mitos.panel.fees.payments.Payments',

        'Ext.mitos.panel.administration.facilities.Facilities',
        'Ext.mitos.panel.administration.globals.Globals',
        'Ext.mitos.panel.administration.layout.Layout',
        'Ext.mitos.panel.administration.lists.Lists',
        'Ext.mitos.panel.administration.log.Log',
        'Ext.mitos.panel.administration.practice.Practice',
        'Ext.mitos.panel.administration.roles.Roles',
        'Ext.mitos.panel.administration.services.Services',
        'Ext.mitos.panel.administration.users.Users',

        'Ext.mitos.panel.miscellaneous.addressbook.Addressbook',
        'Ext.mitos.panel.miscellaneous.myaccount.MyAccount',
        'Ext.mitos.panel.miscellaneous.mysettings.MySettings',
        'Ext.mitos.panel.miscellaneous.officenotes.OfficeNotes',
        'Ext.mitos.panel.miscellaneous.websearch.Websearch'

    ],
    initComponent: function(){

        var me = this;
        me.lastCard = null;
        me.currPatient = null;
        /**
         * TaskScheduler
         * This will run all the procedures inside the checkSession
         */
        Ext.TaskManager.start({
            run		    : function(){
                me.checkSession();
                me.checkPool();
            },
            interval    : 10000
        });


        /**
         * Navigation Panel Tree Data
         */
        me.storeTree = Ext.create('Ext.data.TreeStore',{
            proxy: {
                type	: 'ajax',
                url		: 'app/navigation/default_leftnav.ejs.php'
            }
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
                    text    : 'Issues/Bugs',
                    iconCls : 'list',
                    scope   : me,
                    handler:function(){
                        me.showMiframe('http://mitosehr.org/projects/mitosehr001/issues');
                    }
                },'-',{
                    text    : 'New Issue/Bug',
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
                html	: '<a href="http://www.mitosehr.org/" style="float:left"><img src="ui_app/app_logo.png" height="40" width="200" style="float:left"></a>',
                style	: 'float:left',
                border	: false
            },{
                xtype   : 'button',
                scale	: 'large',
                style 	: 'float:left',
                margin	: '0 0 0 5',
                itemId  : 'patientButton',
                minWidth: 190,
                listeners: {
                    scope       : me,
                    afterrender : me.patientReset
                },
                tpl: Ext.create('Ext.XTemplate',
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
                }),
                menu: Ext.create('Ext.menu.Menu', {
                    items:[{
                        text    : 'New Encounter',
                        scope   : me,
                        handler : me.newEncounter
                    },{
                        text    : 'Encounter History',
                        scope   : me,
                        handler : me.encounterHistory
                    },{
                        text    : 'Patient Documents',
                        scope   : me,
                        handler : function(){

                        }
                    },{
                        text    : 'Patient Notes',
                        scope   : me,
                        handler : function(){

                        }
                    }]
                })
            },{
                xtype   : 'button',
                scale	: 'large',
                style 	: 'float:left',
                margin	: '0 0 0 3',
                cls     : 'headerLargeBtn',
                padding : 0,
                itemId  : 'patientOpenCurrEncounter',
                iconCls : 'icoArrowUp',
                scope   : me,
                handler : me.openCurrEncounter,
                tooltip : 'Open Patient Current Encounter'
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
                tooltip : 'Sent Current Patient To...',
                arrowCls: 'none',
                menu: [{
                    text     : 'Front Office',
                    iconCls	: 'icoArrowRight',
                    handler : function(){

                    }
                },{
                    text    : 'Triage',
                    iconCls	: 'icoArrowRight',
                    handler : function(){

                    }
                },{
                    text    : 'Doctor',
                    iconCls	: 'icoArrowRight',
                    scope   : me,
                    handler : function(){

                    }
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
                handler : me.closeCurrEncounter,
                tooltip : 'Close Patient Current Encounter'
            },{
                xtype       : 'panel',
                width		: 300,
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
                xtype		: 'button',
                text		: 'Dr. Smith',
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
            title		: 'Navigation',
            stateId     : 'navColumn',
            layout      : 'border',
            region		: 'west',
            width		: 200,
            split		: true,
            collapsible	: true,
            items		: [{
                xtype       : 'treepanel',
                region		: 'center',
                stateId     : 'Navigation',
                bodyPadding : '5 0 0 0',
                cls         : 'nav_tree',
                hideHeaders	: true,
                rootVisible	: false,
                border      : false,
                store		: me.storeTree,
                width		: 200,
                root		: {
                    nodeType	: 'async',
                    draggable	: false
                },
                listeners:{
                    scope       : me,
                    itemclick   : me.navNodeClicked
                }
            },{
                xtype       : 'panel',
                title       : 'Patient Pool Area',
                layout      : 'vbox',
                region      : 'south',
                itemId      : 'poolArea',
                bodyPadding : 5,

                height      : 300,
                collapsible : true,
                border      : false
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
                    text    : 'MithosEHR Support',
                    iconCls : 'icoHelp',
                    scope   : me,
                    handler : function(){
                        me.showMiframe('http://mitosehr.org/projects/mitosehr001/wiki');
                    }
                },'-']
            }]
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
                Ext.create('Ext.mitos.panel.dashboard.Dashboard'),                      // done  TODO: panels
                Ext.create('Ext.mitos.panel.calendar.Calendar'),                        // done
                Ext.create('Ext.mitos.panel.messages.Messages'),                        // done

                Ext.create('Ext.mitos.panel.patientfile.new.NewPatient'),
                Ext.create('Ext.mitos.panel.patientfile.summary.Summary'),
                Ext.create('Ext.mitos.panel.patientfile.visits.Visits'),
                Ext.create('Ext.mitos.panel.fees.billing.Billing'),
                Ext.create('Ext.mitos.panel.fees.checkout.Checkout'),
                Ext.create('Ext.mitos.panel.fees.fees_sheet.FeesSheet'),
                Ext.create('Ext.mitos.panel.fees.payments.Payments'),


                Ext.create('Ext.mitos.panel.administration.facilities.Facilities'),     // done
                Ext.create('Ext.mitos.panel.administration.globals.Globals'),           // done
                Ext.create('Ext.mitos.panel.administration.layout.Layout'),             // working
                Ext.create('Ext.mitos.panel.administration.lists.Lists'),               // working

                Ext.create('Ext.mitos.panel.administration.log.Log'),                   // done
                Ext.create('Ext.mitos.panel.administration.practice.Practice'),         // done
                Ext.create('Ext.mitos.panel.administration.roles.Roles'),               // done
                Ext.create('Ext.mitos.panel.administration.services.Services'),         // done
                Ext.create('Ext.mitos.panel.administration.users.Users'),               // done

                Ext.create('Ext.mitos.panel.miscellaneous.addressbook.Addressbook'),
                Ext.create('Ext.mitos.panel.miscellaneous.myaccount.MyAccount'),
                Ext.create('Ext.mitos.panel.miscellaneous.mysettings.MySettings'),
                Ext.create('Ext.mitos.panel.miscellaneous.officenotes.OfficeNotes'),
                Ext.create('Ext.mitos.panel.miscellaneous.websearch.Websearch')

            ]
        });


        /**
         * Footer Panel
         */
        me.Footer = Ext.create('Ext.container.Container', {
            height      : 30,
            split       : false,
            padding     : '3 0',
            region      : 'south',
            items:[{
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
        var card     = 'panelNewPatient',
            currCard = Ext.getCmp(card),
            layout   = this.MainPanel.getLayout();

        layout.setActiveItem(card);
        currCard.onActive();
        this.patientReset();
    },

    newEncounter:function(){
        var card     = 'panelVisits',
            currCard = Ext.getCmp(card),
            layout   = this.MainPanel.getLayout();

        layout.setActiveItem(card);
        currCard.newEncounter();
    },

    patientSummary:function(){
        var card     = 'panelSummary',
            currCard = Ext.getCmp(card),
            layout   = this.MainPanel.getLayout();

        layout.setActiveItem(card);
        currCard.onActive();
    },

    openCurrEncounter:function(){
        var card     = 'panelVisits',
            currCard = Ext.getCmp(card),
            layout   = this.MainPanel.getLayout();

        layout.setActiveItem(card);
        currCard.onActive();
    },

    closeCurrEncounter:function(){
        var card     = 'panelVisits',
            currCard = Ext.getCmp(card),
            layout   = this.MainPanel.getLayout();

        layout.setActiveItem(card);
        currCard.closeEncounter();
    },

    encounterHistory:function(){
        var card     = 'panelVisits',
            currCard = Ext.getCmp(card),
            layout   = this.MainPanel.getLayout();

        layout.setActiveItem(card);
        currCard.onActive();
    },

    navNodeClicked:function(dv, record){
        if(record.data.hrefTarget){

            var card      = record.data.hrefTarget,
                layout    = this.MainPanel.getLayout();

            this.lastCard = this.MainPanel.getLayout().getActiveItem();
            layout.setActiveItem(card);

            var currCard = Ext.getCmp(card);
            currCard.onActive();
        }
    },

    goBack:function(){
        var layout    = this.MainPanel.getLayout();
        layout.setActiveItem(this.lastCard);
    },

    liveSearchSelect:function(combo, selection) {
        var post = selection[0],
            btn  = this.Header.getComponent('patientButton');

        if (post) {
            Ext.Ajax.request({
                scope   : this,
                url     : Ext.String.format('classes/patient_search.class.php?task=set&pid={0}&pname={1}',post.get('pid'),post.get('fullname') ),
                success : function(){

                    this.currPatient = {
                        pid : post.get('pid'),
                        name: post.get('fullname')
                    };

                    btn.update( {name:post.get('fullname'), info:'('+post.get('pid')+')'} );
                    btn.enable();
                }
            });
            Ext.data.Request();
        }
    },


    patientReset:function(){
        var btn =  this.Header.getComponent('patientButton');

        Ext.Ajax.request({
            url    : 'classes/patient_search.class.php?task=reset',
            scope  : this,
            success: function(){
                this.currPatient = null;
                btn.update({name:'No Patient Selected', info:'(record number)'});
                btn.disable();
            }
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
        Ext.Ajax.request({
            url     : 'lib/authProcedures/chkAuth.inc.php',
            success : function(response){
                if(response.responseText == 'exit'){ window.location="lib/authProcedures/unauth.inc.php"; }
            }
        });
    },


    checkPool:function(){
        var poolArea = this.navColumn.getComponent('poolArea'),
            poolData = [{
            pid:4587,
            name:'Juan Pablo'
        },{
            pid:2342,
            name:'Joe Smith'
        }];

        poolArea.removeAll();

        Ext.each( poolData, function(patient, index, countriesItSelf){
            var btn = poolArea.add({
                xtype       : 'button',
                text        : patient.name +' - ('+ patient.pid +')',
                scale       : 'large',
                margin      : '0 0 3 0',
                width       : poolArea.getWidth()-10,
                textAlign   : 'left',
                tpl: Ext.create('Ext.XTemplate',
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
                })
            });
            btn.update({name: patient.name, info:'('+patient.pid+')' });
        });

        poolArea.doLayout();
    },

    appLogout:function(){
        Ext.Msg.show({
            title   : 'Please confirm...',
            msg     : 'Are you sure to quit MitosEHR?',
            icon    : Ext.MessageBox.QUESTION,
            buttons : Ext.Msg.YESNO,
            fn:function(btn){
                if(btn=='yes'){ window.location = "lib/authProcedures/unauth.inc.php"; }
            }
        });
    },

    setCurrPatient:function(pid, fullname, callback){
        var btn  = this.Header.getComponent('patientButton');

        this.currPatient = {
            pid : pid,
            name: fullname
        };

        btn.update( {name:fullname, info:'(' + pid + ')'} );
        btn.enable();

        callback();
    },



    getCurrPatient:function(){
        return this.currPatient;
    },

    getMitosApp:function(){
        return this;
    }

});