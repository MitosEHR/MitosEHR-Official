//We're using Models and DataViews in this example. Requiring them here allows us to create a minified build later on
Ext.require(['Ext.data.*', 'Ext.DataView', 'Ext.button.Button']);

//Once the page is ready, this function will be called automaticall
Ext.onReady(function() {
    /*
     * We start by defining two models. These are joined by a simple association - each Product has many Reviews
     */
    Ext.regModel('Product', {
        fields: ['id', 'name', 'price', 'image'],
        hasMany: 'Review'
    });
    
    Ext.regModel('Review', {
        fields: ['product_id', 'author', 'rating', 'comment'],
        belongsTo: 'Product'
    });
    
    /*
     * The Store loads our Product data, and is added to our DataView below
     */
    var productStore = new Ext.data.Store({
        autoLoad: true,
        model: 'Product',
        proxy: {
            type: 'ajax',
            url : 'products.json'
        }
    });
    
    /*
     * Each DataView uses an XTemplate to render its data. Here we've made a new XTemplate with a couple of extra
     * functions that calculate the average rating of each product and create a review count pluralizer.
     */
    var productTpl = new Ext.XTemplate(
        '<tpl for=".">',
            '<div class="product">',
                '<h3>{name}</h3>',
                '<span class="price">${price}</span>',
                '<div class="rating">Rating: {[this.averageRating(values)]} (<a href="#">{[this.reviewCount(values)]}</a>)</div>',
                
                '<ul class="reviews">',
                    '<tpl for="reviews">',
                        '<li><em>{author}:</em> {comment}</li>',
                    '</tpl>',
                '</ul>',
            '</div>',
        '</tpl>',
        {
            averageRating: function(product) {
                var reviews = product.reviews,
                    ratings = Ext.pluck(reviews, 'rating'),
                    sum     = Ext.sum(ratings),
                    length  = reviews.length,
                    average = (sum / length).toFixed(1);
                
                return average;
            },
            
            reviewCount: function(product) {
                var count = product.reviews.length;
                
                if (count == 1) {
                    return "1 review";
                } else {
                    return count + " reviews";
                }
            }
        }
    );
    
    /*
     * A simple button that loads the data. The 'handler' function is called when the button is clicked
     */
    Ext.create('Ext.Button', {
        text: 'Load the data',
        scale: 'large',
        renderTo: Ext.getBody(),
        handler: function() {
            productStore.load();
        }
    });
    
    /*
     * The DataView is the centerpiece of this example. It combines the data from the Store with the XTemplate we
     * defined above to render our loaded data.
     */
    Ext.create('Ext.DataView', {
        renderTo: 'products',
        store: productStore,
        itemSelector: 'div.product',
        tpl: productTpl,
        
        listeners: {
            click: function(dataview, index, node, e) {
                if (e.getTarget('a')) {
                    Ext.fly(node).toggleCls('reviews-visible');
                }
            }
        }
    });
});