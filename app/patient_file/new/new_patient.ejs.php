<?php 
//******************************************************************************
// new.ejs.php
// Patient Layout Panel
// v0.0.2
// 
// This panel is generated dinamically, using the values from layout_options
// Because this panel is dynamically generated, the user can edit or add more
// fields to this form. To modify this panel you have to work with the
// layoutEngine.class.php
// 
// MitosEHR (Eletronic Health Records) 2011
//
// Author: GI Technologies, 2011
//
//******************************************************************************

session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once($_SESSION['site']['root']."/classes/dbHelper.class.php");
include_once($_SESSION['site']['root']."/classes/I18n.class.php");
include_once($_SESSION['site']['root']."/lib/layoutEngine/layoutEngine.class.php");

$mitos_db = new dbHelper();
$layoutFactorer = new layoutEngine();

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;
?>

<script type="text/javascript">
Ext.onReady(function(){
	Ext.define('Ext.mitos.PatientPanel',{
		extend:'Ext.panel.Panel',
		uses:[
			'Ext.mitos.CRUDStore',
			'Ext.mitos.RenderPanel',
			'Ext.mitos.SaveCancelWindow'
		],
		initComponent: function(){
		
            /** @namespace Ext.QuickTips */
            Ext.QuickTips.init();
            
            var panel = this;
			var form_id = 'Demographics'; 	// Stores the current form group selected by the user.
			
			// *************************************************************************************
			// Dynamically generate the screen layout.
			// This is done, via PHP Language.
			// *************************************************************************************
			<?php 
				$layoutFactorer->actionCU("C");
				$layoutFactorer->renderForm("Demographics", "app/patient_file/new", "New Patient", 300, i18n("Save new patient", "r") ); 
			?>
			
			panel.Demographics.addDocked({
        		xtype: 'toolbar',
        		dock: 'top',
        		items: [{
        			text: '<?php i18n("Save new patient", "e"); ?>',
        			iconCls: 'save',
        			handler   : function(){
						if (panel.Demographics.getForm().findField('id').getValue()){
							var record = panel.Demographics.getAt(rowPos);
							var fieldValues = panel.Demographics.getForm().getValues();
        					var k, i;
							for ( k=0; k <= record.fields.getCount()-1; k++) {
								i = record.fields.get(k).name;
								record.set( i, fieldValues[i] );
							}
						} else {
							var obj = eval( '(' + Ext.JSON.encode(panel.Demographics.getForm().getValues()) + ')' );
							panel.Demographics.add( obj );
						}
						panel.Demographics.sync();
						panel.Demographics.load();
						Ext.topAlert.msg('<?php i18n("New patient as been saved!", "e"); ?>');
					}
        		}]
    		});

			//***********************************************************************************
			// Top Render Panel 
			// This Panel needs only 3 arguments...
			// PageTigle 	- Title of the current page
			// PageLayout 	- default 'fit', define this argument if using other than the default value
			// PageBody 	- List of items to display [form1, grid1, grid2]
			//***********************************************************************************
    		new Ext.create('Ext.mitos.RenderPanel', {
        		pageTitle: '<?php i18n("Patient Entry Form"); ?>',
				border	: true,
				frame	: true,
        		pageBody: [panel.Demographics]
    		});
			panel.callParent(arguments);
			
		} // end of initComponent
		
	}); //ens PatientPanel class
    Ext.create('Ext.mitos.PatientPanel');
    
}); // End ExtJS

</script>