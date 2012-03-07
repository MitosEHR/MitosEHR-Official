Ext.define('GeoCon.controller.SplashScreen', {
    extend: 'Ext.app.Controller',

    requires: ['Ext.util.GeoLocation'],

    config: {
        control: {
            '#selectState': {
                change: 'onStateChange'
            },
            '#lookupBtn': {
                tap: 'onLookupTap'
            },
            '#settingsBtn': {
                tap: 'onSettingsTap'
            }
        }
    },

    init: function() {
        this.location = Ext.create('Ext.util.GeoLocation', {
            autoUpdate: false,
            listeners: {
                locationupdate: 'onLocationUpdate',
                scope: this
            }
        });
        this.location.updateLocation();
    },

    onSettingsTap: function() {
        var splashScreen = Ext.getCmp('splashScreen');

        if (splashScreen.getActiveItem() == Ext.getCmp('settingsForm')) {
            splashScreen.setActiveItem(Ext.getCmp('legislatorList'));
        } else {
            splashScreen.setActiveItem(Ext.getCmp('settingsForm'));
        }
    },

    onLocationUpdate: function() {
        Ext.getStore('Districts').load({
            params: {
                latitude: this.location.getLatitude(),
                longitude: this.location.getLongitude()
            },
            callback: function(records) {
                var district = records && records[0];

                if (district) {

                    var store = Ext.getStore('States'),
                        idx = store.find('abbr', district.data.state),
                        state = store.getAt(idx);

                    this.currentDistrict = district.data.number;

                    if (state) {
                        this.currentState = state;
                        this.loadLegislators();
                        this.updateSettings();
                    }
                }
            },
            scope: this
        });
    },

    onStateChange: function(field, record) {
        if (record) {
            this.currentState = record;
        }
        if (Ext.getCmp('districtSpinner')) {
            this.updateDistrict();
        }
    },

    onLookupTap: function() {
        this.currentDistrict = Ext.getCmp('districtSpinner').getValue();
        this.loadLegislators();
        this.onSettingsTap();
    },

    updateSettings: function() {
        Ext.getCmp('selectState').setValue(this.currentState.data.abbr);
        this.updateDistrict();
    },

    updateDistrict: function() {
        Ext.getCmp('districtSpinner').setMaxValue(this.currentState.data.maxDistrict);
        Ext.getCmp('districtSpinner').setValue(this.currentDistrict || 0);
    },

    /**
     * Retrieves a list of Legislators for the given state and district. First loads
     * the Legislators for the state and district, then then Senators for the whole state.
     */
    loadLegislators: function() {

        var title = this.currentState.data.abbr + ' District ' + this.currentDistrict,
            store = Ext.getStore('Legislators'),
            splashToolbar = Ext.getCmp('splashToolbar');

        // If the current legislators are already loaded, don't re-load
        if (splashToolbar.getTitle() == title) {
            return;
        }

        splashToolbar.setTitle(title);

        // First look up the Representative, then the senators for the state.
        // The current API doesn't support this in a single query
        store.load({
            params: {
                state: this.currentState.data.abbr,
                district: this.currentDistrict
            },
            callback: function() {
                store.load({
                    params: {
                        state: this.currentState.data.abbr,
                        title: 'Sen'
                    },
                    addRecords: true
                });
            },
            scope: this
        });
    }

});
