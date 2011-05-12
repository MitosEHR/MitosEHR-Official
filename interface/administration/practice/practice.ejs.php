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
Ext.Loader.setPath('Ext.ux', '<?php echo $_SESSION['dir']['ext']['ux']; ?>');
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.toolbar.Paging',
    'Ext.ux.SlidingPager'
]);

Ext.onReady(function(){

	// *************************************************************************************
	// Phramacy Record Structure
	// *************************************************************************************
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
	// Insurance Record Structure
	// *************************************************************************************
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
	// Insurance Record Structure
	// *************************************************************************************
    Ext.define('insuranceNumbersModel', {
        extend: 'Ext.data.Model',
        fields: [
			{name: 'id',					type: 'int'},
			{name: 'name',					type: 'string'}
		]
	});
	var insuranceNumbersStore = new Ext.data.Store({
		model: 'insuranceNumbersModel',
    	noCache		: true,
    	autoSync	: false,
    	proxy		: {
    		type	: 'ajax',
			api		: {
				read	: 'interface/administration/pactice/data_read.ejs.php',
				create	: 'interface/administration/pactice/data_create.ejs.php',
				update	: 'interface/administration/pactice/data_update.ejs.php',
				destroy : 'interface/administration/pactice/data_destroy.ejs.php'
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
	// X12 Partners Record Structure
	// *************************************************************************************
    Ext.define('x12PartnersModel', {
        extend: 'Ext.data.Model',
        fields: [
			{name: 'id',					type: 'int'},
			{name: 'name',					type: 'string'}
		]
	});
	var x12PartnersStore = new Ext.data.Store({
		model: 'x12PartnersModel',
    	noCache		: true,
    	autoSync	: false,
    	proxy		: {
    		type	: 'ajax',
			api		: {
				read	: 'interface/administration/pactice/data_read.ejs.php',
				create	: 'interface/administration/pactice/data_create.ejs.php',
				update	: 'interface/administration/pactice/data_update.ejs.php',
				destroy : 'interface/administration/pactice/data_destroy.ejs.php'
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
	// Phramacy Grid (Tab 0)
	// *************************************************************************************
	var PharmacyGrid = Ext.create('Ext.grid.Panel', {
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
            		Ext.getCmp('insuranceForm').getForm().reset(); // Clear the form
            		Ext.getCmp('cmdEdit').enable();
            		Ext.getCmp('cmdDelete').enable();
					var rec = InsuranceStore.getAt(rowIndex);
					Ext.getCmp('insuranceForm').getForm().loadRecord(rec);
            		currRec = rec;
            		rowPos = rowIndex;
            	}
			},
			itemdblclick: {
            	fn: function(DataView, record, item, rowIndex, e){ 
            		Ext.getCmp('insuranceForm').getForm().reset(); // Clear the form
            		Ext.getCmp('cmdEdit').enable();
            		Ext.getCmp('cmdDelete').enable();
					var rec = InsuranceStore.getAt(rowIndex);
					Ext.getCmp('insuranceForm').getForm().loadRecord(rec);
            		currRec = rec;
            		rowPos = rowIndex;
            		winInsurance.setTitle('<?php i18n("Edit Insurance"); ?>');
            		winInsurance.show();
            	}
			}
		}
    }); // END Pharmacy Grid

	// *************************************************************************************
	// Insurance Grid (Tab 1)
	// *************************************************************************************
	var InsuranceGrid = Ext.create('Ext.grid.Panel', {
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
            		Ext.getCmp('pharmacyForm').getForm().reset(); // Clear the form
            		Ext.getCmp('cmdEdit').enable();
            		Ext.getCmp('cmdDelete').enable();
					var rec = PharmacyStore.getAt(rowIndex);
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
					var rec = PharmacyStore.getAt(rowIndex);
					Ext.getCmp('pharmacyForm').getForm().loadRecord(rec);
            		currRec = rec;
            		rowPos = rowIndex;
            		winPharmacy.setTitle('<?php i18n("Edit Pharmacy"); ?>');
            		winPharmacy.show();
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
					var rec = PharmacyStore.getAt(rowIndex);
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
					var rec = PharmacyStore.getAt(rowIndex);
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
        defaults	:{ bodyStyle:'padding:5px', autoScroll:true },
        items:[{
            title:'Pharmacies',
            items: [ PharmacyGrid ],
			dockedItems: [{
		  	  	xtype: 'toolbar',
			  	dock: 'bottom',
			  	items: [{
					id        : 'addpharmacy',
				    text      : '<?php i18n("Add a Pharmacy"); ?>',
				    iconCls   : 'save',
				    handler   : function(){
						// TODO //
				    }
			  	}]
			}]
        },{
            title:'Insurance Companies',
            items: [ InsuranceGrid ],
			dockedItems: [{
		  	  	xtype: 'toolbar',
			  	dock: 'bottom',
			  	items: [{
					id        : 'addCompany',
				    text      : '<?php i18n("Add a Comapny"); ?>',
				    iconCls   : 'save',
				    handler   : function(){
						// TODO //
				    }
			  	}]
			}]
		},{
            title:'Insurance Numbers',
            items: [InsuranceNumbersGrid ]
		},{
            title:'X12 Partners',
            items: [ x12ParnersGrid ],
			dockedItems: [{
		  	  	xtype: 'toolbar',
			  	dock: 'bottom',
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
            title:'Documents',
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
            title:'HL7 Viewer',
            items: [{

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