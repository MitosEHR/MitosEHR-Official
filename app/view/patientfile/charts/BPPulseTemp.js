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
				theme  : 'Category1',
				legend : {
					position: 'right'
				},
				axes   : [
					{
						title         : 'Blood Pressure',
						type          : 'Numeric',
						minimum       : 0,
						maximum       : 250,
						position      : 'left',
						fields        : ['bp_systolic'],
						majorTickSteps: 20,
						minorTickSteps: 2,
						grid          : {
							odd: {
								opacity       : 1,
								fill          : '#ddd',
								stroke        : '#bbb',
								'stroke-width': 0.5
							}
						}
					},
					{
						title         : 'Date',
						type          : 'Numeric',
						position      : 'bottom',
						fields        : ['date'],
						majorTickSteps: 20,
						minorTickSteps: 2

					}
				],
				series : [
					{
						title       : 'Systolic',
						type        : 'line',
						axis        : 'left',
						xField      : 'years',
						yField      : 'bp_systolic',
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
						highlight: {
							size  : 5,
							radius: 5
						},
						axis     : 'left',
						xField   : 'years',
						yField   : 'bp_diastolic',
						smooth   : true,
						fill     : true
					}
				]
			}

		];

		me.callParent(arguments);

	}
});