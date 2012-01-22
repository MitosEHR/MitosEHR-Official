//******************************************************************************
// Render panel
//******************************************************************************
Ext.define('Ext.mitos.RenderPanel', {
    extend      : 'Ext.container.Container',
    alias       : 'widget.renderpanel',
    cls         : 'RenderPanel',
    layout      : 'border',
    frame       : false,
    border      : false,
    pageLayout	: 'fit',
    pageBody    : [],
    pageTitle   : '',
    initComponent: function(){
        var me = this;
    	Ext.apply(me,{
            items   : [{
                cls     : 'RenderPanel-header',
                itemId  : 'RenderPanel-header',
                xtype   : 'container',
                region  : 'north',
                layout  : 'fit',
                height  : 40,
                html    : '<div class="dashboard_title">' + me.pageTitle + '</div>'

            },{
                cls     : 'RenderPanel-body-container',
                xtype   : 'container',
                region  : 'center',
                layout  : 'fit',
                padding : 5,
                items:[{
                    cls      	: 'RenderPanel-body',
                    xtype 		: 'panel',
                    frame       : true,
                    layout  	: this.pageLayout,
                    border  	: false,
                    defaults	: {frame:false, border:false, autoScroll:true},
                    items    	: me.pageBody
                    }]
            }]
        },this);
        me.callParent(arguments);
    },

    updateTitle:function(pageTitle){
        this.getComponent('RenderPanel-header').update('<div class="dashboard_title">' + pageTitle + '</div>');
    },

    goBack:function(){
        App.goBack();
    },

    checkIfCurrPatient:function(){
        if(App.getCurrPatient()){
            return true;
        }else{
            return false;
        }
    },

    patientInfoAlert:function(){
        var patient = App.getCurrPatient();

        Ext.Msg.alert('Status', 'Patient: ' + patient.name + ' (' + patient.pid + ')');
    },

    currPatientError:function(){
        Ext.Msg.show({
            title   : 'Oops! No Patient Selected',
            msg     : 'Please select a patient using the <strong>"Patient Live Search"</strong> or <strong>"Patient Pool Area"</strong>',
            scope   : this,
            buttons : Ext.Msg.OK,
            icon    : Ext.Msg.ERROR,
            fn      : function(){
                this.goBack();
            }
        });
    },

    getFormItems: function(formPanel ,formToRender, callback){
        formPanel.removeAll();
        Ext.Ajax.request({
            url     : 'classes/formLayoutEngine.class.php',
            params  : {form:formToRender},
            scope   : this,
            success : function(response){
                formPanel.add(eval(response.responseText));
                formPanel.doLayout();

                if(typeof callback == 'function'){
                    callback(true);
                }
            }
        });
    },



    getCurrPatient:function(){
        return App.getCurrPatient();
    },

    getMitosApp:function(){
        return App.getMitosApp();
    },

    msg: function(title, format){
        App.msg(title, format)
    }
});
