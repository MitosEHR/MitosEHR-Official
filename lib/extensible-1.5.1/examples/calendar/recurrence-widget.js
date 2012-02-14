/*!
 * Extensible 1.5.1
 * Copyright(c) 2010-2011 Extensible, LLC
 * licensing@ext.ensible.com
 * http://ext.ensible.com
 */
Ext.onReady(function(){
    var recurField = new Ext.ensible.cal.RecurrenceField({
        id: 'recurrence',
        frequency: 'WEEKLY',
        
        //value: 'FREQ=WEEKLY;INTERVAL=3;BYDAY=MO,FR'
        //value: 'FREQ=MONTHLY;INTERVAL=3;BYMONTHDAY=4;COUNT=10'
        value: 'FREQ=MONTHLY;INTERVAL=3;BYDAY=1FR'
        //value: 'FREQ=MONTHLY;INTERVAL=6;BYMONTHDAY=7;COUNT=8'
        //value: 'FREQ=MONTHLY;INTERVAL=6;BYMONTHDAY=7;UNTIL=20110531T000000Z'
        
        // optionally specify the recurrence start date:
        //startDate: new Date().add(Date.DAY, 10),
        
        // defaults to autoHeight, but you can optionally fix the height:
        //height: 110,
        
        // disable slide effect when hiding/showing sub-fields:
        //enableFx: false
    });
    
    new Ext.form.FormPanel({
        renderTo: 'recur-panel',
        title: 'Recurrence Pattern',
        border: true,
        labelWidth: 70,
        width: 600,
        bodyStyle: 'padding:10px 15px;',
        autoHeight: true,
        items: recurField
    })
    
    var startDt = new Ext.form.DateField({
        renderTo: 'recur-dt',
        value: new Date()
    });
    
    new Ext.Button({
        text: 'Refresh Panel',
        renderTo: 'recur-dt',
        handler: function(){
            recurField.setStartDate(startDt.getValue());
        }
    });
    
    var btn = new Ext.Button({
        text: 'Show the iCal string',
        renderTo: Ext.getBody(),
        handler: function(){
            var pattern = Ext.get('recur-pattern');
            if(!pattern.isVisible()){
                pattern.slideIn('t', {duration:.25});
                btn.setText('Refresh the iCal string');
            }
            var v = recurField.getValue();
            pattern.update(v.length > 0 ? v : '(Empty)');
        }
    });
});