/**
 * Created with JetBrains PhpStorm.
 * User: erodriguez
 * Date: 4/13/12
 * Time: 3:38 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('App.view.patientfile.charts.BPPulseTemp',{
	extend:'Ext.container.Container',
	layout:{
		type:'vbox',
		align:'stretch'
	},
	style:'background-color:#fff',
	defaults:{
		xtype:'panel',
		layout:'fit',
		frame:true,
		flex:1
	},
	initComponent:function(){
		var me = this;

		me.items = [
			{
				title:'Blood Pressure',
				margin:5,
				items:[
					{
						xtype  : 'chart',
						style  : 'background:#fff',
						store  : me.store,
						frame:true,
						animate: true,
						shadow : true,
						axes   : [
							{
								title         : 'Blood Pressure',
								type          : 'Numeric',
								position      : 'left',
								fields        : ['bp_systolic'],
								majorTickSteps: 10,
								minorTickSteps: 2,
								grid          : {
									odd: {
										opacity       : 1,
										stroke        : '#bbb',
										'stroke-width': 0.5
									}
								}
							},
							{
								title         : 'Date',
								type          : 'Time',
								dateFormat    : 'Y-m-d h:i:s a',
								position      : 'bottom',
								fields        : ['date']
							}
						],
						series : [
							{
								title       : 'Systolic',
								type        : 'line',
								axis        : 'left',
								xField      : 'date',
								yField      : 'bp_systolic',
								smooth      : true,
								highlight   : {
									size  : 10,
									radius: 10
								},
								markerConfig: {
									type          : 'circle',
									size          : 5,
									radius        : 5,
									'stroke-width': 0
								},
								tips: {
									trackMouse: true,
									renderer: function(storeItem, item) {
										this.update('Date: ' + Ext.Date.format(storeItem.get('date'), 'Y-m-d h:i:s a') + '<br>Systolic: ' + storeItem.get('bp_systolic'));
									}
				                }
							},
							{
								title    : 'Diastolic',
								type     : 'line',
								axis     : 'left',
								xField   : 'date',
								yField   : 'bp_diastolic',
								smooth   : true,
								highlight: {
									size  : 5,
									radius: 5
								},
								markerConfig: {
									type          : 'cross',
									size          : 5,
									radius        : 5,
									'stroke-width': 0
								},
								tips: {
									trackMouse: true,
									renderer: function(storeItem, item) {
										this.update('Date: ' + Ext.Date.format(storeItem.get('date'), 'Y-m-d h:i:s a') + '<br>Diastolic: ' + storeItem.get('bp_diastolic'));
									}
				                }

							}
						]
					}
				]
			},{
				title:'Pulse',
				margin:'0 5 5 5',
				items:[
					{
						xtype  : 'chart',
						style  : 'background:#fff',
						store  : me.store,
						animate: true,
						shadow : true,
						axes   : [
							{
								title         : 'Pulse (per min)',
								type          : 'Numeric',
								position      : 'left',
								fields        : ['pulse'],
								majorTickSteps: 10,
								minorTickSteps: 2,
								grid          : {
									odd: {
										opacity       : 1,
										stroke        : '#bbb',
										'stroke-width': 0.5
									}
								}
							},
							{
								title         : 'Date',
								type          : 'Time',
								dateFormat    : 'Y-m-d h:i:s a',
								position      : 'bottom',
								fields        : ['date']

							}
						],
						series : [
							{
								title       : 'Pulse',
								type        : 'line',
								axis        : 'left',
								xField      : 'date',
								yField      : 'pulse',
								smooth      : true,
								highlight   : {
									size  : 10,
									radius: 10
								},
								markerConfig: {
									type          : 'circle',
									size          : 5,
									radius        : 5,
									'stroke-width': 0
								},
								tips: {
									trackMouse: true,
									renderer: function(storeItem, item) {
										this.update('Date: ' + Ext.Date.format(storeItem.get('date'), 'Y-m-d h:i:s a') + '<br>Pulse (per min): ' + storeItem.get('pulse'));
									}
				                }
							}
						]
					}
				]
			},{
				title:'Temperature',
				margin:'0 5 5 5',
				items:[
					{

						xtype  : 'chart',
						style  : 'background:#fff',
						store  : me.store,
						animate: true,
						shadow : true,
						axes   : [
							{
								title         : 'Temp Fahrenheits',
								type          : 'Numeric',
								position      : 'left',
								fields        : ['temp_f'],
								majorTickSteps: 10,
								minorTickSteps: 2,
								grid          : {
									odd: {
										opacity       : 1,
										stroke        : '#bbb',
										'stroke-width': 0.5
									}
								}
							},
							{
								title         : 'Date',
								type          : 'Time',
								dateFormat    : 'Y-m-d h:i:s a',
								position      : 'bottom',
								fields        : ['date']

							}
						],
						series : [
							{
								title       : 'Temp (Fahrenheits)',
								type        : 'line',
								axis        : 'left',
								xField      : 'date',
								yField      : 'temp_f',
								smooth      : true,
								highlight   : {
									size  : 10,
									radius: 10
								},
								markerConfig: {
									type          : 'circle',
									size          : 5,
									radius        : 5,
									'stroke-width': 0
								},
								tips: {
									trackMouse: true,
									renderer: function(storeItem, item) {
										this.update('Date: ' + Ext.Date.format(storeItem.get('date'), 'Y-m-d h:i:s a') + '<br>Temp (Fahrenheits): ' + storeItem.get('temp_f'));
									}
				                }
							}
						]
					}
				]
			}

		];

		me.callParent(arguments);

	}
});