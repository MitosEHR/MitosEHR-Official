/*!
 * Extensible 1.0-alpha1
 * Copyright(c) 2010 ThinkFirst, LLC
 * team@ext.ensible.com
 * http://ext.ensible.com
 */
/**
 * @class Ext.ensible
 * Extensible core utilities and functions.
 * @singleton
 */
(function(){
    
    Ext.ns('Ext.ensible.ux','Ext.ensible.cal');
    
    Ext.apply(Ext.ensible, {
    
        version : '1.0-alpha-1',
        
        hasBorderRadius : !(Ext.isIE || Ext.isOpera),
    
       /**
        * @class Ext.ensible.cal.Date
        * @extends Object
        * <p>Contains utility date functions used by the calendar components.</p>
        * @singleton
        */
	    Date : {
            /**
             * Calculates the number of days between two dates, ignoring time values.
             * @param {Date} start The start date
             * @param {Date} end The end date
             * @return {Number} The number of days difference between the dates
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
/**
 * @class Ext.ensible.cal.DayHeaderTemplate
 * @extends Ext.XTemplate
 * <p>This is the template used to render the all-day event container used in {@link Ext.ensible.cal.DayView DayView} and 
 * {@link Ext.ensible.cal.WeekView WeekView}. Internally the majority of the layout logic is deferred to an instance of
 * {@link Ext.ensible.cal.BoxLayoutTemplate}.</p> 
 * <p>This template is automatically bound to the underlying event store by the 
 * calendar components and expects records of type {@link Ext.ensible.cal.EventRecord}.</p>
 * <p>Note that this template would not normally be used directly. Instead you would use the {@link Ext.ensible.cal.DayViewTemplate}
 * that internally creates an instance of this template along with a {@link Ext.ensible.cal.DayBodyTemplate}.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.ensible.cal.DayHeaderTemplate = function(config){
    
    Ext.apply(this, config);
    
    this.allDayTpl = new Ext.ensible.cal.BoxLayoutTemplate(config);
    this.allDayTpl.compile();
    
    Ext.ensible.cal.DayHeaderTemplate.superclass.constructor.call(this,
        '<div class="ext-cal-hd-ct">',
            '<table class="ext-cal-hd-days-tbl" cellspacing="0" cellpadding="0">',
                '<tbody>',
                    '<tr>',
                        '<td class="ext-cal-gutter"></td>',
                        '<td class="ext-cal-hd-days-td"><div class="ext-cal-hd-ad-inner">{allDayTpl}</div></td>',
                        '<td class="ext-cal-gutter-rt"></td>',
                    '</tr>',
                '</tobdy>',
            '</table>',
        '</div>'
    );
};

Ext.extend(Ext.ensible.cal.DayHeaderTemplate, Ext.XTemplate, {
    applyTemplate : function(o){
        return Ext.ensible.cal.DayHeaderTemplate.superclass.applyTemplate.call(this, {
            allDayTpl: this.allDayTpl.apply(o)
        });
    }
});

Ext.ensible.cal.DayHeaderTemplate.prototype.apply = Ext.ensible.cal.DayHeaderTemplate.prototype.applyTemplate;
/**
 * @class Ext.ensible.cal.DayBodyTemplate
 * @extends Ext.XTemplate
 * <p>This is the template used to render the scrolling body container used in {@link Ext.ensible.cal.DayView DayView} and 
 * {@link Ext.ensible.cal.WeekView WeekView}. This template is automatically bound to the underlying event store by the 
 * calendar components and expects records of type {@link Ext.ensible.cal.EventRecord}.</p>
 * <p>Note that this template would not normally be used directly. Instead you would use the {@link Ext.ensible.cal.DayViewTemplate}
 * that internally creates an instance of this template along with a {@link Ext.ensible.cal.DayHeaderTemplate}.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.ensible.cal.DayBodyTemplate = function(config){
    
    Ext.apply(this, config);
    
    Ext.ensible.cal.DayBodyTemplate.superclass.constructor.call(this,
        '<table class="ext-cal-bg-tbl" cellspacing="0" cellpadding="0">',
            '<tbody>',
                '<tr height="1">',
                    '<td class="ext-cal-gutter"></td>',
                    '<td colspan="{dayCount}">',
                        '<div class="ext-cal-bg-rows">',
                            '<div class="ext-cal-bg-rows-inner">',
                                '<tpl for="times">',
                                    '<div class="ext-cal-bg-row">',
                                        '<div class="ext-cal-bg-row-div ext-row-{[xindex]}"></div>',
                                    '</div>',
                                '</tpl>',
                            '</div>',
                        '</div>',
                    '</td>',
                '</tr>',
                '<tr>',
                    '<td class="ext-cal-day-times">',
                        '<tpl for="times">',
                            '<div class="ext-cal-bg-row">',
                                '<div class="ext-cal-day-time-inner">{.}</div>',
                            '</div>',
                        '</tpl>',
                    '</td>',
                    '<tpl for="days">',
                        '<td class="ext-cal-day-col">',
                            '<div class="ext-cal-day-col-inner">',
                                '<div id="{[this.id]}-day-col-{.:date("Ymd")}" class="ext-cal-day-col-gutter"></div>',
                            '</div>',
                        '</td>',
                    '</tpl>',
                '</tr>',
            '</tbody>',
        '</table>'
    );
};

Ext.extend(Ext.ensible.cal.DayBodyTemplate, Ext.XTemplate, {
    // private
    applyTemplate : function(o){
        this.today = new Date().clearTime();
        this.dayCount = this.dayCount || 1;
        
        var i = 0, days = [],
            dt = o.viewStart.clone();
            
        for(; i<this.dayCount; i++){
            days[i] = dt.add(Date.DAY, i);
        }

        var times = [], dt = new Date().clearTime();
        for(i=0; i<24; i++){
            times.push(dt.format('ga'));
            dt = dt.add(Date.HOUR, 1);
        }
        
        return Ext.ensible.cal.DayBodyTemplate.superclass.applyTemplate.call(this, {
            days: days,
            dayCount: days.length,
            times: times
        });
    }
});

Ext.ensible.cal.DayBodyTemplate.prototype.apply = Ext.ensible.cal.DayBodyTemplate.prototype.applyTemplate;
/**
 * @class Ext.ensible.cal.BoxLayoutTemplate
 * @extends Ext.XTemplate
 * <p>This is the template used to render calendar views based on small day boxes within a non-scrolling container (currently
 * the {@link Ext.ensible.cal.MonthView MonthView} and the all-day headers for {@link Ext.ensible.cal.DayView DayView} and 
 * {@link Ext.ensible.cal.WeekView WeekView}. This template is automatically bound to the underlying event store by the 
 * calendar components and expects records of type {@link Ext.ensible.cal.EventRecord}.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.ensible.cal.BoxLayoutTemplate = function(config){
    
    Ext.apply(this, config);
    
    var weekLinkTpl = this.showWeekLinks ? '<div id="{weekLinkId}" class="ext-cal-week-link">{weekNum}</div>' : '';
    
    Ext.ensible.cal.BoxLayoutTemplate.superclass.constructor.call(this,
        '<tpl for="weeks">',
            '<div id="{[this.id]}-wk-{[xindex-1]}" class="ext-cal-wk-ct" style="top:{[this.getRowTop(xindex, xcount)]}%; height:{[this.getRowHeight(xcount)]}%;">',
                weekLinkTpl,
                '<table class="ext-cal-bg-tbl" cellpadding="0" cellspacing="0">',
                    '<tbody>',
                        '<tr>',
                            '<tpl for=".">',
                                 '<td id="{[this.id]}-day-{date:date("Ymd")}" class="{cellCls}">&nbsp;</td>',
                            '</tpl>',
                        '</tr>',
                    '</tbody>',
                '</table>',
                '<table class="ext-cal-evt-tbl" cellpadding="0" cellspacing="0">',
                    '<tbody>',
                        '<tr>',
                            '<tpl for=".">',
                                '<td id="{[this.id]}-ev-day-{date:date("Ymd")}" class="{titleCls}"><div>{title}</div></td>',
                            '</tpl>',
                        '</tr>',
                    '</tbody>',
                '</table>',
            '</div>',
        '</tpl>', {
            getRowTop: function(i, ln){
                return ((i-1)*(100/ln));
            },
            getRowHeight: function(ln){
                return 100/ln;
            }
        }
    );
};

Ext.extend(Ext.ensible.cal.BoxLayoutTemplate, Ext.XTemplate, {
    // private
    applyTemplate : function(o){
        
        Ext.apply(this, o);
        
        var w = 0, title = '', first = true, isToday = false, showMonth = false, prevMonth = false, nextMonth = false,
            weeks = [[]],
            today = new Date().clearTime(),
            dt = this.viewStart.clone(),
            thisMonth = this.startDate.getMonth();
        
        for(; w < this.weekCount || this.weekCount == -1; w++){
            if(dt > this.viewEnd){
                break;
            }
            weeks[w] = [];
            
            for(var d = 0; d < this.dayCount; d++){
                isToday = dt.getTime() === today.getTime();
                showMonth = first || (dt.getDate() == 1);
                prevMonth = (dt.getMonth() < thisMonth) && this.weekCount == -1;
                nextMonth = (dt.getMonth() > thisMonth) && this.weekCount == -1;
                
                if(dt.getDay() == 1){
                    // The ISO week format 'W' is relative to a Monday week start. If we
                    // make this check on Sunday the week number will be off.
                    weeks[w].weekNum = this.showWeekNumbers ? dt.format('W') : '&nbsp;';
                    weeks[w].weekLinkId = 'ext-cal-week-'+dt.format('Ymd');
                }
                
                if(showMonth){
                    if(isToday){
                        title = this.getTodayText();
                    }
                    else{
                        title = dt.format(this.dayCount == 1 ? 'l, F j, Y' : (first ? 'M j, Y' : 'M j'));
                    }
                }
                else{
                    var dayFmt = (w == 0 && this.showHeader !== true) ? 'D j' : 'j';
                    title = isToday ? this.getTodayText() : dt.format(dayFmt);
                }
                
                weeks[w].push({
                    title: title,
                    date: dt.clone(),
                    titleCls: 'ext-cal-dtitle ' + (isToday ? ' ext-cal-dtitle-today' : '') + 
                        (w==0 ? ' ext-cal-dtitle-first' : '') +
                        (prevMonth ? ' ext-cal-dtitle-prev' : '') + 
                        (nextMonth ? ' ext-cal-dtitle-next' : ''),
                    cellCls: 'ext-cal-day ' + (isToday ? ' ext-cal-day-today' : '') + 
                        (d==0 ? ' ext-cal-day-first' : '') +
                        (prevMonth ? ' ext-cal-day-prev' : '') +
                        (nextMonth ? ' ext-cal-day-next' : '')
                });
                dt = dt.add(Date.DAY, 1);
                first = false;
            }
        }
        
        return Ext.ensible.cal.BoxLayoutTemplate.superclass.applyTemplate.call(this, {
            weeks: weeks
        });
    },
    
    // private
    getTodayText : function(){
        var dt = new Date().format('l, F j, Y'),
            todayText = this.showTodayText !== false ? this.todayText : '',
            timeText = this.showTime !== false ? ' <span id="'+this.id+'-clock" class="ext-cal-dtitle-time">' + 
                    new Date().format('g:i a') + '</span>' : '',
            separator = todayText.length > 0 || timeText.length > 0 ? ' &mdash; ' : '';
        
        if(this.dayCount == 1){
            return dt + separator + todayText + timeText;
        }
        fmt = this.weekCount == 1 ? 'D j' : 'j';
        return todayText.length > 0 ? todayText + timeText : new Date().format(fmt) + timeText;
    }
});

Ext.ensible.cal.BoxLayoutTemplate.prototype.apply = Ext.ensible.cal.BoxLayoutTemplate.prototype.applyTemplate;
/**
 * @class Ext.ensible.cal.MonthViewTemplate
 * @extends Ext.XTemplate
 * <p>This is the template used to render the {@link Ext.ensible.cal.MonthView MonthView}. Internally this class defers to an
 * instance of {@link Ext.calerndar.BoxLayoutTemplate} to handle the inner layout rendering and adds containing elements around
 * that to form the month view.</p> 
 * <p>This template is automatically bound to the underlying event store by the 
 * calendar components and expects records of type {@link Ext.ensible.cal.EventRecord}.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.ensible.cal.MonthViewTemplate = function(config){
    
    Ext.apply(this, config);
    
    this.weekTpl = new Ext.ensible.cal.BoxLayoutTemplate(config);
    this.weekTpl.compile();
    
    var weekLinkTpl = this.showWeekLinks ? '<div class="ext-cal-week-link-hd">&nbsp;</div>' : '';
    
    Ext.ensible.cal.MonthViewTemplate.superclass.constructor.call(this,
	    '<div class="ext-cal-inner-ct {extraClasses}">',
            '<div class="ext-cal-hd-ct ext-cal-month-hd">',
                weekLinkTpl,
		        '<table class="ext-cal-hd-days-tbl" cellpadding="0" cellspacing="0">',
		            '<tbody>',
                        '<tr>',
                            '<tpl for="days">',
		                        '<th class="ext-cal-hd-day{[xindex==1 ? " ext-cal-day-first" : ""]}" title="{.:date("l, F j, Y")}">{.:date("D")}</th>',
		                    '</tpl>',
                        '</tr>',
		            '</tbody>',
		        '</table>',
            '</div>',
	        '<div class="ext-cal-body-ct">{weeks}</div>',
        '</div>'
    );
};

Ext.extend(Ext.ensible.cal.MonthViewTemplate, Ext.XTemplate, {
    // private
    applyTemplate : function(o){
        var days = [],
            weeks = this.weekTpl.apply(o),
            dt = o.viewStart;
        
        for(var i = 0; i < 7; i++){
            days.push(dt.add(Date.DAY, i));
        }
        
        var extraClasses = this.showHeader === true ? '' : 'ext-cal-noheader';
        if(this.showWeekLinks){
            extraClasses += ' ext-cal-week-links';
        }
        
        return Ext.ensible.cal.MonthViewTemplate.superclass.applyTemplate.call(this, {
            days: days,
            weeks: weeks,
            extraClasses: extraClasses 
        });
    }
});

Ext.ensible.cal.MonthViewTemplate.prototype.apply = Ext.ensible.cal.MonthViewTemplate.prototype.applyTemplate;
/**
 * @class Ext.dd.ScrollManager
 * <p>Provides automatic scrolling of overflow regions in the page during drag operations.</p>
 * <p>The ScrollManager configs will be used as the defaults for any scroll container registered with it,
 * but you can also override most of the configs per scroll container by adding a 
 * <tt>ddScrollConfig</tt> object to the target element that contains these properties: {@link #hthresh},
 * {@link #vthresh}, {@link #increment} and {@link #frequency}.  Example usage:
 * <pre><code>
var el = Ext.get('scroll-ct');
el.ddScrollConfig = {
    vthresh: 50,
    hthresh: -1,
    frequency: 100,
    increment: 200
};
Ext.dd.ScrollManager.register(el);
</code></pre>
 * <b>Note: This class uses "Point Mode" and is untested in "Intersect Mode".</b>
 * @singleton
 */
Ext.dd.ScrollManager = function(){
    var ddm = Ext.dd.DragDropMgr;
    var els = {};
    var dragEl = null;
    var proc = {};
    
    var onStop = function(e){
        dragEl = null;
        clearProc();
    };
    
    var triggerRefresh = function(){
        if(ddm.dragCurrent){
             ddm.refreshCache(ddm.dragCurrent.groups);
        }
    };
    
    var doScroll = function(){
        if(ddm.dragCurrent){
            var dds = Ext.dd.ScrollManager;
            var inc = proc.el.ddScrollConfig ?
                      proc.el.ddScrollConfig.increment : dds.increment;
            if(!dds.animate){
                if(proc.el.scroll(proc.dir, inc)){
                    triggerRefresh();
                }
            }else{
                proc.el.scroll(proc.dir, inc, true, dds.animDuration, triggerRefresh);
            }
        }
    };
    
    var clearProc = function(){
        if(proc.id){
            clearInterval(proc.id);
        }
        proc.id = 0;
        proc.el = null;
        proc.dir = "";
    };
    
    var startProc = function(el, dir){
        clearProc();
        proc.el = el;
        proc.dir = dir;
        var freq = (el.ddScrollConfig && el.ddScrollConfig.frequency) ? 
                el.ddScrollConfig.frequency : Ext.dd.ScrollManager.frequency,
            group = el.ddScrollConfig ? el.ddScrollConfig.ddGroup : undefined;
        
        if(group === undefined || ddm.dragCurrent.ddGroup == group){
            proc.id = setInterval(doScroll, freq);
        }
    };
    
    var onFire = function(e, isDrop){
        if(isDrop || !ddm.dragCurrent){ return; }
        var dds = Ext.dd.ScrollManager;
        if(!dragEl || dragEl != ddm.dragCurrent){
            dragEl = ddm.dragCurrent;
            // refresh regions on drag start
            dds.refreshCache();
        }
        
        var xy = Ext.lib.Event.getXY(e);
        var pt = new Ext.lib.Point(xy[0], xy[1]);
        for(var id in els){
            var el = els[id], r = el._region;
            var c = el.ddScrollConfig ? el.ddScrollConfig : dds;
            if(r && r.contains(pt) && el.isScrollable()){
                if(r.bottom - pt.y <= c.vthresh){
                    if(proc.el != el){
                        startProc(el, "down");
                    }
                    return;
                }else if(r.right - pt.x <= c.hthresh){
                    if(proc.el != el){
                        startProc(el, "left");
                    }
                    return;
                }else if(pt.y - r.top <= c.vthresh){
                    if(proc.el != el){
                        startProc(el, "up");
                    }
                    return;
                }else if(pt.x - r.left <= c.hthresh){
                    if(proc.el != el){
                        startProc(el, "right");
                    }
                    return;
                }
            }
        }
        clearProc();
    };
    
    ddm.fireEvents = ddm.fireEvents.createSequence(onFire, ddm);
    ddm.stopDrag = ddm.stopDrag.createSequence(onStop, ddm);
    
    return {
        /**
         * Registers new overflow element(s) to auto scroll
         * @param {Mixed/Array} el The id of or the element to be scrolled or an array of either
         */
        register : function(el){
            if(Ext.isArray(el)){
                for(var i = 0, len = el.length; i < len; i++) {
                    this.register(el[i]);
                }
            }else{
                el = Ext.get(el);
                els[el.id] = el;
            }
        },
        
        /**
         * Unregisters overflow element(s) so they are no longer scrolled
         * @param {Mixed/Array} el The id of or the element to be removed or an array of either
         */
        unregister : function(el){
            if(Ext.isArray(el)){
                for(var i = 0, len = el.length; i < len; i++) {
                    this.unregister(el[i]);
                }
            }else{
                el = Ext.get(el);
                delete els[el.id];
            }
        },
        
        /**
         * The number of pixels from the top or bottom edge of a container the pointer needs to be to
         * trigger scrolling (defaults to 25)
         * @type Number
         */
        vthresh : 25,
        /**
         * The number of pixels from the right or left edge of a container the pointer needs to be to
         * trigger scrolling (defaults to 25)
         * @type Number
         */
        hthresh : 25,

        /**
         * The number of pixels to scroll in each scroll increment (defaults to 50)
         * @type Number
         */
        increment : 100,
        
        /**
         * The frequency of scrolls in milliseconds (defaults to 500)
         * @type Number
         */
        frequency : 500,
        
        /**
         * True to animate the scroll (defaults to true)
         * @type Boolean
         */
        animate: true,
        
        /**
         * The animation duration in seconds - 
         * MUST BE less than Ext.dd.ScrollManager.frequency! (defaults to .4)
         * @type Number
         */
        animDuration: .4,
        
        /**
         * Manually trigger a cache refresh.
         */
        refreshCache : function(){
            for(var id in els){
                if(typeof els[id] == 'object'){ // for people extending the object prototype
                    els[id]._region = els[id].getRegion();
                }
            }
        }
    };
}();/*
 * @class Ext.ensible.cal.StatusProxy
 * A specialized drag proxy that supports a drop status icon, {@link Ext.Layer} styles and auto-repair. It also
 * contains a calendar-specific drag status message containing details about the dragged event's target drop date range.  
 * This is the default drag proxy used by all calendar views.
 * @constructor
 * @param {Object} config
 */
Ext.ensible.cal.StatusProxy = function(config){
    Ext.apply(this, config);
    this.id = this.id || Ext.id();
    this.el = new Ext.Layer({
        dh: {
            id: this.id, cls: 'ext-dd-drag-proxy x-dd-drag-proxy '+this.dropNotAllowed, cn: [
                {cls: 'x-dd-drop-icon'},
                {cls: 'ext-dd-ghost-ct', cn:[
                    {cls: 'x-dd-drag-ghost'},
                    {cls: 'ext-dd-msg'}
                ]}
            ]
        }, 
        shadow: !config || config.shadow !== false
    });
    this.ghost = Ext.get(this.el.dom.childNodes[1].childNodes[0]);
    this.message = Ext.get(this.el.dom.childNodes[1].childNodes[1]);
    this.dropStatus = this.dropNotAllowed;
};

Ext.extend(Ext.ensible.cal.StatusProxy, Ext.dd.StatusProxy, {
    /**
     * @cfg {String} moveEventCls
     * The CSS class to apply to the status element when an event is being dragged (defaults to 'ext-cal-dd-move').
     */
    moveEventCls : 'ext-cal-dd-move',
    /**
     * @cfg {String} addEventCls
     * The CSS class to apply to the status element when drop is not allowed (defaults to 'ext-cal-dd-add').
     */
    addEventCls : 'ext-cal-dd-add',

    // inherit docs
    update : function(html){
        if(typeof html == 'string'){
            this.ghost.update(html);
        }else{
            this.ghost.update('');
            html.style.margin = '0';
            this.ghost.dom.appendChild(html);
        }
        var el = this.ghost.dom.firstChild;
        if(el){
            Ext.fly(el).setStyle('float', 'none').setHeight('auto');
            Ext.getDom(el).id += '-ddproxy';
        }
    },
    
    /**
     * Update the calendar-specific drag status message without altering the ghost element.
     * @param {String} msg The new status message
     */
    updateMsg : function(msg){
        this.message.update(msg);
    }
});/*
 * Internal drag zone implementation for the calendar components. This provides base functionality
 * and is primarily for the month view -- DayViewDD adds day/week view-specific functionality.
 */
Ext.ensible.cal.DragZone = Ext.extend(Ext.dd.DragZone, {
    ddGroup : 'CalendarDD',
    eventSelector : '.ext-cal-evt',
    
    constructor : function(el, config){
        if(!Ext.ensible.cal._statusProxyInstance){
            Ext.ensible.cal._statusProxyInstance = new Ext.ensible.cal.StatusProxy();
        }
        this.proxy = Ext.ensible.cal._statusProxyInstance;
        Ext.ensible.cal.DragZone.superclass.constructor.call(this, el, config);
    },
    
    getDragData : function(e){
        // Check whether we are dragging on an event first
        var t = e.getTarget(this.eventSelector, 3);
        if(t){
            var rec = this.view.getEventRecordFromEl(t);
            return {
                type: 'eventdrag',
                ddel: t,
                eventStart: rec.data[Ext.ensible.cal.EventMappings.StartDate.name],
                eventEnd: rec.data[Ext.ensible.cal.EventMappings.EndDate.name],
                proxy: this.proxy
            };
        }
        
        // If not dragging an event then we are dragging on 
        // the calendar to add a new event
        t = this.view.getDayAt(e.getPageX(), e.getPageY());
        if(t.el){
            return {
                type: 'caldrag',
                start: t.date,
                proxy: this.proxy
            };
        }
        return null;
    },
    
    onInitDrag : function(x, y){
        if(this.dragData.ddel){
            var ghost = this.dragData.ddel.cloneNode(true),
                child = Ext.fly(ghost).child('dl');
            
            Ext.fly(ghost).setWidth('auto');
            
            if(child){
                // for IE/Opera
                child.setHeight('auto');
            }
            this.proxy.update(ghost);
            this.onStartDrag(x, y);
        }
        else if(this.dragData.start){
            this.onStartDrag(x, y);
        }
        this.view.onInitDrag();
        return true;
    },
    
    afterRepair : function(){
        if(Ext.enableFx && this.dragData.ddel){
            Ext.Element.fly(this.dragData.ddel).highlight(this.hlColor || 'c3daf9');
        }
        this.dragging = false;
    },
    
    getRepairXY : function(e){
        if(this.dragData.ddel){
            return Ext.Element.fly(this.dragData.ddel).getXY();
        }
    },
    
    afterInvalidDrop : function(e, id){
        Ext.select('.ext-dd-shim').hide();
    }
});

/*
 * Internal drop zone implementation for the calendar components. This provides base functionality
 * and is primarily for the month view -- DayViewDD adds day/week view-specific functionality.
 */
Ext.ensible.cal.DropZone = Ext.extend(Ext.dd.DropZone, {
    ddGroup : 'CalendarDD',
    eventSelector : '.ext-cal-evt',
    
    // private
    shims : [],
    
    getTargetFromEvent : function(e){
        var dragOffset = this.dragOffset || 0,
            y = e.getPageY() - dragOffset,
            d = this.view.getDayAt(e.getPageX(), y);
        
        return d.el ? d : null;
    },
    
    onNodeOver : function(n, dd, e, data){
        var D = Ext.ensible.Date,
            start = data.type == 'eventdrag' ? n.date : D.min(data.start, n.date),
            end = data.type == 'eventdrag' ? n.date.add(Date.DAY, D.diffDays(data.eventStart, data.eventEnd)) : 
                D.max(data.start, n.date);
        
        if(!this.dragStartDate || !this.dragEndDate || (D.diffDays(start, this.dragStartDate) != 0) || (D.diffDays(end, this.dragEndDate) != 0)){
            this.dragStartDate = start;
            this.dragEndDate = end.clearTime().add(Date.DAY, 1).add(Date.MILLI, -1);
            this.shim(start, end);
            
            var range = start.format('n/j');
            if(D.diffDays(start, end) > 0){
                range += '-'+end.format('n/j');
            }
            var msg = String.format(data.type == 'eventdrag' ? this.moveText : this.createText, range);
            data.proxy.updateMsg(msg);
        }
        return this.dropAllowed;
    },
    
    shim : function(start, end){
        this.currWeek = -1;
        var dt = start.clone(),
            i = 0, shim, box,
            cnt = Ext.ensible.Date.diffDays(dt, end)+1
        
        Ext.each(this.shims, function(shim){
            if(shim){
                shim.isActive = false;
            }
        });
        
        while(i++ < cnt){
            var dayEl = this.view.getDayEl(dt);
            
            // if the date is not in the current view ignore it (this
            // can happen when an event is dragged to the end of the
            // month so that it ends outside the view)
            if(dayEl){
                var wk = this.view.getWeekIndex(dt),
                    shim = this.shims[wk];
            
                if(!shim){
                    shim = this.createShim();
                    this.shims[wk] = shim;
                }
                if(wk != this.currWeek){
                    shim.boxInfo = dayEl.getBox();
                    this.currWeek = wk;
                }
                else{
                    box = dayEl.getBox();
                    shim.boxInfo.right = box.right;
                    shim.boxInfo.width = box.right - shim.boxInfo.x;
                }
                shim.isActive = true;
            }
            dt = dt.add(Date.DAY, 1);
        }
        
        Ext.each(this.shims, function(shim){
            if(shim){
                if(shim.isActive){
                    shim.show();
                    shim.setBox(shim.boxInfo);
                }
                else if(shim.isVisible()){
                    shim.hide();
                }
            }
        });
    },
    
    createShim : function(){
        if(!this.shimCt){
            this.shimCt = Ext.get('ext-dd-shim-ct');
            if(!this.shimCt){
                this.shimCt = document.createElement('div');
                this.shimCt.id = 'ext-dd-shim-ct';
                Ext.getBody().appendChild(this.shimCt);
            }
        }
        var el = document.createElement('div');
        el.className = 'ext-dd-shim';
        this.shimCt.appendChild(el);
        
        return new Ext.Layer({
            shadow:false, 
            useDisplay:true, 
            constrain:false
        }, el);
    },
    
    clearShims : function(){
        Ext.each(this.shims, function(shim){
            if(shim){
                shim.hide();
            }
        });
    },
    
    onContainerOver : function(dd, e, data){
        return this.dropAllowed;
    },
    
    onCalendarDragComplete : function(){
        delete this.dragStartDate;
        delete this.dragEndDate;
        this.clearShims();
    },
    
    onNodeDrop : function(n, dd, e, data){
        if(n && data){
            if(data.type == 'eventdrag'){
                var rec = this.view.getEventRecordFromEl(data.ddel),
                    dt = Ext.ensible.Date.copyTime(rec.data[Ext.ensible.cal.EventMappings.StartDate.name], n.date);
                    
                this.view.onEventDrop(rec, dt);
                this.onCalendarDragComplete();
                return true;
            }
            if(data.type == 'caldrag'){
                this.view.onCalendarEndDrag(this.dragStartDate, this.dragEndDate, 
                    this.onCalendarDragComplete.createDelegate(this));
                //shims are NOT cleared here -- they stay visible until the handling
                //code calls the onCalendarDragComplete callback which hides them.
                return true;
            }
        }
        this.onCalendarDragComplete();
        return false;
    },
    
    onContainerDrop : function(dd, e, data){
        this.onCalendarDragComplete();
        return false;
    },
    
    destroy: function(){
        Ext.ensible.cal.DropZone.superclass.destroy.call(this);
        Ext.destroy(this.shimCt);
    }
});

/*
 * Internal drag zone implementation for the calendar day and week views.
 */
Ext.ensible.cal.DayViewDragZone = Ext.extend(Ext.ensible.cal.DragZone, {
    ddGroup : 'DayViewDD',
    resizeSelector : '.ext-evt-rsz',
    
    getDragData : function(e){
        var t = e.getTarget(this.resizeSelector, 2, true);
        if(t){
            var p = t.parent(this.eventSelector), 
                rec = this.view.getEventRecordFromEl(p);
            
            return {
                type: 'eventresize',
                ddel: p.dom,
                eventStart: rec.data[Ext.ensible.cal.EventMappings.StartDate.name],
                eventEnd: rec.data[Ext.ensible.cal.EventMappings.EndDate.name],
                proxy: this.proxy
            };
        }
        var t = e.getTarget(this.eventSelector, 3);
        if(t){
            var rec = this.view.getEventRecordFromEl(t);
            return {
                type: 'eventdrag',
                ddel: t,
                eventStart: rec.data[Ext.ensible.cal.EventMappings.StartDate.name],
                eventEnd: rec.data[Ext.ensible.cal.EventMappings.EndDate.name],
                proxy: this.proxy
            };
        }
        
        // If not dragging/resizing an event then we are dragging on 
        // the calendar to add a new event
        t = this.view.getDayAt(e.getPageX(), e.getPageY());
        if(t.el){
            return {
                type: 'caldrag',
                dayInfo: t,
                proxy: this.proxy
            };
        }
        return null;
    }
});

/*
 * Internal drop zone implementation for the calendar day and week views.
 */
Ext.ensible.cal.DayViewDropZone = Ext.extend(Ext.ensible.cal.DropZone, {
    ddGroup : 'DayViewDD',
    
    onNodeOver : function(n, dd, e, data){
        var dt, text = this.createText;
        if(data.type == 'caldrag'){
            if(!this.dragStartMarker){
                // Since the container can scroll, this gets a little tricky.
                // There is no el in the DOM that we can measure by default since
                // the box is simply calculated from the original drag start (as opposed
                // to dragging or resizing the event where the orig event box is present).
                // To work around this we add a placeholder el into the DOM and give it
                // the original starting time's box so that we can grab its updated
                // box measurements as the underlying container scrolls up or down.
                // This placeholder is removed in onNodeDrop.
                this.dragStartMarker = n.el.parent().createChild({
                    style: 'position:absolute;'
                });
                this.dragStartMarker.setBox(n.timeBox);
                this.dragCreateDt = n.date;
            }
            var endDt, box = this.dragStartMarker.getBox();
            box.height = Math.ceil(Math.abs(e.xy[1] - box.y) / n.timeBox.height) * n.timeBox.height;
            
            if(e.xy[1] < box.y){
                box.height += n.timeBox.height;
                box.y = box.y - box.height + n.timeBox.height;
                endDt = this.dragCreateDt.add(Date.MINUTE, 30);
            }
            else{
                n.date = n.date.add(Date.MINUTE, 30);
            }
            this.shim(this.dragCreateDt, box);
            
            var curr = Ext.ensible.Date.copyTime(n.date, this.dragCreateDt);
            this.dragStartDate = Ext.ensible.Date.min(this.dragCreateDt, curr);
            this.dragEndDate = endDt || Ext.ensible.Date.max(this.dragCreateDt, curr);
                
            dt = this.dragStartDate.format('g:ia-') + this.dragEndDate.format('g:ia');
        }
        else{
            var evtEl = Ext.get(data.ddel),
                dayCol = evtEl.parent().parent(),
                box = evtEl.getBox();
            
            box.width = dayCol.getWidth();
            
            if(data.type == 'eventdrag'){
                if(this.dragOffset === undefined){
                    this.dragOffset = n.timeBox.y-box.y;
                    box.y = n.timeBox.y-this.dragOffset;
                }
                else{
                    box.y = n.timeBox.y;
                }
                dt = n.date.format('n/j g:ia');
                box.x = n.el.getLeft();
                
                this.shim(n.date, box);
                text = this.moveText;
            }
            if(data.type == 'eventresize'){
                if(!this.resizeDt){
                    this.resizeDt = n.date;
                }
                box.x = dayCol.getLeft();
                box.height = Math.ceil(Math.abs(e.xy[1] - box.y) / n.timeBox.height) * n.timeBox.height;
                if(e.xy[1] < box.y){
                    box.y -= box.height;
                }
                else{
                    n.date = n.date.add(Date.MINUTE, 30);
                }
                this.shim(this.resizeDt, box);
                
                var curr = Ext.ensible.Date.copyTime(n.date, this.resizeDt),
                    start = Ext.ensible.Date.min(data.eventStart, curr),
                    end = Ext.ensible.Date.max(data.eventStart, curr);
                    
                data.resizeDates = {
                    StartDate: start,
                    EndDate: end
                }
                dt = start.format('g:ia-') + end.format('g:ia');
                text = this.resizeText;
            }
        }
        
        data.proxy.updateMsg(String.format(text, dt));
        return this.dropAllowed;
    },
    
    shim : function(dt, box){
        Ext.each(this.shims, function(shim){
            if(shim){
                shim.isActive = false;
                shim.hide();
            }
        });
        
        var shim = this.shims[0];
        if(!shim){
            shim = this.createShim();
            this.shims[0] = shim;
        }
        
        shim.isActive = true;
        shim.show();
        shim.setBox(box);
    },
    
    onNodeDrop : function(n, dd, e, data){
        if(n && data){
            if(data.type == 'eventdrag'){
                var rec = this.view.getEventRecordFromEl(data.ddel);
                this.view.onEventDrop(rec, n.date);
                this.onCalendarDragComplete();
                delete this.dragOffset;
                return true;
            }
            if(data.type == 'eventresize'){
                var rec = this.view.getEventRecordFromEl(data.ddel);
                this.view.onEventResize(rec, data.resizeDates);
                this.onCalendarDragComplete();
                delete this.resizeDt;
                return true;
            }
            if(data.type == 'caldrag'){
                Ext.destroy(this.dragStartMarker);
                delete this.dragStartMarker;
                delete this.dragCreateDt;
                this.view.onCalendarEndDrag(this.dragStartDate, this.dragEndDate, 
                    this.onCalendarDragComplete.createDelegate(this));
                //shims are NOT cleared here -- they stay visible until the handling
                //code calls the onCalendarDragComplete callback which hides them.
                return true;
            }
        }
        this.onCalendarDragComplete();
        return false;
    }
});
/**
 * @class Ext.ensible.cal.EventMappings
 * @extends Object
 * A simple object that provides the field definitions for EventRecords so that they can be easily overridden.
 */
Ext.ensible.cal.EventMappings = {
    EventId: {name: 'EventId', mapping:'id', type:'int'},
    CalendarId: {name:'CalendarId', mapping: 'cid', type: 'int'},
    Title: {name:'Title', mapping: 'title', type: 'string'},
    StartDate: {name:'StartDate', mapping: 'start', type: 'date', dateFormat: 'c'},
    EndDate: {name:'EndDate', mapping: 'end', type: 'date', dateFormat: 'c'},
    Location: {name:'Location', mapping: 'loc', type: 'string'},
    Notes: {name:'Notes', mapping: 'notes', type: 'string'},
    Url: {name:'Url', mapping: 'url', type: 'string'},
    IsAllDay: {name:'IsAllDay', mapping: 'ad', type: 'boolean'},
    Reminder: {name:'Reminder', mapping: 'rem', type: 'string'},
    IsNew: {name:'IsNew', mapping: 'n', type: 'boolean'}
};

/**
 * @class Ext.ensible.cal.EventRecord
 * @extends Ext.data.Record
 * <p>This is the {@link Ext.data.Record Record} specification for calendar event data used by the
 * {@link Ext.ensible.cal.CalendarPanel CalendarPanel}'s underlying store. It can be overridden as 
 * necessary to customize the fields supported by events, although the existing column names should
 * not be altered. If your model fields are named differently you should update the <b>mapping</b>
 * configs accordingly.</p>
 * <p>The only required fields when creating a new event record instance are StartDate and
 * EndDate.  All other fields are either optional are will be defaulted if blank.</p>
 * <p>Here is a basic example for how to create a new record of this type:<pre><code>
rec = new Ext.ensible.cal.EventRecord({
    StartDate: '2101-01-12 12:00:00',
    EndDate: '2101-01-12 13:30:00',
    Title: 'My cool event',
    Notes: 'Some notes'
});
</code></pre>
 * If you have overridden any of the record's data mappings via the Ext.ensible.cal.EventMappings object
 * you may need to set the values using this alternate syntax to ensure that the fields match up correctly:<pre><code>
var M = Ext.ensible.cal.EventMappings;

rec = new Ext.ensible.cal.EventRecord();
rec.data[M.StartDate.name] = '2101-01-12 12:00:00';
rec.data[M.EndDate.name] = '2101-01-12 13:30:00';
rec.data[M.Title.name] = 'My cool event';
rec.data[M.Notes.name] = 'Some notes';
</code></pre>
 * @constructor
 * @param {Object} data (Optional) An object, the properties of which provide values for the new Record's
 * fields. If not specified the {@link Ext.data.Field#defaultValue defaultValue}
 * for each field will be assigned.
 * @param {Object} id (Optional) The id of the Record. The id is used by the
 * {@link Ext.data.Store} object which owns the Record to index its collection
 * of Records (therefore this id should be unique within each store). If an
 * id is not specified a {@link #phantom}
 * Record will be created with an {@link #Record.id automatically generated id}.
 */
(function(){
    var M = Ext.ensible.cal.EventMappings;
    
    Ext.ensible.cal.EventRecord = Ext.data.Record.create([
        M.EventId,
        M.CalendarId,
        M.Title,
        M.StartDate,
        M.EndDate,
        M.Location,
        M.Notes,
        M.Url,
        M.IsAllDay,
        M.Reminder,
        M.IsNew
    ]);

    /**
     * Reconfigures the default record definition based on the current Ext.ensible.cal.EventMappings object
     */
    Ext.ensible.cal.EventRecord.reconfigure = function(){
        Ext.ensible.cal.EventRecord = Ext.data.Record.create([
            M.EventId,
            M.CalendarId,
            M.Title,
            M.StartDate,
            M.EndDate,
            M.Location,
            M.Notes,
            M.Url,
            M.IsAllDay,
            M.Reminder,
            M.IsNew
        ]);
    };
})();
/*
 * This is an internal helper class for the calendar views and should not be overridden.
 * It is responsible for the base event rendering logic underlying all of the calendar views.
 */
Ext.ensible.cal.WeekEventRenderer = function(){
    
    var getEventRow = function(id, week, index){
        var indexOffset = 1; //skip row with date #'s
        var evtRow, wkRow = Ext.get(id+'-wk-'+week);
        if(wkRow){
            var table = wkRow.child('.ext-cal-evt-tbl', true);
            evtRow = table.tBodies[0].childNodes[index+indexOffset];
            if(!evtRow){
                evtRow = Ext.DomHelper.append(table.tBodies[0], '<tr></tr>');
            }
        }
        return Ext.get(evtRow);
    };
    
    return {
        render: function(o){
            var w = 0, grid = o.eventGrid, 
                dt = o.viewStart.clone(),
                eventTpl = o.tpl,
                max = o.maxEventsPerDay != undefined ? o.maxEventsPerDay : 999,
                weekCount = o.weekCount < 1 ? 6 : o.weekCount,
                dayCount = o.weekCount == 1 ? o.dayCount : 7;
            
            for(; w < weekCount; w++){
                if(!grid[w] || grid[w].length == 0){
                    // no events or span cells for the entire week
                    if(weekCount == 1){
                        row = getEventRow(o.id, w, 0);
                        var cellCfg = {
                            tag: 'td',
                            cls: 'ext-cal-ev',
                            id: o.id+'-empty-0-day-'+dt.format('Ymd'),
                            html: '&nbsp;'
                        }
                        if(dayCount > 1){
                            cellCfg.colspan = dayCount;
                        }
                        Ext.DomHelper.append(row, cellCfg);
                    }
                    dt = dt.add(Date.DAY, 7);
                }else{
                    var row, d = 0, wk = grid[w];
                    var startOfWeek = dt.clone();
                    var endOfWeek = startOfWeek.add(Date.DAY, dayCount).add(Date.MILLI, -1);
                    
                    for(; d < dayCount; d++){
                        if(wk[d]){
                            var ev = emptyCells = skipped = 0, 
                                day = wk[d], ct = day.length, evt;
                            
                            for(; ev < ct; ev++){
                                if(!day[ev]){
                                    emptyCells++;
                                    continue;
                                }
                                if(emptyCells > 0 && ev-emptyCells < max){
                                    row = getEventRow(o.id, w, ev-emptyCells);
                                    var cellCfg = {
                                        tag: 'td',
                                        cls: 'ext-cal-ev',
                                        id: o.id+'-empty-'+ct+'-day-'+dt.format('Ymd')
                                    }
                                    if(emptyCells > 1 && max-ev > emptyCells){
                                        cellCfg.rowspan = Math.min(emptyCells, max-ev);
                                    }
                                    Ext.DomHelper.append(row, cellCfg);
                                    emptyCells = 0;
                                }
                                
                                if(ev >= max){
                                    skipped++;
                                    continue;
                                }
                                evt = day[ev];
                                
                                if(!evt.isSpan || evt.isSpanStart){ //skip non-starting span cells
                                    var item = evt.data || evt.event.data;
                                    item._weekIndex = w;
                                    item._renderAsAllDay = item[Ext.ensible.cal.EventMappings.IsAllDay.name] || evt.isSpanStart;
                                    item.spanLeft = item[Ext.ensible.cal.EventMappings.StartDate.name].getTime() < startOfWeek.getTime();
                                    item.spanRight = item[Ext.ensible.cal.EventMappings.EndDate.name].getTime() > endOfWeek.getTime();
                                    item.spanCls = (item.spanLeft ? (item.spanRight ? 'ext-cal-ev-spanboth' : 
                                        'ext-cal-ev-spanleft') : (item.spanRight ? 'ext-cal-ev-spanright' : ''));
                                            
                                    var row = getEventRow(o.id, w, ev),
                                        cellCfg = {
                                            tag: 'td',
                                            cls: 'ext-cal-ev',
                                            cn : eventTpl.apply(o.templateDataFn(item))
                                        },
                                        diff = Ext.ensible.Date.diffDays(dt, item[Ext.ensible.cal.EventMappings.EndDate.name]) + 1,
                                        cspan = Math.min(diff, dayCount-d);
                                        
                                    if(cspan > 1){
                                        cellCfg.colspan = cspan;
                                    }
                                    Ext.DomHelper.append(row, cellCfg);
                                }
                            }
                            if(ev > max){
                                row = getEventRow(o.id, w, max);
                                Ext.DomHelper.append(row, {
                                    tag: 'td',
                                    cls: 'ext-cal-ev-more',
                                    id: 'ext-cal-ev-more-'+dt.format('Ymd'),
                                    cn: {
                                        tag: 'a',
                                        html: '+'+skipped+' more...'
                                    }
                                });
                            }
                            if(ct < o.evtMaxCount[w]){
                                row = getEventRow(o.id, w, ct);
                                if(row){
                                    var cellCfg = {
                                        tag: 'td',
                                        cls: 'ext-cal-ev',
                                        id: o.id+'-empty-'+(ct+1)+'-day-'+dt.format('Ymd')
                                    };
                                    var rowspan = o.evtMaxCount[w] - ct;
                                    if(rowspan > 1){
                                        cellCfg.rowspan = rowspan;
                                    }
                                    Ext.DomHelper.append(row, cellCfg);
                                }
                            }
                        }else{
                            row = getEventRow(o.id, w, 0);
                            if(row){
                                var cellCfg = {
                                    tag: 'td',
                                    cls: 'ext-cal-ev',
                                    id: o.id+'-empty-day-'+dt.format('Ymd')
                                };
                                if(o.evtMaxCount[w] > 1){
                                    cellCfg.rowSpan = o.evtMaxCount[w];
                                }
                                Ext.DomHelper.append(row, cellCfg);
                            }
                        }
                        dt = dt.add(Date.DAY, 1);
                    }
                }
            }
        }
    };
}();
/**
 * @class Ext.ensible.cal.CalendarPicker
 * @extends Ext.form.ComboBox
 * <p>A custom combo used for choosing from the list of available calendars to assign an event to.</p>
 * <p>This is pretty much a standard combo that is simply pre-configured for the options needed by the
 * calendar components. The default configs are as follows:<pre><code>
    fieldLabel: 'Calendar',
    valueField: 'CalendarId',
    displayField: 'Title',
    triggerAction: 'all',
    mode: 'local',
    forceSelection: true,
    width: 200
</code></pre>
 * @constructor
 * @param {Object} config The config object
 */
Ext.ensible.cal.CalendarPicker = Ext.extend(Ext.form.ComboBox, {
    fieldLabel: 'Calendar',
    valueField: 'CalendarId',
    displayField: 'Title',
    triggerAction: 'all',
    mode: 'local',
    forceSelection: true,
    width: 200,
    
    // private
    initComponent: function(){
        Ext.ensible.cal.CalendarPicker.superclass.initComponent.call(this);
        this.tpl = this.tpl ||
              '<tpl for="."><div class="x-combo-list-item ext-color-{' + this.valueField +
              '}"><div class="ext-cal-picker-icon">&nbsp;</div>{' + this.displayField + '}</div></tpl>';
    },
    
    // private
    afterRender: function(){
        Ext.ensible.cal.CalendarPicker.superclass.afterRender.call(this);
        
        this.wrap = this.el.up('.x-form-field-wrap');
        this.wrap.addClass('ext-calendar-picker');
        
        this.icon = Ext.DomHelper.append(this.wrap, {
            tag: 'div', cls: 'ext-cal-picker-icon ext-cal-picker-mainicon'
        });
    },
    
    // inherited docs
    setValue: function(value) {
        this.wrap.removeClass('ext-color-'+this.getValue());
        if(!value && this.store !== undefined){
            // always default to a valid calendar
            value = this.store.getAt(0).data.CalendarId;
        }
        Ext.ensible.cal.CalendarPicker.superclass.setValue.call(this, value);
        this.wrap.addClass('ext-color-'+value);
    }
});

Ext.reg('calendarpicker', Ext.ensible.cal.CalendarPicker);
Ext.ensible.cal.RecurrenceCombo = Ext.extend(Ext.form.ComboBox, {
    width: 160,
    fieldLabel: 'Repeats',
    mode: 'local',
    triggerAction: 'all',
    forceSelection: true,
    displayField: 'pattern',
    valueField: 'id',
    
    recurrenceText: {
        none: 'Does not repeat',
        daily: 'Daily',
        weekly: 'Weekly',
        monthly: 'Monthly',
        yearly: 'Yearly'
    },
    
    initComponent: function(){
        Ext.ensible.cal.RecurrenceCombo.superclass.initComponent.call(this);
        
        this.addEvents('recurrencechange');
        
        this.store = this.store || new Ext.data.ArrayStore({
            fields: ['id', 'pattern'],
            idIndex: 0,
            data: [
                ['NONE', this.recurrenceText.none],
                ['DAILY', this.recurrenceText.daily],
                ['WEEKLY', this.recurrenceText.weekly],
                ['MONTHLY', this.recurrenceText.monthly],
                ['YEARLY', this.recurrenceText.yearly]
            ]
        });
    },
    
    initValue : function(){
        Ext.ensible.cal.RecurrenceCombo.superclass.initValue.call(this);
        if(this.value != undefined){
            this.fireEvent('recurrencechange', this.value);
        }
    },
    
    setValue : function(v){
        var old = this.value;
        Ext.ensible.cal.RecurrenceCombo.superclass.setValue.call(this, v);
        if(old != v){
            this.fireEvent('recurrencechange', v);
        }
        return this;
    }
});

Ext.reg('extensible.recurrencecombo', Ext.ensible.cal.RecurrenceCombo);

// http://www.kanzaki.com/docs/ical/rrule.html

Ext.ensible.cal.RecurrenceField = Ext.extend(Ext.form.Field, {
    
    fieldLabel: 'Repeats',
    startDate: new Date().clearTime(),
    enableFx: true,
    
    initComponent : function(){
        Ext.ensible.cal.RecurrenceField.superclass.initComponent.call(this);
        if(!this.height){
            this.autoHeight = true;
        }
    },
    
    onRender: function(ct, position){
        if(!this.el){
            this.frequencyCombo = new Ext.ensible.cal.RecurrenceCombo({
                id: this.id+'-frequency',
                listeners: {
                    'recurrencechange': {
                        fn: this.showOptions,
                        scope: this
                    }
                }
            });
            if(this.fieldLabel){
                this.frequencyCombo.fieldLabel = this.fieldLabel;
            }
            
            this.innerCt = new Ext.Container({
                cls: 'extensible-recur-inner-ct',
                items: []
            });
            this.fieldCt = new Ext.Container({
                autoEl: {id:this.id}, //make sure the container el has the field's id
                cls: 'extensible-recur-ct',
                renderTo: ct,
                items: [this.frequencyCombo, this.innerCt]
            });
            
            this.fieldCt.ownerCt = this;
            this.innerCt.ownerCt = this.fieldCt;
            this.el = this.fieldCt.getEl();
            this.items = new Ext.util.MixedCollection();
            this.items.addAll(this.initSubComponents());
        }
        Ext.ensible.cal.RecurrenceField.superclass.onRender.call(this, ct, position);
    },
    
//    afterRender : function(){
//        Ext.ensible.cal.RecurrenceField.superclass.afterRender.call(this);
//        this.setStartDate(this.startDate);
//    },
    
    // private
    initValue : function(){
        this.setStartDate(this.startDate);
        
        if(this.value !== undefined){
            this.setValue(this.value);
        }
        else if(this.frequency !== undefined){
            this.setValue('FREQ='+this.frequency);
        }
        else{
            this.setValue('NONE');
        }
        this.originalValue = this.getValue();
    },
    
    showOptions : function(o){
        var layoutChanged = false, unit = 'day';
        
        if(o != 'NONE'){
            this.hideSubPanels();
        }
        this.frequency = o;
        
        switch(o){
            case 'DAILY':
                layoutChanged = this.showSubPanel(this.repeatEvery);
                layoutChanged |= this.showSubPanel(this.until);
                break;
                
            case 'WEEKLY':
                layoutChanged = this.showSubPanel(this.repeatEvery);
                layoutChanged |= this.showSubPanel(this.weekly);
                layoutChanged |= this.showSubPanel(this.until);
                unit = 'week';
                break;
                
            case 'MONTHLY':
                layoutChanged = this.showSubPanel(this.repeatEvery);
                layoutChanged |= this.showSubPanel(this.monthly);
                layoutChanged |= this.showSubPanel(this.until);
                unit = 'month';
                break;
                
            case 'YEARLY':
                layoutChanged = this.showSubPanel(this.repeatEvery);
                layoutChanged |= this.showSubPanel(this.yearly);
                layoutChanged |= this.showSubPanel(this.until);
                unit = 'year';
                break;
            
            default:
                // case NONE
                this.hideInnerCt();
                return; 
        }
        
        if(layoutChanged){
            this.innerCt.doLayout();
        }
        
        this.showInnerCt();
        this.repeatEvery.updateLabel(unit);
    },
    
    showSubPanel : function(p){
        if (p.rendered) {
            p.show();
            return false;
        }
        else{
            if(this.repeatEvery.rendered){
                // make sure weekly/monthly options show in the middle
                p = this.innerCt.insert(1, p);
            }
            else{
                p = this.innerCt.add(p);
            }
            p.show();
            return true;
        }
    },
    
    showInnerCt: function(){
        if(!this.innerCt.isVisible()){
            if(this.enableFx && Ext.enableFx){
                this.innerCt.getPositionEl().slideIn('t', {
                    duration: .3
                });
            }
            else{
                this.innerCt.show();
            }
        }
    },
    
    hideInnerCt: function(){
        if(this.innerCt.isVisible()){
            if(this.enableFx && Ext.enableFx){
                this.innerCt.getPositionEl().slideOut('t', {
                    duration: .3,
                    easing: 'easeIn',
                    callback: this.hideSubPanels,
                    scope: this
                });
            }
            else{
                this.innerCt.hide();
                this.hideSubPanels();
            }
        }
    },
    
    setStartDate : function(dt){
        this.items.each(function(p){
            p.setStartDate(dt);
        });
    },
    
    getValue : function(){
        if(!this.rendered) {
            return this.value;
        }
        if(this.frequency=='NONE'){
            return '';
        }
        var value = 'FREQ='+this.frequency;
        this.items.each(function(p){
            if(p.isVisible()){
                value += p.getValue();
            }
        });
        return value;
    },
    
    setValue : function(v){
        this.value = v;
        
        if(v == null || v == '' || v == 'NONE'){
            this.frequencyCombo.setValue('NONE');
            this.showOptions('NONE');
            return this;
        }
        var parts = v.split(';');
        this.items.each(function(p){
            p.setValue(parts);
        });
        Ext.each(parts, function(p){
            if(p.indexOf('FREQ') > -1){
                var freq = p.split('=')[1];
                this.frequencyCombo.setValue(freq);
                this.showOptions(freq);
                return;
            }
        }, this);
        
        return this;
    },
    
    hideSubPanels : function(){
        this.items.each(function(p){
            p.hide();
        });
    },
    
    initSubComponents : function(){
        var baseComponent = Ext.extend(Ext.Container, {
            fieldLabel: ' ',
            labelSeparator: '',
            layout: 'table',
            anchor: '100%',
            startDate: this.startDate,

            //TODO: This is not I18N-able:
            getSuffix : function(n){
                if(!Ext.isNumber(n)){
                    return '';
                }
                switch (n) {
                    case 1:
                    case 21:
                    case 31:
                        return "st";
                    case 2:
                    case 22:
                        return "nd";
                    case 3:
                    case 23:
                        return "rd";
                    default:
                        return "th";
                }
            },
            
            //shared by monthly and yearly components:
            initNthCombo: function(cbo){
                var cbo = Ext.getCmp(this.id+'-combo'),
                    dt = this.startDate,
                    store = cbo.getStore(),
                    last = dt.getLastDateOfMonth().getDate(),
                    dayNum = dt.getDate(),
                    nthDate = dt.format('jS') + ' day',
                    isYearly = this.id.indexOf('-yearly') > -1,
                    yearlyText = ' in ' + dt.format('F'),
                    nthDayNum, nthDay, lastDay, lastDate, idx, data, s;
                    
                nthDayNum = Math.ceil(dayNum / 7);
                nthDay = nthDayNum + this.getSuffix(nthDayNum) + dt.format(' l');
                if(isYearly){
                    nthDate += yearlyText;
                    nthDay += yearlyText;
                }
                data = [[nthDate],[nthDay]];
                
                s = isYearly ? yearlyText : '';
                if(last-dayNum < 7){
                    data.push(['last '+dt.format('l')+s]);
                }
                if(last == dayNum){
                    data.push(['last day'+s]);
                }
                
                idx = store.find('field1', cbo.getValue());
                store.removeAll();
                cbo.clearValue();
                store.loadData(data);
                
                if(idx > data.length-1){
                    idx = data.length-1;
                }
                cbo.setValue(store.getAt(idx > -1 ? idx : 0).data.field1);
                return this;
            },
            setValue:Ext.emptyFn
        });
        
        this.repeatEvery = new baseComponent({
            id: this.id+'-every',
            layoutConfig: {
                columns: 3
            },
            items: [{
                xtype: 'label',
                text: 'Repeat every'
            },{
                xtype: 'numberfield',
                id: this.id+'-every-num',
                value: 1,
                width: 35,
                minValue: 1,
                maxValue: 99,
                allowBlank: false,
                enableKeyEvents: true,
                listeners: {
                    'keyup': {
                        fn: function(){
                            this.repeatEvery.updateLabel();
                        },
                        scope: this
                    }
                }
            },{
                xtype: 'label',
                id: this.id+'-every-label'
            }],
            setStartDate: function(dt){
                this.startDate = dt;
                this.updateLabel();
                return this;
            },
            getValue: function(){
                var v = Ext.getCmp(this.id+'-num').getValue();
                return v > 1 ? ';INTERVAL='+v : '';
            },
            setValue : function(v){
                var set = false, 
                    parts = Ext.isArray(v) ? v : v.split(';');
                
                Ext.each(parts, function(p){
                    if(p.indexOf('INTERVAL') > -1){
                        var interval = p.split('=')[1];
                        Ext.getCmp(this.id+'-num').setValue(interval);
                    }
                }, this);
                return this;
            },
            updateLabel: function(type){
                if(this.rendered){
                    var s = Ext.getCmp(this.id+'-num').getValue() == 1 ? '' : 's';
                    if(type){
                        this.type = type.toLowerCase();
                    }
                    Ext.getCmp(this.id+'-label').update(this.type + s + ' beginning ' + this.startDate.format('l, F j'));
                }
                return this;
            }
        });
            
        this.weekly = new baseComponent({
            id: this.id+'-weekly',
            layoutConfig: {
                columns: 2
            },
            items: [{
                xtype: 'label',
                text: 'on:'
            },{
                xtype: 'checkboxgroup',
                id: this.id+'-weekly-days',
                items: [
                    {boxLabel: 'Sun', name: 'SU', id: this.id+'-weekly-SU'},
                    {boxLabel: 'Mon', name: 'MO', id: this.id+'-weekly-MO'},
                    {boxLabel: 'Tue', name: 'TU', id: this.id+'-weekly-TU'},
                    {boxLabel: 'Wed', name: 'WE', id: this.id+'-weekly-WE'},
                    {boxLabel: 'Thu', name: 'TH', id: this.id+'-weekly-TH'},
                    {boxLabel: 'Fri', name: 'FR', id: this.id+'-weekly-FR'},
                    {boxLabel: 'Sat', name: 'SA', id: this.id+'-weekly-SA'}
                ]
            }],
            setStartDate: function(dt){
                this.startDate = dt;
                this.selectToday();
                return this;
            },
            selectToday: function(){
                this.clearValue();
                var day = this.startDate.format('D').substring(0,2).toUpperCase();
                Ext.getCmp(this.id + '-days').setValue(day, true);
            },
            clearValue: function(){
                Ext.getCmp(this.id + '-days').setValue([false, false, false, false, false, false, false]);
            },
            getValue: function(){
                var v = '', sel = Ext.getCmp(this.id+'-days').getValue();
                Ext.each(sel, function(chk){
                    if(v.length > 0){
                        v += ',';
                    }
                    v += chk.name;
                });
                var day = this.startDate.format('D').substring(0,2).toUpperCase();
                return v.length > 0 && v != day ? ';BYDAY='+v : '';
            },
            setValue : function(v){
                var set = false, 
                    parts = Ext.isArray(v) ? v : v.split(';');
                
                this.clearValue();
                
                Ext.each(parts, function(p){
                    if(p.indexOf('BYDAY') > -1){
                        var days = p.split('=')[1].split(','),
                            vals = {};
                            
                        Ext.each(days, function(d){
                            vals[d] = true;
                        }, this);
                        
                        Ext.getCmp(this.id+'-days').setValue(vals);
                        return set = true;
                    }
                }, this);
                
                if(!set){
                    this.selectToday();
                }
                return this;
            }
        });
            
        this.monthly = new baseComponent({
            id: this.id+'-monthly',
            layoutConfig: {
                columns: 3
            },
            items: [{
                xtype: 'label',
                text: 'on the'
            },{
                xtype: 'combo',
                id: this.id+'-monthly-combo',
                mode: 'local',
                width: 150,
                triggerAction: 'all',
                forceSelection: true,
                store: []
            },{
                xtype: 'label',
                text: 'of each month'
            }],
            setStartDate: function(dt){
                this.startDate = dt;
                this.initNthCombo();
                return this;
            },
            getValue: function(){
                var cbo = Ext.getCmp(this.id+'-combo'),
                    store = cbo.getStore(),
                    idx = store.find('field1', cbo.getValue()),
                    dt = this.startDate,
                    day = dt.format('D').substring(0,2).toUpperCase();
                
                if (idx > -1) {
                    switch(idx){
                        case 0:  return ';BYMONTHDAY='+dt.format('j');
                        case 1:  return ';BYDAY='+cbo.getValue()[0].substring(0,1)+day;
                        case 2:  return ';BYDAY=-1'+day;
                        default: return ';BYMONTHDAY=-1';
                    }
                }
                return '';
            }
        });
            
        this.yearly = new baseComponent({
            id: this.id+'-yearly',
            layoutConfig: {
                columns: 3
            },
            items: [{
                xtype: 'label',
                text: 'on the'
            },{
                xtype: 'combo',
                id: this.id+'-yearly-combo',
                mode: 'local',
                width: 170,
                triggerAction: 'all',
                forceSelection: true,
                store: []
            },{
                xtype: 'label',
                text: 'each year'
            }],
            setStartDate: function(dt){
                this.startDate = dt;
                this.initNthCombo();
                return this;
            },
            getValue: function(){
                var cbo = Ext.getCmp(this.id+'-combo'),
                    store = cbo.getStore(),
                    idx = store.find('field1', cbo.getValue()),
                    dt = this.startDate,
                    day = dt.format('D').substring(0,2).toUpperCase(),
                    byMonth = ';BYMONTH='+dt.format('n');
                
                if(idx > -1){
                    switch(idx){
                        case 0:  return byMonth;
                        case 1:  return byMonth+';BYDAY='+cbo.getValue()[0].substring(0,1)+day;
                        case 2:  return byMonth+';BYDAY=-1'+day;
                        default: return byMonth+';BYMONTHDAY=-1';
                    }
                }
                return '';
            }
        });
            
        this.until = new baseComponent({
            id: this.id+'-until',
            untilDateFormat: 'Ymd\\T000000\\Z',
            layoutConfig: {
                columns: 5
            },
            items: [{
                xtype: 'label',
                text: 'and continuing'
            },{
                xtype: 'combo',
                id: this.id+'-until-combo',
                mode: 'local',
                width: 85,
                triggerAction: 'all',
                forceSelection: true,
                value: 'forever',
                store: ['forever', 'for', 'until'],
                listeners: {
                    'select': {
                        fn: function(cbo, rec){
                            var dt = Ext.getCmp(this.id+'-until-date');
                            if(rec.data.field1 == 'until'){
                                dt.show();
                                if (dt.getValue() == '') {
                                    dt.setValue(this.startDate.add(Date.DAY, 5));
                                    dt.setMinValue(this.startDate.clone().add(Date.DAY, 1));
                                }
                            }
                            else{
                                dt.hide();
                            }
                            if(rec.data.field1 == 'for'){
                                Ext.getCmp(this.id+'-until-num').show();
                                Ext.getCmp(this.id+'-until-endlabel').show();
                            }
                            else{
                                Ext.getCmp(this.id+'-until-num').hide();
                                Ext.getCmp(this.id+'-until-endlabel').hide();
                            }
                        },
                        scope: this
                    }
                }
            },{
                xtype: 'datefield',
                id: this.id+'-until-date',
                showToday: false,
                hidden: true
            },{
                xtype: 'numberfield',
                id: this.id+'-until-num',
                value: 5,
                width: 35,
                minValue: 1,
                maxValue: 99,
                allowBlank: false,
                hidden: true
            },{
                xtype: 'label',
                id: this.id+'-until-endlabel',
                text: 'occurrences',
                hidden: true
            }],
            setStartDate: function(dt){
                this.startDate = dt;
                return this;
            },
            getValue: function(){
                var dt = Ext.getCmp(this.id+'-date');
                if(dt.isVisible()){
                    return ';UNTIL='+dt.getValue().format(this.untilDateFormat);
                }
                var ct = Ext.getCmp(this.id+'-num');
                if(ct.isVisible()){
                    return ';COUNT='+ct.getValue();
                }
                return '';
            },
            setValue : function(v){
                var set = false, 
                    parts = Ext.isArray(v) ? v : v.split(';');
                
                Ext.each(parts, function(p){
                    if(p.indexOf('COUNT') > -1){
                        var count = p.split('=')[1];
                        Ext.getCmp(this.id+'-combo').setValue('for');
                        Ext.getCmp(this.id+'-num').setValue(count).show();
                        Ext.getCmp(this.id+'-endlabel').show();
                    }
                    else if(p.indexOf('UNTIL') > -1){
                        var dt = p.split('=')[1];
                        Ext.getCmp(this.id+'-combo').setValue('until');
                        Ext.getCmp(this.id+'-date').setValue(Date.parseDate(dt, this.untilDateFormat)).show();
                        Ext.getCmp(this.id+'-endlabel').hide();
                    }
                }, this);
                return this;
            }
        });
        
        return [this.repeatEvery, this.weekly, this.monthly, this.yearly, this.until];
    }
});

Ext.reg('extensible.recurrencefield', Ext.ensible.cal.RecurrenceField);
/**
 * @class Ext.ensible.cal.DateRangeField
 * @extends Ext.form.Field
 * <p>A combination field that includes start and end dates and times, as well as an optional all-day checkbox.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.ensible.cal.DateRangeField = Ext.extend(Ext.form.Field, {
    /**
     * @cfg {String} toText
     * The text to display in between the date/time fields (defaults to 'to')
     */
    toText: 'to',
    /**
     * @cfg {String} allDayText
     * The text to display as the label for the all day checkbox (defaults to 'All day')
     */
    allDayText: 'All day',
    /**
     * @cfg {String/Boolean} singleLine
     * This value can be set explicitly to <code>true</code> or <code>false</code> to force the field to render on
     * one line or two lines respectively.  The default value is <code>'auto'</code> which means that the field will
     * calculate its container's width and compare it to {@link singleLineMinWidth} to determine whether to render 
     * on one line or two automatically.  Note that this only applies at render time -- once the field is rendered
     * the layout cannot be changed.
     */
    singleLine: 'auto',
    /**
     * @cfg {Number} singleLineMinWidth
     * If {@link singleLine} is set to 'auto' it will use this value to determine whether to render the field on one
     * line or two. This value is the approximate minimum width required to render the field on a single line, so if
     * the field's container is narrower than this value it will automatically be rendered on two lines.
     */
    singleLineMinWidth: 490,
    
    // private
    onRender: function(ct, position){
        if(!this.el){
            this.startDate = new Ext.form.DateField({
                id: this.id+'-start-date',
                format: 'n/j/Y',
                width:100,
                listeners: {
                    'change': {
                        fn: function(){
                            this.checkDates('date', 'start');
                        },
                        scope: this
                    }
                }
            });
            this.startTime = new Ext.form.TimeField({
                id: this.id+'-start-time',
                hidden: this.showTimes === false,
                labelWidth: 0,
                hideLabel:true,
                width:90,
                listeners: {
                    'select': {
                        fn: function(){
                            this.checkDates('time', 'start');
                        },
                        scope: this
                    }
                }
            });
            this.endTime = new Ext.form.TimeField({
                id: this.id+'-end-time',
                hidden: this.showTimes === false,
                labelWidth: 0,
                hideLabel:true,
                width:90,
                listeners: {
                    'select': {
                        fn: function(){
                            this.checkDates('time', 'end');
                        },
                        scope: this
                    }
                }
            })
            this.endDate = new Ext.form.DateField({
                id: this.id+'-end-date',
                format: 'n/j/Y',
                hideLabel:true,
                width:100,
                listeners: {
                    'change': {
                        fn: function(){
                            this.checkDates('date', 'end');
                        },
                        scope: this
                    }
                }
            });
            this.allDay = new Ext.form.Checkbox({
                id: this.id+'-allday',
                hidden: this.showTimes === false || this.showAllDay === false,
                boxLabel: this.allDayText,
                handler: function(chk, checked){
                    this.startTime.setVisible(!checked);
                    this.endTime.setVisible(!checked);
                },
                scope: this
            });
            this.toLabel = new Ext.form.Label({
                xtype: 'label',
                id: this.id+'-to-label',
                text: this.toText
            });
            
            var singleLine = this.singleLine;
            if(singleLine == 'auto'){
                var el, w = this.ownerCt.getWidth() - this.ownerCt.getEl().getPadding('lr');
                if(el = this.ownerCt.getEl().child('.x-panel-body')){
                    w -= el.getPadding('lr');
                }
                if(el = this.ownerCt.getEl().child('.x-form-item-label')){
                    w -= el.getWidth() - el.getPadding('lr');
                }
                singleLine = w <= this.singleLineMinWidth ? false : true;
            }
            
            this.fieldCt = new Ext.Container({
                autoEl: {id:this.id}, //make sure the container el has the field's id
                cls: 'ext-dt-range',
                renderTo: ct,
                layout: 'table',
                layoutConfig: {
                    columns: singleLine ? 6 : 3
                },
                defaults: {
                    hideParent: true
                },
                items:[
                    this.startDate,
                    this.startTime,
                    this.toLabel,
                    singleLine ? this.endTime : this.endDate,
                    singleLine ? this.endDate : this.endTime,
                    this.allDay
                ]
            });
            
            this.fieldCt.ownerCt = this;
            this.el = this.fieldCt.getEl();
            this.items = new Ext.util.MixedCollection();
            this.items.addAll([this.startDate, this.endDate, this.toLabel, this.startTime, this.endTime, this.allDay]);
        }
        
        Ext.ensible.cal.DateRangeField.superclass.onRender.call(this, ct, position);
        
        if(!singleLine){
            this.el.child('tr').addClass('ext-dt-range-row1');
        }
    },
    
    // private
    checkDates: function(type, startend){
        var startField = Ext.getCmp(this.id+'-start-'+type),
            endField = Ext.getCmp(this.id+'-end-'+type),
            startValue = this.getDT('start'),
            endValue = this.getDT('end');

        if(startValue > endValue){
            if(startend=='start'){
                endField.setValue(startValue);
            }else{
                startField.setValue(endValue);
                this.checkDates(type, 'start');
            }
        }
        if(type=='date'){
            this.checkDates('time', startend);
        }
    },
    
    /**
     * Returns an array containing the following values in order:<div class="mdetail-params"><ul>
     * <li><b><code>DateTime</code></b> : <div class="sub-desc">The start date/time</div></li>
     * <li><b><code>DateTime</code></b> : <div class="sub-desc">The end date/time</div></li>
     * <li><b><code>Boolean</code></b> : <div class="sub-desc">True if the dates are all-day, false 
     * if the time values should be used</div></li><ul></div>
     * @return {Array} The array of return values
     */
    getValue: function(){
        return [
            this.getDT('start'), 
            this.getDT('end'),
            this.allDay.getValue()
        ];
    },
    
    // private getValue helper
    getDT: function(startend){
        var time = this[startend+'Time'].getValue(),
            dt = this[startend+'Date'].getValue();
            
        if(Ext.isDate(dt)){
            dt = dt.format(this[startend+'Date'].format);
        }
        else{
            return null;
        };
        if(time != '' && this[startend+'Time'].isVisible()){
            return Date.parseDate(dt+' '+time, this[startend+'Date'].format+' '+this[startend+'Time'].format);
        }
        return Date.parseDate(dt, this[startend+'Date'].format);
        
    },
    
    /**
     * Sets the values to use in the date range.
     * @param {Array/Date/Object} v The value(s) to set into the field. Valid types are as follows:<div class="mdetail-params"><ul>
     * <li><b><code>Array</code></b> : <div class="sub-desc">An array containing, in order, a start date, end date and all-day flag.
     * This array should exactly match the return type as specified by {@link #getValue}.</div></li>
     * <li><b><code>DateTime</code></b> : <div class="sub-desc">A single Date object, which will be used for both the start and
     * end dates in the range.  The all-day flag will be defaulted to false.</div></li>
     * <li><b><code>Object</code></b> : <div class="sub-desc">An object containing properties for StartDate, EndDate and IsAllDay
     * as defined in {@link Ext.ensible.cal.EventMappings}.</div></li><ul></div>
     */
    setValue: function(v){
        if(Ext.isArray(v)){
            this.setDT(v[0], 'start');
            this.setDT(v[1], 'end');
            this.allDay.setValue(!!v[2]);
        }
        else if(Ext.isDate(v)){
            this.setDT(v, 'start');
            this.setDT(v, 'end');
            this.allDay.setValue(false);
        }
        else if(v[Ext.ensible.cal.EventMappings.StartDate.name]){ //object
            this.setDT(v[Ext.ensible.cal.EventMappings.StartDate.name], 'start');
            if(!this.setDT(v[Ext.ensible.cal.EventMappings.EndDate.name], 'end')){
                this.setDT(v[Ext.ensible.cal.EventMappings.StartDate.name], 'end');
            }
            this.allDay.setValue(!!v[Ext.ensible.cal.EventMappings.IsAllDay.name]);
        }
    },
    
    // private setValue helper
    setDT: function(dt, startend){
        if(dt && Ext.isDate(dt)){
            this[startend+'Date'].setValue(dt);
            this[startend+'Time'].setValue(dt.format(this[startend+'Time'].format));
            return true;
        }
    },
    
    // inherited docs
    isDirty: function(){
        var dirty = false;
        if(this.rendered && !this.disabled) {
            this.items.each(function(item){
                if (item.isDirty()) {
                    dirty = true;
                    return false;
                }
            });
        }
        return dirty;
    },
    
    // private
    onDisable : function(){
        this.delegateFn('disable');
    },
    
    // private
    onEnable : function(){
        this.delegateFn('enable');
    },
    
    // inherited docs
    reset : function(){
        this.delegateFn('reset');
    },
    
    // private
    delegateFn : function(fn){
        this.items.each(function(item){
            if (item[fn]) {
                item[fn]();
            }
        });
    },
    
    // private
    beforeDestroy: function(){
        Ext.destroy(this.fieldCt);
        Ext.ensible.cal.DateRangeField.superclass.beforeDestroy.call(this);
    },
    
    /**
     * @method getRawValue
     * @hide
     */
    getRawValue : Ext.emptyFn,
    /**
     * @method setRawValue
     * @hide
     */
    setRawValue : Ext.emptyFn
});

Ext.reg('daterangefield', Ext.ensible.cal.DateRangeField);
/**
 * @class Ext.ensible.cal.ReminderField
 * @extends Ext.form.ComboBox
 * <p>A custom combo used for choosing a reminder setting for an event.</p>
 * <p>This is pretty much a standard combo that is simply pre-configured for the options needed by the
 * calendar components. The default configs are as follows:<pre><code>
    width: 200,
    fieldLabel: 'Reminder',
    mode: 'local',
    triggerAction: 'all',
    forceSelection: true,
    displayField: 'desc',
    valueField: 'value'
</code></pre>
 * @constructor
 * @param {Object} config The config object
 */
Ext.ensible.cal.ReminderField = Ext.extend(Ext.form.ComboBox, {
    width: 200,
    fieldLabel: 'Reminder',
    mode: 'local',
    triggerAction: 'all',
    forceSelection: true,
    displayField: 'desc',
    valueField: 'value',
    
    // private
    initComponent: function(){
        Ext.ensible.cal.ReminderField.superclass.initComponent.call(this);
        
        this.store = this.store || new Ext.data.ArrayStore({
            fields: ['value', 'desc'],
            idIndex: 0,
            data: [
                ['', 'None'],
                ['0', 'At start time'],
                ['5', '5 minutes before start'],
                ['15', '15 minutes before start'],
                ['30', '30 minutes before start'],
                ['60', '1 hour before start'],
                ['90', '1.5 hours before start'],
                ['120', '2 hours before start'],
                ['180', '3 hours before start'],
                ['360', '6 hours before start'],
                ['720', '12 hours before start'],
                ['1440', '1 day before start'],
                ['2880', '2 days before start'],
                ['4320', '3 days before start'],
                ['5760', '4 days before start'],
                ['7200', '5 days before start'],
                ['10080', '1 week before start'],
                ['20160', '2 weeks before start']
            ]
        });
    },
    
    // inherited docs
    initValue : function(){
        if(this.value !== undefined){
            this.setValue(this.value);
        }
        else{
            this.setValue('');
        }
        this.originalValue = this.getValue();
    }
});

Ext.reg('reminderfield', Ext.ensible.cal.ReminderField);
/**
 * @class Ext.ensible.cal.EventEditForm
 * @extends Ext.form.FormPanel
 * <p>A custom form used for detailed editing of events.</p>
 * <p>This is pretty much a standard form that is simply pre-configured for the options needed by the
 * calendar components. It is also configured to automatically bind records of type {@link Ext.ensible.cal.EventRecord}
 * to and from the form.</p>
 * <p>This form also provides custom events specific to the calendar so that other calendar components can be easily
 * notified when an event has been edited via this component.</p>
 * <p>The default configs are as follows:</p><pre><code>
    labelWidth: 65,
    title: 'Event Form',
    titleTextAdd: 'Add Event',
    titleTextEdit: 'Edit Event',
    bodyStyle: 'background:transparent;padding:20px 20px 10px;',
    border: false,
    buttonAlign: 'center',
    autoHeight: true, // to allow for the notes field to autogrow
    cls: 'ext-evt-edit-form',
</code></pre>
 * @constructor
 * @param {Object} config The config object
 */
Ext.ensible.cal.EventEditForm = Ext.extend(Ext.form.FormPanel, {
    labelWidth: 65,
    title: 'Event Form',
    titleTextAdd: 'Add Event',
    titleTextEdit: 'Edit Event',
    bodyStyle: 'padding:20px 20px 10px;',
    border: false,
    buttonAlign: 'center',
    autoHeight: true, // to allow for the notes field to autogrow
    cls: 'ext-evt-edit-form',
    
    // private properties:
    newId: 10000,
    layout: 'column',
    
    // private
    initComponent: function(){
        
        this.addEvents({
            /**
             * @event eventadd
             * Fires after a new event is added
             * @param {Ext.ensible.cal.EventEditForm} this
             * @param {Ext.ensible.cal.EventRecord} rec The new {@link Ext.ensible.cal.EventRecord record} that was added
             */
            eventadd: true,
            /**
             * @event eventupdate
             * Fires after an existing event is updated
             * @param {Ext.ensible.cal.EventEditForm} this
             * @param {Ext.ensible.cal.EventRecord} rec The new {@link Ext.ensible.cal.EventRecord record} that was updated
             */
            eventupdate: true,
            /**
             * @event eventdelete
             * Fires after an event is deleted
             * @param {Ext.ensible.cal.EventEditForm} this
             * @param {Ext.ensible.cal.EventRecord} rec The new {@link Ext.ensible.cal.EventRecord record} that was deleted
             */
            eventdelete: true,
            /**
             * @event eventcancel
             * Fires after an event add/edit operation is canceled by the user and no store update took place
             * @param {Ext.ensible.cal.EventEditForm} this
             * @param {Ext.ensible.cal.EventRecord} rec The new {@link Ext.ensible.cal.EventRecord record} that was canceled
             */
            eventcancel: true
        });
                
        this.titleField = new Ext.form.TextField({
            fieldLabel: 'Title',
            name: Ext.ensible.cal.EventMappings.Title.name,
            anchor: '90%'
        });
        this.dateRangeField = new Ext.ensible.cal.DateRangeField({
            fieldLabel: 'When',
            anchor: '90%'
        });
        this.reminderField = new Ext.ensible.cal.ReminderField({
            name: 'Reminder'
        });
        this.notesField = new Ext.form.TextArea({
            fieldLabel: 'Notes',
            name: Ext.ensible.cal.EventMappings.Notes.name,
            grow: true,
            growMax: 150,
            anchor: '100%'
        });
        this.locationField = new Ext.form.TextField({
            fieldLabel: 'Location',
            name: Ext.ensible.cal.EventMappings.Location.name,
            anchor: '100%'
        });
        this.urlField = new Ext.form.TextField({
            fieldLabel: 'Web Link',
            name: Ext.ensible.cal.EventMappings.Url.name,
            anchor: '100%'
        });
        
        var leftFields = [this.titleField, this.dateRangeField, this.reminderField], 
            rightFields = [this.notesField, this.locationField, this.urlField];
        
        if(this.calendarStore){
            this.calendarField = new Ext.ensible.cal.CalendarPicker({
                store: this.calendarStore,
                name: Ext.ensible.cal.EventMappings.CalendarId.name
            });
            leftFields.splice(2, 0, this.calendarField);
        };
        
        this.items = [{
            id: this.id+'-left-col',
            columnWidth: .65,
            layout: 'form',
            border: false,
            items: leftFields
        },{
            id: this.id+'-right-col',
            columnWidth: .35,
            layout: 'form',
            border: false,
            items: rightFields
        }];
        
        this.fbar = [{
            text:'Save', scope: this, handler: this.onSave
        },{
            cls:'ext-del-btn', text:'Delete', scope:this, handler:this.onDelete
        },{
            text:'Cancel', scope: this, handler: this.onCancel
        }];
        
        Ext.ensible.cal.EventEditForm.superclass.initComponent.call(this);
    },
    
    // inherited docs
    loadRecord: function(rec){
        this.form.loadRecord.apply(this.form, arguments);
        this.activeRecord = rec;
        this.dateRangeField.setValue(rec.data);
        if(this.calendarStore){
            this.form.setValues({'calendar': rec.data[Ext.ensible.cal.EventMappings.CalendarId.name]});
        }
        this.isAdd = !!rec.data[Ext.ensible.cal.EventMappings.IsNew.name];
        if(this.isAdd){
            rec.markDirty();
            this.setTitle(this.titleTextAdd);
            Ext.select('.ext-del-btn').setDisplayed(false);
        }
        else {
            this.setTitle(this.titleTextEdit);
            Ext.select('.ext-del-btn').setDisplayed(true);
        }
        this.titleField.focus();
    },
    
    // inherited docs
    updateRecord: function(){
        var dates = this.dateRangeField.getValue();
            
        this.form.updateRecord(this.activeRecord);
        this.activeRecord.set(Ext.ensible.cal.EventMappings.StartDate.name, dates[0]);
        this.activeRecord.set(Ext.ensible.cal.EventMappings.EndDate.name, dates[1]);
        this.activeRecord.set(Ext.ensible.cal.EventMappings.IsAllDay.name, dates[2]);
    },
    
    // private
    onCancel: function(){
        this.cleanup(true);
        this.fireEvent('eventcancel', this, this.activeRecord);
    },
    
    // private
    cleanup: function(hide){
        if(this.activeRecord && this.activeRecord.dirty){
            this.activeRecord.reject();
        }
        delete this.activeRecord;
        
        if(this.form.isDirty()){
            this.form.reset();
        }
    },
    
    // private
    onSave: function(){
        if(!this.form.isValid()){
            return;
        }
        this.updateRecord();
        
        if(!this.activeRecord.dirty){
            this.onCancel();
            return;
        }
        
        this.fireEvent(this.isAdd ? 'eventadd' : 'eventupdate', this, this.activeRecord);
    },

    // private
    onDelete: function(){
        this.fireEvent('eventdelete', this, this.activeRecord);
    }
});

Ext.reg('extensible.eventeditform', Ext.ensible.cal.EventEditForm);
/**
 * @class Ext.ensible.cal.EventEditWindow
 * @extends Ext.Window
 * <p>A custom window containing a basic edit form used for quick editing of events.</p>
 * <p>This window also provides custom events specific to the calendar so that other calendar components can be easily
 * notified when an event has been edited via this component.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.ensible.cal.EventEditWindow = Ext.extend(Ext.Window, {
    titleTextAdd: 'Add Event',
    titleTextEdit: 'Edit Event',
    width: 580,
    border: true,
    closeAction: 'hide',
    modal: false,
    resizable: false,
    buttonAlign: 'left',
    labelWidth: 65,
    savingMessage: 'Saving changes...',
    deletingMessage: 'Deleting event...',
    editDetailsLinkClass: 'edit-dtl-link',
    
    // private
	newId: 10000,
	
    // private
    initComponent: function(){
        this.addEvents({
            /**
             * @event eventadd
             * Fires after a new event is added
             * @param {Ext.ensible.cal.EventEditWindow} this
             * @param {Ext.ensible.cal.EventRecord} rec The new {@link Ext.ensible.cal.EventRecord record} that was added
             * @param {Ext.Element} el The target element
             */
            eventadd: true,
            /**
             * @event eventupdate
             * Fires after an existing event is updated
             * @param {Ext.ensible.cal.EventEditWindow} this
             * @param {Ext.ensible.cal.EventRecord} rec The new {@link Ext.ensible.cal.EventRecord record} that was updated
             * @param {Ext.Element} el The target element
             */
            eventupdate: true,
            /**
             * @event eventdelete
             * Fires after an event is deleted
             * @param {Ext.ensible.cal.EventEditWindow} this
             * @param {Ext.ensible.cal.EventRecord} rec The new {@link Ext.ensible.cal.EventRecord record} that was deleted
             * @param {Ext.Element} el The target element
             */
            eventdelete: true,
            /**
             * @event eventcancel
             * Fires after an event add/edit operation is canceled by the user and no store update took place
             * @param {Ext.ensible.cal.EventEditWindow} this
             * @param {Ext.ensible.cal.EventRecord} rec The new {@link Ext.ensible.cal.EventRecord record} that was canceled
             * @param {Ext.Element} el The target element
             */
            eventcancel: true,
            /**
             * @event editdetails
             * Fires when the user selects the option in this window to continue editing in the detailed edit form
             * (by default, an instance of {@link Ext.ensible.cal.EventEditForm}. Handling code should hide this window
             * and transfer the current event record to the appropriate instance of the detailed form by showing it
             * and calling {@link Ext.ensible.cal.EventEditForm#loadRecord loadRecord}.
             * @param {Ext.ensible.cal.EventEditWindow} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} that is currently being edited
             * @param {Ext.Element} el The target element
             */
            editdetails: true
        });
        
        this.fbar = [{
            xtype: 'tbtext', text: '<a href="#" class="'+this.editDetailsLinkClass+'">Edit Details...</a>'
        },'->',{
            text:'Save', disabled:false, handler:this.onSave, scope:this
        },{
            id:this.id+'-delete-btn', text:'Delete', disabled:false, handler:this.onDelete, scope:this, hideMode:'offsets'
        },{
            text:'Cancel', disabled:false, handler:this.onCancel, scope:this
        }];
        
        Ext.ensible.cal.EventEditWindow.superclass.initComponent.call(this);
    },
    
    // private
    onRender : function(ct, position){
        this.deleteBtn = Ext.getCmp(this.id+'-delete-btn');
        
        this.titleField = new Ext.form.TextField({
            name: Ext.ensible.cal.EventMappings.Title.name,
            fieldLabel: 'Title',
            anchor: '100%'
        });
        this.dateRangeField = new Ext.ensible.cal.DateRangeField({
            anchor: '100%',
            fieldLabel: 'When'
        });
        
        var items = [this.titleField, this.dateRangeField];
        
        if(this.calendarStore){
            this.calendarField = new Ext.ensible.cal.CalendarPicker({
                name: Ext.ensible.cal.EventMappings.CalendarId.name,
                anchor: '100%',
                store: this.calendarStore
            });
            items.push(this.calendarField);
        }
        
        this.formPanel = new Ext.FormPanel({
            labelWidth: this.labelWidth,
            frame: false,
            bodyBorder: false,
            border: false,
            items: items
        });
        
        this.add(this.formPanel);
        
        Ext.ensible.cal.EventEditWindow.superclass.onRender.call(this, ct, position);
    },

    // private
    afterRender: function(){
        Ext.ensible.cal.EventEditWindow.superclass.afterRender.call(this);
		
		this.el.addClass('ext-cal-event-win');
        this.el.select('.'+this.editDetailsLinkClass).on('click', this.onEditDetailsClick, this);
    },
    
    // private
    onEditDetailsClick: function(e){
        e.stopEvent();
        this.updateRecord();
        this.fireEvent('editdetails', this, this.activeRecord, this.animateTarget);
    },
	
	/**
     * Shows the window, rendering it first if necessary, or activates it and brings it to front if hidden.
	 * @param {Ext.data.Record/Object} o Either a {@link Ext.data.Record} if showing the form
	 * for an existing event in edit mode, or a plain object containing a StartDate property (and 
	 * optionally an EndDate property) for showing the form in add mode. 
     * @param {String/Element} animateTarget (optional) The target element or id from which the window should
     * animate while opening (defaults to null with no animation)
     * @return {Ext.Window} this
     */
    show: function(o, animateTarget){
		// Work around the CSS day cell height hack needed for initial render in IE8/strict:
		var anim = (Ext.isIE8 && Ext.isStrict) ? null : animateTarget;

		Ext.ensible.cal.EventEditWindow.superclass.show.call(this, anim, function(){
            this.titleField.focus(false, 100);
        });
        this.deleteBtn[o.data && o.data[Ext.ensible.cal.EventMappings.EventId.name] ? 'show' : 'hide']();
        
        var rec, f = this.formPanel.form;

        if(o.data){
            rec = o;
			this.isAdd = !!rec.data[Ext.ensible.cal.EventMappings.IsNew.name];
			if(this.isAdd){
				// Enable adding the default record that was passed in
				// if it's new even if the user makes no changes 
				rec.markDirty();
				this.setTitle(this.titleTextAdd);
			}
			else{
				this.setTitle(this.titleTextEdit);
			}
            
            f.loadRecord(rec);
        }
        else{
			this.isAdd = true;
            this.setTitle(this.titleTextAdd);

            var M = Ext.ensible.cal.EventMappings,
                eventId = M.EventId.name,
                start = o[M.StartDate.name],
                end = o[M.EndDate.name] || start.add('h', 1);
                
            rec = new Ext.ensible.cal.EventRecord();
            rec.data[M.EventId.name] = this.newId++;
            rec.data[M.StartDate.name] = start;
            rec.data[M.EndDate.name] = end;
            rec.data[M.IsAllDay.name] = !!o[M.IsAllDay.name] || start.getDate() != end.clone().add(Date.MILLI, 1).getDate();
            rec.data[M.IsNew.name] = true;
            
            f.reset();
            f.loadRecord(rec);
        }
        
        if(this.calendarStore){
            this.calendarField.setValue(rec.data[Ext.ensible.cal.EventMappings.CalendarId.name]);
        }
        this.dateRangeField.setValue(rec.data);
        this.activeRecord = rec;
        
		return this;
    },
    
    // private
    roundTime: function(dt, incr){
        incr = incr || 15;
        var m = parseInt(dt.getMinutes());
        return dt.add('mi', incr - (m % incr));
    },
    
    // private
    onCancel: function(){
    	this.cleanup(true);
		this.fireEvent('eventcancel', this, this.animateTarget);
    },

    // private
    cleanup: function(hide){
        if(this.activeRecord && this.activeRecord.dirty){
            this.activeRecord.reject();
        }
        delete this.activeRecord;
		
        if(hide===true){
			// Work around the CSS day cell height hack needed for initial render in IE8/strict:
			//var anim = afterDelete || (Ext.isIE8 && Ext.isStrict) ? null : this.animateTarget;
            this.hide();
        }
    },
    
    // private
    updateRecord: function(){
        var f = this.formPanel.form,
            dates = this.dateRangeField.getValue(),
            M = Ext.ensible.cal.EventMappings;
            
        f.updateRecord(this.activeRecord);
        this.activeRecord.set(M.StartDate.name, dates[0]);
        this.activeRecord.set(M.EndDate.name, dates[1]);
        this.activeRecord.set(M.IsAllDay.name, dates[2]);
        if(this.calendarStore){
            this.activeRecord.set(M.CalendarId.name, this.calendarField.getValue());
        }
    },
    
    // private
    onSave: function(){
        if(!this.formPanel.form.isValid()){
            return;
        }
        this.updateRecord();
		
		if(!this.activeRecord.dirty){
			this.onCancel();
			return;
		}
		
		this.fireEvent(this.isAdd ? 'eventadd' : 'eventupdate', this, this.activeRecord, this.animateTarget);
    },
    
    // private
    onDelete: function(){
		this.fireEvent('eventdelete', this, this.activeRecord, this.animateTarget);
    }
});

Ext.reg('extensible.eventeditwindow', Ext.ensible.cal.EventEditWindow);/**
 * @class Ext.ensible.cal.CalendarView
 * @extends Ext.BoxComponent
 * <p>This is an abstract class that serves as the base for other calendar views. This class is not
 * intended to be directly instantiated.</p>
 * <p>When extending this class to create a custom calendar view, you must provide an implementation
 * for the <code>renderItems</code> method, as there is no default implementation for rendering events
 * The rendering logic is totally dependent on how the UI structures its data, which
 * is determined by the underlying UI template (this base class does not have a template).</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.ensible.cal.CalendarView = Ext.extend(Ext.BoxComponent, {
    /**
     * @cfg {Number} startDay
     * The 0-based index for the day on which the calendar week begins (0=Sunday, which is the default)
     */
    startDay : 0,
    /**
     * @cfg {Boolean} spansHavePriority
     * Allows switching between two different modes of rendering events that span multiple days. When true,
     * span events are always sorted first, possibly at the expense of start dates being out of order (e.g., 
     * a span event that starts at 11am one day and spans into the next day would display before a non-spanning 
     * event that starts at 10am, even though they would not be in date order). This can lead to more compact
     * layouts when there are many overlapping events. If false (the default), events will always sort by start date
     * first which can result in a less compact, but chronologically consistent layout.
     */
    spansHavePriority: false,
    /**
     * @cfg {Boolean} trackMouseOver
     * Whether or not the view tracks and responds to the browser mouseover event on contained elements (defaults to
     * true). If you don't need mouseover event highlighting you can disable this.
     */
	trackMouseOver: true,
    /**
     * @cfg {Boolean} enableFx
     * Determines whether or not visual effects for CRUD actions are enabled (defaults to true). If this is false
     * it will override any values for {@link #enableAddFx}, {@link #enableUpdateFx} or {@link enableRemoveFx} and
     * all animations will be disabled.
     */
	enableFx: true,
    /**
     * @cfg {Boolean} enableAddFx
     * True to enable a visual effect on adding a new event (the default), false to disable it. Note that if 
     * {@link #enableFx} is false it will override this value. The specific effect that runs is defined in the
     * {@link #doAddFx} method.
     */
	enableAddFx: true,
    /**
     * @cfg {Boolean} enableUpdateFx
     * True to enable a visual effect on updating an event, false to disable it (the default). Note that if 
     * {@link #enableFx} is false it will override this value. The specific effect that runs is defined in the
     * {@link #doUpdateFx} method.
     */
	enableUpdateFx: false,
    /**
     * @cfg {Boolean} enableRemoveFx
     * True to enable a visual effect on removing an event (the default), false to disable it. Note that if 
     * {@link #enableFx} is false it will override this value. The specific effect that runs is defined in the
     * {@link #doRemoveFx} method.
     */
	enableRemoveFx: true,
    /**
     * @cfg {Boolean} enableDD
     * True to enable drag and drop in the calendar view (the default), false to disable it
     */
    enableDD: true,
    /**
     * @cfg {Boolean} enableContextMenus
     * True to enable automatic right-click context menu handling in the calendar views (the default), false to disable
     * them. Different context menus are provided when clicking on events vs. the view background.
     */
    enableContextMenus: true,
    /**
     * @cfg {Boolean} suppressBrowserContextMenu
     * When {@link #enableContextMenus} is true, the browser context menu will automatically be suppressed whenever a
     * custom context menu is displayed. When this option is true, right-clicks on elements that do not have a custom
     * context menu will also suppress the default browser context menu (no menu will be shown at all). When false,
     * the browser context menu will still show if the right-clicked element has no custom menu (this is the default).
     */
    suppressBrowserContextMenu: false,
    /**
     * @cfg {Boolean} monitorResize
     * True to monitor the browser's resize event (the default), false to ignore it. If the calendar view is rendered
     * into a fixed-size container this can be set to false. However, if the view can change dimensions (e.g., it's in 
     * fit layout in a viewport or some other resizable container) it is very important that this config is true so that
     * any resize event propagates properly to all subcomponents and layouts get recalculated properly.
     */
    monitorResize: true,
    /**
     * @cfg {String} ddCreateEventText
     * The text to display inside the drag proxy while dragging over the calendar to create a new event (defaults to 
     * 'Create event for {0}' where {0} is a date range supplied by the view)
     */
	ddCreateEventText: 'Create event for {0}',
    /**
     * @cfg {String} ddMoveEventText
     * The text to display inside the drag proxy while dragging an event to reposition it (defaults to 
     * 'Move event to {0}' where {0} is the updated event start date/time supplied by the view)
     */
	ddMoveEventText: 'Move event to {0}',
    /**
     * @cfg {String} ddResizeEventText
     * The string displayed to the user in the drag proxy while dragging the resize handle of an event (defaults to 
     * 'Update event to {0}' where {0} is the updated event start-end range supplied by the view). Note that 
     * this text is only used in views
     * that allow resizing of events.
     */
    ddResizeEventText: 'Update event to {0}',
    
    //private properties -- do not override:
    weekCount: 1,
    dayCount: 1,
    eventSelector : '.ext-cal-evt',
    eventOverClass: 'ext-evt-over',
	eventElIdDelimiter: '-evt-',
    dayElIdDelimiter: '-day-',
    
    /**
     * Returns a string of HTML template markup to be used as the body portion of the event template created
     * by {@link #getEventTemplate}. This provides the flexibility to customize what's in the body without
     * having to override the entire XTemplate. This string can include any valid {@link Ext.Template} code, and
     * any data tokens accessible to the containing event template can be referenced in this string.
     * @return {String} The body template string
     */
    getEventBodyMarkup : Ext.emptyFn, // must be implemented by a subclass
    
    /**
     * <p>Returns the XTemplate that is bound to the calendar's event store (it expects records of type
     * {@link Ext.ensible.cal.EventRecord}) to populate the calendar views with events. Internally this method
     * by default generates different markup for browsers that support CSS border radius and those that don't.
     * This method can be overridden as needed to customize the markup generated.</p>
     * <p>Note that this method calls {@link #getEventBodyMarkup} to retrieve the body markup for events separately
     * from the surrounding container markup.  This provides the flexibility to customize what's in the body without
     * having to override the entire XTemplate. If you do override this method, you should make sure that your 
     * overridden version also does the same.</p>
     * @return {Ext.XTemplate} The event XTemplate
     */
    getEventTemplate : Ext.emptyFn, // must be implemented by a subclass
    
    // private
    initComponent : function(){
        this.setStartDate(this.startDate || new Date());

        Ext.ensible.cal.CalendarView.superclass.initComponent.call(this);
		
        this.addEvents({
            /**
             * @event eventsrendered
             * Fires after events are finished rendering in the view
             * @param {Ext.ensible.cal.CalendarView} this 
             */
            eventsrendered: true,
            /**
             * @event eventclick
             * Fires after the user clicks on an event element
             * @param {Ext.ensible.cal.CalendarView} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that was clicked on
             * @param {HTMLNode} el The DOM node that was clicked on
             */
            eventclick: true,
            /**
             * @event eventover
             * Fires anytime the mouse is over an event element
             * @param {Ext.ensible.cal.CalendarView} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that the cursor is over
             * @param {HTMLNode} el The DOM node that is being moused over
             */
            eventover: true,
            /**
             * @event eventout
             * Fires anytime the mouse exits an event element
             * @param {Ext.ensible.cal.CalendarView} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that the cursor exited
             * @param {HTMLNode} el The DOM node that was exited
             */
            eventout: true,
            /**
             * @event beforedatechange
             * Fires before the start date of the view changes, giving you an opportunity to save state or anything else you may need
             * to do prior to the UI view changing. This is a cancelable event, so returning false from a handler will cancel both the
             * view change and the setting of the start date.
             * @param {Ext.ensible.cal.CalendarView} this
             * @param {Date} startDate The current start date of the view (as explained in {@link #getStartDate}
             * @param {Date} newStartDate The new start date that will be set when the view changes
             * @param {Date} viewStart The first displayed date in the current view
             * @param {Date} viewEnd The last displayed date in the current view
             */
            beforedatechange: true,
            /**
             * @event datechange
             * Fires after the start date of the view changes
             * @param {Ext.ensible.cal.CalendarView} this
             * @param {Date} startDate The start date of the view (as explained in {@link #getStartDate}
             * @param {Date} viewStart The first displayed date in the view
             * @param {Date} viewEnd The last displayed date in the view
             */
            datechange: true,
            /**
             * @event rangeselect
             * Fires after the user drags on the calendar to select a range of dates/times in which to create an event
             * @param {Ext.ensible.cal.CalendarView} this
             * @param {Object} dates An object containing the start (StartDate property) and end (EndDate property) dates selected
             * @param {Function} callback A callback function that MUST be called after the event handling is complete so that
             * the view is properly cleaned up (shim elements are persisted in the view while the user is prompted to handle the
             * range selection). The callback is already created in the proper scope, so it simply needs to be executed as a standard
             * function call (e.g., callback()).
             */
			rangeselect: true,
            /**
             * @event beforeeventmove
             * Fires before an event element is dragged by the user and dropped in a new position. This is a cancelable event, so 
             * returning false from a handler will cancel the move operation.
             * @param {Ext.ensible.cal.CalendarView} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that will be moved
             */
            beforeeventmove: true,
            /**
             * @event eventmove
             * Fires after an event element is dragged by the user and dropped in a new position
             * @param {Ext.ensible.cal.CalendarView} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that was moved with
             * updated start and end dates
             */
			eventmove: true,
            /**
             * @event initdrag
             * Fires when a drag operation is initiated in the view
             * @param {Ext.ensible.cal.CalendarView} this
             */
            initdrag: true,
            /**
             * @event dayover
             * Fires while the mouse is over a day element 
             * @param {Ext.ensible.cal.CalendarView} this
             * @param {Date} dt The date that is being moused over
             * @param {Ext.Element} el The day Element that is being moused over
             */
            dayover: true,
            /**
             * @event dayout
             * Fires when the mouse exits a day element 
             * @param {Ext.ensible.cal.CalendarView} this
             * @param {Date} dt The date that is exited
             * @param {Ext.Element} el The day Element that is exited
             */
            dayout: true,
            /**
             * @event editdetails
             * Fires when the user selects the option in this window to continue editing in the detailed edit form
             * (by default, an instance of {@link Ext.ensible.cal.EventEditForm}. Handling code should hide this window
             * and transfer the current event record to the appropriate instance of the detailed form by showing it
             * and calling {@link Ext.ensible.cal.EventEditForm#loadRecord loadRecord}.
             * @param {Ext.ensible.cal.CalendarView} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} that is currently being edited
             * @param {Ext.Element} el The target element
             */
            editdetails: true,
            /**
             * @event beforeeventdelete
             * Fires before an event is deleted by the user. This is a cancelable event, so returning false from a handler 
             * will cancel the delete operation.
             * @param {Ext.ensible.cal.CalendarView} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that was deleted
             * @param {Ext.Element} el The target element
             */
            beforeeventdelete: true,
            /**
             * @event eventdelete
             * Fires after an event is deleted by the user.
             * @param {Ext.ensible.cal.CalendarView} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that was deleted
             * @param {Ext.Element} el The target element
             */
            eventdelete: true
        });
    },

    // private
    afterRender : function(){
        Ext.ensible.cal.CalendarView.superclass.afterRender.call(this);

        this.renderTemplate();
        
        if(this.store){
            this.setStore(this.store, true);
        }

        this.el.on({
            'mouseover': this.onMouseOver,
            'mouseout': this.onMouseOut,
            'click': this.onClick,
			'resize': this.onResize,
            scope: this
        });
        
        // currently the context menu only contains CRUD actions so do not show it if read-only
        if(this.enableContextMenus && this.readOnly !== true){
            this.el.on('contextmenu', this.onContextMenu, this);
        }
		
		this.el.unselectable();
        
        if(this.enableDD && this.initDD){
			this.initDD();
        }
        
        this.on('eventsrendered', this.forceSize);
        this.forceSize.defer(100, this);
    },
    
    // private
    forceSize: function(){
        if(this.el && this.el.child){
            var hd = this.el.child('.ext-cal-hd-ct'),
                bd = this.el.child('.ext-cal-body-ct');
                
            if(bd==null || hd==null) return;
                
            var headerHeight = hd.getHeight(),
                sz = this.el.parent().getSize();
                   
            bd.setHeight(sz.height-headerHeight);
        }
    },

    refresh : function(){
        this.prepareData();
        this.renderTemplate();
        this.renderItems();
    },
    
    getWeekCount : function(){
        var days = Ext.ensible.Date.diffDays(this.viewStart, this.viewEnd);
        return Math.ceil(days / this.dayCount);
    },
    
    // private
    prepareData : function(){
        var lastInMonth = this.startDate.getLastDateOfMonth(),
            w = 0, row = 0,
            dt = this.viewStart.clone(),
            weeks = this.weekCount < 1 ? 6 : this.weekCount;
        
        this.eventGrid = [[]];
        this.allDayGrid = [[]];
        this.evtMaxCount = [];
        
        var evtsInView = this.store.queryBy(function(rec){
            return this.isEventVisible(rec.data);
        }, this);
        
        for(; w < weeks; w++){
            this.evtMaxCount[w] = 0;
            if(this.weekCount == -1 && dt > lastInMonth){
                //current week is fully in next month so skip
                break;
            }
            this.eventGrid[w] = this.eventGrid[w] || [];
            this.allDayGrid[w] = this.allDayGrid[w] || [];
            
            for(d = 0; d < this.dayCount; d++){
                if(evtsInView.getCount() > 0){
                    var evts = evtsInView.filterBy(function(rec){
                        var startsOnDate = (dt.getTime() == rec.data[Ext.ensible.cal.EventMappings.StartDate.name].clearTime(true).getTime());
                        var spansFromPrevView = (w == 0 && d == 0 && (dt > rec.data[Ext.ensible.cal.EventMappings.StartDate.name]));
                        return startsOnDate || spansFromPrevView;
                    }, this);
                    
                    this.sortEventRecordsForDay(evts);
                    this.prepareEventGrid(evts, w, d);
                }
                dt = dt.add(Date.DAY, 1);
            }
        }
        this.currentWeekCount = w;
    },
    
    // private
    prepareEventGrid : function(evts, w, d){
        var row = 0,
            dt = this.viewStart.clone(),
            max = this.maxEventsPerDay ? this.maxEventsPerDay : 999;
        
        evts.each(function(evt){
            var M = Ext.ensible.cal.EventMappings,
                days = Ext.ensible.Date.diffDays(
                Ext.ensible.Date.max(this.viewStart, evt.data[M.StartDate.name]),
                Ext.ensible.Date.min(this.viewEnd, evt.data[M.EndDate.name])) + 1;
            
            if(days > 1 || Ext.ensible.Date.diffDays(evt.data[M.StartDate.name], evt.data[M.EndDate.name]) > 1){
                this.prepareEventGridSpans(evt, this.eventGrid, w, d, days);
                this.prepareEventGridSpans(evt, this.allDayGrid, w, d, days, true);
            }else{
                row = this.findEmptyRowIndex(w,d);
                this.eventGrid[w][d] = this.eventGrid[w][d] || [];
                this.eventGrid[w][d][row] = evt;
                
                if(evt.data[M.IsAllDay.name]){
                    row = this.findEmptyRowIndex(w,d, true);
                    this.allDayGrid[w][d] = this.allDayGrid[w][d] || [];
                    this.allDayGrid[w][d][row] = evt;
                }
            }
            
            if(this.evtMaxCount[w] < this.eventGrid[w][d].length){
                this.evtMaxCount[w] = Math.min(max+1, this.eventGrid[w][d].length);
            }
            return true;
        }, this);
    },
    
    // private
    prepareEventGridSpans : function(evt, grid, w, d, days, allday){
        // this event spans multiple days/weeks, so we have to preprocess
        // the events and store special span events as placeholders so that
        // the render routine can build the necessary TD spans correctly.
        var w1 = w, d1 = d, 
            row = this.findEmptyRowIndex(w,d,allday),
            dt = this.viewStart.clone();
        
        var start = {
            event: evt,
            isSpan: true,
            isSpanStart: true,
            spanLeft: false,
            spanRight: (d == 6)
        };
        grid[w][d] = grid[w][d] || [];
        grid[w][d][row] = start;
        
        while(--days){
            dt = dt.add(Date.DAY, 1);
            if(dt > this.viewEnd){
                break;
            }
            if(++d1>6){
                // reset counters to the next week
                d1 = 0; w1++;
                row = this.findEmptyRowIndex(w1,0);
            }
            grid[w1] = grid[w1] || [];
            grid[w1][d1] = grid[w1][d1] || [];
            
            grid[w1][d1][row] = {
                event: evt,
                isSpan: true,
                isSpanStart: (d1 == 0),
                spanLeft: (w1 > w) && (d1 % 7 == 0),
                spanRight: (d1 == 6) && (days > 1)
            };
        }
    },
    
    // private
    findEmptyRowIndex : function(w, d, allday){
        var grid = allday ? this.allDayGrid : this.eventGrid,
            day = grid[w] ? grid[w][d] || [] : [],
            i = 0, ln = day.length;
            
        for(; i < ln; i++){
            if(day[i] == null){
                return i;
            }
        }
        return ln;
    },
    
    // private
    renderTemplate : function(){
        if(this.tpl){
            this.tpl.overwrite(this.el, this.getParams());
            this.lastRenderStart = this.viewStart.clone();
            this.lastRenderEnd = this.viewEnd.clone();
        }
    },
    
	disableStoreEvents : function(){
		this.monitorStoreEvents = false;
	},
	
	enableStoreEvents : function(refresh){
		this.monitorStoreEvents = true;
		if(refresh === true){
			this.refresh();
		}
	},
	
    // private
	onResize : function(){
		this.refresh();
	},
	
    // private
	onInitDrag : function(){
        this.fireEvent('initdrag', this);
    },
	
    // private
	onEventDrop : function(rec, dt){
        this.moveEvent(rec, dt);
	},
    
    // private
	onCalendarEndDrag : function(start, end, onComplete){
        // set this flag for other event handlers that might conflict while we're waiting
        this.dragPending = true;
        // have to wait for the user to save or cancel before finalizing the dd interaction
        var dates = {};
        dates[Ext.ensible.cal.EventMappings.StartDate.name] = start;
        dates[Ext.ensible.cal.EventMappings.EndDate.name] = end;
        
		//this.fireEvent('rangeselect', this, o, null, this.onCalendarEndDragComplete.createDelegate(this, [onComplete]));
        this.onRangeSelect(dates, null, this.onCalendarEndDragComplete.createDelegate(this, [onComplete]));
	},
    
    // private
    onCalendarEndDragComplete : function(onComplete){
        // callback for the drop zone to clean up
        onComplete();
        // clear flag for other events to resume normally
        this.dragPending = false;
    },
	
    // private
    onUpdate : function(ds, rec, operation){
		if(this.monitorStoreEvents === false) {
			return;
		}
        if(operation == Ext.data.Record.COMMIT){
            this.refresh();
			if(this.enableFx && this.enableUpdateFx){
				this.doUpdateFx(this.getEventEls(rec.data[Ext.ensible.cal.EventMappings.EventId.name]), {
                    scope: this
                });
			}
        }
    },
    
	doUpdateFx : function(els, o){
		this.highlightEvent(els, null, o);
	},
	
    // private
    onAdd : function(ds, records, index){
		if(this.monitorStoreEvents === false) {
			return;
		}
		var rec = records[0];
		this.tempEventId = rec.id;
		this.refresh();
		
		if(this.enableFx && this.enableAddFx){
			this.doAddFx(this.getEventEls(rec.data[Ext.ensible.cal.EventMappings.EventId.name]), {
                scope: this
            });
		};
    },
	
	doAddFx : function(els, o){
		els.fadeIn(Ext.apply(o, {duration:2}));
	},
	
    // private
    onRemove : function(ds, rec){
		if(this.monitorStoreEvents === false) {
			return;
		}
		if(this.enableFx && this.enableRemoveFx){
			this.doRemoveFx(this.getEventEls(rec.data[Ext.ensible.cal.EventMappings.EventId.name]), {
	            remove: true,
	            scope: this,
				callback: this.refresh
			});
		}
		else{
			this.getEventEls(rec.data[Ext.ensible.cal.EventMappings.EventId.name]).remove();
            this.refresh();
		}
    },
	
	doRemoveFx : function(els, o){
        if(els.getCount() == 0 && Ext.isFunction(o.callback)){
            // if there are no matching elements in the view make sure the callback still runs.
            // this can happen when an event accessed from the "more" popup is deleted.
            o.callback.call(o.scope || this);
        }
        else{
            els.fadeOut(o);
        }
	},
	
	/**
	 * Visually highlights an event using {@link Ext.Fx#highlight} config options.
	 * If {@link #highlightEventActions} is false this method will have no effect.
	 * @param {Ext.CompositeElement} els The element(s) to highlight
	 * @param {Object} color (optional) The highlight color. Should be a 6 char hex 
	 * color without the leading # (defaults to yellow: 'ffff9c')
	 * @param {Object} o (optional) Object literal with any of the {@link Ext.Fx} config 
	 * options. See {@link Ext.Fx#highlight} for usage examples.
	 */
	highlightEvent : function(els, color, o) {
		if(this.enableFx){
			var c;
			!(Ext.isIE || Ext.isOpera) ? 
				els.highlight(color, o) :
				// Fun IE/Opera handling:
				els.each(function(el){
					el.highlight(color, Ext.applyIf({attr:'color'}, o));
					if(c = el.child('.ext-cal-evm')) {
						c.highlight(color, o);
					}
				}, this);
		}
	},
	
	/**
	 * Retrieve an Event object's id from its corresponding node in the DOM.
	 * @param {String/Element/HTMLElement} el An {@link Ext.Element}, DOM node or id
	 */
	getEventIdFromEl : function(el){
		el = Ext.get(el);
		var id = el.id.split(this.eventElIdDelimiter)[1];
        if(id.indexOf('-') > -1){
            //This id has the index of the week it is rendered in as the suffix.
            //This allows events that span across weeks to still have reproducibly-unique DOM ids.
            id = id.split('-')[0];
        }
        return id;
	},
	
	// private
	getEventId : function(eventId){
		if(eventId === undefined && this.tempEventId){
            // temp record id assigned during an add, will be overwritten later
			eventId = this.tempEventId;
		}
		return eventId;
	},
	
	/**
	 * 
	 * @param {String} eventId
	 * @param {Boolean} forSelect
	 * @return {String} The selector class
	 */
	getEventSelectorCls : function(eventId, forSelect){
		var prefix = forSelect ? '.' : '';
		return prefix + this.id + this.eventElIdDelimiter + this.getEventId(eventId);
	},

	/**
	 * 
	 * @param {String} eventId
	 * @return {Ext.CompositeElement} The matching CompositeElement of nodes
	 * that comprise the rendered event.  Any event that spans across a view 
	 * boundary will contain more than one internal Element.
	 */
	getEventEls : function(eventId){
		var els = Ext.select(this.getEventSelectorCls(this.getEventId(eventId), true), false, this.el.id);
		return new Ext.CompositeElement(els);
	},
    
    /**
     * Returns true if the view is currently displaying today's date, else false.
     * @return {Boolean} True or false
     */
    isToday : function(){
        var today = new Date().clearTime().getTime();
        return this.viewStart.getTime() <= today && this.viewEnd.getTime() >= today;
    },

    // private
    onDataChanged : function(store){
        this.refresh();
    },
    
    // private
    isEventVisible : function(evt){
        var start = this.viewStart.getTime(),
            end = this.viewEnd.getTime(),
            M = Ext.ensible.cal.EventMappings,
            evStart = (evt.data ? evt.data[M.StartDate.name] : evt[M.StartDate.name]).getTime(),
            evEnd = (evt.data ? evt.data[M.EndDate.name] : evt[M.EndDate.name]).add(Date.SECOND, -1).getTime(),
            
            startsInRange = (evStart >= start && evStart <= end),
            endsInRange = (evEnd >= start && evEnd <= end),
            spansRange = (evStart < start && evEnd > end);
        
        return (startsInRange || endsInRange || spansRange);
    },
    
    // private
    isOverlapping : function(evt1, evt2){
        var ev1 = evt1.data ? evt1.data : evt1,
            ev2 = evt2.data ? evt2.data : evt2,
            M = Ext.ensible.cal.EventMappings,
            start1 = ev1[M.StartDate.name].getTime(),
            end1 = ev1[M.EndDate.name].add(Date.SECOND, -1).getTime(),
            start2 = ev2[M.StartDate.name].getTime(),
            end2 = ev2[M.EndDate.name].add(Date.SECOND, -1).getTime();
            
            if(end1<start1){
                end1 = start1;
            }
            if(end2<start2){
                end2 = start2;
            }
            
            var ev1startsInEv2 = (start1 >= start2 && start1 <= end2),
            ev1EndsInEv2 = (end1 >= start2 && end1 <= end2),
            ev1SpansEv2 = (start1 < start2 && end1 > end2);
        
        return (ev1startsInEv2 || ev1EndsInEv2 || ev1SpansEv2);
    },
    
    getDayEl : function(dt){
        return Ext.get(this.getDayId(dt));
    },
    
    getDayId : function(dt){
        if(Ext.isDate(dt)){
            dt = dt.format('Ymd');
        }
        return this.id + this.dayElIdDelimiter + dt;
    },
    
    /**
     * Returns the start date of the view, as set by {@link #setStartDate}. Note that this may not 
     * be the first date displayed in the rendered calendar -- to get the start and end dates displayed
     * to the user use {@link #getViewBounds}.
     * @return {Date} The start date
     */
    getStartDate : function(){
        return this.startDate;
    },

    /**
     * Sets the start date used to calculate the view boundaries to display. The displayed view will be the 
     * earliest and latest dates that match the view requirements and contain the date passed to this function.
     * @param {Date} dt The date used to calculate the new view boundaries
     */
    setStartDate : function(start, refresh){
        if(this.fireEvent('beforedatechange', this, this.startDate, start, this.viewStart, this.viewEnd) !== false){
            this.startDate = start.clearTime();
            this.setViewBounds(start);
            this.store.load({
                params: {
                    start: this.viewStart.format('m-d-Y'),
                    end: this.viewEnd.format('m-d-Y')
                }
            });
            if(refresh === true){
                this.refresh();
            }
            this.fireEvent('datechange', this, this.startDate, this.viewStart, this.viewEnd);
        }
    },
    
    // private
    setViewBounds : function(startDate){
        var start = startDate || this.startDate,
            offset = start.getDay() - this.startDay;
        
        switch(this.weekCount){
            case 0:
            case 1:
                this.viewStart = this.dayCount < 7 ? start : start.add(Date.DAY, -offset).clearTime(true);
                this.viewEnd = this.viewStart.add(Date.DAY, this.dayCount || 7).add(Date.SECOND, -1);
                return;
            
            case -1: // auto by month
                start = start.getFirstDateOfMonth();
                offset = start.getDay() - this.startDay;
                    
                this.viewStart = start.add(Date.DAY, -offset).clearTime(true);
                
                // start from current month start, not view start:
                var end = start.add(Date.MONTH, 1).add(Date.SECOND, -1);
                // fill out to the end of the week:
                this.viewEnd = end.add(Date.DAY, 6-end.getDay()); 
                return;
            
            default:
                this.viewStart = start.add(Date.DAY, -offset).clearTime(true);
                this.viewEnd = this.viewStart.add(Date.DAY, this.weekCount * 7).add(Date.SECOND, -1);
        }
    },
    
    // private
    getViewBounds : function(){
        return {
            start: this.viewStart,
            end: this.viewEnd
        }
    },
	
	/* private
	 * Sort events for a single day for display in the calendar.  This sorts allday
	 * events first, then non-allday events are sorted either based on event start
	 * priority or span priority based on the value of {@link #spansHavePriority} 
	 * (defaults to event start priority).
	 * @param {MixedCollection} evts A {@link Ext.util.MixedCollection MixedCollection}  
	 * of {@link #Ext.ensible.cal.EventRecord EventRecord} objects
	 */
	sortEventRecordsForDay: function(evts){
        if(evts.length < 2){
            return;
        }
		evts.sort('ASC', function(evtA, evtB){
			var a = evtA.data, b = evtB.data,
                M = Ext.ensible.cal.EventMappings;
			
			// Always sort all day events before anything else
			if (a[M.IsAllDay.name]) {
				return -1;
			}
			else if (b[M.IsAllDay.name]) {
				return 1;
			}
			if (this.spansHavePriority) {
				// This logic always weights span events higher than non-span events 
				// (at the possible expense of start time order). This seems to 
				// be the approach used by Google calendar and can lead to a more
				// visually appealing layout in complex cases, but event order is
				// not guaranteed to be consistent.
				var diff = Ext.ensible.Date.diffDays;
				if (diff(a[M.StartDate.name], a[M.EndDate.name]) > 0) {
					if (diff(b[M.StartDate.name], b[M.EndDate.name]) > 0) {
						// Both events are multi-day
						if (a[M.StartDate.name].getTime() == b[M.StartDate.name].getTime()) {
							// If both events start at the same time, sort the one
							// that ends later (potentially longer span bar) first
							return b[M.EndDate.name].getTime() - a[M.EndDate.name].getTime();
						}
						return a[M.StartDate.name].getTime() - b[M.StartDate.name].getTime();
					}
					return -1;
				}
				else if (diff(b[M.StartDate.name], b[M.EndDate.name]) > 0) {
					return 1;
				}
				return a[M.StartDate.name].getTime() - b[M.StartDate.name].getTime();
			}
			else {
				// Doing this allows span and non-span events to intermingle but
				// remain sorted sequentially by start time. This seems more proper
				// but can make for a less visually-compact layout when there are
				// many such events mixed together closely on the calendar.
				return a[M.StartDate.name].getTime() - b[M.StartDate.name].getTime();
			}
		}.createDelegate(this));
	},
    
    /**
     * Updates the view to contain the passed date
     * @param {Date} dt The date to display
     */
    moveTo : function(dt, noRefresh){
        if(Ext.isDate(dt)){
            this.setStartDate(dt);
            if(noRefresh!==false){
                this.refresh();
            }
            return this.startDate;
        }
        return dt;
    },

    /**
     * Updates the view to the next consecutive date(s)
     */
    moveNext : function(noRefresh){
        return this.moveTo(this.viewEnd.add(Date.DAY, 1));
    },

    /**
     * Updates the view to the previous consecutive date(s)
     */
    movePrev : function(noRefresh){
        var days = Ext.ensible.Date.diffDays(this.viewStart, this.viewEnd)+1;
        return this.moveDays(-days, noRefresh);
    },
    
    /**
     * Shifts the view by the passed number of months relative to the currently set date
     * @param {Number} value The number of months (positive or negative) by which to shift the view
     */
    moveMonths : function(value, noRefresh){
        return this.moveTo(this.startDate.add(Date.MONTH, value), noRefresh);
    },
    
    /**
     * Shifts the view by the passed number of weeks relative to the currently set date
     * @param {Number} value The number of weeks (positive or negative) by which to shift the view
     */
    moveWeeks : function(value, noRefresh){
        return this.moveTo(this.startDate.add(Date.DAY, value*7), noRefresh);
    },
    
    /**
     * Shifts the view by the passed number of days relative to the currently set date
     * @param {Number} value The number of days (positive or negative) by which to shift the view
     */
    moveDays : function(value, noRefresh){
        return this.moveTo(this.startDate.add(Date.DAY, value), noRefresh);
    },
    
    /**
     * Updates the view to show today
     */
    moveToday : function(noRefresh){
        return this.moveTo(new Date(), noRefresh);
    },
    
    /**
     * Sets the event store used by the calendar to display {@link Ext.ensible.cal.EventRecord events}.
     * @param {Ext.data.Store} store
     */
    setStore : function(store, initial){
        if(!initial && this.store){
            this.store.un("datachanged", this.onDataChanged, this);
            this.store.un("add", this.onAdd, this);
            this.store.un("remove", this.onRemove, this);
            this.store.un("update", this.onUpdate, this);
            this.store.un("clear", this.refresh, this);
        }
        if(store){
            store.on("datachanged", this.onDataChanged, this);
            store.on("add", this.onAdd, this);
            store.on("remove", this.onRemove, this);
            store.on("update", this.onUpdate, this);
            store.on("clear", this.refresh, this);
        }
        this.store = store;
        if(store && store.getCount() > 0){
            this.refresh();
        }
    },
	
    getEventRecord : function(id){
        var idx = this.store.find(Ext.ensible.cal.EventMappings.EventId.name, id);
        return this.store.getAt(idx);
    },
	
	getEventRecordFromEl : function(el){
		return this.getEventRecord(this.getEventIdFromEl(el));
	},
    
    // private
    getParams : function(){
        return {
            viewStart: this.viewStart,
            viewEnd: this.viewEnd,
            startDate: this.startDate,
            dayCount: this.dayCount,
            weekCount: this.weekCount
        };
    },
    
    // private
    getEventEditor : function(){
        // only create one instance of the edit window, even if there are multiple CalendarPanels
        this.editWin = this.editWin || Ext.WindowMgr.get('ext-cal-editwin');
         
        if(!this.editWin){
            this.editWin = new Ext.ensible.cal.EventEditWindow({
                id: 'ext-cal-editwin',
                calendarStore: this.calendarStore,
                listeners: {
                    'eventadd': {
                        fn: function(win, rec, animTarget){
                            win.hide(animTarget);
                            win.currentView.onEventAdd(null, rec);
                        },
                        scope: this
                    },
                    'eventupdate': {
                        fn: function(win, rec, animTarget){
                            win.hide(animTarget);
                            win.currentView.onEventUpdate(null, rec);
                        },
                        scope: this
                    },
                    'eventdelete': {
                        fn: function(win, rec, animTarget){
                            win.hide(animTarget);
                            win.currentView.onEventDelete(null, rec);
                        },
                        scope: this
                    },
                    'editdetails': {
                        fn: function(win, rec, animTarget, view){
                            win.hide(animTarget);
                            win.currentView.fireEvent('editdetails', win.currentView, rec, animTarget);
                        },
                        scope: this
                    },
                    'eventcancel': {
                        fn: function(win, rec, animTarget){
                            win.hide(animTarget);
                            win.currentView.onEventCancel();
                        },
                        scope: this
                    }
                }
            });
        }
        
        // allows the window to reference the current scope in its callbacks
        this.editWin.currentView = this;
        return this.editWin;
    },
    
    /**
     * Show the currently configured event editor view (by default the shared instance of 
     * {@link Ext.ensible.cal.EventEditWindow EventEditWindow}).
     * @param {Ext.ensible.cal.EventRecord} rec The event record
     * @param {Ext.Element/HTMLNode} animateTarget The reference element that is being edited. By default this is
     * used as the target for animating the editor window opening and closing. If this method is being overridden to
     * supply a custom editor this parameter can be ignored if it does not apply.
     */
    showEventEditor : function(rec, animateTarget){
        this.getEventEditor().show(rec, animateTarget, this);
    },
    
    // private
    onEventAdd: function(form, rec){
        rec.data[Ext.ensible.cal.EventMappings.IsNew.name] = false;
        this.store.add(rec);
        this.fireEvent('eventadd', this, rec);
    },
    
    // private
    onEventUpdate: function(form, rec){
        rec.commit();
        this.fireEvent('eventupdate', this, rec);
    },
    
    // private
    onEventDelete: function(form, rec){
        this.store.remove(rec);
        this.fireEvent('eventdelete', this, rec);
    },
    
    // private
    onEventCancel: function(form, rec){
        this.fireEvent('eventcancel', this, rec);
    },
    
    // private -- called from subclasses
    onDayClick: function(dt, ad, el){
        if(this.fireEvent('dayclick', this, dt, ad, el) !== false){
            this.showEventEditor({
                StartDate: dt,
                IsAllDay: ad
            }, el);
        }
    },
    
    // private
    onRangeSelect: function(dates, el, onComplete){
        if(this.fireEvent('rangeselect', this, dates, el, onComplete) !== false){
            this.showEventEditor(dates, el);
            this.editWin.on('hide', onComplete, this, {single:true});
        }
    },
    
    // private
    showEventMenu : function(el, xy){
        if(!this.eventMenu){
            var dateMenu = new Ext.menu.DateMenu({
                handler: function(dp, dt){
                    this.menuActive = false;
                    dt = Ext.ensible.Date.copyTime(this.eventMenu.rec.data[Ext.ensible.cal.EventMappings.StartDate.name], dt);
                    this.moveEvent(this.eventMenu.rec, dt);
                },
                scope: this
            });
            this.eventMenu = new Ext.menu.Menu({
                id: this.id+'-evt-ctxmenu',
                items: [{
                    iconCls:'extensible-cal-icon-evt-edit',
                    text: 'Edit Details',
                    scope: this,
                    handler: function(){
                        this.menuActive = false;
                        this.fireEvent('editdetails', this, this.eventMenu.rec, this.eventMenu.ctxEl);
                    }
                },{
                    text: 'Delete',
                    iconCls:'extensible-cal-icon-evt-del',
                    scope: this,
                    handler:function(){
                        this.menuActive = false;
                        this.deleteEvent(this.eventMenu.rec, this.eventMenu.ctxEl);
                    }
                },'-',{
                    iconCls:'extensible-cal-icon-evt-move',
                    text:'Move to...',
                    scope: this,
                    menu: dateMenu
                }]
            });
            this.eventMenu.on('hide', this.onEventContextHide, this);
            this.eventMenu.datePicker = dateMenu.picker;
        }
        if(this.eventMenu.ctxEl){
            this.eventMenu.ctxEl = null;
        }
        this.eventMenu.ctxEl = el;
        this.eventMenu.rec = this.getEventRecordFromEl(el); 
        this.eventMenu.datePicker.setValue(this.eventMenu.rec.data[Ext.ensible.cal.EventMappings.StartDate.name]);
        this.eventMenu.showAt(xy);
        this.menuActive = true;
    },
    
    moveEvent : function(rec, dt){
        if(Ext.ensible.Date.compare(rec.data[Ext.ensible.cal.EventMappings.StartDate.name], dt) === 0){
            // no changes
            return;
        }
        if(this.fireEvent('beforeeventmove', this, rec) !== false){
            var diff = dt.getTime() - rec.data[Ext.ensible.cal.EventMappings.StartDate.name].getTime();
            rec.set(Ext.ensible.cal.EventMappings.StartDate.name, dt);
            rec.set(Ext.ensible.cal.EventMappings.EndDate.name, rec.data[Ext.ensible.cal.EventMappings.EndDate.name].add(Date.MILLI, diff));
            this.onEventUpdate(null, rec);
            
            this.fireEvent('eventmove', this, rec);
        }
    },
    
    // private
    deleteEvent: function(rec, el){
        if(this.fireEvent('beforeeventdelete', this, rec, el) !== false){
            this.store.remove(rec);
            this.fireEvent('eventdelete', this, rec, el);
        }
    },
    
    // private
    onEventContextHide : function(){
        if(this.eventMenu.ctxEl){
            this.eventMenu.ctxEl = null;
        }
    },
    
    // private
    onContextMenu : function(e, t){
        var match = false;
        
        if(el = e.getTarget(this.eventSelector, 5, true)){
            this.showEventMenu(el, e.getXY());
            match = true;
        }
        
        if(match || this.suppressBrowserContextMenu === true){
            e.preventDefault();
        }
    },
    
    /*
     * Shared click handling.  Each specific view also provides view-specific
     * click handling that calls this first.  This method returns true if it
     * can handle the click (and so the subclass should ignore it) else false.
     */
    onClick : function(e, t){
        if(this.menuActive === true){
            // ignore the first click if a context menu is active (let it close)
            this.menuActive = false;
            return true;
        }
        var el = e.getTarget(this.eventSelector, 5);
        if(el){
            var id = this.getEventIdFromEl(el),
                rec = this.getEventRecord(id);
            
            if(this.fireEvent('eventclick', this, rec, el) !== false){
                this.showEventEditor(rec, el);
            }
            return true;
        }
    },
    
    // private
    onMouseOver : function(e, t){
        if(this.trackMouseOver !== false && (this.dragZone == undefined || !this.dragZone.dragging)){
            if(!this.handleEventMouseEvent(e, t, 'over')){
                this.handleDayMouseEvent(e, t, 'over');
            }
        }
    },
    
    // private
    onMouseOut : function(e, t){
        if(this.trackMouseOver !== false && (this.dragZone == undefined || !this.dragZone.dragging)){
            if(!this.handleEventMouseEvent(e, t, 'out')){
                this.handleDayMouseEvent(e, t, 'out');
            }
        }
    },
    
    // private
    handleEventMouseEvent : function(e, t, type){
        var el;
        if(el = e.getTarget(this.eventSelector, 5, true)){
            var rel = Ext.get(e.getRelatedTarget());
            if(el == rel || el.contains(rel)){
                return true;
            }
            
            var evtId = this.getEventIdFromEl(el);
            
            if(this.eventOverClass != ''){
                var els = this.getEventEls(evtId);
                els[type == 'over' ? 'addClass' : 'removeClass'](this.eventOverClass);
            }
            this.fireEvent('event'+type, this, this.getEventRecord(evtId), el);
            return true;
        }
        return false;
    },
    
    // private
    getDateFromId : function(id, delim){
        var parts = id.split(delim);
        return parts[parts.length-1];
    },
    
    // private
    handleDayMouseEvent : function(e, t, type){
        if(t = e.getTarget('td', 3)){
            if(t.id && t.id.indexOf(this.dayElIdDelimiter) > -1){
                var dt = this.getDateFromId(t.id, this.dayElIdDelimiter),
                    rel = Ext.get(e.getRelatedTarget()),
                    relTD, relDate;
                
                if(rel){
                    relTD = rel.is('td') ? rel : rel.up('td', 3);
                    relDate = relTD && relTD.id ? this.getDateFromId(relTD.id, this.dayElIdDelimiter) : '';
                }
                if(!rel || dt != relDate){
                    var el = this.getDayEl(dt);
                    if(el && this.dayOverClass != ''){
                        el[type == 'over' ? 'addClass' : 'removeClass'](this.dayOverClass);
                    }
                    this.fireEvent('day'+type, this, Date.parseDate(dt, "Ymd"), el);
                }
            }
        }
    },
    
    // private, MUST be implemented by subclasses
    renderItems : function(){
        throw 'This method must be implemented by a subclass';
    }
});/**
 * @class Ext.ensible.cal.MonthView
 * @extends Ext.ensible.cal.CalendarView
 * <p>Displays a calendar view by month. This class does not usually need ot be used directly as you can
 * use a {@link Ext.ensible.cal.CalendarPanel CalendarPanel} to manage multiple calendar views at once including
 * the month view.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.ensible.cal.MonthView = Ext.extend(Ext.ensible.cal.CalendarView, {
    /**
     * @cfg {Boolean} showTime
     * True to display the current time in today's box in the calendar, false to not display it (defautls to true)
     */
    showTime: true,
    /**
     * @cfg {Boolean} showTodayText
     * True to display the {@link #todayText} string in today's box in the calendar, false to not display it (defautls to true)
     */
    showTodayText: true,
    /**
     * @cfg {String} todayText
     * The text to display in the current day's box in the calendar when {@link #showTodayText} is true (defaults to 'Today')
     */
    todayText: 'Today',
    /**
     * @cfg {Boolean} showHeader
     * True to display a header beneath the navigation bar containing the week names above each week's column, false not to 
     * show it and instead display the week names in the first row of days in the calendar (defaults to false).
     */
    showHeader: false,
    /**
     * @cfg {Boolean} showWeekLinks
     * True to display an extra column before the first day in the calendar that links to the {@link Ext.ensible.cal.WeekView view}
     * for each individual week, false to not show it (defaults to false). If true, the week links can also contain the week 
     * number depending on the value of {@link #showWeekNumbers}.
     */
    showWeekLinks: false,
    /**
     * @cfg {Boolean} showWeekNumbers
     * True to show the week number for each week in the calendar in the week link column, false to show nothing (defaults to false).
     * Note that if {@link #showWeekLinks} is false this config will have no affect even if true.
     */
    showWeekNumbers: false,
    /**
     * @cfg {String} weekLinkOverClass
     * The CSS class name applied when the mouse moves over a week link element (only applies when {@link #showWeekLinks} is true,
     * defaults to 'ext-week-link-over').
     */
    weekLinkOverClass: 'ext-week-link-over',
    
    //private properties -- do not override:
    daySelector: '.ext-cal-day',
    moreSelector : '.ext-cal-ev-more',
    weekLinkSelector : '.ext-cal-week-link',
    weekCount: -1, // defaults to auto by month
    dayCount: 7,
	moreElIdDelimiter: '-more-',
    weekLinkIdDelimiter: 'ext-cal-week-',
    
    // private
    initComponent : function(){
        Ext.ensible.cal.MonthView.superclass.initComponent.call(this);
        this.addEvents({
            /**
             * @event dayclick
             * Fires after the user clicks within the view container and not on an event element
             * @param {Ext.ensible.cal.MonthView} this
             * @param {Date} dt The date/time that was clicked on
             * @param {Boolean} allday True if the day clicked on represents an all-day box, else false. Clicks within the 
             * MonthView always return true for this param.
             * @param {Ext.Element} el The Element that was clicked on
             */
            dayclick: true,
            /**
             * @event weekclick
             * Fires after the user clicks within a week link (when {@link #showWeekLinks is true)
             * @param {Ext.ensible.cal.MonthView} this
             * @param {Date} dt The start date of the week that was clicked on
             */
            weekclick: true,
            // inherited docs
            dayover: true,
            // inherited docs
            dayout: true
        });
    },
	
    // private
	initDD : function(){
		var cfg = {
			view: this,
			createText: this.ddCreateEventText,
			moveText: this.ddMoveEventText,
            ddGroup : 'MonthViewDD'
		};
        
        this.dragZone = new Ext.ensible.cal.DragZone(this.el, cfg);
        this.dropZone = new Ext.ensible.cal.DropZone(this.el, cfg);
	},
    
    // private
    onDestroy : function(){
        Ext.destroy(this.ddSelector);
		Ext.destroy(this.dragZone);
		Ext.destroy(this.dropZone);
        Ext.ensible.cal.MonthView.superclass.onDestroy.call(this);
    },
    
    // private
    afterRender : function(){
        if(!this.tpl){
            this.tpl = new Ext.ensible.cal.MonthViewTemplate({
                id: this.id,
                showTodayText: this.showTodayText,
                todayText: this.todayText,
                showTime: this.showTime,
                showHeader: this.showHeader,
                showWeekLinks: this.showWeekLinks,
                showWeekNumbers: this.showWeekNumbers
            });
        }
        this.tpl.compile();
        this.addClass('ext-cal-monthview ext-cal-ct');
        
        Ext.ensible.cal.MonthView.superclass.afterRender.call(this);
    },
	
    // private
	onResize : function(){
		if(this.monitorResize){
			this.maxEventsPerDay = this.getMaxEventsPerDay();
			this.refresh();
        }
	},
    
    // private
    forceSize: function(){
        // Compensate for the week link gutter width if visible
        if(this.showWeekLinks && this.el && this.el.child){
            var hd = this.el.select('.ext-cal-hd-days-tbl'),
                bgTbl = this.el.select('.ext-cal-bg-tbl'),
                evTbl = this.el.select('.ext-cal-evt-tbl'),
                wkLinkW = this.el.child('.ext-cal-week-link').getWidth(),
                w = this.el.getWidth()-wkLinkW;
            
            hd.setWidth(w);
            bgTbl.setWidth(w);
            evTbl.setWidth(w);
        }
        Ext.ensible.cal.MonthView.superclass.forceSize.call(this);
    },
    
    //private
    initClock : function(){
        if(Ext.fly(this.id+'-clock') !== null){
            this.prevClockDay = new Date().getDay();
            if(this.clockTask){
                Ext.TaskMgr.stop(this.clockTask);
            }
            this.clockTask = Ext.TaskMgr.start({
                run: function(){ 
                    var el = Ext.fly(this.id+'-clock'),
                        t = new Date();
                        
                    if(t.getDay() == this.prevClockDay){
                        if(el){
                            el.update(t.format('g:i a'));
                        }
                    }
                    else{
                        this.prevClockDay = t.getDay();
                        this.moveTo(t);
                    }
                },
                scope: this,
                interval: 1000
            });
        }
    },

    // inherited docs
    getEventBodyMarkup : function(){
        if(!this.eventBodyMarkup){
            this.eventBodyMarkup = ['{Title}',
	            '<tpl if="_isReminder">',
	                '<i class="ext-cal-ic ext-cal-ic-rem">&nbsp;</i>',
	            '</tpl>',
	            '<tpl if="_isRecurring">',
	                '<i class="ext-cal-ic ext-cal-ic-rcr">&nbsp;</i>',
	            '</tpl>',
	            '<tpl if="spanLeft">',
	                '<i class="ext-cal-spl">&nbsp;</i>',
	            '</tpl>',
	            '<tpl if="spanRight">',
	                '<i class="ext-cal-spr">&nbsp;</i>',
	            '</tpl>'
	        ].join('');
        }
        return this.eventBodyMarkup;
    },
    
    // inherited docs
    getEventTemplate : function(){
        if(!this.eventTpl){
	        var tpl, body = this.getEventBodyMarkup();
            
	        tpl = !(Ext.isIE || Ext.isOpera) ? 
				new Ext.XTemplate(
		            '<div id="{_elId}" class="{_selectorCls} {_colorCls} {values.spanCls} ext-cal-evt ext-cal-evr">',
		                body,
		            '</div>'
		        ) 
				: new Ext.XTemplate(
		            '<tpl if="_renderAsAllDay">',
		                '<div id="{_elId}" class="{_selectorCls} {values.spanCls} {_colorCls} ext-cal-evt ext-cal-evo">',
		                    '<div class="ext-cal-evm">',
		                        '<div class="ext-cal-evi">',
		            '</tpl>',
		            '<tpl if="!_renderAsAllDay">',
		                '<div id="{_elId}" class="{_selectorCls} {_colorCls} ext-cal-evt ext-cal-evr">',
		            '</tpl>',
		            body,
		            '<tpl if="_renderAsAllDay">',
		                        '</div>',
		                    '</div>',
		            '</tpl>',
		                '</div>'
	        	);
            tpl.compile();
            this.eventTpl = tpl;
        }
        return this.eventTpl;
    },
    
    // private
    getTemplateEventData : function(evt){
		var M = Ext.ensible.cal.EventMappings,
            selector = this.getEventSelectorCls(evt[M.EventId.name]),
		    title = evt[M.Title.name];
            
        return Ext.applyIf({
			_selectorCls: selector,
			_colorCls: 'ext-color-' + (evt[M.CalendarId.name] ? 
                evt[M.CalendarId.name] : 'default') + (evt._renderAsAllDay ? '-ad' : ''),
            _elId: selector + '-' + evt._weekIndex,
            _isRecurring: evt.Recurrence && evt.Recurrence != '',
            _isReminder: evt[M.Reminder.name] && evt[M.Reminder.name] != '',
            Title: (evt[M.IsAllDay.name] ? '' : evt[M.StartDate.name].format('g:ia ')) + (!title || title.length == 0 ? '(No title)' : title)
        }, evt);
    },
    
    // private
	refresh : function(){
		if(this.detailPanel){
			this.detailPanel.hide();
		}
		Ext.ensible.cal.MonthView.superclass.refresh.call(this);
        
        if(this.showTime !== false){
            this.initClock();
        }
	},
    
    // private
    renderItems : function(){
        Ext.ensible.cal.WeekEventRenderer.render({
            eventGrid: this.allDayOnly ? this.allDayGrid : this.eventGrid,
            viewStart: this.viewStart,
            tpl: this.getEventTemplate(),
            maxEventsPerDay: this.maxEventsPerDay,
            id: this.id,
            templateDataFn: this.getTemplateEventData.createDelegate(this),
            evtMaxCount: this.evtMaxCount,
            weekCount: this.weekCount,
            dayCount: this.dayCount
        });
        this.fireEvent('eventsrendered', this);
    },
	
    // private
	getDayEl : function(dt){
		return Ext.get(this.getDayId(dt));
	},
	
    // private
	getDayId : function(dt){
		if(Ext.isDate(dt)){
			dt = dt.format('Ymd');
		}
		return this.id + this.dayElIdDelimiter + dt;
	},
	
    // private
	getWeekIndex : function(dt){
		var el = this.getDayEl(dt).up('.ext-cal-wk-ct');
		return parseInt(el.id.split('-wk-')[1]);
	},
	
    // private
	getDaySize : function(contentOnly){
		var box = this.el.getBox(), 
			w = box.width / this.dayCount,
			h = box.height / this.getWeekCount();
		
		if(contentOnly){
            // measure last row instead of first in case text wraps in first row
			var hd = this.el.select('.ext-cal-dtitle').last().parent('tr');
			h = hd ? h-hd.getHeight(true) : h;
		}
		return {height: h, width: w};
	},
    
    // private
    getEventHeight : function(){
        if(!this.eventHeight){
            var evt = this.el.select('.ext-cal-evt').first();
            this.eventHeight = evt ? evt.parent('tr').getHeight() : 18;
        }
        return this.eventHeight;
    },
	
    // private
	getMaxEventsPerDay : function(){
		var dayHeight = this.getDaySize(true).height,
			h = this.getEventHeight(),
            max = Math.max(Math.floor((dayHeight-h) / h), 0);
		
		return max;
	},
	
    // private
	getDayAt : function(x, y){
		var box = this.el.getBox(), 
			daySize = this.getDaySize(),
			dayL = Math.floor(((x - box.x) / daySize.width)),
			dayT = Math.floor(((y - box.y) / daySize.height)),
			days = (dayT * 7) + dayL;
		
		var dt = this.viewStart.add(Date.DAY, days);
		return {
			date: dt,
			el: this.getDayEl(dt)
		}
	},
    
    // inherited docs
    moveNext : function(){
        return this.moveMonths(1);
    },
    
    // inherited docs
    movePrev : function(){
        return this.moveMonths(-1);
    },
    
    // private
	onInitDrag : function(){
        Ext.ensible.cal.MonthView.superclass.onInitDrag.call(this);
		Ext.select(this.daySelector).removeClass(this.dayOverClass);
		if(this.detailPanel){
			this.detailPanel.hide();
		}
	},
	
    // private
	onMoreClick : function(dt){
		if(!this.detailPanel){
	        this.detailPanel = new Ext.Panel({
				id: this.id+'-details-panel',
				title: dt.format('F j'),
				layout: 'fit',
				floating: true,
				renderTo: Ext.getBody(),
				tools: [{
					id: 'close',
					handler: function(e, t, p){
						p.hide();
					}
				}],
				items: {
					xtype: 'extensible.monthdaydetailview',
					id: this.id+'-details-view',
					date: dt,
					view: this,
					store: this.store,
					listeners: {
						'eventsrendered': this.onDetailViewUpdated.createDelegate(this)
					}
				}
			});
		}
		else{
			this.detailPanel.setTitle(dt.format('F j'));
		}
		this.detailPanel.getComponent(this.id+'-details-view').update(dt);
	},
	
    // private
	onDetailViewUpdated : function(view, dt, numEvents){
		var p = this.detailPanel,
			frameH = p.getFrameHeight(),
            evtH = this.getEventHeight(),
			bodyH = frameH + (numEvents * evtH) + 3,
			dayEl = this.getDayEl(dt),
			box = dayEl.getBox();
		
		p.setHeight(bodyH);
		p.setWidth(Math.max(box.width, 220));
		p.show();
		p.getPositionEl().alignTo(dayEl, 't-t?');
	},
    
    // private
    onHide : function(){
        Ext.ensible.cal.MonthView.superclass.onHide.call(this);
        if(this.detailPanel){
            this.detailPanel.hide();
        }
    },
	
    // private
    onClick : function(e, t){
        if(this.detailPanel){
            this.detailPanel.hide();
        }
        if(Ext.ensible.cal.MonthView.superclass.onClick.apply(this, arguments)){
            // The superclass handled the click already so exit
            return;
        }
		if(this.dropZone){
			this.dropZone.clearShims();
		}
        if(el = e.getTarget(this.weekLinkSelector, 3)){
            var dt = el.id.split(this.weekLinkIdDelimiter)[1];
            this.fireEvent('weekclick', this, Date.parseDate(dt, 'Ymd'));
            return;
        }
		if(el = e.getTarget(this.moreSelector, 3)){
			var dt = el.id.split(this.moreElIdDelimiter)[1];
			this.onMoreClick(Date.parseDate(dt, 'Ymd'));
			return;
		}
        if(el = e.getTarget('td', 3)){
            if(el.id && el.id.indexOf(this.dayElIdDelimiter) > -1){
                var parts = el.id.split(this.dayElIdDelimiter),
                    dt = parts[parts.length-1];
                    
                //this.fireEvent('dayclick', this, Date.parseDate(dt, 'Ymd'), false, Ext.get(this.getDayId(dt)));
                this.onDayClick(Date.parseDate(dt, 'Ymd'), false, Ext.get(this.getDayId(dt)));
                return;
            }
        }
    },
    
    // private
    handleDayMouseEvent : function(e, t, type){
        var el = e.getTarget(this.weekLinkSelector, 3, true);
        if(el){
            el[type == 'over' ? 'addClass' : 'removeClass'](this.weekLinkOverClass);
            return;
        }
        Ext.ensible.cal.MonthView.superclass.handleDayMouseEvent.apply(this, arguments);
    }
});

Ext.reg('extensible.monthview', Ext.ensible.cal.MonthView);
/**
 * @class Ext.ensible.cal.DayHeaderView
 * @extends Ext.ensible.cal.MonthView
 * <p>This is the header area container within the day and week views where all-day events are displayed.
 * Normally you should not need to use this class directly -- instead you should use {@link Ext.ensible.cal.DayView DayView}
 * which aggregates this class and the {@link Ext.ensible.cal.DayBodyView DayBodyView} into the single unified view
 * presented by {@link Ext.ensible.cal.CalendarPanel CalendarPanel}.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.ensible.cal.DayHeaderView = Ext.extend(Ext.ensible.cal.MonthView, {
    // private configs
    weekCount: 1,
    dayCount: 1,
    allDayOnly: true,
    monitorResize: false,
    
    /**
     * @event dayclick
     * Fires after the user clicks within the day view container and not on an event element
     * @param {Ext.ensible.cal.DayBodyView} this
     * @param {Date} dt The date/time that was clicked on
     * @param {Boolean} allday True if the day clicked on represents an all-day box, else false. Clicks within the 
     * DayHeaderView always return true for this param.
     * @param {Ext.Element} el The Element that was clicked on
     */
    
    // private
    afterRender : function(){
        if(!this.tpl){
            this.tpl = new Ext.ensible.cal.DayHeaderTemplate({
                id: this.id,
                showTodayText: this.showTodayText,
                todayText: this.todayText,
                showTime: this.showTime
            });
        }
        this.tpl.compile();
        this.addClass('ext-cal-day-header');
        
        Ext.ensible.cal.DayHeaderView.superclass.afterRender.call(this);
    },
    
    // private
    forceSize: Ext.emptyFn,
    
    // private
    refresh : function(){
        Ext.ensible.cal.DayHeaderView.superclass.refresh.call(this);
        this.recalcHeaderBox();
    },
    
    // private
    recalcHeaderBox : function(){
        var tbl = this.el.child('.ext-cal-evt-tbl'),
            h = tbl.getHeight();
        
        this.el.setHeight(h+7);
        
        if(Ext.isIE && Ext.isStrict){
            this.el.child('.ext-cal-hd-ad-inner').setHeight(h+4);
        }
        if(Ext.isOpera){
            //TODO: figure out why Opera refuses to refresh height when
            //the new height is lower than the previous one
//            var ct = this.el.child('.ext-cal-hd-ct');
//            ct.repaint();
        }
    },
    
    // private
    moveNext : function(noRefresh){
        this.moveDays(this.dayCount, noRefresh);
    },

    // private
    movePrev : function(noRefresh){
        this.moveDays(-this.dayCount, noRefresh);
    },
    
    // private
    onClick : function(e, t){
        if(el = e.getTarget('td', 3)){
            if(el.id && el.id.indexOf(this.dayElIdDelimiter) > -1){
                var parts = el.id.split(this.dayElIdDelimiter),
                    dt = parts[parts.length-1];
                    
                this.fireEvent('dayclick', this, Date.parseDate(dt, 'Ymd'), true, Ext.get(this.getDayId(dt)));
                return;
            }
        }
        Ext.ensible.cal.DayHeaderView.superclass.onClick.apply(this, arguments);
    }
});

Ext.reg('extensible.dayheaderview', Ext.ensible.cal.DayHeaderView);
/**S
 * @class Ext.ensible.cal.DayBodyView
 * @extends Ext.ensible.cal.CalendarView
 * <p>This is the scrolling container within the day and week views where non-all-day events are displayed.
 * Normally you should not need to use this class directly -- instead you should use {@link Ext.ensible.cal.DayView DayView}
 * which aggregates this class and the {@link Ext.ensible.cal.DayHeaderView DayHeaderView} into the single unified view
 * presented by {@link Ext.ensible.cal.CalendarPanel CalendarPanel}.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.ensible.cal.DayBodyView = Ext.extend(Ext.ensible.cal.CalendarView, {
    //private
    dayColumnElIdDelimiter: '-day-col-',
    
    //private
    initComponent : function(){
        Ext.ensible.cal.DayBodyView.superclass.initComponent.call(this);
        
        this.addEvents({
            /**
             * @event beforeeventresize
             * Fires after the user drags the resize handle of an event to resize it, but before the resize operation is carried out.
             * This is a cancelable event, so returning false from a handler will cancel the resize operation.
             * @param {Ext.ensible.cal.DayBodyView} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that was resized
             * containing the updated start and end dates
             */
            beforeeventresize: true,
            /**
             * @event eventresize
             * Fires after the user drags the resize handle of an event and the resize operation is complete.
             * @param {Ext.ensible.cal.DayBodyView} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that was resized
             * containing the updated start and end dates
             */
            eventresize: true,
            /**
             * @event dayclick
             * Fires after the user clicks within the day view container and not on an event element
             * @param {Ext.ensible.cal.DayBodyView} this
             * @param {Date} dt The date/time that was clicked on
             * @param {Boolean} allday True if the day clicked on represents an all-day box, else false. Clicks within the 
             * DayBodyView always return false for this param.
             * @param {Ext.Element} el The Element that was clicked on
             */
            dayclick: true
        });
    },
    
    //private
    initDD : function(){
        var cfg = {
            createText: this.ddCreateEventText,
            moveText: this.ddMoveEventText,
            resizeText: this.ddResizeEventText
        };

        this.el.ddScrollConfig = {
            // scrolling is buggy in IE/Opera for some reason.  A larger vthresh
            // makes it at least functional if not perfect
            vthresh: Ext.isIE || Ext.isOpera ? 100 : 40,
            hthresh: -1,
            frequency: 50,
            increment: 100,
            ddGroup: 'DayViewDD'
        };
        this.dragZone = new Ext.ensible.cal.DayViewDragZone(this.el, Ext.apply({
            view: this,
            containerScroll: true
        }, cfg));
        
        this.dropZone = new Ext.ensible.cal.DayViewDropZone(this.el, Ext.apply({
            view: this
        }, cfg));
    },
    
    //private
    refresh : function(){
        var top = this.el.getScroll().top;
        this.prepareData();
        this.renderTemplate();
        this.renderItems();
        
        // skip this if the initial render scroll position has not yet been set.
        // necessary since IE/Opera must be deferred, so the first refresh will
        // override the initial position by default and always set it to 0.
        if(this.scrollReady){
            this.scrollTo(top);
        }
    },

    /**
     * Scrolls the container to the specified vertical position. If the view is large enough that
     * there is no scroll overflow then this method will have no affect.
     * @param {Number} y The new vertical scroll position in pixels 
     * @param {Boolean} defer (optional) <p>True to slightly defer the call, false to execute immediately.</p> 
     * <p>This method will automatically defer itself for IE and Opera (even if you pass false) otherwise
     * the scroll position will not update in those browsers. You can optionally pass true, however, to
     * force the defer in all browsers, or use your own custom conditions to determine whether this is needed.</p>
     * <p>Note that this method should not generally need to be called directly as scroll position is managed internally.</p>
     */
    scrollTo : function(y, defer){
        defer = defer || (Ext.isIE || Ext.isOpera);
        if(defer){
            (function(){
                this.el.scrollTo('top', y);
                this.scrollReady = true;
            }).defer(10, this);
        }
        else{
            this.el.scrollTo('top', y);
            this.scrollReady = true;
        }
    },

    // private
    afterRender : function(){
        if(!this.tpl){
            this.tpl = new Ext.ensible.cal.DayBodyTemplate({
                id: this.id,
                dayCount: this.dayCount,
                showTodayText: this.showTodayText,
                todayText: this.todayText,
                showTime: this.showTime
            });
        }
        this.tpl.compile();
        
        this.addClass('ext-cal-body-ct');
        
        Ext.ensible.cal.DayBodyView.superclass.afterRender.call(this);
        
        // default scroll position to 7am:
        this.scrollTo(7*42);
    },
    
    // private
    forceSize: Ext.emptyFn,
    
    // private -- called from DayViewDropZone
    onEventResize : function(rec, data){
        if(this.fireEvent('beforeeventresize', this, rec) !== false){
            var D = Ext.ensible.Date,
                start = Ext.ensible.cal.EventMappings.StartDate.name,
                end = Ext.ensible.cal.EventMappings.EndDate.name;
                
            if(D.compare(rec.data[start], data.StartDate) === 0 &&
                D.compare(rec.data[end], data.EndDate) === 0){
                // no changes
                return;
            } 
            rec.set(start, data.StartDate);
            rec.set(end, data.EndDate);
            this.onEventUpdate(null, rec);
            
            this.fireEvent('eventresize', this, rec);
        }
    },

    // inherited docs
    getEventBodyMarkup : function(){
        if(!this.eventBodyMarkup){
            this.eventBodyMarkup = ['{Title}',
                '<tpl if="_isReminder">',
                    '<i class="ext-cal-ic ext-cal-ic-rem">&nbsp;</i>',
                '</tpl>',
                '<tpl if="_isRecurring">',
                    '<i class="ext-cal-ic ext-cal-ic-rcr">&nbsp;</i>',
                '</tpl>'
//                '<tpl if="spanLeft">',
//                    '<i class="ext-cal-spl">&nbsp;</i>',
//                '</tpl>',
//                '<tpl if="spanRight">',
//                    '<i class="ext-cal-spr">&nbsp;</i>',
//                '</tpl>'
            ].join('');
        }
        return this.eventBodyMarkup;
    },
    
    // inherited docs
    getEventTemplate : function(){
        if(!this.eventTpl){
            this.eventTpl = !(Ext.isIE || Ext.isOpera) ? 
                new Ext.XTemplate(
                    '<div id="{_elId}" class="{_selectorCls} {_colorCls} ext-cal-evt ext-cal-evr" style="left: {_left}%; width: {_width}%; top: {_top}px; height: {_height}px;">',
                        '<div class="ext-evt-bd">', this.getEventBodyMarkup(), '</div>',
                        '<div class="ext-evt-rsz"><div class="ext-evt-rsz-h">&nbsp;</div></div>',
                    '</div>'
                )
                : new Ext.XTemplate(
                    '<div id="{_elId}" class="ext-cal-evt {_selectorCls} {_colorCls}-x" style="left: {_left}%; width: {_width}%; top: {_top}px;">',
                        '<div class="ext-cal-evb">&nbsp;</div>',
                        '<dl style="height: {_height}px;" class="ext-cal-evdm">',
                            '<dd class="ext-evt-bd">',
                                this.getEventBodyMarkup(),
                            '</dd>',
                            '<div class="ext-evt-rsz"><div class="ext-evt-rsz-h">&nbsp;</div></div>',
                        '</dl>',
                        '<div class="ext-cal-evb">&nbsp;</div>',
                    '</div>'
                );
            this.eventTpl.compile();
        }
        return this.eventTpl;
    },
    
    /**
     * <p>Returns the XTemplate that is bound to the calendar's event store (it expects records of type
     * {@link Ext.ensible.cal.EventRecord}) to populate the calendar views with <strong>all-day</strong> events. 
     * Internally this method by default generates different markup for browsers that support CSS border radius 
     * and those that don't. This method can be overridden as needed to customize the markup generated.</p>
     * <p>Note that this method calls {@link #getEventBodyMarkup} to retrieve the body markup for events separately
     * from the surrounding container markup.  This provdes the flexibility to customize what's in the body without
     * having to override the entire XTemplate. If you do override this method, you should make sure that your 
     * overridden version also does the same.</p>
     * @return {Ext.XTemplate} The event XTemplate
     */
    getEventAllDayTemplate : function(){
        if(!this.eventAllDayTpl){
            var tpl, body = this.getEventBodyMarkup();
            
            tpl = !(Ext.isIE || Ext.isOpera) ? 
                new Ext.XTemplate(
                    '<div id="{_elId}" class="{_selectorCls} {_colorCls} {values.spanCls} ext-cal-evt ext-cal-evr" style="left: {_left}%; width: {_width}%; top: {_top}px; height: {_height}px;">',
                        body,
                    '</div>'
                ) 
                : new Ext.XTemplate(
                    '<div id="{_elId}" class="ext-cal-evt" style="left: {_left}%; width: {_width}%; top: {_top}px; height: {_height}px;">',
                    '<div class="{_selectorCls} {values.spanCls} {_colorCls} ext-cal-evo">',
                        '<div class="ext-cal-evm">',
                            '<div class="ext-cal-evi">',
                                body,
                            '</div>',
                        '</div>',
                    '</div></div>'
                );
            tpl.compile();
            this.eventAllDayTpl = tpl;
        }
        return this.eventAllDayTpl;
    },
    
    // private
    getTemplateEventData : function(evt){
        var selector = this.getEventSelectorCls(evt[Ext.ensible.cal.EventMappings.EventId.name]),
            data = {},
            M = Ext.ensible.cal.EventMappings;
        
        this.getTemplateEventBox(evt);
        
        data._selectorCls = selector;
        data._colorCls = 'ext-color-' + (evt[M.CalendarId.name] ? 
                evt[M.CalendarId.name] : 'default') + (evt._renderAsAllDay ? '-ad' : '');
        data._elId = selector + (evt._weekIndex ? '-' + evt._weekIndex : '');
        data._isRecurring = evt.Recurrence && evt.Recurrence != '';
        data._isReminder = evt[M.Reminder.name] && evt[M.Reminder.name] != '';
        var title = evt[M.Title.name];
        data.Title = (evt[M.IsAllDay.name] ? '' : evt[M.StartDate.name].format('g:ia ')) + (!title || title.length == 0 ? '(No title)' : title);
        
        return Ext.applyIf(data, evt);
    },
    
    // private
    getTemplateEventBox : function(evt){
        var heightFactor = .7,
            start = evt[Ext.ensible.cal.EventMappings.StartDate.name],
            end = evt[Ext.ensible.cal.EventMappings.EndDate.name],
            startMins = start.getHours() * 60 + start.getMinutes(),
            endMins = end.getHours() * 60 + end.getMinutes(), 
            diffMins = endMins - startMins;
        
        evt._left = 0;
        evt._width = 100;
        evt._top = Math.round(startMins * heightFactor) + 1;
        evt._height = Math.max((diffMins * heightFactor) - 2, 15);
    },

    // private
    renderItems: function(){
        var day = 0, evts = [];
        for(; day < this.dayCount; day++){
            var ev = emptyCells = skipped = 0, 
                d = this.eventGrid[0][day],
                ct = d ? d.length : 0, 
                evt;
            
            for(; ev < ct; ev++){
                evt = d[ev];
                if(!evt){
                    continue;
                }
                var item = evt.data || evt.event.data;
                if(item._renderAsAllDay){
                    continue;
                }
                Ext.apply(item, {
                    cls: 'ext-cal-ev',
                    _positioned: true
                });
                evts.push({
                    data: this.getTemplateEventData(item),
                    date: this.viewStart.add(Date.DAY, day)
                });
            }
        }
        
        // overlapping event pre-processing loop
        var i = j = 0, overlapCols = [], l = evts.length, prevDt;
        for(; i<l; i++){
            var evt = evts[i].data, 
                evt2 = null, 
                dt = evt[Ext.ensible.cal.EventMappings.StartDate.name].getDate();
            
            for(j=0; j<l; j++){
                if(i==j)continue;
                evt2 = evts[j].data;
                if(this.isOverlapping(evt, evt2)){
                    evt._overlap = evt._overlap == undefined ? 1 : evt._overlap+1;
                    if(i<j){
                        if(evt._overcol===undefined){
                            evt._overcol = 0;
                        }
                        evt2._overcol = evt._overcol+1;
                        overlapCols[dt] = overlapCols[dt] ? Math.max(overlapCols[dt], evt2._overcol) : evt2._overcol;
                    }
                }
            }
        }
        
        // rendering loop
        for(i=0; i<l; i++){
            var evt = evts[i].data,
                dt = evt[Ext.ensible.cal.EventMappings.StartDate.name].getDate();
                
            if(evt._overlap !== undefined){
                var colWidth = 100 / (overlapCols[dt]+1),
                    evtWidth = 100 - (colWidth * evt._overlap);
                    
                evt._width = colWidth;
                evt._left = colWidth * evt._overcol;
            }
            var markup = this.getEventTemplate().apply(evt),
                target = this.id+'-day-col-'+evts[i].date.format('Ymd');
                
            Ext.DomHelper.append(target, markup);
        }
        
        this.fireEvent('eventsrendered', this);
    },
    
    // private
    getDayEl : function(dt){
        return Ext.get(this.getDayId(dt));
    },
    
    // private
    getDayId : function(dt){
        if(Ext.isDate(dt)){
            dt = dt.format('Ymd');
        }
        return this.id + this.dayColumnElIdDelimiter + dt;
    },
    
    // private
    getDaySize : function(){
        var box = this.el.child('.ext-cal-day-col-inner').getBox();
        return {height: box.height, width: box.width};
    },
    
    // private
    getDayAt : function(x, y){
        var sel = '.ext-cal-body-ct',
            xoffset = this.el.child('.ext-cal-day-times').getWidth(),
            viewBox = this.el.getBox(),
            daySize = this.getDaySize(false),
            relX = x - viewBox.x - xoffset,
            dayIndex = Math.floor(relX / daySize.width), // clicked col index
            scroll = this.el.getScroll(),
            row = this.el.child('.ext-cal-bg-row'), // first avail row, just to calc size
            rowH = row.getHeight() / 2, // 30 minute increment since a row is 60 minutes
            relY = y - viewBox.y - rowH + scroll.top,
            rowIndex = Math.max(0, Math.ceil(relY / rowH)),
            mins = rowIndex * 30,
            dt = this.viewStart.add(Date.DAY, dayIndex).add(Date.MINUTE, mins),
            el = this.getDayEl(dt),
            timeX = x;
        
        if(el){
            timeX = el.getLeft();
        }
        
        return {
            date: dt,
            el: el,
            // this is the box for the specific time block in the day that was clicked on:
            timeBox: {
                x: timeX,
                y: (rowIndex * 21) + viewBox.y - scroll.top,
                width: daySize.width,
                height: rowH
            } 
        }
    },

    // private
    onClick : function(e, t){
        if(this.dragPending || Ext.ensible.cal.DayBodyView.superclass.onClick.apply(this, arguments)){
            // The superclass handled the click already so exit
            return;
        }
        if(e.getTarget('.ext-cal-day-times', 3) !== null){
            // ignore clicks on the times-of-day gutter
            return;
        }
        var el = e.getTarget('td', 3);
        if(el){
            if(el.id && el.id.indexOf(this.dayElIdDelimiter) > -1){
                var dt = this.getDateFromId(el.id, this.dayElIdDelimiter);
                //this.fireEvent('dayclick', this, Date.parseDate(dt, 'Ymd'), true, Ext.get(this.getDayId(dt, true)));
                this.onDayClick(Date.parseDate(dt, 'Ymd'), true, Ext.get(this.getDayId(dt, true)));
                return;
            }
        }
        var day = this.getDayAt(e.xy[0], e.xy[1]);
        if(day && day.date){
            //this.fireEvent('dayclick', this, day.date, false, null);
            this.onDayClick(day.date, false, null);
        }
    }
});

Ext.reg('extensible.daybodyview', Ext.ensible.cal.DayBodyView);
/**
 * @class Ext.ensible.cal.DayView
 * @extends Ext.Container
 * <p>Unlike other calendar views, is not actually a subclass of {@link Ext.ensible.cal.CalendarView CalendarView}.
 * Instead it is a {@link Ext.Container Container} subclass that internally creates and manages the layouts of
 * a {@link Ext.ensible.cal.DayHeaderView DayHeaderView} and a {@link Ext.ensible.cal.DayBodyView DayBodyView}. As such
 * DayView accepts any config values that are valid for DayHeaderView and DayBodyView and passes those through
 * to the contained views. It also supports the interface required of any calendar view and in turn calls methods
 * on the contained views as necessary.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.ensible.cal.DayView = Ext.extend(Ext.Container, {
    /**
     * @cfg {Boolean} showTime
     * True to display the current time in today's box in the calendar, false to not display it (defautls to true)
     */
    showTime: true,
    /**
     * @cfg {Boolean} showTodayText
     * True to display the {@link #todayText} string in today's box in the calendar, false to not display it (defautls to true)
     */
    showTodayText: true,
    /**
     * @cfg {String} todayText
     * The text to display in the current day's box in the calendar when {@link #showTodayText} is true (defaults to 'Today')
     */
    todayText: 'Today',
    /**
     * @cfg {String} ddCreateEventText
     * The text to display inside the drag proxy while dragging over the calendar to create a new event (defaults to 
     * 'Create event for {0}' where {0} is a date range supplied by the view)
     */
    ddCreateEventText: 'Create event for {0}',
    /**
     * @cfg {String} ddMoveEventText
     * The text to display inside the drag proxy while dragging an event to reposition it (defaults to 
     * 'Move event to {0}' where {0} is the updated event start date/time supplied by the view)
     */
    ddMoveEventText: 'Move event to {0}',
    /**
     * @cfg {Number} dayCount
     * The number of days to display in the view (defaults to 1). Only values from 1 to 7 are allowed.
     */
    dayCount: 1,
    
    // private
    initComponent : function(){
        // day count is only supported between 1 and 7 days
        this.dayCount = this.dayCount > 7 ? 7 : (this.dayCount < 1 ? 1 : this.dayCount);
        
        var cfg = Ext.apply({}, this.initialConfig);
        cfg.showTime = this.showTime;
        cfg.showTodatText = this.showTodayText;
        cfg.todayText = this.todayText;
        cfg.dayCount = this.dayCount;
        cfg.wekkCount = 1; 
        
        var header = Ext.applyIf({
            xtype: 'extensible.dayheaderview',
            id: this.id+'-hd'
        }, cfg);
        
        var body = Ext.applyIf({
            xtype: 'extensible.daybodyview',
            id: this.id+'-bd'
        }, cfg);
        
        this.items = [header, body];
        this.addClass('ext-cal-dayview ext-cal-ct');
        
        Ext.ensible.cal.DayView.superclass.initComponent.call(this);
    },
    
    // private
    afterRender : function(){
        Ext.ensible.cal.DayView.superclass.afterRender.call(this);
        
        this.header = Ext.getCmp(this.id+'-hd');
        this.body = Ext.getCmp(this.id+'-bd');
        this.body.on('eventsrendered', this.forceSize, this);
    },
    
    // private
    refresh : function(){
        this.header.refresh();
        this.body.refresh();
    },
    
    // private
    forceSize: function(){
        // The defer call is mainly for good ol' IE, but it doesn't hurt in
        // general to make sure that the window resize is good and done first
        // so that we can properly calculate sizes.
        (function(){
            var ct = this.el.up('.x-panel-body'),
                hd = this.el.child('.ext-cal-day-header'),
                h = ct.getHeight() - hd.getHeight();
            
            this.el.child('.ext-cal-body-ct').setHeight(h-1);
        }).defer(10, this);
    },
    
    // private
    onResize : function(){
        this.forceSize();
    },
    
    // private
    getViewBounds : function(){
        return this.header.getViewBounds();
    },
    
    /**
     * Returns the start date of the view, as set by {@link #setStartDate}. Note that this may not 
     * be the first date displayed in the rendered calendar -- to get the start and end dates displayed
     * to the user use {@link #getViewBounds}.
     * @return {Date} The start date
     */
    getStartDate : function(){
        return this.header.getStartDate();
    },

    /**
     * Sets the start date used to calculate the view boundaries to display. The displayed view will be the 
     * earliest and latest dates that match the view requirements and contain the date passed to this function.
     * @param {Date} dt The date used to calculate the new view boundaries
     */
    setStartDate: function(dt){
        this.header.setStartDate(dt, true);
        this.body.setStartDate(dt, true);
    },

    // private
    renderItems: function(){
        this.header.renderItems();
        this.body.renderItems();
    },
    
    /**
     * Returns true if the view is currently displaying today's date, else false.
     * @return {Boolean} True or false
     */
    isToday : function(){
        return this.header.isToday();
    },
    
    /**
     * Updates the view to contain the passed date
     * @param {Date} dt The date to display
     */
    moveTo : function(dt, noRefresh){
        this.header.moveTo(dt, noRefresh);
        this.body.moveTo(dt, noRefresh);
    },
    
    /**
     * Updates the view to the next consecutive date(s)
     */
    moveNext : function(noRefresh){
        this.header.moveNext(noRefresh);
        this.body.moveNext(noRefresh);
    },
    
    /**
     * Updates the view to the previous consecutive date(s)
     */
    movePrev : function(noRefresh){
        this.header.movePrev(noRefresh);
        this.body.movePrev(noRefresh);
    },

    /**
     * Shifts the view by the passed number of days relative to the currently set date
     * @param {Number} value The number of days (positive or negative) by which to shift the view
     */
    moveDays : function(value, noRefresh){
        this.header.moveDays(value, noRefresh);
        this.body.moveDays(value, noRefresh);
    },
    
    /**
     * Updates the view to show today
     */
    moveToday : function(noRefresh){
        this.header.moveToday(noRefresh);
        this.body.moveToday(noRefresh);
    }
});

Ext.reg('extensible.dayview', Ext.ensible.cal.DayView);
/**
 * @class Ext.ensible.cal.MultiDayView
 * @extends Ext.ensible.cal.DayView
 * <p>Displays a calendar view by day, more than one day at a time. This class does not usually need to be used directly as you can
 * use a {@link Ext.ensible.cal.CalendarPanel CalendarPanel} to manage multiple calendar views at once.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.ensible.cal.MultiDayView = Ext.extend(Ext.ensible.cal.DayView, {
    /**
     * @cfg {Number} dayCount
     * The number of days to display in the view (defaults to 3).  Only values from 1 to 7 are allowed.
     */
    dayCount: 3
});

Ext.reg('extensible.multidayview', Ext.ensible.cal.MultiDayView);/**
 * @class Ext.ensible.cal.WeekView
 * @extends Ext.ensible.cal.DayView
 * <p>Displays a calendar view by week. This class does not usually need to be used directly as you can
 * use a {@link Ext.ensible.cal.CalendarPanel CalendarPanel} to manage multiple calendar views at once including
 * the week view.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.ensible.cal.WeekView = Ext.extend(Ext.ensible.cal.DayView, {
    /**
     * @cfg {Number} dayCount
     * The number of days to display in the view (defaults to 7)
     */
    dayCount: 7
});

Ext.reg('extensible.weekview', Ext.ensible.cal.WeekView);/**
 * @class Ext.ensible.cal.MultiWeekView
 * @extends Ext.ensible.cal.MonthView
 * <p>Displays a calendar view by week, more than one week at a time. This class does not usually need to be used directly as you can
 * use a {@link Ext.ensible.cal.CalendarPanel CalendarPanel} to manage multiple calendar views at once.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.ensible.cal.MultiWeekView = Ext.extend(Ext.ensible.cal.MonthView, {
    /**
     * @cfg {Number} weekCount
     * The number of weeks to display in the view (defaults to 2)
     */
    weekCount: 2,
    
    // inherited docs
    moveNext : function(){
        return this.moveWeeks(this.weekCount);
    },
    
    // inherited docs
    movePrev : function(){
        return this.moveWeeks(-this.weekCount);
    }
});

Ext.reg('extensible.multiweekview', Ext.ensible.cal.MultiWeekView);/*
 * This is the view used internally by the panel that displays overflow events in the
 * month view. Anytime a day cell cannot display all of its events, it automatically displays
 * a link at the bottom to view all events for that day. When clicked, a panel pops up that
 * uses this view to display the events for that day.
 */
Ext.ensible.cal.MonthDayDetailView = Ext.extend(Ext.BoxComponent, {
    initComponent : function(){
        Ext.ensible.cal.CalendarView.superclass.initComponent.call(this);
		
        this.addEvents({
            eventsrendered: true
		});
		
        if(!this.el){
            this.el = document.createElement('div');
        }
    },
	
    afterRender : function(){
        this.tpl = this.getTemplate();
		
        Ext.ensible.cal.MonthDayDetailView.superclass.afterRender.call(this);
		
        this.el.on({
            'click': this.view.onClick,
			'mouseover': this.view.onMouseOver,
			'mouseout': this.view.onMouseOut,
            scope: this.view
        });
    },
	
    getTemplate : function(){
        if(!this.tpl){
	        this.tpl = new Ext.XTemplate(
                '<div class="ext-cal-mdv x-unselectable">',
	                '<table class="ext-cal-mvd-tbl" cellpadding="0" cellspacing="0">',
						'<tbody>',
							'<tpl for=".">',
		                        '<tr><td class="ext-cal-ev">{markup}</td></tr>',
							'</tpl>',
	                    '</tbody>',
	                '</table>',
                '</div>'
	        );
        }
        this.tpl.compile();
        return this.tpl;
    },
	
	update : function(dt){
		this.date = dt;
		this.refresh();
	},
	
    refresh : function(){
		if(!this.rendered){
			return;
		}
        var eventTpl = this.view.getEventTemplate(),
		
			templateData = [];
			
			evts = this.store.queryBy(function(rec){
				var thisDt = this.date.clearTime(true).getTime(),
					recStart = rec.data[Ext.ensible.cal.EventMappings.StartDate.name].clearTime(true).getTime(),
	            	startsOnDate = (thisDt == recStart),
					spansDate = false;
				
				if(!startsOnDate){
					var recEnd = rec.data[Ext.ensible.cal.EventMappings.EndDate.name].clearTime(true).getTime();
	            	spansDate = recStart < thisDt && recEnd >= thisDt;
				}
	            return startsOnDate || spansDate;
	        }, this);
		
        Ext.ensible.cal.CalendarView.prototype.sortEventRecordsForDay.call(this, evts);
        
		evts.each(function(evt){
            var item = evt.data,
                M = Ext.ensible.cal.EventMappings;
                
			item._renderAsAllDay = item[M.IsAllDay.name] || Ext.ensible.Date.diffDays(item[M.StartDate.name], item[M.EndDate.name]) > 0;
            item.spanLeft = Ext.ensible.Date.diffDays(item[M.StartDate.name], this.date) > 0;
            item.spanRight = Ext.ensible.Date.diffDays(this.date, item[M.EndDate.name]) > 0;
            item.spanCls = (item.spanLeft ? (item.spanRight ? 'ext-cal-ev-spanboth' : 
                'ext-cal-ev-spanleft') : (item.spanRight ? 'ext-cal-ev-spanright' : ''));

			templateData.push({markup: eventTpl.apply(this.getTemplateEventData(item))});
		}, this);
		
		this.tpl.overwrite(this.el, templateData);
		this.fireEvent('eventsrendered', this, this.date, evts.getCount());
    },
	
	getTemplateEventData : function(evt){
		var data = this.view.getTemplateEventData(evt);
		data._elId = 'dtl-'+data._elId;
		return data;
	}
});

Ext.reg('extensible.monthdaydetailview', Ext.ensible.cal.MonthDayDetailView);
/**
 * @class Ext.ensible.cal.CalendarPanel
 * @extends Ext.Panel
 * <p>This is the default container for Ext calendar views. It supports day, week and month views as well
 * as a built-in event edit form. The only requirement for displaying a calendar is passing in a valid
 * {@link #calendarStore} config containing records of type {@link Ext.ensible.cal.EventRecord EventRecord}. In order
 * to make the calendar interactive (enable editing, drag/drop, etc.) you can handle any of the various
 * events fired by the underlying views and exposed through the CalendarPanel.</p>
 * {@link #layoutConfig} option if needed.</p>
 * @constructor
 * @param {Object} config The config object
 * @xtype calendarpanel
 */
Ext.ensible.cal.CalendarPanel = Ext.extend(Ext.Panel, {
    /**
     * @cfg {Boolean} showDayView
     * True to include the day view (and toolbar button), false to hide them (defaults to true).
     */
    showDayView: true,
    /**
     * @cfg {Boolean} showMultiDayView
     * True to include the multi-day view (and toolbar button), false to hide them (defaults to false).
     */
    showMultiDayView: false,
    /**
     * @cfg {Boolean} showWeekView
     * True to include the week view (and toolbar button), false to hide them (defaults to true).
     */
    showWeekView: true,
    /**
     * @cfg {Boolean} showMultiWeekView
     * True to include the multi-week view (and toolbar button), false to hide them (defaults to true).
     */
    showMultiWeekView: true,
    /**
     * @cfg {Boolean} showMonthView
     * True to include the month view (and toolbar button), false to hide them (defaults to true).
     * If all other views are hidden, the month view will show by default even if this config is false.
     */
    showMonthView: true,
    /**
     * @cfg {Boolean} showNavBar
     * True to display the calendar navigation toolbar, false to hide it (defaults to true). Note that
     * if you hide the default navigation toolbar you'll have to provide an alternate means of navigating the calendar.
     */
    showNavBar: true,
    /**
     * @cfg {String} todayText
     * Text to use for the 'Today' nav bar button.
     */
    todayText: 'Today',
    /**
     * @cfg {Boolean} showTodayText
     * True to show the value of {@link #todayText} instead of today's date in the calendar's current day box,
     * false to display the day number(defaults to true).
     */
    showTodayText: true,
    /**
     * @cfg {Boolean} showTime
     * True to display the current time next to the date in the calendar's current day box, false to not show it 
     * (defaults to true).
     */
    showTime: true,
    
    readOnly: false,
    
    showNavToday: true,
    showNavJump: true,
    showNavNextPrev: true,
    
    todayText: 'Today',
    jumpToText: 'Jump to:',
    goText: 'Go',
    
    /**
     * @cfg {String} dayText
     * Text to use for the 'Day' nav bar button.
     */
    dayText: 'Day',
    /**
     * @cfg {String} multiDayText
     * Text to use for the 'X Days' nav bar button (defaults to "{0} Days" where {0} is automatically replaced by the
     * value of the {@link #multDayViewCfg}'s dayCount value if available, otherwise it uses the view default of 3).
     */
    multiDayText: '{0} Days',
    /**
     * @cfg {String} weekText
     * Text to use for the 'Week' nav bar button.
     */
    weekText: 'Week',
    /**
     * @cfg {String} multiWeekText
     * Text to use for the 'X Weeks' nav bar button (defaults to "{0} Weeks" where {0} is automatically replaced by the
     * value of the {@link #multiWeekViewCfg}'s weekCount value if available, otherwise it uses the view default of 2).
     */
    multiWeekText: '{0} Weeks',
    /**
     * @cfg {String} monthText
     * Text to use for the 'Month' nav bar button.
     */
    monthText: 'Month',
    
    /**
     * @cfg {Object} viewConfig
     * 
     */
    /**
     * @cfg {Object} dayViewCfg
     * 
     */
    /**
     * @cfg {Object} multiDayViewCfg
     * 
     */
    /**
     * @cfg {Object} weekViewCfg
     * 
     */
    /**
     * @cfg {Object} multiWeekViewCfg
     * 
     */
    /**
     * @cfg {Object} monthViewCfg
     * 
     */
    
    // private
    layoutConfig: {
        layoutOnCardChange: true,
        deferredRender: true
    },
    
    // private property
    startDate: new Date(),
    
    // private
    initComponent : function(){
        this.tbar = {
            cls: 'ext-cal-toolbar',
            border: true,
            items: []
        };
        
        this.viewCount = 0;
        
        if(this.showNavToday){
            this.tbar.items.push({
                id: this.id+'-tb-today', text: this.todayText, handler: this.onTodayClick, scope: this
            });
        }
        if(this.showNavNextPrev){
            this.tbar.items.push([
                {id: this.id+'-tb-prev', handler: this.onPrevClick, scope: this, iconCls: 'x-tbar-page-prev'},
                {id: this.id+'-tb-next', handler: this.onNextClick, scope: this, iconCls: 'x-tbar-page-next'}
            ]);
        }
        if(this.showNavJump){
            this.tbar.items.push([
                this.jumpToText,
                {id: this.id+'-tb-jump-dt', xtype: 'datefield', showToday: false},
                {id: this.id+'-tb-jump', text: this.goText, handler: this.onJumpClick, scope: this}
            ]);
        }
        
        this.tbar.items.push('->');
        
        if(this.showDayView){
            this.tbar.items.push({
                id: this.id+'-tb-day', text: this.dayText, handler: this.onDayNavClick, scope: this, toggleGroup: this.id+'-tb-views'
            });
            this.viewCount++;
        }
        if(this.showMultiDayView){
            var text = String.format(this.multiDayText, (this.multiDayViewCfg && this.multiDayViewCfg.dayCount) || 3);
            this.tbar.items.push({
                id: this.id+'-tb-multiday', text: text, handler: this.onMultiDayNavClick, scope: this, toggleGroup: this.id+'-tb-views'
            });
            this.viewCount++;
        }
        if(this.showWeekView){
            this.tbar.items.push({
                id: this.id+'-tb-week', text: this.weekText, handler: this.onWeekNavClick, scope: this, toggleGroup: this.id+'-tb-views'
            });
            this.viewCount++;
        }
        if(this.showMultiWeekView){
            var text = String.format(this.multiWeekText, (this.multiWeekViewCfg && this.multiWeekViewCfg.weekCount) || 2);
            this.tbar.items.push({
                id: this.id+'-tb-multiweek', text: text, handler: this.onMultiWeekNavClick, scope: this, toggleGroup: this.id+'-tb-views'
            });
            this.viewCount++;
        }
        if(this.showMonthView || this.viewCount == 0){
            this.tbar.items.push({
                id: this.id+'-tb-month', text: this.monthText, handler: this.onMonthNavClick, scope: this, toggleGroup: this.id+'-tb-views'
            });
            this.viewCount++;
            this.showMonthView = true;
        }
        
        var idx = this.viewCount-1;
        this.activeItem = this.activeItem === undefined ? idx : (this.activeItem > idx ? idx : this.activeItem);
        
        if(this.showNavBar === false){
            delete this.tbar;
            this.addClass('x-calendar-nonav');
        }
        
        Ext.ensible.cal.CalendarPanel.superclass.initComponent.call(this);
        
        this.addEvents({
            /**
             * @event eventadd
             * Fires after a new event is added to the underlying store
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Ext.ensible.cal.EventRecord} rec The new {@link Ext.ensible.cal.EventRecord record} that was added
             */
            eventadd: true,
            /**
             * @event eventupdate
             * Fires after an existing event is updated
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Ext.ensible.cal.EventRecord} rec The new {@link Ext.ensible.cal.EventRecord record} that was updated
             */
            eventupdate: true,
            /**
             * @event beforeeventdelete
             * Fires before an event is deleted by the user. This is a cancelable event, so returning false from a handler 
             * will cancel the delete operation.
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that was deleted
             * @param {Ext.Element} el The target element
             */
            beforeeventdelete: true,
            /**
             * @event eventdelete
             * Fires after an event is deleted by the user.
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that was deleted
             * @param {Ext.Element} el The target element
             */
            eventdelete: true,
            /**
             * @event eventcancel
             * Fires after an event add/edit operation is canceled by the user and no store update took place
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Ext.ensible.cal.EventRecord} rec The new {@link Ext.ensible.cal.EventRecord record} that was canceled
             */
            eventcancel: true,
            /**
             * @event viewchange
             * Fires after a different calendar view is activated (but not when the event edit form is activated)
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Ext.ensible.CalendarView} view The view being activated (any valid {@link Ext.ensible.cal.CalendarView CalendarView} subclass)
             * @param {Object} info Extra information about the newly activated view. This is a plain object 
             * with following properties:<div class="mdetail-params"><ul>
             * <li><b><code>activeDate</code></b> : <div class="sub-desc">The currently-selected date</div></li>
             * <li><b><code>viewStart</code></b> : <div class="sub-desc">The first date in the new view range</div></li>
             * <li><b><code>viewEnd</code></b> : <div class="sub-desc">The last date in the new view range</div></li>
             * </ul></div>
             */
            viewchange: true,
            /**
             * @event eventclick
             * <p>Fires after the user clicks on an event element.</p>
             * <p><strong>NOTE:</strong> This version of <code>eventclick</code> differs from the same event fired directly by
             * {@link Ext.ensible.cal.CalendarView CalendarView} subclasses in that it provides a default implementation (showing
             * the default edit window) and is also cancelable (if a handler returns <code>false</code> the edit window will not be shown).
             * This event when fired from a view class is simply a notification that an event was clicked and has no default behavior.
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that was clicked on
             * @param {HTMLNode} el The DOM node that was clicked on
             */
            //eventclick: true,
            /**
             * @event rangeselect
             * Fires after the user drags on the calendar to select a range of dates/times in which to create an event
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Object} dates An object containing the start (StartDate property) and end (EndDate property) dates selected
             * @param {Function} callback A callback function that MUST be called after the event handling is complete so that
             * the view is properly cleaned up (shim elements are persisted in the view while the user is prompted to handle the
             * range selection). The callback is already created in the proper scope, so it simply needs to be executed as a standard
             * function call (e.g., callback()).
             */
            //rangeselect: true,
            /**
             * @event eventmove
             * Fires after an event element is dragged by the user and dropped in a new position
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that was moved with
             * updated start and end dates
             */
            eventmove: true,
            /**
             * @event dayclick
             * Fires after the user clicks within a day/week view container and not on an event element
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Date} dt The date/time that was clicked on
             * @param {Boolean} allday True if the day clicked on represents an all-day box, else false.
             * @param {Ext.Element} el The Element that was clicked on
             */
            //dayclick: true,
            /**
             * @event editdetails
             * Fires when the user selects the option in this window to continue editing in the detailed edit form
             * (by default, an instance of {@link Ext.ensible.cal.EventEditForm}. Handling code should hide this window
             * and transfer the current event record to the appropriate instance of the detailed form by showing it
             * and calling {@link Ext.ensible.cal.EventEditForm#loadRecord loadRecord}.
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} that is currently being edited
             * @param {Ext.Element} el The target element
             */
            editdetails: true
            
            
            //
            // NOTE: CalendarPanel also relays the following events from contained views as if they originated from this:
            //
            
            /**
             * @event eventsrendered
             * Fires after events are finished rendering in the view
             * @param {Ext.ensible.cal.CalendarPanel} this 
             */
            /**
             * @event eventover
             * Fires anytime the mouse is over an event element
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that the cursor is over
             * @param {HTMLNode} el The DOM node that is being moused over
             */
            /**
             * @event eventout
             * Fires anytime the mouse exits an event element
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that the cursor exited
             * @param {HTMLNode} el The DOM node that was exited
             */
            /**
             * @event beforedatechange
             * Fires before the start date of the view changes, giving you an opportunity to save state or anything else you may need
             * to do prior to the UI view changing. This is a cancelable event, so returning false from a handler will cancel both the
             * view change and the setting of the start date.
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Date} startDate The current start date of the view (as explained in {@link #getStartDate}
             * @param {Date} newStartDate The new start date that will be set when the view changes
             * @param {Date} viewStart The first displayed date in the current view
             * @param {Date} viewEnd The last displayed date in the current view
             */
            /**
             * @event datechange
             * Fires after the start date of the view changes
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Date} startDate The start date of the view (as explained in {@link #getStartDate}
             * @param {Date} viewStart The first displayed date in the view
             * @param {Date} viewEnd The last displayed date in the view
             */
            /**
             * @event beforeeventmove
             * Fires before an event element is dragged by the user and dropped in a new position. This is a cancelable event, so 
             * returning false from a handler will cancel the move operation.
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that will be moved
             */
            /**
             * @event eventmove
             * Fires after an event element is dragged by the user and dropped in a new position
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that was moved with
             * updated start and end dates
             */
            /**
             * @event initdrag
             * Fires when a drag operation is initiated in the view
             * @param {Ext.ensible.cal.CalendarPanel} this
             */
            /**
             * @event dayover
             * Fires while the mouse is over a day element 
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Date} dt The date that is being moused over
             * @param {Ext.Element} el The day Element that is being moused over
             */
            /**
             * @event dayout
             * Fires when the mouse exits a day element 
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Date} dt The date that is exited
             * @param {Ext.Element} el The day Element that is exited
             */
            /**
             * @event beforeeventresize
             * Fires after the user drags the resize handle of an event to resize it, but before the resize operation is carried out.
             * This is a cancelable event, so returning false from a handler will cancel the resize operation. <strong>NOTE:</strong>
             * This event is only fired from views that support event resizing.
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that was resized
             * containing the updated start and end dates
             */
            /**
             * @event eventresize
             * Fires after the user drags the resize handle of an event and the resize operation is complete. <strong>NOTE:</strong>
             * This event is only fired from views that support event resizing.
             * @param {Ext.ensible.cal.CalendarPanel} this
             * @param {Ext.ensible.cal.EventRecord} rec The {@link Ext.ensible.cal.EventRecord record} for the event that was resized
             * containing the updated start and end dates
             */
        });
        
        this.layout = 'card'; // do not allow override
        this.addClass('x-cal-panel');
        
        var sharedViewCfg = {
            showToday: this.showToday,
            showTodayText: this.showTodayText,
            showTime: this.showTime,
            readOnly: this.readOnly
        };
        
        if(this.showDayView){
            var day = Ext.apply({
                xtype: 'extensible.dayview',
                title: this.dayText
            }, sharedViewCfg);
            
            day = Ext.apply(Ext.apply(day, this.viewConfig), this.dayViewCfg);
            day.id = this.id+'-day';
            day.store = day.store || this.eventStore;
            this.initEventRelay(day);
            this.add(day);
        }
        if(this.showMultiDayView){
            var mday = Ext.apply({
                xtype: 'extensible.multidayview',
                title: this.multiDayText
            }, sharedViewCfg);
            
            mday = Ext.apply(Ext.apply(mday, this.viewConfig), this.multiDayViewCfg);
            mday.id = this.id+'-multiday';
            mday.store = mday.store || this.eventStore;
            this.initEventRelay(mday);
            this.add(mday);
        }
        if(this.showWeekView){
            var wk = Ext.applyIf({
                xtype: 'extensible.weekview',
                title: this.weekText
            }, sharedViewCfg);
            
            wk = Ext.apply(Ext.apply(wk, this.viewConfig), this.weekViewCfg);
            wk.id = this.id+'-week';
            wk.store = wk.store || this.eventStore;
            this.initEventRelay(wk);
            this.add(wk);
        }
        if(this.showMultiWeekView){
            var mwk = Ext.applyIf({
                xtype: 'extensible.multiweekview',
                title: this.multiWeekText
            }, sharedViewCfg);
            
            mwk = Ext.apply(Ext.apply(mwk, this.viewConfig), this.multiWeekViewCfg);
            mwk.id = this.id+'-multiweek';
            mwk.store = mwk.store || this.eventStore;
            this.initEventRelay(mwk);
            this.add(mwk);
        }
        if(this.showMonthView){
            var month = Ext.applyIf({
                xtype: 'extensible.monthview',
                title: this.monthText,
                listeners: {
                    'weekclick': {
                        fn: function(vw, dt){
                            this.showWeek(dt);
                        },
                        scope: this
                    }
                }
            }, sharedViewCfg);
            
            month = Ext.apply(Ext.apply(month, this.viewConfig), this.monthViewCfg);
            month.id = this.id+'-month';
            month.store = month.store || this.eventStore;
            this.initEventRelay(month);
            this.add(month);
        }

        this.add(Ext.applyIf({
            xtype: 'extensible.eventeditform',
            id: this.id+'-edit',
            calendarStore: this.calendarStore,
            listeners: {
                'eventadd':    { scope: this, fn: this.onEventAdd },
                'eventupdate': { scope: this, fn: this.onEventUpdate },
                'eventdelete': { scope: this, fn: this.onEventDelete },
                'eventcancel': { scope: this, fn: this.onEventCancel }
            }
        }, this.editViewCfg));
    },
    
    // private
    initEventRelay: function(cfg){
        cfg.listeners = cfg.listeners || {};
        cfg.listeners.afterrender = {
            fn: function(c){
                // relay view events so that app code only has to handle them in one place.
                // these events require no special handling by the calendar panel 
                this.relayEvents(c, ['eventsrendered','eventclick','dayclick','eventover','eventout','beforedatechange',
                    'datechange','rangeselect','beforeeventmove','eventmove','initdrag','dayover','dayout','beforeeventresize','eventresize']);
                
                // these events can be fired either by a contained view or by the panel itself, and they have
                // default handling code, so the handler functions are defined in this class
                //c.on('eventclick', this.onEventClick, this);
                //c.on('dayclick', this.onDayClick, this);
                //c.on('rangeselect', this.onRangeSelect, this);
                c.on('editdetails', this.onEditDetails, this);
            },
            scope: this,
            single: true
        }
    },
    
    // private
    afterRender: function(){
        Ext.ensible.cal.CalendarPanel.superclass.afterRender.call(this);
        this.body.addClass('x-cal-body');
        this.fireViewChange();
    },
    
    // private
    onLayout: function(){
        Ext.ensible.cal.CalendarPanel.superclass.onLayout.call(this);
        if(!this.navInitComplete){
            this.updateNavState();
            this.navInitComplete = true;
        }
    },
    
//    // private 
//    onEventClick: function(vw, rec, el){
//        if(this.fireEvent('eventclick', this, rec, el) !== false){
//            this.showEditWindow(rec, el);
//        }
//    },
//    
//    showEditWindow : function(rec, animateTarget){
//        // only create one instance of the edit window, even if there are multiple CalendarPanels
//        this.editWin = this.editWin || Ext.WindowMgr.get('ext-cal-editwin');
//        
//        if(!this.editWin){
//            this.editWin = new Ext.ensible.ux.cal.EventEditWindow({
//                id: 'ext-cal-editwin',
//                calendarStore: this.calendarStore,
//                listeners: {
//                    'eventadd': {
//                        fn: function(win, rec, animTarget){
//                            win.hide(animTarget);
//                            this.onEventAdd(null, rec);
//                        },
//                        scope: this
//                    },
//                    'eventupdate': {
//                        fn: function(win, rec, animTarget){
//                            win.hide(animTarget);
//                            this.onEventUpdate(null, rec);
//                        },
//                        scope: this
//                    },
//                    'eventdelete': {
//                        fn: function(win, rec, animTarget){
//                            win.hide(animTarget);
//                            this.onEventDelete(null, rec);
//                        },
//                        scope: this
//                    },
//                    'editdetails': {
//                        fn: function(win, rec, animTarget){
//                            win.hide(animTarget);
//                            this.showEditForm(rec);
//                        },
//                        scope: this
//                    },
//                    'eventcancel': {
//                        fn: function(win, rec, animTarget){
//                            win.hide(animateTarget);
//                            this.onEventCancel();
//                        },
//                        scope: this
//                    }
//                }
//            });
//        }
//        this.editWin.show(rec, animateTarget);
//    },
//    
//    // private 
//    onDayClick: function(vw, dt, ad, el){
//        if(this.fireEvent('dayclick', this, dt, ad, el) !== false){
//            this.showEditWindow({
//                StartDate: dt,
//                IsAllDay: ad
//            }, el);
//        }
//    },
//    
//    // private
//    onRangeSelect: function(win, dates, el, onComplete){
//        if(this.fireEvent('rangeselect', this, dates, el, onComplete) !== false){
//            this.showEditWindow(dates, el);
//            this.editWin.on('hide', onComplete, this, {single:true});
//        }
//    },
    
    // private
    onEditDetails: function(vw, rec, el){
        if(this.fireEvent('editdetails', this, vw, rec, el) !== false){
            this.showEditForm(rec);
        }
    },
    
    // private
    onEventDelete: function(vw, rec, el){
        if(this.fireEvent('beforeeventdelete', this, rec, el) !== false){
            this.store.remove(rec);
            this.fireEvent('eventdelete', this, rec, el);
        }
    },
    
//    // private
//    onEventMove: function(vw, rec){
//        if(this.fireEvent('eventmove', this, rec) !== false){
//            this.onEventUpdate(null, rec);
//        }
//    },
    
//    // private
//    onEventResize: function(vw, rec){
//        if(this.fireEvent('eventresize', this, rec) !== false){
//            this.onEventUpdate(null, rec);
//        }
//    },
    
    // private
    onEventAdd: function(form, rec){
        rec.data[Ext.ensible.cal.EventMappings.IsNew.name] = false;
        this.eventStore.add(rec);
        this.hideEditForm();
        this.fireEvent('eventadd', this, rec);
    },
    
    // private
    onEventUpdate: function(form, rec){
        rec.commit();
        this.hideEditForm();
        this.fireEvent('eventupdate', this, rec);
    },
    
    // private
    onEventDelete: function(form, rec){
        this.eventStore.remove(rec);
        this.hideEditForm();
        this.fireEvent('eventdelete', this, rec);
    },
    
    // private
    onEventCancel: function(form, rec){
        this.hideEditForm();
        this.fireEvent('eventcancel', this, rec);
    },
    
    /**
     * Shows the built-in event edit form for the passed in event record.  This method automatically
     * hides the calendar views and navigation toolbar.  To return to the calendar, call {@link #hideEditForm}.
     * @param {Ext.ensible.cal.EventRecord} record The event record to edit
     * @return {Ext.ensible.cal.CalendarPanel} this
     */
    showEditForm: function(rec){
        this.preEditView = this.layout.activeItem.id;
        this.setActiveView(this.id+'-edit');
        this.layout.activeItem.loadRecord(rec);
        return this;
    },
    
    /**
     * Hides the built-in event edit form and returns to the previous calendar view. If the edit form is
     * not currently visible this method has no effect.
     * @return {Ext.ensible.cal.CalendarPanel} this
     */
    hideEditForm: function(){
        if(this.preEditView){
            this.setActiveView(this.preEditView);
            delete this.preEditView;
        }
        return this;
    },
    
    // private
    setActiveView: function(id){
        var l = this.layout;
        l.setActiveItem(id);
        
        if(id == this.id+'-edit'){
            this.getTopToolbar().hide();
            this.doLayout();
        }
        else{
            l.activeItem.refresh();
            this.getTopToolbar().show();
            this.updateNavState();
        }
        this.activeView = l.activeItem;
        this.fireViewChange();
    },
    
    // private
    fireViewChange: function(){
        var info = null, 
            view = this.layout.activeItem;
            
        if(view.getViewBounds){
            vb = view.getViewBounds(),
            info = {
                activeDate: view.getStartDate(),
                viewStart: vb.start,
                viewEnd: vb.end
            }
        }
        this.fireEvent('viewchange', this, view, info);
    },
    
    // private
    updateNavState: function(){
        if(this.showNavBar !== false){
            var item = this.layout.activeItem,
                suffix = item.id.split(this.id+'-')[1];
            
            if(this.showNavToday){
                Ext.getCmp(this.id+'-tb-today').setDisabled(item.isToday());
            }
            var btn = Ext.getCmp(this.id+'-tb-'+suffix);
            btn.toggle(true);
        }
    },

    /**
     * Sets the start date for the currently-active calendar view.
     * @param {Date} dt
     */
    setStartDate: function(dt){
        this.layout.activeItem.setStartDate(dt, true);
        this.updateNavState();
        this.fireViewChange();
    },
        
    // private
    showWeek: function(dt){
        this.setActiveView(this.id+'-week');
        this.setStartDate(dt);
    },
    
    // private
    onTodayClick: function(){
        this.startDate = this.layout.activeItem.moveToday();
        this.updateNavState();
        this.fireViewChange();
    },
    
    // private
    onJumpClick: function(){
        var dt = Ext.getCmp(this.id+'-tb-jump-dt').getValue();
        if(dt !== ''){
            this.startDate = this.layout.activeItem.moveTo(dt);
            this.updateNavState();
            // TODO: check that view actually changed:
            this.fireViewChange();
        }
    },
    
    // private
    onPrevClick: function(){
        this.startDate = this.layout.activeItem.movePrev();
        this.updateNavState();
        this.fireViewChange();
    },
    
    // private
    onNextClick: function(){
        this.startDate = this.layout.activeItem.moveNext();
        this.updateNavState();
        this.fireViewChange();
    },
    
    // private
    onDayNavClick: function(){
        this.setActiveView(this.id+'-day');
    },
    
    // private
    onMultiDayNavClick: function(){
        this.setActiveView(this.id+'-multiday');
    },
    
    // private
    onWeekNavClick: function(){
        this.setActiveView(this.id+'-week');
    },
    
    // private
    onMultiWeekNavClick: function(){
        this.setActiveView(this.id+'-multiweek');
    },
    
    // private
    onMonthNavClick: function(){
        this.setActiveView(this.id+'-month');
    },
    
    /**
     * Return the calendar view that is currently active, which will be a subclass of
     * {@link Ext.ensible.cal.CalendarView CalendarView}.
     * @return {Ext.ensible.cal.CalendarView} The active view
     */
    getActiveView: function(){
        return this.layout.activeItem;
    }
});

Ext.reg('extensible.calendarpanel', Ext.ensible.cal.CalendarPanel);