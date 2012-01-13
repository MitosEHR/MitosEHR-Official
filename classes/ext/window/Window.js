/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File:
 * Date: 10/31/11
 * Time: 3:21 PM
 */
Ext.define('Ext.mitos.window.Window', {
    extend      : 'Ext.window.Window',
	autoHeight  : true,
    modal       : true,
    border	  	: true,
    autoScroll	: true,
    resizable   : false,
    closeAction : 'hide'
});