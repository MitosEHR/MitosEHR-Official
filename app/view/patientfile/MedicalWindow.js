/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File:
 * Date: 2/15/12
 * Time: 4:30 PM
 *
 * @namespace Immunization.getImmunizationsList
 * @namespace Immunization.getPatientImmunizations
 * @namespace Immunization.addPatientImmunization
 */
Ext.define('App.view.patientfile.MedicalWindow', {
    extend       : 'Ext.window.Window',
    title        : 'Medical Window',
    layout       : 'card',
    closeAction  : 'hide',
    height       : 800,
    width        : 1200,
    bodyStyle    : 'background-color:#fff',
    modal        : true,
    defaults     : {
        margin: 5
    },
    initComponent: function() {

        var me = this;


        me.patientImmuListStore = Ext.create('App.store.patientfile.PatientImmunization', {
            groupField: 'immunization_name',
            sorters   : ['immunization_name', 'administered_date'],
            autoSync  : true
        });
        me.patientAllergiesListStore = Ext.create('App.store.patientfile.Allergies', {

            listeners: {
                scope     : me,
                beforesync: me.setDefaults
            },
            autoSync : true
        });
        me.patientMedicalIssuesStore = Ext.create('App.store.patientfile.MedicalIssues', {

            listeners: {
                scope     : me,
                beforesync: me.setDefaults
            },
            autoSync : true
        });
        me.patientSurgeryStore = Ext.create('App.store.patientfile.Surgery', {

            listeners: {
                scope     : me,
                beforesync: me.setDefaults
            },
            autoSync : true
        });
        me.patientDentalStore = Ext.create('App.store.patientfile.Dental', {

            listeners: {
                scope     : me,
                beforesync: me.setDefaults
            },
            autoSync : true
        });
        me.patientMedicationsStore = Ext.create('App.store.patientfile.Medications', {

            listeners: {
                scope     : me,
                beforesync: me.setDefaults
            },
            autoSync : true
        });
        me.labPanelsStore = Ext.create('App.store.patientfile.LaboratoryTypes',{
            autoSync : true
        });

        me.items = [
            {
                xtype   : 'grid',
                action  : 'patientImmuListGrid',
                itemId  : 'patientImmuListGrid',
                store   : me.patientImmuListStore,
                features: Ext.create('Ext.grid.feature.Grouping', {
                    groupHeaderTpl   : 'Immunization: {name} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})',
                    hideGroupedHeader: true
                }),
                columns : [
                    {
                        header   : 'Immunization Name',
                        width    : 100,
                        dataIndex: 'immunization_name'
                    },
                    {
                        header   : 'Code Type',
                        width    : 100,
                        dataIndex: 'immunization_id'
                    },
                    {
                        header   : 'Date',
                        width    : 100,
                        dataIndex: 'administered_date'
                    },
                    {
                        header   : 'Manufacturer',
                        width    : 100,
                        dataIndex: 'manufacturer'
                    },
                    {
                        header   : 'Lot Number',
                        width    : 100,
                        dataIndex: 'lot_number'
                    },
                    {
                        header   : 'Date Immunization',
                        flex     : 1,
                        dataIndex: 'education_date'
                    },
                    {
                        header   : 'Date VIS Statement',
                        flex     : 1,
                        dataIndex: 'vis_date'

                    },
                    {
                        header   : 'Notes',
                        flex     : 1,
                        dataIndex: 'note'
                    }
                ],

                plugins: Ext.create('App.classes.grid.RowFormEditing', {
                    autoCancel  : false,
                    errorSummary: false,
                    clicksToEdit: 1,
                    enableRemove: true,
                    formItems   : [

                        {

                            title : 'general',
                            xtype : 'container',
                            layout: 'vbox',
                            items : [
                                {
                                    /**
                                     * Line one
                                     */
                                    xtype   : 'fieldcontainer',
                                    layout  : 'hbox',
                                    defaults: { margin: '0 10 3 0', xtype: 'textfield'},
                                    items   : [

                                        {
                                            xtype          : 'immunizationlivesearch',
                                            fieldLabel     : 'Name',
                                            hideLabel      : false,
                                            itemId         : 'immunization',
                                            enableKeyEvents: true,
                                            width          : 300,
                                            listeners      : {
                                                scope   : me,
                                                'select': me.onOptionType
                                            }
                                        },

                                        {
                                            fieldLabel: 'Administrator',
                                            name      : 'administered_by',
                                            width     : 260

                                        },

                                        {
                                            fieldLabel: 'Info. Statement Given',
                                            width     : 295,
                                            labelWidth: 180,
                                            xtype     : 'datefield',
                                            format    : 'Y-m-d H:i:s',
                                            name      : 'education_date'
                                        }

                                    ]

                                },
                                {
                                    /**
                                     * Line two
                                     */
                                    xtype   : 'fieldcontainer',
                                    layout  : 'hbox',
                                    defaults: { margin: '0 10 3 0', xtype: 'textfield' },
                                    items   : [

                                        {
                                            fieldLabel     : 'Code',
                                            name           : 'immunization_id',
                                            width          : 300,
                                            itemId         : 'immuCode',
                                            action         : 'immuCode',
                                            enableKeyEvents: true

                                        },
                                        {

                                            xtype     : 'numberfield',
                                            fieldLabel: 'Dosis Number',
                                            name      : 'dosis'
                                        },

                                        {
                                            fieldLabel: 'Date Administered',
                                            xtype     : 'datefield',
                                            width     : 295,
                                            labelWidth: 180,
                                            format    : 'Y-m-d',
                                            name      : 'administered_date'
                                        }

                                    ]

                                },
                                {
                                    /**
                                     * Line three
                                     */
                                    xtype   : 'fieldcontainer',
                                    layout  : 'hbox',
                                    defaults: { margin: '0 10 3 0', xtype: 'textfield' },
                                    items   : [

                                        {
                                            fieldLabel: 'Notes',
                                            xtype     : 'textfield',
                                            width     : 300,
                                            name      : 'note'

                                        },
                                        {
                                            fieldLabel: 'Manufacturer',
                                            xtype     : 'textfield',
                                            width     : 260,

                                            name: 'manufacturer'

                                        },
                                        {
                                            fieldLabel: 'Lot Number',
                                            xtype     : 'textfield',
                                            width     : 295,
                                            labelWidth: 180,
                                            name      : 'lot_number'

                                        }

                                    ]

                                }

                            ]

                        }

                    ]
                })
            },
            {
                /**
                 * Allergies Card panel
                 */

                xtype  : 'grid',
                action : 'patientAllergiesListGrid',
                store  : me.patientAllergiesListStore,
                columns: [
                    {
                        header   : 'Type',
                        width    : 100,
                        dataIndex: 'type'
                    },
                    {
                        header   : 'Title',
                        width    : 100,
                        dataIndex: 'title'
                    },
                    {
                        header   : 'Diagnosis Code',
                        width    : 100,
                        dataIndex: 'diagnosis_code'
                    },
                    {
                        header   : 'Begin Date',
                        width    : 100,
                        dataIndex: 'begin_date'
                    },
                    {
                        header   : 'End Date',
                        flex     : 1,
                        dataIndex: 'end_date'
                    },
                    {
                        header   : 'Ocurrence',
                        flex     : 1,
                        dataIndex: 'ocurrence'
                    },
                    {
                        header   : 'Reaction',
                        flex     : 1,
                        dataIndex: 'reaction'
                    },
                    {
                        header   : 'Referred by',
                        flex     : 1,
                        dataIndex: 'referred_by'
                    },
                    {
                        header   : 'Outcome',
                        flex     : 1,
                        dataIndex: 'outcome'
                    },
                    {
                        header   : 'Destination',
                        flex     : 1,
                        dataIndex: 'destination'
                    }
                ],
                plugins: Ext.create('App.classes.grid.RowFormEditing', {
                    autoCancel  : false,
                    errorSummary: false,
                    clicksToEdit: 1,

                    formItems: [

                        {
                            title  : 'general',
                            xtype  : 'container',
                            padding: 10,
                            layout : 'vbox',
                            items  : [
                                {
                                    /**
                                     * Line one
                                     */
                                    xtype   : 'fieldcontainer',
                                    layout  : 'hbox',
                                    defaults: { margin: '0 10 5 0' },
                                    items   : [
                                        {
                                            xtype          : 'textfield',
                                            fieldLabel     : 'Type',
                                            hideLabel      : false,
                                            itemId         : 'allergies',
                                            enableKeyEvents: true,
                                            width          : 225,
                                            labelWidth     : 70,
                                            listeners      : {
                                                scope   : me,
                                                'select': me.onOptionType
                                            }
                                        },

                                        {
                                            fieldLabel: 'Begin Date',
                                            xtype     : 'datefield',
                                            format    : 'Y-m-d H:i:s',
                                            name      : 'begin_date'

                                        },
                                        {
                                            fieldLabel: 'Outcome',
                                            xtype     : 'mitos.outcome2combo',
                                            name      : 'outcome'

                                        }

                                    ]

                                },
                                {
                                    /**
                                     * Line two
                                     */
                                    xtype   : 'fieldcontainer',
                                    layout  : 'hbox',
                                    defaults: { margin: '0 10 5 0' },
                                    items   : [

                                        {   xtype     : 'textfield',
                                            width     : 225,
                                            labelWidth: 70,
                                            fieldLabel: 'Title',
                                            action    : 'title',
                                            name      : 'title'
                                        },
                                        {
                                            fieldLabel: 'End Date',
                                            xtype     : 'datefield',
                                            format    : 'Y-m-d H:i:s',
                                            name      : 'end_date'

                                        },

                                        {
                                            xtype     : 'textfield',
                                            width     : 260,
                                            fieldLabel: 'Referred by',
                                            name      : 'referred_by'
                                        }

                                    ]

                                },
                                {
                                    /**
                                     * Line three
                                     */
                                    xtype   : 'fieldcontainer',
                                    layout  : 'hbox',
                                    defaults: { margin: '0 10 5 0' },
                                    items   : [

                                        {
                                            fieldLabel: 'Ocurrence',
                                            width     : 225,
                                            labelWidth: 70,
                                            xtype     : 'mitos.occurrencecombo',
                                            name      : 'ocurrence'

                                        },
                                        {
                                            xtype     : 'textfield',
                                            width     : 260,
                                            fieldLabel: 'Reaction',
                                            name      : 'reaction'
                                        }

                                    ]
                                }
                            ]
                        }
                    ]
                })
            },
            {
                /**
                 * Medical Issues Card panel
                 */

                xtype  : 'grid',
                action : 'patientMedicalListGrid',
                store  : me.patientMedicalIssuesStore,
                columns: [
                    {
                        header   : 'Type',
                        width    : 100,
                        dataIndex: 'type'
                    },
                    {
                        header   : 'Title',
                        width    : 100,
                        dataIndex: 'title'
                    },
                    {
                        header   : 'Diagnosis Code',
                        width    : 100,
                        dataIndex: 'diagnosis_code'
                    },
                    {
                        header   : 'Begin Date',
                        width    : 100,
                        dataIndex: 'begin_date'
                    },
                    {
                        header   : 'End Date',
                        flex     : 1,
                        dataIndex: 'end_date'
                    },
                    {
                        header   : 'Ocurrence',
                        flex     : 1,
                        dataIndex: 'ocurrence'
                    },
                    {
                        header   : 'Referred by',
                        flex     : 1,
                        dataIndex: 'referred_by'
                    },
                    {
                        header   : 'Outcome',
                        flex     : 1,
                        dataIndex: 'outcome'
                    },
                    {
                        header   : 'Destination',
                        flex     : 1,
                        dataIndex: 'destination'
                    }
                ],
                plugins: Ext.create('App.classes.grid.RowFormEditing', {
                    autoCancel  : false,
                    errorSummary: false,
                    clicksToEdit: 1,

                    formItems: [
                        {
                            title  : 'general',
                            xtype  : 'container',
                            padding: 10,
                            layout : 'vbox',
                            items  : [
                                {
                                    /**
                                     * Line one
                                     */
                                    xtype   : 'fieldcontainer',
                                    layout  : 'hbox',
                                    defaults: { margin: '0 10 5 0' },
                                    items   : [
                                        {
                                            xtype          : 'textfield',
                                            fieldLabel     : 'Type',
                                            name           : 'type',
                                            hideLabel      : false,
                                            itemId         : 'medicalissues',
                                            enableKeyEvents: true,
                                            width          : 225,
                                            labelWidth     : 70,
                                            listeners      : {
                                                scope   : me,
                                                'select': me.onOptionType
                                            }
                                        },

                                        {
                                            fieldLabel: 'Begin Date',
                                            xtype     : 'datefield',
                                            format    : 'Y-m-d H:i:s',
                                            name      : 'begin_date'

                                        },
                                        {
                                            fieldLabel: 'Outcome',
                                            xtype     : 'mitos.outcome2combo',
                                            name      : 'outcome'

                                        }

                                    ]

                                },
                                {
                                    /**
                                     * Line two
                                     */
                                    xtype   : 'fieldcontainer',
                                    layout  : 'hbox',
                                    defaults: { margin: '0 10 5 0' },
                                    items   : [

                                        {   xtype     : 'textfield',
                                            width     : 225,
                                            labelWidth: 70,
                                            fieldLabel: 'Title',
                                            action    : 'title',
                                            name      : 'title'
                                        },
                                        {
                                            fieldLabel: 'End Date',
                                            xtype     : 'datefield',
                                            format    : 'Y-m-d H:i:s',
                                            name      : 'end_date'

                                        },

                                        {
                                            xtype     : 'textfield',
                                            width     : 260,
                                            fieldLabel: 'Referred by',
                                            name      : 'referred_by'
                                        }

                                    ]

                                },
                                {
                                    /**
                                     * Line three
                                     */
                                    xtype   : 'fieldcontainer',
                                    layout  : 'hbox',
                                    defaults: { margin: '0 10 5 0' },
                                    items   : [

                                        {
                                            fieldLabel: 'Ocurrence',
                                            width     : 225,
                                            labelWidth: 70,
                                            xtype     : 'mitos.occurrencecombo',
                                            name      : 'ocurrence'

                                        }

                                    ]
                                }
                            ]
                        }

                    ]
                })
            },
            {
                /**
                 * Surgery Card panel
                 */

                xtype  : 'grid',
                action : 'patientSurgeryListGrid',
                store  : me.patientSurgeryStore,
                columns: [
                    {
                        header   : 'Type',
                        width    : 100,
                        dataIndex: 'type'
                    },
                    {
                        header   : 'Diagnosis Code',
                        width    : 100,
                        dataIndex: 'diagnosis_code'
                    },
                    {
                        header   : 'Begin Date',
                        width    : 100,
                        dataIndex: 'begin_date'
                    },
                    {
                        header   : 'End Date',
                        flex     : 1,
                        dataIndex: 'end_date'
                    },
                    {
                        header   : 'Ocurrence',
                        flex     : 1,
                        dataIndex: 'ocurrence'
                    },
                    {
                        header   : 'Referred by',
                        flex     : 1,
                        dataIndex: 'referred_by'
                    },
                    {
                        header   : 'Outcome',
                        flex     : 1,
                        dataIndex: 'outcome'
                    },
                    {
                        header   : 'Destination',
                        flex     : 1,
                        dataIndex: 'destination'
                    }
                ],
                plugins: Ext.create('App.classes.grid.RowFormEditing', {
                    autoCancel  : false,
                    errorSummary: false,
                    clicksToEdit: 1,
                    formItems   : [
                        {
                            title  : 'general',
                            xtype  : 'container',
                            padding: 10,
                            layout : 'vbox',
                            items  : [
                                {
                                    /**
                                     * Line one
                                     */
                                    xtype   : 'fieldcontainer',
                                    layout  : 'hbox',
                                    defaults: { margin: '0 10 5 0' },
                                    items   : [
                                        {
                                            fieldLabel     : 'Type',
                                            name           : 'type',
                                            width          : 225,
                                            labelWidth     : 70,
                                            xtype          : 'mitos.surgerycombo',
                                            itemId         : 'surgery',
                                            enableKeyEvents: true,
                                            listeners      : {
                                                scope   : me,
                                                'select': me.onOptionType
                                            }
                                        },

                                        {
                                            fieldLabel: 'Begin Date',
                                            xtype     : 'datefield',
                                            format    : 'Y-m-d H:i:s',
                                            name      : 'begin_date'

                                        },
                                        {
                                            fieldLabel: 'Outcome',
                                            xtype     : 'mitos.outcome2combo',
                                            name      : 'outcome'

                                        }

                                    ]

                                },
                                {
                                    /**
                                     * Line two
                                     */
                                    xtype   : 'fieldcontainer',
                                    layout  : 'hbox',
                                    defaults: { margin: '0 10 5 0' },
                                    items   : [

                                        {   xtype     : 'textfield',
                                            width     : 225,
                                            labelWidth: 70,
                                            fieldLabel: 'Title',
                                            action    : 'title',
                                            name      : 'title'
                                        },
                                        {
                                            fieldLabel: 'End Date',
                                            xtype     : 'datefield',
                                            format    : 'Y-m-d H:i:s',
                                            name      : 'end_date'

                                        },

                                        {
                                            xtype     : 'textfield',
                                            width     : 260,
                                            fieldLabel: 'Referred by',
                                            name      : 'referred_by'
                                        }

                                    ]

                                },
                                {
                                    /**
                                     * Line three
                                     */
                                    xtype   : 'fieldcontainer',
                                    layout  : 'hbox',
                                    defaults: { margin: '0 10 5 0' },
                                    items   : [

                                        {
                                            fieldLabel: 'Ocurrence',
                                            width     : 225,
                                            labelWidth: 70,
                                            xtype     : 'mitos.occurrencecombo',
                                            name      : 'ocurrence'

                                        }

                                    ]
                                }
                            ]
                        }

                    ]
                })
            },
            {
                /**
                 * Dental Card panel
                 */

                xtype  : 'grid',
                action : 'patientDentalListGrid',
                store  : me.patientDentalStore,
                columns: [
                    {
                        header   : 'Title',
                        width    : 100,
                        dataIndex: 'title'
                    },
                    {
                        header   : 'Diagnosis Code',
                        width    : 100,
                        dataIndex: 'diagnosis_code'
                    },
                    {
                        header   : 'Begin Date',
                        width    : 100,
                        dataIndex: 'begin_date'
                    },
                    {
                        header   : 'End Date',
                        flex     : 1,
                        dataIndex: 'end_date'
                    },
                    {
                        header   : 'Ocurrence',
                        flex     : 1,
                        dataIndex: 'ocurrence'
                    },
                    {
                        header   : 'Referred by',
                        flex     : 1,
                        dataIndex: 'referred_by'
                    },
                    {
                        header   : 'Outcome',
                        flex     : 1,
                        dataIndex: 'outcome'
                    },
                    {
                        header   : 'Destination',
                        flex     : 1,
                        dataIndex: 'destination'
                    }
                ],
                plugins: Ext.create('App.classes.grid.RowFormEditing', {
                    autoCancel  : false,
                    errorSummary: false,
                    clicksToEdit: 1,
                    formItems   : [
                        {
                            title  : 'general',
                            xtype  : 'container',
                            padding: 10,
                            layout : 'vbox',
                            items  : [
                                {
                                    /**
                                     * Line one
                                     */
                                    xtype   : 'fieldcontainer',
                                    layout  : 'hbox',
                                    defaults: { margin: '0 10 5 0' },
                                    items   : [

                                        {   xtype     : 'textfield',
                                            width     : 225,
                                            labelWidth: 70,
                                            fieldLabel: 'Title',
                                            action    : 'title',
                                            name      : 'title'
                                        },

                                        {
                                            fieldLabel: 'Begin Date',
                                            xtype     : 'datefield',
                                            format    : 'Y-m-d H:i:s',
                                            name      : 'begin_date'

                                        },
                                        {
                                            fieldLabel: 'Outcome',
                                            xtype     : 'mitos.outcome2combo',
                                            name      : 'outcome'

                                        }

                                    ]

                                },
                                {
                                    /**
                                     * Line two
                                     */
                                    xtype   : 'fieldcontainer',
                                    layout  : 'hbox',
                                    defaults: { margin: '0 10 5 0' },
                                    items   : [

                                        {
                                            xtype     : 'textfield',
                                            width     : 225,
                                            labelWidth: 70,
                                            fieldLabel: 'Referred by',
                                            name      : 'referred_by'
                                        },

                                        {
                                            fieldLabel: 'End Date',
                                            xtype     : 'datefield',
                                            format    : 'Y-m-d H:i:s',
                                            name      : 'end_date'

                                        },
                                        {
                                            fieldLabel: 'Ocurrence',
                                            xtype     : 'mitos.occurrencecombo',
                                            name      : 'ocurrence'

                                        }

                                    ]

                                }
                            ]
                        }

                    ]
                })
            },
            {
                /**
                 * Medications panel
                 */

                xtype  : 'grid',
                action : 'patientMedicationsListGrid',
                store  : me.patientMedicationsStore,
                columns: [
                    {
                        header   : 'Title',
                        width    : 100,
                        dataIndex: 'title'
                    },
                    {
                        header   : 'Diagnosis Code',
                        width    : 100,
                        dataIndex: 'diagnosis_code'
                    },
                    {
                        header   : 'Begin Date',
                        width    : 100,
                        dataIndex: 'begin_date'
                    },
                    {
                        header   : 'End Date',
                        flex     : 1,
                        dataIndex: 'end_date'
                    },
                    {
                        header   : 'Ocurrence',
                        flex     : 1,
                        dataIndex: 'ocurrence'
                    },
                    {
                        header   : 'Referred by',
                        flex     : 1,
                        dataIndex: 'referred_by'
                    },
                    {
                        header   : 'Outcome',
                        flex     : 1,
                        dataIndex: 'outcome'
                    },
                    {
                        header   : 'Destination',
                        flex     : 1,
                        dataIndex: 'destination'
                    }
                ],
                plugins: Ext.create('App.classes.grid.RowFormEditing', {
                    autoCancel  : false,
                    errorSummary: false,
                    clicksToEdit: 1,

                    formItems: [
                        {
                            title  : 'general',
                            xtype  : 'container',
                            padding: 10,
                            layout : 'vbox',
                            items  : [
                                {
                                    /**
                                     * Line one
                                     */
                                    xtype   : 'fieldcontainer',
                                    layout  : 'hbox',
                                    defaults: { margin: '0 10 5 0' },
                                    items   : [
                                        {
                                            xtype          : 'medicationlivetsearch',
                                            fieldLabel     : 'Type',
                                            hideLabel      : false,
                                            itemId         : 'medication',
                                            enableKeyEvents: true,
                                            width          : 225,
                                            labelWidth     : 70,
                                            listeners      : {
                                                scope   : me,
                                                'select': me.onOptionType
                                            }
                                        },

                                        {
                                            fieldLabel: 'Begin Date',
                                            xtype     : 'datefield',
                                            format    : 'Y-m-d H:i:s',
                                            name      : 'begin_date'

                                        },
                                        {
                                            fieldLabel: 'Outcome',
                                            xtype     : 'mitos.outcome2combo',
                                            name      : 'outcome'

                                        }

                                    ]

                                },
                                {
                                    /**
                                     * Line two
                                     */
                                    xtype   : 'fieldcontainer',
                                    layout  : 'hbox',
                                    defaults: { margin: '0 10 5 0' },
                                    items   : [

                                        {   xtype     : 'textfield',
                                            width     : 225,
                                            labelWidth: 70,
                                            fieldLabel: 'Title',
                                            action    : 'title',
                                            name      : 'title'
                                        },
                                        {
                                            fieldLabel: 'End Date',
                                            xtype     : 'datefield',
                                            format    : 'Y-m-d H:i:s',
                                            name      : 'end_date'

                                        },

                                        {
                                            xtype     : 'textfield',
                                            width     : 260,
                                            fieldLabel: 'Referred by',
                                            name      : 'referred_by'
                                        }

                                    ]

                                },
                                {
                                    /**
                                     * Line three
                                     */
                                    xtype   : 'fieldcontainer',
                                    layout  : 'hbox',
                                    defaults: { margin: '0 10 5 0' },
                                    items   : [

                                        {
                                            fieldLabel: 'Ocurrence',
                                            width     : 225,
                                            labelWidth: 70,
                                            xtype     : 'mitos.occurrencecombo',
                                            name      : 'ocurrence'

                                        }

                                    ]
                                }
                            ]
                        }
                    ]
                })
            },
            {
                /**
                 * Lab panel
                 */
                xtype : 'container',
                action: 'patientLabs',
                layout:'border',
                items:[
                    {
                        xtype:'panel',
                        region:'north',
                        layout:'border',
                        bodyBorder:false,
                        border:false,
                        height:300,
                        split:true,
                        items:[
                            {
                                xtype:'grid',
                                region:'west',
                                width:290,
                                split:true,
                                store:me.labPanelsStore,
                                columns:[
                                    {
                                        header:'Laboratories',
                                        dataIndex:'label',
                                        flex:1
                                    }
                                ],
                                listeners:{
                                    scope:me,
                                    itemclick:me.onLabPanelSelected,
                                    selectionchange:me.onLabPanelSelectionChange
                                }
                            },
                            {
                                xtype:'panel',
                                action:'labPreviewPanel',
                                title:'Laboratory Preview',
                                region:'center',
                                items:[
                                    me.uploadWin = Ext.create('Ext.window.Window',{
                                        draggable :false,
                                        closable:false,
                                        closeAction:'hide',
                                        items:[
                                            {
                                                xtype:'form',
                                                bodyPadding:10,
                                                width:400,
                                                items:[
                                                    {
                                                        xtype: 'filefield',
                                                        name: 'filePath',
                                                        buttonText: 'Select a file...',
                                                        anchor:'100%'
                                                    }
                                                ],
                                             //   url: 'dataProvider/DocumentHandler.php'
                                                api: {
                                                    submit: DocumentHandler.uploadDocument
                                                }
                                            }
                                        ],
                                        buttons:[
                                            {
                                                text:'Cancel',
                                                handler:function(){
                                                    me.uploadWin.close();
                                                }
                                            },
                                            {
                                                text:'Upload',
                                                scope:me,
                                                handler:me.onLabUpload
                                            }
                                        ]
                                    })
                                ]
                            }
                        ],
                        tbar:[
                            '->',
                            {
                                text:'Scan'
                            },
                            '-',
                            {
                                text:'Upload',
                                disabled:true,
                                action:'uploadBtn',
                                scope:me,
                                handler:me.onLabUploadWind
                            }
                        ]
                    },
                    {
                        xtype:'container',
                        region:'center',
                        layout:'border',
                        split:true,
                        items:[
                            {
                                xtype:'form',
                                title:'Laboratory Entry Form',
                                region:'west',
                                width:290,
                                split:true,
                                bodyPadding:5,
                                autoScroll:true,
                                bbar:[
                                    '->',
                                    {
                                        text:'Reset',
                                        scope:me,
                                        handler:me.onLabResultsReset
                                    },
                                    '-',
                                    {
                                        text:'Save',
                                        scope:me,
                                        handler:me.onLabResultsSave
                                    }
                                ]
                            },
                            {
                                xtype:'panel',
                                region:'center',
                                height:300,
                                split:true,
                                items:[
                                    {
                                        xtype:'lalboratoryresultsdataview',
                                        action:'lalboratoryresultsdataview',
                                        store: Ext.create('App.store.patientfile.PatientLabsResults'),
                                        listeners:{
                                            scope:me,
                                            itemclick:me.onLabResultClick
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];

        me.dockedItems = [
            {
                xtype: 'toolbar',
                items: [
                    {

                        text        : 'Immunization',
                        enableToggle: true,
                        toggleGroup : 'medicalWin',
                        pressed     : true,
                        itemId      : 'immunization',
                        action      : 'immunization',
                        scope       : me,
                        handler     : me.cardSwitch
                    },
                    '-',
                    {
                        text        : 'Allergies',
                        enableToggle: true,
                        toggleGroup : 'medicalWin',
                        itemId      : 'allergies',
                        action      : 'allergies',
                        scope       : me,
                        handler     : me.cardSwitch
                    },
                    '-',
                    {
                        text        : 'Medical Issues',
                        enableToggle: true,
                        toggleGroup : 'medicalWin',
                        itemId      : 'issues',
                        action      : 'issues',
                        scope       : me,
                        handler     : me.cardSwitch
                    },
                    '-',
                    {
                        text        : 'Surgery',
                        enableToggle: true,
                        toggleGroup : 'medicalWin',
                        itemId      : 'surgery',
                        action      : 'surgery',
                        scope       : me,
                        handler     : me.cardSwitch
                    },
                    '-',
                    {
                        text        : 'Dental',
                        enableToggle: true,
                        toggleGroup : 'medicalWin',
                        itemId      : 'dental',
                        action      : 'dental',
                        scope       : me,
                        handler     : me.cardSwitch
                    },
                    '-',
                    {
                        text        : 'Medications',
                        enableToggle: true,
                        toggleGroup : 'medicalWin',
                        itemId      : 'medications',
                        action      : 'medications',
                        scope       : me,
                        handler     : me.cardSwitch
                    },
                    '-',
                    {
                        text        : 'Laboratories',
                        enableToggle: true,
                        toggleGroup : 'medicalWin',
                        itemId      : 'laboratories',
                        action      : 'laboratories',
                        scope       : me,
                        handler     : me.cardSwitch
                    },
                    '->',
                    {
                        text   : 'Add New',
                        action : 'AddRecord',
                        scope  : me,
                        handler: me.onAddItem
                    }
                ]
            }
        ];
        me.listeners = {
            scope: me,
            show: me.onMedicalWinShow
        };
        me.callParent(arguments);
    },

    //*******************************************************

    onLabPanelSelected:function(grid, model){
        var me = this,
            formPanel = me.query('[action="patientLabs"]')[0].down('form'),
            dataView = me.query('[action="lalboratoryresultsdataview"]')[0],
            store = dataView.store,
            fields = [];

        formPanel.removeAll();

        formPanel.add({
            xtype:'textfield',
            name:'id',
            hidden:true
        });
        Ext.each(model.data.fields, function(field){
            formPanel.add({
                xtype:'fieldcontainer',
                layout:'hbox',
                margin:0,
                anchor:'100%',
                items:[
                    {
                        xtype:'textfield',
                        fieldLabel:field.code_text_short || field.loinc_name,
                        name:field.loinc_number,
                        labelWidth:130,
                        flex:1,
                        allowBlank: field.required_in_panel != 'R'
                    },
                    {
                        xtype:'mitos.unitscombo',
                        value: field.default_unit,
                        name:field.loinc_number+'_unit',
                        width:90
                    }
                ]
            });
        });

        store.load({params:{parent_id:model.data.id}});
    },

    onLabPanelSelectionChange:function(model, record){
        this.query('[action="uploadBtn"]')[0].setDisabled(record.length == 0);
    },

    onLabUploadWind:function(){
        var me = this,
            previewPanel = me.query('[action="labPreviewPanel"]')[0], win;
        me.uploadWin.show();
        me.uploadWin.alignTo(previewPanel.el.dom,'tr-tr',[-5,30])
    },

    onLabUpload:function(btn){
        var me = this,
            form = me.uploadWin.down('form').getForm(),
            win = btn.up('window');

        if(form.isValid()){
            form.submit({
                waitMsg: 'Uploading Laboratory...',
                params:{
                    pid:app.currPatient.pid,
                    docType:'laboratory'
                },
                success: function(fp, o) {
                    win.close();

                    say(o.result);
                },
                failure:function(fp, o){
                    say(o.result.error);

                }
            });
        }

       // DocumentHandler.uploadDocument(values);

    },

    onLabResultClick:function(view, model){
        var me = this,
            form = me.query('[action="patientLabs"]')[0].down('form').getForm();
        form.reset();
        model.data.data.id = model.data.id;
        form.setValues(model.data.data);
    },

    onLabResultsSave:function(btn){
        var me = this,
            form = btn.up('form').getForm(),
            dataView = me.query('[action="lalboratoryresultsdataview"]')[0],
            store = dataView.store,
            values = form.getValues(),
            record  = dataView.getSelectionModel().getLastSelected();

        if(form.isValid()){
            Medical.updatePatientLabsResult(values,function(){
                store.load({params:{parent_id:record.data.parent_id}});
                form.reset();
            });
        }

    },
    onLabResultsReset:function(btn){
        var form = btn.up('form').getForm();
        form.reset();
    },

    //*********************************************************


    onCancel: function(btn) {
        var me = this, panel, form;
        if(btn.itemId == 'CancelImmunization') {
            panel = me.getLayout().getActiveItem().getComponent('immuNorth');
            form = panel.down('form').getForm();
        } else {
            panel = me.getLayout().getActiveItem().down('form');
            form = panel.getForm();
        }
        me.closeImmunizationGrid();

        panel.collapse();
        panel.hide();
        form.reset();
    },

    closeImmunizationGrid: function() {
        var grid = this.getComponent('patientImmuListGrid').plugins[0].editor.query('grid[action="immuListGrid"]');
        grid[0].collapse();
    },

    openImmunizationGrid: function() {
        var grid = this.getComponent('patientImmuListGrid').plugins[0].editor.query('grid[action="immuListGrid"]');
        grid[0].expand();
    },

    onCodeFieldFocus: function() {
        this.openImmunizationGrid();
    },

    onOptionType: function(val, model) {
        var value = model[0].data.code, titlefield = val.up('form').query('textfield[action="immuCode"]');

        titlefield[0].setValue(value);
    },

    onAddItem: function() {

        var grid = this.getLayout().getActiveItem(), store = grid.store, data;

        grid.editingPlugin.cancelEdit();
        store.insert(0, {
            created_uid: app.user.id,
            pid        : app.currPatient.pid,
            create_date: new Date(),
            eid        : app.currEncounterId,
            begin_date : new Date()

        });
        grid.editingPlugin.startEdit(0, 0);

    },

    setDefaults: function(options) {
        var data;

        if(options.update) {
            data = options.update[0].data;
            data.updated_uid = app.user.id;
        } else if(options.create) {

        }
    },

    cardSwitch: function(btn) {
        var layout = this.getLayout(),
            addBtn = this.down('toolbar').query('[action="AddRecord"]')[0],
            title;

        addBtn.show();
        if(btn.action == 'immunization') {
            layout.setActiveItem(0);
            title = 'Immunizations';

        } else if(btn.action == 'allergies') {
            layout.setActiveItem(1);
            title = 'Allergies';

        } else if(btn.action == 'issues') {
            layout.setActiveItem(2);
            title = 'Medical Issues';

        } else if(btn.action == 'surgery') {
            layout.setActiveItem(3);
            title = 'Surgeries';

        } else if(btn.action == 'dental') {
            layout.setActiveItem(4);
            title = 'Dentals';

        } else if(btn.action == 'medications') {
            layout.setActiveItem(5);
            title = 'Medications';

        } else if(btn.action == 'laboratories') {
            layout.setActiveItem(6);
            title = 'Laboratories';
            addBtn.hide();
        }

        this.setTitle(app.currPatient.name + ' - Medical Window ( ' + title + ' )');

    },

    onMedicalWinShow: function() {
        this.labPanelsStore.load();
        this.patientImmuListStore.load({params: {pid: app.currPatient.pid}});
        this.patientAllergiesListStore.load({params: {pid: app.currPatient.pid}});
        this.patientMedicalIssuesStore.load({params: {pid: app.currPatient.pid}});
        this.patientSurgeryStore.load({params: {pid: app.currPatient.pid}});
        this.patientDentalStore.load({params: {pid: app.currPatient.pid}});
        this.patientMedicationsStore.load({params: {pid: app.currPatient.pid}});

    }


});