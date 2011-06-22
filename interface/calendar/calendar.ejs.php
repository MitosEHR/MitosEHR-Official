<?php 
//******************************************************************************
// calendar.ejs.php
// Description: Calendar Screen Panel
// v0.0.1
// 
// Author: Gino Rivera Falú
// Modified: n/a
// 
// MitosEHR (Eletronic Health Records) 2011
//******************************************************************************

session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once($_SESSION['site']['root']."/library/I18n/I18n.inc.php");

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;
?>

<script type="text/javascript">
Ext.onReady(function() {
	Ext.define('Ext.mitos.CalendarPanel',{
		extend:'Ext.panel.Panel',
		uses:[
			'Ext.mitos.CRUDStore',
			'Ext.mitos.GridPanel',
			'Ext.mitos.TopRenderPanel',
			'Ext.mitos.SaveCancelWindow'
		],
		initComponent: function(){
		
            /** @namespace Ext.QuickTips */
            Ext.QuickTips.init();
            
            var panel = this;

			//***********************************************************************************
			// Top Render Panel 
			// This Panel needs only 3 arguments...
			// PageTigle 	- Title of the current page
			// PageLayout 	- default 'fit', define this argument if using other than the default value
			// PageBody 	- List of items to display [foem1, grid1, grid2]
			//***********************************************************************************
    		new Ext.create('Ext.mitos.TopRenderPanel', {
        		pageTitle: '<?php i18n("Calendar"); ?>',
        		pageBody: [panel.CalendarPanel]
    		});
			panel.callParent(arguments);
			
		} // end of initComponent
		
	}); //ens LayoutPanel class
    Ext.create('Ext.mitos.CalendarPanel');
    
}); // End ExtJS
</script>