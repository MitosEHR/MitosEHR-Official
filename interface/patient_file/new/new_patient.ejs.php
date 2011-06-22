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
//******************************************************************************

session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once($_SESSION['site']['root']."/library/dbHelper/dbHelper.inc.php");
include_once($_SESSION['site']['root']."/library/I18n/I18n.inc.php");
include_once($_SESSION['site']['root']."/library/layoutEngine/layoutEngine.class.php");

$mitos_db = new dbHelper();
$layoutSpitter = new layoutEngine();
$layoutSpitter->dbObject($mitos_db);

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
			'Ext.mitos.GridPanel',
			'Ext.mitos.TopRenderPanel',
			'Ext.mitos.SaveCancelWindow',
			'Ext.mitos.MitosApplication'
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
				$layoutSpitter->formPanel("S", "New Patient Entry Form", "data_create.ejs.php", "patientForm");
				//...
				$layoutSpitter->formPanel("E");
			?>

			// *************************************************************************************
			// Layout Panel Screen
			// *************************************************************************************
			panel.PatientPanel = Ext.create('Ext.Panel', {
				border	: true,
				frame	: true,
        		items	: [ panel.patientForm ]
			}); // END LayoutPanel

			//***********************************************************************************
			// Top Render Panel 
			// This Panel needs only 3 arguments...
			// PageTigle 	- Title of the current page
			// PageLayout 	- default 'fit', define this argument if using other than the default value
			// PageBody 	- List of items to display [form1, grid1, grid2]
			//***********************************************************************************
    		new Ext.create('Ext.mitos.TopRenderPanel', {
        		pageTitle: '<?php i18n("Patient Entry Form"); ?>',
        		pageBody: [panel.PatientPanel]
    		});
			panel.callParent(arguments);
			
		} // end of initComponent
		
	}); //ens PatientPanel class
    Ext.create('Ext.mitos.PatientPanel');
    
}); // End ExtJS

</script>