/**
 * @class Ext.util.Stateful
 * Represents any object whose data can be saved by a {@link Ext.data.proxy.Proxy Proxy}. Ext.Model
 * and Ext.View both inherit from this class as both can save state (Models save field state,
 * Views save configuration)
 */
Ext.define('Ext.util.Stateful', {
    mixins: {
        observable: 'Ext.util.Observable'
    },

    /**
     * Internal flag used to track whether or not the model instance is currently being edited. Read-only
     * @property editing
     * @type Boolean
     */
    editing : false,

    /**
     * Readonly flag - true if this Record has been modified.
     * @type Boolean
     */
    dirty : false,

    /**
     * @cfg {String} persistanceProperty The property on this Persistable object that its data is saved to.
     * Defaults to 'data' (e.g. all persistable data resides in this.data.)
     */
    persistanceProperty: 'data',

    constructor: function(config) {
        Ext.applyIf(this, {
            data: {}
        });

        /**
         * Key: value pairs of all fields whose values have changed
         * @property modified
         * @type Object
         */
        this.modified = {};

        this[this.persistanceProperty] = {};

        this.mixins.observable.constructor.call(this);
    },

    /**
     * Returns the value of the given field
     * @param {String} fieldName The field to fetch the value for
     * @return {Mixed} The value
     */
    get: function(field) {
        return this[this.persistanceProperty][field];
    },

    /**
     * Sets the given field to the given value, marks the instance as dirty
     * @param {String|Object} fieldName The field to set, or an object containing key/value pairs
     * @param {Mixed} value The value to set
     */
    set: function(fieldName, value) {
        var me = this,
            fields = me.fields,
            modified = me.modified,
            convertFields = [],
            field, key, i, currentValue;

        /*
         * If we're passed an object, iterate over that object. NOTE: we pull out fields with a convert function and
         * set those last so that all other possible data is set before the convert function is called
         */
        if (arguments.length == 1 && Ext.isObject(fieldName)) {
            for (key in fieldName) {
                if (fieldName.hasOwnProperty(key)) {
                
                    //here we check for the custom convert function. Note that if a field doesn't have a convert function,
                    //we default it to its type's convert function, so we have to check that here. This feels rather dirty.
                    field = fields.get(key);
                    if (field && field.convert !== field.type.convert) {
                        convertFields.push(key);
                        continue;
                    }
                    
                    me.set(key, fieldName[key]);
                }
            }

            for (i = 0; i < convertFields.length; i++) {
                field = convertFields[i];
                me.set(field, fieldName[field]);
            }

        } else {
            if (fields) {
                field = fields.get(fieldName);

                if (field && field.convert) {
                    value = field.convert(value, me);
                }
            }
            currentValue = me.get(fieldName);
            me[me.persistanceProperty][fieldName] = value;
            if (!me.isEqual(currentValue, value)) {
                me.dirty = true;
                me.modified[fieldName] = currentValue;
            }

            if (!me.editing) {
                me.afterEdit();
            }
        }
    },
    
    /**
     * Checks if two values are equal, taking into account certain
     * special factors, for example dates.
     * @private
     * @param {Object} a The first value
     * @param {Object} b The second value
     * @return {Boolean} True if the values are equal
     */
    isEqual: function(a, b){
        if (Ext.isDate(a) && Ext.isDate(b)) {
            return a.getTime() === b.getTime();
        }
        return a === b;
    },
    
    /**
     * Begin an edit. While in edit mode, no events (e.g.. the <code>update</code> event)
     * are relayed to the containing store. When an edit has begun, it must be followed
     * by either {@link #endEdit} or {@link #cancelEdit}.
     */
    beginEdit : function(){
        var me = this;
        if (!me.editing) {
            me.editing = true;
            me.dirtySave = me.dirty;
            me.dataSave = Ext.apply({}, me[me.persistanceProperty]);
            me.modifiedSave = Ext.apply({}, me.modified);
        }
    },

    /**
     * Cancels all changes made in the current edit operation.
     */
    cancelEdit : function(){
        var me = this;
        if (me.editing) {
            me.editing = false;
            // reset the modified state, nothing changed since the edit began
            me.modified = me.modifiedSave;
            me[me.persistanceProperty] = me.dataSave;
            me.dirty = me.dirtySave;
            delete me.modifiedSave;
            delete me.dataSave;
            delete me.dirtySave;
        }
    },

    /**
     * End an edit. If any data was modified, the containing store is notified
     * (ie, the store's <code>update</code> event will fire).
     * @param {Boolean} silent True to not notify the store of the change
     */
    endEdit : function(silent){
        var me = this;
        if (me.editing) {
            me.editing = false;
            delete me.modifiedSave;
            delete me.dataSave;
            delete me.dirtySave;
            if (silent !== true && me.dirty) {
                me.afterEdit();
            }
        }
    },

    /**
     * Gets a hash of only the fields that have been modified since this Model was created or commited.
     * @return Object
     */
    getChanges : function(){
        var modified = this.modified,
            changes  = {},
            field;

        for (field in modified) {
            if (modified.hasOwnProperty(field)){
                changes[field] = this.get(field);
            }
        }

        return changes;
    },

    /**
     * Returns <tt>true</tt> if the passed field name has been <code>{@link #modified}</code>
     * since the load or last commit.
     * @param {String} fieldName {@link Ext.data.Field#name}
     * @return {Boolean}
     */
    isModified : function(fieldName) {
        return this.modified.hasOwnProperty(fieldName);
    },

    /**
     * <p>Marks this <b>Record</b> as <code>{@link #dirty}</code>.  This method
     * is used interally when adding <code>{@link #phantom}</code> records to a
     * {@link Ext.data.Store#writer writer enabled store}.</p>
     * <br><p>Marking a record <code>{@link #dirty}</code> causes the phantom to
     * be returned by {@link Ext.data.Store#getModifiedRecords} where it will
     * have a create action composed for it during {@link Ext.data.Store#save store save}
     * operations.</p>
     */
    setDirty : function() {
        var me = this,
            name;
        
        me.dirty = true;

        me.fields.each(function(field) {
            me.modified[name] = me.get(name);
        }, me);
    },

    //<debug>
    markDirty : function() {
        if (Ext.isDefined(Ext.global.console)) {
            Ext.global.console.warn('Ext.util.Stateful: markDirty has been deprecated. Use setDirty instead.');
        }
        return this.setDirty.apply(this, arguments);
    },
    //</debug>

    /**
     * Usually called by the {@link Ext.data.Store} to which this model instance has been {@link #join joined}.
     * Rejects all changes made to the model instance since either creation, or the last commit operation.
     * Modified fields are reverted to their original values.
     * <p>Developers should subscribe to the {@link Ext.data.Store#update} event
     * to have their code notified of reject operations.</p>
     * @param {Boolean} silent (optional) True to skip notification of the owning
     * store of the change (defaults to false)
     */
    reject : function(silent) {
        var me = this,
            modified = me.modified,
            field;

        for (field in modified) {
            if (modified.hasOwnProperty(field)) {
                if (typeof modified[field] != "function") {
                    me[me.persistanceProperty][field] = modified[field];
                }
            }
        }

        me.dirty = false;
        me.editing = false;
        me.modified = {};

        if (silent !== true) {
            me.afterReject();
        }
    },

    /**
     * Usually called by the {@link Ext.data.Store} which owns the model instance.
     * Commits all changes made to the instance since either creation or the last commit operation.
     * <p>Developers should subscribe to the {@link Ext.data.Store#update} event
     * to have their code notified of commit operations.</p>
     * @param {Boolean} silent (optional) True to skip notification of the owning
     * store of the change (defaults to false)
     */
    commit : function(silent) {
        var me = this;
        
        me.dirty = false;
        me.editing = false;

        me.modified = {};

        if (silent !== true) {
            me.afterCommit();
        }
    },

    /**
     * Creates a copy (clone) of this Model instance.
     * @param {String} id (optional) A new id, defaults to the id
     * of the instance being copied. See <code>{@link #id}</code>.
     * To generate a phantom instance with a new id use:<pre><code>
var rec = record.copy(); // clone the record
Ext.data.Model.id(rec); // automatically generate a unique sequential id
     * </code></pre>
     * @return {Record}
     */
    copy : function(newId) {
        var me = this;
        
        return new me.self(Ext.apply({}, me[me.persistanceProperty]), newId || me.internalId);
    }
});
