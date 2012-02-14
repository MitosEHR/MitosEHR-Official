/**
 * roles.ejs.php
 * Description: Facilities Screen
 * v0.0.3
 *
 * Author: Ernesto J Rodriguez
 * Modified: n/a
 *
 * MitosEHR (Eletronic Health Records) 2011
 *
 * @namespace Roles.getRoleForm
 * @namespace Roles.saveRolesData
 * @namespace Roles.getRolesData
 */
Ext.define('Ext.mitos.view.administration.Roles',{
    extend      : 'Ext.mitos.classes.RenderPanel',
    id          : 'panelRoles',
    pageTitle   : 'Roles and Permissions',
    uses:[
        'Ext.mitos.classes.restStoreModel'
    ],
    initComponent: function(){

        var me = this;

        //******************************************************************************
        // Roles Store
        //******************************************************************************

        me.form = Ext.create('Ext.form.Panel',{
            url         : 'app/administration/roles/data.php?task=save',
            bodyPadding : 10,
            items:[{
                xtype       : 'fieldcontainer',
                defaultType : 'mitos.checkbox',
                layout      : 'hbox'
            }],
            tbar:[{
                text    : 'Save',
                iconCls : 'save',
                scope   : me,
                handler : me.onSave
            }],
            bbar:[{
                text    : 'Save',
                iconCls : 'save',
                scope   : me,
                handler : me.onSave
            }]
        });

        me.pageBody = [ me.form ];
        me.callParent(arguments);
    },

    getHeader:function(){
        return [{
            xtype : 'container',
            html  : '<div class="roleHeader">' +
                        '<span class="perm">Permission</span>' +
                        '<span class="role">Front Office</span>' +
                        '<span class="role">Auditors</span>' +
                        '<span class="role">Clinician</span>' +
                        '<span class="role">Physician</span>' +
                        '<span class="role">Adminstrators</span>' +
                    '</div>'
        }]
    },

    onSave:function(){
        var me = this,
            form = me.form.getForm(),
            data = form.getValues();


        if (form.isValid()) {
            Roles.saveRolesData(data, function(provider, response){
                if(response.result.success){
                    me.msg('Sweet!','Roles have been updated');

                }else{
                    me.msg('Oops!','Something went wrong');
                }

            });
        }
    },


    getFormData:function(){

        var form = this.form;

        var formFields = form.getForm().getFields(),
            modelFields = [];

        Ext.each(formFields.items, function(field){
            modelFields.push({name:field.name, type:'auto'});
        });

        var model = Ext.define( form.itemId+'Model', {
            extend: 'Ext.data.Model',
            fields: modelFields,
            proxy: {
                type        : 'direct',
                api:{
                    read: Roles.getRolesData
                }
            }
        });

        var store = Ext.create('Ext.data.Store', {
            model: model
        });

        store.load({
            scope   : this,
            callback: function(records, operation, success){

                if(success){
                    form.getForm().loadRecord(records[0]);
                    form.el.unmask();
                }
            }
        });
    },

    /**
    * This function is called from MitosAPP.js when
    * this panel is selected in the navigation panel.
    * place inside this function all the functions you want
    * to call every this panel becomes active
    */
    onActive:function(callback){
        var me   = this,
            form = me.form;

        form.el.mask('Loading...');

        form.removeAll();

        Roles.getRoleForm(null, function(provider, response){
            form.add(me.getHeader());
            form.add(eval(response.result));
            form.doLayout();
            me.getFormData();
        });

        callback(true);
    }
});