/**
 * @class Ext.data.NodeInterface
 * This class is meant to be used as a set of methods that are applied to the prototype of a
 * Record to decorate it with a Node API. This means that models used in conjunction with a tree
 * will have all of the tree related methods available on the model. In general this class will
 * not be used directly by the developer.
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
                var mgr = Ext.ModelManager,
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

                if (!keys.id) {
                    newFields.push(fields.add(Ext.create('data.field', {name: 'id', type: 'string', defaultValue: null})));
                }
                if (!keys.depth) {
                    newFields.push(fields.add(Ext.create('data.field', {name: 'depth', type: 'int', defaultValue: 0})));
                }
                if (!keys.expanded) {
                    newFields.push(fields.add(Ext.create('data.field', {name: 'expanded', type: 'bool', defaultValue: false})));
                }
                if (!keys.checked) {
                    newFields.push(fields.add(Ext.create('data.field', {name: 'checked', defaultValue: null})));
                }
                if (!keys.leaf) {
                    newFields.push(fields.add(Ext.create('data.field', {name: 'leaf', type: 'bool', defaultValue: false})));
                }
                if (!keys.cls) {
                    newFields.push(fields.add(Ext.create('data.field', {name: 'cls', type: 'string', defaultValue: null})));
                }
                if (!keys.iconCls) {
                    newFields.push(fields.add(Ext.create('data.field', {name: 'iconCls', type: 'string', defaultValue: null})));
                }
                if (!keys.root) {
                    newFields.push(fields.add(Ext.create('data.field', {name: 'root', type: 'boolean', defaultValue: false})));
                }
                if (!keys.isLast) {
                    newFields.push(fields.add(Ext.create('data.field', {name: 'isLast', type: 'boolean', defaultValue: false})));
                }
                if (!keys.isFirst) {
                    newFields.push(fields.add(Ext.create('data.field', {name: 'isFirst', type: 'boolean', defaultValue: false})));
                }
                if (!keys.allowDrop) {
                    newFields.push(fields.add(Ext.create('data.field', {name: 'allowDrop', type: 'boolean', defaultValue: true})));
                }
                if (!keys.allowDrag) {
                    newFields.push(fields.add(Ext.create('data.field', {name: 'allowDrag', type: 'boolean', defaultValue: true})));
                }
                if (!keys.loaded) {
                    newFields.push(fields.add(Ext.create('data.field', {name: 'loaded', type: 'boolean', defaultValue: false})));
                }
                if (!keys.href) {
                    newFields.push(fields.add(Ext.create('data.field', {name: 'href', type: 'string', defaultValue: null})));
                }  
                if (!keys.hrefTarget) {
                    newFields.push(fields.add(Ext.create('data.field', {name: 'hrefTarget', type: 'string', defaultValue: null})));
                } 
                if (!keys.qtip) {
                    newFields.push(fields.add(Ext.create('data.field', {name: 'qtip', type: 'string', defaultValue: null})));
                }  
                if (!keys.qtitle) {
                    newFields.push(fields.add(Ext.create('data.field', {name: 'qtitle', type: 'string', defaultValue: null})));
                }
                                                                                    
                jln = newFields.length;
                // Set default values to all instances already out there
                for (i = 0; i < iln; i++) {
                    instance = instances[i];
                    for (j = 0; j < jln; j++) {
                        newField = newFields[j];
                        if (instance.get(newField.name) === undefined) {
                            instance.data[newField.name] = newField.defaultValue;
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
            
            return record;
        },
        
        getPrototypeBody: function() {
            return {
                isNode: true,

                /**
                 * Ensures that the passed object is an instance of a Record with the NodeInterface applied
                 * @return {Boolean}
                 */
                createNode: function(node) {
                    if (Ext.isObject(node) && !node.isModel) {
                        node = Ext.ModelManager.create(node, this.modelName);
                    }
                    // Make sure the node implements the node interface
                    return Ext.data.NodeInterface.decorate(node);
                },
                
                /**
                 * Returns true if this node is a leaf
                 * @return {Boolean}
                 */
                isLeaf : function() {
                    return this.get('leaf') === true;
                },

                /**
                 * Sets the first child of this node
                 * @private
                 * @param {Ext.data.NodeInterface} node
                 */
                setFirstChild : function(node) {
                    this.firstChild = node;
                },

                /**
                 * Sets the last child of this node
                 * @private
                 * @param {Ext.data.NodeInterface} node
                 */
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
                    var me = this,
                        isRoot = me.isRoot(),
                        isFirst = (!me.parentNode ? true : me.parentNode.firstChild == this),
                        isLast = (!me.parentNode ? true : me.parentNode.lastChild == this),
                        depth = 0,
                        parent = me,
                        children = me.childNodes,
                        ln = children.length,
                        i;

                    while (parent.parentNode) {
                        ++depth;
                        parent = parent.parentNode;
                    }                                            
                    
                    me.set({
                        isFirst: isFirst,
                        isLast: isLast,
                        depth: depth
                    });
                    
                    if (ln) {
                        for (i = 0; i < ln; i++) {
                            children[i].updateInfo();
                        }
                    }
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
                 * <p>Insert node(s) as the last child node of this node.</p>
                 * <p>If the node was previously a child node of another parent node, it will be removed from that node first.</p>
                 * @param {Node/Array} node The node or Array of nodes to append
                 * @return {Node} The appended node if single append, or null if an array was passed
                 */
                appendChild : function(node, suppressEvents) {
                    var me = this,
                        i, ln,
                        index,
                        oldParent,
                        ps;

                    // if passed an array or multiple args do them one by one
                    if (Ext.isArray(node)) {
                        for (i = 0, ln = node.length; i < ln; i++) {
                            me.appendChild(node[i]);
                        }
                    } else {
                        // Make sure it is a record
                        node = me.createNode(node);
                        
                        if (suppressEvents !== true && me.fireEvent("beforeappend", me, node) === false) {
                            return false;                         
                        }

                        index = me.childNodes.length;
                        oldParent = node.parentNode;

                        // it's a move, make sure we move it cleanly
                        if (oldParent) {
                            if (suppressEvents !== true && node.fireEvent("beforemove", node, oldParent, me, index) === false) {
                                return false;
                            }
                            oldParent.removeChild(node);
                        }

                        index = me.childNodes.length;
                        if (index === 0) {
                            me.setFirstChild(node);
                        }

                        me.childNodes.push(node);
                        node.parentNode = me;
                        node.nextSibling = null;

                        me.setLastChild(node);
                                                
                        ps = me.childNodes[index - 1];
                        if (ps) {
                            node.previousSibling = ps;
                            ps.nextSibling = node;
                            ps.updateInfo();
                        } else {
                            node.previousSibling = null;
                        }

                        node.updateInfo();
                        
                        // As soon as we append a child to this node, we are loaded
                        if (!me.isLoaded()) {
                            me.set('loaded', true);                            
                        }
                        
                        if (suppressEvents !== true) {
                            me.fireEvent("append", me, node, index);

                            if (oldParent) {
                                node.fireEvent("move", node, oldParent, me, index);
                            }                            
                        }

                        return node;
                    }
                },
                
                /**
                 * Returns the bubble target for this node
                 * @private
                 * @return {Object} The bubble target
                 */
                getBubbleTarget: function() {
                    return this.parentNode;
                },

                /**
                 * Removes a child node from this node.
                 * @param {Node} node The node to remove
                 * @param {Boolean} destroy <tt>true</tt> to destroy the node upon removal. Defaults to <tt>false</tt>.
                 * @return {Node} The removed node
                 */
                removeChild : function(node, destroy, suppressEvents) {
                    var me = this,
                        index = me.indexOf(node);
                    
                    if (index == -1 || (suppressEvents !== true && me.fireEvent("beforeremove", me, node) === false)) {
                        return false;
                    }

                    // remove it from childNodes collection
                    me.childNodes.splice(index, 1);

                    // update child refs
                    if (me.firstChild == node) {
                        me.setFirstChild(node.nextSibling);
                    }
                    if (me.lastChild == node) {
                        me.setLastChild(node.previousSibling);
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

                    if (suppressEvents !== true) {
                        me.fireEvent("remove", me, node);
                    }
                    
                    if (destroy) {
                        node.destroy(true);
                    } else {
                        node.clear();
                    }

                    return node;
                },

                /**
                 * Creates a copy (clone) of this Node.
                 * @param {String} id (optional) A new id, defaults to this Node's id. See <code>{@link #id}</code>.
                 * @param {Boolean} deep (optional) <p>If passed as <code>true</code>, all child Nodes are recursively copied into the new Node.</p>
                 * <p>If omitted or false, the copy will have no child Nodes.</p>
                 * @return {Node} A copy of this Node.
                 */
                copy: function(newId, deep) {
                    var me = this,
                        result = me.callOverridden(arguments),
                        len = me.childNodes ? me.childNodes.length : 0,
                        i;

                    // Move child nodes across to the copy if required
                    if (deep) {
                        for (i = 0; i < len; i++) {
                            result.appendChild(me.childNodes[i].copy(true));
                        }
                    }
                    return result;
                },

                /**
                 * Clear the node.
                 * @private
                 * @param {Boolean} destroy True to destroy the node.
                 */
                clear : function(destroy) {
                    var me = this;
                    
                    // clear any references from the node
                    me.parentNode = me.previousSibling = me.nextSibling = null;
                    if (destroy) {
                        me.firstChild = me.lastChild = null;
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
                    var me = this;
                    
                    if (silent === true) {
                        me.clear(true);
                        Ext.each(me.childNodes, function(n) {
                            n.destroy(true);
                        });
                        me.childNodes = null;
                    } else {
                        me.remove(true);
                    }

                    me.callOverridden();
                },

                /**
                 * Inserts the first node before the second node in this nodes childNodes collection.
                 * @param {Node} node The node to insert
                 * @param {Node} refNode The node to insert before (if null the node is appended)
                 * @return {Node} The inserted node
                 */
                insertBefore : function(node, refNode, suppressEvents) {
                    var me = this,
                        index     = me.indexOf(refNode),
                        oldParent = node.parentNode,
                        refIndex  = index,
                        ps;
                    
                    if (!refNode) { // like standard Dom, refNode can be null for append
                        return me.appendChild(node);
                    }
                    
                    // nothing to do
                    if (node == refNode) {
                        return false;
                    }

                    // Make sure it is a record with the NodeInterface
                    node = me.createNode(node);
                    
                    if (suppressEvents !== true && me.fireEvent("beforeinsert", me, node, refNode) === false) {
                        return false;
                    }
                    
                    // when moving internally, indexes will change after remove
                    if (oldParent == me && me.indexOf(node) < index) {
                        refIndex--;
                    }

                    // it's a move, make sure we move it cleanly
                    if (oldParent) {
                        if (suppressEvents !== true && node.fireEvent("beforemove", node, oldParent, me, index, refNode) === false) {
                            return false;
                        }
                        oldParent.removeChild(node);
                    }

                    if (refIndex === 0) {
                        me.setFirstChild(node);
                    }

                    me.childNodes.splice(refIndex, 0, node);
                    node.parentNode = me;
                    
                    node.nextSibling = refNode;
                    refNode.previousSibling = node;
                    
                    ps = me.childNodes[refIndex - 1];
                    if (ps) {
                        node.previousSibling = ps;
                        ps.nextSibling = node;
                        ps.updateInfo();
                    } else {
                        node.previousSibling = null;
                    }
                    
                    node.updateInfo();
                    if (!me.isLoaded()) {
                        me.set('loaded', true);                            
                    }

                    if (suppressEvents !== true) {
                        me.fireEvent("insert", me, node, refNode);

                        if (oldParent) {
                            node.fireEvent("move", node, oldParent, me, refIndex, refNode);
                        }                        
                    }

                    return node;
                },
                
                /**
                 * Insert a node into this node
                 * @param {Ext.data.Model} node The node to insert
                 * @param {Number} index The zero-based index to insert the node at
                 * @return {Ext.data.Record} The record you just inserted
                 */    
                insert: function(node, index) {
                    var sibling = this.childNodes[index];
                    if (sibling) {
                        return this.insertBefore(node, sibling);
                    }
                    else {
                        return this.appendChild(node);
                    }
                },

                /**
                 * Removes this node from its parent
                 * @param {Boolean} destroy <tt>true</tt> to destroy the node upon removal. Defaults to <tt>false</tt>.
                 * @return {Node} this
                 */
                remove : function(destroy, suppressEvents) {
                    var parentNode = this.parentNode;

                    if (parentNode) {
                        parentNode.removeChild(this, destroy, suppressEvents);
                    }
                    return this;
                },

                /**
                 * Removes all child nodes from this node.
                 * @param {Boolean} destroy <tt>true</tt> to destroy the node upon removal. Defaults to <tt>false</tt>.
                 * @return {Node} this
                 */
                removeAll : function(destroy, suppressEvents) {
                    var cn = this.childNodes,
                        n;

                    while ((n = cn[0])) {
                        this.removeChild(n, destroy, suppressEvents);
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
                replaceChild : function(newChild, oldChild, suppressEvents) {
                    var s = oldChild ? oldChild.nextSibling : null;

                    this.removeChild(oldChild, suppressEvents);
                    this.insertBefore(newChild, s, suppressEvents);
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
                    if (Ext.isDefined(Ext.global.console)) {
                        Ext.global.console.warn('Ext.data.Node: cascade has been deprecated. Please use cascadeBy instead.');
                    }
                    return this.cascadeBy.apply(this, arguments);
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
                 * @param {Boolean} recursive Whether or not to apply this sort recursively
                 * @param {Boolean} suppressEvent Set to true to not fire a sort event.
                 */
                sort : function(sortFn, recursive, suppressEvent) {
                    var cs  = this.childNodes,
                        ln = cs.length,
                        i, n;
                    
                    if (ln > 0) {
                        Ext.Array.sort(cs, sortFn);
                        for (i = 0; i < ln; i++) {
                            n = cs[i];
                            n.previousSibling = cs[i-1];
                            n.nextSibling = cs[i+1];
                        
                            if (i === 0) {
                                this.setFirstChild(n);
                                n.updateInfo();
                            }
                            if (i == ln - 1) {
                                this.setLastChild(n);
                                n.updateInfo();
                            }
                            if (recursive && !n.isLeaf()) {
                                n.sort(sortFn, true, true);
                            }
                        }
                        
                        if (suppressEvent !== true) {
                            this.fireEvent('sort', this, cs);
                        }
                    }
                },
                        
                /**
                 * Returns true if this node is expaned
                 * @return {Boolean}
                 */        
                isExpanded: function() {
                    return this.get('expanded');
                },
                
                /**
                 * Returns true if this node is loaded
                 * @return {Boolean}
                 */ 
                isLoaded: function() {
                    return this.get('loaded');
                },
                
                /**
                 * Returns true if this node is the root node
                 * @return {Boolean}
                 */ 
                isRoot: function() {
                    return !this.parentNode;
                },
                
                /**
                 * Returns true if this node is visible
                 * @return {Boolean}
                 */ 
                isVisible: function() {
                    var parent = this.parentNode;
                    while (parent) {
                        if (!parent.isExpanded()) {
                            return false;
                        }
                        parent = parent.parentNode;
                    }
                    return true;
                },
                
                /**
                 * Expand the node, used internally. Expanding for the public API
                 * should occur on the TreeView
                 * @private
                 * @param {Function} callback (Optional) The function to execute once the expand completes
                 * @param {Object} scope (Optional) The scope to run the function in
                 */
                expand: function(callback, scope) {
                    var me = this;
                    
                    if (!me.isLeaf() && !me.expanding && !me.isExpanded()) {
                        me.expanding = true;
                        me.fireEvent('beforeexpand', me, function(records) {
                            delete me.expanding;
                            me.set('expanded', true); 
                            me.fireEvent('expand', me, records, false);
                            Ext.callback(callback, scope || me, [records]);
                        }, me);
                    }
                },

                /**
                 * Collapse the node, used internally. Collapsing for the public API
                 * should occur on the TreeView
                 * @private
                 * @param {Function} callback (Optional) The function to execute once the collapse completes
                 * @param {Object} scope (Optional) The scope to run the function in
                 */
                collapse: function(callback, scope) {
                    var me = this;
                    
                    if (!me.isLeaf() && !me.collapsing && me.isExpanded()) {
                        me.collapsing = true;
                        me.fireEvent('beforecollapse', me, function(records) {
                            delete me.collapsing;
                            me.set('expanded', false);
                            me.fireEvent('collapse', me, records, false); 
                            Ext.callback(callback, scope || me, [records]);                         
                        }, this);
                    }
                }
            };
        }
    }
});