// vim: sw=4:ts=4:nu:nospell:fdc=4
/**
 * Ext.ux.grid.Search Plugin Example Application
 *
 * @author    Ing. Jozef Sakáloš
 * @copyright (c) 2008, by Ing. Jozef Sakáloš
 * @date      5. April 2008
 * @version   $Id: gridsearch.js 62 2008-04-30 22:36:42Z jozo $
 *
 * @license gridsearch.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the 
 * code/component(s) do NOT become part of another Open Source or Commercially
 * licensed development library or toolkit without explicit permission.
 * 
 * License details: http://www.gnu.org/licenses/lgpl.html
 */
 
/*global Ext, Example, WebPage, window */
 
Ext.ns('Example', 'WebPage');
Ext.BLANK_IMAGE_URL = './ext/resources/images/default/s.gif';
Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
Example.version = '1.1';
 
// {{{
Example.Grid1 = Ext.extend(Ext.grid.EditorGridPanel, {
	 layout:'fit'
	,border:false
	,stateful:false
	,url:'process-request.php'
	,objName:'company'
	,idName:'compID'

	,initComponent:function() {

		// create row actions
		this.rowActions = new Ext.ux.grid.RowActions({
			 actions:[{
				 iconCls:'icon-minus'
				,qtip:'Delete Record'
				,style:'margin:0 0 0 3px'
			}]
		});
		this.rowActions.on('action', this.onRowAction, this);

		Ext.apply(this, {
			// {{{
			store:new Ext.data.Store({
				reader:new Ext.data.JsonReader({
					 id:'compID'
					,totalProperty:'totalCount'
					,root:'rows'
					,fields:[
						 {name:'compID', type:'int'}
						,{name:'company', type:'string'}
						,{name:'price', type:'float'}
						,{name:'change', type:'float'}
						,{name:'pctChange', type:'float'}
						,{name:'lastChange', type:'date', dateFormat:'n/j/Y'}
						,{name:'industry', type:'string'}
//						,{name:'action1', type:'string'}
//						,{name:'qtip1', type:'string'}
//						,{name:'action2', type:'string'}
//						,{name:'qtip2', type:'string'}
//						,{name:'action3', type:'string'}
//						,{name:'qtip3', type:'string'}
						,{name:'note', type:'string'}
					]
				})
				,proxy:new Ext.data.HttpProxy({url:this.url})
				,baseParams:{cmd:'getData', objName:this.objName}
				,remoteSort:true
			})
			// }}}
			// {{{
			,columns:[{
				 header:'Company'
				,id:'company'
				,dataIndex:'company'
				,width:160
				,sortable:true
				,editor:new Ext.form.TextField({
					allowBlank:false
				})
			},{
				 header:'Price'
				,dataIndex:'price'
				,width:40
				,sortable:true
				,align:'right'
				,editor:new Ext.form.NumberField({
					 allowBlank:false
					,decimalPrecision:2
					,selectOnFocus:true
				})
			},{
				 header:'Change'
				,dataIndex:'change'
				,width:40
				,sortable:true
				,align:'right'
				,editor:new Ext.form.NumberField({
					 allowBlank:false
					,decimalPrecision:2
					,selectOnFocus:true
				})
			},{
				 header:'Change [%]'
				,dataIndex:'pctChange'
				,width:50
				,sortable:true
				,align:'right'
				,editor:new Ext.form.NumberField({
					 allowBlank:false
					,decimalPrecision:2
					,selectOnFocus:true
				})
			},{
				 header:'Last Updated'
				,dataIndex:'lastChange'
				,width:70
				,sortable:true
				,align:'right'
				,editor:new Ext.form.DateField({
				})
//				,renderer:Ext.util.Format.dateRenderer('n/j/Y')
				,renderer:Ext.util.Format.dateRenderer('m/d/Y h:i A T')
			},{
				 header:'Industry'
				,dataIndex:'industry'
				,width:75
				,sortable:true
				,editor:new Ext.form.ComboBox({
					store:new Ext.data.SimpleStore({
						 id:0
						,fields:['industry']
						,data:[
							 ['Automotive']
							,['Computer']
							,['Finance']
							,['Food']
							,['Manufacturing']
							,['Medical']
							,['Retail']
							,['Services']
						]
					})
					,displayField:'industry'
					,valueField:'industry'
					,triggerAction:'all'
					,mode:'local'
					,editable:false
					,lazyRender:true
					,forceSelection:true
				})
			},{
				 header:'Note'
				,dataIndex:'note'
				,width:75
				,sortable:true
				,editor:new Ext.form.TextArea({
					grow:true
				})
			}, this.rowActions]
			// }}}
			,plugins:[new Ext.ux.grid.Search({
				iconCls:'icon-zoom'
				,readonlyIndexes:['note']
				,disableIndexes:['pctChange']
				,minChars:3
				,autoFocus:true
//				,menuStyle:'radio'
			}), this.rowActions]
			,viewConfig:{forceFit:true}
			,buttons:[{
				 text:'Save'
				,iconCls:'icon-disk'
				,scope:this
				,handler:this.commitChanges
			},{
				 text:'Reset'
				,iconCls:'icon-undo'
				,scope:this
				,handler:function() {
					this.store.rejectChanges();
				}
			}]
			,tbar:[{
				 text:'Add Record'
				,iconCls:'icon-plus'
				,listeners:{
					 scope:this
					,click:{fn:this.addRecord,buffer:200}
				}
			}]
		}); // eo apply

		this.bbar = new Ext.PagingToolbar({
			 store:this.store
			,displayInfo:true
			,pageSize:10
		});

		// call parent
		Example.Grid1.superclass.initComponent.apply(this, arguments);
	} // eo function initComponent
	// {{{
	,onRender:function() {
		// call parent
		Example.Grid1.superclass.onRender.apply(this, arguments);

		this.bbar2 = new Ext.Toolbar({
			renderTo:this.bbar
			,items:['Example of second toolbar', '-', {
				 text:'Button'
				,iconCls:'icon-key'
			}, '-'
			]
		});

		// load store
		this.store.load({params:{start:0,limit:10}});

	} // eo function onRender
	// }}}

	,addRecord:function() {
//		console.info("adding record");
	} // eo function addRecord

	,onRowAction:function(grid, record, action, row, col) {
		switch(action) {
			case 'icon-minus':
				this.deleteRecord(record);
			break;

			default:
			break;
		}
	} // eo onRowAction

	,commitChanges:function() {
		var records = this.store.getModifiedRecords();
		if(!records.length) {
			return;
		}
		var data = [];
		Ext.each(records, function(r, i) {
			data.push(r.data);
		}, this);
		var o = {
			 url:this.url
			,method:'post'
			,callback:this.requestCallback
			,scope:this
			,params:{
				 cmd:'saveData'
				,objName:this.objName
				,data:Ext.encode(data)
			}
		};
		Ext.Ajax.request(o);
	} // eo function commitChanges

	,requestCallback:function(options, success, response) {
		if(true !== success) {
			this.showError(response.responseText);
			return;
		}
		try {
			var o = Ext.decode(response.responseText);
		}
		catch(e) {
			this.showError(response.responseText, 'Cannot decode JSON object');
			return;
		}
		if(true !== o.success) {
			this.showError(o.error || 'Unknown error');
			return;
		}

		switch(options.params.cmd) {
			case 'saveData':
				var records = this.store.getModifiedRecords();
				Ext.each(records, function(r, i) {
					if(o.insertIds && o.insertIds[i]) {
						r.set(this.idName, o.insertIds[i]);
						delete(r.data.newRecord);
					}
				});
				this.store.commitChanges();
			break;

			case 'deleteData':
			break;
		}
	} // eo function requestCallback

	,showError:function(msg, title) {
		Ext.Msg.show({
			 title:title || 'Error'
			,msg:Ext.util.Format.ellipsis(msg, 2000)
			,icon:Ext.Msg.ERROR
			,buttons:Ext.Msg.OK
			,minWidth:1200 > String(msg).length ? 360 : 600
		});
	} // eo function showError

	,deleteRecord:function(record) {
		Ext.Msg.show({
			 title:'Delete record?'
			,msg:'Do you really want to delete <b>' + record.get('company') + '</b><br/>There is no undo.'
			,icon:Ext.Msg.QUESTION
			,buttons:Ext.Msg.YESNO
			,scope:this
			,fn:function(response) {
				if('yes' !== response) {
					return;
				}
//				console.info('Deleting record');
			}
		});
	} // eo function deleteRecord

}); // eo extend

// register xtype
Ext.reg('examplegrid1', Example.Grid1);
// }}}

 
// application main entry point
Ext.onReady(function() {
    Ext.QuickTips.init();

	var adsenseHost = 
		   'gridsearch.localhost' === window.location.host
		|| 'gridsearch.extjs.eu' === window.location.host
	;
	var page = new WebPage({
		 version:Example.version
		,westContent:'west-content'
		,centerContent:'center-content'
		,adRowContent:adsenseHost ? 'adrow-content' : undefined
	});

	var ads = Ext.getBody().select('div.adsense');
	if(adsenseHost) {
		ads.removeClass('x-hidden');
	}
	else {
		ads.remove();
	}

//	var layoutPanel = new Web.LayoutPanel({
//		 version:Example.version
//		,westContent:'west-content'
//	});
 
	var win = new Ext.Window({
		 id:'gswin'
        ,title:Ext.get('page-title').dom.innerHTML
		,iconCls:'icon-grid'
		,width:700
		,height:400
//		,stateful:false
		,x:320
		,y:82
		,plain:true
		,layout:'fit'
		,closable:false
		,border:false
		,maximizable:true
		,items:{xtype:'examplegrid1', id:'examplegrid1'}
		,plugins:[new Ext.ux.IconMenu()]
	});
	win.show();
 
}); // eo function onReady
 
// eof
