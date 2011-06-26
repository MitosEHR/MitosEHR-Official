<?php
if(!defined('_MitosEXEC')) die('No direct access allowed.');

/* Main Screen Application
 *
 * Description: This is the main application, with all the panels
 * also this is the viewport of the application, this will call 
 * all the app->screen panels
 *
 * version 0.0.3
 * revision: N/A
 * author: GI Technologies, 2011
 * 
 */
// Reset session count
$_SESSION['site']['flops'] = 0;
/*
 * Include the necessary libraries, so the web application
 * can work.
 */
include_once($_SESSION['site']['root'].'/lib/compressor/compressor.inc.php');
include_once($_SESSION['site']['root'].'/classes/dbHelper.class.php');
include_once($_SESSION['site']['root'].'/repo/global_settings/global_settings.php');
include_once($_SESSION['site']['root'].'/repo/global_functions/global_functions.php');
?>
<html>
<head>
<title><?php echo $_SESSION['global_settings']['mitosehr_name'] ?></title>
<link rel="stylesheet" href="lib/touch-1.1.0/resources/css/sencha-touch.css" type="text/css">
<script type="text/javascript" src="lib/touch-1.1.0/sencha-touch-debug.js"></script>
<link rel="shortcut icon" href="favicon.ico" >
<script type="text/javascript">
// *************************************************************************************
// Start MitosEHR Mobile App
// *************************************************************************************
Ext.regModel('File', {
    idProperty: 'id',
    fields: [
        {name: 'id',       type: 'string'},
        {name: 'fileName', type: 'string'}
    ]
});


Ext.setup({
    icon: 'icon.png',
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    glossOnIcon: false,
    onReady: function(){

        var store = new Ext.data.TreeStore({
            model: 'File',
            proxy: {
                type: 'ajax',
                url: 'lib/touch-1.1.0/examples/nestedlist/getSourceFiles.php',
                reader: {
                    type: 'tree',
                    root: 'children'
                }
            }
        });


        var nestedList = new Ext.NestedList({
            fullscreen: true,
            title: 'MitosEHR',
            displayField: 'fileName',
            // add a / for folder nodes in title/back button
            getTitleTextTpl: function() {
                return '{' + this.displayField + '}<tpl if="leaf !== true">/</tpl>';
            },
            // add a / for folder nodes in the list
            getItemTextTpl: function() {
                return '{' + this.displayField + '}<tpl if="leaf !== true">/</tpl>';
            },
            // provide a codebox for each source file
            getDetailCard: function(record, parentRecord) {
                return new Ext.ux.CodeBox({
                    value: 'Loading...',
                    scroll: {
                        direction: 'both',
                        eventTarget: 'parent'
                    }
                });
            },
            store: store,
            dockedItems:[{
                xtype: 'toolbar',
                dock: 'bottom',
                items:[{
                    text:'Logout',
                    ui: 'round',
                    handler: function() {
                        Ext.Msg.confirm("<?php i18n("Please confirm..."); ?>", "<?php i18n("Are you sure to quit MitosEHR?"); ?>",
                            function(btn,msgGrid){
								if(btn=='yes'){
                                    document.location = "lib/authProcedures/unauth.inc.php";
                                }
                            }
                        )
                    }
                }]
            }]
        });


        nestedList.on('leafitemtap', function(subList, subIdx, el, e, detailCard) {
            var ds = subList.getStore(),
                r  = ds.getAt(subIdx);

            Ext.Ajax.request({
                url: '../../src/' + r.get('id'),
                success: function(response) {
                    detailCard.setValue(response.responseText);
				    document.location = 'index.php';
                },
                failure: function() {
                    detailCard.setValue("Loading failed.");
                }
            });
        });
    }
});
</script>
</head>
<body><span id="app-msg" style="display:none;"></span></body>
</html>