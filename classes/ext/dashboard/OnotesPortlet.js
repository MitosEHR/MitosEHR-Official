Ext.define('Ext.mitos.dashboard.OnotesPortlet', {

    extend: 'Ext.grid.Panel',
    alias: 'widget.onotesportlet',
    height: 300,
    /**
     * Custom function used for column renderer
     * @param {Object} val
     */
    initComponent: function(){
		var OnotesSotore = new Ext.data.Store({
	    	pageSize	: 13,
		    proxy		: {
		    	type	: 'ajax',
			    url		: 'app/miscellaneous/officenotes/data_read.ejs.php',
		   	 	reader: {
		            type			: 'json',
		            idProperty		: 'id',
		            totalProperty	: 'totals',
		            root			: 'row'
		    	}
		    },
		    fields: [
				{name: 'id',      		type: 'int'},
				{name: 'date',          type: 'date', dateFormat: 'c'},
				{name: 'body',          type: 'string'},
				{name: 'user',          type: 'string'},
				{name: 'facility_id',   type: 'string'},
				{name: 'activity',   	type: 'string'}
        	],
		    autoLoad: true
		});

        Ext.apply(this, {
            //height: 300,
            height: this.height,
            store: OnotesSotore,
            stripeRows: true,
            columnLines: true,
            columns: [{
                id       : 'user',
                text   	 : 'From',
                sortable : 	true,
                dataIndex: 'user'
            },{
                text   	 : 'Note',
                width    : 75,
                sortable : true,
                dataIndex: 'body',
                flex	 : 1
            }]
        });

        this.callParent(arguments);
    }
});
