/**
 * This component is used in {@link Ext.navigation.View} to control animations in the toolbar. You should never need to
 * interact with the component directly, unless you are subclassing it.
 * @private
 */
Ext.define('Ext.navigation.Bar', {
    extend: 'Ext.Container',
    xtype: 'navigationbar',

    requires: [
        'Ext.Button',
        'Ext.TitleBar',
        'Ext.Spacer',
        'Ext.util.SizeMonitor'
    ],

    // private
    isToolbar: true,

    config: {
        // @inherit
        baseCls: Ext.baseCSSPrefix + 'toolbar',

        // @inherit
        cls: Ext.baseCSSPrefix + 'navigation-bar',

        /**
         * @cfg {String} ui
         * Style options for Toolbar. Either 'light' or 'dark'.
         * @accessor
         */
        ui: 'dark',

        /**
         * @cfg {String} title
         * The title of the toolbar.
         * @accessor
         */
        title: null,

        /**
         * @cfg {String} defaultType
         * The default xtype to create.
         * @accessor
         */
        defaultType: 'button',

        /**
         * @hide
         */
        layout: {
            type: 'hbox'
        },

        /**
         * @cfg {Array/Object} items The child items to add to this NavigationBar. The {@link #defaultType} of
         * a NavigationBar is {@link Ext.Button}, so you do not need to specify an `xtype` if you are adding
         * buttons.
         *
         * You can also give items a `align` configuration which will align the item to the `left` or `right` of
         * the NavigationBar.
         * @accessor
         * @hide
         */
        items: [{
            align: 'left',
            ui: 'back',
            hidden: true
        }],

        /**
         * @cfg {String} defaultBackButtonText
         * The text to be displayed on the back button if:
         * a) The previous view does not have a title
         * b) The {@link #useTitleForBackButtonText} configuration is true.
         * @hide
         */
        defaultBackButtonText: 'Back',

        /**
         * @cfg {Number} animationDuration
         * @hide
         */
        animationDuration: 300,

        /**
         * @cfg {Boolean} useTitleForBackButtonText
         * Set to true if you always want to display the {@link #defaultBackButtonText} as the text
         * on the back button. False if you want to use the previous views title.
         * @hide
         */
        useTitleForBackButtonText: false
    },

    /**
     * The minmum back button width allowed.
     * @private
     */
    minBackButtonWidth: 80,

    /**
     * @cfg {Array} backButtonStack
     * @private
     */
    initialize: function() {
        this.backButtonStack = [];
        this.animating = false;

        this.onSizeMonitorChange = Ext.Function.createThrottled(this.onSizeMonitorChange, 50, this);

        this.callParent();

        this.on({
            painted: 'onPainted',
            erased: 'onErased'
        });

        if (!this.backButton) {
            this.backButton = this.down('button[ui=back]');
        }
    },

    onPainted: function() {
        this.painted = true;
        this.onSizeMonitorChange();

        this.sizeMonitor.refresh();
    },

    onErased: function() {
        this.painted = false;
    },

    updateUseTitleForBackButtonText: function(newUseTitleForBackButtonText) {
        if (this.backButton) {
            if (newUseTitleForBackButtonText) {
                this.backButton.setText(this.getDefaultBackButtonText());
            } else {
                this.backButton.setText(this.backButtonStack[this.backButtonStack.length - 1]);
            }
        }

        if (this.proxy) {
            this.proxy.backButton.setText(this.backButton.getText());
            this.proxy.backButton.show();
        }

        this.onSizeMonitorChange();
    },

    applyItems: function(items) {
        if (!this.initialized) {
            var defaults = this.getDefaults() || {},
                leftBox, rightBox, spacer;

            this.leftBox = leftBox = this.add({
                xtype: 'container',
                style: 'position: relative',
                layout: {
                    type: 'hbox',
                    align: 'center'
                }
            });
            this.spacer = spacer = this.add({
                xtype: 'component',
                style: 'position: relative',
                flex: 1
            });
            this.rightBox = rightBox = this.add({
                xtype: 'container',
                style: 'position: relative',
                layout: {
                    type: 'hbox',
                    align: 'center'
                }
            });
            this.titleComponent = this.add({
                xtype: 'title',
                hidden: defaults.hidden,
                centered: true
            });

            this.sizeMonitor = new Ext.util.SizeMonitor({
                element: this.renderElement,
                callback: this.onSizeMonitorChange,
                scope: this
            });

            this.doAdd = this.doBoxAdd;
            this.doInsert = this.doBoxInsert;
        }

        this.callParent(arguments);
    },

    doBoxAdd: function(item) {
        if (item.config.align == 'right') {
            this.rightBox.add(item);
        }
        else {
            this.leftBox.add(item);
        }
    },

    doBoxInsert: function(index, item) {
        if (item.config.align == 'right') {
            this.rightBox.add(item);
        }
        else {
            this.leftBox.add(item);
        }
    },

    // @private
    updateTitle: function(newTitle) {
        this.titleComponent.setTitle(newTitle);
        this.updateNavigationBarProxy(newTitle);
    },

    onSizeMonitorChange: function() {
        if (this.backButton) {
            this.backButton.renderElement.setWidth(null);
        }

        this.refreshNavigationBarProxy();

        var properties = this.getNavigationBarProxyProperties();

        if (this.backButton) {
            this.backButton.renderElement.setWidth(properties.backButton.width);
        }

        this.titleComponent.renderElement.setStyle('-webkit-transform', null);
        this.titleComponent.renderElement.setWidth(properties.title.width);
        this.titleComponent.renderElement.setLeft(properties.title.left);
    },

    getBackButtonAnimationProperties: function() {
        var me = this,
            element = me.renderElement,
            backButtonElement = me.backButton.renderElement,
            titleElement = me.titleComponent.renderElement,
            minButtonOffset = element.getWidth() / 3,
            proxyProperties = this.getNavigationBarProxyProperties(),
            buttonOffset, buttonGhostOffset;

        buttonOffset = titleElement.getX() - element.getX();
        buttonGhostOffset = element.getX() - backButtonElement.getX() - backButtonElement.getWidth();

        buttonOffset = Math.max(buttonOffset, minButtonOffset);

        return {
            element: {
                from: {
                    left: buttonOffset,
                    width: proxyProperties.backButton.width,
                    opacity: 0
                },
                to: {
                    left: 0,
                    width: proxyProperties.backButton.width,
                    opacity: 1
                }
            },

            ghost: {
                from: null,
                to: {
                    left: buttonGhostOffset,
                    opacity: 0
                }
            }
        };
    },

    getBackButtonAnimationReverseProperties: function() {
        var me = this,
            element = me.renderElement,
            backButtonElement = me.backButton.renderElement,
            titleElement = me.titleComponent.renderElement,
            minButtonGhostOffset = element.getWidth() / 3,
            proxyProperties = this.getNavigationBarProxyProperties(),
            buttonOffset, buttonGhostOffset;

        buttonOffset = element.getX() - backButtonElement.getX() - backButtonElement.getWidth();
        buttonGhostOffset = titleElement.getX() - backButtonElement.getWidth();

        buttonGhostOffset = Math.max(buttonGhostOffset, minButtonGhostOffset);

        return {
            element: {
                from: {
                    left: buttonOffset,
                    width: proxyProperties.backButton.width,
                    opacity: 0
                },
                to: {
                    left: 0,
                    width: proxyProperties.backButton.width,
                    opacity: 1
                }
            },

            ghost: {
                from: null,
                to: {
                    left: buttonGhostOffset,
                    opacity: 0
                }
            }
        };
    },

    getTitleAnimationProperties: function() {
        var me = this,
            element = me.renderElement,
            titleElement = me.titleComponent.renderElement,
            proxyProperties = this.getNavigationBarProxyProperties(),
            titleOffset, titleGhostOffset;

        titleOffset = element.getWidth() - titleElement.getX();
        titleGhostOffset = -(titleElement.getX() + titleElement.getWidth());

        return {
            element: {
                from: {
                    left: titleOffset,
                    width: proxyProperties.title.width,
                    opacity: 0
                },
                to: {
                    left: proxyProperties.title.left,
                    width: proxyProperties.title.width,
                    opacity: 1
                }
            },
            ghost: {
                from: titleElement.getLeft(),
                to: {
                    left: titleGhostOffset,
                    opacity: 0
                }
            }
        };
    },

    getTitleAnimationReverseProperties: function() {
        var me = this,
            element = me.renderElement,
            titleElement = me.titleComponent.renderElement,
            proxyProperties = this.getNavigationBarProxyProperties(),
            ghostLeft = 0,
            titleOffset, titleGhostOffset;

        ghostLeft = titleElement.getLeft();
        titleElement.setLeft(0);

        titleOffset = element.getX() - titleElement.getX() - titleElement.getWidth();
        titleGhostOffset = element.getX() + element.getWidth();

        return {
            element: {
                from: {
                    left: titleOffset,
                    width: proxyProperties.title.width,
                    opacity: 0
                },
                to: {
                    left: proxyProperties.title.left,
                    width: proxyProperties.title.width,
                    opacity: 1
                }
            },
            ghost: {
                from: ghostLeft,
                to: {
                    left: titleGhostOffset,
                    opacity: 0
                }
            }
        };
    },

    animate: function(element, from, to, onEnd) {
        var config = {
            element: element,
            easing: 'ease-in-out',
            duration: this.getAnimationDuration()
        };

        if (onEnd) {
            config.onEnd = onEnd;
        }

        if (Ext.os.is.Android) {
            if (from) {
                config.from = {
                    left: from.left,
                    opacity: from.opacity
                };

                if (from.width) {
                    config.from.width = from.width;
                }
            }

            if (to) {
                config.to = {
                    left: to.left,
                    opacity: to.opacity
                };

                if (to.width) {
                    config.to.width = to.width;
                }
            }
        } else {
            if (from) {
                config.from = {
                    transform: {
                        translateX: from.left
                    },
                    opacity: from.opacity
                };

                if (from.width) {
                    config.from.width = from.width;
                }
            }

            if (to) {
                config.to = {
                    transform: {
                        translateX: to.left
                    },
                    opacity: to.opacity
                };

                if (to.width) {
                    config.to.width = to.width;
                }
            }
        }

        Ext.Animator.run(config);
    },

    getBackButtonText: function() {
        return (this.getUseTitleForBackButtonText()) ? this.getDefaultBackButtonText() : this.backButtonStack[this.backButtonStack.length - 1];
    },

    pushAnimated: function(title) {
        if (this.animating) {
            return;
        }

        this.animating = true;

        var backButtonText = this.titleComponent.getTitle() || this.getDefaultBackButtonText();

        this.backButtonStack.push(backButtonText);

        this.updateNavigationBarProxy(title, (backButtonText) ? this.getBackButtonText() : null);

        this.pushBackButtonAnimated(backButtonText);
        this.pushTitleAnimated(title);
    },

    push: function(title) {
        if (this.animating) {
            return;
        }

        var backButtonText = this.titleComponent.getTitle() || this.getDefaultBackButtonText();

        this.backButtonStack.push(backButtonText);

        this.updateNavigationBarProxy(title, (backButtonText) ? this.getBackButtonText() : null);

        this.pushBackButton(backButtonText);
        this.pushTitle(title);
    },

    popAnimated: function(title) {
        if (this.animating) {
            return;
        }

        this.animating = true;

        this.backButtonStack.pop();

        var backButtonText = this.backButtonStack[this.backButtonStack.length - 1];

        this.updateNavigationBarProxy(title, (backButtonText) ? this.getBackButtonText() : null);

        this.popBackButtonAnimated(backButtonText);
        this.popTitleAnimated(title);
    },

    pop: function(title) {
        if (this.animating) {
            return;
        }

        this.backButtonStack.pop();

        var backButtonText = this.backButtonStack[this.backButtonStack.length - 1];

        this.updateNavigationBarProxy(title, (backButtonText) ? this.getBackButtonText() : null);

        this.popBackButton(backButtonText);
        this.popTitle(title);
    },

    pushBackButton: function(title) {
        this.backButton.setText(title);
        this.backButton.show();

        var properties = this.getBackButtonAnimationProperties(),
            to = properties.element.to;

        if (to.left) {
            this.backButton.setLeft(to.left);
        }

        if (to.width) {
            this.backButton.setWidth(to.width);
        }
    },

    pushBackButtonAnimated: function(title) {
        var me = this;

        var backButton = me.backButton,
            previousTitle = backButton.getText(),
            backButtonElement = backButton.renderElement,
            properties = me.getBackButtonAnimationProperties(),
            buttonGhost;

        //if there is a previoustitle, there should be a buttonGhost. so create it.
        if (previousTitle && !this.isHidden()) {
            buttonGhost = me.createProxy(backButton);
        }

        //update the back button, and make sure it is visible
        backButton.setText(this.getBackButtonText());
        backButton.show();

        //animate the backButton, which always has the new title
        me.animate(backButtonElement, properties.element.from, properties.element.to, function() {
            me.animating = false;
        });

        //if there is a buttonGhost, we must animate it too.
        if (buttonGhost) {
            me.animate(buttonGhost, properties.ghost.from, properties.ghost.to, function() {
                buttonGhost.remove();
            });
        }
    },

    popBackButton: function(title) {
        this.backButton.setText(null);

        if (title) {
            this.backButton.setText(this.getBackButtonText());
        } else {
            this.backButton.hide();
        }

        var properties = this.getBackButtonAnimationReverseProperties(),
            to = properties.element.to;

        if (to.left) {
            this.backButton.setLeft(to.left);
        }

        if (to.width) {
            this.backButton.setWidth(to.width);
        }
    },

    popBackButtonAnimated: function(title) {
        var me = this;

        if (!me.backButton) {
            me.backButton = me.add({
                align: 'left',
                ui: 'back'
            });
        }

        var backButton = me.backButton,
            previousTitle = backButton.getText(),
            backButtonElement = backButton.renderElement,
            properties = me.getBackButtonAnimationReverseProperties(),
            buttonGhost;

        //if there is a previoustitle, there should be a buttonGhost. so create it.
        if (previousTitle && !this.isHidden()) {
            buttonGhost = me.createProxy(backButton);
        }

        //update the back button, and make sure it is visible
        if (title && me.backButtonStack.length) {
            backButton.setText(this.getBackButtonText());
            backButton.show();

            me.animate(backButtonElement, properties.element.from, properties.element.to);
        } else {
            backButton.hide();
        }

        //if there is a buttonGhost, we must animate it too.
        if (buttonGhost) {
            me.animate(buttonGhost, properties.ghost.from, properties.ghost.to, function() {
                buttonGhost.remove();

                if (!title) {
                    backButton.setText(null);
                }
            });
        }
    },

    pushTitle: function(newTitle) {
        var title = this.titleComponent,
            titleElement = title.renderElement,
            properties = this.getTitleAnimationProperties(),
            to = properties.element.to;

        title.setTitle(newTitle);

        if (to.left) {
            titleElement.setLeft(to.left);
        }

        if (to.width) {
            titleElement.setWidth(to.width);
        }
    },

    pushTitleAnimated: function(newTitle) {
        var me = this;

        var backButton = me.backButton,
            previousTitle = (backButton) ? backButton.getText() : null,
            title = me.titleComponent,
            titleElement = title.renderElement,
            properties = me.getTitleAnimationProperties(),
            titleGhost;

        //if there is a previoustitle, there should be a buttonGhost. so create it.
        if (previousTitle) {
            titleGhost = me.createProxy(title, true);
        }

        title.setTitle(newTitle);

        //animate the new title
        me.animate(titleElement, properties.element.from, properties.element.to);

        //if there is a titleGhost, we must animate it too.
        if (titleGhost) {
            me.animate(titleGhost, properties.ghost.from, properties.ghost.to, function() {
                titleGhost.remove();
            });
        }
    },

    popTitle: function(newTitle) {
        var title = this.titleComponent,
            titleElement = title.renderElement,
            properties = this.getTitleAnimationReverseProperties(),
            to = properties.element.to;

        title.setTitle(newTitle);

        if (to.left) {
            titleElement.setLeft(to.left);
        }

        if (to.width) {
            titleElement.setWidth(to.width);
        }
    },

    popTitleAnimated: function(newTitle) {
        var me = this;

        var backButton = me.backButton,
            previousTitle = me.titleComponent.getTitle(),
            title = me.titleComponent,
            titleElement = title.renderElement,
            properties = me.getTitleAnimationReverseProperties(),
            titleGhost;

        //if there is a previoustitle, there should be a buttonGhost. so create it.
        if (previousTitle) {
            titleGhost = me.createProxy(title, true);
        }

        title.setTitle(newTitle || '');

        //animate the new title
        me.animate(titleElement, properties.element.from, properties.element.to, function() {
            me.animating = false;
        });

        //if there is a titleGhost, we must animate it too.
        if (titleGhost) {
            me.animate(titleGhost, properties.ghost.from, properties.ghost.to, function() {
                titleGhost.remove();
            });
        }
    },

    createNavigationBarProxy: function() {
        if (this.proxy) {
            return;
        }

        //create a titlebar for the proxy
        this.proxy = Ext.create('Ext.TitleBar', {
            items: [
                {
                    xtype: 'button',
                    ui: 'back',
                    text: ''
                }
            ],
            title: this.backButtonStack[0]
        });

        this.proxy.backButton = this.proxy.down('button[ui=back]');

        //add the proxy to the body
        Ext.getBody().appendChild(this.proxy.renderElement);

        this.proxy.renderElement.setStyle('position', 'absolute');
        this.proxy.element.setStyle('visbility', 'hidden');
        this.proxy.renderElement.setX(0);
        this.proxy.renderElement.setY(-1000);
    },

    getNavigationBarProxyProperties: function() {
        return {
            title: {
                left: this.proxy.titleComponent.renderElement.getLeft(),
                width: this.proxy.titleComponent.renderElement.getWidth()
            },
            backButton: {
                left: this.proxy.backButton.renderElement.getLeft(),
                width: this.proxy.backButton.renderElement.getWidth()
            }
        };
    },

    refreshNavigationBarProxy: function() {
        if (!this.proxy) {
            this.createNavigationBarProxy();
        }

        this.proxy.renderElement.setWidth(this.renderElement.getWidth());
        this.proxy.renderElement.setHeight(this.renderElement.getHeight());

        this.proxy.refreshTitlePosition();
    },

    updateNavigationBarProxy: function(newTitle, oldTitle) {
        var me = this;

        if (!me.proxy) {
            me.createNavigationBarProxy();
        }

        this.proxy.renderElement.setWidth(this.renderElement.getWidth());
        this.proxy.renderElement.setHeight(this.renderElement.getHeight());

        this.proxy.setTitle(newTitle);

        if (oldTitle) {
            this.proxy.backButton.setText(oldTitle);
            this.proxy.backButton.show();
        } else {
            this.proxy.backButton.hide();
        }

        this.proxy.refreshTitlePosition();
    },

    /**
     * Creates a proxy element of the passed element, and positions it in the same position, using absolute positioning
     * @private
     */
    createProxy: function(component, useParent) {
        var element = (useParent) ? component.element.getParent() : component.element;

        var ghost = element.dom.cloneNode(true);
        ghost.id = element.id + '-proxy';

        //insert it into the toolbar
        element.getParent().dom.appendChild(ghost);

        //set the x/y
        ghost = Ext.get(ghost);
        ghost.setStyle('position', 'absolute');
        ghost.setY(element.getY());
        ghost.setX(element.getX());

        return ghost;
    }
});
