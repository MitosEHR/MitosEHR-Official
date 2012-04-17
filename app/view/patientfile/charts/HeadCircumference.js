/**
 * Created with JetBrains PhpStorm.
 * User: erodriguez
 * Date: 4/13/12
 * Time: 3:38 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('App.view.patientfile.charts.HeadCircumference',{
    extend:'Ext.panel.Panel',
   	layout:'fit',
   	margin:5,
	initComponent:function(){
		var me = this;

		me.items = [
			{
                xtype  : 'chart',
                store  : me.store,
                animate: false,
                shadow : true,
                //theme  :'Sky',
                axes   : [
                    {
                        title         : me.xTitle,
                        type          : 'Numeric',
                        position      : 'left',
                        fields        : ['PP','P3','P5','P10','P25','P50','P75','P90','P95','P97'],
                        grid          : {
                            odd: {
                                opacity       : 1,
                                stroke        : '#bbb',
                                'stroke-width': 0.5
                            }
                        },
                        minimum       : me.xMinimum,
                        maximum       : me.xMaximum
                    },
                    {
                        title         : me.yTitle,
                        type          : 'Numeric',
                        position      : 'bottom',
                        fields        : ['age_mos'],
                        minimum       : me.yMinimum,
                        maximum       : me.yMaximum
                    }
                ],
                series : [
                    {
                        title       : 'Circumference (cm)',
                        type        : 'scatter',
                        axis        : 'left',
                        xField      : 'age_mos',
                        yField      : 'PP',
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
                                this.update( me.yTitle + ' : ' + storeItem.get('age_mos') + '<br>'+ me.xTitle +': ' + storeItem.get('PP'));
                            }
                        }
                    },
                    {
                        title       : 'P3',
                        type        : 'line',
                        axis        : 'left',
                        xField      : 'age_mos',
                        yField      : 'P3',
                        smooth      : true,
                        showMarkers : false,
                        style: {
                            stroke: '#000000',
                            'stroke-width': 1,
                            opacity: 0.3
                        }
                    },
                    {
                        title       : 'P5',
                        type        : 'line',
                        axis        : 'left',
                        xField      : 'age_mos',
                        yField      : 'P5',
                        smooth      : true,
                        showMarkers : false,
                        style: {
                            stroke: '#000000',
                            'stroke-width': 1,
                            opacity: 0.3
                        }
                    },
                    {
                        title       : 'P10',
                        type        : 'line',
                        axis        : 'left',
                        xField      : 'age_mos',
                        yField      : 'P10',
                        smooth      : true,
                        showMarkers : false,
                        style: {
                            stroke: '#000000',
                            'stroke-width': 1,
                            opacity: 0.3
                        }
                    },
                    {
                        title       : 'P25',
                        type        : 'line',
                        axis        : 'left',
                        xField      : 'age_mos',
                        yField      : 'P25',
                        smooth      : true,
                        showMarkers : false,
                        style: {
                            stroke: '#000000',
                            'stroke-width': 1,
                            opacity: 0.3
                        }
                    },
                    {
                        title       : 'P50',
                        type        : 'line',
                        axis        : 'left',
                        xField      : 'age_mos',
                        yField      : 'P50',
                        smooth      : true,
                        showMarkers : false,
                        style: {
                            stroke: '#000000',
                            'stroke-width': 3,
                            opacity: 0.5
                        }
                    },
                    {
                        title       : 'P75',
                        type        : 'line',
                        axis        : 'left',
                        xField      : 'age_mos',
                        yField      : 'P75',
                        smooth      : true,
                        showMarkers : false,
                        style: {
                            stroke: '#000000',
                            'stroke-width': 1,
                            opacity: 0.3
                        }
                    },
                    {
                        title       : 'P95',
                        type        : 'line',
                        axis        : 'left',
                        xField      : 'age_mos',
                        yField      : 'P95',
                        smooth      : true,
                        showMarkers : false,
                        style: {
                            stroke: '#000000',
                            'stroke-width': 1,
                            opacity: 0.3
                        }
                    },
                    {
                        title       : 'P97',
                        type        : 'line',
                        axis        : 'left',
                        xField      : 'age_mos',
                        yField      : 'P97',
                        smooth      : true,
                        showMarkers : false,
                        style: {
                            stroke: '#000000',
                            'stroke-width': 1,
                            opacity: 0.3
                        }
                    }
                ]
			}

		];

		me.callParent(arguments);

	}
});