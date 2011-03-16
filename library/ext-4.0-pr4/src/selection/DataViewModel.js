/**
 * @class Ext.selection.DataViewModel
 * @ignore
 */
Ext.define('Ext.selection.DataViewModel', {
    extend: 'Ext.selection.Model',
    
    requires: ['Ext.util.KeyNav'],

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
                render: me.onViewRender,
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
    
    onNavKey: function(step) {
        step = step || 1;
        var me = this,
            view = me.view,
            selected = me.getSelection()[0],
            numRecords = me.view.store.getCount(),
            idx;
                
        if (selected) {
            idx = view.indexOf(view.getNode(selected)) + step;
        } else {
            idx = 0;
        }
        
        if (idx < 0) {
            idx = numRecords - 1;
        } else if (idx >= numRecords) {
            idx = 0;
        }
        
        me.select(idx);
    },

    // Allow the DataView to update the ui
    onSelectChange: function(record, isSelected, suppressEvent) {
        var me = this,
            view = me.view,
            allowSelect = true,
            select;
        
        if (isSelected) {
            if (!suppressEvent) {
                select = me.fireEvent('beforeselect', me, record) !== false;
            }
            if (allowSelect) {
                view.onItemSelect(record);
                if (!suppressEvent) {
                    me.fireEvent('select', me, record);
                }
            }
        } else {
            view.onItemDeselect(record);
            if (!suppressEvent) {
                me.fireEvent('deselect', me, record);
            }
        }
    },
    
    onViewRender: function() {
        var me = this;
        me.keyNav = Ext.create('Ext.util.KeyNav', me.view.el, {
            down: Ext.pass(me.onNavKey, [1], me),
            right: Ext.pass(me.onNavKey, [1], me),
            left: Ext.pass(me.onNavKey, [-1], me),
            up: Ext.pass(me.onNavKey, [-1], me),
            scope: me
        });
    }
});
