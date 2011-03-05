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
Heelo
<script type="text/javascript">
Ext.onReady(function(){

// *************************************************************************************
// Structure of the message record
// creates a subclass of Ext.data.Record
//
// This should be the structure of the database table
// 
// tag: ExtJS v4 Ready
// *************************************************************************************
var FacilityRecord = Ext.regModel('FacilityRecord', {
	fields: [
	{name: 'id',					type: 'int'},
	{name: 'name',					type: 'string'},
	{name: 'phone',					type: 'string'},
	{name: 'fax', 					type: 'string'},
	{name: 'street',				type: 'string'},
	{name: 'city',					type: 'string'},
	{name: 'state',					type: 'string'},
	{name: 'postal_code',			type: 'string'},
	{name: 'country_code',			type: 'string'},
	{name: 'federal_ein',			type: 'string'},
	{name: 'service_location',		type: 'string'},
	{name: 'billing_location',		type: 'string'},
	{name: 'accepts_assignment',	type: 'string'},
	{name: 'pos_code',				type: 'string'},
	{name: 'x12_sender_id',			type: 'string'},
	{name: 'attn',					type: 'string'},
	{name: 'domain_identifier',		type: 'string'},
	{name: 'facility_npi',			type: 'string'},
	{name: 'tax_id_type',			type: 'string'}
	],
});

var topRenderPanel = Ext.create('Ext.Panel', {
	title: '<?php i18n('Facilities'); ?>',
  	frame : false,
	border : false,
	id: 'topRenderPanel',
});
topRenderPanel.show();

}); // End ExtJS

</script>