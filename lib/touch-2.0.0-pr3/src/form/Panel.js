/**
 * The Form panel presents a set of form fields and provides convenient ways to load and save data. Usually a form
 * panel just contains the set of fields you want to display, ordered inside the items configuration like this:
 *
 *     var form = Ext.create('Ext.form.Panel', {
 *         items: [
 *             {
 *                 xtype: 'textfield',
 *                 name: 'name',
 *                 label: 'Name'
 *             },
 *             {
 *                 xtype: 'emailfield',
 *                 name: 'email',
 *                 label: 'Email'
 *             },
 *             {
 *                 xtype: 'passwordfield',
 *                 name: 'password',
 *                 label: 'Password'
 *             }
 *         ]
 *     });
 *
 * Here we just created a simple form panel which could be used as a registration form to sign up to your service. We
 * added a plain {@link Ext.field.Text text field} for the user's Name, an {@link Ext.field.Email email field} and
 * finally a {@link Ext.field.Password password field}. In each case we provided a {@link Ext.field.Field#name name}
 * config on the field so that we can identify it later on when we load and save data on the form.
 *
 * <h2>Loading data</h2>
 *
 * Using the form we created above, we can load data into it in a few different ways, the easiest is to use
 * {@link #setValues}:
 *
 *     form.setValues({
 *         name: 'Ed',
 *         email: 'ed@sencha.com',
 *         password: 'secret'
 *     });
 *
 * It's also easy to load {@link Ext.data.Model Model} instances into a form - let's say we have a User model and want
 * to load a particular instance into our form:
 *
 *     Ext.define('MyApp.model.User', {
 *         fields: ['name', 'email', 'password']
 *     });
 *
 *     var ed = Ext.create('MyApp.model.User', {
 *         name: 'Ed',
 *         email: 'ed@sencha.com',
 *         password: 'secret'
 *     });
 *
 *     form.setRecord(ed);
 *
 * <h2>Retrieving form data</h2>
 *
 * Getting data out of the form panel is simple and is usually achieve vai the {@link #getValues} method:
 *
 *     var values = form.getValues();
 *
 *     //values now looks like this:
 *     {
 *         name: 'Ed',
 *         email: 'ed@sencha.com',
 *         password: 'secret'
 *     }
 *
 * It's also possible to listen to the change events on individual fields to get more timely notification of changes
 * that the user is making. Here we expand on the example above with the User model, updating the model as soon as
 * any of the fields are changed:
 *
 *     var form = Ext.create('Ext.form.Panel', {
 *         listeners: {
 *             '> field': {
 *                 change: function(field, newValue, oldValue) {
 *                     ed.set(field.getName(), newValue);
 *                 }
 *             }
 *         },
 *         items: //as before
 *     });
 *
 * The above used a new capability of Touch 2.0, which enables you to specify listeners on child components of any
 * container. In this case, we attached a listener to the {@link Ext.field.Text#change change} event of each form
 * field that is a direct child of the form panel. Our listener gets the name of the field that fired the change event,
 * and updates our {@link Ext.data.Model Model} instance with the new value. For example, changing the email field
 * in the form will update the Model's email field.
 *
 * <h2>Submitting forms</h2>
 *
 * There are a few ways to submit form data. In our example above we have a Model instance that we have updated, giving
 * us the option to use the Model's {@link Ext.data.Model#save save} method to persist the changes back to our server,
 * without using a traditional form submission. Alternatively, we can send a normal browser form submit using the
 * {@link #method-submit} method:
 *
 *     form.submit({
 *         url: 'url/to/submit/to',
 *         method: 'POST',
 *         success: function() {
 *             alert('form submitted successfully!');
 *         }
 *     });
 *
 * In this case we provided the url to submit the form to inside the submit call - alternatively you can just set the
 * {@link #url} configuration when you create the form. We can specify other parameters (see {@link #method-submit} for a
 * full list), including callback functions for success and failure, which are called depending on whether or not the
 * form submission was successful. These functions are usually used to take some action in your app after your data
 * has been saved to the server side.
 */
Ext.define('Ext.form.Panel', {
    alternateClassName: 'Ext.form.FormPanel',
    extend  : 'Ext.Panel',
    xtype   : 'formpanel',
    requires: ['Ext.XTemplate', 'Ext.field.Checkbox', 'Ext.Ajax'],

    /**
     * @event submit
     * @preventable doSubmit
     * Fires upon successful (Ajax-based) form submission
     * @param {Ext.form.Panel} this This FormPanel
     * @param {Object} result The result object as returned by the server
     * @param {Ext.EventObject} e The event object
     */

    /**
     * @event beforesubmit
     * @preventable doBeforeSubmit
     * Fires immediately preceding any Form submit action.
     * Implementations may adjust submitted form values or options prior to execution.
     * A return value of <tt>false</tt> from this listener will abort the submission
     * attempt (regardless of standardSubmit configuration)
     * @param {Ext.form.Panel} this This FormPanel
     * @param {Object} values A hash collection of the qualified form values about to be submitted
     * @param {Object} options Submission options hash (only available when standardSubmit is false)
     */

    /**
     * @event exception
     * Fires when either the Ajax HTTP request reports a failure OR the server returns a success:false
     * response in the result payload.
     * @param {Ext.form.Panel} this This FormPanel
     * @param {Object} result Either a failed Ext.data.Connection request object or a failed (logical) server
     * response payload.
     */

    config: {
        // @inherit
        cls: Ext.baseCSSPrefix + 'form',

        /**
         * @cfg {Boolean} standardSubmit
         * Wether or not we want to perform a standard form submit.
         * @accessor
         */
        standardSubmit: false,

        /**
         * @cfg {String} url
         * The default Url for submit actions
         * @accessor
         */
        url: null,

        // @inherit
        elConfig: { tag: 'form' },

        /**
         * @cfg {Object} baseParams
         * Optional hash of params to be sent (when standardSubmit configuration is false) on every submit.
         * @accessor
         */
        baseParams : null,

        /**
         * @cfg {Ext.XTemplate/String/String[]} waitTpl
         * The defined waitMsg template.  Used for precise control over the masking agent used
         * to mask the FormPanel (or other Element) during form Ajax/submission actions. For more options, see
         * {@link #showMask} method.
         * @accessor
         */
        waitTpl: '<div class="{cls}">{message}&hellip;</div>',

        /**
         * @cfg {Object} submitOnAction
         * When this is set to true, the form will automatically submit itself whenever the 'action'
         * event fires on a field in this form. The action event usually fires whenever you press
         * go or enter inside a textfield.
         * @accessor
         */
        submitOnAction : true,

        /**
         * @cfg {Ext.dom.Element} maskTarget The target where the form mask will be shown.
         */
        maskTarget: null,

        /**
         * @cfg {Ext.data.Model} record The model instance of this form. Can by dynamically set at any time
         * @accessor
         */
        record: null,

        // @inherit
        layout: {
            type : 'vbox',
            align: 'stretch'
        },

        // @inherit
        scrollable: {
            scrollMethod: 'scrollposition'
        }
    },

    // @private
    initialize: function() {
        var me = this;
        me.callParent();

        me.on({
            action: 'onFieldAction',
            scope : me
        });

        me.element.on({
            submit: 'onSubmit',
            scope : this
        });
    },

    /**
     * Initializes the renderTpl.
     * @return {Ext.XTemplate} The renderTpl XTemplate instance.
     * @private
     */
    applyWaitTpl: function(waitTpl) {
        if (waitTpl) {
            if (Ext.isArray(waitTpl) || typeof waitTpl === "string") {
                waitTpl = Ext.create('Ext.XTemplate', waitTpl);
            }
        }
        return waitTpl;
    },

    /**
     * Loads matching fields from a model instance into this form
     * @param {Ext.data.Model} instance The model instance
     * @return {Ext.form.Panel} This form
     */
    setRecord: function(record) {
        var me = this;

        if (record && record.data) {
            me.setValues(record.data);
        }

        me._record = record;

        return this;
    },

    // @private
    onSubmit: function(e) {
        var me = this;
        if (e && !me.getStandardSubmit()) {
            e.stopEvent();
        }

        me.fireAction('submit', [me, me.getValues(true), e], 'doSubmit');

    },

    doSubmit: function(me, values, e) {
        if (e) {
            e.stopEvent();
        }
    },

    // @private
    onFieldAction: function(field) {
        if (this.getSubmitOnAction()) {
            field.blur();
            this.submit();
        }
    },

    /**
     * Performs a Ajax-based submission of form values (if standardSubmit is false) or otherwise
     * executes a standard HTML Form submit action.
     * @param {Object} options Unless otherwise noted, options may include the following:
     * <ul>
     * <li><b>url</b> : String
     * <div class="sub-desc">
     * The url for the action (defaults to the form's {@link #url url}.)
     * </div></li>
     *
     * <li><b>method</b> : String
     * <div class="sub-desc">
     * The form method to use (defaults to the form's method, or POST if not defined)
     * </div></li>
     *
     * <li><b>params</b> : String/Object
     * <div class="sub-desc">
     * The params to pass
     * (defaults to the FormPanel's baseParams, or none if not defined)
     * Parameters are encoded as standard HTTP parameters using {@link Ext#urlEncode}.
     * </div></li>
     *
     * <li><b>headers</b> : Object
     * <div class="sub-desc">
     * Request headers to set for the action
     * (defaults to the form's default headers)
     * </div></li>
     *
     * <li><b>autoAbort</b> : Boolean
     * <div class="sub-desc">
     * <tt>true</tt> to abort any pending Ajax request prior to submission (defaults to false)
     * Note: Has no effect when standardSubmit is enabled.
     * </div></li>
     *
     * <li><b>submitDisabled</b> : Boolean
     * <div class="sub-desc">
     * <tt>true</tt> to submit all fields regardless of disabled state (defaults to false)
     * Note: Has no effect when standardSubmit is enabled.
     * </div></li>
     *
     * <li><b>waitMsg</b> : String/Config
     * <div class="sub-desc">
     * If specified, the value is applied to the {@link #waitTpl} if defined, and rendered to the
     * {@link #maskTarget} prior to a Form submit action.
     * </div></li>
     *
     * <li><b>success</b>: function
     * <div class="sub-desc">
     * The callback that will be invoked after a successful response. A response is successful if
     * a response is received from the server and is a JSON object where the success property is set
     * to true, {"success": true}
     *
     *  The function is passed the following parameters:
     * <ul>
     * <li>form : Ext.form.Panel The form that requested the action</li>
     * <li>result : The result object returned by the server as a result of the submit request.</li>
     * </ul>
     * </div></li>
     *
     * <li><b>failure</b>: function
     * <div class="sub-desc">
     * The callback that will be invoked after a
     * failed transaction attempt. The function is passed the following parameters:
     * <ul>
     * <li>form : The Ext.form.Panel that requested the submit.</li>
     * <li>result : The failed response or result object returned by the server which performed the operation.</li>
     * </ul>
     * </div></li>
     *
     * <li><b>scope</b> : Object
     * <div class="sub-desc">
     * The scope in which to call the callback functions (The this reference for the callback functions).
     * </div></li>
     * </ul>
     *
     * @return {Ext.data.Connection} The request object
     */
    submit: function(options) {
        var me = this,
            form = me.element.dom || {},
            formValues;

        options = Ext.apply({
            url : me.getUrl() || form.action,
            submit: false,
            method : form.method || 'post',
            autoAbort : false,
            params : null,
            waitMsg : null,
            headers : null,
            success : null,
            failure : null
        }, options || {});

        formValues = me.getValues(me.getStandardSubmit() || !options.submitDisabled);

        return me.fireAction('beforesubmit', [me, formValues, options], 'doBeforeSubmit');
    },

    doBeforeSubmit: function(me, formValues, options) {
        var form = me.element.dom || {};

        if (me.getStandardSubmit()) {
            if (options.url && Ext.isEmpty(form.action)) {
                form.action = options.url;
            }

            form.method = (options.method || form.method).toLowerCase();
            form.submit();
        }
        else {
            if (options.waitMsg) {
                me.showMask(options.waitMsg);
            }

            return Ext.Ajax.request({
                url: options.url,
                method: options.method,
                rawData: Ext.urlEncode(Ext.apply(
                    Ext.apply({}, me.getBaseParams() || {}),
                    options.params || {},
                    formValues
                )),
                autoAbort: options.autoAbort,
                headers: Ext.apply(
                    {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    options.headers || {}
                ),
                scope: me,
                callback: function(callbackOptions, success, response) {
                    var me = this,
                        responseText = response.responseText,
                        failureFn;

                    me.hideMask();

                    failureFn = function() {
                        if (Ext.isFunction(options.failure)) {
                            options.failure.call(options.scope || me, me, response, responseText);
                        }
                        me.fireEvent('exception', me, response);
                    };

                    if (success) {
                        response = Ext.decode(responseText);
                        success = !!response.success;
                        if (success) {
                            if (Ext.isFunction(options.success)) {
                                options.success.call(options.scope || me, me, response, responseText);
                            }
                            me.fireEvent('submit', me, response);
                        } else {
                            failureFn();
                        }
                    }
                    else {
                        failureFn();
                    }
                }
            });
        }
    },

    /**
     * Updates a model instance with the current values of this form
     * @param {Ext.data.Model} instance The model instance
     * @param {Boolean} enabled <tt>true</tt> to update the Model with values from enabled fields only
     * @return {Ext.form.Panel} This form
     */
    updateRecord: function(instance, enabled) {
        var fields, values, name;

        if (instance && (fields = instance.fields)) {
            values = this.getValues(enabled);
            for (name in values) {
                if (values.hasOwnProperty(name) && fields.containsKey(name)) {
                    instance.set(name, values[name]);
                }
            }
        }
        return this;
    },

    /**
     * Sets the values of form fields in bulk. Example usage:
     *
     *     myForm.setValues({
     *         name: 'Ed',
     *         crazy: true,
     *         username: 'edspencer'
     *     });
     *
     * If there groups of checkbox fields with the same name, pass their values in an array. For example:
     *
     *     myForm.setValues({
     *         name: 'Jacky',
     *         crazy: false,
     *         hobbies: [
     *             'reading',
     *             'cooking',
     *             'gaming'
     *         ]
     *     });
     *
     * @param {Object} values field name => value mapping object
     * @return {Ext.form.Panel} This form
     */
    setValues: function(values) {
        var fields = this.getFields(),
            name, field, value;

        values = values || {};

        for (name in values) {
            if (values.hasOwnProperty(name)) {
                field = fields[name];
                value = values[name];
                if (field) {
                    if (Ext.isArray(field)) {
                        field.forEach(function(f) {
                            if (f.isRadio) {
                                f.setGroupValue(value);
                            } else if (Ext.isArray(values[name])) {
                                f.setChecked((value.indexOf(f.getValue()) != -1));
                            } else {
                                f.setChecked((value == f.getValue()));
                            }
                        });
                    } else {
                        if (field.setChecked) {
                            field.setChecked(value);
                        } else {
                            field.setValue(value);
                        }
                    }
                }
            }
        }

        return this;
    },

    /**
     * Returns an object containing the value of each field in the form, keyed to the field's name.
     * For groups of checkbox fields with the same name, it will be arrays of values. For examples:

     <pre><code>
     {
         name: "Jacky Nguyen", // From a TextField
         favorites: [
             'pizza',
             'noodle',
             'cake'
         ]
     }
     </code></pre>

     * @param {Boolean} enabled <tt>true</tt> to return only enabled fields
     * @return {Object} Object mapping field name to its value
     */
    getValues: function(enabled) {
        var fields = this.getFields(),
            values = {},
            field, name, ln, i;

        for (name in fields) {
            if (fields.hasOwnProperty(name)) {
                if (Ext.isArray(fields[name])) {
                    values[name] = [];

                    ln = fields[name].length;

                    for (i = 0; i < ln; i++) {
                        field = fields[name][i];

                        if (!field.getChecked) {
                            values[name] = field.getValue();

                            //<debug>
                            throw new Error("Ext.form.Panel: [getValues] You have multiple fields with the same 'name' configuration of '" + name + "' in your form panel (#" + this.id + ").");
                            //</debug>

                            break;
                        }

                        if (!(enabled && field.getDisabled())) {
                            if (field.isRadio) {
                                values[name] = field.getGroupValue();
                            } else {
                                values[name].push(field.getValue());
                            }
                        }


                    }
                } else {
                    field = fields[name];

                    if (!(enabled && field.getDisabled())) {
                        if (field.isCheckbox) {
                            values[name] = (field.getChecked()) ? field.getValue() : null;
                        } else {
                            values[name] = field.getValue();
                        }
                    }
                }
            }
        }

        return values;
    },

    /**
     * Resets all fields in the form back to their original values
     * @return {Ext.form.Panel} This form
     */
    reset: function() {
        this.getFieldsAsArray().forEach(function(field) {
            field.reset();
        });

        return this;
    },

    /**
     * A convenient method to enable all fields in this forms
     * @return {Ext.form.Panel} This form
     */
    enable: function() {
        this.getFieldsAsArray().forEach(function(field) {
            field.enable();
        });

        return this;
    },

    /**
     * A convenient method to disable all fields in this forms
     * @return {Ext.form.Panel} This form
     */
    disable: function() {
        this.getFieldsAsArray().forEach(function(field) {
            field.disable();
        });

        return this;
    },

    getFieldsAsArray: function() {
        var fields = [],
            getFieldsFrom = function(item) {
                if (item.isField) {
                    fields.push(item);
                }

                if (item.isContainer) {
                    item.getItems().each(getFieldsFrom);
                }
            };

        this.getItems().each(getFieldsFrom);

        return fields;
    },

    /**
     * @private
     * Returns all {@link Ext.Field field} instances inside this form
     * @param byName return only fields that match the given name, otherwise return all fields.
     * @return {Object/Array} All field instances, mapped by field name; or an array if byName is passed
     */
    getFields: function(byName) {
        var fields = {},
            itemName;

        var getFieldsFrom = function(item) {
            if (item.isField) {
                itemName = item.getName();

                if ((byName && itemName == byName) || typeof byName == 'undefined') {
                    if (fields.hasOwnProperty(itemName)) {
                        if (!Ext.isArray(fields[itemName])) {
                            fields[itemName] = [fields[itemName]];
                        }

                        fields[itemName].push(item);
                    } else {
                        fields[itemName] = item;
                    }
                }

            }

            if (item.isContainer) {
                item.items.each(getFieldsFrom);
            }
        };

        this.items.each(getFieldsFrom);

        return (byName) ? (fields[byName] || []) : fields;
    },

    getFieldsFromItem: Ext.emptyFn,

    /**
     * Shows a generic/custom mask over a designated Element.
     * @param {String/Object} cfg Either a string message or a configuration object supporting
     * the following options:
     *
     *     {
     *         message : 'Please Wait',
     *         transparent : false,
     *         target  : Ext.getBody(),  //optional target Element
     *         cls : 'form-mask',
     *         customImageUrl : 'trident.jpg'
     *     }
     *
     * This object is passed to the {@link #waitTpl} for use with a custom masking implementation.
     * @param {String/HTMLElement/Ext.Element} target The target Element instance or Element id to use
     * as the masking agent for the operation (defaults the container Element of the component)
     * @return {Ext.form.Panel} This form
     */
    showMask: function(cfg, target) {
        cfg = Ext.isString(cfg) ? {message : cfg} : cfg;
        var me = this,
            waitTpl = me.getWaitTpl();

        if (cfg && waitTpl) {
            target = Ext.get(target || cfg.target) || me.getEl();
            me.setMaskTarget(target);
            if (target) {
                target.mask(waitTpl.apply(cfg));
            }
        }
        return me;
    },

    /**
     * Hides a previously shown wait mask (See {@link #showMask})
     * @return {Ext.form.Panel} this
     */
    hideMask: function() {
        var me = this,
            maskTarget = me.getMaskTarget();

        if (maskTarget) {
            maskTarget.unmask();
            me.setMaskTarget(null);
        }
        return me;
    }
}, function() {
    //<deprecated product=touch since=2.0>
    this.override({
        /**
         * @deprecated Please use {@link #setRecord} instead
         */
        loadRecord: function(instance) {
            return this.setRecord.apply(this, arguments);
        },

        /**
         * @deprecated Please use {@link #setRecord} instead
         */
        loadModel: function() {
            return this.setRecord.apply(this, arguments);
        },

        constructor: function(config) {
            /**
             * @cfg {Ext.dom.Element} waitMsgTarget The target of any mask shown on this form.
             * @deprecated 2.0.0 Please use {@link #maskTarget} instead
             */
            if (config && config.hasOwnProperty('waitMsgTarget')) {
                config.maskTarget = config.waitMsgTarget;
                delete config.waitMsgTarget;
            }

            this.callParent([config]);
        }
    });
    //</deprecated>

    /**
     * (Shortcut to {@link #loadRecord} method) Loads matching fields from a model instance into this form
     * @param {Ext.data.Model} instance The model instance
     * @return {Ext.form.Panel} this
     */
    Ext.form.Panel.prototype.load = Ext.form.Panel.prototype.loadModel;
});
