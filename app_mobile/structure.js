 MitsoMobile.Structure = [
    {
        text: 'Calendar Events',
        cls: 'launchscreen',
        card: Ext.is.Phone ? false : demos.calendar_panel,
        items: [
            {
                text: 'Today\'s App',
                card: demos.TodaysAppointmentsList,
                source: 'app_mobile/panels/todays_appointments_list.js',
                leaf: true
            },
            {
                text: 'At the Clinic',
                card: demos.PatientAtClinicList,
                source: 'app_mobile/panels/patient_at_clinic_list.js',
                leaf: true
            },
            {
                text: 'Schedules',
                card: demos.List,
                source: 'app_mobile/panels/list.js',
                leaf: true
            }
        ]
    },
    {
        text: 'Patient Area',
        cls: 'launchscreen',
        card: demos.PatientsList,
        source: 'app_mobile/panels/patients_list.js',
       //  leaf: true,
                items: [
            {
                text: 'Select Patient',
                card: demos.PatientsList,
                source: 'app_mobile/panels/patients_list.js',
                leaf: true
            },
            {
                text: 'Encounters',
                card: demos.PatientAtClinicList,
                source: 'app_mobile/panels/patient_at_clinic_list.js',
                leaf: true
            },
            {
                text: 'Allergies',
                card: demos.PatientAtClinicList,
                source: 'app_mobile/panels/patient_at_clinic_list.js',
                leaf: true
            }
        ]
    },
    {
        text: 'My Account',
        cls: 'launchscreen',
        card: demos.MyAccount,
        source: 'app_mobile/panels/my_account.js',
        leaf: true
    },
    {
        text: 'Admin Area',
        cls: 'launchscreen',
        items:[
            {
                text: 'Themes',
                card: demos.Themes,
                source: 'app_mobile/panels/themes.js',
                leaf: true
            }
        ]
    }
];

if (Ext.is.iOS || Ext.is.Desktop) {
    MitsoMobile.Structure.push({
        text: 'MitosEHR Settings',
        cls: 'launchscreen',
        items:[
            {
                text: 'Themes',
                card: demos.Themes,
                source: 'app_mobile/panels/themes.js',
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

MitsoMobile.StructureStore = new Ext.data.TreeStore({
    model: 'Demo',
    root: {
        items: MitsoMobile.Structure
    },
    proxy: {
        type: 'ajax',
        reader: {
            type: 'tree',
            root: 'items'
        }
    }
});
