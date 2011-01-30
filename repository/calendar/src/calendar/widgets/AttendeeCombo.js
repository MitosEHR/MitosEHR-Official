/*!
 * Extensible 1.0-alpha1
 * Copyright(c) 2010 ThinkFirst, LLC
 * team@ext.ensible.com
 * http://ext.ensible.com
 */
Ext.ensible.cal.AttendeeCombo = Ext.extend(Ext.ux.form.SuperBoxSelect, {
    fieldLabel: 'Attendees',
    name: 'attendees',
    anchor:'100%',
    mode: 'local',
    displayField: 'Name',
    valueField: 'AttendeeId',
    classField: 'cls',
    styleField: 'style',
    extraItemStyle: 'border-width:2px'
});

Ext.reg('extensible.attendeecombo', Ext.ensible.cal.AttendeeCombo);
