Ext.Loader.setConfig({enabled: true});

Ext.Loader.setPath('Ext.ux', '../ux/');

Ext.require([
    'Ext.tab.*',
    'Ext.ux.TabCloseMenu'
]);

Ext.onReady(function(){

    var tabs = Ext.createWidget('tabpanel', {
        renderTo: 'tabs',
        resizeTabs: true,
        minTabWidth: 115,
        tabWidth: 135,
        enableTabScroll: true,
        width: 600,
        height: 250,
        defaults: {
            autoScroll:true,
            bodyPadding: 10
        },
        items: [{
            title: 'First tab',
            iconCls: 'tabs',
            html: 'Tab Body<br/><br/>' + Ext.example.bogusMarkup,
            closable: true
        }],
        plugins: Ext.create('Ext.ux.TabCloseMenu', {})
    });

    // tab generation code
    var index = 0;
    while(index < 3){
        addTab();
    }
    function addTab(){
        tabs.add({
            title: 'New Tab ' + (++index),
            iconCls: 'tabs',
            html: 'Tab Body ' + index + '<br/><br/>' + Ext.example.bogusMarkup,
            closable: true
        }).show();
    }

    Ext.createWidget('button', {
        renderTo: 'addButtonCt',
        text: 'Add Tab',
        handler: addTab,
        iconCls:'new-tab'
    });
});