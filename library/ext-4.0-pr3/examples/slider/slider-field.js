Ext.require([
    'Ext.slider.*', 
    'Ext.form.*',
    'Ext.window.MessageBoxWindow'
]);

Ext.onReady(function(){
    Ext.createWidget('form', {
        width: 400,
        height: 160,
        title: 'Sound Settings',
        bodyStyle: 'padding: 10px;',
        renderTo: 'container',
        defaultType: 'sliderfield',
        buttonAlign: 'left',
        defaults: {
            anchor: '95%',
            tipText: function(thumb){
                return String(thumb.value) + '%';
            } 
        },
        items: [{
            fieldLabel: 'Sound Effects',
            value: 50,
            name: 'fx'
        },{
            fieldLabel: 'Ambient Sounds',
            value: 80,
            name: 'ambient'
        },{
            fieldLabel: 'Interface Sounds',
            value: 25,
            name: 'iface'
        }],
        fbar: {
            xtype: 'toolbar',
            items: [{
                text: 'Max All',
                handler: function(){
                    this.up('form').items.each(function(c){
                        c.setValue(100);
                    });
                }
            }, '->', {
                text: 'Save',
                handler: function(){
                    var values = this.up('form').getForm().getValues(),
                        s = ['Sounds Effects: <b>{0}%</b>',
                            'Ambient Sounds: <b>{1}%</b>',
                            'Interface Sounds: <b>{2}%</b>'];
                    
                    Ext.Msg.alert({
                        title: 'Settings Saved',
                        msg: Ext.String.format(s.join('<br />'), values.fx, values.ambient, values.iface),
                        icon: Ext.Msg.INFO,
                        buttons: Ext.Msg.OK
                    }); 
                }
            },{
                text: 'Reset',
                handler: function(){
                    this.up('form').getForm().reset();
                }
            }]
        }
    });
});
