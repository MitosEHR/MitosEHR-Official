/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File:
 * Date: 2/18/12
 * Time: 10:46 PM
 */
Ext.define('App.view.patientfile.ArrivalLogWindow', {
	extend: 'Ext.window.Window',
	title      : 'Patient Arrival Log',
	closeAction: 'hide',
    layout     : 'fit',
	modal      : true,
	width      : 900,
	height     : 600,
	maximizable: true,
	initComponent: function() {
		var me = this;


        me.store = Ext.create('App.store.patientfile.PatientArrivalLog');

		me.tbar = [
            {
                xtype       : 'patienlivetsearch',
                fieldLabel  : 'Look for Patient',
                width       : 400,
                hideLabel:false,
                enableKeyEvents:true,
                listeners:{
                    scope:me,
                    select:me.onPatientSearchSelect,
                    keyup:me.onPatientSearchKeyUp

                }
		    },
            '-',
            {
                text:'Add New Patient',
                iconCls:'icoAddRecord',
                action:'newPatient',
                disabled:true,
                scope:me,
                handler:me.onNewPatient
		    }
        ];

		me.items = [
            me.ckGrid = Ext.create('Ext.grid.Panel',{
                store:me.store,
                margin:5,
                columns:[
                    {
                        xtype:'actioncolumn',
                        width:25,
                        items: [
                            {
                                icon: 'ui_icons/delete.png',  // Use a URL in the icon config
                                tooltip: 'Remove',
                                handler: function(grid, rowIndex, colIndex){

                                }
                            }
                        ]
                    },
                    {
                        header:'Time',
                        dataIndex:'time'
                    },
                    {
                        header:'Record #',
                        dataIndex:'pid'
                    },
                    {
                        header:'Patient Name',
                        dataIndex:'name',
                        flex:1
                    },
                    {
                        header:'Insurance',
                        dataIndex:'insurance'
                    },
                    {
                        header:'Area',
                        dataIndex:'area'
                    },
                    {
                        xtype:'actioncolumn',
                        width:25,
                        items: [
                            {
                                icon: 'ui_icons/icoImportant.png',
                                tooltip: 'No Record Found',
                                handler: function(grid, rowIndex, colIndex){

                                }
                            }
                        ]
                    }
                ]

            })
		];

		me.listeners = {
			scope:me,
			show:me.onWinShow
		};

		me.callParent(arguments);
	},

    onPatientSearchSelect:function(field, record){
        say(record);
    },

    onPatientSearchKeyUp:function(field){
        this.query('button[action="newPatient"]')[0].setDisabled(field.getValue() == null);
    },

    onNewPatient:function(btn){
        var me = this,
            field = me.query('patienlivetsearch')[0],
            name = field.getValue(),
            store = me.query('grid')[0].getStore();
        field.reset();
        btn =
        store.add({name:name});
    },

	onWinShow:function(){
        var me = this;

	}

});
