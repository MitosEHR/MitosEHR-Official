/**
 * @class Ext.ux.PortalColumn
 * @extends Ext.container.Container
 * A layout column class used internally be {@link Ext.ux.PortalPanel}.
 */
Ext.define('Ext.ux.PortalColumn', {
    extend: 'Ext.container.Container',
    alias: 'widget.portalcolumn',
    layout: {
        type: 'anchor',
        afterLayout: function() {
            this.owner.el.setHeight(null);
        }
    },
    defaultType: 'portlet',
    cls: 'x-portal-column',
    autoHeight: true
    //
    // This is a class so that it could be easily extended
    // if necessary to provide additional behavior.
    //
});