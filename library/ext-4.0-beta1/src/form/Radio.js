/**
 * @class Ext.form.Radio
 * @extends Ext.form.Checkbox

Single radio field. Same as Checkbox, but provided as a convenience for automatically setting the input type. 
Radio grouping is handled automatically by the browser if you give each radio in a group the same name.

__Labeling:__
In addition to the {@link Ext.form.Labelable standard field labeling options}, radio buttons 
may be given an optional {@link #boxLabel} which will be displayed immediately to the right of the input. Also 
see {@link Ext.form.RadioGroup} for a convenient method of grouping related radio buttons.

__Values:__
The main value of a Radio field is a boolean, indicating whether or not the radio is checked.

The following values will check the radio:
* `true`
* `'true'`
* `'1'`
* `'on'`

Any other value will uncheck it.

In addition to the main boolean value, you may also specify a separate {@link #inputValue}. This will be
used as the `value` attribute of the radio input and will be submitted as the parameter value when the form
is {@link Ext.form.Basic#submit submitted}. You will want to set this value if you have multiple radio buttons
with the same {@link #name}, as is almost always the case.

__Example usage:__

    new Ext.form.FormPanel({
        title      : 'Order Form',
        width      : 300,
        bodyPadding: 10,
        renderTo   : Ext.getBody(),
        items: [
            {
                xtype      : 'fieldcontainer',
                fieldLabel : 'Size',
                defaultType: 'radiofield',
                defaults: {
                    hideLabel: true,
                    flex     : 1
                },
                layout: 'hbox',
                items: [
                    {
                        boxLabel  : 'M',
                        name      : 'size',
                        inputValue: 'm',
                        id        : 'radio1'
                    }, {
                        boxLabel  : 'L',
                        name      : 'size',
                        inputValue: 'l',
                        id        : 'radio2'
                    }, {
                        boxLabel  : 'XL',
                        name      : 'size',
                        inputValue: 'xl',
                        id        : 'radio3'
                    }
                ]
            },
            {
                xtype      : 'fieldcontainer',
                fieldLabel : 'Color',
                defaultType: 'radiofield',
                defaults: {
                    hideLabel: true,
                    flex     : 1
                },
                layout: 'hbox',
                items: [
                    {
                        boxLabel  : 'Blue',
                        name      : 'color',
                        inputValue: 'blue',
                        id        : 'radio4'
                    }, {
                        boxLabel  : 'Grey',
                        name      : 'color',
                        inputValue: 'grey',
                        id        : 'radio5'
                    }, {
                        boxLabel  : 'Black',
                        name      : 'color',
                        inputValue: 'black',
                        id        : 'radio6'
                    }
                ]
            }
        ],
        bbar: [
            {
                text: 'Smaller Size',
                handler: function() {
                    var radio1 = Ext.getCmp('radio1'),
                        radio2 = Ext.getCmp('radio2'),
                        radio3 = Ext.getCmp('radio3');

                    //if L is selected, change to M
                    if (radio2.getValue()) {
                        radio1.setValue(true);
                        return;
                    }

                    //if XL is selected, change to L
                    if (radio3.getValue()) {
                        radio2.setValue(true);
                        return;
                    }

                    //if nothing is set, set size to S
                    radio1.setValue(true);
                }
            },
            {
                text: 'Larger Size',
                handler: function() {
                    var radio1 = Ext.getCmp('radio1'),
                        radio2 = Ext.getCmp('radio2'),
                        radio3 = Ext.getCmp('radio3');

                    //if M is selected, change to L
                    if (radio1.getValue()) {
                        radio2.setValue(true);
                        return;
                    }

                    //if L is selected, change to XL
                    if (radio2.getValue()) {
                        radio3.setValue(true);
                        return;
                    }

                    //if nothing is set, set size to XL
                    radio3.setValue(true);
                }
            },
            '-',
            {
                text: 'Select color',
                menu: {
                    indent: false,
                    items: [
                        {
                            text: 'Blue',
                            handler: function() {
                                var radio = Ext.getCmp('radio4');
                                radio.setValue(true);
                            }
                        },
                        {
                            text: 'Grey',
                            handler: function() {
                                var radio = Ext.getCmp('radio5');
                                radio.setValue(true);
                            }
                        },
                        {
                            text: 'Black',
                            handler: function() {
                                var radio = Ext.getCmp('radio6');
                                radio.setValue(true);
                            }
                        }
                    ]
                }
            }
        ]
    });

 * @constructor
 * Creates a new Radio
 * @param {Object} config Configuration options
 * @xtype radio
 * @docauthor Robert Dougan <rob@sencha.com>
 * @markdown
 */
Ext.define('Ext.form.Radio', {
    extend:'Ext.form.Checkbox',
    alias: ['widget.radiofield', 'widget.radio'],
    requires: ['Ext.form.RadioManager'],
    
    isRadio: true,
    
    // private
    inputType: 'radio',
    
    /**
     * If this radio is part of a group, it will return the selected value
     * @return {String}
     */
    getGroupValue: function() {
        var selected = this.getManager().getChecked(this.name);
        return selected ? selected.inputValue : null;
    },

    /**
     * Sets either the checked/unchecked status of this Radio, or, if a string value
     * is passed, checks a sibling Radio of the same name whose value is the value specified.
     * @param value {String/Boolean} Checked value, or the value of the sibling radio button to check.
     * @return {Boolean} The value that was set
     */
    setRawValue: function(v) {
        var me = this,
            active;
            
        if (Ext.isBoolean(v)) {
            Ext.form.Radio.superclass.setRawValue.call(me, v);
        } else {
            active = this.getManager().getWithValue(me.name, v).getAt(0);
            if (active) {
                active.setRawValue(true);
            }
        }
        return me.checked;
    },
    
    // inherit docs
    onChange: function(newVal, oldVal) {
        var me = this;
        me.callParent(arguments);
        
        if (newVal) {
            this.getManager().getByName(me.name).each(function(item){
                if (item !== me) {
                    item.setValue(false);
                }
            }, me);
        }
    },
    
    // inherit docs
    beforeDestroy: function(){
        Ext.form.Radio.superclass.beforeDestroy.call(this);
        this.getManager().removeByKey(this.id);
    },
    
    // inherit docs
    getManager: function() {
        return Ext.form.RadioManager;
    }
});
