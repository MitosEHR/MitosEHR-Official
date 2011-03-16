
// TODO: Action.addComponent/removeComponent are not currently called by components
// TODO: Ext.Msg does not yet exist
// TODO: Icon button layout issue

Ext.onReady(function(){
    // The action, shared by multiple components below
    var action = Ext.create('Ext.Action', {
        text: 'Action 1',
        handler: function(){
            Ext.example.msg('Click','You clicked on "Action 1".');
        },
        iconCls: 'blist'
    });
    
    var panel = Ext.create('Ext.Panel', {
        title: 'Actions',
        width:600,
        height:300,
        bodyStyle: 'padding:10px;',     // lazy inline style

        tbar: [
            action, {                   // <-- Add the action directly to a toolbar
                text: 'Action Menu',
                menu: [action]          // <-- Add the action directly to a menu
            }
        ],

        items: [
           Ext.create('Ext.Button', action)      // <-- Add the action as a button
        ],

        renderTo: Ext.getBody()
    });

    var tb = panel.getTopToolbar();
    
    // Buttons added to the toolbar of the Panel above
    // to test/demo doing group operations with an action
    tb.add('->', {
        text: 'Disable',
        handler: function(){
            action.setDisabled(!action.isDisabled());
            this.setText(action.isDisabled() ? 'Enable' : 'Disable');
        }
    }, {
        text: 'Change Text',
        handler: function(){
            Ext.Msg.prompt('Enter Text', 'Enter new text for Action 1:', function(btn, text){
                if(btn == 'ok' && text){
                    action.setText(text);
                    action.setHandler(function(){
                        Ext.example.msg('Click','You clicked on "'+text+'".');
                    });
                }
            });
        }
    }, {
        text: 'Change Icon',
        handler: function(){
            action.setIconClass(action.getIconClass() == 'blist' ? 'bmenu' : 'blist');
        }
    });
    tb.doLayout();
});