Ext.define('Forum.Renderers', {
    statics: {
        topic : function(value, p, record){
            return String.format(
                    '<div class="topic"><b>{0}</b><span class="author">{1}</span></div>',
                    value, record.data.author, record.id, record.data.forumid);
        },
        lastPost : function(value, p, r){
            return String.format('<span class="post-date">{0}</span><br/>by {1}', value.dateFormat('M j, Y, g:i a'), r.data['lastposter']);
        }
    }
});