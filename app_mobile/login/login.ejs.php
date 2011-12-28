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
<link rel="stylesheet" href="lib/touch-2.0.0-pr3/resources/css/sencha-touch.css" type="text/css">
<script type="text/javascript" src="lib/touch-2.0.0-pr3/sencha-touch-all.js"></script>
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
            ],
            idProperty: 'site_id'
        });
        var storeSites = new Ext.data.Store({
            model: 'User',
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

        var formBase  = {
            //scroll: 'vertical',
            url             : 'lib/authProcedures/auth.inc.php',
            baseParams		: { auth:'true' },
            standardSubmit  : false,
            items: [{
                xtype: 'fieldset',
                title: 'MitosEHR Login Form',
                instructions: 'Please enter your login info.',
                defaults: {
                    required    : true,
                    labelAlign  : 'left',
                    labelWidth  : '40%'
                },
                items: [{
                    xtype           : 'textfield',
                    name            : 'authUser',
                    label           : 'Username',
                    clearIcon       : true,
                    autoCapitalize  : false
                },{
                    xtype           : 'passwordfield',
                    name            : 'authPass',
                    label           : 'Password',
                    clearIcon       : false
                },{
                    xtype: 'selectfield',
                    name: 'choiseSite',
                    label: 'Site',
                    typeAhead: true,
                    emptyText:'Select Site',
                    selectOnFocus:true,
                    id:'choiseSite',
                    //displayField:'site',
                    //valueField:'site_id',
                    //options: storeSites
                    options: [{text: 'default',  value: 'default'}]
                },
                    Ext.create('Ext.Button', {
                        text:'Login',
                        margin: '20 0',
                        ui  : 'confirm',
                        handler: function() {
                            if(formBase){
                                form.updateRecord(formBase, true);
                            }
                            form.submit({
                                waitMsg : {message:'Submitting', cls : 'demos-loading'}
                            });
                        }
                    }),
                    Ext.create('Ext.Button', {
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
                submit : function(form, result){
                    if (result.errors){
                        Ext.Msg.alert('Opps!',result.errors.reason , Ext.emptyFn);
                    } else {
                        window.location = 'index.php'
                    }
                    console.log('success', Ext.toArray(arguments));
                }
            }
        };
        if (Ext.os.deviceType == 'Phone') {
            Ext.apply(formBase, {
                xtype: 'formpanel',
                autoRender: true
            });

            Ext.Viewport.add(formBase);
        } else {
            Ext.apply(formBase, {
                autoRender   : true,
                modal        : true,
                hideOnMaskTap: false,
                height       : 505,
                width        : 480,
                centered     : true,
                fullscreen   : true
            });

            form = Ext.create('Ext.form.Panel', formBase);
            form.show();
        }
    }
});
</script>
</head>
<body></body>
</html>