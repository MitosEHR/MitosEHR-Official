/**
 * A DataItem is a container for {@link Ext.dataview.ComponentView ComponentViews}. It ties together
 * {@link Ext.data.Model records} to its contained Components via a {@link #dataMap dataMap} configuration.
 *
 * For example, lets say you have a `text configuration which, when applied, gets turned into an instance of an
 * Ext.Component. We want to update the {@link #html} of a sub-component when the 'text' field of the record gets
 * changed.
 *
 * As you can see below, it is simply a matter of setting the key of the object to be the getter of the config
 * (getText), and then give that property a value of an object, which then has 'setHtml' (the html setter) as the key,
 * and 'text' (the field name) as the value. You can continue this for a as many sub-components as you wish.
 *
 *        dataMap: {
 *           // When the record is updated, get the text configuration, and
 *           // call {@link #setHtml} with the 'text' field of the record.
 *           getText: {
 *              setHtml: 'text'
 *          },
 *
 *          // When the record is updated, get the userName configuration, and
 *          // call {@link #setHtml} with the 'from_user' field of the record.
 *          getUserName: {
 *              setHtml: 'from_user'
 *          },
 *
 *          // When the record is updated, get the avatar configuration, and
 *          // call `setSrc` with the 'profile_image_url' field of the record.
 *          getAvatar: {
 *              setSrc: 'profile_image_url'
 *          }
 *      },
 */
Ext.define('Ext.dataview.DataItem', {
    extend: 'Ext.Container',
    xtype : 'dataitem',

    /**
     * @event tap
     * Fires whenever the tap event is triggered on the DataItem
     * @param {Ext.dataview.DataItem} this
     * @param {Ext.data.Model} record The record assosciated with the DataItem
     * @param {Ext.EventObject} e The event object
     */

    /**
     * @event doubletap
     * Fires whenever the doubletap event is triggered on the DataItem
     * @param {Ext.dataview.DataItem} this
     * @param {Ext.data.Model} record The record assosciated with the DataItem
     * @param {Ext.EventObject} e The event object
     */

    /**
     * @event touchstart
     * Fires whenever the touchstart event is triggered on the DataItem
     * @param {Ext.dataview.DataItem} this
     * @param {Ext.data.Model} record The record assosciated with the DataItem
     * @param {Ext.EventObject} e The event object
     */

    /**
     * @event touchmove
     * Fires whenever the touchmove event is triggered on the DataItem
     * @param {Ext.dataview.DataItem} this
     * @param {Ext.data.Model} record The record assosciated with the DataItem
     * @param {Ext.EventObject} e The event object
     */

    /**
     * @event touchend
     * Fires whenever the touchend event is triggered on the DataItem
     * @param {Ext.dataview.DataItem} this
     * @param {Ext.data.Model} record The record assosciated with the DataItem
     * @param {Ext.EventObject} e The event object
     */

    /**
     * @event swipe
     * Fires whenever the swipe event is triggered on the DataItem
     * @param {Ext.dataview.DataItem} this
     * @param {Ext.data.Model} record The record assosciated with the DataItem
     * @param {Ext.EventObject} e The event object
     */

    config: {
        baseCls: Ext.baseCSSPrefix + 'data-item',

        defaultType: 'component',

        /**
         * @cfg {Ext.data.Model} record The model instance of this DataItem. It is controlled by the Component DataView
         * @accessor
         */
        record: null,

        /**
         * @cfg dataMap
         * The dataMap allows you to map {@link #record} fields to specific configurations in this component.
         *
         * For example, lets say you have a `text` configuration which, when applied, gets turned into an instance of an Ext.Component.
         * We want to update the {@link #html} of this component when the 'text' field of the record gets changed.
         * For example:
         *
         *      dataMap: {
         *          getText: {
         *              setHtml: 'text'
         *          }
         *      }
         *
         * In this example, it is simply a matter of setting the key of the object to be the getter of the config (getText), and then give that
         * property a value of an object, which then has 'setHtml' (the html setter) as the key, and 'text' (the field name) as the value.
         */
        dataMap: {},

        items: [{
            xtype: 'component'
        }]
    },

    // @private
    initialize: function() {
        var me = this;

        me.callParent();

    // TODO These events will be moved up to Component DataView
        me.element.on({
            tap: 'onTap',
            doubletap: 'onDoubleTap',
            touchstart: 'onTouchStart',
            touchmove: 'onTouchMove',
            touchend: 'onTouchEnd',
            swipe: 'onSwipe',
            scope: me
        });
    },

    // TODO These events will be moved up to Component DataView
    onTap: function(e) {
        this.fireEvent('tap', this, this.getRecord(), e);
        e.stopPropagation();
    },

    onDoubleTap: function(e) {
        this.fireEvent('doubletap', this, this.getRecord(), e);
    },

    onTouchStart: function(e) {
        this.fireEvent('touchstart', this, this.getRecord(), e);
    },

    onTouchMove: function(e) {
        this.fireEvent('touchmove', this, this.getRecord(), e);
    },

    onTouchEnd: function(e) {
        this.fireEvent('touchend', this, this.getRecord(), e);
    },

    onSwipe: function(e) {
        this.fireEvent('swipe', this, this.getRecord(), e);
    },

    /**
     * Updates this container's child items, passing through the dataMap.
     * @param newRecord
     * @private
     */

    updateRecord: function(newRecord) {
        var data = newRecord.getData();
        if (newRecord) {
            Ext.apply(data, Ext.dataview.DataView.prepareAssociatedData(newRecord));
        }
        var me = this,
            items = me.getItems(),
            item = items.first(),
            dataMap = me.getDataMap(),
            componentName, component, setterMap, setterName;
        if (!item) {
            return;
        }
        for (componentName in dataMap) {
            setterMap = dataMap[componentName];
            component = me[componentName]();
            if (component) {
                for (setterName in setterMap) {
                    if (component[setterName]) {
                        component[setterName](data[setterMap[setterName]]);
                    }
                }
            }
        }
        // Bypassing setter because sometimes we pass the same object (different properties)
        // TODO: Move this into the default dataMap???
        item.updateData(data);
    }
});
