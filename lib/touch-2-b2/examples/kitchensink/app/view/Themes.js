Ext.define('Kitchensink.view.Themes', {
    extend: 'Ext.Container',
    config: {
        layout: Ext.os.deviceType == 'Phone' ? 'fit' : {
            type: 'vbox',
            align: 'center',
            pack: 'center'
        },
        cls: 'demo-list',
        items: [
            {
                width: Ext.os.deviceType == 'Phone' ? null : 300,
                height: Ext.os.deviceType == 'Phone' ? null : 500,
                xtype: 'list',
                id: 'theme-list',
                store: {
                    fields: ['id', 'name'],
                    data: [
                        { id: 'senchatouch', name: 'Sencha' },
                        { id: 'apple', name: 'Cupertino' },
                        { id: 'android', name: 'Mountain View' },
                        { id: 'blackberry', name: 'Toronto '}
                    ]
                },
                itemTpl: '<div class="contact"><strong>{name}</strong></div>'
            }
        ]
    },

    initialize: function() {
        var themeList = Ext.getCmp('theme-list');

        themeList.select(0);
        themeList.on('itemtap', this.onItemTap, this);

        this.currentIndex = 0;

        this.setActiveSheet('senchatouch');

        this.callParent();
    },

    onItemTap: function(view, index, event, record) {
        var me = this,
            recordData = view.getStore().getAt(index).data;

        if (this.currentIndex == index) {
            return false;
        }
        this.currentIndex = index;

        this.setActiveSheet(recordData.id);
    },

    setActiveSheet: function(id) {
        var me = this,
            stylesheets = this.getStylesheets();

        me.setMasked({
            xtype: 'loadmask',
            message: 'Loading'
        });

        stylesheets[id].removeAttribute('disabled');

        setTimeout(function() {
            stylesheets[id].removeAttribute('disabled');

            var interval = setInterval(function() {
                if (stylesheets[id].sheet && stylesheets[id].sheet.cssRules.length) {
                    clearInterval(interval);

                    var sheet;
                    for (sheet in stylesheets) {
                        if (sheet != id) {
                            stylesheets[sheet].setAttribute('disabled', true);
                        }
                    }

                    me.unmask();
                }
            }, 100);
        }, 100);
    },

    getStylesheets: function() {
        if (!this.stylesheets) {
            this.stylesheets = {
                senchatouch: document.getElementById('senchatouch'),
                android: document.getElementById('android'),
                apple: document.getElementById('apple'),
                blackberry: document.getElementById('blackberry')
            };
        }

        return this.stylesheets;
    }
});
