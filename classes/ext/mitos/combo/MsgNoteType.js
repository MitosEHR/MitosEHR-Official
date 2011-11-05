/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File:
 * Date: 10/29/11
 * Time: 4:45 PM
 */
Ext.define('Ext.mitos.combo.MsgNoteType',{
	extend      : 'Ext.form.ComboBox',
    alias       : 'widget.msgnotetypecombo',
    uses        : 'Ext.mitos.restStore',
    initComponent: function(){
    	var me = this;
        me.store = Ext.create('Ext.mitos.restStore',{
            fields: [
                {name: 'option_id', type: 'string' },
                {name: 'title',     type: 'string' }
            ],
            model		: 'msgNoteType',
            idProperty	: 'option_id',
            url	    	: 'lib/layoutEngine/listOptions.json.php',
            extraParams	: { filter:"note_type"},
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