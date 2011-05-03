<?php 
//******************************************************************************
// roles.ejs.php
// Description: Facilities Screen
// v0.0.3
// 
// Author: Ernesto J Rodriguez
// Modified: n/a
// 
// MitosEHR (Eletronic Health Records) 2011
//**********************************************************************************
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once("../../../library/I18n/I18n.inc.php");

//**********************************************************************************
// Reset session count 10 secs = 1 Flop
//**********************************************************************************
$_SESSION['site']['flops'] = 0;

?>
<script type="text/javascript">

Ext.onReady(function(){
	//**************************************************************************
	// Global Form Panel
	//**************************************************************************
	var tabPanel = Ext.create('Ext.tab.Panel', {
        activeTab	: 0,
        defaults	:{bodyStyle:'padding:10px', autoScroll:true },
        items:[{
            title:'Pharmacies',
            items: [{

			}],
			dockedItems: [{
		  	  	xtype: 'toolbar',
			  	dock: 'bottom',
			  	items: [{
					id        : 'addpharmacy',
				    text      : '<?php i18n("Add a Pharmacy"); ?>',
				    iconCls   : 'save',
				    handler   : function(){
						// TODO //
				    }
			  	}]
			}]
        },{
            title:'Insurance Companies',
            items: [{

			}],
			dockedItems: [{
		  	  	xtype: 'toolbar',
			  	dock: 'bottom',
			  	items: [{
					id        : 'addCompany',
				    text      : '<?php i18n("Add a Comapny"); ?>',
				    iconCls   : 'save',
				    handler   : function(){
						// TODO //
				    }
			  	}]
			}]
		},{
            title:'Insurance Numbers',
            items: [{

			}]
		},{
            title:'X12 Partners',
            items: [{

			}],
			dockedItems: [{
		  	  	xtype: 'toolbar',
			  	dock: 'bottom',
			  	items: [{
					id        : 'addPartner',
				    text      : '<?php i18n("Add New Partner"); ?>',
				    iconCls   : 'save',
				    handler   : function(){
						// TODO //
				    }
			  	}]
			}]
		},{
            title:'Documents',
            items: [{

			}],
			dockedItems: [{
		  	  	xtype: 'toolbar',
			  	dock: 'bottom',
			  	items: [{
					id        : 'editCategory',
				    text      : '<?php i18n("Edit Category"); ?>',
				    iconCls   : 'save',
				    handler   : function(){
						// TODO //
				    }
				},{
					id        : 'updateFiles',
				    text      : '<?php i18n("Update Files"); ?>',
				    iconCls   : 'save',
				    handler   : function(){
						// TODO //
				    }
			  	}]
			}]
		},{
            title:'HL7 Viewer',
            items: [{

			}],
			dockedItems: [{
		  	  	xtype: 'toolbar',
			  	dock: 'bottom',
			  	items: [{
					id        : 'clearHl7Data',
				    text      : '<?php i18n("Clear HL7 Data"); ?>',
				    iconCls   : 'save',
				    handler   : function(){
						// TODO //
				    }
				},{
					id        : 'parseHl7Data',
				    text      : '<?php i18n("Parse HL7"); ?>',
				    iconCls   : 'save',
				    handler   : function(){
						// TODO //
				    }
			  	}]
			}]
		}],
		
    });

	//******************************************************************************
	// Render panel
	//******************************************************************************
	var topRenderPanel = Ext.create('Ext.panel.Panel', {
		title		: '<?php i18n('Practice Settings'); ?>',
		renderTo	: Ext.getCmp('MainApp').body,
		layout		: 'fit',
		height		: Ext.getCmp('MainApp').getHeight(),
	  	frame 		: false,
		border 		: false,
		id			: 'topRenderPanel',
		items		: [	tabPanel ]
	});
}); // End ExtJS
</script>