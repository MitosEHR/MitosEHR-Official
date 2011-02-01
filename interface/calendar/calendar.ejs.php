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
include_once("$srcdir/sql.inc");
include_once("$srcdir/options.inc.php");
include_once("$srcdir/patient.inc");

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
	
	// *************************************************************************************
	// Structure and load the data for events grid
	// AJAX -> load_events.ejs.php
	// *************************************************************************************
	var storeCalEvent = new Ext.data.Store({
		proxy: new Ext.data.ScriptTagProxy({
		url: '../calendar/load_events.ejs.php?task=load_events&group=%'
	}),
	reader: new Ext.data.JsonReader({
		id: 'pc_eid',
		totalProperty: 'results',
		root: 'row'
	},[
		// Calendar Pro default fields mappings
		{name: 'EventId', mapping:'event_id', type:'int'},
		{name:'CalendarId', mapping: 'category_id', type: 'int'},
		{name:'Title', mapping: 'title', type: 'string'},
		{name:'StartDate', mapping: 'startdate', type: 'date', dateFormat: 'c'},
		{name:'EndDate', mapping: 'enddate', type: 'date', dateFormat: 'c'},
		{name:'Location', mapping: 'location', type: 'string'},
		{name:'Notes', mapping: 'notes', type: 'string'},
		{name:'Url', mapping: 'url', type: 'string'},
		{name:'IsAllDay', mapping: 'isallday', type: 'boolean'},
		{name:'Reminder', mapping: 'reminder', type: 'string'},
		{name:'IsNew', mapping: 'isnew', type: 'boolean'},

		// OpentEMR requiered fields mappings
		{name:'category_id', mapping: 'category_id', type: 'int'},
		{name:'provider_id', mapping: 'provider_id', type: 'int'},
		{name:'status_id', mapping: 'status_id', type: 'int'},
		{name:'comments', mapping: 'comments', type: 'string'},
		{name:'patient_id', mapping: 'patient_id', type: 'int'},
		{name:'recurrence', mapping: 'recurrence', type: 'string'},
		{name:'htmlPatInfo', mapping: 'htmlpatinfo', type: 'string'}
	])
	});
	storeCalEvent.load();

	// *************************************************************************************
	// Structure and load the data for cmb_Providers
	// AJAX -> load_form.ejs.php
	// *************************************************************************************
	var provData = new Ext.data.Store({
		proxy: new Ext.data.ScriptTagProxy({
			url: '../calendar/load_form.ejs.php?task=cmbProv'
		}),
		reader: new Ext.data.JsonReader({
			id: 'username',
			totalProperty: 'results',
			root: 'row'
		},[
			{name: 'username', type: 'string', mapping: 'username'},
			{name: 'name', type: 'string', mapping: 'name'}
		])
	});
	provData.load();


	// *************************************************************************************
	// Structure and load the data for cmb_Providers on Edit Window
	// AJAX -> load_form.ejs.php
	// *************************************************************************************
	var provData_Edit = new Ext.data.Store({
		proxy: new Ext.data.ScriptTagProxy({
			url: '../calendar/load_form.ejs.php?task=cmbProvEdit'
		}),
		reader: new Ext.data.JsonReader({
			id: 'username',
			totalProperty: 'results',
			root: 'row'
		},[
			{name: 'username', type: 'string', mapping: 'username'},
			{name: 'name', type: 'string', mapping: 'name'}
		])
	});
	provData_Edit.load();

	// *************************************************************************************
	// Structure and load the data for cmb_Status
	// AJAX -> load_form.ejs.php
	// *************************************************************************************
	var statusData = new Ext.data.Store({
		proxy: new Ext.data.ScriptTagProxy({
			url: '../calendar/load_form.ejs.php?task=cmbStatus'
		}),
		reader: new Ext.data.JsonReader({
			id: 'option_id',
			totalProperty: 'results',
			root: 'row'
		},[
			{name: 'option_id', type: 'string', mapping: 'option_id'},
			{name: 'title', type: 'string', mapping: 'title'}
		])
	});
	statusData.load();

	// *************************************************************************************
	// Structure and load the data for cmb_Category
	// AJAX -> load_form.ejs.php
	// *************************************************************************************
	var catData = new Ext.data.Store({
		proxy: new Ext.data.ScriptTagProxy({
			url: '../calendar/load_form.ejs.php?task=cmbCat'
		}),
		reader: new Ext.data.JsonReader({
			id: 'id',
			totalProperty: 'results',
			root: 'row'
		},[
			{name: 'id', type: 'number', mapping: 'id'},
			{name: 'name', type: 'string', mapping: 'name'}
		])
	});
	catData.load();

	// *************************************************************************************
	// Patient Grid data structure
	// *************************************************************************************
	var patData = [ <?php echo $patData; ?> ];
	var storePat = new Ext.data.ArrayStore({
		fields: [
			{name: 'id'},
			{name: 'name'},
			{name: 'phone'},
			{name: 'ss'},
			{name: 'dob'},
			{name: 'pid'}
		]
	});
	storePat.loadData(patData);

	// *************************************************************************************
	// Get the current time for the calendar
	// *************************************************************************************
	var C = Ext.ensible.cal, today = new Date().clearTime();

	// *************************************************************************************
	// Calendar Event Structure
	// *************************************************************************************
	var M = Ext.ensible.cal.EventMappings;
	Ext.ensible.cal.EventRecord = Ext.data.Record.create([

		// Calendar Pro default fields
		M.EventId,
		M.CalendarId,
		M.Title,
		M.StartDate,
		M.EndDate,
		M.Location,
		M.Notes,
		M.Url,
		M.IsAllDay,
		M.Reminder,
		M.IsNew,

		// OpentEMR requiered fields
		M.provider_id,
		M.status_id,
		M.comments,
		M.patient_id,
		M.recurrence,
		M.htmlPatInfo

	]);

	// *************************************************************************************
	// Calendar Record Definition
	// *************************************************************************************
	Ext.ensible.cal.EventMappings = {
		// Calendar Pro default fields mappings
		EventId		: {name: 'EventId', mapping:'event_id', type:'int'},
		CalendarId	: {name:'CalendarId', mapping: 'category_id', type: 'int'},
		Title		: {name:'Title', mapping: 'title', type: 'string'},
		StartDate	: {name:'StartDate', mapping: 'startdate', type: 'date', dateFormat: 'c'},
		EndDate		: {name:'EndDate', mapping: 'enddate', type: 'date', dateFormat: 'c'},
		Location	: {name:'Location', mapping: 'location', type: 'string'},
		Notes		: {name:'Notes', mapping: 'notes', type: 'string'},
		Url			: {name:'Url', mapping: 'url', type: 'string'},
		IsAllDay	: {name:'IsAllDay', mapping: 'isallday', type: 'boolean'},
		Reminder	: {name:'Reminder', mapping: 'reminder', type: 'string'},
		IsNew		: {name:'IsNew', mapping: 'isnew', type: 'boolean'},

		// OpentEMR requiered fields mappings
		category_id	: {name:'category_id', mapping: 'category_id', type: 'int'},
		provider_id	: {name:'provider_id', mapping: 'provider_id', type: 'int'},
		status_id	: {name:'status_id', mapping: 'status_id', type: 'int'},
		comments	: {name:'comments', mapping: 'comments', type: 'string'},
		patient_id	: {name:'patient_id', mapping: 'patient_id', type: 'int'},
		recurrence	: {name:'recurrence', mapping: 'recurrence', type: 'string'},
		htmlPatInfo	: {name:'htmlPatInfo', mapping: 'htmlpatinfo', type: 'string'}
	};

	// *************************************************************************************
	// Event Store for the calendar
	// *************************************************************************************
	var eventStore = new Ext.data.JsonStore({
		id: 'eventStore',
		proxy: new Ext.data.ScriptTagProxy({
			url: '../calendar/load_events.ejs.php'
		}),
		fields	: C.EventRecord.prototype.fields.getRange(),
		sortInfo: {
			field: C.EventMappings.StartDate.name,
			direction: 'ASC'
		}
	});

	// *************************************************************************************
	// This is an example calendar store that enables the events to have
	// different colors based on CalendarId. This is not a fully-realized
	// multi-calendar implementation, which is beyond the scope of this sample app
	// *************************************************************************************
	var calendarStore = new Ext.data.JsonStore({
		storeId		: 'calendarStore',
		root		: 'calendars',
		idProperty	: 'id',
		data		: calendarList, // defined in calendar-list.js
		proxy		: new Ext.data.MemoryProxy(),
		autoLoad	: true,
		fields: [
			{name:'CalendarId', mapping: 'id', type: 'int'},
			{name:'Title', mapping: 'title', type: 'string'},
			{name:'Status', mapping: 'status', type: 'string'}
		],
		sortInfo: {
			field		: 'CalendarId',
			direction	: 'ASC'
		}
	});

	// *************************************************************************************
	// This are activity types for the calendar
	//
	// NOTE: We should make this configurable by OpenEMR,
	// so the user can configure activity type on their own.
	// *************************************************************************************
	var calendarList = {
		"calendars":[{
			"id":1,
			"title":"Home"
		},{
			"id":2,
			"title":"Work"
		},{
			"id":3,
			"title":"School"
		}]
	};

	// *************************************************************************************
	// Patient Selector Dialog
	// *************************************************************************************
	var winPatients = new  Ext.Window({
		width		:900,
		height		: 400,
		modal		: true,
		resizable	: true,
		autoScroll	: true,
		title		:	'<?php echo htmlspecialchars(xl('Patients'), ENT_NOQUOTES); ?>',
		closeAction	: 'hide',
		renderTo	: document.body,
		items: [{
			xtype		: 'grid',
			name		: 'gridPatients',
			autoHeight	: true,
			store		: storePat,
			stripeRows	: true,
			frame		: false,
			viewConfig	: {forceFit: true}, // force the grid to the width of the containing panel
			sm			: new Ext.grid.RowSelectionModel({singleSelect:true}),
			listeners: {
				
				// Single click to select the record, and copy the variables
				rowclick: function(grid, rowIndex, e) {
					
				// Get the content from the data grid
				rowContent = grid.getStore().getAt(rowIndex);
					
				// Enable the select button
				winPatients.patSelect.enable();
			}
				
			},
			columns: [
				{ header: 'id', sortable: false, dataIndex: 'id', hidden: true},
				{ header: '<?php echo htmlspecialchars(xl('Name'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'name' },
				{ header: '<?php echo htmlspecialchars(xl('Phone'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'phone'},
				{ header: '<?php echo htmlspecialchars(xl('SS'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'ss' },
				{ header: '<?php echo htmlspecialchars(xl('DOB'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'dob' },
				{ header: '<?php echo htmlspecialchars(xl('PID'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'pid' }
			],
			tbar:[],
			plugins: [new Ext.ux.grid.Search({
				mode			: 'local',
				iconCls			: false,
				deferredRender	:false,
				dateFormat		:'m/d/Y',
				minLength		:4,
				align			:'left',
				width			: 250,
				disableIndexes	: ['id'],
				position		: 'top'
			})]
		}],

		// Window Bottom Bar
		bbar:[{
			text		:'<?php echo htmlspecialchars(xl('Select'), ENT_NOQUOTES); ?>',
			iconCls		: 'select',
			ref			: '../patSelect',
			formBind	: true,
			disabled	: true,
			handler		: function() {
				patient_Info = rowContent;
				Ext.getCmp('patient_but').setText( rowContent.get('name') );
				Ext.getCmp('PatientName').setValue( rowContent.get('name') );
				winPatients.hide();
			
				// Prepare the information for the patient
				HTML_Pat_Inf = '<table width="100%" border="0" cellspacing="3" cellpadding="3">';
				HTML_Pat_Inf = HTML_Pat_Inf + '	<tr>';
				HTML_Pat_Inf = HTML_Pat_Inf + '		<td colspan="2" class="ux-center"><img class="ux-eclosure-photo" src="../../../ui_app/missing_photo.png" width="128" height="128"></td>';
				HTML_Pat_Inf = HTML_Pat_Inf + '	</tr>';
				HTML_Pat_Inf = HTML_Pat_Inf + '	<tr>';
				HTML_Pat_Inf = HTML_Pat_Inf + '		<td class="ux-bold_title">Name:&nbsp;</td>';
				HTML_Pat_Inf = HTML_Pat_Inf + '		<td class="ux-value">' + patient_Info.get('name') + '</td>';
				HTML_Pat_Inf = HTML_Pat_Inf + '	</tr>';
				HTML_Pat_Inf = HTML_Pat_Inf + '	<tr>';
				HTML_Pat_Inf = HTML_Pat_Inf + '		<td class="ux-bold_title">Phone:&nbsp;</td>';
				HTML_Pat_Inf = HTML_Pat_Inf + '		<td class="ux-value">' + patient_Info.get('phone') + '</td>';
				HTML_Pat_Inf = HTML_Pat_Inf + '	</tr>';
				HTML_Pat_Inf = HTML_Pat_Inf + '	<tr>';
				HTML_Pat_Inf = HTML_Pat_Inf + '		<td class="ux-bold_title">SS:&nbsp;</td>';
				HTML_Pat_Inf = HTML_Pat_Inf + '		<td class="ux-value">' + patient_Info.get('ss') + '</td>';
				HTML_Pat_Inf = HTML_Pat_Inf + '	</tr>';
				HTML_Pat_Inf = HTML_Pat_Inf + '	<tr>';
				HTML_Pat_Inf = HTML_Pat_Inf + '		<td class="ux-bold_title">DOB:&nbsp;</td>';
				HTML_Pat_Inf = HTML_Pat_Inf + '		<td class="ux-value">' + patient_Info.get('dob') + '</td>';
				HTML_Pat_Inf = HTML_Pat_Inf + '	</tr>';
				HTML_Pat_Inf = HTML_Pat_Inf + '	<tr>';
				HTML_Pat_Inf = HTML_Pat_Inf + '		<td class="ux-bold_title">Patient ID:&nbsp;</td>';
				HTML_Pat_Inf = HTML_Pat_Inf + '		<td class="ux-value">' + patient_Info.get('pid') + '</td>';
				HTML_Pat_Inf = HTML_Pat_Inf + '	</tr>';
				HTML_Pat_Inf = HTML_Pat_Inf + '</table>';
			
				// Fill the patient general information panel
				Ext.getCmp('htmlPatInfo').setValue( HTML_Pat_Inf );
				Ext.getCmp('PanelPatInfo').update( Ext.getCmp('htmlPatInfo').getValue() );
			
				// Open the panel
				if( Ext.getCmp('PanelPatInfo').isVisible() == false){
					Ext.getCmp('PanelPatInfo').toggleCollapse(true);
				}
			}
		},{
			text	:'<?php echo htmlspecialchars(xl('Close'), ENT_NOQUOTES); ?>',
			iconCls	: 'delete',
			ref		: '../patClose',
			formBind: true,
			handler	: function(){ winPatients.hide(); }
		}]

	}); // END WINDOW


	//*********************************************************************************************************
	// Create a side panel, to navigate through the big calendar.
	//
	// * Moded datepicker to blend into the panel
	// * Select provider box text
	// * ComboBox showing the providers
	// * DataGrid showing all the events
	//
	//*********************************************************************************************************
	var sidePanel = new Ext.Panel({
		region	:'west',
		border	: false,
		width	: 177,
		layout: 'fit',
		autoHeight	: true,
		//margin	: '0 0 0 0',
		items:[{ // Date picker
			xtype		: 'datepicker',
			id			: 'app-nav-picker',
			autoHeight: true,
			listeners	: {
				select: { fn: function(dp, dt){ Ext.getCmp('bfCal').setStartDate(dt); } }
			}
		},{ // Provider title
			xtype		: 'box',
			cls			: 'ux-calendar-box-txt',
			autoWidth	: true,
			autoEl		: {tag: 'div', html: '<?php echo htmlspecialchars(xl('Providers'), ENT_NOQUOTES); ?>'}
		},{ // ComboBox providers
			xtype			: 'combo',
			id				: 'cmb_Providers',
			name			: 'cmb_Providers',
			width			: 176,
			editable		: false,
			triggerAction	: 'all',
			mode			: 'local',
			valueField		: 'username',
			displayField	: 'name',
			store			: provData,
			value			: 'Show All'
		},{ // DatGrid for the events
			xtype		: 'grid',
			frame		: false,
			border		: false,
			store		: storeCalEvent,
			sm			: new Ext.grid.RowSelectionModel({singleSelect:true}),
			viewConfig	: {forceFit: true}, // this is the option which will force the grid to the width of the containing panel
			autoHeight	: true,
			columns: [
				{ header: 'id_cal', sortable: false, dataIndex: 'id_cal', hidden: true},
				{ header: '<?php echo htmlspecialchars(xl('Events'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'title' }
			]
		}],
		tbar:[{
			text:'<?php echo htmlspecialchars(xl('iCAL'), ENT_NOQUOTES); ?>',
			iconCls: 'icoCalendar'
		}]
	});

	//*********************************************************************************************************
	// The bigFat Calendar Pro
	//*********************************************************************************************************
	var bigCalendar = new C.CalendarPanel({
		region			: 'center',
		border			: false,
		ref				: '../bfCal',
		id				: 'bfCal',
		eventStore		: eventStore,
		layout			: 'fit',
		calendarStore	: calendarStore,
		title			: '...',
		todayText		: '<?php echo htmlspecialchars(xl('Today'), ENT_NOQUOTES); ?>',
		monthText		: '<?php echo htmlspecialchars(xl('Month'), ENT_NOQUOTES); ?>',
		multiWeekText	: '{0} <?php echo htmlspecialchars(xl('Weeks'), ENT_NOQUOTES); ?>',
		weekText		: '<?php echo htmlspecialchars(xl('Week'), ENT_NOQUOTES); ?>',
		multiDayText	: '{0} <?php echo htmlspecialchars(xl('Days'), ENT_NOQUOTES); ?>',
		dayText			: '<?php echo htmlspecialchars(xl('Day'), ENT_NOQUOTES); ?>',
		jumpToText		: '<?php echo htmlspecialchars(xl('Jump to:'), ENT_NOQUOTES); ?>',
		goText			: '<?php echo htmlspecialchars(xl('Go'), ENT_NOQUOTES); ?>',
		activeItem: 1, // month view

		// Any generic view options that should be applied to all sub views:
		viewConfig: {
			//enableFx: false,
			//ddIncrement: 10, //only applies to DayView and subclasses, but convenient to put it here
			//viewStartHour: 6,
			//viewEndHour: 18,
			//minEventDisplayMinutes: 15
		},

		// View options specific to a certain view (if the same options exist in viewConfig
		// they will be overridden by the view-specific config):
		monthViewCfg: {
			showHeader: true,
			showWeekLinks: true,
			showWeekNumbers: true
		},

		multiWeekViewCfg: {
			//weekCount: 3
		},

		// Some optional CalendarPanel configs to experiment with:
		//readOnly: true,
		//showDayView: false,
		//showMultiDayView: true,
		//showWeekView: false,
		//showMultiWeekView: false,
		//showMonthView: false,
		//showNavBar: false,
		//showTodayText: false,
		//showTime: false,
		//editModal: true,
		//enableEditDetails: false,

		listeners:{
			viewchange: { fn: function(p, vw, dateInfo) {
				if(dateInfo.viewStart.clearTime().getTime() == dateInfo.viewEnd.clearTime().getTime()){
					bigCalendar.setTitle(dateInfo.viewStart.format('F j, Y'));
				} else if(dateInfo.viewStart.getFullYear() == dateInfo.viewEnd.getFullYear()){
					if(dateInfo.viewStart.getMonth() == dateInfo.viewEnd.getMonth()){
					bigCalendar.setTitle(dateInfo.viewStart.format('F j') + ' - ' + dateInfo.viewEnd.format('j, Y'));
				} else{
					bigCalendar.setTitle(dateInfo.viewStart.format('F j') + ' - ' + dateInfo.viewEnd.format('F j, Y'));
				}
				} else {
					bigCalendar.setTitle(dateInfo.viewStart.format('F j, Y') + ' - ' + dateInfo.viewEnd.format('F j, Y'));
				}
			}}
		}
	});


	//*********************************************************************************************************
	// The main Panel
	//*********************************************************************************************************
	var RenderPanel = new Ext.Panel({
		border	: false,
		id		: 'RenderPanel',
		renderTo: Ext.getCmp('TopPanel').body,
		layout	: 'border',
		autoWidth: true,
		stateful: true,
		monitorResize: true,
		viewConfig:{forceFit:true},
		items	: [sidePanel, bigCalendar]
	});

	//*********************************************************************************************************
	// Make sure that the RenderPanel height has the same height of the TopPanel
	// at first run.
	// This is standard.
	//*********************************************************************************************************
	Ext.getCmp('RenderPanel').setHeight( Ext.getCmp('TopPanel').getHeight() );

}); // END EXTJS

</script>
