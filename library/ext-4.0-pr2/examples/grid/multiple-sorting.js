Ext.Loader.setConfig({enabled: true});

Ext.Loader.setPath('Ext.ux', '../ux/');

Ext.require([
    'Ext.data.*',
    'Ext.grid.*',
    'Ext.util.*',
    'Ext.toolbar.*',
    'Ext.ux.ToolbarDroppable',
    'Ext.ux.BoxReorderer'
]);

Ext.onReady(function() {
   //The following functions are used to get the sorting data from the toolbar and apply it to the store
    /**
     * Tells the store to sort itself according to our sort data
     */
    function doSort() {
        store.sort(getSorters());
    }
    
    /**
     * Callback handler used when a sorter button is clicked or reordered
     * @param {Ext.Button} button The button that was clicked
     * @param {Boolean} changeDirection True to change direction (default). Set to false for reorder
     * operations as we wish to preserve ordering there
     */
    function changeSortDirection(button, changeDirection) {
        var sortData = button.sortData,
            iconCls  = button.iconCls;
        
        if (sortData) {
            if (changeDirection !== false) {
                button.sortData.direction = Ext.String.toggle(button.sortData.direction, "ASC", "DESC");
                button.setIconClass(Ext.String.toggle(iconCls, "sort-asc", "sort-desc"));
            }
            store.clearFilter();
            doSort();
        }
    }
    
    /**
     * Returns an array of sortData from the sorter buttons
     * @return {Array} Ordered sort data from each of the sorter buttons
     */
    function getSorters() {
        var sorters = [];
 
        Ext.each(tbar.query('button'), function(button) {
            sorters.push(button.sortData);
        }, this);

        return sorters;
    }
    
    /**
     * Convenience function for creating Toolbar Buttons that are tied to sorters
     * @param {Object} config Optional config object
     * @return {Object} The new Button configuration
     */
    function createSorterButtonConfig(config) {
        config = config || {};
        Ext.applyIf(config, {
            listeners: {
                click: function(button, e) {
                    // restore the setPosition defeated by boxreorderer
                    delete button.setPosition;
                    changeSortDirection(button, true);
                }
            },
            iconCls: 'sort-' + config.sortData.direction.toLowerCase(),
            reorderable: true,
            xtype: 'button'
        });
        
        return config;
    }
    
    /**
     * Returns an array of fake data
     * @param {Number} count The number of fake rows to create data for
     * @return {Array} The fake record data, suitable for usage with an ArrayReader
     */
    function createFakeData(count) {
        var firstNames   = ['Ed', 'Tommy', 'Aaron', 'Abe', 'Jamie', 'Adam', 'Dave', 'David', 'Jay', 'Nicolas'],
            lastNames    = ['Spencer', 'Maintz', 'Conran', 'Elias', 'Avins', 'Mishcon', 'Kaneda', 'Davis', 'Robinson', 'Ferrero'],
            ratings      = [1, 2, 3, 4, 5],
            salaries     = [100, 400, 900, 1500, 1000000];

        var data = [];
        for (var i = 0; i < (count || 25); i++) {
            var ratingId    = Math.floor(Math.random() * ratings.length),
                salaryId    = Math.floor(Math.random() * salaries.length),
                firstNameId = Math.floor(Math.random() * firstNames.length),
                lastNameId  = Math.floor(Math.random() * lastNames.length),

                rating      = ratings[ratingId],
                salary      = salaries[salaryId],
                name        = Ext.String.format("{0} {1}", firstNames[firstNameId], lastNames[lastNameId]);

            data.push([rating, salary, name]);
        }
        
        return data;
    }
    
    // create the data store
    Ext.regModel('Employee', {
        fields: [
           {name: 'rating', type: 'int'},
           {name: 'salary', type: 'float'},
           {name: 'name'}
        ]        
    });
    
    var store = Ext.create('Ext.data.Store', {
        model: 'Employee',
        proxy: {
            type: 'memory',
            data: createFakeData(25),
            reader: {
                type: 'array'
            }
        }
    });
    
    store.load();

    var reorderer = Ext.create('Ext.ux.BoxReorderer', {
        listeners: {
            scope: this,
            Drop: function(r, c, button) { //update sort direction when button is dropped
                changeSortDirection(button, false);
            }
        }
    });
    
    var droppable = Ext.create('Ext.ux.ToolbarDroppable', {
        /**
         * Creates the new toolbar item from the drop event
         */
        createItem: function(data) {
            var header = this.getHeaderFromDragDrop(data);
            
            return createSorterButtonConfig({
                text: header.text,
                sortData: {
                    property: header.dataIndex,
                    direction: "ASC"
                }
            });
        },

        /**
         * Custom canDrop implementation which returns true if a column can be added to the toolbar
         * @param {Object} data Arbitrary data from the drag source
         * @return {Boolean} True if the drop is allowed
         */
        canDrop: function(dragSource, event, data) {
            var sorters = getSorters(),
                header  = this.getHeaderFromDragDrop(data),
                length = sorters.length,
                i;

            for (i = 0; i < length; i++) {
                if (sorters[i].property == header.dataIndex) {
                    return false;
                }
            }

            return true;
        },
        
        afterLayout: doSort,

        /**
         * Helper function used to find the column that was dragged
         * @param {Object} data Arbitrary data from
         */
        getHeaderFromDragDrop: function(data) {
            return grid.down("headercontainer").getChildByElement(data.header);
        }
    });
    
    //create the toolbar with the 2 plugins
    var tbar = Ext.create('Ext.toolbar.Toolbar', {
        defaults: {
            reorderable: false
        },
        items  : ['Sorting order:', '-'],
        plugins: [reorderer, droppable]
       
    });

    tbar.add(createSorterButtonConfig({
        text: 'Rating',
        sortData: {
            property: 'rating',
            direction: 'DESC'
        }
    }));
    
    tbar.add(createSorterButtonConfig({
        text: 'Salary',
        sortData: {
            property: 'salary',
            direction: 'ASC'
        }
    }));
    
    // create the Grid
    var grid = Ext.create('Ext.grid.GridPanel', {
        tbar : tbar,
        store: store,
        headers: [
            {
                text: 'Name',
                flex:1 ,
                sortable: false,
                dataIndex: 'name'
            },{
                text: 'Rating',
                width: 125,
                sortable: false,
                dataIndex: 'rating'
            },{
                text: 'Salary',
                width: 125,
                sortable: false,
                dataIndex: 'salary'
            }
        ],
        stripeRows: true,
        height: 350,
        width : 600,
        title : 'Array Grid',
        renderTo: 'grid-example',
        listeners: {
            scope: this,
            //here we tell the toolbar's droppable plugin that it can accept items from the columns' dragdrop group
            afterrender: function(g) {
                var headerCt = g.down("headercontainer"),
                    //the plugin position depends on browser see Ext.grid.HeaderContainer sources
                    dragProxy = headerCt.plugins[0].dragZone || headerCt.plugins[1].dragZone;
                    
                droppable.addDDGroup(dragProxy.ddGroup);
                doSort();
            }
        }
    });
});