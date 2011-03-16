Ext.define("themer.views.Options", {
    extend: 'Ext.panel.Panel',
    alias: 'widget.options',

    initComponent: function() {
        Ext.apply(this, {
            dock : 'left',
            width: 250,
            
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            
            defaults: {
                margin   : '5 5 0 5',
                frame    : true,
                bodyStyle: 'padding:5px'
            },
            
            items: [
                {
                    title: 'Base',
                    
                    items: [
                        {xtype: 'optionfield', name : 'base-color'},
                        {xtype: 'optionfield', name : 'base-gradient'}
                    ]
                },
                
                {
                    title: 'Ext.Panel',
                    
                    items: [
                        {xtype: 'optionfield', name : 'panel-base-color'},
                        {xtype: 'optionfield', name : 'panel-border-radius'},
                        {xtype: 'optionfield', name : 'panel-border-color'}
                    ]
                },
                
                {
                    xtype : 'panel',
                    border: false,
                    height: 50,
                    
                    bodyStyle: 'text-align:center',
                    
                    items: [
                        {
                            xtype: 'button',
                            text : 'Generate',
                            scale: 'large',
                            color: 'green',
                            
                            scope  : this,
                            handler: this.onGenerate
                        }
                    ]
                }
            ]
            
            // dockedItems: [
            //     {
            //         xtype: 'toolbar',
            //         dock : 'bottom',
            //         
            //         items: [
            //             {
            //                 xtype: 'button',
            //                 text : 'Generate',
            //                 scale: 'large',
            //                 color: 'green',
            //                 
            //                 scope  : this,
            //                 handler: this.onGenerate
            //             }
            //         ]
            //     }
            // ]
        });
        
        themer.views.Options.superclass.initComponent.call(this);
    },
    
    /**
     * Called when the generate button is pressed.
     * Grabs the current SCSS and sends it to the controller
     */
    onGenerate: function() {
        var scss = this.getSCSS();
        
        Ext.dispatch({
            controller: 'compiler',
            action    : 'compile',
            args      : scss
        });
    },
    
    /**
     * Returns all the SCSS in a string form.
     */
    getSCSS: function() {
        var values    = this.getValues(),
            newValues = [],
            scss      = '';
        
        Ext.each(values, function(value) {
            newValues.push('$' + value.join(':'));
        }, this);
        
        scss = newValues.join(';');
        if (scss) scss = scss + ';';
        
        return scss;
    },
    
    /**
     * 
     */
    getValues: function() {
        var fields = this.el.select('.x-form-field'),
            values = [];
        
        fields.each(function(field) {
            var field        = Ext.getCmp(field.parent().parent().id),
                value        = field.getValue(),
                defaultValue = field.model.get('default');

            if (value && value != defaultValue) {
                values.push([field.name, value]);
            }
            
        }, this);
        
        return values;
    }
});
