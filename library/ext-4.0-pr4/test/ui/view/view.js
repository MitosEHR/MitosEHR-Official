Ext.onReady(function(){
    var myData = [
        {
            company: '3m Co',
            price  : 71.72
        },
        {
            company: 'Alcoa Inc',
            price  : 29.01
        },
        {
            company: 'Altria Group Inc',
            price  : 83.81
        }
    ];

    Ext.regModel('Company', {
        fields: [
           {name: 'company'},
           {name: 'price',      type: 'float'}
        ]
    });

    // create the data store
    var store = new Ext.data.Store({
        model: 'Company'
    });

    // manually load local data
    store.loadData(myData);

    var view = new Ext.DataView({
        store: store,
        itemSelector: '.company',
        selectedItemCls: 'company-selected',
        tpl: '<tpl for="."><div class="company">{company}</div></tpl>',
        height: 350,
        width : 600,
        selModel: {
            // options SIMPLE, SINGLE, MULTI
            mode: 'SIMPLE'
            // deselectOnContainerClick: false
        },
        renderTo: Ext.getBody()
    });
    view.toggleEventLogging(true);

});