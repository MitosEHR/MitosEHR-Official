Ext.regController('compiler', {
    host: 'localhost',
    port: '4567',
    path: '',
    
    parameterKey: 'scss',
    
    iframe: null,
    
    compile: function(options) {
        var scss = options.args || '';
        
        //replace all ; with | so they can be passed via url
        scss = scss.replace(/;/g, '|');
        scss = scss.replace(/#/g, '=');
        scss = scss + "@import 'ext4/default/all'|";
        
        //get the url
        var url = this.getUrl(scss);
        
        //load the url in the iframe
        this.fetchThemeViewer(url);
    },
    
    /**
     * 
     */
    getUrl: function(str) {
        return Ext.String.format("http://{0}:{1}/{2}?{3}={4}", this.host, this.port, this.path, this.parameterKey, str);
    },
    
    /**
     * 
     */
    getiframe: function() {
        this.iframe = Ext.get('theme_iframe');
        return this.iframe;
    },
    
    /**
     * 
     */
    fetchThemeViewer: function(src) {
        if (!this.iframe) {
            this.getiframe();
        }
        
        this.iframe.dom.setAttribute('src', src);
    }
});
