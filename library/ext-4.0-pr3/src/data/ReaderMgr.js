/**
 * @author Ed Spencer
 * @class Ext.data.ReaderMgr
 * @extends Ext.AbstractManager
 * @singleton
 * @ignore
 * 
 * <p>Maintains the set of all registered {@link Ext.data.Reader Reader} types.</p>
 */
Ext.define('Ext.data.ReaderMgr', {
    extend: 'Ext.AbstractManager',
    singleton: true,
    typeName: 'rtype'
});