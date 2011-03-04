/**
 * A mechanism for displaying data using custom layout templates and formatting. DataView uses an {@link Ext.XTemplate}
 * as its internal templating mechanism, and is bound to an {@link Ext.data.Store}
 * so that as the data in the store changes the view is automatically updated to reflect the changes.  The view also
 * provides built-in behavior for many common events that can occur for its contained items including click, doubleclick,
 * mouseover, mouseout, etc. as well as a built-in selection model. <b>In order to use these features, an {@link #itemSelector}
 * config must be provided for the DataView to determine what nodes it will be working with.</b>
 *
 * <p>The example below binds a DataView to a {@link Ext.data.Store} and renders it into an {@link Ext.panel.Panel}.</p>
 * <pre><code>
Ext.regModel('Image', {
    fields: [
        'name', 'url',
        {name:'size', type: 'float'},
        {name:'lastmod', type:'date', dateFormat:'timestamp'}
    ]
});
var store = new Ext.data.Store({
    autoLoad: true,
    model: 'Image',
    proxy: {
        type: 'ajax',
        url: 'get-images.php',,
        reader: {
            type: 'json',
            root: 'images'
        }
    }
    fields: [
        'name', 'url',
        {name:'size', type: 'float'},
        {name:'lastmod', type:'date', dateFormat:'timestamp'}
    ]
});
var tpl = new Ext.XTemplate(
    '&lt;tpl for="."&gt;',
        '&lt;div class="thumb-wrap" id="{name}"&gt;',
        '&lt;div class="thumb"&gt;&lt;img src="{url}" title="{name}"&gt;&lt;/div&gt;',
        '&lt;span class="x-editable"&gt;{shortName}&lt;/span&gt;&lt;/div&gt;',
    '&lt;/tpl&gt;',
    '&lt;div class="x-clear"&gt;&lt;/div&gt;'
);

var panel = new Ext.panel.Panel({
    renderTo: document.body,
    frame:true,
    width:535,
    height: 400,
    layout:'fit',
    title:'Simple DataView',

    items: new Ext.DataView({
        store: store,
        tpl: tpl,
        itemSelector:'div.thumb-wrap',
        emptyText: 'No images to display'
    })
});
 * </code></pre>
 * @class Ext.DataView
 * @extends Ext.AbstractDataView
 * @xtype dataview
 */
Ext.define('Ext.DataView', {
    extend: 'Ext.AbstractDataView',
    alias: 'widget.dataview',
    addCmpEvents: function() {
        this.addEvents(
            /**
             * @event beforeclick
             * Fires before a click is processed. Returns false to cancel the default action.
             * @param {Ext.DataView} this
             * @param {Number} index The index of the target node
             * @param {HTMLElement} node The target node
             * @param {Ext.EventObject} e The raw event object
             */
            'beforeclick',

            /**
             * @event click
             * Fires when a template node is clicked.
             * @param {Ext.DataView} this
             * @param {Number} index The index of the target node
             * @param {HTMLElement} node The target node
             * @param {Ext.EventObject} e The raw event object
             */
            'click',

            /**
             * @event mouseenter
             * Fires when the mouse enters a template node. trackOver:true and an overItemCls must be set to enable this event.
             * @param {Ext.DataView} this
             * @param {Number} index The index of the target node
             * @param {HTMLElement} node The target node
             * @param {Ext.EventObject} e The raw event object
             */
            'mouseenter',

            /**
             * @event mouseleave
             * Fires when the mouse leaves a template node. trackOver:true and an overItemCls must be set to enable this event.
             * @param {Ext.DataView} this
             * @param {Number} index The index of the target node
             * @param {HTMLElement} node The target node
             * @param {Ext.EventObject} e The raw event object
             */
            'mouseleave',

            /**
             * @event containerclick
             * Fires when a click occurs and it is not on a template node.
             * @param {Ext.DataView} this
             * @param {Ext.EventObject} e The raw event object
             */
            'containerclick',

            /**
             * @event dblclick
             * Fires when a template node is double clicked.
             * @param {Ext.DataView} this
             * @param {Number} index The index of the target node
             * @param {HTMLElement} node The target node
             * @param {Ext.EventObject} e The raw event object
             */
            'dblclick',

            /**
             * @event contextmenu
             * Fires when a template node is right clicked.
             * @param {Ext.DataView} this
             * @param {Number} index The index of the target node
             * @param {HTMLElement} node The target node
             * @param {Ext.EventObject} e The raw event object
             */
            'contextmenu',

            /**
             * @event containercontextmenu
             * Fires when a right click occurs that is not on a template node.
             * @param {Ext.DataView} this
             * @param {Ext.EventObject} e The raw event object
             */
            'containercontextmenu',

            /**
             * @event selectionchange
             * Fires when the selected nodes change. Relayed event from the underlying selection model.
             * @param {Ext.DataView} this
             * @param {Array} selections Array of the selected nodes
             */
            'selectionchange',

            /**
             * @event beforeselect
             * Fires before a selection is made. If any handlers return false, the selection is cancelled.
             * @param {Ext.DataView} this
             * @param {HTMLElement} node The node to be selected
             * @param {Array} selections Array of currently selected nodes
             */
            'beforeselect'
        );
    },
    // private
    afterRender: function(){
        var me = this, 
            listeners = {
                scope: me,
                click: me.onClick,
                dblclick: me.onDblClick,
                contextmenu: me.onContextMenu
            };
        
        me.callParent();

        if (me.overItemCls && me.trackOver) {
            Ext.apply(listeners, {
                mouseover: me.onMouseOver,
                mouseout: me.onMouseOut
            });
        }
        
        me.mon(me.getTargetEl(), listeners);
        if (me.store) {
            me.bindStore(me.store, true);
        }
    },

    // private
    onClick: function(e){
        var me = this,
            item = e.getTarget(me.itemSelector, me.getTargetEl()),
            index;

        if (item) {
            index = me.indexOf(item);
            if (me.onItemClick(item, index, e) !== false) {
                me.fireEvent('click', me, index, item, e);
            }
        } else {
            if(me.fireEvent('containerclick', me, e) !== false){
                me.onContainerClick(e);
            }
        }
    },
    
    // @private, template method
    onContainerClick: Ext.emptyFn,

    // private
    onContextMenu : function(e){
        var me = this,
            item = e.getTarget(me.itemSelector, me.getTargetEl());
            
        if (item) {
            me.fireEvent('contextmenu', me, me.indexOf(item), item, e);
        } else {
            me.fireEvent('containercontextmenu', me, e);
        }
    },

    // private
    onDblClick: function(e){
        var me = this,
            item = e.getTarget(me.itemSelector, me.getTargetEl());
            
        if (item) {
            me.fireEvent('dblclick', me, me.indexOf(item), item, e);
        }
    },

    // private
    onMouseOver: function(e){
        var me = this,
            item = e.getTarget(me.itemSelector, me.getTargetEl());
            
        if (item && item !== me.highlightedItem) {
            me.highlightItem(item);
            me.fireEvent('mouseenter', me, me.indexOf(item), item, e);
        }
    },

    // private
    onMouseOut : function(e){
        var me = this,
            highlighted = me.highlightedItem;
            
        if (highlighted) {
            if (!e.within(highlighted, true, true)) {
                me.clearHighlight();
                me.fireEvent('mouseleave', me, me.indexOf(highlighted), highlighted, e);
            }
        }
    },

    /**
     * Highlight a given item in the DataView. This is called by the mouseover handler if {@link #overItemCls}
     * and {@link #trackOver} are configured, but can also be called manually by other code, for instance to
     * handle stepping through the list via keyboard navigation.
     * @param {HTMLElement} item The item to highlight
     */
    highlightItem: function(item) {
        var me = this;
        me.clearHighlight();
        me.highlightedItem = item;
        Ext.fly(item).addCls(me.overItemCls);
    },

    /**
     * Un-highlight the currently highlighted item, if any.
     */
    clearHighlight: function() {
        var me = this,
            highlighted = me.highlightedItem;
            
        if (highlighted) {
            Ext.fly(highlighted).removeCls(me.overItemCls);
            delete me.highlightedItem;
        }
    },

    // private
    onItemClick: function(item, index, e){
        if (this.fireEvent('beforeclick', this, index, item, e) === false) {
            return false;
        }
        return true;
    }
});