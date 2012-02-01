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

        Ext.define('MsgStatusModel', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'option_id', type: 'string' },
                {name: 'title',     type: 'string' }
            ],
            proxy: {
                type: 'direct',
                api: {
                    read: CombosData.getMessageStatus
                }
            }
        });

        me.store = Ext.create('Ext.data.Store', {
            model: 'MsgStatusModel',
            autoLoad: true
        });

    	Ext.apply(this, {
            editable    : false,
            queryMode   : 'local',
            valueField  : 'option_id',
            displayField: 'title',
            emptyText   : 'Select',
            store       : me.store
		},null);
		me.callParent();
	} // end initComponent
});