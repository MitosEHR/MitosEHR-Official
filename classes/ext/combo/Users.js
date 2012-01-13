/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File:
 * Date: 10/29/11
 * Time: 4:45 PM
 */
Ext.define('Ext.mitos.combo.Users',{
	extend      : 'Ext.form.ComboBox',
    alias       : 'widget.userscombo',
    uses        : 'Ext.mitos.restStoreModel',
    initComponent: function(){
    	var me = this;

        me.store = Ext.create('Ext.mitos.restStoreModel',{
            fields: [
                {name: 'user',      type: 'string' },
                {name: 'full_name', type: 'string' }
            ],
            model		: 'mUsers',
            idProperty	: 'id',
            url		    : 'app/messages/component_data.ejs.php',
            extraParams	: { task : "users"},
            autoLoad    : true
        });

    	Ext.apply(this, {
            editable    : false,
            queryMode   : 'local',
            valueField  : 'user',
            displayField: 'full_name',
            emptyText   : 'Select',
            store       : me.store
		});
		me.callParent();
	} // end initComponent
});