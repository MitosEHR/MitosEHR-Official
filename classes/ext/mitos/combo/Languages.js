/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File:
 * Date: 10/29/11
 * Time: 4:45 PM
 */
Ext.define('Ext.mitos.combo.Languages',{
	extend      : 'Ext.form.ComboBox',
    alias       : 'widget.languagescombo',
    uses        : 'Ext.mitos.restStore',
    initComponent: function(){
    	var me = this;
        me.store = Ext.create('Ext.mitos.restStore',{
            fields: [
                { name: 'lang_id',		    type:'string' },
                { name: 'lang_code',	    type:'string' },
                { name: 'lang_description', type:'string' }
            ],
            model		: 'laguagesCB',
            idProperty	: 'lang_id',
            url		    : 'app/administration/globals/component_data.ejs.php',
            extraParams	: { task:"langs"},
            autoLoad    : true
        });

    	Ext.apply(this, {
            editable    : false,
            mode        : 'local',
            valueField  : 'lang_code',
            displayField: 'lang_description',
            emptyText   : 'Select',
            store       : me.store
		});
		me.callParent();
	} // end initComponent
});