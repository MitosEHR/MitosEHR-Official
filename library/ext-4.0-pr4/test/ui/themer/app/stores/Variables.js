Ext.regStore('Variables', {
    model: 'Variable',
    
    data: [
        //base
        {'variable': 'base-color'},
        {'variable': 'base-gradient', 'default': 'matte'},
        
        //panel
        {'variable': 'panel-base-color', 'default': 'lighten($base-color, 55)'},
        {'variable': 'panel-border-radius', 'default': '5px 5px 0 0'},
        {'variable': 'panel-border-color', 'default': 'darken($panel-base-color, 10)'}
    ]
});