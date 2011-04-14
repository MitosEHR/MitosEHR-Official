Ext.define('AM.view.user.Edit', {
    extend: 'Ext.window.Window',
    alias : 'widget.useredit',
    
    title : 'Edit User',
    layout: 'fit',
    autoShow: true,
    
    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                padding: '5 5 0 5',
                border: false,
                
                items: [
                    {
                        xtype: 'textfield',
                        name : 'name',
                        fieldLabel: 'Name'
                    },
                    {
                        xtype: 'textfield',
                        name : 'email',
                        fieldLabel: 'Email'
                    }
                ]
            }
        ];
        
        this.buttons = [
            {
                text: 'Save',
                action: 'save'
            },
            {
                text: 'Cancel',
                scope: this,
                handler: this.close
            }
        ];
        
        this.callParent(arguments);
    }
});