/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File:
 * Date: 10/29/11
 * Time: 4:45 PM
 */
Ext.define('Ext.mitos.combo.MsgStatus',{
	extend      : 'Ext.form.ComboBox',
    alias       : 'widget.msgstatuscombo',
    uses        : 'Ext.mitos.restStoreModel',
    initComponent: function(){
    	var me = this;
        me.store = Ext.create('Ext.mitos.restStoreModel',{
            fields: [
                {name: 'option_id', type: 'string' },
                {name: 'title',     type: 'string' }
            ],
            model		: 'msgStatus',
            idProperty	: 'option_id',
            url	    	: 'lib/layoutEngine/listOptions.json.php',
            extraParams	: { filter:"message_status"},
            autoLoad    : true
        });

    	Ext.apply(this, {
            editable    : false,
            queryMode   : 'local',
            valueField  : 'option_id',
            displayField: 'title',
            emptyText   : 'Select',
            store       : me.store
		});
		me.callParent();
	} // end initComponent
});