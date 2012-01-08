Ext.define('Kitchensink.view.Forms', {
    extend: 'Ext.tab.Panel',

    requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'Ext.field.Number',
        'Ext.field.Spinner',
        'Ext.field.Password',
        'Ext.field.Email',
        'Ext.field.Url',
        'Ext.field.DatePicker',
        'Ext.field.Select',
        'Ext.field.Hidden',
        'Ext.field.Radio',
        'Ext.field.Slider',
        'Ext.field.Toggle',
        'Ext.field.Search'
    ],

    config: {
        activeItem    : 0,
        tabBarPosition: 'top',
        tabBar: {
            layout: {
                pack: 'left'
            }
        },
        items: [
            {
                title: 'Basic',
                xtype: 'formpanel',
                id   : 'basicform',
                layout: {
                    type : 'vbox',
                    align: 'stretch'
                },
                items: [
                    {
                        xtype: 'fieldset',
                        title: 'Personal Info',
                        instructions: 'Please enter the information above.',
                        defaults: {
                            labelWidth: '35%'
                        },
                        items: [
                            {
                                xtype         : 'textfield',
                                name          : 'name',
                                label         : 'Name',
                                placeHolder   : 'Tom Roy',
                                autoCapitalize: true,
                                required      : true,
                                clearIcon     : true
                            },
                            {
                                xtype: 'passwordfield',
                                name : 'password',
                                label: 'Password'
                            },
                            {
                                xtype      : 'emailfield',
                                name       : 'email',
                                label      : 'Email',
                                placeHolder: 'me@sencha.com',
                                clearIcon  : true
                            },
                            {
                                xtype      : 'urlfield',
                                name       : 'url',
                                label      : 'Url',
                                placeHolder: 'http://sencha.com',
                                clearIcon  : true
                            },
                            {
                                xtype: 'checkboxfield',
                                name : 'cool',
                                label: 'Cool'
                            },
                            {
                                xtype: 'datepickerfield',
                                name : 'date',
                                label: 'Start Date',
                                value: new Date(),
                                picker: {
                                    yearFrom: 1990
                                }
                            },
                            {
                                xtype: 'selectfield',
                                name : 'rank',
                                label: 'Rank',
                                options: [
                                    {
                                        text : 'Master',
                                        value: 'master'
                                    },
                                    {
                                        text : 'Journeyman',
                                        value: 'journeyman'
                                    },
                                    {
                                        text : 'Apprentice',
                                        value: 'apprentice'
                                    }
                                ]
                            },
                            {
                                xtype: 'textareafield',
                                name : 'bio',
                                label: 'Bio'
                            }
                        ]
                    },
                    {
                        xtype: 'fieldset',
                        title: 'Favorite color',
                        defaults: {
                            xtype     : 'radiofield',
                            labelWidth: '35%'
                        },
                        items: [
                            {
                                name : 'color',
                                value: 'red',
                                label: 'Red'
                            },
                            {
                                name : 'color',
                                label: 'Blue',
                                value: 'blue'
                            },
                            {
                                name : 'color',
                                label: 'Green',
                                value: 'green'
                            },
                            {
                                name : 'color',
                                label: 'Purple',
                                value: 'purple'
                            }
                        ]
                    },
                    {
                        xtype: 'panel',
                        defaults: {
                            xtype: 'button',
                            style: 'margin: 0.1em',
                            flex : 1
                        },
                        layout: {
                            type: 'hbox'
                        },
                        items: [
                            {
                                text: 'Disable fields',
                                scope: this,
                                hasDisabled: false,
                                handler: function(btn){
                                    var form = Ext.getCmp('basicform');

                                    if (btn.hasDisabled) {
                                        form.enable();
                                        btn.hasDisabled = false;
                                        btn.setText('Disable fields');
                                    } else {
                                        form.disable();
                                        btn.hasDisabled = true;
                                        btn.setText('Enable fields');
                                    }
                                }
                            },
                            {
                                text: 'Reset',
                                handler: function(){
                                    Ext.getCmp('basicform').reset();
                                }
                            }
                        ]
                    }
                ]
            },

            {
                title: 'Sliders',
                xtype: 'formpanel',
                layout: {
                    type : 'vbox',
                    align: 'stretch'
                },
                items: [
                    {
                        xtype: 'fieldset',
                        defaults: {
                            labelWidth: '35%',
                            labelAlign: 'top'
                        },
                        items: [
                            {
                                xtype: 'sliderfield',
                                label: 'Single Thumb'
                            },
                            {
                                xtype: 'sliderfield',
                                label: 'Multiple Thumbs',
                                values: [10, 70]
                            },
                            {
                                xtype: 'togglefield',
                                label: 'Toggle'
                            }
                        ]
                    }
                ]
            },

            {
                title: 'Toolbars',
                xtype: 'panel',
                items: [
                    {
                        styleHtmlContent: true
                    },
                    {
                        docked: 'top',
                        xtype: 'toolbar',
                        items: [
                            {
                                xtype      : 'searchfield',
                                placeHolder: 'Search',
                                name       : 'searchfield'
                            }
                        ]
                    },
                    {
                        docked: 'top',
                        xtype: 'toolbar',
                        items: [
                            {
                                xtype      : 'textfield',
                                placeHolder: 'Text',
                                name       : 'searchfield'
                            }
                        ]
                    },
                    {
                        docked: 'top',
                        xtype: 'toolbar',
                        items: [
                            {
                                xtype: 'selectfield',
                                name : 'options',
                                options: [
                                    {text: 'This is just a big select',  value: '1'},
                                    {text: 'Another select item', value: '2'}
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
});
