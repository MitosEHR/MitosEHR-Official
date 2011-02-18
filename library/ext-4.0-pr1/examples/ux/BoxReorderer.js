Ext.define('Ext.ux.BoxReorderer', {
    mixins: {
        observable: 'Ext.util.Observable'
    },

    /**
     * @cfg {Mixed} animate
     * <p>Defaults to 300.</p>
     * <p>If truthy, child reordering is animated so that moved boxes slide smoothly into position.
     * If this option is numeric, it is used as the animation duration <b>in milliseconds</b>.</p>
     */
    animate: 300,

    constructor: function() {
        this.addEvents(
            /**
             * @event StartDrag
             * Fires when dragging of a child Component begins.
             * @param {BoxReorder} this
             * @param {Container} container The owning Container
             * @param {Component} dragCmp The Component being dragged
             * @param {Number} idx The start index of the Component being dragged.
             */
             'StartDrag',
            /**
             * @event Drag
             * Fires during dragging of a child Component.
             * @param {BoxReorder} this
             * @param {Container} container The owning Container
             * @param {Component} dragCmp The Component being dragged
             * @param {Number} startIdx The index position from which the Component was initially dragged.
             * @param {Number} idx The current closest index to which the Component would drop.
             */
             'Drag',
            /**
             * @event ChangeIndex
             * Fires when dragging of a child Component causes its drop index to change.
             * @param {BoxReorder} this
             * @param {Container} container The owning Container
             * @param {Component} dragCmp The Component being dragged
             * @param {Number} startIdx The index position from which the Component was initially dragged.
             * @param {Number} idx The current closest index to which the Component would drop.
             */
             'ChangeIndex',
            /**
             * @event Drop
             * Fires when a child Component is dropped at a new index position.
             * @param {BoxReorder} this
             * @param {Container} container The owning Container
             * @param {Component} dragCmp The Component being dropped
             * @param {Number} startIdx The index position from which the Component was initially dragged.
             * @param {Number} idx The index at which the Component is being dropped.
             */
             'Drop'
        );
        this.mixins.observable.constructor.apply(this, arguments);
    },

    init: function(container) {
        var l = container.getLayout();
        this.container = container;

        // Initialize the DD on first layout, when the innerCt has been created.
        l.onLayout = Ext.Function.createSequence(l.onLayout, this.onFirstLayout, this);

        container.destroy = Ext.Function.createSequence(container.destroy, this.onContainerDestroy, this);
    },

    /**
     * @private Clear up on Container destroy
     */
    onContainerDestroy: function() {
        if (this.dd) {
            this.dd.unreg();
        }
    },

    onFirstLayout: function() {
        var me = this,
            l = me.container.getLayout();

        // delete the sequence
        delete l.onLayout;

        // Create a DD instance. Poke the handlers in.
        // TODO: Ext5's DD classes should apply config to themselves.
        // TODO: Ext5's DD classes should not use init internally because it collides with use as a plugin
        // TODO: Ext5's DD classes should be Observable.
        // TODO: When all the above are trus, this plugin should extend the DD class.
        me.dd = new Ext.dd.DD(l.innerCt, me.container.id + '-reorderer');
        Ext.apply(me.dd, {
            animate: me.animate,
            reorderer: me,
            container: me.container,
            clickValidator: Ext.Function.createInterceptor(me.dd.clickValidator, me.clickValidator, me.dd, false),
            onMouseDown: me.onMouseDown,
            startDrag: me.startDrag,
            onDrag: me.onDrag,
            endDrag: me.endDrag,
            getNewIndex: me.getNewIndex
        });

        // Decide which dimension we are measuring, and which measurement metric defines
        // the *start* of the box depending upon orientation.
        me.dd.dim = l.parallelPrefix;
        me.dd.startAttr = l.parallelBefore;
        me.dd.endAttr = l.parallelAfter;
    },

    // check if the clicked component is reorderable
    clickValidator: function(e) {
        var cmp = this.container.getChildByElement(e.getTarget('.x-box-item', 10));
        if (!cmp || cmp.reorderable === false) {
            return false;
        }
        return true;
    },

    onMouseDown: function(e) {
        var me = this,
            container = me.container,
            containerBox,
            cmpEl,
            cmpBox,
            halfSize;

        // Ascertain which child Component is being mousedowned
        me.dragCmp = container.getChildByElement(e.getTarget('.x-box-item', 10));
        if (me.dragCmp) {

            // If the BoxLayout is not animated, animate it just for the duration of the drag operation.
            if (!container.layout.animate && me.animate) {
                container.layout.animate = me.animate;
                me.removeAnimate = true;
            }

            cmpEl = me.dragCmp.getEl();
            me.startIndex = me.curIndex = container.items.indexOf(me.dragCmp);

            // We drag the Component element
            me.dragElId = cmpEl.id;

            // Defeat the layout's positioning
            me.dragCmp.setPosition = Ext.emptyFn;

            // Start position of dragged Component
            cmpBox = cmpEl.getPageBox();

            // Last tracked start position
            me.lastPos = cmpBox[this.startAttr];

            // Calculate constraints depending upon orientation
            // Calculate offset from mouse to dragEl position
            containerBox = container.el.getPageBox();
            if (me.dim == 'width') {
                halfSize = cmpEl.dom.offsetWidth >> 1;
                me.minX = containerBox.left - halfSize;
                me.maxX = containerBox.right - halfSize;
                me.minY = me.maxY = cmpBox.top;
                me.deltaX = e.getPageX() - cmpBox.left;
            } else {
                halfSize = cmpEl.dom.offsetHeight >> 1;
                me.minY = containerBox.top - halfSize;
                me.maxY = containerBox.bottom - halfSize;
                me.minX = me.maxX = cmpBox.left;
                me.deltaY = e.getPageY() - cmpBox.top;
            }
            me.constrainY = me.constrainX = true;
        } else {
            me.dragElId = null;
        }
    },

    startDrag: function() {
        if (this.dragCmp) {
            this.reorderer.fireEvent('StartDrag', this, this.container, this.dragCmp, this.curIndex);

            // Suspend events, and et the disabled flag so that the mousedown and mouseup events
            // that are going to take place do not cause any other UI interaction.
            this.dragCmp.suspendEvents();
            this.dragCmp.disabled = true;
            this.dragCmp.el.setStyle('zIndex', 100);
        }
    },

    onDrag: function(e) {
        var me = this;

        me.reorderer.fireEvent('Drag', me, me.container, me.dragCmp, me.startIndex, me.curIndex);
        var newIndex = me.getNewIndex(e.getPoint());

        if ((newIndex !== undefined) && (newIndex != me.curIndex) && me.container.items.getAt(newIndex).reorderable !== false) {
            me.reorderer.fireEvent('ChangeIndex', me, me.container, me.dragCmp, me.startIndex, newIndex);
            var destination = me.container.getComponent(newIndex);
            if (destination.setPosition === Ext.emptyFn) { //restore setPosition of destination if the component is clickable
                delete destination.setPosition;
            }
            me.container.move(me.curIndex, newIndex);
            me.curIndex = newIndex;
        }
    },

    endDrag: function() {
        var me = this;
        if (me.dragCmp) {
            delete me.dragElId;
            delete me.dragCmp.setPosition;
            me.container.doLayout();
            if (me.removeAnimate) {
                delete me.removeAnimate;
                delete me.container.layout.animate;
            }
            me.reorderer.fireEvent('drop', me, me.container, me.dragCmp, me.startIndex, me.curIndex);
            me.dragCmp.el.setStyle('zIndex', '');
            Ext.Function.defer(function() {
                me.dragCmp.disabled = false;
                me.dragCmp.resumeEvents();
            }, 1);
        }
    },

    /**
     * @private
     * Calculate drop index based upon the dragEl's position.
     */
    getNewIndex: function(pointerPos) {
        var dragEl = this.getDragEl(),
            dragBox = Ext.fly(dragEl).getPageBox(),
            dragMidpoint = dragBox[this.startAttr] + (dragBox[this.dim] >> 1),
            targetBox,
            targetMidpoint,
            i = 0,
            it = this.container.items.items,
            ln = it.length,
            lastPos = this.lastPos;

        this.lastPos = dragBox[this.startAttr];

        for (; i < ln; i++) {
            targetBox = it[i].getEl().getPageBox();
            targetMidpoint = targetBox[this.startAttr] + (targetBox[this.dim] >> 1);
            if (i < this.curIndex) {
                if ((dragBox[this.startAttr] < lastPos) && (dragBox[this.startAttr] < (targetMidpoint - 5))) {
                    return i;
                }
            } else if (i > this.curIndex) {
                if ((dragBox[this.startAttr] > lastPos) && (dragBox[this.endAttr] > (targetMidpoint + 5))) {
                    return i;
                }
            }
        }
    }
});