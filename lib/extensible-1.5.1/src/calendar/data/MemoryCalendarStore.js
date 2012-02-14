/*!
 * Extensible 1.5.1
 * Copyright(c) 2010-2011 Extensible, LLC
 * licensing@ext.ensible.com
 * http://ext.ensible.com
 */
/*
 * A simple reusable store that loads static calendar field definitions into memory
 * and can be bound to the CalendarCombo widget and used for calendar color selection.
 */
Ext.define('Extensible.calendar.data.MemoryCalendarStore', {
    extend: 'Ext.data.Store',
    model: 'Extensible.calendar.data.CalendarModel',
    
    requires: [
        'Ext.data.proxy.Memory',
        'Ext.data.reader.Json',
        'Ext.data.writer.Json',
        'Extensible.calendar.data.CalendarModel',
        'Extensible.calendar.data.CalendarMappings'
    ],
    
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'calendars'
        },
        writer: {
            type: 'json'
        }
    },

    autoLoad: true,
    
    initComponent: function() {
        this.sorters = this.sorters || [{
            property: Extensible.calendar.data.CalendarMappings.Title.name,
            direction: 'ASC'
        }];
        
        this.idProperty = this.idProperty || Extensible.calendar.data.CalendarMappings.CalendarId.name || 'id';
        
        this.fields = Extensible.calendar.data.CalendarModel.prototype.fields.getRange();
        
        this.callParent(arguments);
    }
});