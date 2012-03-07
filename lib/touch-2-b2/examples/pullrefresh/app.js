// This utility function takes a date and returns a representation in words.
var timeAgoInWords = function(date) {
    try {
        var now = Math.ceil(Number(new Date()) / 1000),
            dateTime = Math.ceil(Number(new Date(date)) / 1000),
            diff = now - dateTime,
            str;

        if (diff < 60) {
            return String(diff) + ' seconds ago';
        } else if (diff < 3600) {
            str = String(Math.ceil(diff / (60)));
            return str + (str == "1" ? ' minute' : ' minutes') + ' ago';
        } else if (diff < 86400) {
            str = String(Math.ceil(diff / (3600)));
            return str + (str == "1" ? ' hour' : ' hours') + ' ago';
        } else if (diff < 60 * 60 * 24 * 365) {
            str = String(Math.ceil(diff / (60 * 60 * 24)));
            return str + (str == "1" ? ' day' : ' days') + ' ago';
        } else {
            return Ext.Date.format(new Date(date), 'jS M \'y');
        }
    } catch (e) {
        return '';
    }
}

/**
 * This examples illustrates the 'List Paging' and 'Pull Refresh' plugins
 */
Ext.setup({
    requires: [
        'Ext.data.Store',
        'Ext.List'
    ],

    icon: 'icon.png',
    phoneStartupScreen:  'phone_startup.png',
    tabletStartupScreen: 'tablet_startup.png',

    onReady: function() {

        Ext.define('TweetStore', {
            extend: 'Ext.data.Store',

            config: {
                fields: ['from_user', 'profile_image_url', 'text', 'created_at'],

                pageSize: 5,
                autoLoad: true,

                proxy: {
                    type: 'jsonp',
                    url: 'http://search.twitter.com/search.json',

                    pageParam: 'page',
                    limitParam: 'rpp',

                    extraParams: {
                        q: 'sencha'
                    },

                    reader: {
                        type: 'json',
                        rootProperty: 'results'
                    }
                }
            }
        });

        Ext.define('TweetList', {
            extend: 'Ext.List',

            config: {
                store: Ext.create('TweetStore'),
                limit: 5,
                disableSelection: true,

                plugins: [
                    { xclass: 'Ext.plugin.ListPaging' },
                    { xclass: 'Ext.plugin.PullRefresh' }
                ],

                emptyText: '<p class="no-searches">No tweets found matching that search</p>',

                itemTpl: Ext.create('Ext.XTemplate',
                    '<img src="{profile_image_url}" />',
                    '<div class="tweet">',
                    '<span class="posted">{[this.posted(values.created_at)]}</span>',
                    '<h2>{from_user}</h2>',
                    '<p>{text}</p>',
                    '</div>',
                    {
                        posted: timeAgoInWords
                    }
                )
            }
        });

        if (Ext.os.is.Phone) {
            Ext.create('TweetList', {
                fullscreen: true
            });
        } else {
            Ext.Viewport.add({
                xclass: 'TweetList',
                width: 380,
                height: 420,
                centered: true,
                modal: true,
                hideOnMaskTap: false
            }).show();
        }
    }
});
