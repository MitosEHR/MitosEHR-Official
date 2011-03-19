/**
 * @class Ext.grid.HeaderDragZone
 * @extends Ext.dd.DragZone
 * @private
 */
Ext.define('Ext.view.DragZone', {
    extend: 'Ext.dd.DragZone',
    containerScroll: false,
    
    constructor: function(config) {
        var me = this;

        Ext.apply(me, config);

        // Create a ddGroup unless one has been configured.
        // User configuration of ddGroups allows users to specify which
        // DD instances can interact with each other. Using one
        // based on the id of the View would isolate it and mean it can only
        // interact with a DropZone on the same View also using a generated ID.
        if (!me.ddGroup) {
            me.ddGroup = 'view-dd-zone-' + me.view.id;
        }

        // Ext.dd.DragDrop instances are keyed by the ID of their encapsulating element.
        // So a View's DragZone cannot use the View's main element because the DropZone must use that
        // because the DropZone may need to scroll on hover at a scrolling boundary, and it is the View's
        // main element which handles scrolling.
        // We use the View's parent element to drag from. Ideally, we would use the internal structure, but that 
        // is transient; DataView's recreate the internal structure dynamically as data changes.
        // TODO: Ext 5.0 DragDrop must allow multiple DD objects to share the same element.
        me.callParent([me.view.el.dom.parentNode]);

        me.ddel = Ext.get(document.createElement('div'));
        me.ddel.addCls(Ext.baseCSSPrefix + 'grid-dd-wrap');
    },

    init: function(id, sGroup, config) {
        this.initTarget(id, sGroup, config);
        this.view.on({
            beforemousedown: this.onBeforeMouseDown,
            mouseup: this.onAfterMouseUp,
            scope: this
        });
    },

    onBeforeMouseDown: function(view, index, item, e) {
        var selectionModel = view.getSelectionModel(),
            record = view.getRecord(item);
        if (!this.isPreventDrag(e)) {
            if (!selectionModel.isSelected(record) || e.hasModifier()) {
                selectionModel.selectWithEvent(record, e);
            }
            this.handleMouseDown(e);
            return false;
        }
        return true;
    },

    // private template method
    isPreventDrag: function(e) {
        return false;
    },

    onAfterMouseUp: function(view, index, item, e) {
        var selectionModel = view.getSelectionModel(),
            record = view.getRecord(item);

        if (!this.dragging && selectionModel.isSelected(record) && selectionModel.getSelection().length > 1 && !e.hasModifier()) {
            selectionModel.select(record);
        }
    },

    getDragData: function(e) {
        var view = this.view,
            item = e.getTarget(view.getItemSelector()),
            record, selectionModel, records;

        if (item) {
            record = view.getRecord(item);
            selectionModel = view.getSelectionModel();
            records = selectionModel.getSelection();
            return {
                copy: this.view.copy || (this.view.allowCopy && e.ctrlKey),
                view: view,
                ddel: this.ddel,
                item: item,
                records: records
            };
        }
    },

    onInitDrag: function(x, y) {
        this.ddel.update(this.getDragText());
        this.proxy.update(this.ddel.dom);
        this.onStartDrag(x, y);
        return true;
    },

    getDragText: function() {
        var count = this.dragData.records.length;
        return Ext.String.format(this.dragText, count, count == 1 ? '' : 's');
    }
});