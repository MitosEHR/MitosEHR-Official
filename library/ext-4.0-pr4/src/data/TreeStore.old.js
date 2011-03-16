/**
 * @class Ext.data.TreeStore
 * @extends Ext.data.Store
 *
 * <p>Specialized Store for dealing with hierarchical data. These Stores are useful when powering tree-
 * like components such as {@link Ext.tree.TreePanel} and {@link Ext.tree.TreeGrid}. Because most databases
 * store data in a flat structure, TreeStore accepts data in this format and creates a tree internally.</p>
 *
 * <p>TreeStore uses the nested set model of creating hierarchical structure from flat data (the concept is
 * explained in <a href="http://threebit.net/tutorials/nestedset/tutorial1.html">this tutorial</a>), relying
 * on three pointer fields to be present in the {@link Ext.data.Model Model} - parent, left and right. This
 * format is well suited to popular databases like MySQL where rows are stored in a flat format.</p>
 *
 * <p><u>Example usage</u></p>
 * <p>We'll set up a Store that consumes data a little like this (in this case we have some User data):</p>
 *
 * <pre><code>
[
    {id: 1, first: 'Ed',    last: 'Spencer',  lft: 1,  rgt: 16},
    {id: 2, first: 'Abe',   last: 'Elias',    lft: 2,  rgt: 11, parentId: 1},
    {id: 3, first: 'Tommy', last: 'Maintz',   lft: 12, rgt: 15, parentId: 1},
    {id: 4, first: 'Aaron', last: 'Conran',   lft: 3,  rgt: 4,  parentId: 2},
    {id: 5, first: 'Dave',  last: 'Kaneda',   lft: 5,  rgt: 6,  parentId: 2},
    {id: 6, first: 'Jamie', last: 'Avins',    lft: 13, rgt: 14, parentId: 3},
    {id: 7, first: 'Jay',   last: 'Robinson', lft: 7,  rgt: 10, parentId: 5},
    {id: 8, first: 'Arne',  last: 'Bech',     lft: 8,  rgt: 9,  parentId: 7}
]
 * </code></pre>
 *
 * <p>This structure requires a little explanation. The <i>id</i>, <i>first</i> and <i>last</i> fields are from
 * a fictional user model. The <i>lft</i>, <i>rgt</i> and <i>parentId</i> fields are required by TreeStore to
 * transform this flat data set into a tree structure. For an explanation of how these fields are used consult
 * the <a href="http://threebit.net/tutorials/nestedset/tutorial1.html">tutorial link above</a> and see the
 * {@link #leftField}, {@link #rightField} and {@link #parentField} configurations. Now let's set up a TreeStore
 * to load the data above from a url:</p>
 *
 * <pre><code>
Ext.regModel('User', {
    fields: [
        {name: 'id',        type: 'int'},
        {name: 'parent_id', type: 'int'},
        {name: 'lft',       type: 'int'},
        {name: 'rgt',       type: 'int'},
        {name: 'first',     type: 'string'},
        {name: 'last',      type: 'string'}
    ]
});

var store = new Ext.data.TreeStore({
    model: 'User',
    proxy: {
        type: 'ajax',
        url : 'myTreeData.json'
    }
});
 * </code></pre>
 *
 * <p>Above we create a simple model with all the fields outlined above, and a TreeStore that uses an
 * {@link Ext.data.AjaxProxy AjaxProxy} to load data from a url (AjaxProxy creates a {@link Ext.data.JsonReader})
 * by default to read the data). Internally, TreeStore recognises the tree structure data contained in the fields,
 * allowing us to query it:</p>
 * <pre><code>
//ed is a root node, aaron is a leaf
var ed    = store.getAt(store.find('first', 'Ed')),
    aaron = store.getAt(store.find('first', 'Aaron'));

store.{@link #getChildren}(ed); //returns all immediate child nodes for Ed Spencer
store.{@link #getParent}(aaron); //returns the immediate parent for Aaron Conran
store.{@link #getAncestors}(aaron); //returns all ancestors for Aaron Conran
 * </code></pre>
 * <p>All components that utilize tree-structured data automatically use these methods to retrieve their nodes, so
 * no additional configuration is required.</p>
 */
Ext.define('Ext.data.TreeStore', {
    extend: 'Ext.data.Store',

    /**
     * @cfg {String} leftField The name of the Model's field to use as the 'left' property. Defaults
     * to 'lft'
     */
    leftField: 'lft',

    /**
     * @cfg {String} rightField The name of the Model's field to use as the 'right' property. Defaults
     * to 'rgt'
     */
    rightField: 'rgt',

    /**
     * @cfg {String} parentField The name of the Model's field to use as the 'parent' property. Defaults
     * to 'parent_id'
     */
    parentField: 'parentId',

    /**
     * Returns an array of all child Records for a given root. Can optionally perform a deep search,
     * which returns all children at any level under the instance (e.g. not just direct children). If
     * the deep option is used, all child nodes are returned as a flat array. To preserve the tree
     * structure use {@link #getSubTree} instead.
     * @param {Ext.data.Model} parent The model instance
     * @param {Boolean} deep True to return all children at any level. Defaults to false
     * @return {Array} The record's children
     */
    getChildren: function(parent, deep) {
        var records    = this.data.items,
            length     = records.length,
            leftField  = this.leftField,
            rightField = this.rightField,
            rootLeft   = parent.data[leftField],
            rootRight  = parent.data[rightField],
            children   = [],
            recData, isChild, isDirectChild, i;

        for (i = 0; i < length; i++) {
            recData = records[i].data;
            isChild = recData[leftField] > rootLeft && recData[rightField] < rootRight;
            isDirectChild = isChild && recData[this.parentField] == parent.getId();

            if (isChild && (isDirectChild || deep === true)) {
                children.push(records[i]);
            }
        }

        return children;
    },

    /**
     * Returns an ordered array of ancestors to the given model instance, starting with the parent
     * and ending with the model's root node
     * @param {Ext.data.Model} record The child model instance
     * @return {Array} The set of ancestors (could be an empty array)
     */
    getAncestors: function(record) {
        var records    = this.data.items,
            length     = records.length,
            leftField  = this.leftField,
            rightField = this.rightField,
            rootLeft   = record.data[leftField],
            rootRight  = record.data[rightField],
            ancestors  = [],
            isAncestor, recData, i;

        for (i = 0; i < length; i++) {
            recData    = records[i].data;
            isAncestor = recData[leftField] < rootLeft && recData[rightField] > rootRight;

            if (isAncestor) {
                ancestors.push(records[i]);
            }
        }

        return ancestors.sort(function(a, b) {
            return a.get(leftField) < b.get(leftField);
        });
    },

    /**
     * Moves a given node Model instance to a new position in the tree
     * @param {Ext.data.Model} node The node to move
     * @param {Ext.data.Model} parent The new node parent
     * @param {Number} index The child index within the new parent. If not set, the node will be inserted as
     * the last child of the parent
     */
    move: function(node, parent, index) {
        /*
         * In this case I couldn't find a good explanation of an efficient algorithm on the internets so I
         * made one up. Moving is like removing and inserting rolled into one, but in this case we want to
         * avoid the repercussions of actually moving and inserting, as well as keeping good performance.
         *
         * To move a node and its children we find its width and its new lft position in the tree, and therefore
         * its new rgt position. We then update all nodes where lft and/or rgt is greater than or equal to the
         * new lft position, adding the calculated node width to each of those matches.
         *
         * Finally, we update the lft and rgt positions of each of the nodes we just moved by subtracting the
         * difference between the node's old lft and its new lft.
         */

        var records     = this.data.items,
            length      = records.length,
            leftField   = this.leftField,
            rightField  = this.rightField,

            nodeLeft    = node.get(leftField),
            nodeRight   = node.get(rightField),
            nodeWidth   = nodeRight - nodeLeft + 1,

            parentWidth = parent.get(rightField) - parent.get(leftField) + 1,
            noChildren  = parentWidth == 2,

            previousLeft, deltaLeft, newLeft, children, leftChild,
            isNodeChild, record, recData, recLeft, recRight, i;

        //noChildren means the parent doesn't currently have any children - this affects which previousLeft we need
        if (noChildren) {
            previousLeft = parent.get(leftField);
        } else {
            children = this.getChildren(parent);
            leftChild = children[index] || children[children.length - 1];

            previousLeft = leftChild.get(rightField);
        }

        //this is where we're about to move the node
        newLeft = previousLeft + 1;
        deltaLeft = nodeLeft - newLeft;

        for (i = 0; i < length; i++) {
            record   = records[i];
            recData  = record.data;
            recLeft  = recData[leftField];
            recRight = recData[rightField];

            if (recLeft >= nodeLeft && recRight <= nodeRight) {
                //this node is a child of the node we are moving
                record.set(leftField, recLeft - deltaLeft);
                record.set(rightField, recRight - deltaLeft);

            } else {
                if (recLeft > previousLeft) {
                    record.set(leftField, recLeft + nodeWidth);
                }

                if (recRight > previousLeft) {
                    record.set(rightField, recRight + nodeWidth);
                }
            }
        }
    },

    /**
     * Removes a node from the tree. This will remove all of the node's children (and grandchildren etc),
     * so if you need to keep those move them first
     * @param {Ext.data.Model} node The node to remove
     */
    remove: function(node) {
        //updates all of the node references as if they have been removed from the tree
        var removed = this.removeNodes(node);

        //removes the actual node instances using a normal Store remove
        Ext.data.TreeStore.superclass.remove.call(this, removed);
    },

    /**
     * @private
     * Updates the lft and rgt values of each node as if the given node has been removed. Does not
     * actually remove the node though. This is a utility method used by {@link #remove} and {@link #move}
     * as we need the same logic in both places.
     * @param {Ext.data.Model} node The node to remove
     * @return {Array} The nodes that were 'removed' from the tree
     */
    removeNodes: function(node) {
        //This follows a fairly simple algorithm explained at
        //http://dev.mysql.com/tech-resources/articles/hierarchical-data.html

        var records    = this.data.items,
            length     = records.length,
            leftField  = this.leftField,
            rightField = this.rightField,
            nodeLeft   = node.get(leftField),
            nodeRight  = node.get(rightField),
            nodeWidth  = nodeRight - nodeLeft + 1,
            removed    = [node],
            record, recData, recLeft, recRight, i;

        for (i = 0; i < length; i++) {
            record   = records[i];
            recData  = record.data;
            recLeft  = recData[leftField];
            recRight = recData[rightField];

            if (recLeft > nodeLeft && recRight < nodeRight) {
                //this is a child node so remove it too
                removed.push(record);
            }

            if (recLeft > nodeRight) {
                record.set(leftField, recLeft - nodeWidth);
            }

            if (recRight > nodeRight) {
                record.set(rightField, recRight - nodeWidth);
            }
        }

        return removed;
    },

    /**
     * Inserts a given node relative to another
     * @param {Ext.data.Model} node The node to insert
     * @param {Ext.data.Model} parent The node to insert under
     * @param {Number} index The zero-based index to insert the node at
     */
    insert: function(node, parent, index) {
        //This follows a fairly simple algorithm explained at
        //http://dev.mysql.com/tech-resources/articles/hierarchical-data.html

        var records     = this.data.items,
            length      = records.length,
            leftField   = this.leftField,
            rightField  = this.rightField,

            parentWidth = parent.get(rightField) - parent.get(leftField) + 1,
            noChildren  = parentWidth == 2,

            previousLeft, children, leftChild, record, recData, recLeft, recRight, i;

        //noChildren means the parent doesn't currently have any children - this affects which previousLeft we need
        if (noChildren) {
            previousLeft = parent.get(leftField);
        } else {
            children = this.getChildren(parent);
            leftChild = children[index] || children[children.length - 1];

            previousLeft = leftChild.get(rightField);
        }

        node.set(leftField, previousLeft + 1);
        node.set(rightField, previousLeft + 2);
        node.set(this.parentField, parent.getId());

        for (i = 0; i < length; i++) {
            record   = records[i];
            recData  = record.data;
            recLeft  = recData[leftField];
            recRight = recData[rightField];

            if (recLeft > previousLeft) {
                record.set(leftField, recLeft + 2);
            }

            if (recRight > previousLeft) {
                record.set(rightField, recRight + 2);
            }
        }

        Ext.data.TreeStore.superclass.insert.call(this, 0, [node]);
    },

    /**
     * Returns true if the given Model instance is a leaf (e.g. has no children)
     * @param {Ext.data.Model} record The model instance
     * @return {Boolean} True if the record has no children
     */
    isLeaf: function(record) {
        return this.getChildren(record).length === 0;
    },

    /**
     * Returns the immediate parent node of a given Model instance, or undefined if the instance
     * is a root node
     * @param {Ext.data.Model} record The child model instance
     * @return {Ext.data.Model/undefined} The parent record, if one exists
     */
    getParent: function(record) {
        return this.getAncestors(record)[0];
    },

    /**
     * Returns true if the given model instance is a root node (e.g. has no parent)
     * @param {Ext.data.Model} record The model instance
     * @return {Boolean} True if a root node
     */
    isRoot: function(record) {
        return !this.getParent(record);
    },

    getRootNode: function() {
        var records = this.getRange(),
            ln = records.length,
            i = 0;
        for (; i < ln; i++) {
            if (this.isRoot(records[i]) === true) {
                return records[i];
            }
        }
        throw "Root node not found.";
    },

    getSubStore: function(node) {
        if (!node.subStore) {
            node.subStore = Ext.create('Ext.data.Store', {
                model: this.model
            });
            var children = this.getChildren(node),
                i, ln;
                
            // hack to calculate leaf when parent is initially loaded.
            for (i = 0, ln = children.length; i < ln; i++) {
                children[i].leaf = !this.getChildren(children[i]).length;
            }
            node.subStore.add.apply(node.subStore, children);

        }
        return node.subStore;
    }
});