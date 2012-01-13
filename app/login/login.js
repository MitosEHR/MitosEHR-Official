Ext.define('Ext.mitos.panel.login.Login',{
    extend:'Ext.Viewport',
    initComponent:function(){
        var me = this;
        me.currSite = null;

        Ext.define("Sites", {
            extend: "Ext.data.Model",
            fields: [{
                type: 'int', name: 'site_id'
            },{
                type: 'string', name: 'site'
            }]
        });
        me.storeSites = Ext.create('Ext.data.Store',{
            model: 'Sites',
            proxy:{
                type: 'ajax',
                url: 'app/login/component_data.ejs.php?task=sites',
                reader: {
                    type: 'json',
                    idProperty: 'site_id',
                    totalProperty: 'results',
                    root: 'row'
                }
            },
            autoLoad: false
        });
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
            url				: 'app/login/data.php?task=auth',
            bodyStyle		: 'background: #ffffff; padding:5px 5px 0',
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
                validationEvent : false,
                listeners:{
                    scope       : me,
                    specialkey  : me.onEnter
                }
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
                    scope       : me,
                    specialkey  : me.onEnter
                }
            },{
                xtype           : 'combobox',
                name            : 'choiseSite',
                itemId          : 'choiseSite',
                displayField    : 'site',
                valueField      : 'site',
                queryMode       : 'local',
                fieldLabel      : 'Site',
                store           : me.storeSites,
                allowBlank      : false,
                editable        : false,
                listeners:{
                    scope       : me,
                    specialkey  : me.onEnter,
                    select      : me.onSiteSelect
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
                scope   : me,
                handler : me.onFormReset
            }]
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
            items			: [{ xtype: 'box', width: 483, height: 135, html: '<img src="ui_app/logon_header.png" />'}, me.formLogin ],
            listeners:{
                scope:me,
                afterrender:me.onAfterrender
            }
        }).show();
    },
    /**
     * when keyboard ENTER key press
     * @param field
     * @param e
     */
    onEnter:function(field, e){
        if (e.getKey() == e.ENTER) {
           this.onSubmit();
        }
    },
    /**
     * Form Submit/Logon function
     */
    onSubmit:function(){
        var form = this.formLogin.getForm();
        if(form.isValid()){
            form.submit({
                method      : 'POST',
                waitTitle   : 'Connecting',
                waitMsg     : 'Sending credentials...',
                scope: this,
                success:function(){
                    window.location = './';
                },
                failure:function(form, action){
                    if(action.failureType == 'server'){
                        var obj = Ext.JSON.decode(action.response.responseText);
                        this.msg('Login Failed!', obj.errors.reason);
                    }else{
                        this.msg('Warning!', 'Authentication server is unreachable : ' + action.response.responseText);
                    }
                    this.onFormReset();
                }
            })
        }else{
            this.msg('Oops!', 'Username And Password are required.');
        }
    },
    /**
     * gets the site combobox value and store it in currSite
     * @param combo
     * @param value
     */
    onSiteSelect:function(combo,value){
        this.currSite = value[0].data.site;
    },
    /**
     * form rest function
     */
    onFormReset:function(){
        var form = this.formLogin.getForm();
        form.reset();
        var model = Ext.ModelManager.getModel('Sites'),
        newModel  = Ext.ModelManager.create({
            choiseSite  : this.currSite
        }, model );
        form.loadRecord(newModel);
        this.formLogin.getComponent('authUser').focus();
    },
    /**
     * After form is render load store
     */
    onAfterrender:function(){
        this.storeSites.load({
            scope   :this,
            callback:function(records,operation,success){
                if(success === true){
                    /**
                     * Lets add a delay to make sure the page is fully render.
                     * This is to compensate for slow browser.
                     */
                    Ext.Function.defer(function(){
                        this.currSite = records[0].data.site;
                        this.formLogin.getComponent('choiseSite').setValue(this.currSite);
                        this.formLogin.getComponent('authUser').focus();
                    },100,this);

                }else{
                    this.msg('Opps! Something went wrong...',  'No site found.');
                }
            }
        });

    },
    /**
     *  animated msg alert
     * @param title
     * @param format
     */
    msg:function(title, format){
        if(!this.msgCt){
            this.msgCt = Ext.core.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
        }
        this.msgCt.alignTo(document, 't-t');
        var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
        var m = Ext.core.DomHelper.append(this.msgCt, {html:'<div class="msg"><h3>' + title + '</h3><p>' + s + '</p></div>'}, true);

        m.slideIn('t').pause(3000).ghost('t', {remove:true});
    }
});