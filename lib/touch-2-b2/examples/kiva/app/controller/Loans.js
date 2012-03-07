/**
 * @class Kiva.controller.Loans
 * @extends Ext.app.Controller
 *
 * The only controller in this simple application - this simply sets up the fullscreen viewport panel
 * and renders a detailed overlay whenever a Loan is tapped on.
 */
Ext.define('Kiva.controller.Loans', {
    extend: 'Ext.app.Controller',

    config: {
        profile: Ext.os.deviceType.toLowerCase(),

        refs: {
            main: 'mainview',
            loansList: 'loanslist',
            loanFilter: 'loanfilter',
            refreshButton: 'button[iconCls=refresh]'
        },

        control: {
            'loanslist': {
                select: 'onListTap'
            },
            'detail': {
                hideanimationstart: 'onDetailHideAnimationStart'
            },
            'searchfield': {
                action: 'onSearch'
            },
            'selectfield': {
                change: 'onSelectChange'
            },
            'button[iconCls=refresh]': {
                tap: 'onRefreshButtonTap'
            }
        }
    },

    init: function() {
        Ext.getStore('Loans').on({
            scope: this,

            beforeload: this.onBeforeStoreLoad,
            load: this.onStoreLoad
        });
    },

    onListTap: function(list, loan) {
        if (this.view) {
            this.view.destroy();
        }

        this.view = Ext.create('Kiva.view.Detail');

        var view = this.view;
        view.setLoan(loan);

        if (this.getProfile() == "phone") {
            view.setWidth(null);
            view.setHeight('85%');
            view.setTop(null);
            view.setLeft(0);
        }

        if (!view.getParent()) {
            Ext.Viewport.add(view);
        }

        view.show();
    },

    onSearch: function(field) {
        this.doFilter({
            q: field.getValue()
        });
    },

    onSelectChange: function(field) {
        var config = {};
        config[field.getName()] = field.getValue();
        this.doFilter(config);
    },

    onDetailHideAnimationStart: function() {
        this.getLoansList().deselectAll();
    },

    onRefreshButtonTap: function() {
        Ext.getStore('Loans').load();
    },

    onBeforeStoreLoad: function() {
        this.getRefreshButton().setDisabled(true);
    },

    onStoreLoad: function() {
        this.getRefreshButton().setDisabled(false);
    },

    /**
     * @private
     * Listener for the 'filter' event fired by the listView set up in the 'list' action. This simply
     * gets the form values that the user wants to filter on and tells the Store to filter using them.
     */
    doFilter: function(values) {
        var store = Ext.getStore('Loans'),
            filters = [];

        Ext.iterate(values, function(field, value) {
            filters.push(new Ext.util.Filter({
                property: field,
                value   : value
            }));
        });

        store.clearFilter();
        store.filter(filters);
    }
});
