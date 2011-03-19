/**
 * @class Ext.data.NodeInterface
 * @extends Object
 * This class is meant to be used as a set of methods that are applied to the prototype of a
 * Record to decorate it with a Node API.
 */
Ext.define('Ext.data.NodeInterface', {
    requires: ['Ext.data.Field'],
    
    statics: {
        /**
         * This method allows you to decorate a Record's prototype to implement the NodeInterface.
         * This adds a set of methods, new events, new properties and new fields on every Record
         * with the same Model as the passed Record.
         * @param {Ext.data.Record} record The Record you want to decorate the prototype of.
         * @static
         */
        decorate: function(record) {
            if (!record.isNode) {
                // Apply the methods and fields to the prototype
                // @TODO: clean this up to use proper class system stuff
                var mgr = Ext.ModelMgr,
                    modelName = record.modelName,
                    modelClass = mgr.getModel(modelName),
                    modelPrototype = modelClass.prototype,
                    fields = modelPrototype.fields,
                    keys = fields.keys,
                    instances = Ext.Array.filter(mgr.all.getArray(), function(item) {
                        return item.modelName == modelName;
                    }),
                    iln = instances.length,
                    newFields = [],
                    i, instance, jln, j, newField;

                // Start by adding the NodeInterface methods to the Model's prototype
                modelClass.override(this.getPrototypeBody());

                if (!keys['id']) {
                    newFields.push(fields.add(Ext.create('data.field', {name: 'id', type: 'string', defaultValue: null})));
                }
                if (!keys['depth']) {
                    newFields.push(fields.add(Ext.create('data.field', {name: 'depth', type: 'int', defaultValue: 0})));
                }
                if (!keys['expanded']) {
                    newFields.push(fields.add(Ext.create('data.field', {name: 'expanded', type: 'bool', defaultValue: false})));
                }
                if (!keys['leaf']) {
                    newFields.push(fields.add(Ext.create('data.field', {name: 'leaf', type: 'bool', defaultValue: false})));
                }
                if (!keys['cls']) {
                    newFields.push(fields.add(Ext.create('data.field', {name: 'cls', type: 'string', defaultValue: null})));
                }
                if (!keys['iconCls']) {
                    newFields.push(fields.add(Ext.create('data.field', {name: 'iconCls', type: 'string', defaultValue: null})));
                }
                if (!keys['root']) {
                    newFields.push(fields.add(Ext.create('data.field', {name: 'root', type: 'boolean', defaultValue: false})));
                }
                if (!keys['isLast']) {
                    newFields.push(fields.add(Ext.create('data.field', {name: 'isLast', type: 'boolean', defaultValue: false})));
                }
                if (!keys['isFirst']) {
                    newFields.push(fields.add(Ext.create('data.field', {name: 'isFirst', type: 'boolean', defaultValue: false})));
                }
                                                                
                jln = newFields.length;
                // Set default values to all instances already out there
                for (i = 0; i < iln; i++) {
                    instance = instances[i];
                    for (j = 0; j < jln; j++) {
                        newField = newFields[j];
                        if (instance.get(newField.name) === undefined) {
                            instance.set(newField.name, newField.defaultValue);
                        }
                    }
                }
            }
            
            Ext.applyIf(record, {
                firstChild: null,
                lastChild: null,
                parentNode: null,
                previousSibling: null,
                nextSibling: null,
                childNodes: []
            });
            
            record.enableBubble([
                /**
                 * @event append
                 * Fires when a new child node is appended
                 * @param {Node} this This node
                 * @param {Node} node The newly appended node
                 * @param {Number} index The index of the newly appended node
                 */
                "append",

                /**
                 * @event remove
                 * Fires when a child node is removed
                 * @param {Node} this This node
                 * @param {Node} node The removed node
                 */
                "remove",

                /**
                 * @event move
                 * Fires when this node is moved to a new location in the tree
                 * @param {Node} this This node
                 * @param {Node} oldParent The old parent of this node
                 * @param {Node} newParent The new parent of this node
                 * @param {Number} index The index it was moved to
                 */
                "move",

                /**
                 * @event insert
                 * Fires when a new child node is inserted.
                 * @param {Node} this This node
                 * @param {Node} node The child node inserted
                 * @param {Node} refNode The child node the node was inserted before
                 */
                "insert",

                /**
                 * @event beforeappend
                 * Fires before a new child is appended, return false to cancel the append.
                 * @param {Node} this This node
                 * @param {Node} node The child node to be appended
                 */
                "beforeappend",

                /**
                 * @event beforeremove
                 * Fires before a child is removed, return false to cancel the remove.
                 * @param {Node} this This node
                 * @param {Node} node The child node to be removed
                 */
                "beforeremove",

                /**
                 * @event beforemove
                 * Fires before this node is moved to a new location in the tree. Return false to cancel the move.
                 * @param {Node} this This node
                 * @param {Node} oldParent The parent of this node
                 * @param {Node} newParent The new parent this node is moving to
                 * @param {Number} index The index it is being moved to
                 */
                "beforemove",

                 /**
                  * @event beforeinsert
                  * Fires before a new child is inserted, return false to cancel the insert.
                  * @param {Node} this This node
                  * @param {Node} node The child node to be inserted
                  * @param {Node} refNode The child node the node is being inserted before
                  */
                "beforeinsert",
                
                /**
                 * @event expand
                 * Fires when this node is expanded.
                 * @param {Node} this The expanding node
                 */
                "expand",
                
                /**
                 * @event collapse
                 * Fires when this node is collapsed.
                 * @param {Node} this The collapsing node
                 */
                "collapse",
                
                /**
                 * @event beforeexpand
                 * Fires before this node is expanded.
                 * @param {Node} this The expanding node
                 */
                "beforeexpand",
                
                /**
                 * @event beforecollapse
                 * Fires before this node is collapsed.
                 * @param {Node} this The collapsing node
                 */
                "beforecollapse",
                
                /**
                 * @event beforecollapse
                 * Fires before this node is collapsed.
                 * @param {Node} this The collapsing node
                 */
                "sort"
            ]);
        },
        
        getPrototypeBody: function() {
            return {
                isNode: true,

                /**
                 * Returns true if this node is a leaf
                 * @return {Boolean}
                 */
                isLeaf : function() {
                    return this.get('leaf') === true;
                },

                // private
                setFirstChild : function(node) {
                    this.firstChild = node;
                },

                //private
                setLastChild : function(node) {
                    this.lastChild = node;
                },

                /**
                 * Updates general data of this node like isFirst, isLast, depth. This
                 * method is internally called after a node is moved. This shouldn't
                 * have to be called by the developer unless they are creating custom
                 * Tree plugins.
                 * @return {Boolean}
                 */
                updateInfo: function() {
                    var me = this;
                    
                    me.set('isFirst', me.isRoot() || (!me.parentNode ? true : me.parentNode.firstChild == this));
                    me.set('isLast', me.isRoot() || (!me.parentNode ? true : me.parentNode.lastChild == this));
                    
                    var depth  = 0,
                        parent = me;
                        
                    while (parent.parentNode) {
                        ++depth;
                        parent = parent.parentNode;
                    }

                    me.set('depth', depth);
                },

                /**
                 * Returns true if this node is the last child of its parent
                 * @return {Boolean}
                 */
                isLast : function() {
                   return this.get('isLast');
                },

                /**
                 * Returns true if this node is the first child of its parent
                 * @return {Boolean}
                 */
                isFirst : function() {
                   return this.get('isFirst');
                },

                /**
                 * Returns true if this node has one or more child nodes, else false.
                 * @return {Boolean}
                 */
                hasChildNodes : function() {
                    return !this.isLeaf() && this.childNodes.length > 0;
                },

                /**
                 * Returns true if this node has one or more child nodes, or if the <tt>expandable</tt>
                 * node attribute is explicitly specified as true (see {@link #attributes}), otherwise returns false.
                 * @return {Boolean}
                 */
                isExpandable : function() {
                    return this.get('expandable') || this.hasChildNodes();
                },

                /**
                 * Insert node(s) as the last child node of this node.
                 * @param {Node/Array} node The node or Array of nodes to append
                 * @return {Node} The appended node if single append, or null if an array was passed
                 */
                appendChild : function(node) {
                    var multi = false,
                        i, len;

                    if (Ext.isArray(node)) {
                        multi = node;
                    } else if (arguments.length > 1) {
                        multi = arguments;
                    }

                    // if passed an array or multiple args do them one by one
                    if (multi) {
                        len = multi.length;

                        for (i = 0; i < len; i++) {
                            this.appendChild(multi[i]);
                        }
                    } else {
                        // Make sure the node implements the node interface
                        Ext.data.NodeInterface.decorate(node);
                        
                        if (this.fireEvent("beforeappend", this, node) === false) {
                            return false;
                        }

                        var index = this.childNodes.length;
                        var oldParent = node.parentNode;

                        // it's a move, make sure we move it cleanly
                        if (oldParent) {
                            if (node.fireEvent("beforemove", node, oldParent, this, index) === false) {
                                return false;
                            }
                            oldParent.removeChild(node);
                        }

                        index = this.childNodes.length;
                        if (index === 0) {
                            this.setFirstChild(node);
                        }

                        this.childNodes.push(node);
                        node.parentNode = this;
                        node.nextSibling = null;

                        this.setLastChild(node);
                                                
                        var ps = this.childNodes[index - 1];
                        if (ps) {
                            node.previousSibling = ps;
                            ps.nextSibling = node;
                            ps.updateInfo();
                        } else {
                            node.previousSibling = null;
                        }

                        node.updateInfo();
                        
                        this.fireEvent("append", this, node, index);
                        
                        if (oldParent) {
                            node.fireEvent("move", node, oldParent, this, index);
                        }

                        return node;
                    }
                },
                
                getBubbleTarget: function() {
                    return this.parentNode;
                },

                /**
                 * Removes a child node from this node.
                 * @param {Node} node The node to remove
                 * @param {Boolean} destroy <tt>true</tt> to destroy the node upon removal. Defaults to <tt>false</tt>.
                 * @return {Node} The removed node
                 */
                removeChild : function(node, destroy) {
                    var index = this.indexOf(node);

                    if (index == -1) {
                        return false;
                    }
                    if (this.fireEvent("beforeremove", this, node) === false) {
                        return false;
                    }

                    // remove it from childNodes collection
                    this.childNodes.splice(index, 1);

                    // update child refs
                    if (this.firstChild == node) {
                        this.setFirstChild(node.nextSibling);
                    }
                    if (this.lastChild == node) {
                        this.setLastChild(node.previousSibling);
                    }
                    
                    // update siblings
                    if (node.previousSibling) {
                        node.previousSibling.nextSibling = node.nextSibling;
                        node.previousSibling.updateInfo();
                    }
                    if (node.nextSibling) {
                        node.nextSibling.previousSibling = node.previousSibling;
                        node.nextSibling.updateInfo();
                    }

                    this.fireEvent("remove", this, node);
                    if (destroy) {
                        node.destroy(true);
                    } else {
                        node.clear();
                    }

                    return node;
                },

                // private
                clear : function(destroy) {
                    // clear any references from the node
                    this.parentNode = this.previousSibling = this.nextSibling = null;
                    if (destroy) {
                        this.firstChild = this.lastChild = null;
                    }
                },

                /**
                 * Destroys the node.
                 */
                destroy : function(silent) {
                    /*
                     * Silent is to be used in a number of cases
                     * 1) When setRoot is called.
                     * 2) When destroy on the tree is called
                     * 3) For destroying child nodes on a node
                     */
                    if (silent === true) {
                        this.clear(true);
                        Ext.each(this.childNodes, function(n) {
                            n.destroy(true);
                        });
                        this.childNodes = null;
                    } else {
                        this.remove(true);
                    }

                    this.callOverridden();
                },

                /**
                 * Inserts the first node before the second node in this nodes childNodes collection.
                 * @param {Node} node The node to insert
                 * @param {Node} refNode The node to insert before (if null the node is appended)
                 * @return {Node} The inserted node
                 */
                insertBefore : function(node, refNode) {
                    if (!refNode) { // like standard Dom, refNode can be null for append
                        return this.appendChild(node);
                    }
                    // nothing to do
                    if (node == refNode) {
                        return false;
                    }

                    // Make sure the node implements the node interface
                    Ext.data.NodeInterface.decorate(node);
                    
                    if (this.fireEvent("beforeinsert", this, node, refNode) === false) {
                        return false;
                    }

                    var index     = this.indexOf(refNode),
                        oldParent = node.parentNode,
                        refIndex  = index;

                    // when moving internally, indexes will change after remove
                    if (oldParent == this && this.indexOf(node) < index) {
                        refIndex--;
                    }

                    // it's a move, make sure we move it cleanly
                    if (oldParent) {
                        if (node.fireEvent("beforemove", node, oldParent, this, index, refNode) === false) {
                            return false;
                        }
                        oldParent.removeChild(node);
                    }

                    if (refIndex === 0) {
                        this.setFirstChild(node);
                    }

                    this.childNodes.splice(refIndex, 0, node);
                    node.parentNode = this;
                    
                    node.nextSibling = refNode;
                    refNode.previousSibling = node;
                    
                    var ps = this.childNodes[refIndex - 1];
                    if (ps) {
                        node.previousSibling = ps;
                        ps.nextSibling = node;
                        ps.updateInfo();
                    } else {
                        node.previousSibling = null;
                    }
                    
                    node.updateInfo();
                    
                    this.fireEvent("insert", this, node, refNode);

                    if (oldParent) {
                        node.fireEvent("move", node, oldParent, this, refIndex, refNode);
                    }
                    return node;
                },

                /**
                 * Removes this node from its parent
                 * @param {Boolean} destroy <tt>true</tt> to destroy the node upon removal. Defaults to <tt>false</tt>.
                 * @return {Node} this
                 */
                remove : function(destroy) {
                    var parentNode = this.parentNode;

                    if (parentNode) {
                        parentNode.removeChild(this, destroy);
                    }
                    return this;
                },

                /**
                 * Removes all child nodes from this node.
                 * @param {Boolean} destroy <tt>true</tt> to destroy the node upon removal. Defaults to <tt>false</tt>.
                 * @return {Node} this
                 */
                removeAll : function(destroy) {
                    var cn = this.childNodes,
                        n;

                    while ((n = cn[0])) {
                        this.removeChild(n, destroy);
                    }
                    return this;
                },

                /**
                 * Returns the child node at the specified index.
                 * @param {Number} index
                 * @return {Node}
                 */
                getChildAt : function(index) {
                    return this.childNodes[index];
                },

                /**
                 * Replaces one child node in this node with another.
                 * @param {Node} newChild The replacement node
                 * @param {Node} oldChild The node to replace
                 * @return {Node} The replaced node
                 */
                replaceChild : function(newChild, oldChild) {
                    var s = oldChild ? oldChild.nextSibling : null;

                    this.removeChild(oldChild);
                    this.insertBefore(newChild, s);
                    return oldChild;
                },

                /**
                 * Returns the index of a child node
                 * @param {Node} node
                 * @return {Number} The index of the node or -1 if it was not found
                 */
                indexOf : function(child) {
                    return Ext.Array.indexOf(this.childNodes, child);
                },

                /**
                 * Returns depth of this node (the root node has a depth of 0)
                 * @return {Number}
                 */
                getDepth : function() {
                    return this.get('depth');
                },

                /**
                 * Bubbles up the tree from this node, calling the specified function with each node. The arguments to the function
                 * will be the args provided or the current node. If the function returns false at any point,
                 * the bubble is stopped.
                 * @param {Function} fn The function to call
                 * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the function is executed. Defaults to the current Node.
                 * @param {Array} args (optional) The args to call the function with (default to passing the current Node)
                 */
                bubble : function(fn, scope, args) {
                    var p = this;
                    while (p) {
                        if (fn.apply(scope || p, args || [p]) === false) {
                            break;
                        }
                        p = p.parentNode;
                    }
                },

                //<deprecated since=0.99>
                cascade: function() {
                    throw "Ext.data.Node: cascade method renamed to cascadeBy.";
                },
                //</deprecated>

                /**
                 * Cascades down the tree from this node, calling the specified function with each node. The arguments to the function
                 * will be the args provided or the current node. If the function returns false at any point,
                 * the cascade is stopped on that branch.
                 * @param {Function} fn The function to call
                 * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the function is executed. Defaults to the current Node.
                 * @param {Array} args (optional) The args to call the function with (default to passing the current Node)
                 */
                cascadeBy : function(fn, scope, args) {
                    if (fn.apply(scope || this, args || [this]) !== false) {
                        var childNodes = this.childNodes,
                            length     = childNodes.length,
                            i;

                        for (i = 0; i < length; i++) {
                            childNodes[i].cascadeBy(fn, scope, args);
                        }
                    }
                },

                /**
                 * Interates the child nodes of this node, calling the specified function with each node. The arguments to the function
                 * will be the args provided or the current node. If the function returns false at any point,
                 * the iteration stops.
                 * @param {Function} fn The function to call
                 * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the function is executed. Defaults to the current Node in the iteration.
                 * @param {Array} args (optional) The args to call the function with (default to passing the current Node)
                 */
                eachChild : function(fn, scope, args) {
                    var childNodes = this.childNodes,
                        length     = childNodes.length,
                        i;

                    for (i = 0; i < length; i++) {
                        if (fn.apply(scope || this, args || [childNodes[i]]) === false) {
                            break;
                        }
                    }
                },

                /**
                 * Finds the first child that has the attribute with the specified value.
                 * @param {String} attribute The attribute name
                 * @param {Mixed} value The value to search for
                 * @param {Boolean} deep (Optional) True to search through nodes deeper than the immediate children
                 * @return {Node} The found child or null if none was found
                 */
                findChild : function(attribute, value, deep) {
                    return this.findChildBy(function() {
                        return this.get(attribute) == value;
                    }, null, deep);
                },

                /**
                 * Finds the first child by a custom function. The child matches if the function passed returns <code>true</code>.
                 * @param {Function} fn A function which must return <code>true</code> if the passed Node is the required Node.
                 * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the function is executed. Defaults to the Node being tested.
                 * @param {Boolean} deep (Optional) True to search through nodes deeper than the immediate children
                 * @return {Node} The found child or null if none was found
                 */
                findChildBy : function(fn, scope, deep) {
                    var cs = this.childNodes,
                        len = cs.length,
                        i = 0, n, res;

                    for (; i < len; i++) {
                        n = cs[i];
                        if (fn.call(scope || n, n) === true) {
                            return n;
                        }
                        else if (deep) {
                            res = n.findChildBy(fn, scope, deep);
                            if (res !== null) {
                                return res;
                            }
                        }
                    }

                    return null;
                },

                /**
                 * Sorts this nodes children using the supplied sort function.
                 * @param {Function} fn A function which, when passed two Nodes, returns -1, 0 or 1 depending upon required sort order.
                 * @param {Object} scope (optional)The scope (<code>this</code> reference) in which the function is executed. Defaults to the browser window.
                 */
                sort : function(fn, scope) {
                    // @TODO: Implement this method
                },

                /**
                 * Returns true if this node is an ancestor (at any point) of the passed node.
                 * @param {Node} node
                 * @return {Boolean}
                 */
                contains : function(node) {
                    return node.isAncestor(this);
                },

                /**
                 * Returns true if the passed node is an ancestor (at any point) of this node.
                 * @param {Node} node
                 * @return {Boolean}
                 */
                isAncestor : function(node) {
                    var p = this.parentNode;
                    while (p) {
                        if (p == node) {
                            return true;
                        }
                        p = p.parentNode;
                    }
                    return false;
                },

                /**
                 * Sorts this nodes children using the supplied sort function.
                 * @param {Function} fn A function which, when passed two Nodes, returns -1, 0 or 1 depending upon required sort order.
                 * @param {Object} scope (optional)The scope (<code>this</code> reference) in which the function is executed. Defaults to the browser window.
                 */
                sort : function(fn, scope) {
                    var cs  = this.childNodes,
                        len = cs.length,
                        i, n;

                    if (len > 0) {
                        var sortFn = scope ? function(){return fn.apply(scope, arguments);} : fn;
                        cs.sort(sortFn);
                        for (i = 0; i < len; i++) {
                            n = cs[i];
                            n.previousSibling = cs[i-1];
                            n.nextSibling = cs[i+1];

                            if (i === 0) {
                                this.setFirstChild(n);
                            }
                            if (i == len - 1) {
                                this.setLastChild(n);
                            }
                        }
                        this.fireEvent('sort', this, cs);
                    }
                },
                                
                isExpanded: function() {
                    return this.get('expanded');
                },
                
                isRoot: function() {
                    return !this.parentNode;
                },
                
                getDepth: function() {
                    return this.get('depth');
                },
                
                expand: function(callback, scope) {
                    if (!this.isLeaf() && !this.expanding) {
                        this.expanding = true;
                        this.fireEvent('beforeexpand', this, function(records) {
                            var ln = records.length,
                                record, i;
                            delete this.expanding;
                            this.set('expanded', true); 
                            this.fireEvent('expand', this, records, false);
                            if (callback) {
                                callback.call(scope || this, records);
                            }
                        }, this);                        
                    }
                },
                
                collapse: function(callback, scope) {
                    if (!this.isLeaf() && this.isExpanded()) {
                        this.collapsing = true;
                        this.fireEvent('beforecollapse', this, function(records) {
                            var ln = records.length,
                                record, i;
                            delete this.collapsing;
                            this.set('expanded', false);
                            this.fireEvent('collapse', this, records, false);   
                            if (callback) {
                                callback.call(scope || this, records);
                            }                         
                        }, this);
                    }
                }
            };
        }
    }
});