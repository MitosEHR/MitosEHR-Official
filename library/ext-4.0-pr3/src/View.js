/**
 * @class Ext.View
 * @extends Ext.util.Stateful
 * @private
 * Base View class
 */
Ext.View = Ext.extend(Ext.util.Stateful, {
    /**
     * @type {Boolean}
     * Set to true for all Ext.View's.
     */
    isView: true,

    /**
     * @cfg {String} name
     */

    /**
     * @cfg {String} xtype
     */

    /**
     * @cfg {Array} events
     */
     
     constructor : function(config) {
         this.config = config || {};
         if(!config.name) {
             throw 'Every View needs to have a name defined';
         }         
         this.xtype = Ext.baseCSSPrefix + 'view-' + config.name;
         this.id = this.name = config.name;
     },
     
     /**
      * This method will return an instance of our generated class. If the class
      * has not been generated yet (when this is the first instance you get),
      * this method will generate it on the fly for you.
      * @return {Ext.Component} An instance of our generated class
      */
     getInstance : function(config) {
         if (!this.cls) {
             this.generate();
         }
         return new this.cls(config);
     },
     
     /**
      * @private
      * This method generates a new Component class on the fly, based on the configuration
      * of the view. The generated class will extend the xtype of the top level component
      * in the view configuration.
      * @return {Class} The generated class.
      */
     generate : function() {
         if (this.cls) {
             return null;
         }

         var config      = this.config,
             // By default we will extend Ext.container.Container
             extend      = Ext.panel.Panel,
             // We are going to have a collection of all the primitive
             // and all the complex options in the config
             primitives  = this.primitives = [],
             complex     = this.complex    = [],
             methods     = this.methods    = [],
             events      = null,
             references  = [],
             key, value, i, ln, o;

         // If an xtype is specified, we want our new class to extend the class
         // assosiated with that xtype           
         if (config.xtype) {
             extend = Ext.ComponentMgr.types[config.xtype] || extend;
             delete config.xtype;
         }

         // We also add the ability to dynamically add new events to the component
         if (config.events) {
             events = config.events;
             events = Ext.isArray(events) ? events : [events];
             delete config.events;
         }

         this.references = [];

         // Get all the name references
         if (config.items) {
             this.references = references = this.references.concat(this.prepareItems(config.items));
         }

         // Get all the name references for docked items
         if (config.dockedItems) {
             this.references = references = this.references.concat(this.prepareItems(config.dockedItems));
         }

         // Lets loop over all the keys and values of our view config
         // and handle special cases. Also make a mapping of all the
         // primitive and complex config options.
         for (key in config) {
             value = config[key];

             if (Ext.isPrimitive(value)) {
                 primitives.push({
                     key: key,
                     value: value
                 });
             }
             else if (Ext.isFunction(value)) {
                 methods.push({
                     key: key,
                     value: value
                 });
             }
             else {
                 complex.push({
                     key: key,
                     value: value
                 });
             }
         }        

         var prototype = {
             initComponent : function() {
                 // assign all the complex items
                 var i, ln, o;
                 for(i = 0, ln = complex.length; i < ln; i++) {
                     o = complex[i];
                     this[o.key] = o.value;
                 }

                 if(events) {
                     this.addEvents.apply(this, events);
                 }

                 extend.prototype.initComponent.call(this);  

                 this.addReferences(references);

                 if (this.init) {
                     this.init();
                 }
             },

             afterRender : function() {
                 if (this.setup) {
                     this.setup();
                 }
                 extend.prototype.afterRender.apply(this, arguments);
             },

             addReferences : function(references) {
                 var ln = references.length,
                     x, y, cmp, path, ref, o, name;

                 this.refs = this.refs || {};

                 for (x = 0; x < ln; x++) {
                     ref = references[x];
                     path = ref.path.split('|');

                     // Get a reference to the actual instance of this item
                     cmp = Ext.getCmp(ref.id);
                     name = ref.name;

                     cmp.viewPath = ref.path;

                     // Store the reference on the view component
                     this.refs[name] = cmp;

                     // In this case we also have to put a ref on the subcomponent
                     if (path.length > 1) {
                         for (y = 1; y < path.length; y++) {
                             ref = this.refs[path[y-1]];
                             if (!ref.refs) {
                                 ref.refs = {};
                             }
                             ref.refs[name] = cmp;
                         }
                     }
                 }
             },

             get : function(name) {
                 return this.refs[name] || null;
             }
         };

         // Apply all the primitive types to the prototype
         for (i = 0, ln = primitives.length; i < ln; i++) {
             o = primitives[i];
             prototype[o.key] = o.value;
         }

         // Add all the methods defined in the view to the prototype
         for(i = 0, ln = methods.length; i < ln; i++) {
             o = methods[i];
             prototype[o.key] = o.value;
         }

         prototype.isView = true;
         prototype.name = this.name;

         this.cls = Ext.extend(extend, prototype);
         Ext.reg(this.xtype, this.cls);

         return this.cls;
     },
     
     /**
      * Loops over an items collection recursively and gets all the name references. Also makes
      * sure all items have an xtype and a name.
      * @return {Array} An array containing reference paths to each item in this items collection
      */
     prepareItems : function(items, chain) {
         // Make sure items is an array to handle items: {} case
         items = Ext.isObject(items) ? [items] : items;
         chain = chain || '';

         var ln          = items.length,
             references  = [],
             i, item, ref, view;

         for (i = 0; i < ln; i++) {
             item = items[i];

             // If this item is another view, we are only going to make a reference
             // the the view. This way we avoid name collisions
             if (item.view) {
                 view = Ext.isString(item.view) ? Ext.getView(item.view) : item.view;
                 // In order for this xtype to work, we actually have to generate the cls on this view
                 if (!view.cls) {
                     view.generate();
                 }
                 item.xtype = view.xtype;
                 item.name = view.name;
                 delete item.view;
             }

             // We need a name on each item to make sure we can make reference chains
             if (!item.name) {
                 item.name = Ext.id(item, (item.xtype || 'comp') + '-');
             }
             else {
                 // Make sure every item gets an id
                 Ext.id(item, item.name + '-');
             }

             // We want to append the name of this item to the reference chain
             ref = chain ? (chain + '|' + item.name) : item.name;

             // Add the item to the references collection
             references.push({
                 path: ref,
                 id  : item.id,
                 name: item.name
             });

             // We want to make this a recursive process
             if(item.items) {                
                 // Concatenate all the descendents references
                 references = references.concat(this.prepareItems(item.items, ref));
             }

             // We want to make this a recursive process
             if(item.dockedItems) {                
                 // Concatenate all the descendents references
                 references = references.concat(this.prepareItems(item.dockedItems, ref));
             }
         }

         return references;
     }          
});