//******************************************************************************
// Render panel
//******************************************************************************
Ext.define('Ext.mitos.window.Window', {
    extend      : 'Ext.window.Window',
    alias       : 'widget.mitoswindow',
    width       : 500,
    autoHeight  : true,
    modal       : true,
    border	  	: true,
    autoScroll	: true,
    resizable   : false,
    closeAction : 'hide',
    initComponent: function() {
    	var win = this;
        var record;
        var id;
		Ext.apply(this, {
			autoHeight  : true,
		    modal       : true,
		    border	  	: true,
		    autoScroll	: true,
		    resizable   : false,
		    closeAction : 'hide',
		    items		: win.form,
		    buttons: [{
                text: 'save',
                handler: function(){
                    if (win.form.getForm().isValid()) {
                        if (win.form.getForm().findField(win.idField).getValue()){ // Update
                            if (win.store.getAt(win.scope.rowPos != undefined )){
                                record = win.store.getAt(win.scope.rowPos);
                            }else{
                                id = parseInt(win.form.getForm().findField(win.idField).getValue());
                                record = win.store.getById(id);
                            }
                            var fieldValues = win.form.getForm().getValues();
                            for ( var k=0; k <= record.fields.getCount()-1; k++) {
                                var i = record.fields.get(k).name;
                                record.set( i, fieldValues[i] );
                            }
                        } else { // Add
                            var obj = eval( '(' + Ext.JSON.encode(win.form.getForm().getValues()) + ')' );
                            win.store.add( obj );
                        }
                        win.hide();	// Finally hide the dialog window
                        win.store.sync();	// Save the record to the dataStore
                        win.store.load(win.params);	// Reload the dataSore from the database
                    }
                }
            },{
                text: 'cancel',
                handler: function(){
                    win.hide();
                }
            }]
	    });
        win.callParent(arguments);
    }
});