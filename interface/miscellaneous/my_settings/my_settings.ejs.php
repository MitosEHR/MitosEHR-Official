<?php 
//******************************************************************************
// new.ejs.php
// New Patient Entry Form
// v0.0.1
// 
// Author: Ernest Rodriguez
// Modified: Gino Rivera
// 
// MitosEHR (Eletronic Health Records) 2011
//******************************************************************************
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once("../../../library/I18n/I18n.inc.php");

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;

?>
<script type="text/javascript">
Ext.onReady(function(){
	// *************************************************************************************
	// User Settinga Form
	// Add or Edit purpose
	// *************************************************************************************
	var uSettingsForm = new Ext.form.FormPanel({
	  	id          : 'uSettingsForm',
	  	bodyStyle   : 'padding: 10px;',
	  	autoWidth   : true,
		border      : false,
		cls			: 'form-white-bg',
		frame		: true,
		hideLabels  : true,
	 	items: [{
	 		xtype: 'textfield', hidden: true, id: 'id', name: 'id'
	 	},{
		 	xtype:'fieldset',
	        title: '<?php i18n('Appearance Settings'); ?>',
	        collapsible: true,
	        defaultType: 'textfield',
	        defaults: {anchor: '100%'},
	        layout: 'anchor',
	        defaults: {
				labelWidth: 89,
			    anchor: '100%',
			    layout: {
			    	type: 'hbox',
			        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
			    }
			},
	        items :[{
				// fileds
			},{
			
			},{
			
		    }]
	    },{
	    	xtype:'fieldset',
	        title: '<?php i18n('Locale Settings'); ?>',
	        collapsible: true,
	        defaultType: 'textfield',
	        defaults: {anchor: '100%'},
	        layout: 'anchor',
	        defaults: {
				labelWidth: 89,
			    anchor: '100%',
			    layout: {
			    	type: 'hbox',
			        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
			    }
			},
	        items :[{
		       // fileds
		    },{
			
			},{
			
		    }]
	    },{ 
	    	xtype:'fieldset',
	        title: '<?php i18n('Calendar Settings'); ?>',
	        collapsible: true,
	        defaultType: 'textfield',
	        defaults: {anchor: '100%'},
	        layout: 'anchor',
	        defaults: {
				labelWidth: 89,
			    anchor: '100%',
			    layout: {
			    	type: 'hbox',
			        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
			    }
			},
	        items :[{
		    	// fileds
		    },{
			
			},{
			
		    }]  
		}],
		dockedItems: [{
	  	  	xtype: 'toolbar',
		  	dock: 'top',
		  	items: [{
			    text      	: '<?php i18n("Save"); ?>',
			    iconCls   	: 'save',
			    id        	: 'cmdSave',
			    disabled	: true,
			    handler   : function(){
				
			    }
		  	}]
		}]
	});

	
	//***********************************************************************************
	// Top Render Panel 
	// This Panel needs only 3 arguments...
	// PageTigle 	- Title of the current page
	// PageLayout 	- default 'fit', define this argument if using other than the default value
	// PageBody 	- List of items to display [foem1, grid1, grid2]
	//***********************************************************************************
    Ext.create('Ext.mitos.TopRenderPanel', {
        pageTitle: '<?php i18n('My Settings'); ?>',
        pageBody: [uSettingsForm]
    });
}); // End ExtJS
</script>




