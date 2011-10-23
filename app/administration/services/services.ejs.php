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
include_once($_SESSION['site']['root']."/classes/I18n.class.php");
//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;
?>
<script type="text/javascript">
delete Ext.mitos.Page;
Ext.onReady(function(){
	Ext.define('Ext.mitos.Page',{
        extend:'Ext.mitos.RenderPanel',
        pageTitle: '<?php i18n('Services'); ?>',
        pageLayout: 'border',
		uses:[
			'Ext.mitos.CRUDStore',
			'Ext.mitos.GridPanel',
            'Ext.mitos.TitlesComboBox',
            'Ext.mitos.CodesComboBox'
        ],
		initComponent: function(){
            var page = this;
            var rowPos;
            var currRec;
            /** @namespace Ext.QuickTips */
            Ext.QuickTips.init();
            page.storeServices = new Ext.create('Ext.mitos.CRUDStore',{
                fields: [
                    {name: 'id',      		    type: 'int'},
                    {name: 'code_text',         type: 'string'},
                    {name: 'code_text_short',   type: 'string'},
                    {name: 'code',              type: 'string'},
                    {name: 'code_type',         type: 'int'},
                    {name: 'modifier',          type: 'string'},
                    {name: 'units',             type: 'string'},
                    {name: 'fee',               type: 'int'},
                    {name: 'superbill',         type: 'string'},
                    {name: 'related_code',      type: 'string'},
                    {name: 'taxrates',          type: 'string'},
                    {name: 'cyp_factor',        type: 'string'},
                    {name: 'active',            type: 'string'},
                    {name: 'reportable',        type: 'string'}
                ],
                model		: 'ModelService',
                idProperty	: 'id',
                noCache     : false,
                read      	: 'app/administration/services/data_read.ejs.php',
                create    	: 'app/administration/services/data_create.ejs.php',
                update    	: 'app/administration/services/data_update.ejs.php',
                destroy		: 'app/administration/services/data_destroy.ejs.php'
            });
            function code_type(val) {
			    if(val == '1') {
			        return 'CPT4';
			    } else if (val == '2'){
			        return 'ICD9';
			    } else if (val == '3'){
			    	return 'HCPCS';
			    }
			    return val;
			}
            function bool(val){
                if (val == 0) {
                    return '<img src="ui_icons/no.gif" />';
                } else if(val == 1) {
                    return '<img src="ui_icons/yes.gif" />';
                }
                return val;
            }
            page.servicesFormPanel = new Ext.create('Ext.form.FormPanel', {
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
                          new Ext.create('Ext.mitos.CodesComboBox',{width: 100 }),
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
                        { width: 295, xtype: 'textfield', name: 'code_text' },
                        { width: 30, xtype: 'displayfield', value: '<?php i18n('Category'); ?>: '},
                          new Ext.create('Ext.mitos.TitlesComboBox', {width: 100 }),
                        { width: 55, xtype: 'displayfield', value: '<?php i18n('Reportable?'); ?>: '},
                        { width: 10, xtype: 'checkbox', name: 'reportable' }
                    ]
                },{
                    xtype: 'fieldcontainer',
                    defaults: { hideLabel: true },
                    msgTarget : 'under',
                    items: [
                        <?php include_once ($_SESSION['site']['root']."/app/administration/services/fees_taxes.ejs.php") ?>
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
                                    page.storeServices.add( obj );
                                }
                                page.storeServices.sync();	// Save the record to the dataStore
                                page.storeServices.load({params:{show: 'active' }});
                                page.servicesFormPanel.getForm().reset();
                            }
                        }),'-',{
                            text:'<?php i18n('Reset'); ?>',
                            handler: function(){
                                page.servicesFormPanel.getForm().reset();
                                page.cmdSave.setText('<?php i18n('Save'); ?>');
                                page.cmdSave.disable();
                            }
                        },'-',{
                            text:'<?php i18n('Not all fields are required for all codes or code types.'); ?>',
                            disabled:true
                        }
                    ]
                }]
            });
            page.servicesGrid = new Ext.create('Ext.mitos.GridPanel', {
                region		: 'center',
                store       : page.storeServices,
                listeners	: {
                    itemclick: {
                        fn: function(DataView, record, item, rowIndex, e){
                            page.servicesFormPanel.getForm().reset();
                            var rec = page.storeServices.getAt(rowIndex);
                            page.cmdSave.setText('<?php i18n('Update'); ?>');
                            page.cmdSave.enable();
                            page.servicesFormPanel.getForm().loadRecord(rec);
                            currRec = rec;
                            rowPos = rowIndex;
                        }
                    }
                },
                columns: [
                    { header: 'id', sortable: false, dataIndex: 'id', hidden: true},
                    { width: 80,  header: '<?php i18n('Code Type'); ?>',   sortable: true, dataIndex: 'code_type',  renderer:code_type },
                    { width: 80,  header: '<?php i18n('Code'); ?>',        sortable: true, dataIndex: 'code' },
                    { width: 80,  header: '<?php i18n('Modifier'); ?>',    sortable: true, dataIndex: 'modifier' },
                    { width: 60,  header: '<?php i18n('Active'); ?>',      sortable: true, dataIndex: 'active',     renderer:bool },
                    { width: 70, header: '<?php i18n('Reportable'); ?>',   sortable: true, dataIndex: 'reportable', renderer:bool },
                    { flex: 1,    header: '<?php i18n('Description'); ?>', sortable: true, dataIndex: 'code_text' },
                    { width: 100, header: '<?php i18n('Standard'); ?>',    sortable: true, dataIndex: 'none' }
                ],
                tbar: new Ext.create('Ext.PagingToolbar', {
                    store: page.storeServices,
                    displayInfo: true,
                    emptyMsg: "<?php i18n('No Office Notes to display'); ?>",
                    plugins: new Ext.create('Ext.ux.SlidingPager', {}),
                    items: [
                        '-',
                        new Ext.create('Ext.mitos.CodesComboBox', {
                            width: 100,
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
            page.pageBody = [ page.servicesFormPanel, page.servicesGrid ];
			page.callParent(arguments);
		} // end of initComponent
	}); //ens servicesPage class
    MitosPanel = Ext.create('Ext.mitos.Page');
}); // End ExtJS
</script>