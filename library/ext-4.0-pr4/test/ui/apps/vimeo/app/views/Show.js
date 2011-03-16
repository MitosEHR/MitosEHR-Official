/**
 * @class Vimeo.Show
 * @extends Ext.panel.Panel
 * Description
 */
Ext.define("Vimeo.Show", {
    extend: 'Ext.panel.Panel',
    alias: 'widget.videoshow',
    
    renderTpl: [
        '<div class="{baseCls}-wrap">',
            '<div class="{baseCls}-body<tpl if="bodyCls"> {bodyCls}</tpl>"<tpl if="bodyStyle"> style="{bodyStyle}"</tpl>>',
                '<h1>{video.title} by <a href="{video.user_url}" target="_blank">{video.user_name}</a></h1>',
                '<object width="{video.width}" height="{video.height}">',
                    '<param name="allowfullscreen" value="true" />',
                    '<param name="allowscriptaccess" value="always" />',
                    '<param name="movie" value="http://vimeo.com/moogaloop.swf?clip_id={video.id}&amp;server=vimeo.com&amp;show_title=1&amp;show_byline=1&amp;show_portrait=1&amp;color=00ADEF&amp;fullscreen=1&amp;autoplay=0&amp;loop=0" />',
                    '<embed src="http://vimeo.com/moogaloop.swf?clip_id={video.id}&amp;server=vimeo.com&amp;show_title=1&amp;show_byline=1&amp;show_portrait=1&amp;color=00ADEF&amp;fullscreen=1&amp;autoplay=0&amp;loop=0" ',
                    'type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="{video.width}" height="{video.height}"></embed>',
                '</object>',
                '<div class="description">',
                    '{video.description}',
                '</div>',
            '</div>',
        '</div>'
    ],
    
    initComponent: function() {
        Ext.applyIf(this, {
            renderData: {},
            
            dockedItems: [
                {
                    dock : 'left',
                    xtype: 'videoinfo',
                    width: 200,
                    video: this.video
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [
                        {
                            text: 'Back',
                            scope: this,
                            handler: function() {
                                this.fireEvent('showList'); 
                            }
                        }
                    ]
                }
            ]
        });
        
        Ext.applyIf(this.renderData, {
            video: this.video.data
        });
        
        Vimeo.Show.superclass.initComponent.apply(this, arguments);
    }
});
