/**
 * @class videos
 * @extends Ext.Controller
 * The videos controller
 */
Ext.regController("videos", {

    list: function(options) {        
        this.render({
            xtype: 'videolist',
            listeners: {
                scope: this,
                filterByTags: this.filterByTags,
                filterByQuery: this.filterByQuery,
                click: function(dataview, index) {
                    var video = dataview.store.getAt(index);
                    
                    return Ext.redirect(video);
                }
            }
        }, 'mainPanel');
    },

    show: function(options) {
        var id       = Number(options.id),
            store    = Ext.getStore('Videos'),
            instance = options.instance || store.getById(id);
        
        if (instance) {
            this.doShow(instance);
        } else {
            store.on('load', function(store, records) {
                this.doShow(store.getById(id));
            }, this, {single: true});
        }
    },
    
    doShow: function(video) {
        this.render({
            xtype: 'videoshow',
            video: video,
            
            listeners: {
                showList: Ext.createRedirect('videos')
            }
        }, 'mainPanel');
    },
    
    /**
     * Filters the Videos Store to only show videos matching at least one of the given tags
     */
    filterByTags: function(tags) {
        var store = Ext.getStore('Videos'),
            data  = Ext.pluck(tags, 'data'),
            names = Ext.pluck(data, 'name'),
            regex = new RegExp(names.join("|"));
        
        store.filter({
            id: 'tags',
            filterFn: function(record) {
                return regex.test(record.get('tags'));
            }
        });
    },
    
    /**
     * Filters the Videos Store by the given query string
     */
    filterByQuery: function(query) {
        var store = Ext.getStore('Videos');
        
        if (query == "") {
            store.filters.removeByKey('query');
            store.filter();
        } else {
            store.filter({
                id: 'query',
                property: 'title',
                value   : query,
                anyMatch: true
            });
        }
    }
});
