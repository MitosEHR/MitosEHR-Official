Ext.define('Ext.ux.form.SearchField', {
    extend: 'Ext.form.field.Trigger',
    
    alias: 'widget.searchfield',
    
    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
    
    trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
    
    hasSearch : false,
    paramName : 'query',
    
    initComponent: function() {
        var me = this;

        me.callParent(arguments);
        me.on('specialkey', function(f, e){
            if (e.getKey() == e.ENTER) {
                me.onTrigger2Click();
            }
        });

        // We're going to use filtering
        me.store.remoteFilter = true;

        // Set up the proxy to encode the filter in the simplest way as a name/value pair
        
        // If the Store has not been *configured* with a filterParam property, then use our filter parameter name
        if (!me.store.proxy.hasOwnProperty('filterParam')) {
            me.store.proxy.filterParam = me.paramName;
        }
        me.store.proxy.encodeFilters = function(filters) {
            return filters[0].value;
        }
    },
    
    afterRender: function(){
        this.callParent();
        this.triggerCell.item(0).setDisplayed(false);
    },
    
    onTrigger1Click : function(){
        var me = this;
            
        if (me.hasSearch) {
            me.setValue('');
            me.store.clearFilter();
            me.hasSearch = false;
            me.triggerCell.item(0).setDisplayed(false);
            me.updateLayout();
        }
    },

    onTrigger2Click : function(){
        var me = this,
            store = me.store,
            proxy = store.getProxy(),
            value = me.getValue();
            
        if (value.length > 0) {
            // Param name is ignored here since we use custom encoding in the proxy
            me.store.filter(me.paramName, value);
            me.hasSearch = true;
            me.triggerCell.item(0).setDisplayed(true);
            me.updateLayout();
        }
    }
});