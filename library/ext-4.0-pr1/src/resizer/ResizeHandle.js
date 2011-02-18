/**
 * @class Ext.resizer.ResizeHandle
 * @extends Ext.Component
 *
 * Provides a handle for 9-point resizing of Elements or Components.
 */
Ext.define('Ext.resizer.ResizeHandle', {
    extend: 'Ext.Component',
    handleCls: '',
    baseHandleCls: Ext.baseCSSPrefix + 'resizable-handle',
    // Ext.resizer.Resizer.prototype.possiblePositions define the regions
    // which will be passed in as a region configuration.
    region: '',
    
    onRender: function() {
        this.addCls(
            this.baseHandleCls,
            this.baseHandleCls + '-' + this.region,
            this.handleCls
        );
        Ext.resizer.ResizeHandle.superclass.onRender.apply(this, arguments);
        this.el.unselectable();
    }
});