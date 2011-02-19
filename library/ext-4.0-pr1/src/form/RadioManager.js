/**
 * @private
 * Private utility class for managing all {@link Ext.form.Radio} fields grouped by name.
 */
Ext.define('Ext.form.RadioManager', {
    extend: 'Ext.util.MixedCollection',
    singleton: true,

    getAll: function(name){
        return this.filterBy(function(item){
            return item.name == name;
        });
    },

    getWithValue: function(name, value){
        return this.filterBy(function(item){
            return item.name == name && item.inputValue == value;
        });
    },

    getChecked: function(name){
        var checked = this.filterBy(function(item){
            return item.name == name && item.checked;
        });
        return checked.getCount() > 0 ? checked.first() : null;
    }
});