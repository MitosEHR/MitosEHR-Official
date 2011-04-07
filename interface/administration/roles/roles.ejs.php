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
// Roles model
//******************************************************************************
Ext.regModel('PermissionList', { fields: [
	{name: 'id', type: 'int'},
    {name: 'replycount', type: 'string'},
    {name: 'perm_key', type: 'int'},
    {name: 'perm_name', type: 'string'},
    {name: 'role_id', type: 'int'},
    {name: 'perm_id', type: 'int'},
    {name: 'value', type: 'string'}
]});

//******************************************************************************
// Roles Store
//******************************************************************************
var permStore = new Ext.data.Store({
    model: 'PermissionList',
    proxy: {
        type: 'rest',
        url: 'interface/administration/roles/data_read.ejs.php',
        reader: {
            type: 'json',
            root: 'users'
        }
    }
});

permStore.load();

//******************************************************************************
// Render panel
//******************************************************************************
var topRenderPanel = Ext.create('Ext.Panel', {
	title: '<?php i18n('Roles'); ?>',
	renderTo: Ext.getCmp('MainApp').body,
  	frame : false,
	border : false,
	id: 'topRenderPanel',
});

}); // End ExtJS
</script>