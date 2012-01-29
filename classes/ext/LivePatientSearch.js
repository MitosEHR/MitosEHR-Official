/**
 * Created by JetBrains PhpStorm.
 * User: ernesto
 * Date: 6/27/11
 * Time: 8:43 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Ext.mitos.LivePatientSearch',{
    extend      : 'Ext.form.ComboBox',
    alias       : 'widget.patienlivetsearch',
    hideLabel	: true,
    initComponent: function(){
        var me = this;
        
        if (!Ext.ModelManager.isRegistered('Post')){
            Ext.define("Post", {
                extend: 'Ext.data.Model',
                proxy: {
                    type	: 'ajax',
                    url 	: 'app/search/data.php?task=search',
                    reader: {
                        type			: 'json',
                        root			: 'row',
                        totalProperty	: 'totals'
                    }
                },
                fields: [
                    {name: 'pid', 		type: 'int'},
                    {name: 'pubpid', 	type: 'int'},
                    {name: 'fullname', 	type: 'string'},
                    {name: 'DOB', 	    type: 'string'},
                    {name: 'SS', 	    type: 'string'}
                ]
            });
        }
        // *************************************************************************************
        // Live Search data store
        // *************************************************************************************
        me.searchStore = Ext.create('Ext.data.Store', {
            pageSize	: 10,
            model		: 'Post'
        });
        
        Ext.apply(this, {
            store		: me.searchStore,
            displayField: 'fullname',
            valueField  : 'pid',
            emptyText	: me.emptyText,
            typeAhead	: false,
            hideTrigger	: true,
            minChars	: 1,
            anchor		: '100%',
            listConfig: {
                loadingText	: 'Searching...',
                //emptyText	: 'No matching posts found.',
                //---------------------------------------------------------------------
                // Custom rendering template for each item
                //---------------------------------------------------------------------
                getInnerTpl: function() {
                    return '<div class="search-item"><h3><span>{fullname}</span>&nbsp;&nbsp;({pid})</h3>DOB:&nbsp;{DOB}&nbsp;SS:&nbsp;{SS}</div>';
                }
            },
            pageSize: 10
        }, null);

        me.callParent();
    }

});