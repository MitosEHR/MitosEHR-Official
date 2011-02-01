/*!
 * Extensible 1.0-rc1
 * Copyright(c) 2010-2011 Extensible, LLC
 * licensing@ext.ensible.com
 * http://ext.ensible.com
 */
/**
 * @class Ext.ensible
 * Extensible core utilities and functions.
 * @singleton
 */
(function(){
    
    Ext.ns('Ext.ensible.ux', 'Ext.ensible.sample', 'Ext.ensible.plugins', 'Ext.ensible.cal');
    
    Ext.apply(Ext.ensible, {
        /**
         * The version of the framework
         * @type String
         */
        version : '1.0-rc1',
        /**
         * The version of the framework, broken out into its numeric parts. This returns an
         * object that contains the following integer properties: major, minor and patch.
         * @type Object
         */
        versionDetails : {
            major: 1,
            minor: 0,
            patch: 0
        },
        
        hasBorderRadius : !(Ext.isIE || Ext.isOpera),
        
        log : function(s){
            //console.log(s);
        },
    
       /**
        * @class Ext.ensible.cal.Date
        * @extends Object
        * <p>Contains utility date functions used by the calendar components.</p>
        * @singleton
        */
	    Date : {
            /**
             * Determines whether times used throughout all Extensible components should be displayed as
             * 12 hour times with am/pm (default) or 24 hour / military format. Note that some locale files
             * may override this value by default.
             * @type Boolean
             * @property use24HourTime
             */
            use24HourTime : false,
            
            /**
             * Returns the time duration between two dates in the specified units. For finding the number
             * of calendar days (ignoring time) between two dates use {@link Ext.ensible.Date.diffDays diffDays} instead.
             * @param {Date} start The start date
             * @param {Date} end The end date
             * @param {String} unit (optional) The time unit to return. Valid values are 'ms' (milliseconds, the default), 's' (seconds),
             * 'm' (minutes) or 'h' (hours).
             * @return {Number} The time difference between the dates in the units specified by the unit param
             */
            diff : function(start, end, unit){
                var denom = 1,
                    diff = end.getTime() - start.getTime();
                
                if(unit == 's'){ 
                    denom = 1000;
                }
                else if(unit == 'm'){
                    denom = 1000*60;
                }
                else if(unit == 'h'){
                    denom = 1000*60*60;
                }
                return Math.round(diff/denom);
            },
            
            /**
             * Calculates the number of calendar days between two dates, ignoring time values. 
             * A time span that starts at 11pm (23:00) on Monday and ends at 1am (01:00) on Wednesday is 
             * only 26 total hours, but it spans 3 calendar days, so this function would return 3. For the
             * exact time difference, use {@link Ext.ensible.Date.diff diff} instead.
             * @param {Date} start The start date
             * @param {Date} end The end date
             * @return {Number} The number of calendar days difference between the dates
             */
            diffDays : function(start, end){
                day = 1000*60*60*24;
                diff = end.clearTime(true).getTime() - start.clearTime(true).getTime();
                return Math.ceil(diff/day);
            },
            
            /**
             * Copies the time value from one date object into another without altering the target's 
             * date value. This function returns a new Date instance without modifying either original value.
             * @param {Date} fromDt The original date from which to copy the time
             * @param {Date} toDt The target date to copy the time to
             * @return {Date} The new date/time value
             */
            copyTime : function(fromDt, toDt){
                var dt = toDt.clone();
                dt.setHours(
                    fromDt.getHours(),
                    fromDt.getMinutes(),
                    fromDt.getSeconds(),
                    fromDt.getMilliseconds());
                
                return dt;
            },
            
            /**
             * Compares two dates and returns a value indicating how they relate to each other.
             * @param {Date} dt1 The first date
             * @param {Date} dt2 The second date
             * @param {Boolean} precise (optional) If true, the milliseconds component is included in the comparison,
             * else it is ignored (the default).
             * @return {Number} The number of milliseconds difference between the two dates. If the dates are equal
             * this will be 0.  If the first date is earlier the return value will be positive, and if the second date
             * is earlier the value will be negative.
             */
            compare : function(dt1, dt2, precise){
                var d1 = dt1, d2 = dt2;
                if(precise !== true){
                    d1 = dt1.clone();
                    d1.setMilliseconds(0);
                    d2 = dt2.clone();
                    d2.setMilliseconds(0);
                }
                return d2.getTime() - d1.getTime();
            },

	        // private helper fn
	        maxOrMin : function(max){
	            var dt = (max ? 0 : Number.MAX_VALUE), i = 0, args = arguments[1], ln = args.length;
	            for(; i < ln; i++){
	                dt = Math[max ? 'max' : 'min'](dt, args[i].getTime());
	            }
	            return new Date(dt);
	        },
	        
            /**
             * Returns the maximum date value passed into the function. Any number of date 
             * objects can be passed as separate params.
             * @param {Date} dt1 The first date
             * @param {Date} dt2 The second date
             * @param {Date} dtN (optional) The Nth date, etc.
             * @return {Date} A new date instance with the latest date value that was passed to the function
             */
			max : function(){
	            return this.maxOrMin.apply(this, [true, arguments]);
	        },
	        
            /**
             * Returns the minimum date value passed into the function. Any number of date 
             * objects can be passed as separate params.
             * @param {Date} dt1 The first date
             * @param {Date} dt2 The second date
             * @param {Date} dtN (optional) The Nth date, etc.
             * @return {Date} A new date instance with the earliest date value that was passed to the function
             */
			min : function(){
	            return this.maxOrMin.apply(this, [false, arguments]);
	        },
            
            isInRange : function(dt, rangeStart, rangeEnd) {
                return  (dt >= rangeStart && dt <= rangeEnd);
            },
            
            /**
             * Returns true if two date ranges overlap (either one starts or ends within the other, or one completely
             * overlaps the start and end of the other), else false if they do not.
             * @param {Date} start1 The start date of range 1
             * @param {Date} end1   The end date of range 1
             * @param {Date} start2 The start date of range 2
             * @param {Date} end2   The end date of range 2
             * @return {Booelan} True if the ranges overlap, else false
             */
            rangesOverlap : function(start1, end1, start2, end2){
                var startsInRange = (start1 >= start2 && start1 <= end2),
                    endsInRange = (end1 >= start2 && end1 <= end2),
                    spansRange = (start1 <= start2 && end1 >= end2);
                
                return (startsInRange || endsInRange || spansRange);
            }
	    }
    });
})();
//TODO: remove this once we are synced to trunk again
Ext.override(Ext.XTemplate, {
    applySubTemplate : function(id, values, parent, xindex, xcount){
        var me = this,
            len,
            t = me.tpls[id],
            vs,
            buf = [];
        if ((t.test && !t.test.call(me, values, parent, xindex, xcount)) ||
            (t.exec && t.exec.call(me, values, parent, xindex, xcount))) {
            return '';
        }
        vs = t.target ? t.target.call(me, values, parent) : values;
        len = vs.length;
        parent = t.target ? values : parent;
        if(t.target && Ext.isArray(vs)){
            Ext.each(vs, function(v, i) {
                buf[buf.length] = t.compiled.call(me, v, parent, i+1, len);
            });
            return buf.join('');
        }
        return t.compiled.call(me, vs, parent, xindex, xcount);
    }
});


/* This fix is in Ext 3.2 */
Ext.override(Ext.form.DateField, {
	
	altFormats : "m/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d|n-j|n/j",
	
    safeParse : function(value, format) {
        if (/[gGhH]/.test(format.replace(/(\\.)/g, ''))) {
            // if parse format contains hour information, no DST adjustment is necessary
            return Date.parseDate(value, format);
        } else {
            // set time to 12 noon, then clear the time
            var parsedDate = Date.parseDate(value + ' ' + this.initTime, format + ' ' + this.initTimeFormat);
            if (parsedDate) return parsedDate.clearTime();
        }
    }
});


/* This override applies to the current 3.3.x line to fix duplicate remote actions */
Ext.override(Ext.data.Store, {
    add : function(records) {
        var i, record, index;
        
        records = [].concat(records);
        if (records.length < 1) {
            return;
        }
        
        for (i = 0, len = records.length; i < len; i++) {
            record = records[i];
            
            record.join(this);
            
            //Extensible: Added the modified.indexOf check to avoid adding duplicate recs
            if ((record.dirty || record.phantom) && this.modified.indexOf(record) == -1) {
                this.modified.push(record);
            }
        }
        
        index = this.data.length;
        this.data.addAll(records);
        
        if (this.snapshot) {
            this.snapshot.addAll(records);
        }
        
        this.fireEvent('add', this, records, index);
    },
    insert : function(index, records) {
        var i, record;
        
        records = [].concat(records);
        for (i = 0, len = records.length; i < len; i++) {
            record = records[i];
            
            this.data.insert(index + i, record);
            record.join(this);
            
            //Extensible: Added the modified.indexOf check to avoid adding duplicate recs
            if ((record.dirty || record.phantom) && this.modified.indexOf(record) == -1) {
                this.modified.push(record);
            }
        }
        
        if (this.snapshot) {
            this.snapshot.addAll(records);
        }
        
        this.fireEvent('add', this, records, index);
    },
    
    // Interestingly, this method has no changes, but is included here because without it a very strange
    // race condition occurs. This method is used as a callback internally for the add event which
    // is fired from the add method (overridden above). As long as both methods are here everything is OK
    // but with createRecords removed and defaulted to the original class you end up with duplicate copies
    // of added records in the store's modified collection (since both methods add to it). Not sure exactly
    // how that happens, but including this fixes it.
    createRecords : function(store, records, index) {
        var modified = this.modified,
            length   = records.length,
            record, i;
        
        for (i = 0; i < length; i++) {
            record = records[i];
            
            if (record.phantom && record.isValid()) {
                record.markDirty();  // <-- Mark new records dirty (Ed: why?)
                
                //Extensible: Added the modified.indexOf check to avoid adding duplicate recs
                if (modified.indexOf(record) == -1) {
                    modified.push(record);
                }
            }
        }
        if (this.autoSave === true) {
            this.save();
        }
    }
});


// Have to add in full API support so that EventMemoryProxy can do its thing.
// Won't hurt normal read-only MemoryProxy read actions.
Ext.data.MemoryProxy = function(data){
    var api = {};
    api[Ext.data.Api.actions.read] = true;
    api[Ext.data.Api.actions.create] = true;
    api[Ext.data.Api.actions.update] = true;
    api[Ext.data.Api.actions.destroy] = true;
    Ext.data.MemoryProxy.superclass.constructor.call(this, {
        api: api
    });
    this.data = data;
};

Ext.extend(Ext.data.MemoryProxy, Ext.data.DataProxy, {
    doRequest : function(action, rs, params, reader, callback, scope, arg) {
        if(action === Ext.data.Api.actions.read){
            params = params || {};
            var result;
            try {
                result = reader.readRecords(this.data);
            }catch(e){
                // @deprecated loadexception
                this.fireEvent("loadexception", this, null, arg, e);
                this.fireEvent('exception', this, 'response', action, arg, null, e);
                callback.call(scope, null, arg, false);
                return;
            }
            callback.call(scope, result, arg, true);
        }
    }
});
