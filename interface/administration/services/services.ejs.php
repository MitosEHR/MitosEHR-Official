<?php
//******************************************************************************
// services.ejs.php
// Services
// v0.0.1
//
// Author: Ernest Rodriguez
//
// MitosEHR (Electronic Health Records) 2011
//******************************************************************************
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');
include_once($_SESSION['site']['root']."/library/I18n/I18n.inc.php");
//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;
?>
<script type="text/javascript">
Ext.onReady(function(){
	Ext.define('Ext.mitos.servicesPage',{
		extend:'Ext.panel.Panel',
		uses:[
			'Ext.mitos.CRUDStore',
			'Ext.mitos.GridPanel',
			'Ext.mitos.TopRenderPanel'
		],
		initComponent: function(){
            var page = this;
            var rowPos;
            var currRec;
            page.storeOnotes = new Ext.create('Ext.mitos.CRUDStore',{
                fields: [
                    {name: 'id',      		type: 'int'},
                    {name: 'date',          type: 'date', dateFormat: 'c'},
                    {name: 'body',          type: 'string'},
                    {name: 'user',          type: 'string'},
                    {name: 'facility_id',   type: 'string'},
                    {name: 'activity',   	type: 'string'}
                ],
                model		: 'modelOnotes',
                idProperty	: 'id',
                read      	: 'interface/miscellaneous/office_notes/data_read.ejs.php',
                create    	: 'interface/miscellaneous/office_notes/data_create.ejs.php',
                update    	: 'interface/miscellaneous/office_notes/data_update.ejs.php',
                destroy		: 'interface/miscellaneous/office_notes/data_destroy.ejs.php',
                autoLoad	: false
            });
            page.servicesFormPanel = Ext.create('Ext.form.FormPanel', {
                region		: 'north',
                frame 		: true,
                height      : 150,
                margin		: '0 0 3 0',
                layout      : 'anchor',
                bodyBorder  : true,
                bodyPadding : '10 10 0 10',
                defaults: {
                    labelWidth: 90,
                    anchor: '100%',
                    layout: {
                        type: 'hbox',
                        defaultMargins: {top: 0, right: 25, bottom: 0, left: 0}
                    }
                },
                items		:[{
                    xtype: 'textfield', hidden: true, name: 'id'
                },{
                    xtype: 'fieldcontainer',
                    defaults: { hideLabel: true },
                    msgTarget : 'under',
                    items: [
                        { width: 70, xtype: 'displayfield', value: '<?php i18n('Type'); ?>: '},
                          new Ext.create('Ext.mitos.CodeTypesComboBox'),
                        { width: 15, xtype: 'displayfield', value: '<?php i18n('Code'); ?>: '},
                        { width: 130, xtype: 'textfield', name: 'code' },
                        { width: 30, xtype: 'displayfield', value: '<?php i18n('Modifier'); ?>: '},
                        { width: 100, xtype: 'textfield', name: 'mod' },
                        { width: 30, xtype: 'displayfield', value: '<?php i18n('Active?'); ?>: '},
                        { width: 280, xtype: 'checkbox', name: 'active' }
                    ]
                },{
                    xtype: 'fieldcontainer',
                    defaults: { hideLabel: true },
                    msgTarget : 'under',
                    items: [
                        { width: 70, xtype: 'displayfield', value: '<?php i18n('Description'); ?>: '},
                        { width: 295, xtype: 'textfield', name: 'code' },
                        { width: 30, xtype: 'displayfield', value: '<?php i18n('Ctegory'); ?>: '},
                          new Ext.create('Ext.mitos.TitlesComboBox', {width: 100 }),
                        { width: 55, xtype: 'displayfield', value: '<?php i18n('Reportable?'); ?>: '},
                        { width: 10, xtype: 'checkbox', name: 'code' }
                    ]
                },{
                    xtype: 'fieldcontainer',
                    defaults: { hideLabel: true },
                    msgTarget : 'under',
                    items: [
                        <?php include_once ($_SESSION['site']['root']."/interface/administration/services/fees_taxes.ejs.php") ?>
                    ]
                }],
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [
                        page.cmdSave = new Ext.create('Ext.Button', {
                            text      	: '<?php i18n("Save"); ?>',
                            iconCls   	: 'save',
                            disabled	: true,
                            handler   : function(){
                                var form = this.up('form').getForm();
                                if (form.findField('id').getValue()){ // Update
                                    var record = page.storeOnotes.getAt(rowPos);
                                    var fieldValues = form.getValues();
                                    for (var k=0; k <= record.fields.getCount()-1; k++) {
                                        var i = record.fields.get(k).name;
                                        record.set( i, fieldValues[i] );
                                    }
                                    record.set( 'activity', '1' );
                                } else { // Add
                                    var obj = eval( '(' + Ext.JSON.encode(form.getValues()) + ')' );
                                    page.storeOnotes.add( obj );
                                }
                                page.storeOnotes.sync();	// Save the record to the dataStore
                                page.storeOnotes.load({params:{show: 'active' }});
                                page.servicesFormPanel.getForm().reset();
                            }
                        }),
                    { text:'<?php i18n('Not all fields are required for all codes or code types.'); ?>', disabled:true }
                    ]
                }]
            });
            page.servicesGrid = new Ext.create('Ext.mitos.GridPanel', {
                region		: 'center',
                store       : page.storeOnotes,
                listeners	: {
                    itemclick: {
                        fn: function(DataView, record, item, rowIndex, e){
                            page.servicesFormPanel.getForm().reset();
                            var rec = page.storeOnotes.getAt(rowIndex);
                            page.cmdSave.setText('<?php i18n('Update'); ?>');
                            page.servicesFormPanel.getForm().loadRecord(rec);
                            currRec = rec;
                            rowPos = rowIndex;
                        }
                    }
                },
                columns: [
                    { header: 'id', sortable: false, dataIndex: 'id', hidden: true},
                    { width: 80,  header: '<?php i18n('Code'); ?>',        sortable: true, dataIndex: 'user' },
                    { width: 80,  header: '<?php i18n('Modifier'); ?>',    sortable: true, dataIndex: 'user' },
                    { width: 50,  header: '<?php i18n('Active'); ?>',      sortable: true, dataIndex: 'user' },
                    { width: 100, header: '<?php i18n('Reportable'); ?>',  sortable: true, dataIndex: 'user' },
                    { flex: 1,    header: '<?php i18n('Description'); ?>', sortable: true, dataIndex: 'user' },
                    { width: 100, header: '<?php i18n('Standard'); ?>',    sortable: true, dataIndex: 'user' }
                ],
                tbar: Ext.create('Ext.PagingToolbar', {
                    store: page.storeOnotes,
                    displayInfo: true,
                    emptyMsg: "<?php i18n('No Office Notes to display'); ?>",
                    plugins: Ext.create('Ext.ux.SlidingPager', {}),
                    items: [
                        '-',
                        page.codeTypeCombo = new Ext.create('Ext.mitos.CodeTypesComboBox', {
                            listeners	: {
                                afterrender: function(){

                                }
                            },
                            handler   	: function(){

                            }
                        }),'-',
                        new Ext.create('Ext.form.field.Text',{
                            emptyText:'Search',
                            handler: function(){
                                
                            }
                        }),'-',
                        page.cmdShowAll = new Ext.create('Ext.Button', {
                            text      	: '<?php i18n("Show All Active/Deactivate Codes"); ?>',
                            iconCls   	: 'save',
                            enableToggle: true,
                            handler   : function(){

                            }
                        })
                    ]
                })
            }); // END GRID
            Ext.create('Ext.mitos.TopRenderPanel', {
                pageTitle: '<?php i18n('Sevices'); ?>',
                pageLayout: 'border',
                pageBody: [page.servicesFormPanel,page.servicesGrid ]
            });
			page.callParent(arguments);
		} // end of initComponent
	}); //ens oNotesPage class
    Ext.create('Ext.mitos.servicesPage');
}); // End ExtJS
</script>