/**
 * Created by JetBrains PhpStorm.
 * User: Plushy
 * Date: 3/26/12
 * Time: 10:18 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('App.store.fees.Billing', {
	extend    : 'Ext.data.Store',
	model     : 'App.model.fees.Billing',
	autoLoad  : false
});