Ext.define('Sample.CoolGuy', {
    extend: 'Sample.Person',

    mixins: {
        guitar: 'Sample.ability.CanPlayGuitar',
        sing: 'Sample.ability.CanSing'
    },

    constructor: function() {
        this.getConfig().knownSongs.push("Love Me or Die");

        return this.callParent(arguments);
    },

    sing: function() {
        alert("Ahem...");

        return this.getMixin('sing').sing.apply(this, arguments);
    }
});
