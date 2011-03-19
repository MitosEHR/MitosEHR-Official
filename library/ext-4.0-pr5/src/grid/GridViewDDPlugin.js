/**
 * @class Ext.grid.GridViewDDplugin
 * <p>This plugin provides drag and/or drop functionality for a GridView.</p>
 * <p>It creates a specialized instance of {@link Ext.dd.DragZone DragZone} which knows how to drag out of a {@link Ext.AbstractDataView DataView}
 * and loads the data object which is passed to a cooperating {@link Ext.dd.DragZone DragZone}'s methods with the following properties:<ul>
 * <li>copy : Boolean
 *  <div class="sub-desc">The value of the DataView's <code>copy</code> property, or <code>true</code> if the DataView was configured
 *  with <code>allowCopy: true</code> <u>and</u> the control key was pressed when the drag operation was begun.</div></li>
 * <li>view : DataView
 *  <div class="sub-desc">The source DataView from which the drag originated.</div></li>
 * <li>ddel : HtmlElement
 *  <div class="sub-desc">The drag proxy element which moves with the mouse</div></li>
 * <li>item : HtmlElement
 *  <div class="sub-desc">The DataView node upon which the mousedown event was registered.</div></li>
 * <li>records : Array
 *  <div class="sub-desc">An Array of {@link Ext.data.Model Model}s representing the selected data being dragged from the source DataView.</div></li>
 * </ul></p>
 * <p>It also creates a specialized instance of {@link Ext.dd.DropZone} which cooperates with other DropZones which are members of the same
 * ddGroup which processes such data objects.</p>
 * <p>Adding this plugin to a view means that two new events may be fired from the client DataView, <code>{@link #event-beforedrop beforedrop}</code> and
 * <code>{@link #event-drop drop}</code></p>
 */
Ext.define('Ext.grid.GridViewDDPlugin', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.gridviewdd',

    uses: [
        'Ext.view.DragZone',
        'Ext.grid.GridViewDropZone'
    ],

    /**
     * @event beforedrop
     * <b>This event is fired through the GridView. Add listeners to the GridView object</b>
     * Fired when a drop gesture has been triggered by a mouseup event in a valid drop position in the DataView.
     * @param {HtmlElement} node The DataView node <b>if any</b> over which the mouse was positioned.
     * @param {Object} data The data object gathered at mousedown time by the cooperating {@link Ext.dd.DragZone DragZone}'s
     * {@link Ext.dd.DragZone#getDragData getDragData} method it contains the following properties:<ul>
     * <li>copy : Boolean
     *  <div class="sub-desc">The value of the DataView's <code>copy</code> property, or <code>true</code> if the DataView was configured
     *  with <code>allowCopy: true</code> and the control key was pressed when the drag operation was begun</div></li>
     * <li>view : DataView
     *  <div class="sub-desc">The source DataView from which the drag originated.</div></li>
     * <li>ddel : HtmlElement
     *  <div class="sub-desc">The drag proxy element which moves with the mouse</div></li>
     * <li>item : HtmlElement
     *  <div class="sub-desc">The DataView node upon which the mousedown event was registered.</div></li>
     * <li>records : Array
     *  <div class="sub-desc">An Array of {@link Ext.data.Model Model}s representing the selected data being dragged from the source DataView.</div></li>
     * </ul>
     * @param {Ext.data.Model} overModel The Model over which the drop gesture took place.
     * @param {String} dropPosition <code>"before"</code> or <code>"after"</code> depending on whether the mouse is above or below the midline of the node.
     * @param {Function} dropFunction A function to call to complete the drop operation and either move or copy Model instances from the source
     * View's Store to the destination View's Store. This is useful when you want to perform some kind of asynchronous processing before confirming
     * the drop, such as an {@link Ext.Msg#confirm confirm} call, or an Ajax request. Return <code>false</code> from this event handler, and call the
     * <code>dropFunction</code> at any time to perform the data transfer.
     */
    /**
     * @event drop
     * <b>This event is fired through the GridView. Add listeners to the GridView object</b>
     * Fired when a drop operation has been completed and the data has been moved or copied.
     * @param {HtmlElement} node The DataView node <b>if any</b> over which the mouse was positioned.
     * @param {Object} data The data object gathered at mousedown time by the cooperating {@link Ext.dd.DragZone DragZone}'s
     * {@link Ext.dd.DragZone#getDragData getDragData} method it contains the following properties:<ul>
     * <li>copy : Boolean
     *  <div class="sub-desc">The value of the DataView's <code>copy</code> property, or <code>true</code> if the DataView was configured
     *  with <code>allowCopy: true</code> and the control key was pressed when the drag operation was begun</div></li>
     * <li>view : DataView
     *  <div class="sub-desc">The source DataView from which the drag originated.</div></li>
     * <li>ddel : HtmlElement
     *  <div class="sub-desc">The drag proxy element which moves with the mouse</div></li>
     * <li>item : HtmlElement
     *  <div class="sub-desc">The DataView node upon which the mousedown event was registered.</div></li>
     * <li>records : Array
     *  <div class="sub-desc">An Array of {@link Ext.data.Model Model}s representing the selected data being dragged from the source DataView.</div></li>
     * </ul>
     * @param {Ext.data.Model} overModel The Model over which the drop gesture took place.
     * @param {String} dropPosition <code>"before"</code> or <code>"after"</code> depending on whether the mouse is above or below the midline of the node.
     */

    dragText : '{0} selected row{1}',

    /**
     * @cfg {String} dragGroup
     * <p>The ddGroup to which the DragZone will belong.</p>
     * <p>This defines which other DropZones the DragZone will cooperate with. Drag/DropZones only cooperate with other Drag/DropZones
     * which are members of the same ddGroup.</p>
     */
    /**
     * @cfg {String} dropGroup
     * <p>The ddGroup to which the DropZone will belong.</p>
     * <p>This defines which other DragZones the DropZone will cooperate with. Drag/DropZones only cooperate with other Drag/DropZones
     * which are members of the same ddGroup.</p>
     */
    /**
     * @cfg {Boolean} acceptDrops
     * <p>Defaults to <code>true</code></p>
     * <p>Set to <code>false</code> to disallow the View from accepting drop gestures</p>
     */
    acceptDrops: true,

    init : function(view) {
        view.on('render', this.onViewRender, this);
    },

    onViewRender : function(view) {
        this.dragZone = Ext.create('Ext.view.DragZone', {
            view: view,
            ddGroup: this.dragGroup || this.ddGroup,
            dragText: this.dragText
        });

        if (this.acceptDrops) {
            this.dropZone = Ext.create('Ext.grid.GridViewDropZone', {
                view: view,
                ddGroup: this.dropGroup || this.ddGroup,
                acceptDrops: true
            });
        }
    }
});