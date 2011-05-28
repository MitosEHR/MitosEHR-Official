<?php

//--------------------------------------------------------------------------------------------------------------------------
// pt.ejs.php
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
Ext.define('pendingRecord', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id',		type: 'int'},
		{name: 'action',	type: 'string'},
		{name: 'trans',		type: 'string'}
	]
});
// *************************************************************************************
// Pending Transaction store object (MAIN)
// *************************************************************************************
var storePending = new Ext.data.Store({
	storeId		: 'storePending',
   	model		: 'pendingRecord',
   	noCache		: true,
   	autoSync	: false,
   	proxy		: {
   		type	: 'ajax',
		api		: {
			read	: 'interface/dashboard/widgets/pending_transactions/data_read.ejs.php'
		},
       	reader: {
            type			: 'json',
   	        idProperty		: 'id',
       	    totalProperty	: 'totals',
           	root			: 'row'
   		},
   	},
   	autoLoad: true
});

// *************************************************************************************
// x12 Document Grid Panel
// *************************************************************************************
var ptGrid = Ext.create('Ext.grid.Panel', {
	store			: storePending,
	frame			: false,
	frameHeader		: false,
	border			: false,
	height			: 130,
	loadMask    	: true,
	columns: [
	{
		text    	: '<?php i18n("Files on:"); ?>',
		flex	    : 1,
		sortable	: false,
		hideable	: false,
		dataIndex	: 'action'
	},
	{
		text    	: '<?php i18n("Qty"); ?>',
		sortable	: false,
		hideable	: false,
		dataIndex	: 'trans'
	}]
}); // END Grid

// *************************************************************************************
// The mini panel
// *************************************************************************************
var panelPT = Ext.create('Ext.Panel', {
	columnWidth		: 1/3,
	bodyStyle		:'padding: 0;',
	frame			: true,
	title 			: '<?php i18n("Transactions"); ?>',
	closable		: true,
	collapsible		: true,
	closeAction		: 'hide',
	height			: 130,
	items			:[ ptGrid ]
});