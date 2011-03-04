/**
 * @class Ext.selection.DataViewModel
 * @ignore
 */
Ext.define('Ext.selection.DataViewModel', {
    extend: 'Ext.selection.Model',

    deselectOnContainerClick: true,
    
    constructor: function(cfg){
        this.addEvents(
            /**
             * @event deselect
             * Fired after a record is deselected
             * @param {Ext.selection.DataViewModel} this
             * @param  {Ext.data.Model} record The deselected record
             */
            'deselect',
            
            /**
             * @event select
             * Fired after a record is selected
             * @param {Ext.selection.DataViewModel} this
             * @param  {Ext.data.Model} record The selected record
             */
            'select'
        );
        this.callParent(arguments);
    },
    
    bindComponent: function(view) {
        var me = this,
            eventListeners = {
                refresh: me.refresh,
                scope: me,
                el: {
                    scope: me
                }
            };
            
        me.view = view;
        me.bind(view.getStore());
        
        eventListeners.el[view.triggerEvent] = me.onItemClick;
        eventListeners.el[view.triggerCtEvent] = me.onContainerClick;
        
        view.on(eventListeners);
    },


    onItemClick: function(e) {
        var view   = this.view,
            node   = view.findTargetByEvent(e);
        
        if (node) {
            this.selectWithEvent(view.getRecord(node), e);
        } else {
            return false;
        }
    },

    onContainerClick: function() {
        if (this.deselectOnContainerClick) {
            this.deselectAll();
        }
    },

    // Allow the DataView to update the ui
    onSelectChange: function(record, isSelected, suppressEvent) {
        var me = this,
            view = me.view;
        
        if (isSelected) {
            view.onItemSelect(record);
            if (!suppressEvent) {
                me.fireEvent('select', me, record);
            }
        } else {
            view.onItemDeselect(record);
            if (!suppressEvent) {
                me.fireEvent('deselect', me, record);
            }
        }
    }
});
