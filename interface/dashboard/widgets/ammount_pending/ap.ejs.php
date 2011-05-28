<?php

//--------------------------------------------------------------------------------------------------------------------------
// ap.ejs.php
// v0.0.1
// Under GPLv3 License
//
// Integrated by: Ernesto Rodriguez. in 2011
//
// Remember, this file is called via the Framework Store, this is the AJAX thing.
//--------------------------------------------------------------------------------------------------------------------------
?>
// *************************************************************************************
// Users Record Structure
// *************************************************************************************
Ext.define('apRecord', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id_x12',	type: 'int'},
		{name: 'file',		type: 'string'},
		{name: 'payer',		type: 'string'},
		{name: 'ammount',	type: 'string'}
	]
});
// *************************************************************************************
// Pending Transaction store object (MAIN)
// *************************************************************************************
var storeAP = new Ext.data.Store({
	storeId		: 'storeAP',
   	model		: 'apRecord',
   	noCache		: true,
   	autoSync	: false,
   	proxy		: {
   		type	: 'ajax',
		api		: {
			read	: 'interface/dashboard/widgets/ammount_pending/data_read.ejs.php'
		},
       	reader: {
            type			: 'json',
   	        idProperty		: 'id_x12',
       	    totalProperty	: 'totals',
           	root			: 'row'
   		},
   	},
   	autoLoad: true
});

// *************************************************************************************
// x12 Document Grid Panel
// *************************************************************************************
var apGrid = Ext.create('Ext.grid.Panel', {
	store			: storeAP,
	frame			: false,
	frameHeader		: false,
	border			: false,
	height			: 360,
	loadMask    	: true,
	columns: [
	{
		text    	: '<?php i18n("Files"); ?>',
		flex	    : 1,
		sortable	: false,
		hideable	: false,
		dataIndex	: 'file'
	},
	{
		text    	: '<?php i18n("Payer"); ?>',
		sortable	: false,
		hideable	: false,
		dataIndex	: 'payer'
	},
	{
		text    	: '<?php i18n("Ammount"); ?>',
		sortable	: false,
		hideable	: false,
		dataIndex	: 'ammount',
		align		: 'right'
	}]
}); // END Grid

// *************************************************************************************
// The mini panel
// *************************************************************************************
var panelAP = Ext.create('Ext.Panel', {
	columnWidth		: 1/3,
	bodyStyle		:'padding: 0px',
	frame			: true,
	title 			: '<?php i18n("Ammount Pending"); ?>',
	closable		: true,
	collapsible		: true,
	closeAction		: 'hide',
	height			: 400,
	items			:[ apGrid ]
});