/**
 * Created by JetBrains PhpStorm.
 * User: mitosehr
 * Date: 3/23/12
 * Time: 2:06 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('App.view.patientfile.encounter.ICDs', {
    extend:'Ext.panel.Panel',
    alias:'widget.icdsPanel',
    border:false,
    bodyBorder:false,
    bodyPadding:5,
    emptyText:'Diagnostic Codes',
    initComponent:function () {
        var me = this;

        Ext.define('Ext.ux.CustomTrigger', {
            extend: 'Ext.form.field.Trigger',
            alias: 'widget.customtrigger',
            hideLabel    : true,
            triggerTip:'Click to clear selection.',
            qtip:'Clearable Combo Box',
            trigger1Class:'x-form-select-trigger',
            trigger2Class:'x-form-clear-trigger',

            onTriggerClick: function() {
                this.destroy();
            },

            onRender:function (ct, position) {
                this.callParent(arguments);
                var id = this.getId();
                this.triggerConfig = {
                    tag:'div', cls:'x-form-twin-triggers', style:'display:block;', cn:[
                        {tag:"img", style:Ext.isIE ? 'margin-left:-6;height:19px' : '', src:Ext.BLANK_IMAGE_URL, id:"trigger2" + id, name:"trigger2" + id, cls:"x-form-trigger " + this.trigger2Class}
                    ]};
                this.triggerEl.replaceWith(this.triggerConfig);
                this.triggerEl.on('mouseup', function () {
                        this.onTriggerClick()
                    },
                    this);
                var trigger2 = Ext.get("trigger2" + id);
                trigger2.addClsOnOver('x-form-trigger-over');
            }
        });

        me.items = [
            {
                xtype:'fieldset',
                title:'ICDs Live Sarch',
                padding:'10 15',
                margin:'0 0 3 0',
                layout:'anchor',
                items:[
                    {
                        xtype:'liveicdxsearch',
                        emptyText:me.emptyText,
                        listeners:{
                            scope:me,
                            select:me.onLiveIcdSelect
                        }
                    },
                    {
                        xtype:'container',
                        itemId:'idcs',
                        layout:'hbox'
                    }
                ]

            }
        ];

        me.callParent(arguments);

    },


    onLiveIcdSelect:function(field, model){
        field.up('fieldset').getComponent('idcs').add({
            xtype:'customtrigger',
            value:model[0].data.code,
            name : 'icdxCodes',
            width:80,
            //readOnly:true,
            listeners:{
                afterrender:function(btn){
                    Ext.create('Ext.tip.ToolTip', {
                        target: btn.id,
                        html: model[0].data.code_text
                    });
                    btn.setEditable(false);
                }
            }
        });

        field.reset();

    }


});