Ext.define('Ext.mitos.DeleteButton',{
	extend      : 'Ext.Button',
    alias       : 'mitos.cmdeditbutton',
	text		: 'New Delete Btn',
	iconCls		: 'delete',
	disabled	: true,
	//currRec 	: this is the record to delete
	//dataStore	: this is the store we are using to store the data
	msgTitle	: 'please confirm...',
	msg			: 'Are you sure you want to delete this?',
	initComponent: function() {
		var btn = this;
		Ext.apply(this, {
			handler: function(){
				Ext.Msg.show({
					title	: btn.msgTitle, 
					icon	: Ext.MessageBox.QUESTION,
					msg		: btn.msg,
					buttons	: Ext.Msg.YESNO,
					fn:function(btn,msgGrid){
						if(btn=='yes'){
							btn.dataStore.remove( currRec );
							btn.dataStore.sync();
							btn.dataStore.load();
		    		    }
					}
				});
			}
		});
		btn.callParent(arguments);
	}
});