Ext.override(Ext.grid.RowEditor, {
	loadRecord: function(record) {
		var me = this,
			form = me.getForm(),
			valid = form.isValid();

		form.loadRecord(record);
		if(me.errorSummary) {
			me[valid ? 'hideToolTip' : 'showToolTip']();
		}

		Ext.Array.forEach(me.query('>displayfield'), function(field) {
			me.renderColumnData(field, record);
		}, me);
	}
});
Ext.override(Ext.form.field.Checkbox, {
	inputValue    : '1',
	uncheckedValue: '0'
});
Ext.override(Ext.grid.Scroller, {

	afterRender    : function() {
		var me = this;
		me.callParent();
		me.mon(me.scrollEl, 'scroll', me.onElScroll, me);
		Ext.cache[me.el.id].skipGarbageCollection = true;
		// add another scroll event listener to check, if main listeners is active
		Ext.EventManager.addListener(me.scrollEl, 'scroll', me.onElScrollCheck, me);
		// ensure this listener doesn't get removed
		Ext.cache[me.scrollEl.id].skipGarbageCollection = true;
	},

	// flag to check, if main listeners is active
	wasScrolled    : false,

	// synchronize the scroller with the bound gridviews
	onElScroll     : function(event, target) {
		this.wasScrolled = true; // change flag -> show that listener is alive
		this.fireEvent('bodyscroll', event, target);
	},

	// executes just after main scroll event listener and check flag state
	onElScrollCheck: function(event, target, options) {
		var me = this;

		if(!me.wasScrolled) {
			// Achtung! Event listener was disappeared, so we'll add it again
			me.mon(me.scrollEl, 'scroll', me.onElScroll, me);
		}
		me.wasScrolled = false; // change flag to initial value
	}

});
