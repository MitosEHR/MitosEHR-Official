/*!
 * Extensible 1.5.1
 * Copyright(c) 2010-2011 Extensible, LLC
 * licensing@ext.ensible.com
 * http://ext.ensible.com
 */
Ext.define('Extensible.example.calendar.data.Calendars', {
    constructor: function() {
        return {
            "calendars" : [{
                "id"    : 1,
                "title" : "Home",
                "color" : 2
            },{
                "id"    : 2,
                "title" : "Work",
                "color" : 22
            },{
                "id"    : 3,
                "title" : "School",
                "color" : 7
            },{
                "id"    : 4,
                "title" : "Sports",
                //"hidden" : true, // optionally init this calendar as hidden by default
                "color" : 26
            }]
        };
    }
});