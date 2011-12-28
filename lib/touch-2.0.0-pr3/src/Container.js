/**
 * @class Ext.Container
 * @extend Ext.Component
 *
 * A Container has all of the abilities of {@link Ext.Component Component}, but lets you nest other Components inside
 * it. Applications are made up of lots of components, usually nested inside one another. Containers allow you to
 * render and arrange child Components inside them. Most apps have a single top-level Container called a Viewport,
 * which takes up the entire screen. Inside of this are child components, for example in a mail app the Viewport
 * Container's two children might be a message List and an email preview pane.
 *
 * Containers give the following extra functionality:
 *
 * * Adding child Components at instantiation and run time
 * * Removing child Components
 * * Specifying a [Layout](#!/guide/layouts)
 *
 * Layouts determine how the child Components should be laid out on the screen. In our mail app example we'd use an
 * HBox layout so that we can pin the email list to the left hand edge of the screen and allow the preview pane to
 * occupy the rest. There are several layouts in Sencha Touch 2, each of which help you achieve your desired
 * application structure, further explained in the [Layout guide](#!/guide/layouts).
 *
 * ## Adding Components to Containers
 *
 * As we mentioned above, Containers are special Components that can have child Components arranged by a Layout. One of
 * the code samples above showed how to create a Panel with 2 child Panels already defined inside it but it's easy to
 * do this at run time too:
 *
 *     @example
 *     //this is the Panel we'll be adding below
 *     var aboutPanel = Ext.create('Ext.Panel', {
 *         html: 'About this app'
 *     });
 *
 *     //this is the Panel we'll be adding to
 *     var mainPanel = Ext.create('Ext.Panel', {
 *         fullscreen: true,
 *
 *         layout: 'hbox',
 *         defaults: {
 *             flex: 1
 *         },
 *
 *         items: {
 *             html: 'First Panel',
 *             style: 'background-color: #5E99CC;'
 *         }
 *     });
 *
 *     //now we add the first panel inside the second
 *     mainPanel.add(aboutPanel);
 *
 * Here we created three Panels in total. First we made the aboutPanel, which we might use to tell the user a little
 * about the app. Then we create one called mainPanel, which already contains a third Panel in its
 * {@link Ext.Container#cfg-items items} configuration, with some dummy text ("First Panel"). Finally, we add the first
 * panel to the second by calling the {@link Ext.Container#method-add add} method on mainPanel.
 *
 * In this case we gave our mainPanel another hbox layout, but we also introduced some
 * {@link Ext.Container#defaults defaults}. These are applied to every item in the Panel, so in this case every child
 * inside mainPanel will be given a flex: 1 configuration. The effect of this is that when we first render the screen
 * only a single child is present inside mainPanel, so that child takes up the full width available to it. Once the
 * mainPanel.add line is called though, the aboutPanel is rendered inside of it and also given a flex of 1, which will
 * cause it and the first panel to both receive half the full width of the mainPanel.
 *
 * Likewise, it's easy to remove items from a Container:
 *
 *     mainPanel.remove(aboutPanel);
 *
 * After this line is run everything is back to how it was, with the first child panel once again taking up the full
 * width inside mainPanel.
 *
 * ## Further Reading
 *
 * See the [Component & Container Guide](#!/guide/components) for more information, and check out the
 * {@link Ext.Container} class docs also.
 */
Ext.define('Ext.Container', {
    extend: 'Ext.Component',

    alternateClassName: 'Ext.lib.Container',

    requires: [
        'Ext.layout.Layout',
        'Ext.ItemCollection',
        'Ext.behavior.Scrollable',
        'Ext.Mask',
        'Ext.LoadMask'
    ],

    xtype: 'container',

    eventedConfig: {
        /**
         * @cfg {Object} activeItem The item from the {@link #cfg-items} collection that will be active first. This is
         * usually only meaningful in a {@link Ext.layout.Card card layout}, where only one item can be active at a
         * time
         * @accessor
         * @evented
         */
        activeItem: 0
    },

    /**
     * @event add
     * Fires whenever item added to the Container
     * @param {Object} item The item added to the Container
     * @param {Number} index The index of the item within the Container
     */

    /**
     * @event remove
     * Fires whenever item removed from the Container
     * @param {Object} item The item removed from the Container
     * @param {Number} index The index of the item that was removed
     */

    /**
     * @event move
     * Fires whenever item moved within the Container
     * @param {Ext.Container} this The Container instance
     * @param {Object} item The item moved within the Container
     * @param {Number} toIndex The new index of the item
     * @param {Number} fromIndex The old index of the item
     */

    /**
     * @private
     * @event renderedchange
     * Fires whenever an item is rendered into a container or derendered
     * from a Container
     * @param {Object} item The item in the Container
     * @param {Boolean} rendered The current rendered status of the item
     */

    /**
     * @event activate
     * Fires whenever item within the Container is activated
     */

    /**
     * @event deactivate
     * Fires whenever item within the Container is deactivated
     */

    config: {
        /**
         * @cfg {Object/String} layout Configuration for this Container's layout. Example:
         *
         *    Ext.create('Ext.Container', {
         *        layout: {
         *            type: 'hbox',
         *            align: 'middle'
         *        },
         *        items: [
         *            {
         *                xtype: 'panel',
         *                flex: 1,
         *                style: 'background-color: red;'
         *            },
         *            {
         *                xtype: 'panel',
         *                flex: 2,
         *                style: 'background-color: green'
         *            }
         *        ]
         *    });
         *
         * See the layouts guide for more information
         *
         * @accessor
         */
        layout: null,

        /**
         * @cfg {Object} defaults A set of default configurations to apply to all child Components in this Container.
         * It's often useful to specify defaults when creating more than one items with similar configurations. For example here we can
         * specify that each child is a panel and avoid repeating the xtype declaration for each one:
         *
         *    Ext.create('Ext.Container', {
         *        defaults: {
         *            xtype: 'panel'
         *        },
         *        items: [
         *            {
         *                html: 'Panel 1'
         *            },
         *            {
         *                html: 'Panel 2'
         *            }
         *        ]
         *    });
         *
         * @accessor
         */
        defaults: null,

        /**
         * @cfg {Array/Object} items The child items to add to this Container. This is usually an array of Component
         * configurations or instances, for example:
         *
         *    Ext.create('Ext.Container', {
         *        items: [
         *            {
         *                xtype: 'panel',
         *                html: 'This is an item'
         *            }
         *        ]
         *    });
         * @accessor
         */
        items: null,

        /**
         * @cfg {Boolean} autoDestroy If true, child items will be destroyed as soon as they are {@link #method-remove removed}
         * from this container
         * @accessor
         */
        autoDestroy: true,

        /** @cfg {String} defaultType
         * The default {@link Ext.Component xtype} of child Components to create in this Container when a child item
         * is specified as a raw configuration object, rather than as an instantiated Component.
         * @accessor
         */
        defaultType: null,

        /**
         * @cfg {Boolean/Object} scrollable
         * Configuration options to make this Container scrollable. Acceptable values are:
         * 
         * * 'horizontal', 'vertical', 'both' to enabling scrolling for that direction.
         * * true/false to explicitly enable/disable scrolling.
         *
         * @accessor
         */
        scrollable: null,

        //@private
        useBodyElement: null,

        /**
         * @cfg {Boolean/Object/Ext.Mask/Ext.LoadMask} mask
         * A configuration to allow you to mask this container.
         * You can optionally pass an object block with and xtype of `loadmask`, and an optional `message` value to
         * display a loading mask. Please refer to the {@link Ext.LoadMask} component to see other configurations.
         *
         *     mask: {
         *         message: 'My message'
         *     }
         *
         * Note: If you pass just a message property, Sencha Touch will automatically set the xtype to 'loadmask'
         * ({@link Ext.Mask} does not support the `message` configuration). Otherwise, a simple {@link Ext.Mask}
         * will be used.
         *
         * Alternatively, you can just call the setter at any time with true/false to show/hide the mask"
         *
         *     setMask(true); //show the mask
         *     setMask(false); //hides the mask
         *
         * There are also two convience methods, {@link #method-mask} and {@link #unmask}, to allow you to mask and unmask
         * this container at any time.
         *
         * Remember, the Ext.Viewport is always a container, so if you want to mask your whole application at anytime,
         * can call Ext.Viewport.setMask({ message: 'Hello' });
         *
         * @accessor
         */
        mask: null
    },

    isContainer: true,

    delegateListeners: {
        delegate: '> component',
        centeredchange: 'onItemCenteredChange',
        dockedchange: 'onItemDockedChange',
        floatingchange: 'onItemFloatingChange'
    },

    constructor: function(config) {
        var me = this;

        me._items = me.items = new Ext.ItemCollection();
        me.innerItems = [];

        // Temporarily assigns this.add() to a private property, which will
        // be swapped back the first time an item is added
        me.$onItemAdd = me.onItemAdd;
        me.onItemAdd = me.onFirstItemAdd;

        me.callParent(arguments);
    },

    getElementConfig: function() {
        return {
            reference: 'element',
            className: 'x-container',
            children: [{
                reference: 'innerElement',
                className: 'x-inner'
            }]
        };
    },

    /**
     * Changes the {@link #cfg-mask} configuration when its setter is called, which will convert the value
     * into a proper object/instance of {@link Ext.Mask}/{@link Ext.LoadMask}. If a mask already exists,
     * it will use that instead.
     */
    applyMask: function(mask) {
        var config = {};

        if (Ext.isObject(mask)) {
            config = mask;
        }

        Ext.applyIf(config, {
            hidden: !Boolean(mask)
        });

        //if you set a message, it should use Ext.LoadMask
        if (config.message && !config.xtype) {
            config.xtype = "loadmask";
        }

        return Ext.factory(config, Ext.Mask, this.getMask());
    },

    /**
     * Updates the {@link #cfg-mask} configuration with the passed value.
     */
    updateMask: function(newMask, oldMask) {
        if (oldMask) {
            this.remove(oldMask);
        }

        if (newMask) {
            this.add(newMask);
        }
    },

    /**
     * Convience method which calls {@link #setMask} with a value of true (to show the mask). For additional
     * functionality, call the {@link #setMask} function direction (See the {@link #cfg-mask} configuration documention
     * for more information).
     */
    mask: function() {
        this.setMask(true);
    },

    /**
     * Convience method which calls {@link #setMask} with a value of false (to hide the mask). For additional
     * functionality, call the {@link #setMask} function direction (See the {@link #cfg-mask} configuration documention
     * for more information).
     */
    unmask: function() {
        this.setMask(false);
    },

    updateBaseCls: function(newBaseCls, oldBaseCls) {
        var me = this,
            ui = me.getUi();

        if (newBaseCls) {
            this.addCls(newBaseCls);
            this.innerElement.addCls(newBaseCls, null, 'inner');

            if (ui) {
                this.addCls(newBaseCls, null, ui);
            }
        }

        if (oldBaseCls) {
            this.removeCls(oldBaseCls);
            this.innerElement.removeCls(newBaseCls, null, 'inner');

            if (ui) {
                this.removeCls(oldBaseCls, null, ui);
            }
        }
    },

    updateUseBodyElement: function(useBodyElement) {
        if (useBodyElement) {
            this.bodyElement = this.innerElement.wrap({
                cls: 'x-body'
            });
        }
    },

    applyItems: function(items, collection) {
        if (items) {
            this.getDefaultType();
            this.getDefaults();

            if (!this.isItemsInitializing && collection.length > 0) {
                this.removeAll();
            }

            this.add(items);
        }
    },

    /**
     * Initialize layout and event listeners the very first time an item is added
     * @private
     */
    onFirstItemAdd: function() {
        var onItemAdd = this.onItemAdd = this.$onItemAdd;

        delete this.$onItemAdd;

        this.setLayout(new Ext.layout.Layout(this, this.getLayout() || 'default'));

        if (this.innerHtmlElement && !this.getHtml()) {
            this.innerHtmlElement.destroy();
            delete this.innerHtmlElement;
        }

        this.on(this.delegateListeners);

        return onItemAdd.apply(this, arguments);
    },

    updateDefaultType: function(defaultType) {
        // Cache the direct reference to the default item class here for performance
        this.defaultItemClass = Ext.ClassManager.getByAlias('widget.' + defaultType);

        //<debug error>
        if (!this.defaultItemClass) {
            Ext.Logger.error("Invalid defaultType of: '" + defaultType + "', must be a valid component xtype");
        }
        //</debug>
    },

    applyDefaults: function(defaults) {
        if (defaults) {
            this.factoryItem = this.factoryItemWithDefaults;
            return defaults;
        }
    },

    factoryItem: function(item) {
        //<debug error>
        if (!item) {
            Ext.Logger.error("Invalid item given: " + item + ", must be either the config object to factory a new item, " +
                "or an existing component instance");
        }
        //</debug>

        return Ext.factory(item, this.defaultItemClass);
    },

    factoryItemWithDefaults: function(item) {
        //<debug error>
        if (!item) {
            Ext.Logger.error("Invalid item given: " + item + ", must be either the config object to factory a new item, " +
                "or an existing component instance");
        }
        //</debug>

        var me = this,
            defaults = me.getDefaults(),
            instance;

        if (!defaults) {
            return Ext.factory(item, me.defaultItemClass);
        }

        // Existing instance
        if (item.isComponent) {
            instance = item;

            // Apply defaults only if this is not already an item of this container
            if (defaults && item.isInnerItem() && !me.has(instance)) {
                instance.setConfig(defaults, true);
            }
        }
        // Config object
        else {
            if (defaults && !item.ignoreDefaults) {
                // Note:
                // - defaults is only applied to inner items
                // - we merge the given config together with defaults into a new object so that the original object stays intact
                if (!(
                        item.hasOwnProperty('left') &&
                        item.hasOwnProperty('right') &&
                        item.hasOwnProperty('top') &&
                        item.hasOwnProperty('bottom') &&
                        item.hasOwnProperty('docked') &&
                        item.hasOwnProperty('centered')
                    )) {
                    item = Ext.mergeIf({}, item, defaults);
                }
            }

            instance = Ext.factory(item, me.defaultItemClass);
        }

        return instance;
    },

    /**
     * Adds one or more Components to this Container. Example:
     *
     *    var myPanel = Ext.create('Ext.Panel', {
     *        html: 'This will be added to a Container'
     *    });
     *
     *    myContainer.add([myPanel])
     *
     * @param {Array} newItems The new items to add to the Container
     */
    add: function(newItems) {
        var me = this,
            i, ln, item;

        newItems = Ext.Array.from(newItems);

        ln = newItems.length;

        for (i = 0; i < ln; i++) {
            item = me.factoryItem(newItems[i]);

            this.doAdd(item);
        }

        return item;
    },

    /**
     * @private
     * @param item
     */
    doAdd: function(item) {
        var me = this,
            items = me.getItems(),
            index;

        if (!items.has(item)) {
            index = items.length;
            items.add(item);

            if (item.isInnerItem()) {
                me.insertInner(item);
            }

            item.setParent(me);

            me.onItemAdd(item, index);
        }
    },

    /**
     * Removes an item from this Container, optionally destroying it
     * @param {Object} item The item to remove
     * @param {Boolean} destroy Calls the Component's {@link Ext.Component#destroy destroy} method if true
     * @return {Ext.Component} this
     */
    remove: function(item, destroy) {
        var me = this,
            items = me.items,
            index = me.indexOf(item);

        if (destroy === undefined) {
            destroy = me.getAutoDestroy();
        }

        if (index !== -1) {
            item.setParent(null);
            items.remove(item);

            if (item.isInnerItem()) {
                me.removeInner(item);
            }

            me.onItemRemove(item, index);

            if (destroy) {
                item.destroy();
            }
        }

        return me;
    },

    /**
     * Removes all items currently in the Container, optionally destroying them all
     * @param {Boolean} destroy If true, {@link Ext.Component#destroy destroys} each removed Component
     * @return {Ext.Component} this
     */
    removeAll: function(destroy) {
        var me = this,
            items = me.items,
            item;

        if (destroy === undefined) {
            destroy = me.getAutoDestroy();
        }

        me.innerItems.length = 0;

        while (items.length > 0) {
            item = items.getAt(0);
            items.removeAt(0);

            me.onItemRemove(item, 0);

            item.setParent(null);

            if (destroy) {
                item.destroy();
            }
        }

        return me;
    },

    /**
     * Returns the Component for a given index in the Container's {@link #property-items}
     * @param {Number} index The index of the Component to return
     * @return {Ext.Component} The item at the specified index, if found
     */
    getAt: function(index) {
        return this.items.getAt(index);
    },


    /**
     * Removes the Component at the specified index:
     *
     *     myContainer.removeAt(0); //removes the first item
     *
     * @param {Number} index The index of the Component to remove
     */
    removeAt: function(index) {
        var item = this.getAt(index);

        if (item) {
            this.remove(item);
        }

        return this;
    },

    /**
     * @private
     */
    has: function(item) {
        return this.getItems().indexOf(item) != -1;
    },

    /**
     * @private
     */
    hasInnerItem: function(item) {
        return this.innerItems.indexOf(item) != -1;
    },

    /**
     * @private
     */
    indexOf: function(item) {
        //TODO Optimize me, this is way too slow since it uses Array.indexOf every time
        return this.getItems().indexOf(item);
    },

    /**
     * @private
     * @param item
     * @param index
     */
    insertInner: function(item, index) {
        var me = this,
            items = me.getItems().items,
            innerItems = me.innerItems,
            nextSibling;

        if (typeof index == 'number') {
            do {
                nextSibling = items[++index];
            } while (nextSibling && !nextSibling.isInnerItem());

            if (!nextSibling) {
                innerItems.push(item);
            }
            else {
                innerItems.splice(innerItems.indexOf(nextSibling), 0, item);
            }
        }
        else {
            innerItems.push(item);
        }

        return me;
    },

    /**
     * @private
     * @param item
     */
    removeInner: function(item) {
        Ext.Array.remove(this.innerItems, item);

        return this;
    },

    /**
     * Adds a child Component at the given index. For example, here's how we can add a new item, making it the first
     * child Component of this Container:
     *
     *     myContainer.insert(0, {xtype: 'panel', html: 'new item'});
     *
     * @param {Number} index The index to insert the Component at
     * @param {Object} item The Component to insert
     */
    insert: function(index, item) {
        var me = this,
            i;

        if (Ext.isArray(item)) {
            for (i = item.length - 1; i >= 0; i--) {
                me.insert(index, item[i]);
            }

            return me;
        }

        item = this.factoryItem(item);

        this.doInsert(index, item);

        return item;
    },

    /**
     * @private
     * @param index
     * @param item
     */
    doInsert: function(index, item) {
        var me = this,
            items = me.items,
            itemsLength = items.length,
            currentIndex, isInnerItem;

        isInnerItem = item.isInnerItem();

        if (index > itemsLength) {
            index = itemsLength;
        }

        if (items[index - 1] === item) {
            return me;
        }

        currentIndex = me.indexOf(item);

        if (currentIndex !== -1) {
            if (currentIndex < index) {
                index -= 1;
            }
            items.removeAt(currentIndex);
            if (isInnerItem) {
                me.removeInner(item);
            }
        }
        else {
            item.setParent(me);
        }

        items.insert(index, item);

        if (isInnerItem) {
            me.insertInner(item, index);
        }
        if (currentIndex !== -1) {
            me.onItemMove(item, index, currentIndex);
        }
        else {
            me.onItemAdd(item, index);
        }
    },

    /**
     * @private
     */
    insertFirst: function(item) {
        return this.insert(0, item);
    },

    /**
     * @private
     */
    insertLast: function(item) {
        return this.insert(this.getItems().length, item);
    },

    /**
     * @private
     */
    insertBefore: function(item, relativeToItem) {
        var index = this.indexOf(relativeToItem);

        if (index !== -1) {
            this.insert(index, item);
        }
        return this;
    },

    /**
     * @private
     */
    insertAfter: function(item, relativeToItem) {
        var index = this.indexOf(relativeToItem);

        if (index !== -1) {
            this.insert(index + 1, item);
        }
        return this;
    },

    /**
     * @private
     */
    onItemAdd: function(item, index) {
        this.getLayout().onItemAdd(item, index);

        if (this.initialized && item.isInnerItem() && !this.getActiveItem()) {
            this.setActiveItem(item);
        }

        if (this.initialized) {
            this.fireEvent('add', this, item, index);
        }

        if (this.isRendered() && item.setRendered(true)) {
            item.fireEvent('renderedchange', item, true);
        }
    },

    /**
     * @private
     */
    onItemRemove: function(item, index) {
        this.getLayout().onItemRemove(item, index);

        if (item === this.getActiveItem()) {
            this.setActiveItem(0);
        }

        this.fireEvent('remove', this, item, index);

        if (this.isRendered() && item.setRendered(false)) {
            item.fireEvent('renderedchange', item, false);
        }
    },

    /**
     * @private
     */
    onItemMove: function(item, toIndex, fromIndex) {
        if (item.isDocked()) {
            item.setDocked(null);
        }

        this.getLayout().onItemMove(item, toIndex, fromIndex);

        this.fireEvent('move', this, item, toIndex, fromIndex);
    },

    /**
     * @private
     */
    onItemCenteredChange: function(item, centered) {
        if (!item.isFloating() && !item.isDocked()) {
            if (centered) {
                this.removeInner(item);
            }
            else {
                this.insertInner(item, this.indexOf(item));
            }
        }

        this.getLayout().onItemCenteredChange(item, centered);
    },

    /**
     * @private
     */
    onItemFloatingChange: function(item, floating) {
        if (!item.isCentered() && !item.isDocked()) {
            if (floating) {
                this.removeInner(item);
            }
            else {
                this.insertInner(item, this.indexOf(item));
            }
        }

        this.getLayout().onItemFloatingChange(item, floating);
    },

    /**
     * @private
     */
    onItemDockedChange: function(item, docked, oldDocked) {
        if (!item.isCentered() && !item.isFloating()) {
            if (docked) {
                this.removeInner(item);
            }
            else {
                this.insertInner(item, this.indexOf(item));
            }
        }

        this.getLayout().onItemDockedChange(item, docked, oldDocked);
    },

    /**
     * @private
     */
    getInnerItems: function() {
        return this.innerItems;
    },

    /**
     * @private
     */
    applyActiveItem: function(item) {
        var innerItems = this.getInnerItems();

        // Make sure the items are already initialized
        this.getItems();

        if (typeof item == 'number') {
            item = Math.max(0, Math.min(item, innerItems.length - 1));

            return innerItems[item] || null;
        }
        else if (item) {
            if (!item.isComponent) {
                item = this.factoryItem(item);
            }

            //<debug error>
            if (!item.isInnerItem()) {
                Ext.Logger.error("Setting activeItem to be a non-inner item");
            }
            //</debug>

            return item;
        }
    },

    /**
     * @private
     */
    doSetActiveItem: function(newActiveItem, oldActiveItem) {
        if (oldActiveItem) {
            oldActiveItem.fireEvent('deactivate', oldActiveItem);
        }

        if (newActiveItem) {
            if (!this.has(newActiveItem)) {
                this.add(newActiveItem);
            }

            newActiveItem.fireEvent('activate', newActiveItem);

            this.getLayout().onActiveItemChange(newActiveItem, oldActiveItem);
        }
    },

    /**
     * @private
     */
    setRendered: function(rendered) {
        if (this.callParent(arguments)) {
            var items = this.items.items,
                i, ln;

            for (i = 0,ln = items.length; i < ln; i++) {
                items[i].setRendered(rendered);
            }

            return true;
        }

        return false;
    },

    /**
     * @private
     */
    getScrollableBehavior: function() {
        var behavior = this.scrollableBehavior;

        if (!behavior) {
            behavior = this.scrollableBehavior = new Ext.behavior.Scrollable(this);
        }

        return behavior;
    },

    /**
     * @private
     */
    applyScrollable: function(config) {
        this.getScrollableBehavior().setConfig(config);
    },

    getScrollable: function() {
        return this.getScrollableBehavior().getScrollView();
    },

    // Used by ComponentQuery to retrieve all of the items
    // which can potentially be considered a child of this Container.
    // This should be overriden by components which have child items
    // that are not contained in items. For example dockedItems, menu, etc
    // @private
    getRefItems: function(deep) {
        var items = this.getItems().items.slice(),
            ln = items.length,
            i, item;

        if (deep) {
            for (i = 0; i < ln; i++) {
                item = items[i];

                if (item.getRefItems) {
                    items = items.concat(item.getRefItems(true));
                }
            }
        }

        return items;
    },

    /**
     * Examines this container's <code>{@link #property-items}</code> <b>property</b>
     * and gets a direct child component of this container.
     * @param {String/Number} component This parameter may be any of the following:
     * <div><ul class="mdetail-params">
     * <li>a <b><code>String</code></b> : representing the <code>itemId</code>
     * or <code>{@link Ext.Component#getId id}</code> of the child component </li>
     * <li>a <b><code>Number</code></b> : representing the position of the child component
     * within the <code>{@link #property-items}</code> <b>property</b></li>
     * </ul></div>
     * <p>For additional information see {@link Ext.util.MixedCollection#get}.
     * @return Ext.Component The component (if found).
     */
    getComponent: function(component) {
        if (Ext.isObject(component)) {
            component = component.getItemId();
        }

        return this.getItems().get(component);
    },

    /**
     * Retrieves all descendant components which match the passed selector.
     * Executes an Ext.ComponentQuery.query using this container as its root.
     * @param {String} selector Selector complying to an Ext.ComponentQuery selector
     * @return {Array} Ext.Component's which matched the selector
     */
    query: function(selector) {
        return Ext.ComponentQuery.query(selector, this);
    },

    /**
     * Retrieves the first direct child of this container which matches the passed selector.
     * The passed in selector must comply with an Ext.ComponentQuery selector.
     * @param {String} selector An Ext.ComponentQuery selector
     * @return Ext.Component
     */
    child: function(selector) {
        return this.query('> ' + selector)[0] || null;
    },

    /**
     * Retrieves the first descendant of this container which matches the passed selector.
     * The passed in selector must comply with an Ext.ComponentQuery selector.
     * @param {String} selector An Ext.ComponentQuery selector
     * @return Ext.Component
     */
    down: function(selector) {
        return this.query(selector)[0] || null;
    },

    destroy: function() {
        this.removeAll(true);
        this.callParent(arguments);
    },

    //<deprecated product=touch since=2.0>
    onClassExtended: function(Class, members) {
        if ('onAdd' in members || 'onRemove' in members) {
            throw new Error("["+Class.$className+"] 'onAdd()' and 'onRemove()' methods " +
                            "no longer exist in Ext.Container, please use 'onItemAdd()' " +
                            "and 'onItemRemove()' instead }");
        }
    }
    //</deprecated

}, function() {
    this.addMember('defaultItemClass', this);

    //<deprecated product=touch since=2.0>
    /**
     * @deprecated 2.0.0
     * This method has been deprecated. Please use {@link #add} instead
     * @param {Array} items The array of items to add to this container
     * @return {Array} The array of items after they have been added
     */
    Ext.deprecateClassMethod(this, 'addAll', 'add');

    /**
     * @deprecated 2.0.0
     * Removes the docked item from the panel. This has been deprecated. Please use {@link #method-remove} instead/
     * @param {Object} item The item to remove
     * @param {Boolean} destroy Calls the Component's {@link Ext.Component#destroy destroy} method if true
     * @return {Ext.Component} this
     */
    Ext.deprecateClassMethod(this, 'removeDocked', 'remove');

    /**
     * @member Ext.Container
     * @property items
     * @type Ext.util.MixedCollection
     * The set of all items in this Container. Deprecated, please use {@link #getItems}
     * @deprecated 2.0.0
     */
    this.override({
        constructor: function(config) {
            config = config || {};

            var dockedItems = config.dockedItems,
                i, ln, item;
            
            /**
             * @cfg {Boolean/String/Object} scroll
             * @deprecated 2.0.0 Please use the {@link #scrollable} configuration.
             */
            if (config.scroll) {
                //<debug warn>
                Ext.Logger.deprecate("'scroll' config is deprecated, please use 'scrollable' instead.", this);
                //</debug>

                config.scrollable = config.scroll;
                delete config.scroll;
            }

            this.callParent(arguments);

            if (dockedItems) {
                //<debug warn>
                Ext.Logger.deprecate("'dockedItems' config is deprecated, please add all docked items inside the 'items' config with a 'docked' property indicating the docking position instead, i.e { /*...*/ docked: 'top' /*...*/ }");
                //</debug>

                dockedItems = Ext.Array.from(dockedItems);

                for (i = 0,ln = dockedItems.length; i < ln; i++) {
                    item = dockedItems[i];
                    if ('dock' in item) {
                        //<debug warn>
                        Ext.Logger.deprecate("'dock' config for docked items is deprecated, please use 'docked' instead");
                        //</debug>
                        item.docked = item.dock;
                    }
                }

                this.add(dockedItems);
            }
        },

        add: function() {
            var args = arguments;

            if (args.length > 1) {
                if (typeof args[0] == 'number') {
                    //<debug warn>
                    Ext.Logger.deprecate("add(index, item) method signature is deprecated, please use insert(index, item) instead");
                    //</debug>
                    return this.insert(args[0], args[1]);
                }
                //<debug warn>
                Ext.Logger.deprecate("Passing items as multiple arguments is deprecated, please use one single array of items instead");
                //</debug>
                args = [Array.prototype.slice.call(args)];
            }

            return this.callParent(args);
        },

        applyDefaults: function(defaults) {
            if (typeof defaults == 'function') {
                //<debug warn>
                Ext.Logger.deprecate("Passing a function as 'defaults' is deprecated. To add custom logics when " +
                    "'defaults' is applied to each item, have your own factoryItem() method in your sub-class instead");
                //</debug>
            }

            return this.callParent(arguments);
        },

        factoryItemWithDefaults: function(item) {
            var defaults = this.getDefaults(),
                customDefaults, ret;

            // Defaults is a function (must return a string, object, or class instance)
            if (typeof defaults == 'function') {
                customDefaults = defaults.call(this, item);
            }

            // String (must be the id of an existent component)
            if (typeof item == 'string') {
                //<debug warn>
                Ext.Logger.deprecate("Passing a string id of item ('"+item+"') is deprecated, please pass a reference to that item instead");
                //</debug>

                item = Ext.getCmp(item);
            }

            if (customDefaults) {
                this._defaults = customDefaults;
            }

            ret = this.callParent([item]);

            if (customDefaults) {
                this._defaults = defaults;
            }

            return ret;
        }
    });
    //</deprecated>
});
