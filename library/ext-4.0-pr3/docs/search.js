Ext.onReady(function() {    

    /**
     * Search box
     */

    var store = new Ext.data.JsonStore({
        baseParams: { q: '' },
        method: 'GET',
        proxy: new Ext.data.ScriptTagProxy({
            url: (req.standAloneMode ? req.liveURL : '') + req.baseDocURL + '/search',
            method: 'GET'
        }),
        root: 'rows',
        fields: [
            'id',
            'fields'
        ]
    });

    var tpl = new Ext.XTemplate(
        '<tpl for=".">',
            '<div class="item {[values.fields.memberType]}">',
                '<div class="title">{[values.fields.default]}</div>',
                '<div class="class">{id}</div>',
            '</div>',
        '</tpl>'
    );

    var panel = new Ext.DataView({
        store: store,
        tpl: tpl,
        id: 'quick-search',
        overClass:'x-view-over',
        itemSelector:'div.item',
        singleSelect: true,
        handleClick: function() {
            var curItem = panel.getSelectedIndexes()[0];
            var classId = panel.store.data.items[curItem].id;
            
            if (req.standAloneMode) {
        		if (window.location.href.match(/api/)) {
        			window.location = classId + '.html';
        		} else {
        			window.location = 'api/' + classId + '.html';
        		}
        		return;
        	}
        	
            var loc = req.baseDocURL + "/api/" + classId;
            if (panel.store.data.items[curItem].data.fields.memberType && panel.store.data.items[curItem].data.fields.default) {
                loc += '#' + panel.store.data.items[curItem].data.fields.memberType + '.' + panel.store.data.items[curItem].data.fields.default;
            }
            window.location = loc;
        },
        listeners: {
            click: function() {
                this.handleClick()
            }
        }
    });

    store.on('load', function() {
        panel.render('search-box');
    });

    /**
     * When a key is pressed in the search field, search for classes, methods, properties, configs, etc
     */
    Ext.get('search-field').on('keyup', function(ev, el) {

        // Esc key
        if (ev.keyCode == 27 || el.value == '') {
            panel.hide();
            return;
        }
        else {
            panel.show();
        }

        var curItem = panel.getSelectedIndexes()[0],
            lastItem = panel.store.data.length - 1;

        // Up arrow
        if (ev.keyCode == 38) {
            if (curItem == undefined) {
                panel.select(0);
            } else {
                panel.select(curItem == 0 ? lastItem : (curItem - 1));
            }
        }
        // Down arrow
        else if (ev.keyCode == 40) {
            if (curItem == undefined) {
                panel.select(0);
            } else {
                panel.select(curItem == lastItem ? 0 : curItem + 1);
            }
        }
        // Enter key
        else if (ev.keyCode == 13) {
            ev.preventDefault();
            if(curItem != undefined) {
                panel.handleClick();
            }
        }
        else {
            store.baseParams.q = Ext.get(el).getValue() + "*";
            store.load();
        }
    });

    Ext.get(Ext.get('search-field').dom.parentNode).on('submit', function(ev, el) {
        ev.preventDefault();
    });
})
