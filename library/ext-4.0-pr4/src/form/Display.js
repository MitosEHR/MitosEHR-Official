/**
 * @class Ext.form.Display
 * @extends Ext.form.BaseField
 * <p>A display-only text field which is not validated and not submitted. This is useful for when you want
 * to display a value from a form's {@link Ext.form.Basic#load loaded data} but do not want to allow the
 * user to edit or submit that value. The value can be optionally {@link #htmlEncode HTML encoded} if it contains
 * HTML markup that you do not want to be rendered.</p>
 * <p>If you have more complex content, or need to include components within the displayed content, also
 * consider using a {@link Ext.form.FieldContainer} instead.</p>
 * <p>Example:</p>
 * <pre><code>new Ext.form.FormPanel({
    title: 'Final Score',
    items: [{
        xtype: 'combo',
        name: 'game',
        forceSelection: true,
        store: currentGamesStore
    }, {
        xtype: 'displayfield',
        fieldLabel: 'Home',
        name: 'home_score',
        value: '<span class="empty">[select a game]</span>'
    }, {
        xtype: 'displayfield',
        fieldLabel: 'Visitor',
        name: 'visitor_score',
        value: '<span class="empty">[select a game]</span>'
    }],
    buttons: [{
        text: 'Update',
        handler: function() {
            var formPanel = this.up('form');
            formPanel.getForm().load({
                url: '/current-scores.php?game=' + formPanel.child('[name=game]').getValue()
            });
        }
    }]
});</code></pre>

 * @constructor
 * Creates a new DisplayField.
 * @param {Object} config Configuration options
 *
 * @xtype displayfield
 */
Ext.define('Ext.form.Display', {
    extend:'Ext.form.BaseField',
    alias: 'widget.displayfield',
    requires: ['Ext.util.Format', 'Ext.XTemplate'],
    alternateClassName: 'Ext.form.DisplayField',

    /**
     * @cfg {String} fieldCls The default CSS class for the field (defaults to <tt>"x-form-display-field"</tt>)
     */
    fieldCls: Ext.baseCSSPrefix + 'form-display-field',

    /**
     * @cfg {Boolean} htmlEncode <tt>false</tt> to skip HTML-encoding the text when rendering it (defaults to
     * <tt>false</tt>). This might be useful if you want to include tags in the field's innerHTML rather than
     * rendering them as string literals per the default logic.
     */
    htmlEncode: false,

    validateOnChange: false,

    initEvents: Ext.emptyFn,

    submitValue: false,

    isValid: function() {
        return true;
    },

    validate: function() {
        return true;
    },

    getRawValue: function() {
        return this.rawValue;
    },

    setRawValue: function(value) {
        var me = this;
        value = Ext.value(value, '');
        me.rawValue = value;
        if (me.rendered) {
            me.inputEl.dom.innerHTML = me.htmlEncode ? Ext.util.Format.htmlEncode(value) : value;
        }
        return value;
    },

    // private
    getContentTarget: function() {
        return this.inputEl;
    }

    /**
     * @cfg {String} inputType
     * @hide
     */
    /**
     * @cfg {Boolean} disabled
     * @hide
     */
    /**
     * @cfg {Boolean} readOnly
     * @hide
     */
    /**
     * @cfg {Boolean} validateOnChange
     * @hide
     */
    /**
     * @cfg {Number} checkChangeEvents
     * @hide
     */
    /**
     * @cfg {Number} checkChangeBuffer
     * @hide
     */
},

function() {
    this.prototype.fieldSubTpl = new Ext.XTemplate(
        '<div id="{id}" class="{fieldCls}"></div>',
        {
            compiled: true,
            disableFormats: true
        }
    );
});
