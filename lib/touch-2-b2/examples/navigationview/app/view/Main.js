Ext.define('AddressBook.view.Main', {
    extend: 'Ext.navigation.View',
    xtype: 'mainview',

    requires: [
        'AddressBook.view.Contacts',
        'AddressBook.view.contact.Show',
        'AddressBook.view.contact.Edit'
    ],

    config: {
        autoDestroy: false,

        navigationBar: {
            ui: 'sencha',
            items: [
                {
                    xtype: 'button',
                    id: 'editButton',
                    text: 'Edit',
                    align: 'right',
                    hidden: true
                },
                {
                    xtype: 'button',
                    id: 'saveButton',
                    text: 'Save',
                    ui: 'sencha',
                    align: 'right',
                    hidden: true
                }
            ]
        },

        items: [
            { xtype: 'contacts' }
        ]
    },

    applyLayout: function(config) {
        config = config || {};

        if (Ext.os.is.Android) {
            config.animation = false;
        }

        return config;
    }
});
