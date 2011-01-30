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
include_once("../../globals.php");
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
		url: 'load_events.ejs.php?task=load_events&group=%'
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
		url: 'load_form.ejs.php?task=cmbProv'
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
			url: 'load_form.ejs.php?task=cmbProvEdit'
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
			url: 'load_form.ejs.php?task=cmbStatus'
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
		url: 'load_form.ejs.php?task=cmbCat'
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
			url: 'load_events.ejs.php'
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
		width	: 176,
		margin	: '0 0 0 0',
		items:[{ // Date picker
			xtype		: 'datepicker',
			id			: 'app-nav-picker',
			cls			: 'ext-cal-nav-picker',
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
			iconCls: 'icoDownload'
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
		calendarStore	: calendarStore,
		border			: true,
		title			: '...',
		todayText		: '<?php echo htmlspecialchars(xl('Today'), ENT_NOQUOTES); ?>',
		monthText		: '<?php echo htmlspecialchars(xl('Month'), ENT_NOQUOTES); ?>',
		multiWeekText	: '{0} <?php echo htmlspecialchars(xl('Weeks'), ENT_NOQUOTES); ?>',
		weekText		: '<?php echo htmlspecialchars(xl('Week'), ENT_NOQUOTES); ?>',
		multiDayText	: '{0} <?php echo htmlspecialchars(xl('Days'), ENT_NOQUOTES); ?>',
		dayText			: '<?php echo htmlspecialchars(xl('Day'), ENT_NOQUOTES); ?>',
		jumpToText		: '<?php echo htmlspecialchars(xl('Jump to:'), ENT_NOQUOTES); ?>',
		goText			: '<?php echo htmlspecialchars(xl('Go'), ENT_NOQUOTES); ?>',
		activeItem		: 1, // month view
		// Any generic view options that should be applied to all sub views:
		viewConfig		: { enableFx: true },
		// View options specific to a certain view (if the same options exist in viewConfig
		// they will be overridden by the view-specific config):
		monthViewCfg: {
			showHeader		: true,
			showWeekLinks	: true,
			showWeekNumbers	: true
		},
		multiWeekViewCfg: { weekCount: 3 },
		// Some optional CalendarPanel configs to experiment with:
		showDayView			: true,
		showMultiDayView	: true,
		showWeekView		: true,
		showMultiWeekView	: true,
		showMonthView		: true,
		showNavBar			: true,
		showTodayText		: true,
		showTime			: true,
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
	var CalPanel = new Ext.Panel({
		border	: false,
		layout	: 'border',
		items	:[sidePanel, bigCalendar]
	});
	
	//*********************************************************************************************************
	// Add new or edit event Window
	// This is a override of the extensible-all-debug.js file.
	// Made to create the custom event window for OpenEMR
	//*********************************************************************************************************
	Ext.ensible.cal.EventEditWindow = Ext.extend(Ext.Window, {
		titleTextAdd	: '<?php echo htmlspecialchars(xl('Add Event'), ENT_NOQUOTES); ?>',
		titleTextEdit	: '<?php echo htmlspecialchars(xl('Edit Event'), ENT_NOQUOTES); ?>',
		width			: 800,
		height			: 550,
		border			: false,
		closeAction		: 'hide',
		id				: 'winCalendar',
		modal			: false,
		resizable		: false,
		labelWidth		: 65,
		layout			: 'border',
		plain			: true,
		savingMessage	: '<?php echo htmlspecialchars(xl('Saving changes...'), ENT_NOQUOTES); ?>',
		deletingMessage	: '<?php echo htmlspecialchars(xl('Deleting event...'), ENT_NOQUOTES); ?>',

		// private
		newId: 10000,

		// private
		initComponent: function(){
			this.addEvents({
				eventadd	: true,
				eventupdate	: true,
				eventdelete	: true,
				eventcancel	: true,
				editdetails	: false
			});

			this.fbar = ['->',
				{ text:'Save', disabled:false, handler:this.onSave, scope:this },
				{ id:this.id+'-delete-btn', text:'Delete', disabled:false, handler:this.onDelete, scope:this, hideMode:'offsets' },
				{ text:'Cancel', disabled:false, handler:this.onCancel, scope:this }
			];

			Ext.ensible.cal.EventEditWindow.superclass.initComponent.call(this);
		},

	// private
	onRender : function(ct, position){
		this.deleteBtn = Ext.getCmp(this.id+'-delete-btn');

		// The simple title
		this.titleField = new Ext.form.TextField({
			name		: Ext.ensible.cal.EventMappings.Title.name,
			fieldLabel	: '<?php echo htmlspecialchars(xl('Title'), ENT_NOQUOTES); ?>',
			anchor		: '100%'
		});

		// Configuration for single event.
		this.fieldset_OEMR_Single = new Ext.form.FieldSet({
			title			: '<?php echo htmlspecialchars(xl('Single Event'), ENT_NOQUOTES); ?>',
			autoHeight		: true,
			id				: 'single',
			anchor			: '100%',
			items:[{
				xtype		: 'daterangefield',
				id			: 'daterangefield',
				name		: Ext.ensible.cal.EventMappings.StartDate.name,
				anchor		: '100%',
				fieldLabel	: '<?php echo htmlspecialchars(xl('When'), ENT_NOQUOTES); ?>',
				listeners	:{
					change	: function() {
						// Set the date picked by the user into the recurrence event
						var Cal_date = Ext.getCmp('daterangefield').getValue();
						Ext.getCmp('recurrence').setStartDate( Cal_date[0] );
					}
				}
			}]
		});

		// Configuration for recurrence event
		this.fieldset_OEMR_Recurrence = new Ext.form.FieldSet({
			title			: '<?php echo htmlspecialchars(xl('Recurrence Event'), ENT_NOQUOTES); ?>',
			autoHeight		: true,
			anchor			: '100%',
			items			: [{
				xtype			: 'extensible.recurrencefield',
				id				: 'recurrence',
				name			: Ext.ensible.cal.EventMappings.recurrence.name,
				//frequency		: 'WEEKLY',
				//value			: 'FREQ=DAILY',
				anchor			: '100%'
			}]
		});

		// The Detailed information
		this.fieldSet_OEMR = new Ext.form.FieldSet({
			title			: '<?php echo htmlspecialchars(xl('Detailed Event'), ENT_NOQUOTES); ?>',
			autoHeight		: true,
			anchor			: '100%',
			items:[{
				xtype		: 'button',
				ref			: '../patient_but',
				id			: 'patient_but',
				name		: 'patient_but',
				text		: '<?php echo htmlspecialchars(xl('Click to select patient...'), ENT_NOQUOTES); ?>',
				fieldLabel	: '<?php echo htmlspecialchars(xl('Patient'), ENT_NOQUOTES); ?>',
				editable	: false,
				anchor		: '50%',
				handler		: function(){ winPatients.show(); }
			},{
				xtype			: 'combo',
				id				: 'Category',
				anchor			: '50%',
				name			: Ext.ensible.cal.EventMappings.CalendarId.name,
				fieldLabel		: '<?php echo htmlspecialchars(xl('Category'), ENT_NOQUOTES); ?>',
				editable		: false,
				triggerAction	: 'all',
				mode			: 'local',
				valueField		: 'id',
				emptyText		: '<?php echo htmlspecialchars(xl('Select category'), ENT_NOQUOTES); ?>...',
				displayField	: 'name',
				store			: catData
			},{
				xtype			: 'combo',
				id				: 'Provider',
				anchor			: '50%',
				name			: Ext.ensible.cal.EventMappings.provider_id.name,
				fieldLabel		: '<?php echo htmlspecialchars(xl('Provider'), ENT_NOQUOTES); ?>',
				editable		: false,
				triggerAction	: 'all',
				mode			: 'local',
				valueField		: 'username',
				emptyText		: '<?php echo htmlspecialchars(xl('Select provider'), ENT_NOQUOTES); ?>...',
				displayField	: 'name',
				store			: provData_Edit
			},{
				xtype			: 'combo',
				id				: 'Status',
				anchor			: '50%',
				name			: Ext.ensible.cal.EventMappings.status_id.name,
				fieldLabel		: '<?php echo htmlspecialchars(xl('Status'), ENT_NOQUOTES); ?>',
				editable		: false,
				triggerAction	: 'all',
				mode			: 'local',
				valueField		: 'option_id',
				displayField	: 'title',
				emptyText		: '<?php echo htmlspecialchars(xl('Select status'), ENT_NOQUOTES); ?>...',
				store			: statusData
			},{
				xtype			: 'textarea',
				fieldLabel		: '<?php echo htmlspecialchars(xl('Comments'), ENT_NOQUOTES); ?>',
				id				: 'Comments',
				name			: Ext.ensible.cal.EventMappings.comments.name,
				anchor			: '100%',
				height			: 50
			},{
				// This is the storage for the Patient Name Button
				xtype			: 'textfield',
				hidden			: true,
				id				: 'PatientName',
				name			: Ext.ensible.cal.EventMappings.patient_id.name
			},{
				// This is the storage for the Patient Information HTML panel.
				xtype			: 'textarea',
				hidden			: true,
				id				: 'htmlPatInfo',
				name			: Ext.ensible.cal.EventMappings.htmlPatInfo.name
			}]
		});

		// Glue all the peaces together
		var items = [ this.titleField,
			this.fieldset_OEMR_Single,
			this.fieldset_OEMR_Recurrence,
			this.fieldSet_OEMR ];

		if(this.calendarStore){
			this.calendarField = new Ext.ensible.cal.CalendarPicker({
				name: Ext.ensible.cal.EventMappings.EventId.name,
				anchor: '100%',
				store: this.calendarStore
			});
			items.push(this.calendarField);
		}

		this.formPanel = new Ext.FormPanel({
			labelWidth	: this.labelWidth,
			frame		: false,
			border		: false,
			items		: items
		});

		this.panelCenter = new Ext.Panel({
			frame		: true,
			border		: true,
			region		: 'center',
			items		: this.formPanel
		});

		// This panel will hold the detailed patient information if it's selected.
		this.panelPatient_Info = new Ext.Panel({
			title		: '<?php echo htmlspecialchars(xl('Patient General Information'), ENT_NOQUOTES); ?>',
			region		: 'east',
			width		: 200,
			collapsible	: true,
			collapsed	: true,
			floatable	: true,
			id			: 'PanelPatInfo',
			minWidth	: 200,
			maxWidth	: 200,
			split		: true,
			style		: { padding: '1px' }
		});

		this.add( this.panelCenter, this.panelPatient_Info);

		Ext.ensible.cal.EventEditWindow.superclass.onRender.call(this, ct, position);
		},

		// private
		afterRender: function(){
			Ext.ensible.cal.EventEditWindow.superclass.afterRender.call(this);

			this.el.addClass('ext-cal-event-win');
			this.el.select('.'+this.editDetailsLinkClass).on('click', this.onEditDetailsClick, this);
		},

		// private
		onEditDetailsClick: function(e){
			e.stopEvent();
			this.updateRecord();
			this.fireEvent('editdetails', this, this.activeRecord, this.animateTarget);
		},

		show: function(o, animateTarget){
			// Work around the CSS day cell height hack needed for initial render in IE8/strict:
			var anim = (Ext.isIE8 && Ext.isStrict) ? null : animateTarget;

			Ext.ensible.cal.EventEditWindow.superclass.show.call(this, anim, function(){
			this.titleField.focus(false, 100);
		});
		this.deleteBtn[o.data && o.data[Ext.ensible.cal.EventMappings.EventId.name] ? 'show' : 'hide']();

		var rec, f = this.formPanel.form;

		if(o.data){
			rec = o;
			this.isAdd = !!rec.data[Ext.ensible.cal.EventMappings.isnew.name];
			if(this.isAdd){
				// Enable adding the default record that was passed in
				// if it's new even if the user makes no changes
				rec.markDirty();
				this.setTitle(this.titleTextAdd);
			} else{
				this.setTitle(this.titleTextEdit);
			}

			f.loadRecord(rec);

			// If the screen is called for editing then copy
			// the field into the buttons and panel.
			if (!this.isAdd){
				Ext.getCmp('patient_but').setText( Ext.getCmp('PatientName').getValue() );
				Ext.getCmp('PanelPatInfo').update( Ext.getCmp('htmlPatInfo').getValue() );
			}

			// Open the Patient Information panel
			if( Ext.getCmp('PanelPatInfo').isVisible() == false){
				Ext.getCmp('PanelPatInfo').toggleCollapse(true);
			}

		} else{
			this.isAdd = true;
			this.setTitle(this.titleTextAdd);

			var M = Ext.ensible.cal.EventMappings,
			eventId = M.EventId.name,
			start = o[M.StartDate.name],
			end = o[M.EndDate.name] || start.add('h', 1);

			rec = new Ext.ensible.cal.EventRecord();
			rec.data[M.EventId.name] = this.newId++;
			rec.data[M.StartDate.name] = start;
			rec.data[M.EndDate.name] = end;
			rec.data[M.IsAllDay.name] = !!o[M.IsAllDay.name] || start.getDate() != end.clone().add(Date.MILLI, 1).getDate();
			rec.data[M.IsNew.name] = true;
			rec.data[M.CalendarId.name] = o[M.CalendarId.name];
			rec.data[M.provider_id.name] = o[M.provider_id.name];
			rec.data[M.status_id.name] = o[M.status_id.name];
			rec.data[M.comments.name] = o[M.comments.name];
			rec.data[M.patient_id.name] = o[M.patient_id.name];
			rec.data[M.recurrence.name] = o[M.recurrence.name];
			rec.data[M.htmlPatInfo] = o[M.htmlPatInfo.name];
			
			// Reset the values from the button and panel
			Ext.getCmp('htmlPatInfo').setValue('');
			Ext.getCmp('PanelPatInfo').update('');
			
			// Close the Patient Information panel
			if( Ext.getCmp('PanelPatInfo').isVisible() == true){
				Ext.getCmp('PanelPatInfo').toggleCollapse(true);
			}
			
			Ext.getCmp('patient_but').setText('<?php echo htmlspecialchars(xl('Click to select patient...'), ENT_NOQUOTES); ?>');

			f.reset();
			f.loadRecord(rec);
		}

		if(this.calendarStore){
			this.calendarField.setValue(rec.data[Ext.ensible.cal.EventMappings.EventId.name]);
		}

		// Set the date picked by th user into the single event
		Ext.getCmp('daterangefield').setValue(rec.data);

		// Set the date picked by th user into the recurrence event
		var Cal_date = Ext.getCmp('daterangefield').getValue();
		Ext.getCmp('recurrence').setStartDate( Cal_date[0] );

		this.activeRecord = rec;

		return this;
		},

		// private
		roundTime: function(dt, incr){
			incr = incr || 15;
			var m = parseInt(dt.getMinutes());
			return dt.add('mi', incr - (m % incr));
		},

		// private
		onCancel: function(){
			//this.cleanup(true);
			this.fireEvent('eventcancel', this, this.animateTarget);
		},

		// private
		cleanup: function(hide){
			if(this.activeRecord && this.activeRecord.dirty){
				this.activeRecord.reject();
			}
			delete this.activeRecord;

			if(hide===true){
				// Work around the CSS day cell height hack needed for initial render in IE8/strict:
				//var anim = afterDelete || (Ext.isIE8 && Ext.isStrict) ? null : this.animateTarget;
				this.hide();
			}
		},

		// private
		updateRecord: function(){
			var f = this.formPanel.form,
			dates = this.fieldset_OEMR_Single.findById('daterangefield').getValue(),
			M = Ext.ensible.cal.EventMappings;

			f.updateRecord(this.activeRecord);
			this.activeRecord.set(M.StartDate.name, dates[0]);
			this.activeRecord.set(M.EndDate.name, dates[1]);
			this.activeRecord.set(M.IsAllDay.name, dates[2]);
			this.activeRecord.set(M.CalendarId.name, Ext.getCmp('Category').getValue() );
			this.activeRecord.set(M.provider_id.name, Ext.getCmp('Provider').getValue() );
			this.activeRecord.set(M.status_id.name, Ext.getCmp('Status').getValue() );
			this.activeRecord.set(M.comments.name, Ext.getCmp('Comments').getValue() );
			this.activeRecord.set(M.patient_id.name, Ext.getCmp('PatientName').getValue() );
			this.activeRecord.set(M.recurrence.name, Ext.getCmp('recurrence').getValue() );
			this.activeRecord.set(M.htmlPatInfo.name, Ext.getCmp('htmlPatInfo').getValue() );
			if(this.calendarStore){
				this.activeRecord.set(M.EventId.name, this.calendarField.getValue());
			}
		},

		// private
		onSave: function(){
			if(!this.formPanel.form.isValid()){ return; }
			this.updateRecord();
		
			if(!this.activeRecord.dirty){
				this.onCancel();
				return;
			}
		
			this.fireEvent(this.isAdd ? 'eventadd' : 'eventupdate', this, this.activeRecord, this.animateTarget);
		},

		// private
		onDelete: function(){
			this.fireEvent('eventdelete', this, this.activeRecord, this.animateTarget);
		}
	
	});

	/**
	 * @class Ext.ensible.cal.DateRangeField
	 * @extends Ext.form.Field
	 * <p>A combination field that includes start and end dates and times, as well as an optional all-day checkbox.</p>
	 * @constructor
	 * @param {Object} config The config object
	 */
		Ext.ensible.cal.DateRangeField = Ext.extend(Ext.form.Field, {
			toText: '<?php echo htmlspecialchars(xl('to'), ENT_NOQUOTES); ?>',
			allDayText: '<?php echo htmlspecialchars(xl('All day'), ENT_NOQUOTES); ?>',
			singleLine: 'auto',
			singleLineMinWidth: 490,

	// private
	onRender: function(ct, position){
		if(!this.el){
			this.startDate = new Ext.form.DateField({
				id: this.id+'-start-date',
				format: 'n/j/Y',
				width:100,
				listeners: {
					'change': {
						fn: function(){
						this.checkDates('date', 'start');
					},
					scope: this
				}
			}
			});
			this.startTime = new Ext.form.TimeField({
				id			: this.id+'-start-time',
				hidden		: this.showTimes === false,
				labelWidth	: 0,
				hideLabel	:true,
				width		:90,
				listeners	: {
					'select': {
						fn: function(){
						this.checkDates('time', 'start');
					},
					scope: this
					}
				}
			});
			this.endTime = new Ext.form.TimeField({
				id: this.id+'-end-time',
				hidden: this.showTimes === false,
				labelWidth: 0,
				hideLabel:true,
				width:90,
				listeners: {
					'select': {
						fn: function(){
						this.checkDates('time', 'end');
					},
					scope: this
				}
			}
			})
			this.endDate = new Ext.form.DateField({
				id: this.id+'-end-date',
				format: 'n/j/Y',
				hideLabel:true,
				width:100,
				listeners: {
				'change': {
					fn: function(){
						this.checkDates('date', 'end');
					},
					scope: this
					}
				}
			});
			this.allDay = new Ext.form.Checkbox({
				id: this.id+'-allday',
				hidden: this.showTimes === false || this.showAllDay === false,
				boxLabel: this.allDayText,
				handler: function(chk, checked){
					this.startTime.setVisible(!checked);
					this.endTime.setVisible(!checked);
				},
				scope: this
			});
			this.toLabel = new Ext.form.Label({
				xtype: 'label',
				id: this.id+'-to-label',
				text: this.toText
			});

			var singleLine = this.singleLine;
			if(singleLine == 'auto'){
				var el, w = this.ownerCt.getWidth() - this.ownerCt.getEl().getPadding('lr');
				if(el = this.ownerCt.getEl().child('.x-panel-body')){
					w -= el.getPadding('lr');
				}
				if(el = this.ownerCt.getEl().child('.x-form-item-label')){
					w -= el.getWidth() - el.getPadding('lr');
				}
				singleLine = w <= this.singleLineMinWidth ? false : true;
			}

			this.fieldCt = new Ext.Container({
				autoEl: {id:this.id}, //make sure the container el has the field's id
				cls: 'ext-dt-range',
				renderTo: ct,
				layout: 'table',
				layoutConfig: {
					columns: singleLine ? 6 : 3
				},
				defaults: {
					hideParent: true
				},
				items:[
					this.startDate,
					this.startTime,
					this.toLabel,
					singleLine ? this.endTime : this.endDate,
					singleLine ? this.endDate : this.endTime,

					this.allDay
				]
			});

			this.fieldCt.ownerCt = this;
			this.el = this.fieldCt.getEl();
			this.items = new Ext.util.MixedCollection();
			this.items.addAll([this.startDate, this.endDate, this.toLabel, this.startTime, this.endTime, this.allDay]);
			}

			Ext.ensible.cal.DateRangeField.superclass.onRender.call(this, ct, position);

			if(!singleLine){
				this.el.child('tr').addClass('ext-dt-range-row1');
			}
		},

		// private
		checkDates: function(type, startend){
			var startField = Ext.getCmp(this.id+'-start-'+type),
			endField = Ext.getCmp(this.id+'-end-'+type),
			startValue = this.getDT('start'),
			endValue = this.getDT('end');

			if(startValue > endValue){
				if(startend=='start'){
					endField.setValue(startValue);
				}else{
					startField.setValue(endValue);
					this.checkDates(type, 'start');
			}
			}
		    if(type=='date'){
			this.checkDates('time', startend);
		    }
		    // Set the date picked by th user into the recurrence event
		    var Cal_date = Ext.getCmp('daterangefield').getValue();
		    Ext.getCmp('recurrence').setStartDate( Cal_date[0] );
		},

		getValue: function(){
		    return [
			this.getDT('start'),
			this.getDT('end'),
			this.allDay.getValue()
		    ];
		},

		// private getValue helper
		getDT: function(startend){
		    var time = this[startend+'Time'].getValue(),
		    dt = this[startend+'Date'].getValue();

		    if(Ext.isDate(dt)){
			dt = dt.format(this[startend+'Date'].format);
		    }
		    else{
			return null;
		    };
		    if(time != '' && this[startend+'Time'].isVisible()){
			return Date.parseDate(dt+' '+time, this[startend+'Date'].format+' '+this[startend+'Time'].format);
		    }
		    return Date.parseDate(dt, this[startend+'Date'].format);

		},

		setValue: function(v){
			if(Ext.isArray(v)){
				this.setDT(v[0], 'start');
				this.setDT(v[1], 'end');
				this.allDay.setValue(!!v[2]);
			}
			else if(Ext.isDate(v)){
				this.setDT(v, 'start');
				this.setDT(v, 'end');
				this.allDay.setValue(false);
			}
			else if(v[Ext.ensible.cal.EventMappings.StartDate.name]){ //object
			this.setDT(v[Ext.ensible.cal.EventMappings.StartDate.name], 'start');
			if(!this.setDT(v[Ext.ensible.cal.EventMappings.EndDate.name], 'end')){
				this.setDT(v[Ext.ensible.cal.EventMappings.StartDate.name], 'end');
			}
				this.allDay.setValue(!!v[Ext.ensible.cal.EventMappings.IsAllDay.name]);
			}
		},

		// private setValue helper
		setDT: function(dt, startend){
			if(dt && Ext.isDate(dt)){
				this[startend+'Date'].setValue(dt);
				this[startend+'Time'].setValue(dt.format(this[startend+'Time'].format));
				return true;
			}
		},

		// inherited docs
		isDirty: function(){
		    var dirty = false;
		    if(this.rendered && !this.disabled) {
			this.items.each(function(item){
			    if (item.isDirty()) {
				dirty = true;
				return false;
			    }
			});
		    }
		    return dirty;
		},

		// private
		onDisable : function(){
		    this.delegateFn('disable');
		},

		// private
		onEnable : function(){
		    this.delegateFn('enable');
		},

		// inherited docs
		reset : function(){
		    this.delegateFn('reset');
		},

		// private
		delegateFn : function(fn){
		    this.items.each(function(item){
			if (item[fn]) {
			    item[fn]();
			}
		    });
		},

		// private
		beforeDestroy: function(){
			Ext.destroy(this.fieldCt);
			Ext.ensible.cal.DateRangeField.superclass.beforeDestroy.call(this);
		},

		/**
		 * @method getRawValue
		 * @hide
		 */
		getRawValue : Ext.emptyFn,
		/**
		 * @method setRawValue
		 * @hide
		 */
		setRawValue : Ext.emptyFn
		});
		Ext.reg('daterangefield', Ext.ensible.cal.DateRangeField);

		// Temporary render DIV
		CalPanel.render('ext-gen38');
		
}); // END EXTJS

</script>
