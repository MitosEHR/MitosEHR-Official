<?php 
//******************************************************************************
// facilities.ejs.php
// Description: Facilities Screen
// v0.0.3
// 
// Author: Gino Rivera Falú
// Modified: n/a
// 
// MitosEHR (Eletronic Health Records) 2011
//******************************************************************************

include_once("../../../library/I18n/I18n.inc.php");

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;

?>
<script type="text/javascript">
Ext.require([ '*' ]);

Ext.onReady(function(){

//******************************************************************************
// Sanitizing Objects
// Destroy them, if already exists in the browser memory.
// This destructions must be called for all the objects that
// are rendered on the document.body 
//******************************************************************************
if ( Ext.getCmp('winFacility') ){ Ext.getCmp('winFacility').destroy(); }


var topRenderPanel = Ext.create('Ext.Panel', {
	title: '<?php i18n('Facilities'); ?>',
	renderTo: Ext.getCmp('MainApp').body,
  	frame : false,
	border : false,
	id: 'topRenderPanel',
});

}); // End ExtJS
</script>