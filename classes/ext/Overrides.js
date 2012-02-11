/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File:
 * Date: 2/9/12
 * Time: 7:30 PM
 */
//Ext.override(Ext.grid.RowEditor, {
//    deleteBtnText: 'Delete',
//
//    getFloatingButtons: function() {
//        var me = this,
//            cssPrefix = Ext.baseCSSPrefix,
//            btnsCss = cssPrefix + 'grid-row-editor-buttons',
//            plugin = me.editingPlugin,
//            btns;
//
//        if (!me.floatingButtons) {
//            btns = me.floatingButtons = Ext.create('Ext.Container', {
//                renderTpl: [
//                    '<div class="{baseCls}-ml"></div>',
//                    '<div class="{baseCls}-mr"></div>',
//                    '<div class="{baseCls}-bl"></div>',
//                    '<div class="{baseCls}-br"></div>',
//                    '<div class="{baseCls}-bc"></div>'
//                ],
//
//                renderTo: me.el,
//                baseCls: btnsCss,
//                layout: {
//                    type: 'hbox',
//                    align: 'middle'
//                },
//                defaults: {
//                    margins: '0 1 0 1'
//                },
//                items: [{
//                    itemId  : 'update',
//                    flex    : 1,
//                    xtype   : 'button',
//                    handler : plugin.completeEdit,
//                    scope   : plugin,
//                    text    : me.saveBtnText,
//                    disabled: !me.isValid
//                }, {
//                    flex    : 1,
//                    xtype   : 'button',
//                    handler : plugin.cancelEdit,
//                    scope   : plugin,
//                    text    : me.cancelBtnText
//                }, {
//                    flex    : 1,
//                    cls     : 'winDelete',
//                    xtype   : 'button',
//                    handler : plugin.completeDestroy,
//                    scope   : plugin,
//                    text    : me.deleteBtnText
//                }]
//            });
//
//            // Prevent from bubbling click events to the grid view
//            me.mon(btns.el, {
//                // BrowserBug: Opera 11.01
//                //   causes the view to scroll when a button is focused from mousedown
//                mousedown   : Ext.emptyFn,
//                click       : Ext.emptyFn,
//                stopEvent   : true
//            });
//        }
//        me.callOverridden();
//
//        return me.floatingButtons;
//    }
//});
//
//Ext.override(Ext.grid.plugin.Editing, {
//    constructor: function(config) {
//        var me = this;
//        Ext.apply(me, config, null);
//
//        me.addEvents(
//            // Doc'ed in separate editing plugins
//            'beforeedit',
//
//            // Doc'ed in separate editing plugins
//            'edit',
//
//            // Doc'ed in separate editing plugins
//            'validateedit',
//
//            // Doc'ed in separate editing plugins
//            'destroy'
//
//        );
//
//        //me.callOverridden();
//
//        me.mixins.observable.constructor.call(me);
//        // TODO: Deprecated, remove in 5.0
//        me.relayEvents(me, ['afteredit'], 'after');
//    }
//});
//
//Ext.override(Ext.grid.plugin.RowEditing, {
//    // private
//    completeDestroy: function() {
//        var me = this;
//
//        if (me.editing && me.getEditor().completeEdit() ) {
//            me.editing = false;
//            me.fireEvent('destroy', me.context);
//        }
//    }
//
//
//});