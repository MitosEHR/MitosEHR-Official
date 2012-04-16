/**
 * Created with JetBrains PhpStorm.
 * User: erodriguez
 * Date: 4/13/12
 * Time: 3:38 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('App.view.patientfile.charts.WeightForAge',{
	extend:'Ext.panel.Panel',
	layout:'fit',
	margin:5,
	title:'Weight For Age',

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
						title         : 'Weight (lbs)',
						type          : 'Numeric',
						minimum       : 0,
						maximum       : 100,
						position      : 'left',
						fields        : ['weight_lbs'],
						majorTickSteps: 50,
						minorTickSteps: 1,
						grid          : {
							odd: {
								opacity       : 1,
								stroke        : '#bbb',
								'stroke-width': 0.5
							}
						}
					},
					{
						title         : 'Weight (Kg)',
						type          : 'Numeric',
						minimum       : 0,
						maximum       : 250,
						position      : 'right',
						fields        : ['weight_kg'],
						majorTickSteps: 125,
						minorTickSteps: 1
					},
					{
						title         : 'Age (Years)',
						type          : 'Numeric',
						minimum       : 0,
						maximum       : 20,
						position      : 'bottom',
						fields        : ['date'],
						majorTickSteps: 18,
						minorTickSteps: 2

					}
				],
				series : [
					{
						title       : 'Actual Growth',
						type        : 'line',
						axis        : 'left',
						xField      : 'date',
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