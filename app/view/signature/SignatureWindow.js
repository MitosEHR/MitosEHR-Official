/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File:
 * Date: 2/15/12
 * Time: 4:30 PM
 *
 * @namespace Immunization.getImmunizationsList
 * @namespace Immunization.getPatientImmunizations
 * @namespace Immunization.addPatientImmunization
 */
Ext.define('App.view.signature.SignatureWindow', {
	extend       : 'Ext.window.Window',
	title        : 'Please Sign',
	closeAction  : 'hide',
	height       : 150,
	width        : 310,
	bodyStyle    : 'background-color:#fff',
	modal        : true,
    layout:'fit',
	initComponent: function() {
		var me = this;

        me.html = me.signature = '<iframe id="svgSignature" src="app/view/signature/signature.svg" frameborder="0"></iframe>';

        me.buttons = [
            {
                text:'Save',
                scope:me,
                handler:me.signatureSave
            },
            {
                text:'Cancel',
                scope:me,
                handler:me.signatureCancel
            }
        ];

		this.callParent(arguments);

	},

    signatureSave:function(){
        var svg = document.getElementById('svgSignature').contentWindow;
        say(svg.getSignature());
    },

    signatureCancel:function(){
        var svg = document.getElementById('svgSignature').contentWindow;
        svg.clearSignature();
        this.close();
    }



});