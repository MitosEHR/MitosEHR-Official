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

$_SESSION['site']['flops'] = 0;

include_once('../../library/I18n/I18n.inc.php');

session_name ( "Passport" );
session_start();
session_cache_limiter('private');

?>
	var storeEn = Ext.create('Ext.data.JsonStore', {
	    fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5'],
	    data: [
	        {'name':'Mon', 'data1':10},
	        {'name':'Tues', 'data1':7},
	        {'name':'Wen', 'data1':5},
	        {'name':'Thurs', 'data1':2},
	        {'name':'Fri', 'data1':27}
	    ]
	});

	// *************************************************************************************
	// The mini panel
	// *************************************************************************************
	var enChart = Ext.create('Ext.chart.Chart', {
        id: 'chartCmp',
        width: 430,
        height: 365,
        style: 'background:#fff',
        shadow: true,
        store: storeEn,
        axes: [{
            type: 'Numeric',
            position: 'left',
            fields: ['data1'],
            label: {
                    renderer: Ext.util.Format.numberRenderer('0,0')
                },
            title: 'Number of Encounters',
            grid: true,
            minimum: 0
        }, {
            type: 'Category',
            position: 'bottom',
            fields: ['name'],
        	title: 'Week'
        }],
        series: [{
            type: 'column',
            axis: 'left',
            highlight: true,
            label: {
            	display: 'insideEnd',
              	'text-anchor': 'middle',
                field: 'data1',
                renderer: Ext.util.Format.numberRenderer('0'),
                orientation: 'vertical',
                color: '#333'
            },
            xField: 'name',
            yField: ['data1']

    	}]
	});
	// *************************************************************************************
	// The mini panel
	// *************************************************************************************
	var panelEN = Ext.create('Ext.Panel', {
		columnWidth		: 1/3,
		id 				: 'panelEN',
		bodyStyle		:'padding: 0px',
		frame			: true,
		title 			: '<?php i18n("Encounters Chart"); ?>',
		closable		: true,
		collapsible		: true,
		closeAction		: 'hide',
		height			: 400,
		items			:[ enChart ]
	});