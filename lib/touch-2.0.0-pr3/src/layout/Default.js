(function(clsPrefix) {

/**
 * The Default Layout is the layout that all other layouts inherit from. The main capability it provides is docking,
 * which means that every other layout can also provide docking support. It's unusual to use Default layout directly,
 * instead it's much more common to use one of the sub classes:
 *
 * * {@link Ext.layout.HBox hbox layout}
 * * {@link Ext.layout.VBox vbox layout}
 * * {@link Ext.layout.Card card layout}
 * * {@link Ext.layout.Fit fit layout}
 *
 * For a full overview of layouts check out the [Layout Guide](#!/guide/layouts).
 *
 * ## Docking
 *
 * Docking enables you to place additional Components at the top, right, bottom or left edges of the parent Container,
 * resizing the other items as necessary. For example, let's say we're using an {@link Ext.layout.HBox hbox layout}
 * with a couple of items and we want to add a banner to the top so that we end up with something like this:
 *
 * {@img ../guides/layouts/docktop.jpg}
 *
 * This is simple to achieve with the *dock: 'top'* configuration below. We can dock as many of the items as we like,
 * to either the top, right, bottom or left edges of the Container:
 *
 *     Ext.create('Ext.Container', {
 *         fullscreen: true,
 *         layout: 'hbox',
 *         items: [
 *             {
 *                 dock: 'top',
 *                 height: 20,
 *                 html: 'This is docked to the top'
 *             },
 *             {
 *                 html: 'message list',
 *                 flex: 1
 *             },
 *             {
 *                 html: 'message preview',
 *                 flex: 2
 *             }
 *         ]
 *     });
 *
 * Similarly, to dock something to the left of a layout (a {@link Ext.layout.VBox vbox} in this case), such as the
 * following:
 *
 * {@img ../guides/layouts/dockleft.jpg}
 *
 * We can simply dock to the left:
 *
 *     Ext.create('Ext.Container', {
 *         fullscreen: true,
 *         layout: 'vbox',
 *         items: [
 *             {
 *                 dock: 'left',
 *                 width: 100,
 *                 html: 'This is docked to the left'
 *             },
 *             {
 *                 html: 'message list',
 *                 flex: 1
 *             },
 *             {
 *                 html: 'message preview',
 *                 flex: 2
 *             }
 *         ]
 *     });
 *
 * We can also dock to the bottom and right and use other layouts than hbox and vbox ({@link Ext.layout.Card card} and
 * {@link Ext.layout.Fit fit} layouts both accept docking too).
 */
Ext.define('Ext.layout.Default', {
    extend: 'Ext.EventedBase',
    alternateClassName: ['Ext.layout.AutoContainerLayout', 'Ext.layout.ContainerLayout'],

    alias: ['layout.auto', 'layout.default'],

    isLayout: true,

    eventNames: {
        add: 'add',
        remove: 'remove',
        move: 'move',
        centeredChange: 'centeredchange',
        floatingChange: 'floatingchange',
        dockedChange: 'dockedchange',
        activeItemChange: 'activeitemchange'
    },

    hasDockedItemsCls: clsPrefix + 'hasdocked',

    centeredItemCls: clsPrefix + 'centered',

    floatingItemCls: clsPrefix + 'floating',

    dockingWrapperCls: clsPrefix + 'docking',

    dockingInnerCls: clsPrefix + 'docking-inner',

    maskCls: clsPrefix + 'mask',

    positionMap: {
        top: 'start',
        left: 'start',
        bottom: 'end',
        right: 'end'
    },

    positionDirectionMap: {
        top: 'vertical',
        bottom: 'vertical',
        left: 'horizontal',
        right: 'horizontal'
    },

    DIRECTION_VERTICAL: 'vertical',

    DIRECTION_HORIZONTAL: 'horizontal',

    POSITION_START: 'start',

    POSITION_END: 'end',

    constructor: function(container, config) {
        this.container = container;

        this.innerItems = [];

        this.centeringWrappers = {};

        this.initConfig(config);
    },

    reapply: Ext.emptyFn,

    unapply: Ext.emptyFn,

    onItemAdd: function() {
        this.doItemAdd.apply(this, arguments);
    },

    onItemRemove: function() {
        this.doItemRemove.apply(this, arguments);
    },

    onItemMove: function() {
        this.doItemMove.apply(this, arguments);
    },

    onItemCenteredChange: function() {
        this.doItemCenteredChange.apply(this, arguments);
    },

    onItemFloatingChange: function() {
        this.doItemFloatingChange.apply(this, arguments);
    },

    onItemDockedChange: function() {
        this.doItemDockedChange.apply(this, arguments);
    },

    onActiveItemChange: function() {
        this.doActiveItemChange.apply(this, arguments);
    },

    /**
     * @private
     */
    doItemAdd: function(item, index) {
        var dockedPosition = item.getDocked();

        if (dockedPosition) {
            this.dockItem(item, dockedPosition);
        }
        else if (item.isCentered()) {
            this.centerItem(item, index);
        }
        else {
            this.insertItem(item, index);
        }

        if (item.isFloating()) {
            this.onItemFloatingChange(item, true);
        }
    },

    /**
     * @private
     */
    doItemRemove: function(item) {
        if (item.isDocked()) {
            this.undockItem(item);
        }
        else if (item.isCentered()) {
            this.uncenterItem(item);
        }

        Ext.Array.remove(this.innerItems, item);

        this.container.innerElement.dom.removeChild(item.renderElement.dom);
    },

    /**
     * @private
     */
    doItemMove: function(item, toIndex, fromIndex) {
        if (item.isCentered()) {
            item.setZIndex(toIndex + 200); //they should always be above other things on the page
        }
        else {
            this.insertItem(item, toIndex);
        }
    },

    /**
     * @private
     */
    doItemCenteredChange: function(item, centered) {
        if (centered) {
            this.centerItem(item);
        }
        else {
            this.uncenterItem(item);
        }
    },

    /**
     * @private
     */
    doItemFloatingChange: function(item, floating) {
        var element = item.element,
            floatingItemCls = this.floatingItemCls,
            zIndex = this.container.indexOf(item) + 100;

        if (item.getCentered()) {
            zIndex += 100;
        }

        if (floating) {
            // If we are floating and not centered, add a modal mask
            if (item.getModal() && !item.getCentered()) {
                this.addModalMask(item);

                //if it is modal, we want it to overlap everything else on the page, even other floating items
                zIndex += 100;
            }

            item.setZIndex(zIndex); //they should always be above other things on the page
            element.addCls(floatingItemCls);
        }
        else {
            item.setZIndex(null);
            element.removeCls(floatingItemCls);
        }
    },

    addModalMask: function(item) {
        var me = this,
            container = me.container,
            onMaskTap;

        //show the container mask
        container.mask();

        //if the hideOnMaskTap configuration is set to yes, add a listener to the mask to unmask the
        //container and hide the item
        if (item.getHideOnMaskTap()) {
            onMaskTap = function() {
                container.unmask();
                item.hide();
            };
        }

        //listen to the erased and painted events. erased means we should hide the mask. painted means we should
        //show the mask, again.
        item.on({
            erased: function() {
                container.unmask();

                //make sure we remove the listener from the mask
                if (onMaskTap) {
                    container.getMask().un('tap', onMaskTap, me);
                }
            },
            painted: function() {
                container.mask();

                //set the xindex of the mask to 1 below the actual item
                container.getMask().setZIndex(container.indexOf(item) + 199);

                //add the tap listener
                if (onMaskTap) {
                    container.getMask().on('tap', onMaskTap, me);
                }
            }
        });
    },

    /**
     * @private
     */
    doItemDockedChange: function(item, docked, oldDocked) {
        if (oldDocked) {
            this.undockItem(item, oldDocked);
        }

        if (docked) {
            this.dockItem(item, docked);
        }
    },

    doActiveItemChange: Ext.emptyFn,

    centerItem: function(item) {
        var zIndex = this.container.indexOf(item) + 200;

        this.insertItem(item, 0);

        item.setZIndex(zIndex);

        this.createCenteringWrapper(item);

        // TODO: Jacky think more about this
        item.element.addCls(this.floatingItemCls);
    },

    uncenterItem: function(item) {
        this.destroyCenteringWrapper(item);
        item.setZIndex(null);
        this.insertItem(item, this.container.indexOf(item));

        // TODO: Jacky think more about this
        item.element.removeCls(this.floatingItemCls);
    },

    dockItem: function(item, position) {
        var container = this.container,
            itemRenderElement = item.renderElement,
            itemElement = item.element,
            dockingInnerElement = this.dockingInnerElement;

        if (!dockingInnerElement) {
            container.setUseBodyElement(true);
            this.dockingInnerElement = dockingInnerElement = container.bodyElement;
        }

        this.getDockingWrapper(position);

        if (this.positionMap[position] === this.POSITION_START) {
            itemRenderElement.insertBefore(dockingInnerElement);
        }
        else {
            itemRenderElement.insertAfter(dockingInnerElement);
        }

        itemElement.addCls(clsPrefix + 'docked-' + position);
    },

    undockItem: function(item, docked) {
        this.insertItem(item, this.container.indexOf(item));
        item.element.removeCls(clsPrefix + 'docked-' + docked);
    },

    getDockingWrapper: function(position) {
        var currentDockingDirection = this.currentDockingDirection,
            direction = this.positionDirectionMap[position],
            dockingWrapper = this.dockingWrapper;

        if (currentDockingDirection !== direction) {
            this.currentDockingDirection = direction;
            this.dockingWrapper = dockingWrapper = this.createDockingWrapper(direction);
        }

        return dockingWrapper;
    },

    createDockingWrapper: function(direction) {
        return this.dockingInnerElement.wrap({
            classList: [this.dockingWrapperCls + '-' + direction]
        }, true);
    },

    createCenteringWrapper: function(item) {
        var id = item.getId(),
            wrappers = this.centeringWrappers,
            renderElement = item.renderElement,
            wrapper;

        wrappers[id] = wrapper = renderElement.wrap({
            className: this.centeredItemCls
        });

        //if it is modal, we need to add the mask
        if (item.getModal()) {
            this.addModalMask(item);
        }

        return wrapper;
    },

    destroyCenteringWrapper: function(item) {
        var id = item.getId(),
            wrappers = this.centeringWrappers,
            renderElement = item.renderElement,
            wrapper = wrappers[id];

        renderElement.unwrap();
        wrapper.destroy();
        delete wrappers[id];

        return this;
    },

    insertItem: function(item, index) {
       var container = this.container,
           items = container.getItems().items,
           innerItems = this.innerItems,
           containerDom = container.innerElement.dom,
           itemDom = item.renderElement.dom,
           relativeItem, relativeItemDom, domIndex;

       if (container.has(item)) {
           Ext.Array.remove(innerItems, item);
       }

       if (typeof index == 'number') {
           // Retrieve the *logical* relativeItem reference to insertBefore
           relativeItem = items[index];

           // If it is the item itself, get the next sibling
           if (relativeItem === item) {
               relativeItem = items[++index];
           }

           // Continue finding the relativeItem that is not currently centered
           while (relativeItem && (relativeItem.isCentered() || relativeItem.isDocked())) {
               relativeItem = items[++index];
           }

           if (relativeItem) {
               // Retrieve the *physical* index of that relativeItem
               domIndex = innerItems.indexOf(relativeItem);

               if (domIndex !== -1) {
                   while (relativeItem && (relativeItem.isCentered() || relativeItem.isDocked())) {
                       relativeItem = innerItems[++domIndex];
                   }

                   if (relativeItem) {
                       innerItems.splice(domIndex, 0, item);

                       relativeItemDom = relativeItem.renderElement.dom;
                       containerDom.insertBefore(itemDom, relativeItemDom);

                       return this;
                   }
               }
           }
       }

       innerItems.push(item);
       containerDom.appendChild(itemDom);

       return this;
   }
});

})(Ext.baseCSSPrefix);
