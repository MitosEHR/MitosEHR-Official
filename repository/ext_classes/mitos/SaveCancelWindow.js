//******************************************************************************
// Render panel
//******************************************************************************
Ext.define('Ext.mitos.SaveCancelWindow', {
    extend      : 'Ext.window.Window',
    alias       : 'widget.savecancelwindow',
	width       : 520,
    
    renderTo    : document.body,
	//formCtl 	: this is the form the save btn will be getting the data from
	//dataStore	: this is the store we are using to store the data
	//rowPos	: rowPos # used to update the store
    initComponent: function() {
    	var win = this;
		Ext.apply(this, {
			autoHeight  : true,
		    modal       : true,
		    border	  	: true,
		    resizable   : false,
		    title       : 'New Save/Cancel Window',
		    closeAction : 'hide',
	    });
        win.callParent(arguments);
    },
});