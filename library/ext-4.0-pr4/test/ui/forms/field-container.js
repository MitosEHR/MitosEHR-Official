Ext.require([
    'Ext.form.*',
    'Ext.data.*',
    'Ext.grid.GridPanel',
    'Ext.resizer.Splitter'
]);

Ext.onReady(function() {

    Ext.create('Ext.form.FormPanel', {
        renderTo: Ext.getBody(),
        title: 'FieldContainer Examples',
        width: 600,
        bodyPadding: 10,

        fieldDefaults: {
            labelWidth: 170
        },

        defaults: {
            anchor: '100%'
        },

        items: [{
            fieldLabel: 'Normal Field',
            xtype: 'textfield',
            value: "I'm a text field!"
        }, {
            fieldLabel: 'FieldContainer with a Panel',
            xtype: 'fieldcontainer',
            items: [{
                xtype: 'panel',
                title: "I'm a Panel!",
                height: 50
            }]
        }, {
            fieldLabel: 'Multiple Panels, HBox Layout',
            xtype: 'fieldcontainer',
            layout: 'hbox',
            defaults: {
                height: 50
            },
            items: [{
                xtype: 'panel',
                flex: 1,
                title: 'Panel 1'
            }, {
                xtype: 'splitter'
            }, {
                xtype: 'panel',
                flex: 1,
                title: 'Panel 2'
            }, {
                xtype: 'splitter'
            }, {
                xtype: 'panel',
                flex: 1,
                title: 'Panel 3'
            }]
        }, {
            fieldLabel: 'Grid',
            xtype: 'fieldcontainer',
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items: [{
                xtype: 'gridpanel',
                store: Ext.create('Ext.data.ArrayStore', {
                    fields: [
                       {name: 'company'},
                       {name: 'price',      type: 'float'},
                       {name: 'change',     type: 'float'},
                       {name: 'pctChange',  type: 'float'},
                       {name: 'lastChange', type: 'date', dateFormat: 'n/j h:ia'}
                    ],
                    data: [
                        ['3m Co',                               71.72, 0.02,  0.03,  '9/1 12:00am'],
                        ['Alcoa Inc',                           29.01, 0.42,  1.47,  '9/1 12:00am'],
                        ['Altria Group Inc',                    83.81, 0.28,  0.34,  '9/1 12:00am'],
                        ['American Express Company',            52.55, 0.01,  0.02,  '9/1 12:00am'],
                        ['American International Group, Inc.',  64.13, 0.31,  0.49,  '9/1 12:00am'],
                        ['AT&T Inc.',                           31.61, -0.48, -1.54, '9/1 12:00am'],
                        ['Boeing Co.',                          75.43, 0.53,  0.71,  '9/1 12:00am'],
                        ['Caterpillar Inc.',                    67.27, 0.92,  1.39,  '9/1 12:00am'],
                        ['Citigroup, Inc.',                     49.37, 0.02,  0.04,  '9/1 12:00am'],
                        ['E.I. du Pont de Nemours and Company', 40.48, 0.51,  1.28,  '9/1 12:00am'],
                        ['Exxon Mobil Corp',                    68.1,  -0.43, -0.64, '9/1 12:00am'],
                        ['General Electric Company',            34.14, -0.08, -0.23, '9/1 12:00am'],
                        ['General Motors Corporation',          30.27, 1.09,  3.74,  '9/1 12:00am'],
                        ['Hewlett-Packard Co.',                 36.53, -0.03, -0.08, '9/1 12:00am']
                    ]
                }),
                columnLines: true,
                headers: [
                    {
                        id       :'company',
                        text   : 'Company',
                        flex: 1,
                        sortable : true,
                        dataIndex: 'company'
                    },
                    {
                        text   : 'Price',
                        width    : 75,
                        sortable : true,
                        dataIndex: 'price'
                    },
                    {
                        text   : 'Change',
                        width    : 75,
                        sortable : true,
                        dataIndex: 'change'
                    },
                    {
                        text   : 'Last Updated',
                        width    : 85,
                        sortable : true,
                        renderer : Ext.util.Format.dateRenderer('m/d/Y'), 
                        dataIndex: 'lastChange'
                    }
                ],
                stripeRows: true,
                height: 150
            }]
        }, {
            fieldLabel: 'Using fieldDefaults',
            xtype: 'fieldcontainer',
            fieldDefaults: {
                labelAlign: 'top',
                msgTarget: 'under'
            },
            items: [{
                xtype: 'panel',
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                bodyPadding: 5,
                defaultType: 'textfield',
                items: [{
                    fieldLabel: 'Field 1',
                    allowBlank: false
                }, {
                    fieldLabel: 'Field 2',
                    allowBlank: false,
                    msgTarget: 'side'
                }]
            }]
        }, {
            fieldLabel: 'Error message display',
            xtype: 'fieldcontainer',
            msgTarget: 'side',
            autoFitErrors: true,
            items: [{
                xtype: 'panel',
                bodyPadding: 10,
                html: 'The buttons below will toggle an error message on this FieldContainer, even though it contains ' +
                        'no actual fields itself. It is configured with <code>msgTarget:"side"</code> and ' +
                        '<code>autoFitErrors:true</code>, so the contents of the FieldContainer will be resized to fit the icon.',
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: ['->', {
                        xtype: 'button',
                        width: 75,
                        text: 'Mark Invalid',
                        handler: function() {
                            var ct = this.up('fieldcontainer');
                            ct.setActiveError('This FieldContainer is now in error state.');
                            ct.doComponentLayout();
                        }
                    }, {
                        xtype: 'button',
                        width: 75,
                        text: 'Mark Valid',
                        handler: function() {
                            var ct = this.up('fieldcontainer');
                            ct.unsetActiveError();
                            ct.doComponentLayout();
                        }
                    }]
                }]
            }]
        }, {
            fieldLabel: 'Using combineErrors',
            xtype: 'fieldcontainer',
            msgTarget: 'side',
            combineErrors: true,
            items: [{
                xtype: 'panel',
                bodyPadding: 5,
                defaultType: 'textfield',
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [{
                    xtype: 'component',
                    width: 372,
                    anchor: '',
                    margin: '0 0 10px',
                    html: 'This FieldContainer has combineErrors:true, so the validation errors for all its sub-fields ' +
                          'will be rolled up into a single combined message.'
                }, {
                    fieldLabel: 'Name',
                    allowBlank: false
                }, {
                    fieldLabel: 'Email',
                    vtype: 'email',
                    allowBlank: false
                }, {
                    fieldLabel: 'Website',
                    vtype: 'url',
                    allowBlank: false
                }],
                buttons: [{
                    text: 'Validate',
                    handler: function() {
                        Ext.Array.forEach(this.up('fieldcontainer').query('[isFormField]'), function(field) {
                            field.validate();
                        });
                    }
                }, {
                    text: 'Reset',
                    handler: function() {
                        Ext.Array.forEach(this.up('fieldcontainer').query('[isFormField]'), function(field) {
                            field.reset();
                        });
                    }
                }]
            }]
        }, {
            xtype: 'fieldcontainer',
            combineLabels: true,
            defaultType: 'textfield',
            items: [{
                xtype: 'panel',
                bodyPadding: 5,
                defaultType: 'textfield',
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [{
                    xtype: 'component',
                    margin: '0 0 10px',
                    html: 'This FieldContainer has combineLabels:true, so its label is automatically ' +
                          'generated by combining the labels of its sub-fields.'
                }, {
                    fieldLabel: 'Name'
                }, {
                    fieldLabel: 'Email'
                }, {
                    fieldLabel: 'Website'
                }]
            }]
        }]

    });

});