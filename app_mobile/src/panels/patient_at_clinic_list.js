Ext.regModel('PatientAtClinicModel', {
    fields: ['firstName', 'lastName']
});

demos.PatientAtClinicListStore = new Ext.data.Store({
    model: 'PatientAtClinicModel',
    sorters: 'firstName',
    data: [
        {firstName: 'Julio', lastName: 'Benesh'},
        {firstName: 'Julio', lastName: 'Minich'},
        {firstName: 'Tania', lastName: 'Ricco'},
        {firstName: 'Odessa', lastName: 'Steuck'},
        {firstName: 'Nelson', lastName: 'Raber'},
        {firstName: 'Tyrone', lastName: 'Scannell'},
        {firstName: 'Allan', lastName: 'Disbrow'}
    ]
});

demos.PatientAtClinicList = new Ext.Panel ({
    title: 'Patient At The Clinic',
    layout: 'fit',
    cls: 'demo-list',
    items: [{
        width: Ext.is.Phone ? undefined : 300,
        height: Ext.is.Phone ? undefined : 500,
        xtype: 'list',
        onItemDisclosure: function(record, btn, index) {
            Ext.Msg.alert('Tap', 'Disclose more info for ' + record.get('firstName'), Ext.emptyFn);
        },
        store: demos.PatientAtClinicListStore, //getRange(0, 9),
        itemTpl: '<div class="contact"><strong>{firstName}</strong> {lastName}</div>'
    }]
});