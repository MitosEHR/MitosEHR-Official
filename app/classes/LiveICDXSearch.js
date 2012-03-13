/**
 * Created by JetBrains PhpStorm.
 * User: ernesto
 * Date: 6/27/11
 * Time: 8:43 AM
 * To change this template use File | Settings | File Templates.
 *
 *
 * @namespace Services.liveIDCXSearch
 */
Ext.define('App.classes.LiveICDXSearch', {
	extend       : 'Ext.form.field.ComboBox',
	alias        : 'widget.liveicdxsearch',
	hideLabel    : true,
    triggerTip:'Click to clear selection.',
    spObj:'',
    spForm:'',
    spExtraParam:'',
    qtip:'Clearable Combo Box',
    trigger1Class:'x-form-select-trigger',
    trigger2Class:'x-form-clear-trigger',
	initComponent: function() {
		var me = this;

		Ext.define('liveICDXSearchModel', {
			extend: 'Ext.data.Model',
			fields: [
				{name: 'id', type: 'int'},
				{name: 'code', type: 'string'},
				{name: 'code_text', type: 'string'},
				{name: 'code_type', type: 'string'}
			],
			proxy : {
				type  : 'direct',
				api   : {
					read: Services.liveIDCXSearch
				},
				reader: {
					totalProperty: 'totals',
					root         : 'rows'
				}
			}
		});

		me.store = Ext.create('Ext.data.Store', {
			model   : 'liveICDXSearchModel',
			pageSize: 25,
			autoLoad: false
		});

		Ext.apply(this, {
			store       : me.store,
			displayField: 'code',
			valueField  : 'code',
			emptyText   : me.emptyText,
			typeAhead   : false,
			//hideTrigger : true,
			minChars    : 1,
            anchor      : '100%',
            //multiSelect:true,
			listConfig  : {
				loadingText: 'Searching...',
				//emptyText	: 'No matching posts found.',
				//---------------------------------------------------------------------
				// Custom rendering template for each item
				//---------------------------------------------------------------------
				getInnerTpl: function() {
					return '<div class="search-item">{code}: {code_text}</div>';
				}
			},
			pageSize    : 10,
            listeners:{
                scope:me,
                beforedeselect:me.codeBeforeSelected,
                select:me.codeSelected
            }
		}, null);

		me.callParent();
	},

    codeBeforeSelected:function(combo){
        this.oldValue = combo.getRawValue();
    },

    codeSelected:function(combo, record){
        if(this.oldValue){
            combo.setRawValue(this.oldValue + record[0].data.code + ', ');
        }else{
            combo.setRawValue(record[0].data.code + ', ');
        }
    },

    onRender:function (ct, position) {
        this.callParent(arguments);
        var id = this.getId();
        this.triggerConfig = {
            tag:'div', cls:'x-form-twin-triggers', style:'display:block;width:46px;', cn:[
                {tag:"img", style:Ext.isIE ? 'margin-left:-3;height:19px' : '', src:Ext.BLANK_IMAGE_URL, id:"trigger1" + id, name:"trigger1" + id, cls:"x-form-trigger " + this.trigger1Class},
                {tag:"img", style:Ext.isIE ? 'margin-left:-6;height:19px' : '', src:Ext.BLANK_IMAGE_URL, id:"trigger2" + id, name:"trigger2" + id, cls:"x-form-trigger " + this.trigger2Class}
            ]};
        this.triggerEl.replaceWith(this.triggerConfig);
        this.triggerEl.on('mouseup', function (e) {

                if (e.target.name == "trigger1" + id) {
                    this.onTriggerClick();
                } else if (e.target.name == "trigger2" + id) {
                    this.reset();
                    this.oldValue = null;
                    if (this.spObj !== '' && this.spExtraParam !== '') {
                        Ext.getCmp(this.spObj).store.setExtraParam(this.spExtraParam, '');
                        Ext.getCmp(this.spObj).store.load()
                    }
                    if (this.spForm !== '') {
                        Ext.getCmp(this.spForm).getForm().reset();
                    }
                }
            },
            this);
        var trigger1 = Ext.get("trigger1" + id);
        var trigger2 = Ext.get("trigger2" + id);
        trigger1.addClsOnOver('x-form-trigger-over');
        trigger2.addClsOnOver('x-form-trigger-over');
    }

});