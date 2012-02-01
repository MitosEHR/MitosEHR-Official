/**
 * @private - To be merged when DataView behaviors are used.
 */
Ext.define('Ext.dataview.ListItem', {
    extend: 'Ext.dataview.DataItem',

    xtype: 'listitem',

    requires: [
        'Ext.dataview.ListItemHeader',
        'Ext.dataview.ListDisclosure',
        'Ext.dataview.ListIcon'
    ],

    cachedConfig: {
        dataMap: {
            getIcon: {
                setSrc: 'iconSrc'
            },
            getDisclosure: {
                setVisible: 'disclosure'
            }
        }
    },

    config: {
        baseCls: Ext.baseCSSPrefix + 'list-item',

        header: null,

        icon: null,

        disclosure: null
    },

    applyIcon: function(config) {
        return Ext.factory(config, Ext.dataview.ListIcon, this.getIcon());
    },

    updateIcon: function(newIcon) {
        if (newIcon) {
            this.add(newIcon);
        }
    },

    applyDisclosure: function(config) {
        return Ext.factory(config, Ext.dataview.ListDisclosure, this.getDisclosure());
    },

    updateDisclosure: function(newDisclosure, oldDisclosure) {
        if (newDisclosure) {
            this.add(newDisclosure);
        }
        else if (oldDisclosure) {
            oldDisclosure.destroy();
        }
    },

    applyHeader: function(config) {
        return Ext.factory(config, Ext.dataview.ListItemHeader, this.getHeader());
    },

    updateHeader: function(newHeader, oldHeader) {
        if (newHeader) {
            this.insert(0, newHeader);
        }
        else {
            oldHeader.destroy();
        }
    }
});
