/**
 * Created with JetBrains PhpStorm.
 * User: erodriguez
 * Date: 4/13/12
 * Time: 3:38 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('App.view.patientfile.charts.HeightForStature',{
	extend:'Ext.panel.Panel',
	layout:'fit',
	margin:5,
	title:'Weight For Age',

	initComponent:function(){
		var me = this;

		me.items = [
            {
                 xtype  : 'chart',
                 store  : me.store,
                 animate: true,
                 shadow : true,
                 theme:'Sky',
                 axes   : [
                     {
                         title         : 'Head Circumference (cm)',
                         type          : 'Numeric',
                         position      : 'left',
                         fields        : ['PP','P3','P5','P10','P25','P50','P75','P85','P90','P95','P97'],
                         grid          : {
                             odd: {
                                 opacity       : 1,
                                 stroke        : '#bbb',
                                 'stroke-width': 0.5
                             }
                         }
                     },
                     {
                         title         : 'Age (Mos)',
                         type          : 'Numeric',
                         position      : 'bottom',
                         fields        : ['height']
                     }
                 ],
                 series : [
                     {
                         title       : 'Circumference (cm)',
                         type        : 'scatter',
                         axis        : 'left',
                         xField      : 'height',
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
                                 this.update('Age (Mos): ' + storeItem.get('height') + '<br>Circumference: ' + storeItem.get('PP'));
                             }
                         }
                     },
                     {
                         title       : 'P3',
                         type        : 'line',
                         axis        : 'left',
                         xField      : 'height',
                         yField      : 'P3',
                         smooth      : true,
                         showMarkers : false
                     },
                     {
                         title       : 'P5',
                         type        : 'line',
                         axis        : 'left',
                         xField      : 'height',
                         yField      : 'P5',
                         smooth      : true,
                         showMarkers : false
                     },
                     {
                         title       : 'P10',
                         type        : 'line',
                         axis        : 'left',
                         xField      : 'height',
                         yField      : 'P10',
                         smooth      : true,
                         showMarkers : false
                     },
                     {
                         title       : 'P25',
                         type        : 'line',
                         axis        : 'left',
                         xField      : 'height',
                         yField      : 'P25',
                         smooth      : true,
                         showMarkers : false
                     },
                     {
                         title       : 'P50',
                         type        : 'line',
                         axis        : 'left',
                         xField      : 'height',
                         yField      : 'P50',
                         smooth      : true,
                         showMarkers : false,
                         style: {
                             stroke: '#00ff00',
                             'stroke-width': 1,
                             fill: '#80A080',
                             opacity: 0.2
                         }
                     },
                     {
                         title       : 'P75',
                         type        : 'line',
                         axis        : 'left',
                         xField      : 'height',
                         yField      : 'P75',
                         smooth      : true,
                         showMarkers : false
                     },
                     {
                         title       : 'P85',
                         type        : 'line',
                         axis        : 'left',
                         xField      : 'height',
                         yField      : 'P85',
                         smooth      : true,
                         showMarkers : false
                     },
                     {
                         title       : 'P95',
                         type        : 'line',
                         axis        : 'left',
                         xField      : 'height',
                         yField      : 'P95',
                         smooth      : true,
                         showMarkers : false
                     },
                     {
                         title       : 'P97',
                         type        : 'line',
                         axis        : 'left',
                         xField      : 'height',
                         yField      : 'P97',
                         smooth      : true,
                         showMarkers : false
                     }
                 ]
            }

		];

		me.callParent(arguments);

	}
});