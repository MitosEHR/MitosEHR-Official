/**
 * @class Ext.ViewManager
 * @extends Ext.AbstractManager
 * @singleton
 * @ignore
 * 
 * <p>NOT CURRENTLY USED</p>
 */
Ext.ViewManager = new Ext.AbstractManager({
    register: function(id, options) {
        if (Ext.isObject(id)) {
            options = id;
        }
        else {
            options.name = id || options.name;
        }
        
        var view = options.isView ? options : new Ext.View(options);
        this.all.add(view);
    },
    
    create : function(config, type) {
        var view = this.get(type);
        if (view) {
            return view.getInstance(config);
        }
    }
});

Ext.regView = function() {
    return Ext.ViewManager.register.apply(Ext.ViewManager, arguments);
};