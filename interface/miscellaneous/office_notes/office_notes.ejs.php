<?php 
//******************************************************************************
// new.ejs.php
// New Patient Entry Form
// v0.0.1
// 
// Author: Ernest Rodriguez
// Modified: Gino Rivera
// 
// MitosEHR (Eletronic Health Records) 2011
//******************************************************************************
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once("../../../library/I18n/I18n.inc.php");

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;

?>
<script type="text/javascript">
// *************************************************************************************
// Sencha trying to be like a language
// using requiered to load diferent components
// *************************************************************************************
Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux', '<?php echo $_SESSION['dir']['ux']; ?>');
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.toolbar.Paging',
    'Ext.TaskManager.*',
    'Ext.ux.SlidingPager'
]);

Ext.onReady(function(){
	
	//******************************************************************************
	// Sanitizing Objects
	// Destroy them, if already exists in the browser memory.
	// This destructions must be called for all the objects that
	// are rendered on the document.body 
	//******************************************************************************

	// *************************************************************************************
	// Structure of the message record
	// creates a subclass of Ext.data.Record
	//
	// This should be the structure of the database table
	// 
	// *************************************************************************************
	if (!Ext.ModelManager.isRegistered('modelOnotes')){
	var modelOnotes = Ext.define("modelOnotes", {extend: "Ext.data.Model", fields: [
		{name: 'id',      		type: 'int'},
		{name: 'date',          type: 'date', dateFormat: 'c'},
		{name: 'body',          type: 'string'},
		{name: 'user',          type: 'string'},
		{name: 'facility_id',   type: 'string'},
		{name: 'activity',   	type: 'string'},
	],
		idProperty: 'id',
	});
	}
	var storeOnotes = new Ext.data.Store({
		model		: 'modelOnotes',
		noCache		: true,
    	autoSync	: false,
    	pageSize	: 20,
	    proxy		: {
	    	type	: 'ajax',
		    api		: {
		      read      : 'interface/miscellaneous/office_notes/data_read.ejs.php',
		      create    : 'interface/miscellaneous/office_notes/data_create.ejs.php',
		      update    : 'interface/miscellaneous/office_notes/data_update.ejs.php',
		    //destroy 	: <-- No need to delete Office Notes -->
	   	 	},
	   	 	reader: {
	            type			: 'json',
	            idProperty		: 'id',
	            totalProperty	: 'totals',
	            root			: 'row'
	    	},
	    	writer: {
				type	 		: 'json',
				writeAllFields	: true,
				allowSingle	 	: true,
				encode	 		: true,
				root	 		: 'row'
			}
	    },
	    autoLoad: false
	});
	
	var onotesFormPanel = Ext.create('Ext.form.FormPanel', {
		id: 'onotesFormPanel',
		region		: 'north',
		frame 		: true,
		margin		: '0 0 3 0',
		items		:[{
			xtype: 'textfield', hidden: true, id: 'id', name: 'id'
		},{
			xtype   : 'textareafield',
			allowBlank	: false,
	        grow    : true,
	        margin	: 0,
	        name    : 'body',
	        anchor  : '100%',
	        emptyText: '<?php i18n("Type new note here..."); ?>',
	        listeners: {
		   	  	validitychange: function(){
		   	  		Ext.getCmp('cmdNew').show();
		            if (this.isValid()) {
		               Ext.getCmp('cmdSave').enable();
		               Ext.getCmp('cmdNew').enable();
		            } else {
		            	Ext.getCmp('cmdSave').disable();
		            }
		   	  	}
		  	}
		}],
		dockedItems: [{
	  	  	xtype: 'toolbar',
		  	dock: 'top',
		  	items: [{
			    text      	: '<?php i18n("Save"); ?>',
			    iconCls   	: 'save',
			    id        	: 'cmdSave',
			    disabled	: true,
			    handler   : function(){
					//----------------------------------------------------------------
					// Check if it has to add or update
					// Update: 
					// 1. Get the record from store, 
					// 2. get the values from the form, 
					// 3. copy all the 
					// values from the form and push it into the store record.
					// Add: The re-formated record to the dataStore
					//----------------------------------------------------------------
					var form = this.up('form').getForm();
					if (form.findField('id').getValue()){ // Update
						var record = storeOnotes.getAt(rowPos);
						var fieldValues = form.getValues();
						for ( k=0; k <= record.fields.getCount()-1; k++) {
							i = record.fields.get(k).name;
							record.set( i, fieldValues[i] );
						}
						record.set( 'activity', '1' );
					} else { // Add
						//----------------------------------------------------------------
						// 1. Convert the form data into a JSON data Object
						// 2. Re-format the Object to be a valid record (UserRecord)
						// 3. Add the new record to the datastore
						//----------------------------------------------------------------
						var obj = eval( '(' + Ext.JSON.encode(form.getValues()) + ')' );

						storeOnotes.add( obj );
					}
					
					storeOnotes.sync();	// Save the record to the dataStore
					storeOnotes.load();	// Reload the dataSore from the database
					Ext.getCmp('onotesFormPanel').getForm().reset();
					Ext.getCmp('cmdHide').disable();
			    }
			},'-',{
				id			: 'cmdHide',
                text		: '<?php i18n("Hide This Note"); ?>',
               	iconCls   	: 'save',
                tooltip		: 'Hide Selected Office Note',
                disabled	: true,
                handler		: function(){
                	var form = this.up('form').getForm();
					var record = storeOnotes.getAt(rowPos);
					var fieldValues = form.getValues();
					for ( k=0; k <= record.fields.getCount()-1; k++) {
						i = record.fields.get(k).name;
						record.set( i, fieldValues[i] );
					}
					record.set( 'activity', '0' );
					storeOnotes.sync();	// Save the record to the dataStore
					storeOnotes.load({params:{show: 'active' }});	// Reload the dataSore from the database
					Ext.getCmp('onotesFormPanel').getForm().reset();
					Ext.getCmp('cmdHide').disable();
                }
            },'-',{

				text      	: '<?php i18n("Reset Form"); ?>',
			    iconCls   	: 'save',
			    id        	: 'cmdNew',
			    disabled	: true,
			    handler   	: function(){
					var form = this.up('form').getForm();
					Ext.getCmp('cmdHide').disable();
					Ext.getCmp('cmdSave').setText('Save');
					form.reset();
					this.disable();
			    }
		  	}]
		}]
	}); 
	
	
	// *************************************************************************************
	// Create the GridPanel
	// *************************************************************************************
	var onotesGrid = new Ext.grid.GridPanel({
  		id          : 'onotesGrid',
  		region		: 'center',
  		store       : storeOnotes,
  		layout	    : 'fit',
		frame		: true,
	  	loadMask    : true,
  		viewConfig  : {stripeRows: true},
    	listeners	: {
	   		// -----------------------------------------
	   	  	// Single click to select the record
	   	  	// -----------------------------------------
	   	  	itemclick: {
	   			fn: function(DataView, record, item, rowIndex, e){
					Ext.getCmp('onotesFormPanel').getForm().reset();
	   		  		var rec = storeOnotes.getAt(rowIndex);
	   		  		Ext.getCmp('cmdNew').enable();
	   		  		Ext.getCmp('cmdHide').enable();
	   		  		Ext.getCmp('cmdSave').setText('<?php i18n('Update'); ?>');
	   		  		Ext.getCmp('onotesFormPanel').getForm().loadRecord(rec);
					currRec = rec;
            		rowPos = rowIndex;
	   		  	}
	   	  	}
	  	},
		columns: [
		    // Hidden cells
		    {header: 'id', sortable: false, dataIndex: 'id', hidden: true},
		    // Viewable cells
		    { width: 150, header: '<?php i18n('Date'); ?>', sortable: true, dataIndex: 'date', renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s'), },
		    { width: 150,  header: '<?php i18n('User'); ?>', sortable: true, dataIndex: 'user' },
		    { flex: 1, header: '<?php i18n('Note'); ?>', sortable: true, dataIndex: 'body' },

  		],
		tbar: Ext.create('Ext.PagingToolbar', {
            
            store: storeOnotes,
            displayInfo: true,
            emptyMsg: "<?php i18n('No Office Notes to display'); ?>",
            plugins: Ext.create('Ext.ux.SlidingPager', {}),
            items: [{
            	text      	: '<?php i18n("Show Only Active Notes"); ?>',
			    iconCls   	: 'save',
			    id        	: 'cmdShow',
			    enableToggle: true,
			    listeners	: {
			   	  	afterrender: function(){
			   	  		this.toggle(true);
			   	  		storeOnotes.load({params:{show: 'active' }});
			   	  	}
			   	},
			    handler   	: function(){
			    	Ext.getCmp('cmdShowAll').toggle(false);
					storeOnotes.load({params:{show: 'active' }});
			    }
			},'-',{
			    text      	: '<?php i18n("Show All Notes"); ?>',
			    iconCls   	: 'save',
			    id        	: 'cmdShowAll',
			    enableToggle: true,
			    handler   : function(){
			    	Ext.getCmp('cmdShow').toggle(false);
					storeOnotes.load({params:{show: 'all' }});
			    }
		  	}]
        }),
	}); // END GRID
	
	//******************************************************************************
	// Render panel
	//******************************************************************************
	var topRenderPanel = Ext.create('Ext.panel.Panel', {
		renderTo	: Ext.getCmp('MainApp').body,
		layout		: 'border',
		height		: Ext.getCmp('MainApp').getHeight(),
	  	frame 		: false,
		border 		: false,
		id			: 'topRenderPanel',
		items		: [{
			id: 'topRenderPanel-header',
			xtype: 'box',
			region: 'north',
			height: 40,
			html: '<?php i18n('Office Notes'); ?>'
		
		},{
			id		: 'topRenderPanel-body',
			xtype	: 'panel',
			region	: 'center',
			layout	: 'border',
			height	: Ext.getCmp('MainApp').getHeight() - 40,
			border 	: false,
			defaults: {frame:true, border:true},
			items	: [onotesFormPanel, onotesGrid]
		}]
	});
}); // End ExtJS
</script>




