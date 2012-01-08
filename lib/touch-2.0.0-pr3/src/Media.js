/**
 * Provides a base class for audio/visual controls. Should not be used directly.
 */
Ext.define('Ext.Media', {
    extend: 'Ext.Component',
    xtype: 'media',

    config: {
        /**
         * @cfg {String} url
         * Location of the media to play.
         * @accessor
         */
        url: '',

        /**
         * @cfg {Boolean} enableControls
         * Set this to false to turn off the native media controls.
         * Defaults to false when you are on Android, as it doesnt support controls.
         * @accessor
         */
        enableControls: Ext.os.is.Android ? false : true,

        /**
         * @cfg {Boolean} autoResume
         * Will automatically start playing the media when the container is activated.
         * @accessor
         */
        autoResume: false,

        /**
         * @cfg {Boolean} autoPause
         * Will automatically pause the media when the container is deactivated.
         * @accessor
         */
        autoPause: true,

        /**
         * @cfg {Boolean} preload
         * Will begin preloading the media immediately.
         * @accessor
         */
        preload: true,

        /**
         * @cfg {Boolean} loop
         * Will loop the media forever.
         * @accessor
         */
        loop: false,

        /**
         * @cfg {Ext.Element} media
         * A reference to the underlying audio/video element.
         * @accessor
         */
        media: null,

        // @private
        playing: false
    },

    initialize: function() {
        var me = this;
        me.callParent();

        me.on({
            scope: me,

            activate  : me.onActivate,
            deactivate: me.onDeactivate
        });
    },

    /**
     * Returns if the media is currently playing
     * @return {Boolean} playing True if the media is playing
     */
    isPlaying: function() {
        return this.getPlaying();
    },

    // @private
    onActivate: function() {
        var me = this;

        if (me.getAutoResume() && !me.isPlaying()) {
            me.play();
        }
    },

    // @private
    onDeactivate: function() {
        var me = this;

        if (me.getAutoResume() && me.isPlaying()) {
            me.pause();
        }
    },

    /**
     * Sets the URL of the media element. If the media element already exists, it is update the src attribute of the
     * element. If it is currently playing, it will start the new video.
     */
    updateUrl: function(newUrl) {
        var dom = this.media.dom;

        //when changing the src, we must call load:
        //http://developer.apple.com/library/safari/#documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/ControllingMediaWithJavaScript/ControllingMediaWithJavaScript.html
        dom.src = newUrl;
        dom.load();

        if (this.getPlaying()) {
            this.play();
        }
    },

    /**
     * Updates the controls of the video element.
     */
    updateEnableControls: function(enableControls) {
        this.media.dom.controls = enableControls ? 'controls' : false;
    },

    /**
     * Updates the loop setting of the media element.
     */
    updateLoop: function(loop) {
        this.media.dom.loop = loop ? 'loop' : false;
    },

    /**
     * Starts or resumes media playback
     */
    play: function() {
        this.media.dom.play();
        this.setPlaying(true);
    },

    /**
     * Pauses media playback
     */
    pause: function() {
        this.media.dom.pause();
        this.setPlaying(false);
    },

    /**
     * Toggles the media playback state
     */
    toggle: function() {
        this.isPlaying() ? this.pause() : this.play();
    }
});
