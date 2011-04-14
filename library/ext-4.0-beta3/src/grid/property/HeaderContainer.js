/**
 * @class Ext.grid.property.HeaderContainer
 * @extends Ext.grid.header.Container
 * A custom HeaderContainer for the {@link Ext.grid.property.Grid}.  Generally it should not need to be used directly.
 * @constructor
 * @param {Ext.grid.property.Grid} grid The grid this store will be bound to
 * @param {Object} source The source data config object
 */
Ext.define('Ext.grid.property.HeaderContainer', {

    extend: 'Ext.grid.header.Container',

    alternateClassName: 'Ext.grid.PropertyColumnModel',

    // private - strings used for locale support
    nameText : 'Name',
    valueText : 'Value',
    dateFormat : 'm/j/Y',
    trueText: 'true',
    falseText: 'false',

    constructor : function(grid, store) {

        this.grid = grid;
        this.store = store;
        this.callParent([{
            items: [{
                header: this.nameText,
                width: 115,
                sortable: true,
                dataIndex: 'name',
                renderer: Ext.Function.bind(this.renderProp, this),
                itemId: 'name',
                menuDisabled :true
            }, {
                header: this.valueText,
                renderer: Ext.Function.bind(this.renderCell, this),
                getEditingField: function(record) {
                    return grid.getCellEditor(record, this);
                },
                flex: 1,
                fixed: true,
                dataIndex: 'value',
                itemId: 'value',
                menuDisabled: true
            }]
        }]);
    },

    // private
    // Render a property name cell
    renderProp : function(v) {
        return this.getPropertyName(v);
    },

    // private
    // Render a property value cell
    renderCell : function(val, meta, rec) {
        var renderer = this.grid.customRenderers[rec.get('name')];
        if (renderer) {
            return renderer.apply(this, arguments);
        }
        var rv = val;
        if (Ext.isDate(val)) {
            rv = this.renderDate(val);
        } else if (Ext.isBoolean(val)) {
            rv = this.renderBool(val);
        }
        return Ext.util.Format.htmlEncode(rv);
    },

    // private
    renderDate : Ext.util.Format.date,

    // private
    renderBool : function(bVal) {
        return this[bVal ? 'trueText' : 'falseText'];
    },

    // private
    // Renders custom property names instead of raw names if defined in the Grid
    getPropertyName : function(name) {
        var pn = this.grid.propertyNames;
        return pn && pn[name] ? pn[name] : name;
    }
});