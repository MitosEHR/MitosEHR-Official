/**
 * @class Ext.direct.JsonProvider
 * @extends Ext.direct.Provider
 */
Ext.define('Ext.direct.JsonProvider', {
    extend: 'Ext.direct.Provider',
    alias: 'directprovider.json',
    
    parseResponse: function(xhr){
        if(!Ext.isEmpty(xhr.responseText)){
            if(typeof xhr.responseText == 'object'){
                return xhr.responseText;
            }
            return Ext.decode(xhr.responseText);
        }
        return null;
    },

    getEvents: function(xhr){
        var data   = null,
            events = [];
        try {
            data = this.parseResponse(xhr);
        } catch(e) {
            var event = new Ext.direct.ExceptionEvent({
                data: e,
                xhr: xhr,
                code: Ext.Direct.exceptions.PARSE,
                message: 'Error parsing json response: \n\n ' + data
            });
            return [event];
        }

        if (Ext.isArray(data)) {
            for(var i = 0, len = data.length; i < len; i++){
                events.push(Ext.direct.Direct.createEvent(data[i]));
            }
        } else {
            events.push(Ext.direct.Direct.createEvent(data));
        }
        return events;
    }
});