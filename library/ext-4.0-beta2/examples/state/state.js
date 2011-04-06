Ext.require([
    'Ext.grid.*',
    'Ext.window.Window',
    'Ext.container.Viewport',
    'Ext.layout.container.Border',
    'Ext.state.*',
    'Ext.data.*'
]);

Ext.onReady(function(){

    Ext.define('Person', {
        extend: 'Ext.data.Model',
        fields: ['first', 'last', 'review', {
            name: 'age',
            type: 'int'
        }]
    });

    // setup the state provider, all state information will be saved to a cookie
    Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

    Ext.create('Ext.container.Viewport', {
        layout: {
            type: 'border',
            padding: 5
        },
        items: [{
            region: 'north',
            margins: '0 0 5 0',
            styleHtmlContent: true,
            height: 150,
            bodyPadding: 5,
            html: [
                'Between refreshes, the grid below will remember',
                '<ul>',
                    '<li>The hidden state of the columns</li>',
                    '<li>The width of the columns</li>',
                    '<li>The order of the columns</li>',
                    '<li>The sort state of the grid</li>',
                '</ul>'
            ].join(''),
            dockedItems: [{
                xtype: 'toolbar',
                items: [{
                    itemId: 'show-window',
                    text: 'Show window',
                    enableToggle: true,
                    toggleHandler: function(btn, state) {
                        var win = Ext.ComponentQuery.query('window#state-window')[0];
                        win.toggleButton = this;
                        if (state) {
                            win.show(this);
                        } else {
                            win.hide(this);
                        }
                    }
                }]
            }],
            items: {
                xtype: 'window',
                constrain: false,
                closeAction: 'hide',
                itemId: 'state-window',
                width: 300,
                height: 300,
                x: 5,
                y: 5,
                title: 'State Window',
                maximizable: true,
                stateId: 'stateWindowExample',
                styleHtmlContent: true,
                bodyPadding: 5,
                html: [
                    'Between refreshes, this window will remember:',
                    '<ul>',
                        '<li>The width and height</li>',
                        '<li>The x and y position</li>',
                        '<li>The maximized and restore states</li>',
                    '</ul>'
                ].join(''),
                listeners: {
                    hide: function() {
                        this.toggleButton.toggle(false);
                    }
                }
            }
        }, {
            bodyPadding: 5,
            region: 'west',
            title: 'Collapse/Width Panel',
            width: 200,
            stateId: 'statePanelExample',
            split: true,
            collapsible: true,
            html: [
                'Between refreshes, this panel will remember:',
                '<ul>',
                    '<li>The collapsed state</li>',
                    '<li>The width</li>',
                '</ul>'
            ].join('')
        }, {
            region: 'center',
            stateId: 'stateGridExample',
            xtype: 'grid',
            store: Ext.create('Ext.data.Store', {
                model: 'Person',
                data: [{
                    first: 'John',
                    last: 'Smith',
                    age: 32,
                    review: 'Solid performance, needs to comment code more!'
                }, {
                    first: 'Jane',
                    last: 'Brown',
                    age: 56,
                    review: 'Excellent worker, has written over 100000 lines of code in 3 months. Deserves promotion.'
                }, {
                    first: 'Kevin',
                    last: 'Jones',
                    age: 25,
                    review: 'Insists on using one letter variable names for everything, lots of bugs introduced.'
                }, {
                    first: 'Will',
                    last: 'Zhang',
                    age: 41,
                    review: 'Average. Works at the pace of a snail but always produces reliable results.'
                }, {
                    first: 'Sarah',
                    last: 'Carter',
                    age: 23,
                    review: 'Only a junior, but showing a lot of promise. Coded a Javascript parser in Assembler, very neat.'
                }]
            }),
            columns: [{
                text: 'First Name',
                dataIndex: 'first'
            }, {
                text: 'Last Name',
                dataIndex: 'last'
            }, {
                text: 'Age',
                dataIndex: 'age'
            }, {
                flex: 1,
                text: 'Review',
                dataIndex: 'review'
            }]
        }]
    });
});
