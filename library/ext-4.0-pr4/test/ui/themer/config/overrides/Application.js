Ext.override(Ext.Application, {
    onReady: function() {
        if (this.useLoadMask) {
            this.initLoadMask();
        }
        
        this.onBeforeLaunch();

        return this;
    }
});