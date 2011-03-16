/**
 * @class Vimeo.VideoInfo
 * @extends Ext.panel.Panel
 * Description
 */
Ext.define("Vimeo.VideoInfo", {
    extend: 'Ext.panel.Panel',
    alias: 'widget.videoinfo',
    
    title: 'Info',

    renderTpl: new Ext.XTemplate(
        '<div class="{baseCls}-wrap">',
            '<div class="{baseCls}-body<tpl if="bodyCls"> {bodyCls}</tpl>"<tpl if="bodyStyle"> style="{bodyStyle}"</tpl>>',
                '<dl>',
                    '<dt>By:</dt>',
                    '<dd><a href="{video.user_url}" target="_blank">{video.user_name}</a></dd>',
                    '<dt>Length:</dt>',
                    '<dd>{[this.duration(values.video.duration)]}</dd>',
                    '<dt>Likes:</dt>',
                    '<dd>{video.stats_number_of_likes}</dd>',
                    '<dt>Plays:</dt>',
                    '<dd>{video.stats_number_of_plays}</dd>',
                    '<dt>Added:</dt>',
                    '<dd>{video.upload_date:date("d/m/Y")}</dd>',
                '</dl>',
            '</div>',
        '</div>',
        {
            duration: function(duration) {
                var minutes = Math.floor(duration / 60),
                    seconds = duration - (60 * minutes);
                
                return minutes + ":" + seconds;
            }
        }
    ),
    
    initComponent: function() {
        Ext.applyIf(this, {
            renderData: {}
        });
        
        Ext.applyIf(this.renderData, {
            video: this.video.data
        });
        
        Vimeo.VideoInfo.superclass.initComponent.apply(this, arguments);
    }
});
