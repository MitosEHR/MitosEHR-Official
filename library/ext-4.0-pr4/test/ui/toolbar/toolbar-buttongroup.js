Ext.require('Ext.panel.Panel');

Ext.onReady(function(){
   
    var SamplePanel = Ext.define('SamplePanel', {
        extend: 'Ext.panel.Panel',
        width: 500,
        height:250,
        style: 'margin-top:15px',
        bodyStyle: 'padding:10px',
        renderTo: 'docbody',
        html: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed metus nibh, sodales a, porta at, vulputate eget, dui. Pellentesque ut nisl. Maecenas tortor turpis, interdum non, sodales non, iaculis ac, lacus. Vestibulum auctor, tortor quis iaculis malesuada, libero lectus bibendum purus, sit amet tincidunt quam turpis vel lacus. In pellentesque nisl non sem. Suspendisse nunc sem, pretium eget, cursus a, fringilla vel, urna.",
        autoScroll: true
    });

    new SamplePanel({
        title: 'Multi columns',
        tbar: [{
            xtype: 'buttongroup',
            title: 'Clipboard',
            columns: 2,
            defaults: {
                scale: 'small'
            },
            items: [{
                xtype:'splitbutton',
                text: 'Menu Button',
                iconCls: 'add',
                menu: [{text: 'Menu Item 1'}]
            },{
                xtype:'splitbutton',
                text: 'Cut',
                iconCls: 'add',
                menu: [{text: 'Cut Menu Item'}]
            },{
                text: 'Copy',
                iconCls: 'add'
            },{
                text: 'Paste',
                iconCls: 'add',
                menu: [{text: 'Paste Menu Item'}]
            },{
                text: 'Format',
                iconCls: 'add'
            }]
        },{
            xtype: 'buttongroup',
            title: 'Other Bogus Actions',
            columns: 2,
            defaults: {
                scale: 'small'
            },
            items: [{
                xtype:'splitbutton',
                text: 'Menu Button',
                iconCls: 'add',
                menu: [{text: 'Menu Button 1'}]
            },{
                xtype:'splitbutton',
                text: 'Cut',
                iconCls: 'add',
                menu: [{text: 'Cut Menu Item'}]
            },{
                text: 'Copy',
                iconCls: 'add'
            },{
                text: 'Paste',
                iconCls: 'add',
                menu: [{text: 'Paste Menu Item'}]
            },{
                text: 'Format',
                iconCls: 'add'
            }]
        }]
    });


    new SamplePanel({
        title: 'Multi columns (No titles, double stack)',
        tbar: [{
            xtype: 'buttongroup',
            columns: 3,
            defaults: {
                scale: 'small'
            },
            items: [{
                xtype:'splitbutton',
                text: 'Menu Button',
                iconCls: 'add',
                menu: [{text: 'Menu Item 1'}]
            },{
                xtype:'splitbutton',
                text: 'Cut',
                iconCls: 'add',
                menu: [{text: 'Cut Menu Item'}]
            },{
                text: 'Copy',
                iconCls: 'add'
            },{
                text: 'Paste',
                iconCls: 'add',
                menu: [{text: 'Paste Menu Item'}]
            },{
                text: 'Format',
                iconCls: 'add'
            }]
        },{
            xtype: 'buttongroup',
            columns: 3,
            defaults: {
                scale: 'small'
            },
            items: [{
                xtype:'splitbutton',
                text: 'Menu Button',
                iconCls: 'add',
                menu: [{text: 'Menu Item 1'}]
            },{
                xtype:'splitbutton',
                text: 'Cut',
                iconCls: 'add',
                menu: [{text: 'Cut Menu Item'}]
            },{
                text: 'Copy',
                iconCls: 'add'
            },{
                text: 'Paste',
                iconCls: 'add',
                menu: [{text: 'Paste Menu Item'}]
            },{
                text: 'Format',
                iconCls: 'add'
            }]
        }]
    });

    new SamplePanel({
        title: 'Mix and match icon sizes to create a huge unusable toolbar',
        tbar: [{
            xtype: 'buttongroup',
            columns: 3,
            title: 'Clipboard',
            items: [{
                text: 'Paste',
                scale: 'large',
                rowspan: 3,
                iconCls: 'add',
                iconAlign: 'top',
                cls: 'x-btn-as-arrow'
            },{
                xtype:'splitbutton',
                text: 'Menu Button',
                scale: 'large',
                rowspan: 3,
                iconCls: 'add',
                iconAlign: 'top',
                arrowAlign:'bottom',
                menu: [{text: 'Menu Item 1'}]
            },{
                xtype:'splitbutton',
                text: 'Cut',
                iconCls: 'add',
                menu: [{text: 'Cut Menu Item'}]
            },{
                text: 'Copy',
                iconCls: 'add'
            },{
                text: 'Format',
                iconCls: 'add'
            }]
        },{
            xtype: 'buttongroup',
            columns: 3,
            title: 'Other Actions',
            items: [{
                text: 'Paste',
                scale: 'large',
                rowspan: 3, iconCls: 'add',
                iconAlign: 'top',
                cls: 'x-btn-as-arrow'
            },{
                xtype:'splitbutton',
                text: 'Menu Button',
                scale: 'large',
                rowspan: 3,
                iconCls: 'add',
                iconAlign: 'top',
                arrowAlign:'bottom',
                menu: [{text: 'Menu Button 1'}]
            },{
                xtype:'splitbutton',
                text: 'Cut',
                iconCls: 'add',
                menu: [{text: 'Cut Menu Item'}]
            },{
                text: 'Copy',
                iconCls: 'add'
            },{
                text: 'Format',
                iconCls: 'add'
            }]
        }]
    });

    new SamplePanel({
        title: 'Medium icons, arrows to the bottom',
        tbar: [{
            xtype: 'buttongroup',
            title: 'Clipboard',
            defaults: {
                scale: 'medium',
                iconAlign:'top'
            },
            items: [{
                xtype:'splitbutton',
                text: 'Menu Button',
                iconCls: 'add',
                arrowAlign:'bottom',
                menu: [{text: 'Menu Item 1'}]
            },{
                xtype:'splitbutton',
                text: 'Cut',
                iconCls: 'add',
                arrowAlign:'bottom',
                menu: [{text: 'Cut Menu Item'}]
            },{
                text: 'Copy',
                iconCls: 'add',
                cls: 'x-btn-as-arrow'
            },{
                text: 'Paste',
                iconCls: 'add',
                arrowAlign:'bottom',
                menu: [{text: 'Paste Menu Item'}]
            },{
                text: 'Format<br/>Stuff',
                iconCls: 'add'
            }]
        },{
            xtype: 'buttongroup',
            title: 'Other Bogus Actions',
            defaults: {
                scale: 'medium',
                iconAlign:'top'
            },
            items: [{
                xtype:'splitbutton',
                text: 'Menu Button',
                iconCls: 'add',
                arrowAlign:'bottom',
                menu: [{text: 'Menu Item 1'}]
            },{
                xtype:'splitbutton',
                text: 'Cut',
                iconCls: 'add',
                arrowAlign:'bottom',
                menu: [{text: 'Cut Menu Item'}]
            },{
                text: 'Copy',
                iconCls: 'add',
                cls: 'x-btn-as-arrow'
            },{
                text: 'Paste',
                iconCls: 'add',
                arrowAlign:'bottom',
                menu: [{text: 'Paste Menu Item'}]
            },{
                text: 'Format',
                iconCls: 'add',
                cls: 'x-btn-as-arrow'
            }]
        }]
    });


    new SamplePanel({
        title: 'Medium icons, text and arrows to the left',
        tbar: [{
            xtype:'buttongroup',
            items: [{
                text: 'Cut',
                iconCls: 'add',
                scale: 'medium'
            },{
                text: 'Copy',
                iconCls: 'add',
                scale: 'medium'
            },{
                text: 'Paste',
                iconCls: 'add',
                scale: 'medium',
                menu: [{text: 'Paste Menu Item'}]
            }]
        }, {
            xtype:'buttongroup',
            items: [{
                text: 'Format',
                iconCls: 'add',
                scale: 'medium'
            }]
        }]
    });

    new SamplePanel({
        title: 'Small icons, text and arrows to the left',
        tbar: [{
            xtype:'buttongroup',
            items: [{
                text: 'Cut',
                iconCls: 'add',
                scale: 'small'
            },{
                text: 'Copy',
                iconCls: 'add',
                scale: 'small'
            },{
                text: 'Paste',
                iconCls: 'add',
                scale: 'small',
                menu: [{text: 'Paste Menu Item'}]
            }]
        }, {
            xtype:'buttongroup',
            items: [{
                text: 'Format',
                iconCls: 'add',
                scale: 'small'
            }]
        }]
    });

});