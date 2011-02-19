Ext.define('Slicer', {
    singleton: true,
    mixins: ['Ext.util.Observable'],
    constructor: function() {
        this.addEvents('slice');
        this.parent(arguments);
    },
    
    slice: function() {
        this.fireEvent('slice', this);
    }
});

// overwrite the PageSlice methods if they are not defined. Also used as a reference to the PageSlice methods.
if ('undefined' === typeof PageSlice) {
    // PageSlice methods
    PageSlice = {
        log        : function(msg) {console.log(msg)},
        capture    : function(){},
        terminate  : function(){},
        save       : function(x, y, width, height, path){},
        copyPixels : function(x, y, width, height, destX, destY){},
        getColor   : function(x, y){},
        reduceColor: function(x, y, width, height){}
    };
    
    Ext.isPageSlice = false;
}