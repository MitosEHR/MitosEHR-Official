Ext.onReady(function() {
//     new Ext.Viewport({
//         layout: {
//             type : 'vbox',
//             pack : 'start',
//             align: 'stretch'
//         },
//         items: [{
//             flex: 1,
//             layout: {
//                 type : 'hbox',
//                 pack : 'start',
//                 align: 'stretch'
//             },
//             items: [{
//                 flex: 1,
//                 html: 'Top 1'
//             },{
//                 flex: 1,
//                 html: 'Top 2'
//             },{
//                 flex: 1,
//                 html: 'Top 3'
//             },{
//                 flex: 1,
//                 html: 'Top 4'
//             },{
//                 flex: 1,
//                 html: 'Top 5'
//             },{
//                 flex: 1,
//                 html: 'Top 6'
//             },{
//                 flex: 1,
//                 html: 'Top 7'
//             }]
//         }, {
//             flex: 7,
//             layout: {
//                 type : 'hbox',
//                 pack : 'start',
//                 align: 'stretch'
//             },
//             items: [{
//                 flex: 7,
//                 html: 'Centerish'
//             }, {
//                 flex: 1,
//                 layout: {
//                     type : 'vbox',
//                     pack : 'start',
//                     align: 'stretch'
//                 },
//                 items: [{
//                     flex: 1,
//                     html: 'Right 1'
//                 },{
//                     flex: 1,
//                     html: 'Right 2'
//                 },{
//                     flex: 1,
//                     html: 'Right 3'
//                 },{
//                     flex: 1,
//                     html: 'Right 4'
//                 },{
//                     flex: 1,
//                     html: 'Right 5'
//                 },{
//                     flex: 1,
//                     html: 'Right 6'
//                 },{
//                     flex: 1,
//                     html: 'Right 7'
//                 }]
//             }]
//         }]
//     });
// });
    Ext.create('Ext.Viewport', {
        layout: {
            type : 'vbox',
            pack : 'start',
            align: 'stretch'
        },
        items: [{
            flex: 1,
            layout: {
                type : 'hbox',
                pack : 'start',
                align: 'stretch'
            },
            items: [{
                flex: 1,
                html: 'Area 1'
            },{
                flex: 1,
                html: 'Area 2'
            },{
                flex: 1,
                html: 'Area 3'
            },{
                flex: 1,
                html: 'Area 4'
            },{
                flex: 1,
                html: 'Area 5'
            },{
                flex: 1,
                html: 'Area 6'
            },{
                flex: 1,
                html: 'Area 7'
            }]
        },{
            flex: 5,
            layout: {
                type : 'hbox',
                pack : 'start',
                align: 'stretch'
            },
            items: [{
                flex: 7,
                layout: {
                    type : 'vbox',
                    pack : 'start',
                    align: 'stretch'
                },
                items: [{
                    flex: 5,
                    layout: {
                        type : 'hbox',
                        pack : 'start',
                        align: 'stretch'
                    },
                    items: [{
                        flex: 1,
                        layout: {
                            type : 'vbox',
                            pack : 'start',
                            align: 'stretch'
                        },
                        items: [{
                            flex: 1,
                            html: 'Area 24'
                        },{
                            flex: 1,
                            html: 'Area 23'
                        },{
                            flex: 1,
                            html: 'Area 22'
                        },{
                            flex: 1,
                            html: 'Area 21'
                        },{
                            flex: 1,
                            html: 'Area 20'
                        }]
                    },{
                        flex: 7,
                        layout: {
                            type : 'vbox',
                            pack : 'start',
                            align: 'stretch'
                        },
                        items: [{
                            flex: 1,
                            layout: {
                                type : 'hbox',
                                pack : 'start',
                                align: 'stretch'
                            },
                            items: [{
                                flex: 1,
                                html: 'Area 25'
                            },{
                                flex: 1,
                                html: 'Area 26'
                            },{
                                flex: 1,
                                html: 'Area 27'
                            },{
                                flex: 1,
                                html: 'Area 28'
                            },{
                                flex: 1,
                                html: 'Area 29'
                            },{
                                flex: 1,
                                html: 'Area 30'
                            },{
                                flex: 1,
                                html: 'Area 31'
                            }]
                        },{
                            flex: 5,
                            layout: {
                                type : 'hbox',
                                pack : 'start',
                                align: 'stretch'
                            },
                            items: [{
                                flex: 7,
                                layout: {
                                    type : 'vbox',
                                    pack : 'start',
                                    align: 'stretch'
                                },
                                items: [{
                                    flex: 5,
                                    layout: {
                                        type : 'hbox',
                                        pack : 'start',
                                        align: 'stretch'
                                    },
                                    items: [{
                                        flex: 1,
                                        layout: {
                                            type : 'vbox',
                                            pack : 'start',
                                            align: 'stretch'
                                        },
                                        items: [{
                                            flex: 1,
                                            html: 'Area 48'
                                        },{
                                            flex: 1,
                                            html: 'Area 47'
                                        },{
                                            flex: 1,
                                            html: 'Area 46'
                                        },{
                                            flex: 1,
                                            html: 'Area 45'
                                        },{
                                            flex: 1,
                                            html: 'Area 44'
                                        }]
                                    },{
                                        flex: 7,
                                        layout: {
                                            type : 'vbox',
                                            pack : 'start',
                                            align: 'stretch'
                                        },
                                        items: [{
                                            flex: 1,
                                            layout: {
                                                type : 'hbox',
                                                pack : 'start',
                                                align: 'stretch'
                                            },
                                            items: [{
                                                flex: 1,
                                                html: 'Area 49'
                                            },{
                                                flex: 1,
                                                html: 'Area 50'
                                            },{
                                                flex: 1,
                                                html: 'Area 51'
                                            },{
                                                flex: 1,
                                                html: 'Area 52'
                                            },{
                                                flex: 1,
                                                html: 'Area 53'
                                            },{
                                                flex: 1,
                                                html: 'Area 54'
                                            },{
                                                flex: 1,
                                                html: 'Area 55'
                                            }]
                                        },{
                                            flex: 5,
                                            layout: {
                                                type : 'hbox',
                                                pack : 'start',
                                                align: 'stretch'
                                            },
                                            items: [{
                                                flex: 7,
                                                html: 'Center Area'
                                            },{
                                                flex: 1,
                                                layout: {
                                                    type : 'vbox',
                                                    pack : 'start',
                                                    align: 'stretch'
                                                },
                                                items: [{
                                                    flex: 1,
                                                    html: 'Area 56'
                                                },{
                                                    flex: 1,
                                                    html: 'Area 57'
                                                },{
                                                    flex: 1,
                                                    html: 'Area 58'
                                                },{
                                                    flex: 1,
                                                    html: 'Area 59'
                                                },{
                                                    flex: 1,
                                                    html: 'Area 60'
                                                }]
                                            }]
                                        }]
                                    }]
                                },{
                                    flex: 1,
                                    layout: {
                                        type : 'hbox',
                                        pack : 'start',
                                        align: 'stretch'
                                    },
                                    items: [{
                                        flex: 1,
                                        html: 'Area 43'
                                    },{
                                        flex: 1,
                                        html: 'Area 42'
                                    },{
                                        flex: 1,
                                        html: 'Area 41'
                                    },{
                                        flex: 1,
                                        html: 'Area 40'
                                    },{
                                        flex: 1,
                                        html: 'Area 39'
                                    },{
                                        flex: 1,
                                        html: 'Area 38'
                                    },{
                                        flex: 1,
                                        html: 'Area 37'
                                    }]
                                }]
                            },{
                                flex: 1,
                                layout: {
                                    type : 'vbox',
                                    pack : 'start',
                                    align: 'stretch'
                                },
                                items: [{
                                    flex: 1,
                                    html: 'Area 32'
                                },{
                                    flex: 1,
                                    html: 'Area 33'
                                },{
                                    flex: 1,
                                    html: 'Area 34'
                                },{
                                    flex: 1,
                                    html: 'Area 35'
                                },{
                                    flex: 1,
                                    html: 'Area 36'
                                }]
                            }]
                        }]
                    }]
                },{
                    flex: 1,
                    layout: {
                        type : 'hbox',
                        pack : 'start',
                        align: 'stretch'
                    },
                    items: [{
                        flex: 1,
                        html: 'Area 19'
                    },{
                        flex: 1,
                        html: 'Area 18'
                    },{
                        flex: 1,
                        html: 'Area 17'
                    },{
                        flex: 1,
                        html: 'Area 16'
                    },{
                        flex: 1,
                        html: 'Area 15'
                    },{
                        flex: 1,
                        html: 'Area 14'
                    },{
                        flex: 1,
                        html: 'Area 13'
                    }]
                }]
            },{
                flex: 1,
                layout: {
                    type : 'vbox',
                    pack : 'start',
                    align: 'stretch'
                },
                items: [{
                    flex: 1,
                    html: 'Area 8'
                },{
                    flex: 1,
                    html: 'Area 9'
                },{
                    flex: 1,
                    html: 'Area 10'
                },{
                    flex: 1,
                    html: 'Area 11'
                },{
                    flex: 1,
                    html: 'Area 12'
                }]
            }]
        }]
    });
});

