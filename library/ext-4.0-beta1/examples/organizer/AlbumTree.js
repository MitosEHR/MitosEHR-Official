Ext.define('Ext.org.AlbumTree', {
    extend: 'Ext.tree.TreePanel',
    alias : 'widget.albumtree',
    
    title: 'My Albums',
    animate: true,
    rootVisible: false,
    
    viewConfig: {
        plugins: [{
            ddGroup: 'organizerDD',
            ptype  : 'treeviewdd'
        }]
    },
    
    displayField: 'name',
    
    root: {
        name: 'Root',
        allowDrop: false,
        children: [
            {
                name   : 'Album 1',
                iconCls: 'album-btn'
            }
        ]
    },
    
    initComponent: function() {
        this.count = 1;
        
        this.tbar = [
            {
                text: 'New Album',
                iconCls: 'album-btn',
                scope: this,
                handler: this.addAlbum
            }
        ];
        
        this.store = Ext.create('Ext.data.TreeStore', {
            fields: ['name']
        });
        
        this.callParent();
    },
    
    /**
     * Adds a new album node to the root
     */
    addAlbum: function() {
        var root = this.store.getRootNode();
        this.count++;
        
        root.appendChild({name: 'Album ' + this.count, iconCls: 'album-btn'});
    }
});