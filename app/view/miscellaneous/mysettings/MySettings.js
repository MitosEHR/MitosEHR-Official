//******************************************************************************
// new.ejs.php
// New Patient Entry Form
// v0.0.1
// 
// Author: Ernest Rodriguez
// Modified: GI Technologies, 2011
// 
// MitosEHR (Electronic Health Records) 2011
//******************************************************************************
Ext.define('Ext.mitos.view.miscellaneous.mysettings.MySettings',{
    extend      : 'Ext.mitos.classes.RenderPanel',
    id          : 'panelMySettings',
    pageTitle   : 'My Settings',
    uses:[
        'Ext.mitos.classes.CRUDStore',
        'Ext.mitos.classes.GridPanel'
    ],
    initComponent: function(){
        var panel = this;
        // *************************************************************************************
        // User Settings Form
        // Add or Edit purpose
        // *************************************************************************************
        panel.uSettingsForm = Ext.create('Ext.mitos.classes.form.FormPanel', {
            id          : 'uSettingsForm',
            bodyStyle   : 'padding: 10px;',
            cls			: 'form-white-bg',
            frame		: true,
            hideLabels  : true,
            items: [{
                xtype: 'textfield', hidden: true, id: 'id', name: 'id'
            },{
                xtype:'fieldset',
                title: 'Appearance Settings',
                collapsible: true,
                defaultType: 'textfield',
                layout: 'anchor',
                defaults: {
                    labelWidth: 89,
                    anchor: '100%',
                    layout: {
                        type: 'hbox',
                        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                    }
                },
                items :[{
                    // fields
                },{

                },{

                }]
            },{
                xtype:'fieldset',
                title: 'Locale Settings',
                collapsible: true,
                defaultType: 'textfield',
                layout: 'anchor',
                defaults: {
                    labelWidth: 89,
                    anchor: '100%',
                    layout: {
                        type: 'hbox',
                        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                    }
                },
                items :[{
                   // fields
                },{

                },{

                }]
            },{
                xtype:'fieldset',
                title: 'Calendar Settings',
                collapsible: true,
                defaultType: 'textfield',
                layout: 'anchor',
                defaults: {
                    labelWidth: 89,
                    anchor: '100%',
                    layout: {
                        type: 'hbox',
                        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                    }
                },
                items :[{
                    // fields
                },{

                },{

                }]
            }],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    text      	: 'Save',
                    iconCls   	: 'save',
                    id        	: 'cmdSave',
                    disabled	: true,
                    handler   : function(){

                    }
                }]
            }]
        });
        panel.pageBody = [panel.uSettingsForm];
        panel.callParent(arguments);
    },
    /**
    * This function is called from MitosAPP.js when
    * this panel is selected in the navigation panel.
    * place inside this function all the functions you want
    * to call every this panel becomes active
    */
    onActive:function(callback){
        callback(true);
    }
}); // End ExtJS