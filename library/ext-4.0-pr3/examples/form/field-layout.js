Ext.require([
    'Ext.form.*',
    'Ext.layout.container.Anchor'
]);

Ext.onReady(function(){

    var fieldNum = 1;

    function label(str) {
        return 'Field ' + fieldNum++ + ' - ' + str;
    }


    function createItemsCfg(labelAlign) {
        var externalId1 = Ext.id(),
            externalId2 = Ext.id();

        var items =  [{
            fieldLabel: label('Plain No Errors'),
            xtype: 'textfield'
        }, {
            fieldLabel: label('Qtip Error'),
            value: '',
            xtype: 'textfield',
            msgTarget: 'qtip',
            allowBlank: false
        }, {
            fieldLabel: label('Title Error'),
            value: '',
            xtype: 'textfield',
            msgTarget: 'title',
            allowBlank: false
        }, {
            fieldLabel: label('Side Error'),
            value: '',
            xtype: 'textfield',
            msgTarget: 'side',
            allowBlank: false
        }, {
            fieldLabel: label('Side Error, !autoFitErrors'),
            value: '',
            xtype: 'textfield',
            msgTarget: 'side',
            allowBlank: false,
            autoFitErrors: false,
            anchor: '-18',
            labelPad: 5
        }, {
            fieldLabel: label('Under Error'),
            value: '',
            xtype: 'textfield',
            msgTarget: 'under',
            allowBlank: false
        }, {
            fieldLabel: label('External Element Error'),
            value: '',
            xtype: 'textfield',
            msgTarget: externalId2,
            allowBlank: false
        }, {
            fieldLabel: label('Fixed Height, Side Error'),
            value: '',
            xtype: 'textareafield',
            msgTarget: 'side',
            allowBlank: false,
            height: 75
        }, {
            fieldLabel: label('Fixed Height, Under Error'),
            value: '',
            xtype: 'textareafield',
            msgTarget: 'under',
            allowBlank: false,
            height: 75
        }, {
            fieldLabel: label('Fixed Height, Side Error, !autoFitErrors'),
            value: '',
            xtype: 'textareafield',
            msgTarget: 'side',
            allowBlank: false,
            height: 75,
            autoFitErrors: false,
            anchor: '-18',
            labelPad: 5
        }, {
            fieldLabel: label('Fixed Height, Under Error, !autoFitErrors'),
            value: '',
            xtype: 'textareafield',
            msgTarget: 'under',
            allowBlank: false,
            height: 75,
            style: 'margin:0 0 24px;',
            autoFitErrors: false
        }, {
            fieldLabel: label('Trigger field, Side Error'),
            xtype: 'triggerfield',
            allowBlank: false,
            value: '',
            msgTarget: 'side'
        }, {
            fieldLabel: label('Trigger field, Side Error, !autoFitErrors'),
            xtype: 'triggerfield',
            allowBlank: false,
            value: '',
            msgTarget: 'side',
            autoFitErrors: false,
            anchor: '-18',
            labelPad: 5
        }, {
            fieldLabel: label('Trigger field, Under Error'),
            xtype: 'triggerfield',
            allowBlank: false,
            value: '',
            msgTarget: 'under'
        }, {
            fieldLabel: label('Checkbox'),
            xtype: 'checkboxfield'
        }];

        // Create a bucket in the external messages area for each field configured with msgTarget:[element id]
        Ext.iterate(items, function(cfg) {
            if (cfg.msgTarget && cfg.msgTarget.indexOf('ext-gen') === 0) {
                Ext.fly('externalErrors').createChild({children: [
                    {tag: 'span', cls: 'label', html: cfg.fieldLabel.replace(/\s-.*/, ': ')},
                    {tag: 'span', cls: 'msg', id: cfg.msgTarget}
                ]});
            }
        });

        return items;
    }




    var buttonsCfg = [{
        text: 'Validate All',
        handler: function() {
            this.up('panel').getForm().getFields().each(function(field) {
                field.validate();
            });
        }
    }, {
        text: 'Reset All',
        handler: function() {
            this.up('panel').getForm().reset();
        }
    }];


    // Labels aligned left (default)
    Ext.create('Ext.form.FormPanel', {
        title    : 'Labels Aligned Left',
        renderTo : Ext.getBody(),
        bodyPadding: '5px 5px 0',
        margin: '0 0 20px',
        width    : 600,

        fieldDefaults: {
            labelWidth: 230,
            anchor    : '100%'
        },
        items: createItemsCfg('left'),

        buttons: buttonsCfg
    });

    // Labels aligned top
    Ext.create('Ext.form.FormPanel', {
        title    : 'Labels Aligned Top',
        renderTo : Ext.getBody(),
        bodyPadding: '5px 5px 0',
        margin: '0 0 20px',
        width    : 600,

        fieldDefaults: {
            labelAlign: 'top',
            anchor    : '100%'
        },
        items: createItemsCfg('top'),

        buttons: buttonsCfg
    });

    // Labels aligned right
    Ext.create('Ext.form.FormPanel', {
        title    : 'Labels Aligned Right',
        renderTo : Ext.getBody(),
        bodyPadding: '5px 5px 0',
        margin: '0 0 20px',
        width    : 600,

        fieldDefaults: {
            labelAlign: 'right',
            labelWidth: 230,
            anchor    : '100%'
        },
        items: createItemsCfg('right'),

        buttons: buttonsCfg
    });

    // Labels hidden
    Ext.create('Ext.form.FormPanel', {
        title    : 'Labels Hidden',
        renderTo : Ext.getBody(),
        bodyPadding: '5px 5px 0',
        margin: '0 0 20px',
        width    : 600,

        fieldDefaults: {
            hideLabel: true,
            anchor    : '100%'
        },
        items: createItemsCfg('left'),

        buttons: buttonsCfg
    });


});
