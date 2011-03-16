// LoadMask is currently broken.
Ext.LoadMask = Ext.extend(Object, {
    bindStore: Ext.emptyFn
});


Ext.onReady(function(){
    var view = new Ext.DataView({
        autoScroll: true,
        store: 'forumStore',
        itemSelector: '.topic',
        tpl: '<tpl for="."><div class="topic">{author} responded to the {title} thread.</div></tpl>',
        selModel: {
            mode: 'SIMPLE'
        }
    });
    var pnl = new Ext.Panel({
        renderTo: Ext.getBody(),
        width: 600,
        height: 500,
        layout: 'fit',
        items: [view],
        dockedItems: [{
            dock: 'bottom',
            xtype: 'pagingtoolbar',
            store: 'forumStore',
            displayInfo: true
        }]
    });

});