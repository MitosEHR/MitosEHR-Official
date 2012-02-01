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
Ext.define('Ext.mitos.panel.fees.checkout.Checkout',{
    extend      : 'Ext.mitos.RenderPanel',
    id          : 'panelCheckout',
    pageTitle   : 'Checkout',
    uses        : ['Ext.mitos.CRUDStore', 'Ext.mitos.GridPanel'],
    initComponent: function(){
        var me = this;

        me.panel = Ext.create('Ext.form.Panel', {
            title: 'Example Wizard',

            layout:'card',
            bodyStyle: 'padding:15px',
            defaults: {
                // applied to each contained panel
                fieldLabel: 'First Name'            },
            // just an example of one possible navigation scheme, using buttons
            bbar: [
                {
                    id: 'move-prev',
                    text: 'Back',
                    handler: function(btn) {
                        me.navigate(btn.up("panel"), "prev");
                    },
                    disabled: true
                },
                '->', // greedy spacer so that the buttons are aligned to each side
                {
                    id: 'move-next',
                    text: 'Next',
                    handler: function(btn) {
                        me.navigate(btn.up("panel"), "next");
                    }
                }
            ],
            // the panels (or "cards") within the layout
            items: [
                {
                    xtype:"container",
                    layout:'anchor',
                    items:[{
                      xtype: 'textfield',
                        fieldLabel: '111111'
                    },{
                        xtype: 'textfield',
                        fieldLabel: '222222'
                    }]

                },{ xtype:"container",
                    layout:'anchor',
                    items:[{
                      xtype: 'textfield',
                        fieldLabel:  '333333'
                    },{
                        xtype: 'textfield',
                        fieldLabel: '444444'
                    }]


            }]

        });








        me.pageBody =  [ me.panel ];
        me.callParent(arguments);
    },
    navigate: function(panel, direction){

        var layout = panel.getLayout();
        layout[direction]();
        Ext.getCmp('move-prev').setDisabled(!layout.getPrev());
        Ext.getCmp('move-next').setDisabled(!layout.getNext());
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
}); //ens oNotesPage class
