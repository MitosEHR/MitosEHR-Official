/**
 * A Traversable mixin.
 * @private
 */
Ext.define('Ext.mixin.Traversable', {
    extend: 'Ext.mixin.Mixin',

    mixinConfig: {
        id: 'traversable'
    },

    setParent: function(parent) {
        this.parent = parent;

        return this;
    },

    hasParent: function() {
        return Boolean(this.parent);
    },

    getParent: function() {
        return this.parent;
    },

    getAncestors: function() {
        var ancestors = [],
            parent = this.getParent();

        while (parent) {
            ancestors.push(parent);
            parent = parent.getParent();
        }

        return ancestors;
    },

    getAncestorIds: function() {
        var ancestorIds = [],
            parent = this.getParent();

        while (parent) {
            ancestorIds.push(parent.getId());
            parent = parent.getParent();
        }

        return ancestorIds;
    }
});
