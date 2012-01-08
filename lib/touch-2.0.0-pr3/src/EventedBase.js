/**
 * @private
 */
Ext.define('Ext.EventedBase', {

    mixins: ['Ext.mixin.Observable'],

    doSet: function(me, value, oldValue, options) {
        var nameMap = options.nameMap;

        me[nameMap.internal] = value;
        me[nameMap.doSet](value, oldValue);
    },

    onClassExtended: function(Class, data) {
        if (!data.hasOwnProperty('eventedConfig')) {
            return;
        }

        var ExtClass = Ext.Class,
            config = data.config,
            eventedConfig = data.eventedConfig;

        data.config = (config) ? Ext.applyIf(config, eventedConfig) : eventedConfig;

        Ext.Object.each(eventedConfig, function(name) {
            var map = ExtClass.getConfigNameMap(name),
                internalName = map.internal,
                doSetName = map.doSet,
                applyName = map.apply,
                options = {
                    nameMap: map
                },
                changeEventName = map.changeEvent;

            /*
             * These are generated setters for eventedConfig
             *
             * If the component is initialized, it invokes fireAction to fire the event as well,
             * which indicate something has changed. Otherwise, it just executes the action
             * (happens during initialization)
             *
             * This is helpful when we only want the event to be fired for subsequent changes.
             * Also it's a major performance improvement for instantiation when fired events
             * are mostly useless since there's no listeners
             */
            Class.addMember(map.set, function(value) {
                var initialized = this.initialized,
                    oldValue = this[internalName],
                    applier = this[applyName];

                if (applier) {
                    value = applier.call(this, value, oldValue);

                    if (typeof value == 'undefined') {
                        return this;
                    }
                }

                if (value !== oldValue) {
                    if (initialized) {
                        this.fireAction(changeEventName, [this, value, oldValue], this.doSet, this, options);
                    }
                    else {
                        this[internalName] = value;
                        this[doSetName](value, oldValue);
                    }
                }

                return this;
            });
        });
    }
});
