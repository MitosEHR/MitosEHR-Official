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
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    icon: 'icon.png',
    glossOnIcon: false,
    onReady: function() {
        var loginForm = new Ext.form.FormPanel({
            dockedItems:[{
                xtype   : 'toolbar',
                title   : 'Login Form',
                ui      : 'light'
            }],
            items: [{
                xtype   : 'fieldset',
                id      : 'loginFormSet',
                title   : '',
                items: [{
                    xtype       : 'emailfield',
                    placeHolder : 'Username',
                    name        : 'Username',
                    id          : 'Username',
                    required    : true
                },{
                    xtype       : 'passwordfield',
                    placeHolder : 'Password',
                    name        : 'Password',
                    required    : true

                },{
                    xtype       : 'button',
                    text        : 'Login',
                    ui          : 'confirm',
                    style       : 'margin:2%;',
                    handler: function() {
                        doLogin();
                    }
                }]
            }]
        });
    }
}); // End App
</script>
</head>
<body></body>
</html>