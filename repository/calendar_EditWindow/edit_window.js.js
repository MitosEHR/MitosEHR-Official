	//*********************************************************************************************************
	// Add new or edit event Window
	// This is a override of the extensible-all-debug.js file.
	// Made to create the custom event window for MitosEHR
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
