/*!
 * Extensible 1.5.0
 * Copyright(c) 2010-2011 Extensible, LLC
 * licensing@ext.ensible.com
 * http://ext.ensible.com
 */
/*!
 * Extensible 1.5.0
 * Copyright(c) 2010-2011 Extensible, LLC
 * licensing@ext.ensible.com
 * http://ext.ensible.com
 */
/*
 * Chinese (Simplified)
 * By frank cheung v0.1
 * encoding: utf-8
 */

Extensible.Date.use24HourTime = false;

if(Extensible.calendar.view.AbstractCalendar) {
    Ext.apply(Extensible.calendar.view.AbstractCalendar.prototype, {
        startDay: 0,
        todayText: '今日',
        defaultEventTitleText: '(没标题)',
        ddCreateEventText: '为{0}创建事件',
        ddMoveEventText: '移动事件到{0}',
        ddResizeEventText: '更新事件到{0}'
    });
}

if(Extensible.calendar.view.Month) {
    Ext.apply(Extensible.calendar.view.Month.prototype, {
        moreText: '+{0}更多……',
        getMoreText: function(numEvents){
            return '+{0}更多……';
        },
        detailsTitleDateFormat: 'F j'
    });
}

if(Extensible.calendar.CalendarPanel) {
    Ext.apply(Extensible.calendar.CalendarPanel.prototype, {
        todayText: '今日',
        dayText: '日',
        weekText: '星期',
        monthText: '月',
        jumpToText: '调到：',
        goText: '到 ',
        multiDayText: '{0}天',
        multiWeekText: '{0}星期',
        getMultiDayText: function(numDays){
            return '{0}天';
        },
        getMultiWeekText: function(numWeeks){
            return '{0}星期';
        }
    });
}

if(Extensible.calendar.form.EventWindow) {
    Ext.apply(Extensible.calendar.form.EventWindow.prototype, {
        width: 600,
        labelWidth: 65,
        titleTextAdd: '添加事件',
        titleTextEdit: '编辑事件',
        savingMessage: '�?存更改……',
        deletingMessage: '删除事件……',
        detailsLinkText: '编辑详细……',
        saveButtonText: '�?存',
        deleteButtonText: '删除',
        cancelButtonText: '�?�消',
        titleLabelText: '标题',
        datesLabelText: '当在',
        calendarLabelText: '日历'
    });
}

if(Extensible.calendar.form.EventDetails) {
    Ext.apply(Extensible.calendar.form.EventDetails.prototype, {
        labelWidth: 65,
        labelWidthRightCol: 65,
        title: '事件�?�自',
        titleTextAdd: '添加事件',
        titleTextEdit: '编辑事件',
        saveButtonText: '�?存',
        deleteButtonText: '删除',
        cancelButtonText: '�?�消',
        titleLabelText: '标题',
        datesLabelText: '当在',
        reminderLabelText: '�??醒器',
        notesLabelText: '便笺',
        locationLabelText: '�?置',
        webLinkLabelText: 'Web链接',
        calendarLabelText: '日历',
        repeatsLabelText: '�?�?'
    });
}

if(Extensible.form.field.DateRange) {
    Ext.apply(Extensible.form.field.DateRange.prototype, {
        toText: '到',
        allDayText: '全天'
    });
}

if(Extensible.calendar.form.field.CalendarCombo) {
    Ext.apply(Extensible.calendar.form.field.CalendarCombo.prototype, {
        fieldLabel: '日历'
    });
}

if(Extensible.calendar.gadget.CalendarListPanel) {
    Ext.apply(Extensible.calendar.gadget.CalendarListPanel.prototype, {
        title: '日历'
    });
}

if(Extensible.calendar.gadget.CalendarListMenu) {
    Ext.apply(Extensible.calendar.gadget.CalendarListMenu.prototype, {
        displayOnlyThisCalendarText: '�?�显示该日历'
    });
}

if(Extensible.form.recurrence.Combo) {
    Ext.apply(Extensible.form.recurrence.Combo.prototype, {
        fieldLabel: '�?�?',
        recurrenceText: {
            none: '�?�?�?',
            daily: '�?天',
            weekly: '�?星期',
            monthly: '�?月',
            yearly: '�?年'
        }
    });
}

if(Extensible.calendar.form.field.ReminderCombo) {
    Ext.apply(Extensible.calendar.form.field.ReminderCombo.prototype, {
        fieldLabel: '�??醒器',
        noneText: '没有',
        atStartTimeText: '于�?�动时间',
        getMinutesText: function(numMinutes){
            return '分钟';
        },
        getHoursText: function(numHours){
            return '�?时';
        },
        getDaysText: function(numDays){
            return '天';
        },
        getWeeksText: function(numWeeks){
            return '星期';
        },
        reminderValueFormat: '离开始还有{0} {1}' // e.g. "2 hours before start"
    });
}

if(Extensible.form.field.DateRange) {
    Ext.apply(Extensible.form.field.DateRange.prototype, {
        dateFormat: 'n/j/Y'
    });
}

if(Extensible.calendar.menu.Event) {
    Ext.apply(Extensible.calendar.menu.Event.prototype, {
        editDetailsText: '编辑详细',
        deleteText: '删除',
        moveToText: '移动到……'
    });
}

if(Extensible.calendar.dd.DropZone) {
    Ext.apply(Extensible.calendar.dd.DropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat: 'n/j'
    });
}

if(Extensible.calendar.dd.DayDropZone) {
    Ext.apply(Extensible.calendar.dd.DayDropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat : 'n/j'
    });
}

if(Extensible.calendar.template.BoxLayout) {
    Ext.apply(Extensible.calendar.template.BoxLayout.prototype, {
        firstWeekDateFormat: 'D j',
        otherWeeksDateFormat: 'j',
        singleDayDateFormat: 'l, F j, Y',
        multiDayFirstDayFormat: 'M j, Y',
        multiDayMonthStartFormat: 'M j'
    });
}

if(Extensible.calendar.template.Month) {
    Ext.apply(Extensible.calendar.template.Month.prototype, {
        dayHeaderFormat: 'D',
        dayHeaderTitleFormat: 'l, F j, Y'
    });
}