Ext.require([
    'Ext.window.Window',
    'Ext.panel.Panel',
    'Ext.toolbar.*',
    'Ext.container.Viewport',
    'Ext.form.*',
    'Ext.tab.*',
    'Ext.slider.*',
    'Ext.layout.*',
    'Ext.button.*',
    'Ext.grid.*',
    'Ext.data.*',
    'EXt.util.*'
]);

Ext.onReady(function() {
    var items = [];

    /**
     * Basic panel
     */
    items.push({
        xtype: 'panel',

        x: 50, y: 100,

        width : 150,
        height: 150,

        title: 'Basic Panel',

        bodyPadding: 5,
        html       : 'Some content',
        collapsible: true
    });

    /**
     * Masked Panel
     */
    items.push({
        xtype: 'panel',

        x: 210, y: 100,

        width : 150,
        height: 150,

        title: 'Masked Panel',

        bodyPadding: 5,
        html       : 'Some content',
        collapsible: true,

        listeners: {
            render: function(p) {
                p.body.mask('Loading...');
            },
            delay: 50
        }
    });

    /**
     * Framed Panel
     */
    items.push({
        xtype: 'panel',

        x: 370, y: 100,

        width : 150,
        height: 150,

        title: 'Framed Panel',

        html       : 'Some content',
        frame      : true,
        collapsible: true
    });

    /**
     * Basic Window
     */
    Ext.createWidget('window', {
        x: 530, y: 100,

        width   : 150,
        height  : 150,
        minWidth: 150,

        title: 'Window',

        bodyPadding: 5,
        html       : 'Click Submit for Confirmation Msg.',

        collapsible: true,
        closable   : false,
        draggable  : false,
        resizable: false,

        tbar: [
            {text: 'Toolbar'}
        ],
        buttons: [
            {
                text   : 'Submit',
                id     : 'message_box',
                handler: function() {
                    Ext.MessageBox.confirm('Confirm', 'Are you sure you want to do that?');
                }
            }
        ]
    }).show();

    /**
     * Toolbar with a menu
     */
    var menu = Ext.createWidget('menu', {
        items: [
            {text: 'Menu item'},
            {text: 'Check 1', checked: true},
            {text: 'Check 2', checked: false},
            '-',
            {text: 'Option 1', checked: true,  group: 'opts'},
            {text: 'Option 2', checked: false, group: 'opts'},
            '-',
            {
                text: 'Sub-items',
                menu: Ext.createWidget('menu', {
                    items: [
                        {text: 'Item 1'},
                        {text: 'Item 2'}
                    ]
                })
            }
        ]
    });

    items.push({
        xtype: 'panel',

        x: 690, y: 100,

        width : 450,
        height: 150,

        title: 'Basic Panel With Toolbars',

        tbar: [
            'Toolbar &amp; Menus',
            ' ',
            '-',
            {text: 'Button'},
            {
                text: 'Menu Button',
                id  : 'menu-btn',
                menu: menu
            },
            {
                xtype: 'splitbutton',
                text : 'Split Button',
                menu : Ext.createWidget('menu', {
                    items: [
                        {text: 'Item 1'},
                        {text: 'Item 2'}
                    ]
                })
            },
            {
                xtype       : 'button',
                enableToggle: true,
                pressed     : true,
                text        : 'Toggle Button'
            }
        ],
        bbar: [
            {text: 'Bottom Bar'}
        ]
    });

    /**
     * Form and form widgets
     */
    items.push({
        xtype: 'form',

        id   : 'form-widgets',
        title: 'Form Widgets',

        x: 50, y: 260,

        width : 630,
        height: 700,
        frame: true,

        tools: [
            {id:'toggle'},
            {id:'close'},
            {id:'minimize'},
            {id:'maximize'},
            {id:'restore'},
            {id:'gear'},
            {id:'pin'},
            {id:'unpin'},
            {id:'right'},
            {id:'left'},
            {id:'up'},
            {id:'down'},
            {id:'refresh'},
            {id:'minus'},
            {id:'plus'},
            {id:'help'},
            {id:'search'},
            {id:'save'},
            {id:'print'}
        ],

        bodyPadding: '10 20',

        defaults: {
            anchor    : '98%',
            msgTarget : 'side',
            allowBlank: false
        },

        items: [
            {
                xtype: 'label',
                text : 'Plain Label'
            },
            {
                fieldLabel: 'TextField',
                xtype     : 'textfield',
                name      : 'someField',
                emptyText : 'Enter a value',
                itemCls   : 'x-form-required'
            },
            // {
            //     fieldLabel: 'ComboBox',
            //     xtype: 'combo',
            //     store: ['Foo', 'Bar'],
            //     itemCls: 'x-form-required'
            // },
            {
                fieldLabel: 'DateField',
                xtype     : 'datefield',
                name      : 'date',
                itemCls   : 'x-form-required'
            },
            // {
            //     fieldLabel: 'TimeField',
            //     name: 'time',
            //     itemCls: 'x-form-required',
            //     xtype: 'textfield'
            // },
            // {
            //     fieldLabel: 'NumberField',
            //     xtype     : 'numberfield',
            //     name      : 'number',
            //     emptyText : '(This field is optional)',
            //     allowBlank: true
            // },
            {
                fieldLabel: 'TextArea',
                xtype     : 'textareafield',
                itemCls   : 'x-form-required',
                name      : 'message',
                cls       : 'x-form-valid',
                value     : 'This field is hard-coded to have the "valid" style (it will require some code changes to add/remove this style dynamically)'
            },
            {
                fieldLabel: 'Checkboxes',
                xtype: 'checkboxgroup',
                columns: [100,100],
                items: [{boxLabel: 'Foo', checked: true},{boxLabel: 'Bar'}]
            },
            {
                fieldLabel: 'Radios',
                xtype: 'radiogroup',
                columns: [100,100],
                items: [{boxLabel: 'Foo', checked: true, name: 'radios'},{boxLabel: 'Bar', name: 'radios'}]
            },
            {
                hideLabel   : true,
                id          : 'htmleditor',
                xtype       : 'htmleditor',
                name        : 'html',
                enableColors: false,
                value       : 'Mouse over toolbar for tooltips.<br /><br />The HTMLEditor IFrame requires a refresh between a stylesheet switch to get accurate colors.',
                height      : 110
            },
            {
                xtype : 'fieldset',
                title : 'Plain Fieldset',
                height: 50
            },
            {
                xtype      : 'fieldset',
                title      : 'Collapsible Fieldset',
                collapsible: true,
                height     : 50
            },
            {
                xtype         : 'fieldset',
                title         : 'Checkbox Fieldset',
                checkboxToggle: true,
                height        : 50
            }
        ],

        buttons: [
            {
                text   :'Toggle Enabled',
                handler: function() {
                    Ext.each(Ext.getCmp('form-widgets').getForm()._fields.items, function(item) {
                        item.setDisabled(!item.disabled);
                    });
                }
            },
            {
                text   : 'Reset Form',
                handler: function() {
                    Ext.getCmp('form-widgets').getForm().reset();
                }
            },
            {
                text   : 'Validate',
                handler: function() {
                    Ext.getCmp('form-widgets').getForm().isValid();
                }
            }
        ]
    });

    /**
     * Border layout
     */
    items.push({
        xtype: 'panel',

        width : 450,
        height: 350,

        x: 690, y: 260,

        title : 'BorderLayout Panel',
        layout: 'border',

        defaults: {
            collapsible: true,
            split      : true
        },

        items: [
            {
                title  : 'North',
                region : 'north',
                html   : 'North',
                ctitle : 'North',
                margins: '5 5 0 5',
                height : 70
            },
            {
                title       : 'South',
                region      : 'south',
                html        : 'South',
                collapseMode: 'mini',
                margins     : '0 5 5 5',
                height      : 70
            },
            {
                title       : 'West',
                region      : 'west',
                html        : 'West',
                collapseMode: 'mini',
                margins     : '0 0 0 5',
                width       : 100
            },
            {
                title  : 'East',
                region : 'east',
                html   : 'East',
                margins: '0 5 0 0',
                width  : 100
            },
            {
                title      : 'Center',
                region     : 'center',
                collapsible: false,
                html       : 'Center'
            }
        ]
    });

    /**
     * Grid
     */
    var myData = [
        ['3m Co',                               71.72, 0.02,  0.03],
        ['Alcoa Inc',                           29.01, 0.42,  1.47],
        ['Altria Group Inc',                    83.81, 0.28,  0.34],
        ['Citigroup, Inc.',                     49.37, 0.02,  0.04]
    ];

    var store = Ext.create('Ext.data.ArrayStore', {
        fields: [
           {name: 'company'},
           {name: 'price', type: 'float'},
           {name: 'change', type: 'float'},
           {name: 'pctChange', type: 'float'}
        ],
        sorters: {
            property : 'company',
            direction: 'ASC'
        },
        data: myData
    });

    var pagingBar = Ext.createWidget('pagingtoolbar', {
        pageSize   : 5,
        store      : store,
        displayInfo: true,
        displayMsg : 'Displaying topics {0} - {1} of {2}'
    });

    items.push({
        xtype: 'gridpanel',

        height: 200,
        width : 450,

        x: 690, y: 620,

        title: 'GridPanel',

        store: store,

        columns: [
            {header: "Company",      width: 160, sortable: true, dataIndex: 'company', id:'company'},
            {header: "Price",        width: 75,  sortable: true, dataIndex: 'price'},
            {header: "Change",       width: 75,  sortable: true, dataIndex: 'change'},
            {header: "% Change",     width: 75,  sortable: true, dataIndex: 'pctChange'}
        ],

        autoExpandColumn: 'company',
        loadMask        : true,

        viewConfig: {
            stripeRows: true
        },

        bbar: pagingBar,
        tbar: [
            {text: 'Toolbar'}
         ]
    });

    //=============================================================
    // Accordion / Tree
    //=============================================================
    // Ext.define('TreeItem', {
    //     extend: 'Ext.data.Model',
    //     fields: [
    //         'text'
    //     ]
    // });
    //
    // var store = Ext.create('Ext.data.TreeStore', {
    //     model: 'TreeItem'
    // });
    //
    // sto
    //
    // var tree = Ext.create('Ext.tree.Panel', {
    //     title: 'TreePanel'
    //     //autoScroll: true,
    //     //enableDD: true
    // });

    // var root = Ext.create('Ext.tree.TreeNode', {
    //     text: 'Root Node',
    //     expanded: true
    // });
    // tree.setRootNode(root);
    //
    // root.appendChild(Ext.create('Ext.tree.TreeNode', {text: 'Item 1'}));
    // root.appendChild(Ext.create('Ext.tree.TreeNode', {text: 'Item 2'}));
    // var node = Ext.create('Ext.tree.TreeNode', {text: 'Folder'});
    // node.appendChild(Ext.create('Ext.tree.TreeNode', {text: 'Item 3'}));
    // root.appendChild(node);

    var accConfig = {
        title : 'Accordion and TreePanel',
        layout: 'accordion',

        x: 690, y: 830,

        width : 450,
        height: 240,

        bodyStyle: {
            'background-color': '#eee'
        },

        defaults: {
            border: false
        },

        items: [
            {
                title: 'Item 1',
                html: 'Some content'
            },
            {
                title: 'Item 2',
                html: 'Some content'
            },
            {
                title: 'Item 3',
                html : 'Some content'
            }
        ]
    };

    items.push(accConfig);

    /**
     * Tabs
     */
    var tabCfg = {
        xtype: 'tabpanel',

        width : 310,
        height: 150,

        activeTab: 0,

        defaults: {
            bodyStyle: 'padding:10px;'
        },

        items: [
            {
                title: 'Tab 1',
                html : 'Free-standing tab panel'
            },
            {
                title   : 'Tab 2',
                closable: true
            },
            {
                title   : 'Tab 3',
                closable: true
            }
        ]
    };

    items.push(Ext.applyIf({
        x: 50, y: 970,

        enableTabScroll: true,

        items: [
            {
                title: 'Tab 1',
                html : 'Tab panel for display in a border layout'
            },
            {
                title   : 'Tab 2',
                closable: true
            },
            {
                title   : 'Tab 3',
                closable: true
            },
            {
                title   : 'Tab 4',
                closable: true
            },
            {
                title   : 'Tab 5',
                closable: true
            },
            {
                title   : 'Tab 6',
                closable: true
            }
        ]
    }, tabCfg));

    items.push(Ext.apply({
        plain: true,
        x    : 370, y: 970
    }, tabCfg));

    /**
     * DatePicker
     */
    items.push({
        xtype: 'panel',

        x: 50, y: 1130,

        border: false,
        width : 180,

        items: {
            xtype: 'datepicker'
        }
    });

    //=============================================================
    // Resizable
    //=============================================================
    var rszEl = Ext.getBody().createChild({
        style: 'background: transparent;',
        html: '<div style="padding:20px;">Resizable handles</div>'
    });

    rszEl.position('absolute', 1, 240, 1130);
    rszEl.setSize(180, 180);
    Ext.create('Ext.resizer.Resizer', {
        el: rszEl,
        handles: 'all',
        pinned: true
    });

    /**
     * ProgressBar / Slider
     */
    var progressbar = Ext.createWidget('progressbar', {
        value: 0.5,
        text : 'Progress text...'
    });

    items.push({
        xtype: 'panel',
        title: 'ProgressBar / Slider',

        x: 690, y: 1080,

        width: 450,
        height: 200,

        bodyPadding: 5,
        layout     : {
            type : 'vbox',
            align: 'stretch'
        },

        items: [
            progressbar,
            {
                xtype    : 'slider',
                hideLabel: true,
                value    : 50,
                margin   : '5 0 0 0'
            },
            {
                xtype   : 'slider',
                vertical: true,
                value   : 50,
                height  : 100,
                margin  : '5 0 0 0'
            }
        ]
    });

    Ext.createWidget('viewport', {
        layout: 'absolute',
        autoScroll: true,
        items: items
    });

    progressbar.wait();

    /**
     * Stylesheet Switcher
     */
    Ext.get('styleswitcher_select').on('change', function(e, select) {
        var name = select[select.selectedIndex].value;
        setActiveStyleSheet(name);

        Ext.getBody().addCls('x-hide-visibility');
        Ext.ComponentManager.each(function(id, c){c.doLayout && c.doLayout();});
        Ext.getBody().removeCls('x-hide-visibility');

        Ext.getCmp('htmleditor').initEditor();
    });

    var cookie = readCookie("style");
    var title = cookie ? cookie : getPreferredStyleSheet();
    Ext.get('styleswitcher_select').dom.value = title;
});
