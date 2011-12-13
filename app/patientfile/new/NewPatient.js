/**
 * NewPatient.Js
 * Patient Layout Panel
 * v0.0.5
 *
 * This panel is generated dinamically, using the values from layout_options
 * Because this panel is dynamically generated, the user can edit or add more
 * fields to this form. To modify this panel you have to work with the
 * layoutEngine.class.php
 *
 * MitosEHR (Eletronic Health Records) 2011
 *
 * Author   : GI Technologies, 2011
 * Modified : Ernesto J Rodriguez (Certun) 10/25/2011
 */
Ext.define('Ext.mitos.panel.patientfile.new.NewPatient',{
    extend      : 'Ext.mitos.RenderPanel',
    id          : 'panelNewPatient',
    pageTitle   : 'Patient Entry Form',
    uses        : [ 'Ext.mitos.PhotoIdWindow' ],
    initComponent: function(){

        var me = this;

        me.formTitle      = 'Demographics';
        me.formToRender   = 'Demographics';

        me.form = Ext.create('Ext.form.Panel', {
            title           : me.formTitle,
            bodyStyle       : 'padding: 5px',
            layout          : 'anchor',
            height          : 300,
            fieldDefaults   : { msgTarget:'side' },
            dockedItems:{
                xtype   : 'toolbar',
                dock    : 'top',
                items:[{
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
    },
    /**
     * This will show the window to take a picture
     */
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
    },
    /**
     * this function will add the form items to the form
     */
    getFormItems: function(){
        var form = this.form;
        form.removeAll();
        Ext.Ajax.request({
            url     : 'classes/formLayoutEngine.class.php',
            params  : {form:this.formToRender},
            scope   : this,
            success : function(response){
                form.add(eval(response.responseText));
                form.doLayout();
            }
        });
    },
    /**
     * This function is called from MitosAPP.js when
     * this panel is selected in the navigation panel.
     * place inside this function all the functions you want
     * to call every this panel becomes active
     */
    onActive:function(){
        this.getFormItems();
    }
});