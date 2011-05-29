<?php 
//******************************************************************************
// roles.ejs.php
// Description: Facilities Screen
// v0.0.3
// 
// Author: Ernesto J Rodriguez
// Modified: n/a
// 
// MitosEHR (Eletronic Health Records) 2011
//**********************************************************************************
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once("../../../library/I18n/I18n.inc.php");

//**********************************************************************************
// Reset session count 10 secs = 1 Flop
//**********************************************************************************
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

Ext.onReady(function(){

	var rowPos; // Stores the current Grid Row Position (int)
	var currRec; // Store the current record (Object)

	// *************************************************************************************
	// If a object called winUser exists destroy it, to create a new one.
	// *************************************************************************************
	if ( Ext.getCmp('winPharmacy') ){ Ext.getCmp('winPharmacy').destroy(); }
	if ( Ext.getCmp('winInsurance') ){ Ext.getCmp('winInsurance').destroy(); }
	
	// *************************************************************************************
	// Phramacy Record Structure
	// *************************************************************************************
	if (!Ext.ModelManager.isRegistered('pharmacyModel')){
	    Ext.define('pharmacyModel', {
	        extend: 'Ext.data.Model',
	        fields: [
				{name: 'id',					type: 'int'},
				{name: 'name',					type: 'string'},
				{name: 'transmit_method',		type: 'string'},
				{name: 'email',					type: 'string'},
				{name: 'address_id',			type: 'string'},
				{name: 'line1',					type: 'string'},
				{name: 'line2',					type: 'string'},
				{name: 'city',					type: 'string'},
				{name: 'state',					type: 'string'},
				{name: 'zip',					type: 'int'},
				{name: 'plus_four',				type: 'int'},
				{name: 'country',				type: 'string'},
				{name: 'address_foreign_id',	type: 'string'},
				{name: 'address_full',			type: 'string'},
				{name: 'phone_country_code',	type: 'string'},
				{name: 'phone_area_code',		type: 'string'},
				{name: 'phone_prefix',			type: 'string'},
				{name: 'phone_number',			type: 'string'},
				{name: 'phone_foreign_id',		type: 'string'},
				{name: 'phone_full',			type: 'string'},
				{name: 'fax_country_code',		type: 'string'},
				{name: 'fax_area_code',			type: 'string'},
				{name: 'fax_prefix',			type: 'string'},
				{name: 'fax_number',			type: 'string'},
				{name: 'fax_foreign_id',		type: 'string'},
				{name: 'fax_full',				type: 'string'}
			]
		});
	}
	var pharmacyStore = new Ext.data.Store({
		model: 'pharmacyModel',
    	noCache		: true,
    	autoSync	: false,
    	proxy		: {
    		type	: 'ajax',
			api		: {
				read	: 'interface/administration/practice/data_read.ejs.php?task=pharmacy',
				create	: 'interface/administration/practice/data_read.ejs.php?task=',
				update	: 'interface/administration/practice/data_read.ejs.php?task=',
				destroy : 'interface/administration/practice/data_read.ejs.php?task='
			},
        	reader: {
	            type			: 'json',
    	        idProperty		: 'id',
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
	// Insurance Record Structure
	// *************************************************************************************
	if (!Ext.ModelManager.isRegistered('insuranceModel')){
	    Ext.define('insuranceModel', {
	        extend: 'Ext.data.Model',
	        fields: [
				{name: 'id',						type: 'int'},
				{name: 'name',						type: 'string'},
				{name: 'attn',						type: 'string'},
				{name: 'cms_id',					type: 'string'},
				{name: 'freeb_type',				type: 'string'},
				{name: 'x12_receiver_id',			type: 'string'},
				{name: 'x12_default_partner_id',	type: 'string'},
				{name: 'alt_cms_id',				type: 'string'},
				{name: 'address_id',				type: 'string'},
				{name: 'line1',						type: 'string'},
				{name: 'line2',						type: 'string'},
				{name: 'city',						type: 'string'},
				{name: 'state',						type: 'string'},
				{name: 'zip',						type: 'int'},
				{name: 'plus_four',					type: 'int'},
				{name: 'country',					type: 'string'},
				{name: 'address_foreign_id',		type: 'string'},
				{name: 'address_full',				type: 'string'},
				{name: 'phone_country_code',		type: 'string'},
				{name: 'phone_area_code',			type: 'string'},
				{name: 'phone_prefix',				type: 'string'},
				{name: 'phone_number',				type: 'string'},
				{name: 'phone_foreign_id',			type: 'string'},
				{name: 'phone_full',				type: 'string'},
				{name: 'fax_country_code',			type: 'string'},
				{name: 'fax_area_code',				type: 'string'},
				{name: 'fax_prefix',				type: 'string'},
				{name: 'fax_number',				type: 'string'},
				{name: 'fax_foreign_id',			type: 'string'},
				{name: 'fax_full',					type: 'string'}
			]
		});
	}
	var insuranceStore = new Ext.data.Store({
		model: 'insuranceModel',
    	noCache		: true,
    	autoSync	: false,
    	proxy		: {
    		type	: 'ajax',
			api		: {
				read	: 'interface/administration/practice/data_read.ejs.php?task=insurance',
				create	: 'interface/administration/practice/data_read.ejs.php?task=',
				update	: 'interface/administration/practice/data_read.ejs.php?task=',
				destroy : 'interface/administration/practice/data_read.ejs.php?task='
			},
        	reader: {
	            type			: 'json',
    	        idProperty		: 'id',
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
	// Insurance Record Structure
	// *************************************************************************************
	if (!Ext.ModelManager.isRegistered('insuranceNumbersModel')){
	    Ext.define('insuranceNumbersModel', {
	        extend: 'Ext.data.Model',
	        fields: [
				{name: 'id',					type: 'int'},
				{name: 'name',					type: 'string'}
			]
		});
	}
	var insuranceNumbersStore = new Ext.data.Store({
		model: 'insuranceNumbersModel',
    	noCache		: true,
    	autoSync	: false,
    	proxy		: {
    		type	: 'ajax',
			api		: {
				read	: 'interface/administration/practice/data_read.ejs.php',
				create	: 'interface/administration/practice/data_create.ejs.php',
				update	: 'interface/administration/practice/data_update.ejs.php',
				destroy : 'interface/administration/practice/data_destroy.ejs.php'
			},
        	reader: {
	            type			: 'json',
    	        idProperty		: 'id',
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
	// X12 Partners Record Structure
	// *************************************************************************************
	if (!Ext.ModelManager.isRegistered('x12PartnersModel')){
	    Ext.define('x12PartnersModel', {
	        extend: 'Ext.data.Model',
	        fields: [
				{name: 'id',					type: 'int'},
				{name: 'name',					type: 'string'}
			]
		});
	}
	var x12PartnersStore = new Ext.data.Store({
		model: 'x12PartnersModel',
    	noCache		: true,
    	autoSync	: false,
    	proxy		: {
    		type	: 'ajax',
			api		: {
				read	: 'interface/administration/practice/data_read.ejs.php',
				create	: 'interface/administration/practice/data_create.ejs.php',
				update	: 'interface/administration/practice/data_update.ejs.php',
				destroy : 'interface/administration/practice/data_destroy.ejs.php'
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
	// Phramacy Form, Window, and Form
	// *************************************************************************************
	var pharmacyForm = new Ext.form.FormPanel({
		id          : 'pharmacyForm',
		bodyStyle   : 'padding: 5px;',
		autoWidth   : true,
		width	  	  : 495,
		border      : false,
		hideLabels  : true,
		defaults: {
			labelWidth: 89,
		    anchor: '100%',
		    layout: {
		    	type: 'hbox',
		        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
		    }
		},
		items: [{}]
	}); // END FORM
	var winPharmacy = new Ext.Window({
		id          : 'winPharmacy',
		width       : 520,
	    autoHeight  : true,
	    modal       : true,
	    border	  	: false,
	    resizable   : false,
	    title       : '<?php i18n('Add or Edit Pharmacy'); ?>',
	    closeAction : 'hide',
	    renderTo    : document.body,
	    items: [pharmacyForm],
	}); // END WINDOW
	var pharmacyGrid = Ext.create('Ext.grid.Panel', {
		store		: pharmacyStore,
        columnLines	: true,
        frame		: false,
        frameHeader	: false,
        border		: false,
        layout		: 'fit',
        columns: [{
			text     : '<?php i18n("Pharmacy Name"); ?>',
			width    : 150,
			sortable : true,
			dataIndex: 'name'
        },{
			text     : '<?php i18n("Address"); ?>',
			flex     : 1,
			sortable : true,
			dataIndex: 'address_full'
        },{
			text     : '<?php i18n("Phone"); ?>',
			width    : 120,
			sortable : true,
			dataIndex: 'phone_full'
        },{
			text     : '<?php i18n("Fax"); ?>',
			width    : 120,
			sortable : true,
			dataIndex: 'fax_full'
        },{
			text     : '<?php i18n("Defaul Method"); ?>',
			flex     : 1,
			sortable : true,
			dataIndex: 'transmit_method'
        }],
		viewConfig: { stripeRows: true },
		listeners: {
			itemclick: {
            	fn: function(DataView, record, item, rowIndex, e){ 
            		Ext.getCmp('pharmacyForm').getForm().reset(); // Clear the form
            		Ext.getCmp('editPharmacy').enable();
            		Ext.getCmp('deletePharmacy').enable();
					var rec = pharmacyStore.getAt(rowIndex);
					Ext.getCmp('pharmacyForm').getForm().loadRecord(rec);
            		currRec = rec;
            		rowPos = rowIndex;
            	}
			},
			itemdblclick: {
            	fn: function(DataView, record, item, rowIndex, e){ 
            		Ext.getCmp('pharmacyForm').getForm().reset(); // Clear the form
            		Ext.getCmp('editPharmacy').enable();
            		Ext.getCmp('deletePharmacy').enable();
					var rec = pharmacyStore.getAt(rowIndex);
					Ext.getCmp('pharmacyForm').getForm().loadRecord(rec);
            		currRec = rec;
            		rowPos = rowIndex;
            		winPharmacy.setTitle('<?php i18n("View / Edit Insurance"); ?>');
            		winPharmacy.show();
            	}
			}
		}
    }); // END GRIDs

	// *************************************************************************************
	// Insurance Form, Window, and GRID
	// *************************************************************************************
	var insuranceForm = new Ext.form.FormPanel({
		id          : 'insuranceForm',
		bodyStyle   : 'padding: 5px;',
		autoWidth   : true,
		width	  	  : 495,
		border      : false,
		hideLabels  : true,
		defaults: {
			labelWidth: 89,
		    anchor: '100%',
		    layout: {
		    	type: 'hbox',
		        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
		    }
		},
		items: [{}]
	}); // END FORM
	var winInsurance = new Ext.Window({
		id          : 'winInsurance',
		width       : 520,
	    autoHeight  : true,
	    modal       : true,
	    border	  	: false,
	    resizable   : false,
	    title       : '<?php i18n('Add or Edit Insurance'); ?>',
	    closeAction : 'hide',
	    renderTo    : document.body,
	    items: [insuranceForm],
	}); // END WINDOW
	var insuranceGrid = Ext.create('Ext.grid.Panel', {
		store		: insuranceStore,
        columnLines	: true,
        frame		: false,
        frameHeader	: false,
        border		: false,
        layout		: 'fit',
        columns: [{
        	text     : '<?php i18n("Insurance Name"); ?>',
			width    : 150,
			sortable : true,
			dataIndex: 'name'
        },{
			text     : '<?php i18n("Address"); ?>',
			flex     : 1,
			sortable : true,
			dataIndex: 'address_full'
        },{
			text     : '<?php i18n("Phone"); ?>',
			width    : 120,
			sortable : true,
			dataIndex: 'phone_full'
        },{
			text     : '<?php i18n("Fax"); ?>',
			width    : 120,
			sortable : true,
			dataIndex: 'fax_full'
        },{
			text     : '<?php i18n("Default X12 Partner"); ?>',
			flex     : 1,
			width    : 100,
			sortable : true,
			dataIndex: 'x12_default_partner_id'			
        }],
		viewConfig: { stripeRows: true },
		listeners: {
			itemclick: {
            	fn: function(DataView, record, item, rowIndex, e){ 
            		Ext.getCmp('insuranceForm').getForm().reset(); // Clear the form
            		Ext.getCmp('editCompany').enable();
            		Ext.getCmp('deleteCompany').enable();
					var rec = insuranceStore.getAt(rowIndex);
					Ext.getCmp('insuranceForm').getForm().loadRecord(rec);
            		currRec = rec;
            		rowPos = rowIndex;
            	}
			},
			itemdblclick: {
            	fn: function(DataView, record, item, rowIndex, e){ 
            		Ext.getCmp('insuranceForm').getForm().reset(); // Clear the form
            		Ext.getCmp('editCompany').enable();
            		Ext.getCmp('deleteCompany').enable();
					var rec = insuranceStore.getAt(rowIndex);
					Ext.getCmp('insuranceForm').getForm().loadRecord(rec);
            		currRec = rec;
            		rowPos = rowIndex;
            		winInsurance.setTitle('<?php i18n("View / Edit Insurance"); ?>');
            		winInsurance.show();
            	}
			}
		}
    }); // END Insurance Grid

	// *************************************************************************************
	// Insurance Numbers Grid (Tab 2)
	// *************************************************************************************
	var InsuranceNumbersGrid = Ext.create('Ext.grid.Panel', {
		store		: insuranceNumbersStore,
        columnLines	: true,
        frame		: false,
        frameHeader	: false,
        border		: false,
        layout		: 'fit',
        columns: [{
        	text     : '<?php i18n("Name"); ?>',
			flex     : 1,
			sortable : true,
			dataIndex: 'name'
        },{
			width    : 100,
			sortable : true,
			dataIndex: 'address'
        },{
			text     : '<?php i18n("Provider #"); ?>',
			flex     : 1,
			width    : 100,
			sortable : true,
			dataIndex: 'phone'	
        },{
			text     : '<?php i18n("Rendering #"); ?>',
			flex     : 1,
			width    : 100,
			sortable : true,
			dataIndex: 'phone'
        },{
			text     : '<?php i18n("Group #"); ?>',
			flex     : 1,
			width    : 100,
			sortable : true,
			dataIndex: 'phone'		
        }],
		viewConfig: { stripeRows: true },
		listeners: {
			itemclick: {
            	fn: function(DataView, record, item, rowIndex, e){ 
            		Ext.getCmp('pharmacyForm').getForm().reset(); // Clear the form
            		Ext.getCmp('cmdEdit').enable();
            		Ext.getCmp('cmdDelete').enable();
					var rec = insuranceNumbersStore.getAt(rowIndex);
					Ext.getCmp('pharmacyForm').getForm().loadRecord(rec);
            		currRec = rec;
            		rowPos = rowIndex;
            	}
			},
			itemdblclick: {
            	fn: function(DataView, record, item, rowIndex, e){ 
            		Ext.getCmp('pharmacyForm').getForm().reset(); // Clear the form
            		Ext.getCmp('cmdEdit').enable();
            		Ext.getCmp('cmdDelete').enable();
					var rec = insuranceNumbersStore.getAt(rowIndex);
					Ext.getCmp('pharmacyForm').getForm().loadRecord(rec);
            		currRec = rec;
            		rowPos = rowIndex;
            		winPharmacy.setTitle('<?php i18n("Edit Pharmacy"); ?>');
            		winPharmacy.show();
            	}
			}
		}
    }); // END Insurance Numbers Grid

	// *************************************************************************************
	//  X12 Partners Grid (Tab 3)
	// *************************************************************************************
	var x12ParnersGrid = Ext.create('Ext.grid.Panel', {
		store		: x12PartnersStore,
        columnLines	: true,
        frame		: false,
        frameHeader	: false,
        border		: false,
        layout		: 'fit',
        columns: [{
        	text     : '<?php i18n("Name"); ?>',
			flex     : 1,
			sortable : true,
			dataIndex: 'name'
        },{
			text     : '<?php i18n("Sender ID"); ?>',
			flex     : 1,
			width    : 100,
			sortable : true,
			dataIndex: 'phone'	
        },{
			text     : '<?php i18n("Receiver ID"); ?>',
			flex     : 1,
			width    : 100,
			sortable : true,
			dataIndex: 'phone'
        },{
			text     : '<?php i18n("Version"); ?>',
			flex     : 1,
			width    : 100,
			sortable : true,
			dataIndex: 'phone'		
        }],
		viewConfig: { stripeRows: true },
		listeners: {
			itemclick: {
            	fn: function(DataView, record, item, rowIndex, e){ 
            		Ext.getCmp('x12PartnersForm').getForm().reset(); // Clear the form
            		Ext.getCmp('cmdEdit').enable();
            		Ext.getCmp('cmdDelete').enable();
					var rec = x12PartnersStore.getAt(rowIndex);
					Ext.getCmp('x12PartnersForm').getForm().loadRecord(rec);
            		currRec = rec;
            		rowPos = rowIndex;
            	}
			},
			itemdblclick: {
            	fn: function(DataView, record, item, rowIndex, e){ 
            		Ext.getCmp('x12PartnersForm').getForm().reset(); // Clear the form
            		Ext.getCmp('cmdEdit').enable();
            		Ext.getCmp('cmdDelete').enable();
					var rec = x12PartnersStore.getAt(rowIndex);
					Ext.getCmp('x12PartnersForm').getForm().loadRecord(rec);
            		currRec = rec;
            		rowPos = rowIndex;
            		winX12Partners.setTitle('<?php i18n("Edit X12 Partner"); ?>');
            		winX12Partners.show();
            	}
			}
		}
    }); // END Insurance Numbers Grid
    
        
	//**************************************************************************
	// Tab Panel
	//**************************************************************************
	var tabPanel = Ext.create('Ext.tab.Panel', {
        activeTab	: 0,
        frame		: false,
        border		: false,
        height		: Ext.getCmp('MainApp').getHeight(),
        defaults	:{ autoScroll:true },
        items:[{
            title	:'<?php i18n("Pharmacies"); ?>',
    	    frame	: false,
	        border	: false,
            items	: [ pharmacyGrid ],
			dockedItems: [{
		  	  	xtype: 'toolbar',
			  	dock: 'top',
			  	items: [{
					id        : 'addPharmacy',
				    text      : '<?php i18n("Add a Pharmacy"); ?>',
				    iconCls   : 'save',
				    handler   : function(){
						// TODO //
				    }
				},{
					id        : 'editPharmacy',
				    text      : '<?php i18n("View / Edit a Pharmacy"); ?>',
				    iconCls   : 'edit',
				    disabled  : true,
				    handler   : function(){
						// TODO //
				    }
				},{
					id        : 'deletePharmacy',
				    text      : '<?php i18n("Delete a Pharmacy"); ?>',
				    iconCls   : 'delete',
				    disabled  : true,
				    handler   : function(){
						// TODO //
				    }
			  	}]
			}]
        },{
            title	:'<?php i18n("Insurance Companies"); ?>',
    	    frame	: false,
	        border	: false,
            items	: [ insuranceGrid ],
			dockedItems: [{
		  	  	xtype: 'toolbar',
			  	dock: 'top',
			  	items: [{
					id        : 'addCompany',
				    text      : '<?php i18n("Add a Comapny"); ?>',
				    iconCls   : 'save',
				    handler   : function(){
						// TODO //
				    }
								},{
					id        : 'editCompany',
				    text      : '<?php i18n("View / Edit a Company"); ?>',
				    iconCls   : 'edit',
				    disabled  : true,
				    handler   : function(){
						// TODO //
				    }
				},{
					id        : 'deleteCompany',
				    text      : '<?php i18n("Delete a Company"); ?>',
				    iconCls   : 'delete',
				    disabled  : true,
				    handler   : function(){
						// TODO //
				    }
			  	}]
			}]
		},{
            title	:'<?php i18n("Insurance Numbers"); ?>',
    	    frame	: false,
	        border	: false,
            items	: [InsuranceNumbersGrid ]
		},{
            title	:'X12 Partners',
    	    frame	: false,
	        border	: false,
            items	: [ x12ParnersGrid ],
			dockedItems: [{
		  	  	xtype: 'toolbar',
			  	dock: 'top',
			  	items: [{
					id        : 'addPartner',
				    text      : '<?php i18n("Add New Partner"); ?>',
				    iconCls   : 'save',
				    handler   : function(){
						// TODO //
				    }
			  	}]
			}]
		},{
            title	:'<?php i18n("Documents"); ?>',
    	    frame	: false,
	        border	: false,
            items: [{

			}],
			dockedItems: [{
		  	  	xtype: 'toolbar',
			  	dock: 'bottom',
			  	items: [{
					id        : 'editCategory',
				    text      : '<?php i18n("Edit Category"); ?>',
				    iconCls   : 'save',
				    handler   : function(){
						// TODO //
				    }
				},{
					id        : 'updateFiles',
				    text      : '<?php i18n("Update Files"); ?>',
				    iconCls   : 'save',
				    handler   : function(){
						// TODO //
				    }
			  	}]
			}]
		},{
            title	:'<?php i18n("HL7 Viewer"); ?>',
    	    frame	: false,
	        border	: false,
            items	: [{

			}],
			dockedItems: [{
		  	  	xtype: 'toolbar',
			  	dock: 'bottom',
			  	items: [{
					id        : 'clearHl7Data',
				    text      : '<?php i18n("Clear HL7 Data"); ?>',
				    iconCls   : 'save',
				    handler   : function(){
						// TODO //
				    }
				},{
					id        : 'parseHl7Data',
				    text      : '<?php i18n("Parse HL7"); ?>',
				    iconCls   : 'save',
				    handler   : function(){
						// TODO //
				    }
			  	}]
			}]
		}],
		
    });

	//******************************************************************************
	// Render panel
	//******************************************************************************
	var topRenderPanel = Ext.create('Ext.panel.Panel', {
		title		: '<?php i18n('Practice Settings'); ?>',
		renderTo	: Ext.getCmp('MainApp').body,
		layout		: 'fit',
		height		: Ext.getCmp('MainApp').getHeight(),
	  	frame 		: false,
		border 		: false,
		id			: 'topRenderPanel',
		items		: [	tabPanel ]
	});
}); // End ExtJS
</script>