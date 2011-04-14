/**
 * @author Aaron Conran
 * @class Ext.grid.Panel
 * @extends Ext.panel.Table
 *
 * Grids are an excellent way of showing large amounts of tabular data on the client side. Essentially a supercharged 
 * `<table>`, GridPanel makes it easy to fetch, sort and filter large amounts of data.
 * 
 * Grids are composed of 2 main pieces - a {@link Ext.data.Store Store} full of data and a set of columns to render.
 * Here's the simplest way to set up a Grid:
 * 
 *     Ext.create('Ext.grid.Panel', {
 *         title: 'Users',
 *         store: {
 *             fields: ['name', 'email', 'phone'],
 *             proxy: {
 *                 type: 'ajax',
 *                 url : '/users.json'
 *             },
 *             autoLoad: true
 *         },
 *         columns: [
 *             {header: 'Name',  dataIndex: 'name'},
 *             {header: 'Email', dataIndex: 'email'},
 *             {header: 'Phone', dataIndex: 'phone'}
 *         ],
 *         height: 200,
 *         width: 500,
 *         renderTo: Ext.getBody()
 *     });
 * 
 * The code above produces a simple grid with three columns. We specified a Store which will load its data over AJAX from
 * the url '/users.json'. In most apps we would be placing the grid inside another container and wouldn't need to use the
 * {@link #height}, {@link #width} and {@link #renderTo} configurations but they are included here to make it easy to get
 * up and running.
 * 
 * The grid we created above will contain a header bar with a title ('Users'), a row of column headers directly underneath
 * and finally the grid rows under the headers.
 * 
 * ## Configuring columns
 * 
 * By default, each column is sortable and will toggle between ASC and DESC sorting when you click on its header. Each
 * column header is also reorderable by default, and each gains a drop-down menu with options to hide and show columns.
 * It's easy to configure each column - here we use the same example as above and just modify the columns config:
 * 
 *     columns: [
 *         {
 *             header: 'Name',
 *             dataIndex: 'name',
 *             sortable: false,
 *             hideable: false,
 *             flex: 1
 *         },
 *         {
 *             header: 'Email',
 *             dataIndex: 'email',
 *             hidden: true
 *         },
 *         {
 *             header: 'Phone',
 *             dataIndex: 'phone',
 *             width: 100
 *         }
 *     ]
 * 
 * We turned off sorting and hiding on the 'Name' column so clicking its header now has no effect. We also made the Email
 * column hidden by default (it can be shown again by using the menu on any other column). We also set the Phone column to
 * a fixed with of 100px and flexed the Name column, which means it takes up all remaining width after the other columns 
 * have been accounted for. See the {@link Ext.grid.column.Column column docs} for more details.
 * 
 * ## Renderers
 * 
 * As well as customizing columns, it's easy to alter the rendering of individual cells using renderers. A renderer is 
 * tied to a particular column and is passed the value that would be rendered into each cell in that column. For example,
 * we could define a renderer function for the email column to turn each email address into a mailto link:
 * 
 *     columns: [
 *         {
 *             header: 'Email',
 *             dataIndex: 'email',
 *             renderer: function(value) {
 *                 return Ext.String.format('<a href="mailto:{0}">{1}</a>', value, value);
 *             }
 *         }
 *     ]
 * 
 * See the {@link Ext.grid.column.Column column docs} for more information on renderers.
 * 
 * ## Selection Models
 * 
 * Sometimes all you want is to render data onto the screen for viewing, but usually it's necessary to interact with or 
 * update that data. Grids use a concept called a Selection Model, which is simply a mechanism for selecting some part of
 * the data in the grid. The two main types of Selection Model are RowSelectionModel, where entire rows are selected, and
 * CellSelectionModel, where individual cells are selected.
 * 
 * Grids use a Row Selection Model by default, but this is easy to customise like so:
 * 
 *     Ext.create('Ext.grid.Panel', {
 *         selType: 'cellmodel',
 *         store: ...
 *     });
 * 
 * Specifying the {@link Ext.selection.CellModel cellmodel} changes a couple of things. Firstly, clicking on a cell now
 * selects just that cell (using a {@link Ext.selection.RowModel rowmodel} will select the entire row), and secondly the
 * keyboard navigation will walk from cell to cell instead of row to row. Cell-based selection models are usually used in
 * conjunction with editing.
 * 
 * ## Editing
 * 
 * Grid has built-in support for in-line editing. There are two chief editing modes - cell editing and row editing. Cell
 * editing is easy to add to your existing column setup - here we'll just modify the example above to include an editor
 * on both the name and the email columns:
 * 
 *     Ext.create('Ext.grid.Panel', {
 *         store: myStore,
 *         columns: [
 *             {
 *                 header: 'Name',
 *                 dataIndex: 'name',
 *                 field: 'textfield'
 *             },
 *             {
 *                 header: 'Email',
 *                 dataIndex: 'email',
 *                 field: {
 *                     xtype: 'textfield',
 *                     allowBlank: false
 *                 }
 *             },
 *             {header: 'Phone', dataIndex: 'phone'}
 *         ],
 *         selType: 'cellmodel',
 *         plugins: [
 *             Ext.create('Ext.grid.plugin.CellEditing', {
 *                 clicksToEdit: 1
 *             })
 *         ]
 *     });
 * 
 * This requires a little explanation. We're passing in {@link #store store} and {@link #columns columns} as normal, but 
 * this time we've also specified a {@link #field field} on two of our columns. For the Name column we just want a default
 * textfield to edit the value, so we specify 'textfield'. For the Email column we customized the editor slightly by 
 * passing allowBlank: false, which will provide inline validation.
 * 
 * To support cell editing, we also specified that the grid should use the 'cellmodel' {@link #selType}, and created an
 * instance of the {@link Ext.grid.plugin.CellEditing CellEditing plugin}, which we configured to activate each editor after a
 * single click.
 * 
 * ## Row Editing
 * 
 * The other type of editing is row-based editing, using the RowEditor component. This enables you to edit an entire row
 * at a time, rather than editing cell by cell. Row Editing works in exactly the same way as cell editing, all we need to
 * do is change the plugin type to {@link Ext.grid.plugin.RowEditing}, and set the selType to 'rowmodel':
 * 
 *     Ext.create('Ext.grid.Panel', {
 *         store: myStore,
 *         columns: [
 *             {
 *                 header: 'Name',
 *                 dataIndex: 'name',
 *                 field: {
 *                     xtype: 'textfield'
 *                 }
 *             },
 *             {
 *                 header: 'Email',
 *                 dataIndex: 'email',
 *                 field: {
 *                     xtype: 'textfield',
 *                     allowBlank: false
 *                 }
 *             },
 *             {header: 'Phone', dataIndex: 'phone'}
 *         ],
 *         selType: 'rowmodel',
 *         plugins: [
 *             Ext.create('Ext.grid.plugin.RowEditing', {
 *                 clicksToEdit: 1
 *             })
 *         ]
 *     });
 * 
 * Again we passed some configuration to our {@link Ext.grid.plugin.RowEditing} plugin, and now when we click each row a row
 * editor will appear and enable us to edit each of the columns we have specified an editor for.
 * 
 * ## Sorting & Filtering
 * 
 * Every grid is attached to a {@link Ext.data.Store Store}, which provides multi-sort and filtering capabilities. It's
 * easy to set up a grid to be sorted from the start:
 * 
 *     var myGrid = Ext.create('Ext.grid.Panel', {
 *         store: {
 *             fields: ['name', 'email', 'phone'],
 *             sorters: ['name', 'phone']
 *         },
 *         columns: [
 *             {header: 'Name',  dataIndex: 'name'},
 *             {header: 'Email', dataIndex: 'email'}
 *         ]
 *     });
 * 
 * Sorting at run time is easily accomplished by simply clicking each column header. If you need to perform sorting on 
 * more than one field at run time it's easy to do so by adding new sorters to the store:
 * 
 *     myGrid.store.sort([
 *         {property: 'name',  direction: 'ASC'},
 *         {property: 'email', direction: 'DESC'},
 *     ]);
 * 
 * 
 * 
 * ## Grouping
 * 
 * Grid supports the grouping of rows by any field. For example if we had a set of employee records, we might want to 
 * group by the department that each employee works in. Here's how we might set that up:
 * 
 *     Ext.create('Ext.grid.Panel', {
 *         store: {
 *             groupField: 'department',
 *             fields: ['name', 'salary', 'department'],
 *             proxy: {
 *                 type: 'ajax',
 *                 url : 'employees.json'
 *             }
 *         },
 *         columns: ['name', 'salary'],
 *         features: 'grouping'
 *     });
 * 
 * 
 * ## Infinite Scrolling
 * 
 * 
 * 
 * ## Paging
 * 
 * 
 * @docauthor Ed Spencer
 */
Ext.define('Ext.grid.Panel', {
    extend: 'Ext.panel.Table',
    requires: ['Ext.grid.View'],
    alias: ['widget.gridpanel', 'widget.grid'],
    alternateClassName: ['Ext.list.ListView', 'Ext.ListView', 'Ext.grid.GridPanel'],
    viewType: 'gridview',
    
    lockable: false,
    
    // Required for the Lockable Mixin. These are the configurations which will be copied to the
    // normal and locked sub tablepanels
    normalCfgCopy: ['invalidateScrollerOnRefresh', 'verticalScroller', 'verticalScrollDock', 'verticalScrollerType', 'scroll'],
    lockedCfgCopy: ['invalidateScrollerOnRefresh'],
    
    /**
     * @cfg {Boolean} columnLines Adds column line styling
     */
    
    initComponent: function() {
        var me = this;

        if (me.columnLines) {
            me.cls = (me.cls || '') + ' ' + Ext.baseCSSPrefix + 'grid-with-col-lines';
        }
        me.callParent();
    }
});