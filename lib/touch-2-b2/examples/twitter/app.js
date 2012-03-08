Ext.Loader.setPath({
    'Twitter': 'app'
});

Ext.application({
    name: 'Twitter',
    requires: ['Twitter.proxy.Twitter'],

    profiles: ['Phone', 'Tablet'],
    models: ['Search', 'Tweet'],
    stores: ['Searches']
});