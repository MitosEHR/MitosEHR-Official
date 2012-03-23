<?php

//--------------------------------------------------------------------------------------------------------------------------
// immunization.ejs.php 
// v0.0.2
// Under GPLv3 License
//
// Integration Sencha ExtJS Framework
// OpenEMR is a free medical practice management, electronic medical records, prescription writing, 
// and medical billing application. These programs are also referred to as electronic health records. 
// OpenEMR is licensed under the General Gnu Public License (General GPL). It is a free open source replacement 
// for medical applications such as Medical Manager, Health Pro, and Misys. It features support for EDI billing 
// to clearing houses such as Availity, MD-Online, MedAvant and ZirMED using ANSI X12.
//--------------------------------------------------------------------------------------------------------------------------

session_name("MitosEHR");
session_start();
session_cache_limiter('private');

include_once($_SESSION['site']['root'] . "/classes/dbHelper.php");
include_once($_SESSION['site']['root'] . "/classes/I18n.class.php");
require_once($_SESSION['site']['root'] . "/classes/dataExchange.class.php");

//**********************************************************************************
// Reset session count 10 secs = 1 Flop
//**********************************************************************************
$_SESSION['site']['flops'] = 0;

if (isset($_POST['action'])) {

    // *************************************************************************************
    // Add new record
    // *************************************************************************************
    if ($_POST['action'] == "add") {
        $sql = "REPLACE INTO 
					allergies
				SET 
					id = ?,
					patient_id   = ?,
					type = ?,
					title = ?,
					diagnosis_code = ?,
					begin_date = if(?,?,NULL),
					end_date = if(?,?,NULL),
					ocurrence   = ?,
					reaction = ?,
					referred_by = ?,
					outcome = ?,
					destination = ? ";
        $sqlBindArray = array(
            trim($_POST['id']),
            trim($_POST['patient_id']),
            trim($_POST['administered_date']),
            trim($_POST['type']),
            trim($_POST['title']),
            trim($_POST['diagnosis_code']),
            trim($_POST['begin_date']),
            trim($_POST['end_date']),
            trim($_POST['ocurrence']),
            trim($_POST['reaction']),
            trim($_POST['referred_by']),
            trim($_POST['outcome']),
            trim($_POST['destination']),
            $pid,//
            $_SESSION['authId'],//
            $_SESSION['authId']//
        );
        sqlStatement($sql, $sqlBindArray);
        $begin_date = $end_date = date('Y-m-d');
        $type = $diagnosis_code = $ocurrence = $reaction = $referred_by = $outcome = "";
        $destination = "";
    }
    // *************************************************************************************
    // Delete a record
    // *************************************************************************************
    elseif ($_POST['action'] == "delete") { // Need to be fixed, the GRID it's not calling the form for deletion.
        // log the event
        newEvent("delete", $_SESSION['authUser'], $_SESSION['authProvider'], "type " . $_POST['id'] . " deleted from pid " . $_POST['pid']);
        // delete the immunization
        $sql = "DELETE FROM allergies WHERE id =" . mysql_real_escape_string($_POST['id']) . " LIMIT 1";
        sqlStatement($sql);
    }
    // *************************************************************************************
    // Save the record
    // *************************************************************************************
    elseif ($_POST['action'] == "save") {
        $sql = "UPDATE 
					allergies
				SET 
					id = ?,
					patient_id   = ?,
					type = ?,
					title = ?,
					diagnosis_code = ?,
					begin_date = if(?,?,NULL),
					end_date = if(?,?,NULL),
					ocurrence   = ?,
					reaction = ?,
					referred_by = ?,
					outcome = ?,
					destination = ?
				WHERE 
					id = ?";
        $sqlBindArray = array(
            trim($_POST['id']),
            trim($_POST['patient_id']),
            trim($_POST['administered_date']),
            trim($_POST['type']),
            trim($_POST['title']),
            trim($_POST['diagnosis_code']),
            trim($_POST['begin_date']),
            trim($_POST['end_date']),
            trim($_POST['ocurrence']),
            trim($_POST['reaction']),
            trim($_POST['referred_by']),
            trim($_POST['outcome']),
            trim($_POST['destination']),
            $pid,
            $_SESSION['authId'],
            $_SESSION['authId'],
            trim($_POST['id'])
        );
        sqlStatement($sql, $sqlBindArray);
        $begin_date = $end_date = date('Y-m-d');
        $type = $diagnosis_code = $ocurrence = $reaction = $referred_by = $outcome = "";
        $destination = "";
    }
}

// *************************************************************************************
// Sensha Ext JS Start
// New Gui Framework
// *************************************************************************************
?>

<script type="text/javascript">
// *************************************************************************************
// Sencha trying to be like a language
// using requiered to load diferent components
// *************************************************************************************
Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux', '<?php echo $_SESSION['dir']['ux']; ?>');
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.toolbar.Paging',
    'Ext.TaskManager.*',
    'Ext.ux.SlidingPager'
]);

// *************************************************************************************
// Define Global Variables
// *************************************************************************************
var rowContent;

Ext.onReady(function() {

    Ext.QuickTips.init();

// *************************************************************************************
// Structure of the Immunization List record
// creates a subclass of Ext.data.Record
//
// This should be the structure of the database table
// You can have the name of the field on the database table and then
// do a mapping to another name.
//
// This is useful if the structure of the database is changed, the only thing you
// need to do is change the "name:" of the Record, and the mapping keep it the
// same, this way the software does not break.
//
// *************************************************************************************
    var ImmunizationTable = Ext.data.Record.create([
        // on the database table
        {name: 'id', type: 'int', mapping: 'id'},
        {name: 'patient_id', type: 'int', mapping: 'patient_id'},
        {name: 'type', type: 'string', mapping: 'type'},
        {name: 'title', type: 'string', mapping: 'title'},
        {name: 'diagnosis_code', type: 'string', mapping: 'diagnosis_code'},
        {name: 'begin_date', type: 'date', mapping: 'begin_date'},
        {name: 'end_date', type: 'date', mapping: 'end_date'},
        {name: 'ocurrence', type: 'string', mapping: 'ocurrence'},
        {name: 'reaction', type: 'string', mapping: 'reaction'},
        {name: 'referred_by', type: 'string', mapping: 'referred_by'},
        {name: 'outcome', type: 'string', mapping: 'outcome'},
        {name: 'destination', type: 'string', mapping: 'destination'}

    ]);

// *************************************************************************************
// Structure and load the data for Immunization List
// AJAX -> immunization_data_logic.ejs.php
// *************************************************************************************
    var storeAllergiesList = new Ext.data.Store({
        autoSave: false,

        // HttpProxy will only allow requests on the same domain.
        proxy   : new Ext.data.HttpProxy({
            method: 'POST',
            api   : {
                read   : 'allergies_data_logic.ejs.php?task=load',
                create : 'allergies_data_logic.ejs.php?task=create',
                update : 'allergies_data_logic.ejs.php?task=update',
                destroy: 'allergies_data_logic.ejs.php?task=delete'
            }
        }),

        // JSON Writer options
        writer  : new Ext.data.JsonWriter({
            returnJson    : true,
            writeAllFields: true,
            listful       : true,
            writeAllFields: true
        }, AllergiesTable),

        // JSON Reader options
        reader  : new Ext.data.JsonReader({
            idProperty   : 'noteid',
            totalProperty: 'results',
            root         : 'row'
        }, AllergiesTable)

    });
    storeAllergiesList.load();

// *************************************************************************************
// Structure and load the data for cmb_immunization_id
// *************************************************************************************
    var allergiesData = new Ext.data.Store({
        proxy : new Ext.data.ScriptTagProxy({
            url: 'allergies_data_logic.ejs.php?task=allergies'
        }),
        reader: new Ext.data.JsonReader({
            idProperty   : 'option_id',
            totalProperty: 'results',
            root         : 'row'
        }, [
            {name: 'option_id', type: 'string', mapping: 'option_id'},
            {name: 'title', type: 'string', mapping: 'title'}
        ])
    });
    allergiesData.load();

// *************************************************************************************
// Structure and load the data for cmb_administered_by_id
// *************************************************************************************
    var admData = new Ext.data.Store({
        proxy : new Ext.data.ScriptTagProxy({
            url: 'allergies_data_logic.ejs.php?task=admData'
        }),
        reader: new Ext.data.JsonReader({
            idProperty   : 'id',
            totalProperty: 'results',
            root         : 'row'
        }, [
            {name: 'id', type: 'string', mapping: 'option_id'},
            {name: 'full_name', type: 'string', mapping: 'full_name'}
        ])
    });
    admData.load();

// *************************************************************************************
// Immunization Window Dialog
// *************************************************************************************
    var winAllergies= new Ext.Window({
        width      : 540,
        autoHeight : true,
        modal      : true,
        resizable  : false,
        autoScroll : true,
        title      : '<?php echo htmlspecialchars(xl('Allergies'), ENT_NOQUOTES); ?>',
        closeAction: 'hide',
        renderTo   : document.body,
        items      : [
            {
                xtype         : 'form',
                labelWidth    : 300,
                id            : 'frmallergies',
                frame         : true,
                url           : 'allergies.ejs.php',
                bodyStyle     : 'padding: 5px',
                defaults      : {width: 150},
                formBind      : true,
                buttonAlign   : 'left',
                standardSubmit: true,
                items         : [
                    { xtype: 'combo', id: 'type', name: 'type', fieldLabel: '<?php echo htmlspecialchars(xl('Immunization'), ENT_NOQUOTES); ?>', editable: false, triggerAction: 'all', mode: 'local', valueField: 'option_id', hiddenName: 'immunization_id', displayField: 'title', store: allergiesData },
                    { xtype: 'textfield', id: 'title', name: 'title', fieldLabel: '<?php echo htmlspecialchars(xl('Title'), ENT_NOQUOTES); ?>' },
                    { xtype: 'textfield', name: 'diagnosis_code', fieldLabel: '<?php echo htmlspecialchars(xl('Diagnosis Code'), ENT_NOQUOTES); ?>' },
                    { xtype: 'textfield', name: 'ocurrence', fieldLabel: '<?php echo htmlspecialchars(xl('Ocurrence'), ENT_NOQUOTES); ?>' },
                    { xtype: 'textfield', name: 'reaction', fieldLabel: '<?php echo htmlspecialchars(xl('Reaction'), ENT_NOQUOTES); ?>' },
                    { xtype: 'textfield', name: 'referred_by', fieldLabel: '<?php echo htmlspecialchars(xl('Referred by'), ENT_NOQUOTES); ?>' },
                    { xtype: 'textfield', name: 'outcome', fieldLabel: '<?php echo htmlspecialchars(xl('Outcome'), ENT_NOQUOTES); ?>' },
                    { xtype: 'textfield', name: 'destination', fieldLabel: '<?php echo htmlspecialchars(xl('Destination'), ENT_NOQUOTES); ?>' },
                    { xtype: 'datefield', id: 'begin_date', format: 'Y-m-d', name: 'begin_date', fieldLabel: '<?php echo htmlspecialchars(xl('Begin Date'), ENT_NOQUOTES); ?>' },
                    { xtype: 'datefield', id: 'end_date', format: 'Y-m-d', name: 'end_date', fieldLabel: '<?php echo htmlspecialchars(xl('End Date'), ENT_NOQUOTES); ?>' },
                    // <-- This field will be dynamically updated from the events on the grid.
                    { xtype: 'textfield', id: 'id', hidden: true, name: 'id' },
                    { xtype: 'textfield', id: 'pid', hidden: true, name: 'pid', value: '<?php echo htmlspecialchars($pid, ENT_QUOTES); ?>' }
                ]
            }
        ],
        // Window Bottom Bar
        bbar       : [
            {
                text    : '<?php echo htmlspecialchars(xl('Save'), ENT_NOQUOTES); ?>',
                iconCls : 'save',
                formBind: true,
                handler : function() {
                    Ext.getCmp('frmAllergies').getForm().submit();
                }
            },
            {
                text    : '<?php echo htmlspecialchars(xl('Close'), ENT_NOQUOTES); ?>',
                iconCls : 'delete',
                formBind: true,
                handler : function() {
                    winAllergies.hide();
                }
            }
        ]
    }); // END WINDOW

// *************************************************************************************
// Create the Viewport
// *************************************************************************************
    var viewport = new Ext.Viewport({
        layout  : 'fit',
        renderTo: document.body,
        items   : [
            // *************************************************************************************
            // Render the GridPanel
            // *************************************************************************************
            {
                title     : '<?php xl("Patient Allergies List", 'e'); ?>',
                xtype     : 'grid',
                store     : storeAllergiesList,
                stripeRows: true,
                frame     : false,
                viewConfig: {forceFit: true}, // this is the option which will force the grid to the width of the containing panel
                sm        : new Ext.grid.RowSelectionModel({singleSelect: true}),
                // Event handler for the data grid
                listeners : {
                    rowclick   : function(grid, rowIndex, e) {// Single click to select the record, and copy the variables
                        rowContent = grid.getStore().getAt(rowIndex);
                        grid.editAllergies.enable();
                        grid.deleteAllergies.enable();
                        // --------------------------------------------------------------------------
                        // Copy the values of the GRID and push it into the immunization form
                        // --------------------------------------------------------------------------
                        Ext.getCmp('action').setValue('save');
                        Ext.getCmp('id').setValue(rowContent.get('id'));
                        Ext.getCmp('type').setValue(rowContent.get('type'));
                        Ext.getCmp('title').setValue(rowContent.get('title'));
                        Ext.getCmp('diagnosis_code').setValue(rowContent.get('diagnosis_code'));
                        Ext.getCmp('begin_date').setValue(rowContent.get('begin_date'));
                        Ext.getCmp('end_date').setValue(rowContent.get('end_date'));
                        Ext.getCmp('ocurrence').setValue(rowContent.get('ocurrence'));
                        Ext.getCmp('reaction').setValue(rowContent.get('reaction'));
                        Ext.getCmp('referred_by').setValue(rowContent.get('referred_by'));
                        Ext.getCmp('outcome').setValue(rowContent.get('outcome'));
                        Ext.getCmp('destination').setValue(rowContent.get('destination'));
                    },
                    rowdblclick: function(grid, rowIndex, e) { // Double click to select the record, copy vars, and edit record
                        rowContent = grid.getStore().getAt(rowIndex);
                        grid.editAllergies.enable();
                        grid.deleteAllergies.enable();
                        // --------------------------------------------------------------------------
                        // Copy the values of the GRID and push it into the immunization form
                        // --------------------------------------------------------------------------
                        Ext.getCmp('action').setValue('save');
                        Ext.getCmp('id').setValue(rowContent.get('id'));
                        Ext.getCmp('type').setValue(rowContent.get('type'));
                        Ext.getCmp('title').setValue(rowContent.get('title'));
                        Ext.getCmp('diagnosis_code').setValue(rowContent.get('diagnosis_code'));
                        Ext.getCmp('begin_date').setValue(rowContent.get('begin_date'));
                        Ext.getCmp('end_date').setValue(rowContent.get('end_date'));
                        Ext.getCmp('ocurrence').setValue(rowContent.get('ocurrence'));
                        Ext.getCmp('reaction').setValue(rowContent.get('reaction'));
                        Ext.getCmp('referred_by').setValue(rowContent.get('referred_by'));
                        Ext.getCmp('outcome').setValue(rowContent.get('outcome'));
                        Ext.getCmp('destination').setValue(rowContent.get('destination'));
                        mode = 'edit';
                        winAllergies.show();
                    }
                },
                columns   : [
                    { header: 'id', sortable: false, dataIndex: 'id', hidden: true},
                    { header: 'patient_id', sortable: false, dataIndex: 'patient_id', hidden: true},
                    { header: 'begin_date', sortable: false, dataIndex: 'begin_date', hidden: true},
                    { header: 'end_date', sortable: false, dataIndex: 'end_date', hidden: true},
                    { header: '<?php echo htmlspecialchars(xl('Ocurrence'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'ocurrence' },
                    { header: '<?php echo htmlspecialchars(xl('Reaction'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'reaction' },
                    { header: '<?php echo htmlspecialchars(xl('Referred By'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'referred_by' },
                    { header: '<?php echo htmlspecialchars(xl('Outcome'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'outcome' },
                    { header: '<?php echo htmlspecialchars(xl('Destination'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'destination' }
                ],
                // *************************************************************************************
                // Grid Menu
                // *************************************************************************************
                tbar      : [
                    {
                        xtype  : 'button',
                        id     : 'addnew',
                        text   : '<?php xl("Add new immunization", 'e'); ?>',
                        iconCls: 'icoInjection',
                        handler: function() {
                            // --------------------------------------------------------------------------
                            // Clear the form, for a new record
                            // --------------------------------------------------------------------------
                            Ext.getCmp('action').setValue('add');
                            Ext.getCmp('id').setValue(rowContent.get('id'));
                            Ext.getCmp('type').setValue(rowContent.get('type'));
                            Ext.getCmp('title').setValue(rowContent.get('title'));
                            Ext.getCmp('diagnosis_code').setValue(rowContent.get('diagnosis_code'));
                            Ext.getCmp('begin_date').setValue(rowContent.get('begin_date'));
                            Ext.getCmp('end_date').setValue(rowContent.get('end_date'));
                            Ext.getCmp('ocurrence').setValue(rowContent.get('ocurrence'));
                            Ext.getCmp('reaction').setValue(rowContent.get('reaction'));
                            Ext.getCmp('referred_by').setValue(rowContent.get('referred_by'));
                            Ext.getCmp('outcome').setValue(rowContent.get('outcome'));
                            Ext.getCmp('destination').setValue(rowContent.get('destination'));
                            winAllergies.show();
                        }
                    },
                    '-',
                    {
                        xtype   : 'button',
                        ref     : '../editAllergies',
                        text    : '<?php xl("Edit Allergies", 'e'); ?>',
                        iconCls : 'edit',
                        disabled: true,
                        handler : function() {
                            mode = 'edit';
                            winAllergies.show();
                        }
                    },
                    '-',
                    {
                        // *************************************************************************************
                        // Confirmation NOTICE!
                        // Delete Record
                        // *************************************************************************************
                        xtype   : 'button',
                        ref     : '../deleteAllergies',
                        text    : '<?php xl("Delete Allergies", 'e'); ?>',
                        iconCls : 'delete',
                        disabled: true,
                        handler : function() {
                            Ext.Msg.show({
                                title  : '<?php xl("Please confirm...", 'e'); ?>',
                                icon   : Ext.MessageBox.QUESTION,
                                msg    : '<?php xl("Are you sure to delete this record?<br>With the vaccine: ", 'e'); ?>' + rowContent.get('vaccine'),
                                buttons: Ext.Msg.YESNO,
                                fn     : function(btn) {
                                    if(btn == 'yes') {
                                        // --------------------------------------------------------------------------
                                        // This creates a dynamic form on the fly
                                        // via JavaScript
                                        // --------------------------------------------------------------------------
                                        var myForm = document.createElement("form");
                                        myForm.method = "post";
                                        var myInput = document.createElement("input");
                                        myInput.setAttribute("name", 'id');
                                        myInput.setAttribute("value", rowContent.get('id'));
                                        myForm.appendChild(myInput);
                                        var myInput = document.createElement("input");
                                        myInput.setAttribute("name", 'action');
                                        myInput.setAttribute("value", 'delete');
                                        myForm.appendChild(myInput);
                                        document.body.appendChild(myForm);
                                        myForm.submit();
                                        document.body.removeChild(myForm);
                                    }
                                }
                            });
                        }
                    }
                ], // END TOPBAR
                plugins   : [new Ext.ux.grid.Search({
                    mode          : 'local',
                    iconCls       : false,
                    deferredRender: false,
                    dateFormat    : 'm/d/Y',
                    minLength     : 4,
                    align         : 'left',
                    width         : 250,
                    disableIndexes: ['id'],
                    position      : 'top'
                })]
            }
        ]
    }); // END VIEWPORT

}); // END EXTJS
</script>

