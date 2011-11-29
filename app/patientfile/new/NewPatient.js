//******************************************************************************
// NewPatient.Js
// Patient Layout Panel
// v0.0.5
// 
// This panel is generated dinamically, using the values from layout_options
// Because this panel is dynamically generated, the user can edit or add more
// fields to this form. To modify this panel you have to work with the
// layoutEngine.class.php
// 
// MitosEHR (Eletronic Health Records) 2011
//
// Author   : GI Technologies, 2011
// Modified : Ernesto J Rodriguez (Certun) 10/25/2011
//******************************************************************************
Ext.define('Ext.mitos.panel.patientfile.new.NewPatient',{
    extend      : 'Ext.mitos.RenderPanel',
    id          : 'panelNewPatient',
    pageTitle   : 'Patient Entry Form',
    border	    : true,
    frame	    : true,
    uses        : [ 'Ext.mitos.CRUDStore','Ext.mitos.window.Window','Ext.mitos.PhotoIdWindow' ],
    initComponent: function(){
        var me = this;
        me.formTitle      = 'Demographics';
        me.formToRender   = 'Demographics';

        me.form = Ext.create('Ext.form.Panel', {
            title           : me.formTitle,
            bodyStyle       : 'padding: 5px',
            layout          : 'anchor', height:300,
            fieldDefaults   : {msgTarget:'side'},
            listeners:{
                scope:this,
                afterrender : me.getFormItems
            },
            dockedItems : {
                xtype   : 'toolbar',
                dock    : 'top',
                items   : [{
                    text    : 'Save new patient',
                    iconCls : 'save',
                    handler : function(){

                    }
                },'->',{
                    text    : 'Take Patient Picture',
                    handler : function(){
                        me.getPhotoIdWindow();
                    }
                }]
            }
        });
        me.pageBody = [ me.form ];
        me.callParent(arguments);
    }, // end of initComponent
    getPhotoIdWindow:function(){
        Ext.create('Ext.mitos.PhotoIdWindow',{
            title       : 'Patient Photo Id',
            loadMask    : true,
            modal       : true,
            dockedItems:{
                xtype   : 'toolbar',
                dock    : 'bottom',
                items:[{
                    text    : 'Capture Image',
                    iconCls : 'save',
                    handler : function(){

                    }
                }]
            }
        }).show();
    }, // end of getPhotoIdWindow
    getFormItems: function(form){
        Ext.Ajax.request({
            url     : 'lib/layoutEngine/layoutEngine.class.php',
            params  : {form:this.formToRender},
            scope   : this,
            success : function(response, opts){
                this.form.removeAll();
                this.form.add(eval(response.responseText));
                this.form.doLayout();
            }
        });
    }, // end of getFormItems

    loadStores:function(){
        this.getFormItems();
    }
}); //ens PatientPanel class