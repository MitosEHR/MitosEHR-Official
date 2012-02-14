Ext.override( Ext.grid.RowEditor, {
  loadRecord: function(record) {
    var me = this,
        form = me.getForm(),
        valid = form.isValid();

    form.loadRecord(record);
    if( me.errorSummary ) {
      me[valid ? 'hideToolTip' : 'showToolTip']();
    }

    Ext.Array.forEach( me.query('>displayfield'), function(field) {
      me.renderColumnData(field, record);
    }, me);
  }
});
Ext.override( Ext.form.field.Checkbox, {
    inputValue: '1',
    uncheckedValue: '0'
});