/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File:
 * Date: 2/18/12
 * Time: 11:09 PM
 */


Ext.define('App.store.administration.Immunization_Relations', {
	model: 'App.model.administration.Immunization_Relations',
	extend: 'Ext.data.Store',
    autoLoad  : false,
	autoSync  : true,
	remoteSort: true

});