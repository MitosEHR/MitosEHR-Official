/**
 * Utility class for generating different styles of message boxes. The framework provides a global singleton
 * {@link Ext.Msg} for common usage.
 *
 * Note that the MessageBox is asynchronous. Unlike a regular JavaScript `alert` (which will halt browser execution),
 * showing a MessageBox will not cause the code to stop. For this reason, if you have code that should only run _after_
 * some user feedback from the MessageBox, you must use a callback function (see the `fn` configuration option parameter
 * for the {@link #method-show show} method for more details).
 *
 * # Example usage:
 *
 * Basic alert:
 *
 *     @example preview
 *     Ext.Msg.alert('Title', 'The quick brown fox jumped over the lazy dog.', Ext.emptyFn);
 *
 * Prompt for user data and process the result using a callback:
 *
 *     @example preview
 *     Ext.Msg.prompt('Name', 'Please enter your name:', function(text) {
 *         // process text value and close...
 *     });
 *
 * Confirmation alert:
 *
 *     @example preview
 *     Ext.Msg.confirm("Confirmation", "Are you sure you want to do that?", Ext.emptyFn);
 *
 */
Ext.define('Ext.MessageBox', {
    extend  : 'Ext.Sheet',
    requires: [
        'Ext.Toolbar',
        'Ext.field.Text',
        'Ext.field.TextArea'
    ],

    config: {
        // @inherit
        ui: 'dark',

        // @inherit
        baseCls: Ext.baseCSSPrefix + 'msgbox',

        // @inherit
        cls: Ext.baseCSSPrefix + 'panel',

        /**
         * @cfg {String} iconCls
         * CSS class for the icon When null disables the icon.
         * @accessor
         */
        iconCls: null,

        /**
         * @cfg {String/Mixed} enterAnimation
         * Effect when the message box is being displayed.
         * @todo not implemented
         */
        enterAnimation: 'pop',

        /**
         * @cfg {String/Mixed} exitAnimation
         * Effect when the message box is being hidden.
         * @todo not implemented
         */
        exitAnimation: 'pop',

        /**
         * @cfg {Number} defaultTextHeight
         * The default height in pixels of the message box's multiline textarea if displayed.
         * @accessor
         */
        defaultTextHeight: 75,

        /**
         * @cfg {String} title
         * The title of this {@link Ext.MessageBox}.
         * @accessor
         */
        title: null,

        /**
         * @cfg {Array/Object} buttons
         * An array of buttons, or an object of a button to be displayed in the toolbar of this {@link Ext.MessageBox}.
         */
        buttons: null,

        /**
         * @cfg {String} msg
         * The message to be displayed in the {@link Ext.MessageBox}.
         * @accessor
         */
        msg: null,
        
        /**
         * @cfg {Object} promptConfig
         * The configuration to be passed if you want an {@link Ext.field.Text} or {@link Ext.field.TextArea} field
         * in your {@link Ext.MessageBox}.
         * Pass an object with the property "multiline" with a value of true, if you want the prompt to use a TextArea.
         * @accessor
         */
        promptConfig: null,

        // @inherit
        layout: {
            type: 'vbox',
            pack: 'center'
        }
    },

    statics: {
        OK    : {text: 'OK',     itemId: 'ok',  ui: 'action'},
        YES   : {text: 'Yes',    itemId: 'yes', ui: 'action'},
        NO    : {text: 'No',     itemId: 'no'},
        CANCEL: {text: 'Cancel', itemId: 'cancel'},

        INFO    : Ext.baseCSSPrefix + 'msgbox-info',
        WARNING : Ext.baseCSSPrefix + 'msgbox-warning',
        QUESTION: Ext.baseCSSPrefix + 'msgbox-question',
        ERROR   : Ext.baseCSSPrefix + 'msgbox-error',

        OKCANCEL: [
            {text: 'Cancel', itemId: 'cancel'},
            {text: 'OK',     itemId: 'ok',  ui : 'action'}
        ],
        YESNOCANCEL: [
            {text: 'Cancel', itemId: 'cancel'},
            {text: 'No',     itemId: 'no'},
            {text: 'Yes',    itemId: 'yes', ui: 'action'}
        ],
        YESNO: [
            {text: 'No',  itemId: 'no'},
            {text: 'Yes', itemId: 'yes', ui: 'action'}
        ]
    },

    // @inherit
    constructor: function(config) {
        config = config || {};

        if (config.hasOwnProperty('prompt')) {
            Ext.applyIf(config, {
                promptConfig: config.prompt
            });

            delete config.prompt;
        }

        if (config.hasOwnProperty('multiline') || config.hasOwnProperty('multiLine')) {
            config.promptConfig = config.promptConfig || {};
            Ext.applyIf(config.promptConfig, {
                multiLine: config.multiline || config.multiLine
            });

            delete config.multiline;
            delete config.multiLine;
        }

        this.callParent([config]);
    },

    /**
     * Creates a new {@link Ext.Toolbar} instance using {@link Ext.Factory}
     * @private
     */
    applyTitle: function(config) {
        if (typeof config == "string") {
            config = {
                title: config
            };
        }

        Ext.applyIf(config, {
            docked: 'top',
            cls   : this.getBaseCls() + '-title'
        });

        return Ext.factory(config, Ext.Toolbar, this.getTitle());
    },

    /**
     * Adds the new {@link Ext.Toolbar} instance into this container
     * @private
     */
    updateTitle: function(newTitle) {
        if (newTitle) {
            this.add(newTitle);
        }
    },

    /**
     * Adds the new {@link Ext.Toolbar} instance into this container
     * @private
     */
    updateButtons: function(newButtons) {
        var me = this;


        if (newButtons) {
            if (me.buttonsToolbar) {
                me.buttonsToolbar.removeAll();
                me.buttonsToolbar.setItems(newButtons);
            } else {
                me.buttonsToolbar = Ext.create('Ext.Toolbar', {
                    docked     : 'bottom',
                    defaultType: 'button',
                    layout     : {
                        type: 'hbox',
                        pack: 'center'
                    },
                    ui         : me.getUi(),
                    cls        : me.getBaseCls() + '-buttons',
                    items      : newButtons
                });

                me.add(me.buttonsToolbar);
            }
        }
    },

    /**
     * @private
     */
    applyMsg: function(config) {
        config = {
            html : config,
            cls  : this.getBaseCls() + '-text'
        };

        return Ext.factory(config, Ext.Component, this.getMsg());
    },

    /**
     * @private
     */
    updateMsg: function(newMsg) {
        if (newMsg) {
            this.add(newMsg);
        }
    },

    /**
     * @private
     */
    updateIconCls: function(newIconCls, oldIconCls) {
        if (newIconCls) {
            var cfg = {
                xtype : 'component',
                docked: 'left',
                width : 40,
                height: 40,
                cls   : newIconCls
            };
            // this.add(cfg);
        }
    },

    /**
     * @private
     */
    applyPromptConfig: function(prompt) {
        if (prompt) {
            var config = {
                label: false
            };

            if (typeof prompt == "object") {
                Ext.apply(config, prompt);
            }

            if (config.multiLine) {
                config.height = Ext.isNumber(config.multiLine) ? parseFloat(config.multiLine) : this.getDefaultTextHeight();
                return Ext.factory(config, Ext.field.TextArea, this.getPromptConfig());
            } else {
                return Ext.factory(config, Ext.field.Text, this.getPromptConfig());
            }
        }

        return prompt;
    },

    /**
     * @private
     */
    updatePromptConfig: function(newPrompt, oldPrompt) {
        if (newPrompt) {
            this.add(newPrompt);
        }

        if (oldPrompt) {
            this.remove(oldPrompt);
        }
    },

    // @private
    // pass `fn` config to show method instead
    onClick: function(button) {
        if (button) {
            var config = button.userConfig || {},
                initialConfig = button.getInitialConfig();

            if (typeof config.fn == 'function') {
                config.fn.call(
                    config.scope || null,
                    initialConfig.itemId || initialConfig.text,
                    config.input ? config.input.dom.value : null,
                    config
                );
            }

            if (config.cls) {
                    this.el.removeCls(config.cls);
                }

            if (config.input) {
                config.input.dom.blur();
            }
        }

        this.hide();
    },

    /**
     * Displays a new message box, or reinitializes an existing message box, based on the config options passed in. All
     * display functions (e.g. prompt, alert, etc.) on MessageBox call this function internally, although those calls
     * are basic shortcuts and do not support all of the config options allowed here.
     *
     * Example usage:
     *
     *     Ext.Msg.show({
     *        title: 'Address',
     *        msg: 'Please enter your address:',
     *        width: 300,
     *        buttons: Ext.MessageBox.OKCANCEL,
     *        multiLine: true,
     *        prompt : { maxlength : 180, autocapitalize : true },
     *        fn: saveAddress,
     *        iconCls: Ext.MessageBox.INFO
     *     });
     *
     * @param {Object} config An object with the following config options:
     *
     * @param {Object/Array} [config.buttons=false]
     * A button config object or Array of the same(e.g., `Ext.MessageBox.OKCANCEL` or `{text:'Foo', itemId:'cancel'}`),
     * or false to not show any buttons.
     *
     * @param {String} config.cls
     * A custom CSS class to apply to the message box's container element.
     *
     * @param {Number} [config.defaultTextHeight=75]
     * The default height in pixels of the message box's multiline textarea if displayed.
     *
     * @param {Function} config.fn
     * A callback function which is called when the dialog is dismissed by clicking on the configured buttons.
     * @param {String} config.fn.buttonId The itemId of the button pressed, one of: 'ok', 'yes', 'no', 'cancel'.
     * @param {String} config.fn.value Value of the input field if either `prompt` or `multiline` option is true.
     * @param {Object} config.fn.opt The config object passed to show.
     *
     * @param {Number} [config.width='auto']
     * A fixed width for the MessageBox.
     *
     * @param {Number} [config.height='auto']
     * A fixed height for the MessageBox.
     *
     * @param {Object} config.scope
     * The scope of the callback function
     *
     * @param {String} [config.icon='']
     * A CSS class that provides a background image to be used as the body icon for the dialog
     * (e.g. Ext.MessageBox.WARNING or 'custom-class').
     *
     * @param {Boolean} [config.modal=true]
     * False to allow user interaction with the page while the message box is displayed.
     *
     * @param {String} config.msg
     * A string that will replace the existing message box body text.
     * Defaults to the XHTML-compliant non-breaking space character `&#160;`.
     *
     * @param {Boolean} [config.multiline=false]
     * True to prompt the user to enter multi-line text.
     *
     * @param {Boolean} [config.prompt=false]
     * True to prompt the user to enter single-line text (defaults to false)
     *
     * @param {String} config.title
     * The title text.
     *
     * @param {String} config.value
     * The string value to set into the active textbox element if displayed.
     *
     * @return {Ext.MessageBox} this
     */
    show: function(initialConfig) {
        if (!initialConfig) {
            return this.callParent();
        }

        var config = Ext.Object.merge({}, {
            value: ''
        }, initialConfig);

        var buttons        = initialConfig.buttons || Ext.MessageBox.OK || [],
            buttonBarItems = [],
            userConfig     = initialConfig;

        Ext.each(buttons, function(buttonConfig) {
            if (!buttonConfig) {
                return;
            }

            buttonBarItems.push(Ext.apply({
                userConfig: userConfig,
                scope     : this,
                handler   : 'onClick'
            }, buttonConfig));
        }, this);

        config.buttons = buttonBarItems;

        this.setConfig(config);

        var prompt = this.getPromptConfig();
        if (prompt) {
            prompt.setValue('');
        }

        this.callParent();

        return this;
    },

    /**
     * Displays a standard read-only message box with an OK button (comparable to the basic JavaScript alert prompt). If
     * a callback function is passed it will be called after the user clicks the button, and the itemId of the button
     * that was clicked will be passed as the only parameter to the callback.
     *
     * @param {String} title The title bar text
     * @param {String} msg The message box body text
     * @param {Function} fn The callback function invoked after the message box is closed
     * @param {Object} [scope] The scope (`this` reference) in which the callback is executed.
     * Defaults to the browser window.
     * @return {Ext.MessageBox} this
     */
    alert: function(title, msg, fn, scope) {
        return this.show({
            title       : title,
            msg         : msg,
            buttons     : Ext.MessageBox.OK,
            promptConfig: false,
            fn          : fn,
            scope       : scope,
            iconCls     : Ext.MessageBox.INFO
        });
    },

    /**
     * Displays a confirmation message box with Yes and No buttons (comparable to JavaScript's confirm). If a callback
     * function is passed it will be called after the user clicks either button, and the id of the button that was
     * clicked will be passed as the only parameter to the callback (could also be the top-right close button).
     *
     * @param {String} title The title bar text
     * @param {String} msg The message box body text
     * @param {Function} fn The callback function invoked when user taps on the OK/Cancel button.
     * The button is passed as the first argument.
     * @param {Object} [scope] The scope (`this` reference) in which the callback is executed.
     * Defaults to the browser window.
     * @return {Ext.MessageBox} this
     */
    confirm: function(title, msg, fn, scope) {
        return this.show({
            title       : title,
            msg         : msg,
            buttons     : Ext.MessageBox.YESNO,
            promptConfig: false,
            scope       : scope,
            iconCls     : Ext.MessageBox.QUESTION,
            fn: function(button) {
                fn.call(scope, button);
            }
        });
     },

    /**
     * Displays a message box with OK and Cancel buttons prompting the user to enter some text (comparable to
     * JavaScript's prompt). The prompt can be a single-line or multi-line textbox. If a callback function is passed it
     * will be called after the user clicks either button, and the id of the button that was clicked (could also be the
     * top-right close button) and the text that was entered will be passed as the two parameters to the callback.
     *
     * Example usage:
     *
     *         Ext.Msg.prompt(
     *             'Welcome!',
     *             'What\'s your name going to be today?',
     *             function(value){
     *                 console.log(value)
     *             },
     *             null,
     *             false,
     *             null,
     *             { autocapitalize : true, placeholder : 'First-name please...' }
     *         );
     *
     * @param {String} title The title bar text
     * @param {String} msg The message box body text
     * @param {Function} fn The callback function invoked when the user taps on the OK/Cancel button, the button is
     * passed as the first argument, the entered string value is passed as the second argument
     * @param {Object} [scope] The scope (`this` reference) in which the callback is executed.
     * Defaults to the browser window.
     * @param {Boolean/Number} [multiLine=false] True to create a multiline textbox using the defaultTextHeight property,
     * or the height in pixels to create the textbox.
     * @param {String} [value=''] Default value of the text input element.
     * @param {Object} [promptConfig] A hash collection of input attribute values.
     *
     * @param {Boolean} [promptConfig.focus=false]
     * True to assert initial input focus.
     *
     * @param {String} [promptConfig.placeholder='']
     * String value rendered when the input field is empty.
     *
     * @param {String/Boolean} [promptConfig.autocapitalize='off']
     * True/on to capitalize the first letter of each word in the input value.
     *
     * @param {String/Boolean} [promptConfig.autocorrect='off']
     * True/on to enable spell-checking/autocorrect features if supported by the browser.
     *
     * @param {String/Boolean} [promptConfig.autocomplete='off']
     * True/on to enable autoCompletion of supplied text input values if supported by the browser.
     *
     * @param {Number} [promptConfig.maxlength=0]
     * Maximum number of characters allowed in the input if supported by the browser.
     *
     * @param {String} [promptConfig.type='text']
     * The type of input field. Possible values (if supported by the browser) may include (text, search, number, range,
     * color, tel, url, email, date, month, week, time, datetime) (defaults to 'text')
     *
     * @return {Ext.MessageBox} this
     */
    prompt: function(title, msg, fn, scope, multiLine, value, promptConfig) {
        return this.show({
            title       : title,
            msg         : msg,
            buttons     : Ext.MessageBox.OKCANCEL,
            scope       : scope,
            iconCls     : Ext.MessageBox.QUESTION,
            promptConfig: promptConfig || true,
            multiLine   : multiLine,
            value       : value,
            fn: function(button, inputValue) {
                fn.call(scope, button, inputValue);
            }
        });
    }
}, function() {
    // <deprecated product=touch since=2.0>
    this.override({
        /**
         * @cfg {String} icon
         * CSS class Use {@link #iconCls} instead.
         */

        /**
         * @param {String} icon A CSS classname or empty string to clear the icon
         * @return {Ext.MessageBox} this
         */
        setIcon: function(iconCls, doLayout){
            //<debug warn>
            Ext.Logger.deprecate("Ext.MessageBox#setIcon is deprecated, use setIconCls instead", 2);
            //</debug>
            this.setIconCls(iconCls);
            if (doLayout) {
                this.doComponentLayout();
            }
            return this;
        }
    });
    // </deprecated>

    /**
     * @class Ext.Msg
     * @singleton
     *
     * A global shared singleton instance of the {@link Ext.MessageBox} class. See {@link Ext.MessageBox} for
     * documentation.
     */
    Ext.Msg = Ext.create('Ext.MessageBox');
});

