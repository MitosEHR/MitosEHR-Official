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
		type:'fit',
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
						title         : 'Height (inches)',
						type          : 'Numeric',
						minimum       : 0,
						maximum       : 100,
						position      : 'left',
						fields        : ['height_in'],
						majorTickSteps: 100,
						minorTickSteps: 1,
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
						title         : 'Height (centimeters)',
						type          : 'Numeric',
						minimum       : 0,
						maximum       : 250,
						position      : 'right',
						majorTickSteps: 125,
						minorTickSteps: 1
					},
					{
						title         : 'Age (Years)',
						type          : 'Numeric',
						minimum       : 0,
						maximum       : 20,
						position      : 'bottom',
						fields        : ['years'],
						majorTickSteps: 18,
						minorTickSteps: 2

					}
				],
				series : [
					{
						title       : 'Actual Growth',
						type        : 'line',
						axis        : 'left',
						xField      : 'years',
						yField      : 'hight_in',
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
						title    : 'Normal Growth',
						type     : 'line',
						highlight: {
							size  : 5,
							radius: 5
						},
						axis     : 'left',
						xField   : 'years',
						yField   : 'hight_in',
						smooth   : true,
						fill     : true
					}
				]
			},
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
						title         : 'Height (inches)',
						type          : 'Numeric',
						minimum       : 0,
						maximum       : 100,
						position      : 'left',
						fields        : ['height_in'],
						majorTickSteps: 100,
						minorTickSteps: 1,
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
						title         : 'Height (centimeters)',
						type          : 'Numeric',
						minimum       : 0,
						maximum       : 250,
						position      : 'right',
						majorTickSteps: 125,
						minorTickSteps: 1
					},
					{
						title         : 'Age (Years)',
						type          : 'Numeric',
						minimum       : 0,
						maximum       : 20,
						position      : 'bottom',
						fields        : ['years'],
						majorTickSteps: 18,
						minorTickSteps: 2

					}
				],
				series : [
					{
						title       : 'Actual Growth',
						type        : 'line',
						axis        : 'left',
						xField      : 'years',
						yField      : 'hight_in',
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
						title    : 'Normal Growth',
						type     : 'line',
						highlight: {
							size  : 5,
							radius: 5
						},
						axis     : 'left',
						xField   : 'years',
						yField   : 'hight_in',
						smooth   : true,
						fill     : true
					}
				]
			}
		];

		me.callParent(arguments);

	}
});