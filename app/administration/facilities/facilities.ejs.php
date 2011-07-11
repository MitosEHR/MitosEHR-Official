<?php 
//******************************************************************************
// facilities.ejs.php
// Description: Facilities Screen
// v0.0.3
// 
// Author: GI Technologies, 2011
// Modified: n/a
// 
// MitosEHR (Eletronic Health Records) 2011
//******************************************************************************

session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once($_SESSION['site']['root']."/classes/I18n.class.php");

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;
?>
<script type="text/javascript">
delete Ext.mitos.Panel;
Ext.onReady(function() {
	Ext.define('Ext.mitos.Panel',{
		extend:'Ext.panel.Panel',
		uses:[
			'Ext.mitos.CRUDStore',
			'Ext.mitos.GridPanel',
			'Ext.mitos.RenderPanel',
			'Ext.mitos.SaveCancelWindow'
		],
		initComponent: function(){
		    /** @namespace Ext.QuickTips */
    		Ext.QuickTips.init();
    	
    		var panel = this;
			var rowPos; // Stores the current Grid Row Position (int)
			var currRec; // Store the current record (Object)
		
			// *************************************************************************************
			// Facility Record Structure
			// *************************************************************************************
			panel.FacilityStore = Ext.create('Ext.mitos.CRUDStore',{
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
				],
    		    model 		:'facilityModel',
        		idProperty 	:'id',
		        read		:'app/administration/facilities/data_read.ejs.php',
    		    create		:'app/administration/facilities/data_create.ejs.php',
        		update		:'app/administration/facilities/data_update.ejs.php',
	        	destroy		:'app/administration/facilities/data_destroy.ejs.php'
			});

			// *************************************************************************************
			// POS Code Data Store
			// *************************************************************************************
			panel.storePOSCode = Ext.create('Ext.mitos.CRUDStore',{
				fields: [
					{name: 'option_id',		type: 'string'},
					{name: 'title',			type: 'string'}
				],
					model 		:'posModel',
					idProperty 	:'id',
					read		:'app/administration/facilities/component_data.ejs.php',
					extraParams	: {"task": "poscodes"}
			});
	
			// *************************************************************************************
			// Federal EIN - TaxID Data Store
			// *************************************************************************************
			panel.storeTAXid = Ext.create('Ext.mitos.CRUDStore',{
				fields: [
					{name: 'option_id',		type: 'string'},
					{name: 'title',			type: 'string'}
				],
					model 		:'taxidRecord',
					idProperty 	:'id',
					read		:'app/administration/facilities/component_data.ejs.php',
					extraParams	: {"task": "taxid"}
			});
	
			// *************************************************************************************
			// User form
			// *************************************************************************************
	    	panel.facilityForm = new Ext.create('Ext.mitos.FormPanel', {
		        fieldDefaults: { msgTarget: 'side', labelWidth: 100 },
    		    defaultType: 'textfield',
        		defaults: { anchor: '100%' },
		        items: [{
    		        fieldLabel: '<?php i18n("Name"); ?>',
        		    name: 'name',
					allowBlank: false
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
        		    name: 'street'
	        	},{
    	        	fieldLabel: '<?php i18n("City"); ?>',
	        	    name: 'city'
		        },{
    		        fieldLabel: '<?php i18n("State"); ?>',
        		    name: 'state'
		        },{
    		        fieldLabel: '<?php i18n("Postal Code"); ?>',
        		    name: 'postal_code',
					vtype: 'postalCode'
		        },{
    		        fieldLabel: '<?php i18n("Country Code"); ?>',
        		    name: 'country_code'
	        	},{
					xtype: 'fieldcontainer',
					fieldLabel: '<?php i18n("Tax ID"); ?>',
					layout: 'hbox',
					items: [
						panel.cmbTaxIdType = new Ext.create('Ext.form.ComboBox',{
							displayField: 'title',
							valueField: 'option_id', 
							editable: false, 
							store: panel.storeTAXid, 
							queryMode: 'local',
							width: 50
						})
					,{
						xtype: 'textfield',
						name: 'federal_ein'
					}]
				},{	
    		    	xtype: 'checkboxfield',
        		    fieldLabel: '<?php i18n("Service Location"); ?>',
            		name: 'service_location'
		       },{
    		    	xtype: 'checkboxfield',
        		    fieldLabel: '<?php i18n("Billing Location"); ?>',
            		name: 'billing_location'
		        },{
    		    	xtype: 'checkboxfield',
        		    fieldLabel: '<?php i18n("Accepts assignment"); ?>',
            		name: 'accepts_assignment'
		        },
		        	panel.cmbposCode = new Ext.create('Ext.form.ComboBox',{
						fieldLabel: '<?php i18n("POS Code"); ?>',
						displayField: 'title',
						valueField: 'option_id', 
						editable: false, 
						store: panel.storePOSCode, 
						queryMode: 'local'
					})
	        	,{
    	        	fieldLabel: '<?php i18n("Billing Attn"); ?>',
	    	        name: 'attn'
    	    	},{
        	    	fieldLabel: '<?php i18n("CLIA Number"); ?>',
	            	name: 'domain_identifier'
		        },{
    		        fieldLabel: '<?php i18n("Facility NPI"); ?>',
        		    name: 'facility_npi'
		        },{
    		    	name: 'id',
        			hidden: true
		        }],
    		    listeners: {
					beforeshow: {
            			fn: function(){ 
            				panel.cmbTaxIdType.setValue( panel.storeTAXid.getAt(0).data.option_id );
   							panel.cmbposCode.setValue( panel.storePOSCode.getAt(0).data.option_id );
		            	}
					}
				}
	    	});
    
			// *************************************************************************************
			// Window User Form
			// *************************************************************************************
			panel.winFacility = Ext.create('Ext.mitos.Window', {
				width		: 450,
				height		: 530,
				items		: [ panel.facilityForm ],
				buttons:[
					panel.cmdSave = new Ext.create('Ext.Button', {
						text		:'<?php i18n("Save"); ?>',
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
								if (panel.facilityForm.getForm().findField('id').getValue()){ // Update
								var record = panel.FacilityStore.getAt(rowPos);
								var fieldValues = panel.facilityForm.getForm().getValues();
            		    	    var k, i;
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
								var obj = eval( '(' + Ext.JSON.encode(panel.facilityForm.getForm().getValues()) + ')' );
								panel.FacilityStore.add( obj );
							}
							panel.winFacility.hide();		// Finally hide the dialog window
							panel.FacilityStore.sync();	// Save the record to the dataStore
							panel.FacilityStore.load();	// Reload the dataSore from the database
						}
					})
				,'-',
					panel.cmdClose = new Ext.create('Ext.Button', {
						text:'<?php i18n("Close"); ?>',
						iconCls: 'delete',
	    	        	handler: function(){
    	    	    		panel.winFacility.hide();
	        	    	}
					})
				]
			});

			// *************************************************************************************
			// Facility Grid Panel
			// *************************************************************************************
			panel.FacilityGrid = new Ext.create('Ext.mitos.GridPanel', {
				store		: panel.FacilityStore,
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
        		    store: panel.FacilityStore,
            		displayInfo: true,
		            plugins: Ext.create('Ext.ux.SlidingPager', {})
    		    }),
				listeners: {
					itemclick: {
            			fn: function(DataView, record, item, rowIndex, e){ 
	            			panel.facilityForm.getForm().reset(); // Clear the form
		            		panel.cmdEdit.enable();
    		        		panel.cmdDelete.enable();
							var rec = panel.FacilityStore.getAt(rowIndex);
							panel.facilityForm.getForm().loadRecord(rec);
            				currRec = rec;
            				rowPos = rowIndex;
		            	}
					},
					itemdblclick: {
            			fn: function(DataView, record, item, rowIndex, e){ 
            				panel.facilityForm.getForm().reset(); // Clear the form
            				panel.cmdEdit.enable();
	            			panel.cmdDelete.enable();
							var rec = panel.FacilityStore.getAt(rowIndex);
							panel.facilityForm.getForm().loadRecord(rec);
        	    			currRec = rec;
            				rowPos = rowIndex;
            				panel.winFacility.setTitle('<?php i18n("Edit Facility"); ?>');
	            			panel.winFacility.show();
	    	        	}
					}
				},
				dockedItems: [{
					xtype: 'toolbar',
					dock: 'top',
					items: [
						panel.cmdAddFacility = new Ext.create('Ext.Button', {
							text: '<?php i18n("Add Facility"); ?>',
							iconCls: 'icoAddRecord',
							handler: function(){
								panel.facilityForm.getForm().reset(); // Clear the form
								panel.winFacility.show();
								panel.winFacility.setTitle('<?php i18n("Add Facility"); ?>'); 
							}
						})
					,'-', 
						panel.cmdEdit = new Ext.create('Ext.Button', {
							text: '<?php i18n("Edit Facility"); ?>',
							iconCls: 'edit',
							disabled: true,
							handler: function(){
								panel.winFacility.setTitle('<?php i18n("Edit Facility"); ?>');
								panel.winFacility.show(); 
							}
						})
					,'-',
						panel.cmdDelete = new Ext.create('Ext.Button', {
							text: '<?php i18n("Delete Facility"); ?>',
							iconCls: 'delete',
							disabled: true,
							handler: function(){
								Ext.Msg.show({
									title: '<?php i18n("Please confirm..."); ?>', 
									icon: Ext.MessageBox.QUESTION,
									msg:'<?php i18n("Are you sure to delete this Facility?"); ?>',
									buttons: Ext.Msg.YESNO,
									fn:function(btn,msgGrid){
										if(btn=='yes'){
											panel.FacilityStore.remove( currRec );
											panel.FacilityStore.save();
											panel.FacilityStore.load();
										}
									}
								});
							}
						})
					]
				}]
    		}); // END Facility Grid

			//***********************************************************************************
			// Top Render Panel 
			// This Panel needs only 3 arguments...
			// PageTigle 	- Title of the current page
			// PageLayout 	- default 'fit', define this argument if using other than the default value
			// PageBody 	- List of items to display [foem1, grid1, grid2]
			//***********************************************************************************
    		new Ext.create('Ext.mitos.RenderPanel', {
        		pageTitle: '<?php i18n("Facilities"); ?>',
	        	pageBody: [panel.FacilityGrid]
	    	});
			panel.callParent(arguments);
				
			} // end of initComponent
		
	}); //ens FacilitiesPanel class

    Ext.create('Ext.mitos.Panel');
    
}); // End ExtJS

</script>