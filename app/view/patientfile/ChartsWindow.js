/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File:
 * Date: 2/18/12
 * Time: 10:46 PM
 */
Ext.define('App.view.patientfile.ChartsWindow', {
	extend: 'Ext.window.Window',
	requires:[
		'App.store.patientfile.Vitals'
	],
	title      : 'Vector Chart',
	layout     : 'card',
	closeAction: 'hide',
	width      : '70%',
	height     : '70%',
	minHeight  : 400,
	minWidth   : 550,
	modal      : true,
	maximizable: true,
	maximized  : true,
	initComponent: function() {
		var me = this;

		me.vitalsStore = Ext.create('App.store.patientfile.Vitals');

		me.tbar = ['->', {
			text        : 'Growth Chart',
			action      : 'growChart',
			pressed     : true,
			enableToggle: true,
			toggleGroup : 'charts',
			scope       : me,
			handler     : me.onChartSwitch
		}, '-', {
			text        : 'Head Circumference Chart',
			action      : 'headCirChart',
			enableToggle: true,
			toggleGroup : 'charts',
			scope       : me,
			handler     : me.onChartSwitch
		}, '-', {
			text        : 'Weight for Age',
			action      : 'weightAge',
			enableToggle: true,
			toggleGroup : 'charts',
			scope       : me,
			handler     : me.onChartSwitch
		}, '-', {
			text        : 'Height for Age',
			action      : 'heightAge',
			enableToggle: true,
			toggleGroup : 'charts',
			scope       : me,
			handler     : me.onChartSwitch
		}, '-'];

		me.tools = [
			{
				type   : 'print',
				tooltip: 'Print Chart',
				handler: function() {
					console.log(this.up('window').down('chart'));
				}
			}
		];



		me.items = [
			{
				xtype  : 'chart',
				style  : 'background:#fff',
				store  : me.vitalsStore,
				itemId : 'growChart',
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
				store  : this.vitalsStore,
				itemId : 'headCirChart',
				animate: true,
				shadow : true,
				hidden : true,
				theme  : 'Category1',
				legend : {
					position: 'right'
				},
				axes   : [
					{
						title         : 'Head Circumference (inches)',
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
						title         : 'Head Circumference (centimeters)',
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
				store  : this.vitalsStore,
				itemId : 'weightAge',
				animate: true,
				shadow : true,
				hidden : true,
				theme  : 'Category1',
				legend : {
					position: 'right'
				},
				axes   : [
					{
						title         : 'Weight (lbs)',
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
						title         : 'Weight (kg)',
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
				store  : this.vitalsStore,
				itemId : 'heightAge',
				animate: true,
				shadow : true,
				hidden : true,
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
	},

	onChartSwitch: function(btn) {
		var layout = this.getLayout();

		if(btn.action == 'growChart') {
			layout.setActiveItem(0);
		} else if(btn.action == 'headCirChart') {
			layout.setActiveItem(1);
		} else if(btn.action == 'weightAge') {
			layout.setActiveItem(2);
		} else if(btn.action == 'heightAge') {
			layout.setActiveItem(3);
		}
	}
});
