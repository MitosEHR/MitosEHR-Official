/**
 * @author Ed Spencer
 * @class Ext.data.Association
 * @extends Object
 *
 * <p>Associations enable you to express relationships between different {@link Ext.data.Model Models}. Let's say we're
 * writing an ecommerce system where Users can make Orders - there's a relationship between these Models that we can
 * express like this:</p>
 *
<pre><code>
Ext.regModel('User', {
    fields: ['id', 'name', 'email'],

    hasMany: {model: 'Order', name: 'orders'}
});

Ext.regModel('Order', {
    fields: ['id', 'user_id', 'status', 'price'],

    belongsTo: 'User'
});
</code></pre>
 *
 * <p>We've set up two models - User and Order - and told them about each other. You can set up as many associations on
 * each Model as you need using the two default types - {@link Ext.data.HasManyAssociation hasMany} and
 * {@link Ext.data.BelongsToAssociation belongsTo}. There's much more detail on the usage of each of those inside their
 * documentation pages. If you're not familiar with Models already, {@link Ext.data.Model there is plenty on those too}.</p>
 *
 * <p><u>Further Reading</u></p>
 *
 * <ul style="list-style-type: disc; padding-left: 20px;">
 *   <li>{@link Ext.data.HasManyAssociation hasMany associations}
 *   <li>{@link Ext.data.BelongsToAssociation belongsTo associations}
 *   <li>{@link Ext.data.Model using Models}
 * </ul>
 *
 * @constructor
 * @param {Object} config Optional config object
 */
Ext.define('Ext.data.Association', {
    /**
     * @cfg {String} ownerModel The string name of the model that owns the association. Required
     */

    /**
     * @cfg {String} associatedModel The string name of the model that is being associated with. Required
     */

    /**
     * @cfg {String} primaryKey The name of the primary key on the associated model. Defaults to 'id'
     */
    primaryKey: 'id',

    /**
     * @cfg {Ext.data.reader.Reader} reader A special reader to read associated data
     */

    defaultReaderType: 'json',

    statics: {
        create: function(association){
            if (!association.isAssociation) {
                if (Ext.isString(association)) {
                    association = {
                        type: association
                    };
                }

                switch (association.type) {
                    case 'belongsTo':
                        return Ext.create('Ext.data.BelongsToAssociation', association);
                    case 'hasMany':
                        return Ext.create('Ext.data.HasManyAssociation', association);
                    //TODO Add this back when it's fixed
//                    case 'polymorphic':
//                        return Ext.create('Ext.data.PolymorphicAssociation', association);
                    default:
                        //<debug>
                        Ext.Error.raise('Unknown Association type: "' + association.type + '"');
                        //</debug>
                }
            }
            return association;
        }
    },

    constructor: function(config) {
        Ext.apply(this, config);

        var types           = Ext.ModelManager.types,
            ownerName       = config.ownerModel,
            associatedName  = config.associatedModel,
            ownerModel      = types[ownerName],
            associatedModel = types[associatedName],
            ownerProto;

        //<debug>
        if (ownerModel === undefined) {
            Ext.Error.raise("The configured ownerModel was not valid (you tried " + ownerName + ")");
        }
        if (associatedModel === undefined) {
            Ext.Error.raise("The configured associatedModel was not valid (you tried " + associatedName + ")");
        }
        //</debug>

        this.ownerModel = ownerModel;
        this.associatedModel = associatedModel;

        /**
         * The name of the model that 'owns' the association
         * @property ownerName
         * @type String
         */

        /**
         * The name of the model is on the other end of the association (e.g. if a User model hasMany Orders, this is 'Order')
         * @property associatedName
         * @type String
         */

        Ext.applyIf(this, {
            ownerName : ownerName,
            associatedName: associatedName
        });
    },

    /**
     * Get a specialized reader for reading associated data
     * @return {Ext.data.reader.Reader} The reader, null if not supplied
     */
    getReader: function(){
        var me = this,
            reader = me.reader,
            model = me.associatedModel;

        if (reader) {
            if (Ext.isString(reader)) {
                reader = {
                    type: reader
                };
            }
            if (reader.isReader) {
                reader.setModel(model);
            } else {
                Ext.applyIf(reader, {
                    model: model,
                    type : me.defaultReaderType
                });
            }
            me.reader = Ext.createByAlias('reader.' + reader.type, reader);
        }
        return me.reader || null;
    }
});
