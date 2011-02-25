/**
 * @class Ext.form.Checkbox
 * @extends Ext.form.BaseField
 * <p>Single checkbox field. Can be used as a direct replacement for traditional checkbox fields. Also
 * serves as a parent class for {@link Ext.form.Radio radio buttons}.</p>
 * <p><b>Labeling:</b> In addition to the {@link Ext.form.Labelable standard field labeling options}, checkboxes
 * may be given an optional {@link #boxLabel} which will be displayed immediately to the right of
 * the checkbox. Also see {@link Ext.form.CheckboxGroup} for a convenient method of grouping related checkboxes.</p>
 * <p><b>Values:</b> The main value of a checkbox is a boolean, indicating whether or not the checkbox is checked.
 * The following values will check the checkbox:<code>true</code>, <code>'true'</code>, <code>'1'</code>, or
 * <code>'on'</code>. Any other value will uncheck the checkbox.</p>
 * <p>In addition to the main boolean value, you may also specify a separate {@link #inputValue}. This will be
 * used as the "value" attribute of the checkbox and will be submitted as the parameter value when the form
 * is {@link Ext.form.Basic#submit submitted}. You will want to set this value if you have multiple checkboxes
 * with the same {@link #name}. If not specified, the value "on" will be used.</p>
 * <p>Example usage:</p>
 * <pre><code>new Ext.form.FormPanel({
    renderTo: Ext.getBody(),
    bodyPadding: 10,
    width: 300,
    title: 'Pizza Order',
    items: [
        //...
        {
            xtype: 'fieldcontainer',
            fieldLabel: 'Toppings',
            defaultType: 'checkboxfield',
            defaults: {
                hideLabel: true
            },
            items: [{
                boxLabel: 'Anchovies',
                name: 'topping',
                inputValue: '1'
            }, {
                boxLabel: 'Artichoke Hearts',
                name: 'topping',
                inputValue: '2'
            }, {
                boxLabel: 'Bacon',
                name: 'topping',
                inputValue: '3'
            }
            // ...
            ]
        }
    ]
});</code></pre>
 *
 * @constructor
 * Creates a new Checkbox
 * @param {Object} config Configuration options
 * 
 * @xtype checkboxfield
 */
Ext.define('Ext.form.Checkbox', {
    extend: 'Ext.form.BaseField',
    alias: ['widget.checkboxfield', 'widget.checkbox'],
    requires: ['Ext.XTemplate', 'Ext.form.CheckboxManager'],

    isCheckbox: true,
    
    /**
     * @cfg {String} focusCls The CSS class to use when the checkbox receives focus (defaults to <tt>''</tt>)
     */
    focusCls: '',
    /**
     * @cfg {String} fieldCls The default CSS class for the checkbox (defaults to <tt>'x-form-field'</tt>)
     */
    /**
     * @cfg {Boolean} checked <tt>true</tt> if the checkbox should render initially checked (defaults to <tt>false</tt>)
     */
    checked: false,

    /**
     * @cfg {Array} checkChangeEvents
     * <p>List of event names that will trigger checking for changes in the checkbox's state. See
     * {@link Ext.form.BaseField#checkChangeEvents} for details. Defaults to <tt>['click', 'change']</tt> for checkboxes.</p>
     */
    checkChangeEvents: ['click', 'change'],

    /**
     * @cfg {String} boxLabel An optional text label that will appear after the checkbox.
     */

    /**
     * @cfg {String} inputValue The value that should go into the generated input element's value attribute and
     * should be used as the parameter value when submitting as part of a form. Defaults to <tt>"on"</tt>.
     */
    inputValue: 'on',

    inputType: 'checkbox',
    
    /**
     * @cfg {Function} handler A function called when the {@link #checked} value changes (can be used instead of
     * handling the {@link #change change event}). The handler is passed the following parameters:
     * <div class="mdetail-params"><ul>
     * <li><b>checkbox</b> : Ext.form.Checkbox<div class="sub-desc">The Checkbox being toggled.</div></li>
     * <li><b>checked</b> : Boolean<div class="sub-desc">The new checked state of the checkbox.</div></li>
     * </ul></div>
     */

    /**
     * @cfg {Object} scope An object to use as the scope ('this' reference) of the {@link #handler} function
     * (defaults to this Checkbox).
     */

    // private
    onRe: /^on$/i,

    /**
     * @hide
     * Overridden and disabled. The checkbox component does not support standard valid/invalid marking.
     * @method
     */
    markInvalid : Ext.emptyFn,
    /**
     * @hide
     * Overridden and disabled. The checkbox component does not support standard valid/invalid marking.
     * @method
     */
    clearInvalid : Ext.emptyFn,

    initComponent: function(){
        this.callParent(arguments);
        this.getManager().add(this);
    },

    initValue: function() {
        var me = this,
            checked = !!me.checked;

        /**
         * The original value of the field as configured in the {@link #checked} configuration, or
         * as loaded by the last form load operation if the form's {@link Ext.form.Basic#trackResetOnLoad trackResetOnLoad}
         * setting is <code>true</code>.
         * @type Mixed
         * @property originalValue
         */
        me.originalValue = me.lastValue = checked;

        // Set the initial checked state
        me.setValue(checked);
    },

    // private
    onRender : function(ct, position) {
        var me = this;
        Ext.applyIf(me.subTplData, {
            boxLabel: me.boxLabel,
            inputValue: me.inputValue
        });
        Ext.form.Checkbox.superclass.onRender.call(me, ct, position);
    },

    /**
     * Returns the checked state of the checkbox.
     * @return {Boolean} True if checked, else false
     */
    getRawValue: function() {
        if (this.rendered) {
            this.checked = this.inputEl.dom.checked;
        }
        return this.checked;
    },

    /**
     * Returns the checked state of the checkbox.
     * @return {Boolean} True if checked, else false
     */
    getValue: function() {
        return this.getRawValue();
    },

    getSubmitValue: function() {
        return this.getValue() ? this.inputValue : null;
    },

    /**
     * Sets the checked state of the checkbox.
     * @param {Boolean/String} value The following values will check the checkbox:
     * <code>true, 'true', '1', or 'on'</code>, as well as a String that matches the {@link #inputValue}.
     * Any other value will uncheck the checkbox.
     * @return {Boolean} the new checked state of the checkbox
     */
    setRawValue: function(value) {
        var me = this,
            check,
            inputValue = me.inputValue,
            checked = (value === true || value === 'true' || value === '1' ||
                      ((Ext.isString(value) && inputValue) ? value == inputValue : me.onRe.test(value)));

        if (me.rendered) {
            check = me.inputEl.dom;
            check.checked = checked;
            check.defaultChecked = checked;
        }

        me.checked = me.rawValue = checked;
        return checked;
    },

    /**
     * @method setValue
     * Sets the checked state of the checkbox, and invokes change detection.
     * @param {Boolean/String} checked The following values will check the checkbox:
     * <code>true, 'true', '1', or 'on'</code>, as well as a String that matches the {@link #inputValue}.
     * Any other value will uncheck the checkbox.
     * @return {Ext.form.Checkbox} this
     */
    setValue: function(checked) {
        var me = this;

        // If an array of strings is passed, find all checkboxes in the group with the same name as this
        // one and check all those whose inputValue is in the array, unchecking all the others. This is to
        // facilitate setting values from Ext.form.Basic#setValues, but is not publicly documented as we
        // don't want users depending on this behavior.
        if (Ext.isArray(checked)) {
            me.getManager().getByName(me.name).each(function(cb) {
                cb.setValue(Ext.Array.contains(checked, cb.inputValue));
            });
        } else {
            me.callParent(arguments);
        }

        return me;
    },

    valueToRaw: function(value) {
        // No extra conversion for checkboxes
        return value;
    },

    /**
     * @private
     * Called when the checkbox's checked state changes. Invokes the {@link #handler} callback
     * function if specified.
     */
    onChange: function(newVal, oldVal) {
        var me = this,
            handler = me.handler;
        if (handler) {
            handler.call(me.scope || me, me, newVal);
        }
        Ext.form.Checkbox.superclass.onChange.call(this, newVal, oldVal);
    },

    getManager: function() {
        return Ext.form.CheckboxManager;
    }
},

function() {
    this.prototype.fieldSubTpl = new Ext.XTemplate(
        '<input id="{id}" type="{type}" ',
        '<tpl if="name">name="{name}" </tpl>',
        '<tpl if="tabIdx">tabIndex="{tabIdx}" </tpl>',
        '<tpl if="inputValue">value="{inputValue}" </tpl>',
        'class="{fieldCls} {typeCls}" autocomplete="off"/>',
        '<tpl if="boxLabel">',
            '<label class="' + Ext.baseCSSPrefix + 'form-cb-label" for="{id}">{boxLabel}</label>',
        '</tpl>',
        {
            disableFormats: true,
            compiled: true
        }
    );
});
