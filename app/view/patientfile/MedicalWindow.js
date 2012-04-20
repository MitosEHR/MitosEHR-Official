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
    height       : 700,
    width        : 1000,
    bodyStyle    : 'background-color:#fff',
    modal        : true,
    defaults     : {
        margin: 5
    },
    initComponent: function() {

        var me = this;

        me.ImmuListStore = Ext.create('App.store.patientfile.Immunization');
        me.patientImmuListStore = Ext.create('App.store.patientfile.PatientImmunization', {
            groupField: 'immunization_name',
            sorters   : ['immunization_name', 'administered_date'],
            autoSync  : true
        });
        me.patientAllergiesListStore = Ext.create('App.store.patientfile.Allergies', {

            autoSync: true
        });
        me.patientMedicalIssuesStore = Ext.create('App.store.patientfile.MedicalIssues', {

            autoSync: true
        });
        me.patientSurgeryStore = Ext.create('App.store.patientfile.Surgery', {

            autoSync: true
        });
        me.patientDentalStore = Ext.create('App.store.patientfile.Dental', {

            autoSync: true
        });
        me.patientMedicationsStore = Ext.create('App.store.patientfile.Medications', {

            listeners: {
                scope     : me,
                beforesync: me.setDefaults
            },
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
                                            width: 240

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
                                            labelWidth: 130,
                                            name      : 'note'

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
                                            width     : 240,
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
                                            width     : 240,
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
                                            width     : 240,
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
                                            width     : 240,
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
                        //                        {
                        //                            xtype        : 'container',
                        //                            layout       : 'column',
                        //                            defaults     : { border: false, columnWidth: .5, defaultType: 'textfield', layout: 'anchor'},
                        //                            fieldDefaults: { msgTarget: 'side', labelWidth: 100, anchor: '80%' },
                        //                            items        : [
                        //                                {
                        //                                    xtype: 'container',
                        //                                    items: [
                        //
                        //                                        {
                        //                                            fieldLabel: 'Title',
                        //                                            itemId    : 'title',
                        //                                            name      : 'title'
                        //                                        },
                        //                                        {
                        //                                            fieldLabel: 'Diagnosis Code',
                        //                                            name      : 'diagnosis_code'
                        //
                        //                                        },
                        //                                        {
                        //                                            fieldLabel: 'Begin Date',
                        //                                            xtype     : 'datefield',
                        //                                            format    : 'Y-m-d H:i:s',
                        //                                            name      : 'begin_date'
                        //
                        //
                        //                                        },
                        //                                        {
                        //                                            fieldLabel: 'End Date',
                        //                                            xtype     : 'datefield',
                        //                                            format    : 'Y-m-d H:i:s',
                        //                                            name      : 'end_date'
                        //
                        //                                        }
                        //
                        //                                    ]
                        //                                },
                        //                                {
                        //                                    xtype: 'container',
                        //                                    items: [
                        //                                        {
                        //                                            fieldLabel: 'Ocurrence',
                        //                                            xtype     : 'mitos.occurrencecombo',
                        //                                            name      : 'ocurrence'
                        //
                        //                                        },
                        //                                        {
                        //                                            fieldLabel: 'Referred by',
                        //                                            name      : 'referred_by'
                        //                                        },
                        //                                        {
                        //                                            fieldLabel: 'Outcome',
                        //                                            xtype     : 'mitos.outcome2combo',
                        //                                            name      : 'outcome'
                        //
                        //                                        },
                        //                                        {
                        //                                            fieldLabel: 'Destination',
                        //                                            name      : 'destination'
                        //                                        }
                        //                                    ]
                        //                                }
                        //                            ]
                        //                        }
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
                                            width     : 240,
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

    onOptionType: function(combo) {
        var value = combo.getValue(), titlefield = combo.up('form').query('textfield[action="title"]');

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

    setDefaults: function(options, context) {

        var data;

        if(options.update) {
            data = options.update[0].data;
            data.updated_uid = app.user.id;
        } else if(options.create) {

        }

    },

    cardSwitch: function(btn) {
        var layout = this.getLayout(), title;

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

        }

        this.setTitle(app.currPatient.name + ' - Medical Window ( ' + title + ' )');

    },

    onMedicalWinShow: function() {
        this.patientImmuListStore.load({params: {pid: app.currPatient.pid}});
        this.patientAllergiesListStore.load({params: {pid: app.currPatient.pid}});
        this.patientMedicalIssuesStore.load({params: {pid: app.currPatient.pid}});
        this.patientSurgeryStore.load({params: {pid: app.currPatient.pid}});
        this.patientDentalStore.load({params: {pid: app.currPatient.pid}});
        this.patientMedicationsStore.load({params: {pid: app.currPatient.pid}});

    }


});