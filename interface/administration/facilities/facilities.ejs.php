<?php 
//******************************************************************************
// facilities.ejs.php
// Description: Facilities Screen
// v0.0.3
// 
// Author: Gino Rivera Falú
// Modified: n/a
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
    'Ext.ux.SlidingPager'
]);

Ext.onReady(function() {
	
	Ext.QuickTips.init();
	
	var rowPos; // Stores the current Grid Row Position (int)
	var currRec; // Store the current record (Object)
	
	// *************************************************************************************
	// If a object called winUser exists destroy it, to create a new one.
	// *************************************************************************************
	if ( Ext.getCmp('winFacility') ){ Ext.getCmp('winFacility').destroy(); }
	
	// *************************************************************************************
	// Facility Record Structure
	// *************************************************************************************
	if (!Ext.ModelManager.isRegistered('FacilitiesRecord')){
    var FacilitiesRecord = Ext.define('FacilitiesRecord', {
        extend: 'Ext.data.Model',
        pageSize: 30,
        fields: [
			{name: 'id',					type: 'int'},
			{name: 'name',					type: 'string'},
			{name: 'phone',					type: 'string'},
			{name: 'fax',					type: 'string'},
			{name: 'street',				type: 'string'},
			{name: 'city',					type: 'string'},
			{name: 'state',					type: 'string'},
			{name: 'postal_code',			type: 'string'},
			{name: 'country_code',			type: 'string'},
			{name: 'federal_ein',			type: 'string'},
			{name: 'service_location',		type: 'string'},
			{name: 'billing_location',		type: 'string'},
			{name: 'accepts_assignment',	type: 'string'},
			{name: 'pos_code',				type: 'string'},
			{name: 'x12_sender_id',			type: 'string'},
			{name: 'attn',					type: 'string'},
			{name: 'domain_identifier',		type: 'string'},
			{name: 'facility_npi',			type: 'string'},
			{name: 'tax_id_type',			type: 'string'}
		]
	});
	}
	var FacilityStore = new Ext.data.Store({
		model: 'FacilitiesRecord',
    	noCache		: true,
    	autoSync	: false,
    	proxy		: {
    		type	: 'ajax',
			api		: {
				read	: 'interface/administration/facilities/data_read.ejs.php',
				create	: 'interface/administration/facilities/data_create.ejs.php',
				update	: 'interface/administration/facilities/data_update.ejs.php',
				destroy : 'interface/administration/facilities/data_destroy.ejs.php'
			},
        	reader: {
	            type			: 'json',
    	        idProperty		: 'idusers',
        	    totalProperty	: 'totals',
            	root			: 'row'
    		},
    		writer: {
    			type			: 'json',
    			writeAllFields	: true,
    			allowSingle		: false,
    			encode			: true,
    			root			: 'row'
    		}
    	},
    	autoLoad: true
	});

	// *************************************************************************************
	// POS Code Data Store
	// *************************************************************************************
	if (!Ext.ModelManager.isRegistered('poscodeRecord')){
    Ext.define('poscodeRecord', {
        extend: 'Ext.data.Model',
        fields: [
			{name: 'option_id',		type: 'string'},
			{name: 'title',			type: 'string'}
		]
	});
	}
	var storePOSCode = new Ext.data.Store({
    	model		: 'poscodeRecord',
    	proxy		: {
	   		type	: 'ajax',
			api		: {
				read	: 'interface/administration/facilities/component_data.ejs.php?task=poscodes'
			},
    	   	reader: {
        	    type			: 'json',
   	        	idProperty		: 'id',
	       	    totalProperty	: 'totals',
    	       	root			: 'row'
   			}
   		},
    	autoLoad: true
	});
	
	// *************************************************************************************
	// Federal EIN - TaxID Data Store
	// *************************************************************************************
	if (!Ext.ModelManager.isRegistered('taxidRecord')){
	Ext.define('taxidRecord', {
        extend: 'Ext.data.Model',
		fields: [
			{name: 'option_id',		type: 'string'},
			{name: 'title',			type: 'string'}
		]
	});
	}
	var storeTAXid = new Ext.data.Store({
    	model		: 'taxidRecord',
    	proxy		: {
	   		type	: 'ajax',
			api		: {
				read	: 'interface/administration/facilities/component_data.ejs.php?task=taxid'
			},
    	   	reader: {
        	    type			: 'json',
   	        	idProperty		: 'id',
	       	    totalProperty	: 'totals',
    	       	root			: 'row'
   			}
   		},
    	autoLoad: true
	});
	
	// *************************************************************************************
	// User form
	// *************************************************************************************
    var facilityForm = Ext.create('Ext.form.Panel', {
    	frame: false,
    	border: false,
    	id: 'facilityForm',
        bodyStyle:'padding:2px',
        fieldDefaults: {
            msgTarget: 'side',
            labelWidth: 100
        },
        defaultType: 'textfield',
        defaults: {
            anchor: '100%'
        },
        items: [{
            fieldLabel: '<?php i18n("Name"); ?>',
            name: 'name',
			allowBlank: false,
        },{
            fieldLabel: '<?php i18n("Phone"); ?>',
            name: 'phone',
			vtype: 'phoneNumber'
        },{
            fieldLabel: '<?php i18n("Fax"); ?>',
            name: 'fax',
			vtype: 'phoneNumber'
        },{
            fieldLabel: '<?php i18n("Street"); ?>',
            name: 'street',
        },{
            fieldLabel: '<?php i18n("City"); ?>',
            name: 'city',
        },{
            fieldLabel: '<?php i18n("State"); ?>',
            name: 'state',
        },{
            fieldLabel: '<?php i18n("Postal Code"); ?>',
            name: 'postal_code',
			vtype: 'postalCode'
        },{
            fieldLabel: '<?php i18n("Country Code"); ?>',
            name: 'country_code',
        },{
			xtype: 'fieldcontainer',
			fieldLabel: '<?php i18n("Tax ID"); ?>',
			layout: 'hbox',
			items: [{
				xtype: 'combo', 
				id: 'tax_id_type', 
				displayField: 'title',
				valueField: 'option_id', 
				editable: false, 
				store: storeTAXid, 
				queryMode: 'local',
	            name: 'tax_id_type',
				width: 50
			},{
				xtype: 'textfield',
				name: 'federal_ein'
			}]
		},{
        	xtype: 'checkboxfield',
            fieldLabel: '<?php i18n("Service Location"); ?>',
            name: 'service_location',
        },{
        	xtype: 'checkboxfield',
            fieldLabel: '<?php i18n("Billing Location"); ?>',
            name: 'billing_location',
        },{
        	xtype: 'checkboxfield',
            fieldLabel: '<?php i18n("Accepts assignment"); ?>',
            name: 'accepts_assignment',
        },{
			fieldLabel: '<?php i18n("POS Code"); ?>',
			xtype: 'combo', 
			id: 'pos_code', 
			displayField: 'title',
			valueField: 'option_id', 
			editable: false, 
			store: storePOSCode, 
			queryMode: 'local',
            name: 'pos_code',
        },{
            fieldLabel: '<?php i18n("Billing Attn"); ?>',
            name: 'attn',
        },{
            fieldLabel: '<?php i18n("CLIA Number"); ?>',
            name: 'domain_identifier',
        },{
            fieldLabel: '<?php i18n("Facility NPI"); ?>',
            name: 'facility_npi',
        },{
        	name: 'id',
        	hidden: true
        }]
    });
   	facilityForm.on('afterrender',function(){
   		Ext.getCmp('tax_id_type').setValue( storeTAXid.getAt(0).data.option_id );
   		Ext.getCmp('pos_code').setValue( storePOSCode.getAt(0).data.option_id );
   	});
    
	// *************************************************************************************
	// Window User Form
	// *************************************************************************************
	var winFacility = Ext.create('widget.window', {
		id			: 'winFacility',
		closable	: true,
		closeAction	: 'hide',
		width		: 450,
		height		: 530,
		resizable	: false,
		modal		: true,
		bodyStyle	: 'background-color: #ffffff; padding: 5px;',
		items		: [ facilityForm ],
		buttons:[{
			text		:'<?php i18n('Save'); ?>',
			name		: 'cmdSave',
			id			: 'cmdSave',
			iconCls		: 'save',
            handler: function(){
				//----------------------------------------------------------------
				// Check if it has to add or update
				// Update: 
				// 1. Get the record from store, 
				// 2. get the values from the form, 
				// 3. copy all the 
				// values from the form and push it into the store record.
				// Add: The re-formated record to the dataStore
				//----------------------------------------------------------------
				if (facilityForm.getForm().findField('id').getValue()){ // Update
					var record = FacilityStore.getAt(rowPos);
					var fieldValues = facilityForm.getForm().getValues();
					for ( k=0; k <= record.fields.getCount()-1; k++) {
						i = record.fields.get(k).name;
						record.set( i, fieldValues[i] );
					}
				} else { // Add
					//----------------------------------------------------------------
					// 1. Convert the form data into a JSON data Object
					// 2. Re-format the Object to be a valid record (UserRecord)
					// 3. Add the new record to the datastore
					//----------------------------------------------------------------
					var obj = eval( '(' + Ext.JSON.encode(facilityForm.getForm().getValues()) + ')' );
					FacilityStore.add( obj );
				}
				winFacility.hide();		// Finally hide the dialog window
				FacilityStore.sync();	// Save the record to the dataStore
				FacilityStore.load();	// Reload the dataSore from the database
			}
		},'-',{
			text:'<?php i18n('Close'); ?>',
			iconCls: 'delete',
            handler: function(){
            	winFacility.hide();
            }
		}]
	});
	

	// *************************************************************************************
	// Facility Grid Panel
	// *************************************************************************************
	var FacilityGrid = Ext.create('Ext.grid.Panel', {
		id			: 'FacilityGrid',
		store		: FacilityStore,
        layout	    : 'fit',
	  	frame		: true,
	  	border		: true,
        columns: [
			{
				text     : '<?php i18n("Name"); ?>',
				flex     : 1,
				sortable : true,
				dataIndex: 'name'
            },
            {
				text     : '<?php i18n("Phone"); ?>',
				width    : 100,
				sortable : true,
				dataIndex: 'phone'
            },
            {
				text     : '<?php i18n("Fax"); ?>',
				width    : 100,
				sortable : true,
				dataIndex: 'fax'
            },
            {
				text     : '<?php i18n("City"); ?>',
				width    : 100,
				sortable : true,
				dataIndex: 'city'
            }
		],
		// Slider bar or Pagin
        bbar: Ext.create('Ext.PagingToolbar', {
            pageSize: 30,
            store: FacilityStore,
            displayInfo: true,
            plugins: Ext.create('Ext.ux.SlidingPager', {})
        }),
		viewConfig: { stripeRows: true },
		listeners: {
			itemclick: {
            	fn: function(DataView, record, item, rowIndex, e){ 
            		Ext.getCmp('facilityForm').getForm().reset(); // Clear the form
            		Ext.getCmp('cmdEdit').enable();
            		Ext.getCmp('cmdDelete').enable();
					var rec = FacilityStore.getAt(rowIndex);
					Ext.getCmp('facilityForm').getForm().loadRecord(rec);
            		currRec = rec;
            		rowPos = rowIndex;
            	}
			},
			itemdblclick: {
            	fn: function(DataView, record, item, rowIndex, e){ 
            		Ext.getCmp('facilityForm').getForm().reset(); // Clear the form
            		Ext.getCmp('cmdEdit').enable();
            		Ext.getCmp('cmdDelete').enable();
					var rec = FacilityStore.getAt(rowIndex);
					Ext.getCmp('facilityForm').getForm().loadRecord(rec);
            		currRec = rec;
            		rowPos = rowIndex;
            		winFacility.setTitle('<?php i18n("Edit Facility"); ?>');
            		winFacility.show();
            	}
			}
		},
		dockedItems: [{
			xtype: 'toolbar',
			dock: 'top',
			items: [{
				text: '<?php i18n("Add Facility"); ?>',
				iconCls: 'icoAddRecord',
				handler: function(){
					Ext.getCmp('facilityForm').getForm().reset(); // Clear the form
					winFacility.show();
					winFacility.setTitle('<?php i18n("Add Facility"); ?>'); 
				}
			},'-',{
				text: '<?php i18n("Edit Facility"); ?>',
				iconCls: 'edit',
				id: 'cmdEdit',
				disabled: true,
				handler: function(){
					winFacility.setTitle('<?php i18n("Edit Facility"); ?>');
					winFacility.show(); 
				}
			},'-',{
				text: '<?php i18n("Delete Facility"); ?>',
				iconCls: 'delete',
				disabled: true,
				id: 'cmdDelete',
				handler: function(){
					Ext.Msg.show({
						title: '<?php i18n('Please confirm...'); ?>', 
						icon: Ext.MessageBox.QUESTION,
						msg:'<?php i18n('Are you sure to delete this Facility?'); ?>',
						buttons: Ext.Msg.YESNO,
						fn:function(btn,msgGrid){
							if(btn=='yes'){
								FacilityStore.remove( currRec );
								FacilityStore.save();
								FacilityStore.load();
							}
						}
					});
				}
			}]
		}]
    }); // END Facility Grid

	//***********************************************************************************
	// Top Render Panel 
	// This Panel needs only 3 arguments...
	// PageTigle 	- Title of the current page
	// PageLayout 	- default 'fit', define this argument if using other than the default value
	// PageBody 	- List of items to display [foem1, grid1, grid2]
	//***********************************************************************************
    Ext.create('Ext.ux.TopRenderPanel', {
        pageTitle: '<?php i18n('Facilities'); ?>',
        pageBody: [FacilityGrid]
    });
}); // End ExtJS

</script>