<?php
if(!defined('_MitosEXEC')) die('No direct access allowed.');

/* Logon Screen Window for mobiles
 * Description: Obviously the Logon Window. I think every WebApp has one.
 *
 * author: Ernesto J. Rodriguez
 * Version 0.0.1
 * Revision: N/A
 */

?>
<html>
<head>
<title>MitosEHR Logon Screen</title>
<link rel="stylesheet" href="lib/touch-1.1.0/resources/css/sencha-touch.css" type="text/css">
<script type="text/javascript" src="lib/touch-1.1.0/sencha-touch-debug.js"></script>
<script type="text/javascript">
Ext.setup({
    icon: 'icon.png',
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    glossOnIcon: false,
    onReady: function() {
        var form;

        Ext.regModel('User', {
            fields: [
                { type: 'int', name: 'site_id', mapping: 'value'},
                { type: 'string', name: 'site', mapping: 'text'}
            ]
        });
        var storeSites = new Ext.data.Store({
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
        }); // End storeLang

        ////////////////////////////////////////////////////////////////////////////////////////
        // This will be set in the global settings page... for now lets set the first site    //
        storeSites.on('load',function(ds,records,o){                                          //
            Ext.getCmp('choiseSite').setValue(records[0].data.site);                          //
        });                                                                                   //
        ////////////////////////////////////////////////////////////////////////////////////////

        var formLogin = {
            scroll: 'vertical',
            url   : 'lib/authProcedures/auth.inc.php',
            baseParams		: {auth: 'true'},
            standardSubmit : false,
            items: [{
                xtype: 'fieldset',
                title: 'MitosEHR Login Form',
                instructions: 'Please enter your login info.',
                defaults: {
                    required: true,
                    labelAlign: 'left',
                    labelWidth: '40%'
                },
                items: [{
                    xtype: 'textfield',
                    name: 'authUser',
                    label: 'Username',
                    useClearIcon: true,
                    autoCapitalize : false
                },{
                    xtype: 'passwordfield',
                    name: 'authPass',
                    label: 'Password',
                    useClearIcon: false
                },
                    new Ext.form.Select({
                        name: 'choiseSite',
                        label: 'Site',
                        typeAhead: true,
                        emptyText:'Select Site',
                        selectOnFocus:true,
                        id:'choiseSite',
                        //displayField:'site',
                        //valueField:'site_id',
                        //store: storeSites
                        options: [{text: 'default',  value: 'default'}]
                    }),
                    new Ext.Button({
                        text:'Login',
                        margin: '20 0',
                        ui  : 'confirm',
                        handler: function() {
                            if(formLogin.user){
                                form.updateRecord(formLogin.user, true);
                            }
                            form.submit({
                                waitMsg : {message:'Submitting', cls : 'demos-loading'}
                            });
                        }
                    }),
                    new Ext.Button({
                        text:'Reset',
                        margin: '20 0',
                        ui  : 'decline',
                        handler: function() {
                            form.reset();
                        }
                    })
                ]
            }],
            listeners : {
                success:function(){
                    var redirect = 'index.php';
                    window.location = redirect;
                },
                // Failed to logon
                failure:function(form, action){

                    formLogin.getForm().reset();
                }
            }
        };
        if (Ext.is.Phone) {
            formLogin.fullscreen = true;
        } else {
            Ext.apply(formLogin, {
                autoRender: true,
                floating: true,
                modal: true,
                centered: true,
                hideOnMaskTap: false
            });
        }

        form = new Ext.form.FormPanel(formLogin);
        form.show();
    }
});
</script>
</head>
<body></body>
</html>