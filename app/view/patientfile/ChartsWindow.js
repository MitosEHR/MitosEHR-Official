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
	title      : 'Vector Charts',
	layout     : 'card',
	closeAction: 'hide',
	modal      : true,
	width      : window.innerWidth - 200,
	height     : window.innerHeight - 200,
	maximizable: true,
	//maximized  : true,
	initComponent: function() {
		var me = this;

		me.vitalsStore = Ext.create('App.store.patientfile.Vitals');

        me.graphStore = Ext.create('App.store.patientfile.VectorGraph');

		me.tbar = ['->', {
			text        : 'BP/Pulse/Temp',
			action      : 'bpPulseTemp',
			pressed     : true,
			enableToggle: true,
			toggleGroup : 'charts',
			scope       : me,
			handler     : me.onChartSwitch
		}, '-', {
			text        : 'Growth Chart',
			action      : 'growChart',
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

			me.BPPulseTemp = Ext.create('App.view.patientfile.charts.BPPulseTemp',{
				store:me.vitalsStore
			}),

            me.Growth = Ext.create('App.view.patientfile.charts.Growth',{
                store:me.graphStore
            }),

            me.HeadCircumference = Ext.create('App.view.patientfile.charts.HeadCircumference',{
                store:me.graphStore
            }),

			me.weightForAge = Ext.create('App.view.patientfile.charts.WeightForAge',{
				store:me.graphStore
			}),

			me.headForAge = Ext.create('App.view.patientfile.charts.HeightForAge',{
				store:me.graphStore
			})
		];

		me.listeners = {
			scope:me,
			show:me.onWinShow
		};

		me.callParent(arguments);
	},

	onWinShow:function(){
        var layout = this.getLayout();
        layout.setActiveItem(0);

		this.vitalsStore.load();

	},

	onChartSwitch: function(btn) {
		var layout = this.getLayout();

		if(btn.action == 'bpPulseTemp') {
			layout.setActiveItem(0);
		} else if(btn.action == 'growChart') {
            this.graphStore.load({
                params:{
                    type:1,
                    pid:app.currPatient.pid
                }
            });
			layout.setActiveItem(1);
		} else if(btn.action == 'headCirChart') {
            this.graphStore.load({
                params:{
                    type:4,
                    pid:app.currPatient.pid
                }
            });
			layout.setActiveItem(2);
		} else if(btn.action == 'weightAge') {
            this.graphStore.load({
                params:{
                    type:3,
                    pid:app.currPatient.pid
                }
            });
			layout.setActiveItem(3);
		} else if(btn.action == 'heightAge') {
            this.graphStore.load({
                params:{
                    type:4,
                    pid:app.currPatient.pid
                }
            });
			layout.setActiveItem(4);
		}
	}
});
