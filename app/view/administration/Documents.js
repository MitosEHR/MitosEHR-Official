/**
 * layout.ejs.php
 * Description: Layout Screen Panel
 * v0.0.1
 *
 * Author: GI Technologies, 2011
 * Modified: n/a
 *
 * MitosEHR (Electronic Health Records) 2011
 */
Ext.define('App.view.administration.Documents', {
	extend              : 'App.classes.RenderPanel',
	id                  : 'panelDocuments',
	pageTitle           : 'Document Template Editor',
	pageLayout          : 'border',
	uses                : [
		'App.classes.GridPanel'
	],
	initComponent       : function() {

		var me = this;

        me.templatesDocumentsStore = Ext.create('App.store.administration.DocumentsTemplates');

        Ext.define('tokenModel', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'id',     type: 'int'},
                {name: 'title',     type: 'string'},
                {name: 'token',     type: 'string'},
                {name: 'tooltip',   type: 'string'}
            ]
        });
        me.tokenStore =  Ext.create('Ext.data.Store', {
             model: 'tokenModel',
             data : [
                 {
                     title: 'Patient Name',
                     token: '[patient_name]'
                 },
                 {
                     title: 'Patient First Name',
                     token: '[patient_first_name]'
                 },
                 {
                     title: 'Patient Middle Name',
                     token: '[patient_middle_name]'
                 },
                 {
                     title: 'Patient Last',
                     token: '[patient_last_name]'
                 }
             ]
         });



		me.HeaderFootergrid = Ext.create('Ext.grid.Panel', {
			title      : 'Header / Footer Templates',
			region     : 'north',
            height     : 100,
			split      : true,
			hideHeaders: true,
			columns    : [
				{
					flex     : 1,
					sortable : true,
					dataIndex: 'title',
                    editor:{
                        xtype:'textfield',
                        allowBlank:false
                    }
				}
			],
			listeners  : {
				scope    : me,
				itemclick: me.onDocumentsGridItemClick
			}
		});

		me.DocumentsGrid = Ext.create('Ext.grid.Panel', {
			title      : 'Document Templates',
			region     : 'center',
			width      : 250,
			border     : true,
			split      : true,
            store      : me.templatesDocumentsStore,
			hideHeaders: true,
			columns    : [
				{
					flex     : 1,
					sortable : true,
					dataIndex: 'title',
                    editor:{
                        xtype:'textfield',
                        allowBlank:false
                    }
				}
			],
			listeners  : {
				scope    : me,
				itemclick: me.onDocumentsGridItemClick
			},
            tbar       :[
                '->',
                {
                    text : 'New',
                    scope: me,
                    handler: me.newDocumentTemplate
                }
            ],
            plugins:[
                me.rowEditor = Ext.create('Ext.grid.plugin.RowEditing', {
                    clicksToEdit: 2
                })

            ]
		});

        me.LeftCol = Ext.create('Ext.container.Container',{
            region:'west',
            layout:'border',
            width      : 250,
            border     : false,
            split      : true,
            items:[ me.HeaderFootergrid, me.DocumentsGrid ]
        });

		me.TeamplateEditor = Ext.create('Ext.form.Panel', {
			title      : 'Document Editor',
			region     : 'center',
            layout     : 'fit',
            autoScroll : false,
			border     : true,
			split      : true,
			hideHeaders: true,
            items: {
                xtype: 'htmleditor',
                name:'body',
                margin:5
            },
            buttons    :[
                {
                    text     : 'Save',
                    scope    : me,
                    handler  : me.onSaveEditor
                },
                {
                    text     : 'Cancel',
                    scope    : me,
                    handler  : me.onCancelEditor
                }
            ]
		});


        me.TokensGrid = Ext.create('App.classes.GridPanel', {
            title      : 'Available Tokens',
            region     : 'east',
            width      : 250,
            border     : true,
            split      : true,
            hideHeaders: true,
            store:me.tokenStore,
            disableSelection:true,
            viewConfig:{
                stripeRows:false
            },
            columns    : [
                {
                    flex     : 1,
                    sortable : false,
                    dataIndex: 'token'
                },
                {
                    dataIndex: 'token',
                    width: 30,
                    xtype: "templatecolumn",
                    tpl: new Ext.XTemplate(
                                "<object id='clipboard{token}' codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0' width='16' height='16' align='middle'>",
                                "<param name='allowScriptAccess' value='always' />",
                                "<param name='allowFullScreen' value='false' />",
                                "<param name='movie' value='lib/ClipBoard/clipboard.swf' />",
                                "<param name='quality' value='high' />",
                                "<param name='bgcolor' value='#ffffff' />",
                                "<param name='flashvars' value='callback=copyToClipBoard&callbackArg={token}' />",
                                "<embed src='lib/ClipBoard/clipboard.swf' flashvars='callback=copyToClipBoard&callbackArg={token}' quality='high' bgcolor='#ffffff' width='16' height='16' name='clipboard{token}' align='middle' allowscriptaccess='always' allowfullscreen='false' type='application/x-shockwave-flash' pluginspage='http://www.adobe.com/go/getflashplayer' />",
                                "</object>",
                        null)
                }
            ]
        });

        me.pageBody = [ me.LeftCol, me.TeamplateEditor , me.TokensGrid ];
		me.callParent(arguments);
	},
	/**
	 * if the form is valid send the POST request
	 */
	onSave: function() {

	},
	/**
	 * Delete logic
	 */
	onDelete: function() {
		
	},

    onTokensGridItemClick:function(){

    },


    onSaveEditor:function(){
        var me = this,
            form = me.down('form').getForm(),
            record = form.getRecord(),
            values = form.getValues();
        record.set(values);
    },
    onCancelEditor:function(){
        var me = this,
            form = me.down('form').getForm(),
            grid = me.DocumentsGrid;
        form.reset();
        grid.getSelectionModel().deselectAll();
    },

    onDocumentsGridItemClick:function(grid, record){
        var me = this;
        var form = me.down('form').getForm();
        form.loadRecord(record);

    },
    newDocumentTemplate:function(){
        var me = this,
            store = me.templatesDocumentsStore;
        me.rowEditor.cancelEdit();
        store.insert(0,{
            title:'New Document',
            date: new Date()
        });
        me.rowEditor.startEdit(0, 0);

    },

    copyToClipBoard:function(grid, rowIndex, colIndex){
        var rec = grid.getStore().getAt(rowIndex),
            text = rec.get('token');
    },
	
	/**
	 * This function is called from MitosAPP.js when
	 * this panel is selected in the navigation panel.
	 * place inside this function all the functions you want
	 * to call every this panel becomes active
	 */
	onActive            : function(callback) {
        var me = this;
        me.templatesDocumentsStore.load();
		callback(true);
	}
});