/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File:
 * Date: 10/29/11
 * Time: 4:45 PM
 */
Ext.define('Ext.mitos.combo.TaxId',{
	extend      : 'Ext.form.ComboBox',
    alias       : 'widget.mitos.taxidcombo',
    uses        : 'Ext.mitos.restStoreModel',
    initComponent: function(){
    	var me = this;
        me.store = Ext.create('Ext.mitos.restStoreModel',{
            fields: [
                {name: 'option_id', type: 'string' },
                {name: 'title',     type: 'string' }
            ],
            model		: 'posCodes',
            idProperty	: 'option_id',
            url	    	: 'app/administration/facilities/component_data.ejs.php',
            extraParams	: { task:"taxid"},
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