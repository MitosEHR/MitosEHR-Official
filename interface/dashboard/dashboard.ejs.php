<?php

/* Dashboard Application
*
* Description: Dashboard, will give a brief reports and widgets on how
* the clinic is performing, with news from MitosEHR.org
*
* version 0.0.1
* revision: N/A
* author: Gino Rivera Falú
*/

// Reset session count
$_SESSION['site']['flops'] = 0;

include_once('../../library/I18n/I18n.inc.php');

session_name ( "Passport" );
session_start();
session_cache_limiter('private');

?>
<div class="dashboard_title"><?php i18n("Dashboard"); ?></div>
<div id="portal"></div>

<script type="text/javascript">

// *************************************************************************************
// Sencha trying to be like a language
// using requiered to load diferent components
// *************************************************************************************
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*'
]);

Ext.onReady(function() {

	Ext.QuickTips.init();
	
	<?php include_once('widgets/pending_transactions/pt.ejs.php'); ?>
	<?php include_once('widgets/ammount_pending/ap.ejs.php'); ?>
	
	// *************************************************************************************
	// Top Render Panel
	// *************************************************************************************
	var topRenderPanel = Ext.create('Ext.Panel', {
		renderTo	: 'portal',
		layout		: 'column',
		autoScroll	: true,
  		frame		: false,
  		border		: false,
  		autoScroll	: true,
  		bodyStyle	: 'padding:5px 5px 5px 5px',
		defaults: {
			layout: 'anchor',
			margin: 5,
			defaults: {
				anchor: '100%',
			}
		},
		id			: 'topRenderPanel',
		items: [ panelPT, panelAP ],
		dockedItems: [{
			xtype: 'toolbar',
			dock: 'top',
			items: [{
				text: '<?php i18n("Add widgets"); ?>',
				iconCls: 'icoAddRecord',
				handler: function(){
				}
			}]
    	}]
	}); // END TOP PANEL
	
}); // END of App
</script>
