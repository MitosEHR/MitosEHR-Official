/**
 * @class Video
 * @extends Ext.data.Model
 * The Video model
 */
Ext.regModel("Video", {
    fields: [
        {name: "id",                       type: "int"},
        {name: "title",                    type: "string"},
        {name: "title",                    type: "string"},
        {name: "description",              type: "string"},
        {name: "url",                      type: "string"},
        {name: "upload_date",              type: "date"},
        {name: "mobile_url",               type: "string"},
        {name: "thumbnail_small",          type: "string"},
        {name: "thumbnail_medium",         type: "string"},
        {name: "thumbnail_large",          type: "string"},
        {name: "user_name",                type: "string"},
        {name: "user_url",                 type: "string"},
        {name: "user_portrait_small",      type: "string"},
        {name: "user_portrait_medium",     type: "string"},
        {name: "user_portrait_large",      type: "string"},
        {name: "user_portrait_huge",       type: "string"},
        {name: "stats_number_of_likes",    type: "int"},
        {name: "stats_number_of_plays",    type: "int"},
        {name: "stats_number_of_comments", type: "int"},
        {name: "duration",                 type: "int"},
        {name: "width",                    type: "int"},
        {name: "height",                   type: "int"},
        {name: "tags",                     type: "string"}
    ]
});
