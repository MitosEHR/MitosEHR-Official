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
            url             : 'app/patientfile/new/data.php',
            bodyStyle       : 'padding: 5px',
            layout          : 'anchor',
            fieldDefaults   : { msgTarget:'side' },
            dockedItems:{
                xtype   : 'toolbar',
                dock    : 'top',
                items:[{
                    text    : 'Save new patient',
                    iconCls : 'save',
                    scope   : me,
                    handler : me.onSave
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

    onSave:function(){
        var me = this;
        var form = this.form.getForm();

        this.form.add({
            xtype   : 'textfield',
            name    : 'date_created',
            hidden  : true,
            value   : Ext.Date.format(new Date(), 'Y-m-d H:i:s')
        });

        if (form.isValid()) {
            form.submit({
                submitEmptyText:false,
                scope   : me,
                success : function(forn, action){

                    /** @namespace action.result.patient */
                    /** @namespace action.result.patient.fullname */

                    var pid      = action.result.patient.pid,
                        fullname = action.result.patient.fullname;


                    me.msg('Sweet!', 'Patient ' + fullname + ' Saved... ');
                    me.getMitosApp().setCurrPatient( pid, fullname, function(){
                        me.getMitosApp().patientSummary();
                    });

                },
                failure: function(form, action) {
                    Ext.Msg.alert('Opps!', action.result.errors.reason);
                }
            });
        }
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

    confirmationWin:function(){
        Ext.Msg.show({
            title   : 'Please confirm...',
            msg     : 'Do you want to create a <strong>new patient</strong>?',
            icon    : Ext.MessageBox.QUESTION,
            buttons : Ext.Msg.YESNO,
            scope   : this,
            fn:function(btn){
                if(btn=='yes'){
                    this.getMitosApp().patientReset();
                }else{
                    this.goBack();
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
    onActive:function(){
        this.getFormItems( this.form, this.formToRender );
        this.confirmationWin();
    }
});