<?php
//******************************************************************************
// facilities.ejs.php
// Description: Patient File ScreenS
// v0.0.3
//
// Author: Ernesto J Rodriguez
// Modified: n/a
//
// MitosEHR (Electronic Health Records) 2011
//**********************************************************************************
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once($_SESSION['site']['root']."/library/I18n/I18n.inc.php");

//**********************************************************************************
// Reset session count 10 secs = 1 Flop
//**********************************************************************************
$_SESSION['site']['flops'] = 0;
?>
<link rel="stylesheet" type="text/css" href="library/extensible-1.0/examples/examples.css" />
<script type="text/javascript" src="library/extensible-1.0/examples/examples.js"></script>
<script type="text/javascript">
Ext.require([
    'Ext.data.proxy.Rest',
    'Extensible.calendar.data.MemoryCalendarStore',
    'Extensible.calendar.data.EventStore',
    'Extensible.calendar.CalendarPanel'
]);

Ext.onReady(function(){
    var calendarStore = Ext.create('Extensible.calendar.data.MemoryCalendarStore', {
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'interface/calendar_t/data/calendars.json',
            noCache: false,

            reader: {
                type: 'json',
                root: 'calendars'
            }
        }
    });

    var eventStore = Ext.create('Extensible.calendar.data.EventStore', {
        autoLoad: true,
        proxy: {
            type: 'rest',
            url: 'interface/calendar_t/php/app.php/events',
            noCache: false,

            reader: {
                type: 'json',
                root: 'data'
            },

            writer: {
                type: 'json',
                nameProperty: 'mapping'
            },

            listeners: {
                exception: function(proxy, response, operation, options){
                    var msg = response.message ? response.message : Ext.decode(response.responseText).message;
                    // ideally an app would provide a less intrusive message display
                    Ext.Msg.alert('Server Error', msg);
                }
            }
        },

        // It's easy to provide generic CRUD messaging without having to handle events on every individual view.
        // Note that while the store provides individual add, update and remove events, those fire BEFORE the
        // remote transaction returns from the server -- they only signify that records were added to the store,
        // NOT that your changes were actually persisted correctly in the back end. The 'write' event is the best
        // option for generically messaging after CRUD persistence has succeeded.
        listeners: {
            'write': function(store, operation){
                var title = Ext.value(operation.records[0].data[Extensible.calendar.data.EventMappings.Title.name], '(No title)');
                switch(operation.action){
                    case 'create':
                        Extensible.example.msg('Add', 'Added "' + title + '"');
                        break;
                    case 'update':
                        Extensible.example.msg('Update', 'Updated "' + title + '"');
                        break;
                    case 'destroy':
                        Extensible.example.msg('Delete', 'Deleted "' + title + '"');
                        break;
                }
            }
        }
    });

    var cp = Ext.create('Extensible.calendar.CalendarPanel', {
        id: 'calendar-remote',
        eventStore: eventStore,
        calendarStore: calendarStore,
        title: 'Remote Calendar',
        width: 900,
        height: 700
    });

    // You can optionally call load() here if you prefer instead of using the
    // autoLoad config.  Note that as long as you call load AFTER the store
    // has been passed into the CalendarPanel the default start and end date parameters
    // will be set for you automatically (same thing with autoLoad:true).  However, if
    // you call load manually BEFORE the store has been passed into the CalendarPanel
    // it will call the remote read method without any date parameters, which is most
    // likely not what you'll want.
    // store.load({ ... });

    // var errorCheckbox = Ext.get('forceError');

    // var setRemoteErrorMode = function(){
    //    if(errorCheckbox.dom.checked){
    //        // force an error response to test handling of CUD (not R) actions. this param is
    //        // only implemented in the back end code for this sample -- it's not default behavior.
    //        eventStore.getProxy().extraParams['fail'] = true;
    //        cp.setTitle('Remote Calendar <span id="errTitle">(Currently in remote error mode)</span>');
    //    }
    //    else{
    //        delete eventStore.getProxy().extraParams['fail'];
    //        cp.setTitle('Remote Calendar');
    //    }
    // };

    // setRemoteErrorMode();
    // errorCheckbox.on('click', setRemoteErrorMode);
    //***********************************************************************************
	// Top Render Panel
	// This Panel needs only 3 arguments...
	// PageTitle 	- Title of the current page
	// PageLayout 	- default 'fit', define this argument if using other than the default value
	// PageBody 	- List of items to display [form1, grid1, grid2]
	//***********************************************************************************
    Ext.create('Ext.mitos.TopRenderPanel', {
        pageTitle: '<?php i18n('Calendar Test'); ?>',
        pageBody: [cp]
    });
}); // End ExtJS
</script>