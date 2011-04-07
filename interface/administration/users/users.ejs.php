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

// *************************************************************************************
// Users Model
// *************************************************************************************
Ext.regModel('users', { fields: [
	{name: 'id',                    type: 'int',              mapping: 'id'},
	{name: 'username',              type: 'string',           mapping: 'username'},
	{name: 'password',              type: 'auto',             mapping: 'password'},
	{name: 'authorizedd',           type: 'string',           mapping: 'authorizedd'},
	{name: 'authorized',            type: 'string',           mapping: 'authorized'},
	{name: 'actived',            	type: 'string',           mapping: 'actived'},
	{name: 'active',            	type: 'string',           mapping: 'active'},
	{name: 'info',                  type: 'string',           mapping: 'info'},
	{name: 'source',                type: 'int',              mapping: 'source'},
	{name: 'fname',                 type: 'string',           mapping: 'fname'},
	{name: 'mname',                 type: 'string',           mapping: 'mname'},
	{name: 'lname',                 type: 'string',           mapping: 'lname'},
	{name: 'fullname',              type: 'string',           mapping: 'fullname'},
	{name: 'federaltaxid',          type: 'string',           mapping: 'federaltaxid'},
	{name: 'federaldrugid',         type: 'string',           mapping: 'federaldrugid'},
	{name: 'upin',                  type: 'string',           mapping: 'upin'},
	{name: 'facility',              type: 'string',           mapping: 'facility'},
	{name: 'facility_id',           type: 'int',              mapping: 'facility_id'},
	{name: 'see_auth',              type: 'int',              mapping: 'see_auth'},
	{name: 'active',                type: 'int',              mapping: 'active'},
	{name: 'npi',                   type: 'string',           mapping: 'npi'},
	{name: 'title',                 type: 'string',           mapping: 'title'},
	{name: 'specialty',             type: 'string',           mapping: 'specialty'},
	{name: 'billname',              type: 'string',           mapping: 'billname'},
	{name: 'email',                 type: 'string',           mapping: 'email'},
	{name: 'url',                   type: 'string',           mapping: 'url'},
	{name: 'assistant',             type: 'string',           mapping: 'assistant'},
	{name: 'organization',          type: 'string',           mapping: 'organization'},
	{name: 'valedictory',           type: 'string',           mapping: 'valedictory'},
	{name: 'fulladdress',           type: 'string',           mapping: 'fulladdress'},
	{name: 'cal_ui',                type: 'string',           mapping: 'cal_ui'},
	{name: 'taxonomy',              type: 'string',           mapping: 'taxonomy'},
	{name: 'ssi_relayhealth',       type: 'string',           mapping: 'ssi_relayhealth'},
	{name: 'calendar',              type: 'int',              mapping: 'calendar'},
	{name: 'abook_type',            type: 'string',           mapping: 'abook_type'},
	{name: 'pwd_expiration_date',   type: 'string',           mapping: 'pwd_expiration_date'},
	{name: 'pwd_history1',          type: 'string',           mapping: 'pwd_history1'},
	{name: 'pwd_history2',          type: 'string',           mapping: 'pwd_history2'},
	{name: 'default_warehouse',     type: 'string',           mapping: 'default_warehouse'},
	{name: 'ab_name',               type: 'string',           mapping: 'ab_name'},
	{name: 'ab_title',              type: 'string',           mapping: 'ab_title'}
]});
//******************************************************************************
// User Store
//******************************************************************************

var userStore = new Ext.data.Store({
    model: 'users',
    proxy: {
        type: 'rest',
        url : '../../../interface/administration/users/data_read.ejs.php',
        reader: {
            type: 'json',
            root: 'users'
        }
    }
});

userStore.load();

//******************************************************************************
// Render panel
//******************************************************************************
var topRenderPanel = Ext.create('Ext.Panel', {
	title: '<?php i18n('Users'); ?>',
	renderTo: Ext.getCmp('MainApp').body,
  	frame : false,
	border : false,
	id: 'topRenderPanel',
});

}); // End ExtJS
</script>