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
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*'
]);

Ext.onReady(function() {
	
	Ext.QuickTips.init();
	
	var rowPos; // Stores the current Grid Row Position (int)
	var currRec; // Store the current record (Object)
	
	// *************************************************************************************
	// If a object called winUser exists destroy it, to create a new one.
	// *************************************************************************************
	if ( Ext.getCmp('winFacilities') ){ Ext.getCmp('winFacilities').destroy(); }
	
	// *************************************************************************************
	// Facility Record Structure
	// *************************************************************************************
	Ext.regModel('FacilitiesRecord', { fields: [
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
	// Facility Grid Panel
	// *************************************************************************************
	var FacilityGrid = Ext.create('Ext.grid.Panel', {
		store		: FacilityStore,
        columnLines	: true,
        frame		: false,
        frameHeader	: false,
        border		: false,
        layout		: 'fit',
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
		viewConfig: { stripeRows: true }
    }); // END Facility Grid

	// *************************************************************************************
	// Top Render Panel
	// *************************************************************************************
	var topRenderPanel = Ext.create('Ext.Panel', {
		title		: '<?php i18n("Facilities"); ?>',
		renderTo	: Ext.getCmp('MainApp').body,
		layout		: 'fit',
		height		: Ext.getCmp('MainApp').getHeight(),
  		frame		: false,
  		border		: false,
		bodyPadding	: 0,
		id			: 'topRenderPanel',
		items: [ FacilityGrid ]
	}); // END TOP PANEL

}); // End ExtJS

</script>