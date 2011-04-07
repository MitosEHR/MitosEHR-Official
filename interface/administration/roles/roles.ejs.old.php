<script type="text/javascript">
Ext.onReady(function(){
	Ext.regModel('PermissionList', {
	    fields: [
	    	{name: 'id', type: 'int'},
	        {name: 'replycount', type: 'string'},
	        {name: 'perm_key', type: 'int'},
	        {name: 'perm_name', type: 'string'},
	        {name: 'role_id', type: 'int'},
	        {name: 'perm_id', type: 'int'},
	        {name: 'value', type: 'string'}
	    ],
	    idProperty: 'id'
	});
	// create the Data Store
    var permStore = new Ext.data.Store({
        pageSize: 50,
        model: 'PermissionList',
        remoteSort: true,
        proxy: {
            url: 'interface/administration/roles/data_read.ejs.php',
            reader: {
                root: 'row',
                totalProperty: 'totalCount'
            },
            // sends single sort as multi parameter
            legacySortMode: true
        }
    });
	var roleGrid = new Ext.grid.GridPanel({
        store: permStore,
        columnLines: true,
        headers: [{
        	text     : 'Company',
            flex     : 1,
            sortable : false, 
            dataIndex: 'company'
        },{
            text     : 'Price', 
            width    : 75, 
            sortable : true, 
            renderer : 'usMoney', 
            dataIndex: 'price'
        },{
            text     : 'Change', 
            width    : 75, 
            sortable : true, 
            renderer : change, 
            dataIndex: 'change'
        },{
            text     : '% Change', 
            width    : 75, 
            sortable : true, 
            renderer : pctChange, 
            dataIndex: 'pctChange'
        },{
            text     : 'Last Updated', 
            width    : 85, 
            sortable : true, 
            renderer : Ext.util.Format.dateRenderer('m/d/Y'), 
            dataIndex: 'lastChange'
        }],
        height: 350,
        width: 600,
        title: 'Roles and Permissions',
        renderTo: 'TopPanel',
        viewConfig: {
            stripeRows: true
        }
    });
});
</script>