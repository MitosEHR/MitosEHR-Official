<?php
//--------------------------------------------------------------------------------------------------------------------------
// calendar.ejs.php
// v0.0.3
// Under GPLv3 License
// Integration Sencha ExtJS Framework
//
// The credit for the Calendar component goes to:
// Ext Calendar Pro was created by Brian Moeskau, one of the original cofounders of Ext JS.
// Brian left the company in late 2008 but has stayed very involved in following and promoting
// the ongoing success of the Ext JS framework.
//
// Brian took some time out to start a family in 2009, but has decided to jump back into the
// Ext JS arena in a big way with the development of Ext Calendar Pro, the flagship product in
// the Extensible family of Ext JS components.
//
// URL: http://ext-calendar.com/
//--------------------------------------------------------------------------------------------------------------------------
// *************************************************************************************
//SANITIZE ALL ESCAPES
// *************************************************************************************
$sanitize_all_escapes = true;

// *************************************************************************************
//STOP FAKE REGISTER GLOBALS
// *************************************************************************************
$fake_register_globals = false;

// *************************************************************************************
// Load the OpenEMR Libraries
// *************************************************************************************
include_once("../registry.php");
include_once("$srcdir/sql.inc.php");
include_once("$srcdir/options.inc.php");
include_once("$srcdir/patient.inc.php");

// *************************************************************************************
// Pull the patients from the database
// *************************************************************************************
$sql = "SELECT
            *
        FROM
            patient_data
        ORDER BY
            lname ASC, fname ASC";
        $result = sqlStatement($sql);

        while ($row = sqlFetchArray($result)) {
            $patData .= "['" . htmlspecialchars($row['id'], ENT_QUOTES) . "', '" .
            htmlspecialchars($row['fname'], ENT_QUOTES) . ", " . htmlspecialchars($row['lname'], ENT_QUOTES) . "', '" .
            htmlspecialchars("Contact: " . $row['phone_contact'] . " | Home: " . $row['phone_home'] . " | Cell: " . $row['phone_cell'] . " | Work: " . $row['phone_biz'], ENT_QUOTES) . "', '" .
            htmlspecialchars($row['ss'], ENT_QUOTES) . "', '" .
            htmlspecialchars($row['DOB'], ENT_QUOTES) . "', '" .
            htmlspecialchars($row['pid'], ENT_QUOTES) . "']," . chr(13);
        }
        $patData = substr($patData, 0, -2); // Delete the last comma and clear the buff.
?>

<script type="text/javascript">

Ext.onReady(function(){

	Ext.QuickTips.init();
	Ext.BLANK_IMAGE_URL = '../../library/<?php echo $GLOBALS['ext_path']; ?>/resources/images/default/s.gif';
	
	var today = new Date().clearTime();
/*!
 * Extensible 1.0-rc1
 * Copyright(c) 2010-2011 Extensible, LLC
 * licensing@ext.ensible.com
 * http://ext.ensible.com
 */
Ext.ensible.sample.EventData = {
    "evts":[{
        "id":1001,
        "cid":1,
        "title":"Vacation",
        "start":today.add(Date.DAY, -20).add(Date.HOUR, 10),
        "end":today.add(Date.DAY, -10).add(Date.HOUR, 15),
    "notes":"Have fun"
    },{
        "id":1002,
        "cid":2,
        "title":"Lunch with Matt",
        "start":today.add(Date.HOUR, 11).add(Date.MINUTE, 30),
        "end":today.add(Date.HOUR, 13),
        "loc":"Chuy's!",
        "url":"http://chuys.com",
    "notes":"Order the queso",
        "rem":"15"
    },{
        "id":1003,
        "cid":3,
        "title":"Project due",
        "start":today.add(Date.HOUR, 15),
        "end":today.add(Date.HOUR, 15)
    },{
        "id":1004,
        "cid":1,
        "title":"Sarah's birthday",
        "start":today,
        "end":today,
        "notes":"Need to get a gift",
        "ad":true
    },{
        "id":1005,
        "cid":2,
        "title":"A long one...",
        "start":today.add(Date.DAY, -12),
        "end":today.add(Date.DAY, 10).add(Date.SECOND, -1),
        "ad":true
    },{
        "id":1006,
        "cid":3,
        "title":"School holiday",
        "start":today.add(Date.DAY, 5),
        "end":today.add(Date.DAY, 7).add(Date.SECOND, -1),
        "ad":true,
        "rem":"2880"
    },{
        "id":1007,
        "cid":1,
        "title":"Haircut",
        "start":today.add(Date.HOUR, 9),
        "end":today.add(Date.HOUR, 9).add(Date.MINUTE, 30),
    "notes":"Get cash on the way"
    },{
        "id":1008,
        "cid":3,
        "title":"An old event",
        "start":today.add(Date.DAY, -30),
        "end":today.add(Date.DAY, -28),
        "ad":true
    },{
        "id":1009,
        "cid":2,
        "title":"Board meeting",
        "start":today.add(Date.DAY, -2).add(Date.HOUR, 13),
        "end":today.add(Date.DAY, -2).add(Date.HOUR, 18),
        "loc":"ABC Inc.",
        "rem":"60"
    },{
        "id":1010,
        "cid":3,
        "title":"Jenny's final exams",
        "start":today.add(Date.DAY, -2),
        "end":today.add(Date.DAY, 3).add(Date.SECOND, -1),
        "ad":true
    },{
        "id":1011,
        "cid":1,
        "title":"Movie night",
        "start":today.add(Date.DAY, 2).add(Date.HOUR, 19),
        "end":today.add(Date.DAY, 2).add(Date.HOUR, 23),
        "notes":"Don't forget the tickets!",
        "rem":"60"
    },{
        "id":1012,
        "cid":4,
        "title":"Gina's basketball tournament",
        "start":today.add(Date.DAY, 8).add(Date.HOUR, 8),
        "end":today.add(Date.DAY, 10).add(Date.HOUR, 17)
    },{
        "id":1013,
        "cid":4,
        "title":"Toby's soccer game",
        "start":today.add(Date.DAY, 5).add(Date.HOUR, 10),
        "end":today.add(Date.DAY, 5).add(Date.HOUR, 12)
    }]
};


Ext.ensible.sample.MemoryEventStore = Ext.extend(Ext.data.Store, {
    constructor: function(config){
        config = Ext.applyIf(config || {}, {
            storeId: 'eventStore',
            root: 'evts',
            proxy: new Ext.data.MemoryProxy(),
            writer: new Ext.data.DataWriter(),
            fields: Ext.ensible.cal.EventRecord.prototype.fields.getRange(),
            idProperty: Ext.ensible.cal.EventMappings.EventId.mapping || 'id'
        });
        this.reader = new Ext.data.JsonReader(config);
        
        Ext.ensible.sample.MemoryEventStore.superclass.constructor.call(this, config);
        
        this.on('add', this.onAdd, this);
    },
    
    // In real implementations the store is responsible for committing records
    // after a remote transaction has returned success = true. Since we never do
    // a real transaction, we never get any of the normal store callbacks telling
    // us that an edit occurred. This simple hack works around that for the purposes
    // of the local samples, but should NEVER actually be done in real code.
    afterEdit : function(rec){
        rec.commit();
    },
    
    onAdd: function(store, rec){
        // Since MemoeryProxy has no "create" implementation, added events
        // get stuck as phantoms without an EventId. The calendar does not support
        // batching transactions and expects records to be non-phantoms, so for
        // the purpose of local samples we can hack that into place. In real remote
        // scenarios this is handled automatically by the store, and so you should
        // NEVER actually do something like this.
        var r = rec[0];
        r.data[Ext.ensible.cal.EventMappings.EventId.name] = r.id;
        r.phantom = false;
        r.commit();
    }
});

  this.eventStore = new Ext.ensible.sample.MemoryEventStore({
    // defined in data-events.js
    data: Ext.ensible.sample.EventData
  });
	
	//*********************************************************************************************************
	// sidePanel
	// This panel will hold the DatePicker and the providers
	//*********************************************************************************************************
  var sidePanel = new Ext.Panel({
    id:'sidePanel',
    region: 'west',
    width: 176,
    border: false,
    items: [{
      xtype: 'datepicker',
      id: 'app-nav-picker',
      style: 'border: none;'
    }]
  });
  
  //*********************************************************************************************************
  // The Big Calendar
  // This is the calendar that the user will interact.
  //*********************************************************************************************************
  var bigCalendar = new Ext.ensible.cal.CalendarPanel({
    eventStore: eventStore,
    title: 'Basic Calendar',
    //autoWidth: true,
    //autoHeight: true,
    border: false,
    region: 'center',
    monthViewCfg: {
      showHeader: true,
      showWeekLinks: true,
      showWeekNumbers: true
    },
    //readOnly: true,
    showDayView: true,
    showMultiDayView: true,
    showWeekView: true,
    showMultiWeekView: true,
    showMonthView: true,
    showNavBar: true,
    //showTodayText: false,
    showTime: true,
    //editModal: true,
    enableEditDetails: false
  });

	//*********************************************************************************************************
	// The main Panel
  // The name of the object and the ID "RenderPanel" is mandatory
  // MitosEHR look for this panel and modify the height.
	//*********************************************************************************************************
	var RenderPanel = new Ext.Panel({
		border	: false,
		id		: 'RenderPanel',
		renderTo: Ext.getCmp('TopPanel').body,
		layout	: 'border',
		autoWidth: true,
		stateful: true,
		viewConfig:{forceFit:true},
		items	: [sidePanel, bigCalendar]
	});
	
	//*********************************************************************************************************
	// Grab the full attention of the user
	// Use this function below to maximize the Top Panel
	// Only when it's needed.
	//*********************************************************************************************************
	Ext.getCmp('BottomPanel').collapse( true );

	//*********************************************************************************************************
	// Make sure that the RenderPanel height has the same height of the TopPanel
	// at first run.
	// This is mandatory.
	//*********************************************************************************************************
	Ext.getCmp('RenderPanel').setHeight( Ext.getCmp('TopPanel').getHeight() );

}); // END EXTJS

</script>
