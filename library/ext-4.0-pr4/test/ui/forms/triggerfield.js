Ext.onReady(function() {

    // Simple trigger field
    Ext.create('Ext.form.Trigger', {
        name: 'simpleTrigger',
        width: 300,
        renderTo: 'simpleTriggerDemo',
        value: 'Trigger!',

        triggerCls: 'simple-trigger',

        onTriggerClick: function() {
            alert('Trigger was clicked! Field value is "' + this.getValue() + '"');
        }
    });

    // Multiple triggers demo
    Ext.create('Ext.form.Trigger', {
        name: 'multiTriggers',
        width: 300,
        emptyText: 'Search...',
        renderTo: 'multiTriggerDemo',

        // Clear
        trigger1Cls: 'clear-trigger',
        onTrigger1Click: function() {
            this.setValue('');
        },

        // search
        trigger2Cls: 'search-trigger',
        onTrigger2Click: function() {
            var val = Ext.util.Format.trim(this.getValue());
            if (val) {
                window.location = 'http://google.com/search?q=' + val;
            }
        }
    });

});