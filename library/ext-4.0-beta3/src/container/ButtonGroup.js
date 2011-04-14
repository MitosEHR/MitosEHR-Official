/**
 * @class Ext.container.ButtonGroup
 * @extends Ext.panel.Panel
 * <p>Provides a container for arranging a group of related Buttons in a tabular manner.</p>
 * Example usage:
 * <pre><code>
var p = new Ext.panel.Panel({
    title: 'Panel with Button Group',
    width: 300,
    height:200,
    renderTo: document.body,
    html: 'whatever',
    tbar: [{
        xtype: 'buttongroup',
        {@link #columns}: 3,
        title: 'Clipboard',
        items: [{
            text: 'Paste',
            scale: 'large',
            rowspan: 3,
            iconCls: 'add',
            iconAlign: 'top',
            cls: 'x-btn-as-arrow'
        },{
            xtype:'splitbutton',
            text: 'Menu Button',
            scale: 'large',
            rowspan: 3,
            iconCls: 'add',
            iconAlign: 'top',
            arrowAlign:'bottom',
            menu: [{text: 'Menu Item 1'}]
        },{
            xtype:'splitbutton', text: 'Cut', iconCls: 'add16', menu: [{text: 'Cut Menu Item'}]
        },{
            text: 'Copy', iconCls: 'add16'
        },{
            text: 'Format', iconCls: 'add16'
        }]
    }]
});
 * </code></pre>
 * @constructor
 * Create a new ButtonGroup.
 * @param {Object} config The config object
 * @xtype buttongroup
 */
Ext.define('Ext.container.ButtonGroup', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.buttongroup',
    alternateClassName: 'Ext.ButtonGroup',

    /**
     * @cfg {Number} columns The <tt>columns</tt> configuration property passed to the
     * {@link #layout configured layout manager}. See {@link Ext.layout.container.Table#columns}.
     */

    /**
     * @cfg {String} baseCls  Defaults to <tt>'x-btn-group'</tt>.  See {@link Ext.panel.Panel#baseCls}.
     */
    baseCls: Ext.baseCSSPrefix + 'btn-group',

    /**
     * @cfg {Object} layout  Defaults to <tt>'table'</tt>.  See {@link Ext.container.Container#layout}.
     */
    layout: {
        type: 'table'
    },

    defaultType: 'button',

    /**
     * @cfg {Boolean} frame  Defaults to <tt>true</tt>.  See {@link Ext.panel.Panel#frame}.
     */
    frame: true,
    
    frameHeader: false,
    
    internalDefaults: {removeMode: 'container', hideParent: true},

    initComponent : function(){
        // Copy the component's columns config to the layout if specified
        var me = this,
            cols = me.columns;

        me.noTitleCls = me.baseCls + '-notitle';
        if (cols) {
            me.layout = Ext.apply({}, {columns: cols}, me.layout);
        }

        if (!me.title) {
            me.addCls(me.noTitleCls);
        }
        me.callParent(arguments);
    },

    afterLayout: function() {
        this.callParent(arguments);

        // Pugly hack for a pugly browser:
        // If not an explicitly set width, then size the width to match the inner table
        if (this.layout.table && (Ext.isIEQuirks || Ext.isIE6) && !this.width) {
            var t = this.getTargetEl();
            t.setWidth(this.layout.table.offsetWidth + t.getPadding('lr'));
        }
    },

    afterRender: function() {
        //we need to add an addition item in here so the ButtonGroup title is centered
        if (this.header) {
            this.header.insert(0, {
                xtype: 'component',
                html : '&nbsp;',
                flex : 1
            });
        }
        
        this.callParent(arguments);
    },
    
    // private
    onBeforeAdd: function(component) {
        if (component.is('button')) {
            component.ui = component.ui + '-toolbar';
        }
        this.callParent(arguments);
    },

    //private
    applyDefaults: function(c) {
        if (!Ext.isString(c)) {
            c = this.callParent(arguments);
            var d = this.internalDefaults;
            if (c.events) {
                Ext.applyIf(c.initialConfig, d);
                Ext.apply(c, d);
            } else {
                Ext.applyIf(c, d);
            }
        }
        return c;
    }

    /**
     * @cfg {Array} tools  @hide
     */
    /**
     * @cfg {Boolean} collapsible  @hide
     */
    /**
     * @cfg {Boolean} collapseMode  @hide
     */
    /**
     * @cfg {Boolean} animCollapse  @hide
     */
    /**
     * @cfg {Boolean} closable  @hide
     */
});
