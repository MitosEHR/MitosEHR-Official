
/*========================================================================
 * 
 * This section contains stuff that should be in Ext4, or stuff that
 * is up for discussion. It should be removed prior to Ext 4 final.
 *
 *========================================================================*/

// This should be working as the alternateClassName but doesn't for some reason
Ext.toolbar.Toolbar.SplitButton = Ext.button.Split;

// DomHelper does not currently go through the ClassManager so there is no alternateClassName
Ext.DomHelper = Ext.core.DomHelper;

// Beefed up getDockedItems to make it easier to find specific items like top toolbars only
Ext.apply(Ext.AbstractPanel.prototype, {
    /**
     * Retrieve an array of all currently docked components, optionally matching a
     * specific docked side and/or component type.
     * @param {Array} options
     * @return {Array} An array of matching components
     */
    // ex: {dock: 'top', alias: 'widget.toolbar'}
    getDockedItems : function(options) {
        var me = this,
            items = [];
        
        if (me.dockedItems && me.dockedItems.items.length) {
            items = me.dockedItems.items.slice();
        }
        
        if (options && items.length > 0) {
            var i = 0,
                ln = items.length,
                matches = [],
                item;
            
            for (; i < ln; i++) {
                item = items[i];
                if (options.dock && options.dock !== item.dock){
                    continue;
                }
                if (options.alias && options.alias !== item.alias){
                    continue;
                }
                matches.push(item);
            }
            return matches;
        }
        return items;
    }
});

Ext.apply(Ext.panel.Panel.prototype, {
    getToolbars : function(dock){
        return this.getDockedItems({
            alias: 'widget.toolbar',
            dock: dock
        });
    }
});

// Not sure if these are intended to be deprecated or they just haven't been moved over
Ext.apply(Ext.menu.Menu.prototype, {
    addSeparator : function() {
        return this.add(Ext.create('Ext.menu.Separator'));
    },
    addElement : function(el) {
        return this.add(Ext.create('Ext.menu.Item', {
            el: el
        }));
    },
    addItem : function(item) {
        return this.add(item);
    },
    addMenuItem : function(config) {
        return this.add(this.lookupComponent(config));
    },
    addText : function(text){
        return this.add(Ext.create('Ext.menu.Item', {
            plain: true,
            text: text
        }));
    }
});


/*========================================================================
 * 
 * This section contains true compatibility overrides and should ship
 * with Ext 4 as an optional compatibility layer for Ext 3 code.
 *
 *========================================================================*/

Ext.compat = {
    warn: function(msg) {
        if (Ext.isDefined(window.console)) {
            console.warn(msg);
        }
    },
    deprecate: function(fn, newFn) {
        var msg = (fn + ' is deprecated.');
        msg += newFn ? ' Use ' + newFn + ' instead.' : '';
        Ext.compat.warn(msg);
    }
};

Ext.applyIf(String, {
    format : function(){
        Ext.compat.deprecate('String.format', 'Ext.String.format');
        return Ext.String.format.apply(Ext.util.String, arguments);
    }
});

Ext.apply(Ext.AbstractComponent, {
    addClass : function() {
        Ext.compat.deprecate('Ext.Component.addClass', 'addCls');
        return this.addCls.apply(this, arguments);
    },
    removeClass : function() {
        Ext.compat.deprecate('Ext.Component.removeClass', 'removeCls');
        return this.removeCls.apply(this, arguments);
    }
});

Ext.apply(Ext.toolbar.Toolbar.prototype, {
    addField : function(field){
        return this.add(field);
    }
});

Ext.apply(Ext.panel.Panel.prototype, {
    getTopToolbar: function(){
        Ext.compat.warn('Ext now supports an arbitrary number of toolbars, so getTopToolbar() will return the top toolbar at index 0 if multiple found');
        var items = this.getToolbars('top');
        return items.length > 0 ? items[0] : null;
    },
    getBottomToolbar: function(){
        Ext.compat.warn('Ext now supports an arbitrary number of toolbars, so getBottomToolbar() will return the bottom toolbar at index 0 if multiple found');
        var items = this.getToolbars('bottom');
        return items.length > 0 ? items[0] : null;
    }
})