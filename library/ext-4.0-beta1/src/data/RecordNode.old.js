/**
 * @class Ext.data.RecordNode
 * @extends Ext.data.Node
 * @ignore
 */
Ext.define('Ext.data.RecordNode', {
    extend: 'Ext.data.Node',
    
    constructor: function(config) {
        config = config || {};
        if (config.record) {
            // provide back reference
            config.record.node = this;
        }
        Ext.data.RecordNode.superclass.constructor.call(this, config);
    },

    getChildRecords: function() {
        var cn = this.childNodes,
            ln = cn.length,
            i = 0,
            rs = [],
            r;

        for (; i < ln; i++) {
            r = cn[i].attributes.record;
            // Hack to inject leaf attribute into the
            // data portion of a record, this will be
            // removed once Record and Ext.data.Node have
            // been combined rather than aggregated.
            r.data.leaf = cn[i].leaf;
            rs.push(r);
        }
        return rs;
    },

    getRecord: function() {
        return this.attributes.record;
    },


    getSubStore: function(callback, scope) {
        // <debug>
        if (this.isLeaf()) {
            throw "Attempted to get a substore of a leaf node.";
        }
        // </debug>

        var treeStore = this.getOwnerTree().treeStore;
        if (!this.subStore) {
            var subStore = {
                model: treeStore.model
            };
            this.subStore = Ext.create('Ext.data.Store', subStore);
            // if records have already been preLoaded, apply them
            // to the subStore, if not they will be loaded by the
            // read within the TreeStore itself.
            var children = this.getChildRecords();
            this.subStore.add.apply(this.subStore, children);
        }

        if (!this.loaded && !this.loading) {
            this.loading = true;
            treeStore.load({
                node: this,
                callback: callback,
                scope: scope
            });
        }
        if (this.loaded) {
            callback.call(scope || window, this.subStore.getRange());
        }
        return this.subStore;
    },

    destroy : function(silent) {
        if (this.subStore) {
            this.subStore.destroyStore();
        }
        var attr = this.attributes;
        if (attr.record) {
            delete attr.record.node;
            delete attr.record;
        }

        return Ext.data.RecordNode.superclass.destroy.call(this, silent);
    }
});