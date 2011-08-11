sink.Structure = [
    {
        text: 'Calendar Events',
        cls: 'launchscreen',
        card: Ext.is.Phone ? false : demos.calendar_panel,
        items: [
            {
                text: 'Today\'s App',
                card: demos.TodaysAppointmentsList,
                source: 'app_mobile/src/panels/todays_appointments_list.js',
                leaf: true
            },
            {
                text: 'At the Clinic',
                card: demos.PatientAtClinicList,
                source: 'app_mobile/src/panels/patient_at_clinic_list.js',
                leaf: true
            },
            {
                text: 'Schedules',
                card: demos.List,
                source: 'app_mobile/src/panels/list.js',
                leaf: true
            }
        ]
    },
    {
        text: 'Patient Area',
        cls: 'launchscreen',
        card: Ext.is.Phone ? false : demos.PatientsList,
        source: 'app_mobile/src/panels/patients_list.js',
        leaf: true
    },
    {
        text: 'My Account',
        cls: 'launchscreen',
        card: demos.MyAccount,
        source: 'app_mobile/src/panels/my_account.js',
        leaf: true
    },
    {
        text: 'Admin Area',
        cls: 'launchscreen',
        items:[
            {
                text: 'Themes',
                card: demos.Themes,
                source: 'app_mobile/src/panels/themes.js',
                leaf: true
            }
        ]
    }
];

if (Ext.is.iOS || Ext.is.Desktop) {
    sink.Structure.push({
        text: 'MitosEHR Settings',
        cls: 'launchscreen',
        items:[
            {
                text: 'Themes',
                card: demos.Themes,
                source: 'app_mobile/src/panels/themes.js',
                leaf: true
            }
        ]
    });
}

Ext.regModel('Demo', {
    fields: [
        {name: 'text',        type: 'string'},
        {name: 'source',      type: 'string'},
        {name: 'preventHide', type: 'boolean'},
        {name: 'cardSwitchAnimation'},
        {name: 'card'}
    ]
});

sink.StructureStore = new Ext.data.TreeStore({
    model: 'Demo',
    root: {
        items: sink.Structure
    },
    proxy: {
        type: 'ajax',
        reader: {
            type: 'tree',
            root: 'items'
        }
    }
});
