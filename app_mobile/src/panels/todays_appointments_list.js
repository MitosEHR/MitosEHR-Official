Ext.regModel('TodaysAppointmentsModel', {
    fields: ['firstName', 'lastName']
});

demos.TodaysAppointmentsList = new Ext.data.Store({
    model: 'TodaysAppointmentsModel',
    sorters: 'firstName',
    data: [
        {firstName: 'Julio', lastName: 'Benesh'},
        {firstName: 'Julio', lastName: 'Minich'},
        {firstName: 'Tania', lastName: 'Ricco'},
        {firstName: 'Odessa', lastName: 'Steuck'},
        {firstName: 'Nelson', lastName: 'Raber'},
        {firstName: 'Tyrone', lastName: 'Scannell'},
        {firstName: 'Allan', lastName: 'Disbrow'},
        {firstName: 'Cody', lastName: 'Herrell'},
        {firstName: 'Julio', lastName: 'Burgoyne'},
        {firstName: 'Jessie', lastName: 'Boedeker'},
        {firstName: 'Allan', lastName: 'Leyendecker'},
        {firstName: 'Javier', lastName: 'Lockley'},
        {firstName: 'Guy', lastName: 'Reasor'},
        {firstName: 'Esmeralda', lastName: 'Katzer'},
        {firstName: 'Tania', lastName: 'Belmonte'},
        {firstName: 'Malinda', lastName: 'Kwak'},
        {firstName: 'Tanisha', lastName: 'Jobin'},
        {firstName: 'Kelly', lastName: 'Dziedzic'},
        {firstName: 'Darren', lastName: 'Devalle'},
        {firstName: 'Julio', lastName: 'Buchannon'},
        {firstName: 'Darren', lastName: 'Schreier'},
        {firstName: 'Jamie', lastName: 'Pollman'},
        {firstName: 'Karina', lastName: 'Pompey'},
        {firstName: 'Hugh', lastName: 'Snover'},
        {firstName: 'Zebra', lastName: 'Evilias'}
    ]
});

demos.TodaysAppointmentsList = new Ext.Panel ({
    title: 'Todays Appointments List',
    layout: 'fit',
    cls: 'demo-list',
    items: [{
        width: Ext.is.Phone ? undefined : 300,
        height: Ext.is.Phone ? undefined : 500,
        xtype: 'list',
        onItemDisclosure: function(record, btn, index) {
            Ext.Msg.alert('Tap', 'Disclose more info for ' + record.get('firstName'), Ext.emptyFn);
        },
        store: demos.TodaysAppointmentsList, //getRange(0, 9),
        itemTpl: '<div class="contact"><strong>{firstName}</strong> {lastName}</div>'
    }]
});