/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
Ext.onReady(function(){
    var win;
    var button = Ext.get('show-btn');

    button.on('click', function(){
        // create the window on the first click and reuse on subsequent clicks
        if(!win){
            win = new Ext.Window({
                applyTo: 'hello-win',
                layout: 'fit',
                width: 500,
                height: 300,
                x: 0,
                y: 200,
                closeAction: 'hide',
                plain: true,

                items: new Ext.TabPanel({
                    applyTo: 'hello-tabs',
                    autoTabs:true,
                    activeTab:0,
                    deferredRender:false,
                    border:false
                }),
                buttons: [{
                    text:'Submit',
                    disabled:true
                },{
                    text: 'Close',
                    handler: function(){
                        win.hide();
                    }
                }]
            });
        }

        win.show(this);


    });
});

Ext4.onReady(function() {
    var win4;
    if(!win4) {
        win4 = new Ext4.Window({
            width: 500,
            height: 300,
            minHeight: 200,
            minWidth: 300,
            maxHeight: 500,
            maxWidth: 700,
            x: 600,
            y: 200,
            maximizable: true,
            closeAction: 'hide',
            layout: {
                type: 'border',
                padding: 5
            },
            title: 'Hello Dialog',
            items: [{
                title: 'Navigation',
                collapsible: true,
                region: 'west',
                width: 200,
                html: 'Hello',
                split: true
            }, {
                title: 'TabPanel',
                region: 'center'
            }],
            resizable: {
                dynamic: true,
                listeners: {
                    resizedrag: function(resizer, width, height, e) {
                        resizer.target.setTitle(resizer.target.initialConfig.title + ' width: ' + width + ', height: ' + height);
                    }
                }
            },
            dockedItems: [
                {
                    dock: 'bottom',
                    xtype: 'toolbar',
                    items: [
                        { xtype: 'tbspacer' },
                        {
                            xtype   : 'button',
                            text    : 'Submit',
                            disabled: true
                        },
                        {
                            xtype: 'button',
                            text : 'Close'
                        }
                    ]
                }
            ]
        });
    }

    win4.show(this);
});