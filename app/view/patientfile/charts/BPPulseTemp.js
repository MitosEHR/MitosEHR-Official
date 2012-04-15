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
	defaults:{ flex:1 },
	initComponent:function(){
		var me = this;

		me.items = [
			{
				xtype  : 'chart',
				style  : 'background:#fff',
				store  : me.store,
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
						}

					}
				]
			},{
				xtype  : 'chart',
				style  : 'background:#fff',
				store  : me.store,
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
						}

					}
				]
			},{
				xtype  : 'chart',
				style  : 'background:#fff',
				store  : me.store,
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
						}

					}
				]
			}

		];

		me.callParent(arguments);

	}
});