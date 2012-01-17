//**********************************************************************************
// roles.ejs.php
// Description: Facilities Screen
// v0.0.3
// 
// Author: Ernesto J Rodriguez
// Modified: n/a
// 
// MitosEHR (Eletronic Health Records) 2011
//**********************************************************************************
Ext.define('Ext.mitos.panel.administration.roles.Roles',{
    extend      : 'Ext.mitos.RenderPanel',
    id          : 'panelRoles',
    pageTitle   : 'Roles and Permissions',
    uses:[
        'Ext.mitos.restStoreModel'
    ],
    initComponent: function(){

        var me = this;

        //******************************************************************************
        // Roles Store
        //******************************************************************************

        me.form = Ext.create('Ext.form.Panel',{
            bodyPadding: 10,
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
                        '<span class="role">Super User</span>' +
                    '</div>'
        }]
    },

    onSave:function(){

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
        Ext.Ajax.request({
            url     : 'app/administration/roles/data.php?task=form',
            scope   : me,
            success : function(response){
                form.add(me.getHeader());
                form.add(eval(response.responseText));
                form.doLayout();
                form.el.unmask();
            }
        });
        callback(true);
    }
});