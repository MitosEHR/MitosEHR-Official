Ext.define('Ext.mitos.panel.login.Login',{
    extend:'Ext.Viewport',
    initComponent:function(){
        var me = this;
        me.currSite = null;
        
        Ext.define("Sites", {extend: "Ext.data.Model", fields:
            [
            { type: 'int', name: 'site_id'},
            { type: 'string', name: 'site'}
            ]
        });
        me.storeSites = new Ext.data.Store({
            model: 'Sites',
            proxy: new Ext.data.AjaxProxy({
                url: 'app/login/component_data.ejs.php?task=sites',
                reader: {
                    type: 'json',
                    idProperty: 'site_id',
                    totalProperty: 'results',
                    root: 'row'
                }
            }),
            autoLoad: true
        });

        ////////////////////////////////////////////////////////////////////////////////////////
        // This will be set in the global settings page... for now lets set the first site
        me.storeSites.on('load',function(ds,records){
            me.currSite = records[0].data.site;
            me.formLogin.getComponent('choiseSite').setValue(me.currSite);
        });
        ////////////////////////////////////////////////////////////////////////////////////////

        /**
         * The Copyright Notice Window
         */
        me.winCopyright = Ext.create('widget.window', {
            id				: 'winCopyright',
            title			: 'MitosEHR Copyright Notice',
            bodyStyle		: 'background-color: #ffffff; padding: 5px;',
            autoLoad		: 'app/login/copyright_notice.html',
            closeAction		: 'hide',
            width			: 600,
            height			: 500,
            modal			: false,
            resizable		: true,
            draggable		: true,
            closable		: true,
            autoScroll		: true
        });

        /**
         * Form Layout [Login]
         */
        me.formLogin = Ext.create('Ext.form.FormPanel', {
            id				: 'formLogin',
            url				: 'lib/authProcedures/auth.inc.php',
            bodyStyle		:'background: #ffffff; padding:5px 5px 0',
            defaultType		: 'textfield',
            waitMsgTarget	: true,
            frame			: false,
            border			: false,
            baseParams		: { auth: 'true' },
            fieldDefaults	: { msgTarget: 'side', labelWidth: 300 },
            defaults		: { anchor: '100%' },
            items: [{
                xtype           : 'textfield',
                fieldLabel      : 'Username',
                blankText       : 'Enter your username',
                name            : 'authUser',
                itemId          : 'authUser',
                minLengthText   : 'Username must be at least 3 characters long.',
                minLength       : 3,
                maxLength       : 25,
                allowBlank      : false,
                validationEvent : false
            },{
                xtype           : 'textfield',
                blankText       : 'Enter your password',
                inputType       : 'password',
                name            : 'authPass',
                fieldLabel      : 'Password',
                minLengthText   : 'Password must be at least 4 characters long.',
                validationEvent : false,
                allowBlank      : false,
                minLength       : 4,
                maxLength       : 10,
                listeners:{
                    specialkey: function(field, e){
                        if (e.getKey() == e.ENTER) {
                           me.onSubmit();
                        }
                    }
                }
            },{
                xtype           : 'combobox',
                name            : 'choiseSite',
                itemId          : 'choiseSite',
                triggerAction   : 'all',
                displayField    : 'site',
                queryMode       : 'local',
                fieldLabel      : 'Site',
                store           : me.storeSites,
                forceSelect     : true,
                editable        : false,
                listeners:{
                    scope: me,
                    specialkey: function(field, e){
                        if (e.getKey() == e.ENTER) {
                            me.onSubmit();
                        }
                    },
                    select: me.onSiteSelect
                }
            }],
            buttons: [{
                text    : 'Login',
                name    : 'btn_login',
                scope   : me,
                handler : me.onSubmit
            },{
                text    : 'Reset',
                name    : 'btn_reset',
                handler : function() {
                    me.formLogin.getForm().reset();
                }
            }],
            listeners:{
                render: function(){
                     me.formLogin.getComponent('authUser').focus(true, 10);
                }
            }
        });

        /**
         * The Logon Window
         */
        me.winLogon = Ext.create('widget.window', {
            title			: 'MitosEHR Logon',
            width			: 495,
            height			: 290,
            closeAction		: 'hide',
            plain			: true,
            modal			: false,
            resizable		: false,
            draggable		: false,
            closable		: false,
            bodyStyle		: 'background: #ffffff;',
            items			: [{ xtype: 'box', width: 483, height: 135, html: '<img src="ui_app/logon_header.png" />'}, me.formLogin ]
        }).show(); // End winLogon

    },
    /**
     * Form Submit/Logon function
     */
    onSubmit:function(){
        this.formLogin.getForm().submit({
            method      : 'POST',
            waitTitle   : 'Connecting',
            waitMsg     : 'Sending credentials...',
            scope: this,
            success:function(){
                window.location = 'index.php';
            },
            failure:function(form, action){
                if(action.failureType == 'server'){
                    var obj = Ext.JSON.decode(action.response.responseText);
                    Ext.topAlert.msg('Login Failed!', obj.errors.reason);
                }else{
                    Ext.topAlert.msg('Warning!', 'Authentication server is unreachable : ' + action.response.responseText);
                }
                var form = this.formLogin.getForm();
                form.reset();
                var model = Ext.ModelManager.getModel('Sites'),
                newModel  = Ext.ModelManager.create({
                    choiseSite  : this.currSite
                }, model );
                form.loadRecord(newModel);
            }
        })
    },
    /**
     * gets the site combobox value and store it in currSite
     * @param combo
     * @param value
     */
    onSiteSelect:function(combo,value){
        this.currSite = value[0].data.site;
    }
}); // End App
