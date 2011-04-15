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

include_once("../../../library/I18n/I18n.inc.php");

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;

?>

<script type="text/javascript">

Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*'
]);

Ext.onReady(function() {
	
	Ext.QuickTips.init();
	
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
		proxy: {
			type: 'ajax',
			url 	: 'interface/administration/facilities/data_read.ejs.php',
			reader: {
				type			: 'json',
				idProperty		: 'id',
				totalProperty	: 'totals',
				root			: 'row'
			}
		}
	});
	FacilityStore.load();


	// *************************************************************************************
	// Facility Grid Panel
	// *************************************************************************************
	var FacilityGrid = Ext.create('Ext.grid.Panel', {
		store: FacilityStore,
        columnLines: true,
        forceFit: true,
        columns: [
			{
				text     : '<?php i18n("Name"); ?>',
				flex     : 1,
				sortable : true,
				dataIndex: 'name'
            },
            {
				text     : '<?php i18n("Phone"); ?>',
				width    : 75,
				sortable : true,
				dataIndex: 'phone'
            },
            {
				text     : '<?php i18n("Fax"); ?>',
				width    : 75,
				sortable : true,
				dataIndex: 'fax'
            },
            {
				text     : '<?php i18n("City"); ?>',
				width    : 75,
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
  		frame		: false,
		border		: false,
		bodyPadding	: 0,
		id			: 'topRenderPanel',
		items: [ FacilityGrid ]
	}); // END TOP PANEL

}); // End ExtJS

</script>