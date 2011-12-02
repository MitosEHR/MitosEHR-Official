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

        // *************************************************************************************
        // Task Scheduler
        // This will run certain task at determined time.
        // *************************************************************************************
        me.checkSession = function(){
            Ext.Ajax.request({
                url     : 'lib/authProcedures/chkAuth.inc.php',
                success : function(response){
                    if(response.responseText == 'exit'){ window.location="lib/authProcedures/unauth.inc.php"; }
                }
            });
        };

        // *************************************************************************************
        // TaskScheduler
        // This will run all the procedures inside the checkSession
        // *************************************************************************************
        Ext.TaskManager.start({
            run		    : me.checkSession,
            interval    : 100000
        });
        // *************************************************************************************
        // Navigation Panel Tree Data
        // *************************************************************************************
        me.storeTree = Ext.create('Ext.data.TreeStore',{
            proxy: {
                type	: 'ajax',
                url		: 'app/navigation/default_leftnav.ejs.php'
            }
        });

        // *************************************************************************************
        // Navigation Panel
        // *************************************************************************************
        me.Navigation = Ext.create('Ext.tree.TreePanel',{
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
                itemclick:function(dv, record){
                    if(record.data.hrefTarget){

                        var card    = record.data.hrefTarget;
                        var layout  = me.MainPanel.getLayout();
                        layout.setActiveItem(card);

                        var currCard= Ext.getCmp(card);
                        currCard.onActive();

                        // ************** //
                        // AMIMATION TEST //
                        // ************** //

                        //var first   = layout.getActiveItem();
                        //var second  = Ext.getCmp(card);

                        // ************* //
                        // Slide Out/In  //
                        // ************* //

                        //first.getEl().slideOut('r', {
                        //    duration: 150,
                        //    callback: function() {
                        //        layout.setActiveItem(second);
                        //       second.hide();
                        //        second.getEl().slideIn('r',{
                        //            duration: 200
                        //        });
                        //    }
                        //});

                        // *********** //
                        // Fade Out/In //
                        // *********** //

                        //first.getEl().fadeOut({
                        //    duration: 500,
                        //    callback: function() {
                        //        layout.setActiveItem(second);
                        //        second.hide();
                        //       second.getEl().fadeIn({
                        //            duration: 500
                        //        });
                        //    }
                        //});
                    }
                }
            }
        });

        // *************************************************************************************
        // MitosEHR Support Page
        // *************************************************************************************
        me.winSupport = Ext.create('Ext.window.Window', {
            closeAction		: 'hide',
            bodyStyle		: 'background-color: #ffffff; padding: 5px;',
            resizable		: false,
            title			: 'Support',
            draggable		: false,
            maximizable		: false,
            animateTarget	: me.Footer,
            autoScroll		: true,
            maximized       : true,
            dockedItems:{
                xtype: 'toolbar',
                dock: 'top',
                items:['-',{
                    text:'Issues/Bugs',
                    iconCls:'list',
                    handler:function(){
                        showMiframe('http://mitosehr.org/projects/mitosehr001/issues');
                    }
                },'-',{
                    text:'New Issue/Bug',
                    iconCls:'icoAddRecord',
                    handler:function(){
                        showMiframe('http://mitosehr.org/projects/mitosehr001/issues/new');
                    }
                }]
            }
        }); // End winSupport

        function showMiframe(src){
            me.winSupport.remove(me.miframe);
            me.winSupport.add(me.miframe = Ext.create('Ext.mitos.ManagedIframe',{src:src}));
            me.winSupport.show();
        }
        // *************************************************************************************
        // The panel definition for the the TreeMenu & the support button
        // *************************************************************************************
        me.navColumn = Ext.create('Ext.panel.Panel', {
            title		: 'Navigation',
            stateId     : 'navColumn',
            layout      : 'border',
            width		: 200,
            region		: 'west',
            split		: true,
            collapsible	: true,
            items		: [me.Navigation],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                padding: 5,
                layout : {
                    type : 'hbox',
                    pack : 'center'
                },
                items: ['-',{
                    xtype: 'button',
                    frame: true,
                    text: 'MithosEHR Support',
                    iconCls: 'icoHelp',
                    handler : function(){
                        showMiframe('http://mitosehr.org/projects/mitosehr001/wiki');
                    }
                },'-']
            }]
        });

        // *************************************************************************************
        // Panel for the live search
        // *************************************************************************************
        me.searchPanel = Ext.create('Ext.panel.Panel', {
            width		: 400,
            bodyPadding	: '8 11 5 11',
            margin		: '0 5',
            style 		: 'float:left',
            layout		: 'anchor',
            items: [
                me.liveSearch = Ext.create('Ext.mitos.LivePatientSearch',{
                    emptyText: 'Live Patient Search...',
                    listeners: {
                        select: function(combo, selection) {
                            var post = selection[0];
                            if (post) {
                                Ext.Ajax.request({
                                    url: Ext.String.format('classes/patient_search.class.php?task=set&pid={0}&pname={1}',post.get('pid'),post.get('patient_name') ),
                                    success: function(){
                                        //var newPatientBtn = Ext.String.format('<img src="ui_icons/32PatientFile.png" height="32" width="32" style="float:left"><strong>{0}</strong><br>Record ({1})', post.get('patient_name'), post.get('pid'));
                                        //me.patientButton.setText( newPatientBtn );
                                        me.patientButton.update( {name:post.get('patient_name'), info:'('+post.get('pid')+')'} );
                                        me.patientButton.enable();
                                    }
                                });
                                Ext.data.Request();
                            }
                        },
                        blur: function(){
                            me.liveSearch.reset();
                        }
                    }
                })
            ]
        }); // END Search for patient.

        // *************************************************************************************
        // header Panel
        // *************************************************************************************
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
            },
                me.patientButton = Ext.create('Ext.Button', {
                    //text	`: '<img src="ui_icons/32PatientFile.png" height="32" width="32" style="float:left">No Patient<br>Selected',
                    scale	 : 'large',
                    style 	 : 'float:left',
                    margin	 : '0 0 0 5px',
                    disabled : true,
                    minWidth : 190,
                    listeners: {
                        afterrender:function(){
                            this.update({name:'No Patient Selected', info:'(record number)'});
                        }
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
                            return v ? v : 'No Patient Selected';
                        }
                    }),
                    menu: Ext.create('Ext.menu.Menu', {
                        items:[{
                            text:'New Encounter',
                            handler:function(){

                            }
                        },{
                            text:'Past Encounter List',
                            handler:function(){

                            }
                        },{
                            text:'Patient Notes',
                            handler:function(){

                            }
                        }]
                    })
                }),me.searchPanel,{
                xtype		: 'button',
                text		: '[ USER NAME TOKEN ]',
                iconCls		: 'icoInjection',
                iconAlign	: 'left',
                style 		: 'float:right',
                margin		: '7 0 0 5',
                menu: [{
                    text:'My account',
                    iconCls		: 'icoArrow',
                    handler: function(){
                        me.MainPanel.getLayout().setActiveItem('panelMyAccount');
                    }
                },{
                    text:'My settings',
                    iconCls		: 'icoArrow',
                    handler: function(){
                        me.MainPanel.getLayout().setActiveItem('panelMySettings');
                    }
                },{
                    text:'Logout',
                    iconCls		: 'icoArrow',
                    handler: function(){
                        Ext.Msg.show({
                            title: 'Please confirm...',
                            icon: Ext.MessageBox.QUESTION,
                            msg:'Are you sure to quit MitosEHR?',
                            buttons: Ext.Msg.YESNO,
                            fn:function(btn){
                                if(btn=='yes'){ window.location = "lib/authProcedures/unauth.inc.php"; }
                            }
                        });
                    }
                }]
            }]
        }); // End Header
        /**
         * MainPanel is where all the pages are display
         */
        me.MainPanel = Ext.create('Ext.container.Container', {
            region			: 'center',
            layout          : 'card',
            border			: true,
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
        }); // End MainApp
        // *************************************************************************************
        // Footer Panel
        // *************************************************************************************
        me.Footer = Ext.create('Ext.container.Container', {
            height      : 30,
            split       : false,
            padding     : '3 0',
            region      : 'south',
            items       : [{
                xtype: 'toolbar',
                dock: 'bottom',
                items: [{
                    text: 'Copyright (C) 2011 MitosEHR (Electronic Health Records) |:|  Open Source Software operating under GPLv3 ',
                    iconCls: 'icoGreen',
                    disabled:true,
                    handler : function(){
                        showMiframe('http://mitosehr.org/projects/mitosehr001');
                    }
                },'->',{
                    text: 'news',
                    handler: function(){
                        showMiframe('http://mitosehr.org/projects/mitosehr001/news');
                    }
                },'-',{
                    text: 'wiki',
                    handler: function(){
                        showMiframe('http://mitosehr.org/projects/mitosehr001/wiki');
                    }
                },'-',{
                    text: 'issues',
                    handler: function(){
                        showMiframe('http://mitosehr.org/projects/mitosehr001/issues');
                    }
                },'-',{
                    text: 'forums',
                    handler: function(){
                        showMiframe('http://mitosehr.org/projects/mitosehr001/boards');
                    }
                }]
            }]
        });

        me.layout    = { type:'border', padding:3 };
        me.defaults	 = { split:true };
        me.items     = [ me.Header, me.navColumn, me.MainPanel, me.Footer ];
        me.listeners = {
            afterrender:function(){
                Ext.get('mainapp-loading').remove();
                Ext.get('mainapp-loading-mask').fadeOut({remove:true});
            }
        };
        me.callParent(arguments);
    }, // end of initComponent

    msg: function(title, format){
        if(!this.msgCt){
            this.msgCt = Ext.core.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
        }
        this.msgCt.alignTo(document, 't-t');
        var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
        var m = Ext.core.DomHelper.append(this.msgCt, {html:'<div class="msg"><h3>' + title + '</h3><p>' + s + '</p></div>'}, true);

        m.slideIn('t').pause(3000).ghost('t', {remove:true});
    },

    getMitosApp:function(){
        return this;
    }

});