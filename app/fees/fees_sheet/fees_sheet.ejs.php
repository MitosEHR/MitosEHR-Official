<?php 
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
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');
include_once($_SESSION['site']['root']."/classes/I18n.class.php");
//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;
?>
<script type="text/javascript">
delete Ext.mitos.Page;
Ext.onReady(function(){
	Ext.define('Ext.mitos.Page',{
		extend:'Ext.panel.Panel',
		uses:[
			'Ext.mitos.CRUDStore',
			'Ext.mitos.GridPanel',
			'Ext.mitos.RenderPanel'
		],
		initComponent: function(){
            var page = this;

            Ext.create('Ext.mitos.RenderPanel', {
                pageTitle: '<?php i18n('Fees Sheet'); ?>',
                //pageLayout: 'border',
                pageBody: [ ]
            });
			page.callParent(arguments);
		} // end of initComponent
	}); //ens oNotesPage class
    Ext.create('Ext.mitos.Page');
}); // End ExtJS
</script>