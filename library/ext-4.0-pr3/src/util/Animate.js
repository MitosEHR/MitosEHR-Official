/**
 * @class Ext.util.Animate
 * A mixin to add animation capabilities to Elements/CompositeElements/Sprites/SpriteGroups/Components
 */
Ext.define('Ext.util.Animate', {

    uses: ['Ext.fx.Manager', 'Ext.fx.Anim'],

    /**
     * Perform custom animation on this element.
     * @param {Ext.fx.Anim} animObj An Ext.fx Anim object
     * @return {Ext.core.Element} this
     */
    animate: function(animObj) {
        var me = this;
        if (Ext.fx.Manager.hasFxBlock(me.id)) {
            return me;
        }
        Ext.fx.Manager.queueFx(Ext.create('Ext.fx.Anim', me.anim(animObj)));
        return this;
    },

    // @private - process the passed fx configuration.
    anim: function(config) {
        if (!Ext.isObject(config)) {
            return (config) ? {} : false;
        }

        var me = this;

        if (config.stopFx) {
            me.stopFx();
        }

        Ext.applyIf(config, Ext.fx.Manager.getFxDefaults(me.id));

        return Ext.apply({
            target: me,
            paused: true
        }, config);
    },

    /**
     * Stops any running effects and clears the element's internal effects queue if it contains
     * any additional effects that haven't started yet.
     * @return {Ext.core.Element} The Element
     */
    stopFx: function() {
        Ext.fx.Manager.stopFx(this.id);
    },

    /**
     * Ensures that all effects queued after syncFx is called on the element are
     * run concurrently.  This is the opposite of {@link #sequenceFx}.
     * @return {Ext.core.Element} The Element
     */
    syncFx: function() {
        Ext.fx.Manager.setFxDefaults(this.id, {
            concurrent: true
        });
    },

    /**
     * Ensures that all effects queued after sequenceFx is called on the element are
     * run in sequence.  This is the opposite of {@link #syncFx}.
     * @return {Ext.core.Element} The Element
     */
    sequenceFx: function() {
        Ext.fx.Manager.setFxDefaults(this.id, {
            concurrent: false
        });
    },

    /**
     * Returns thq current animation if the element has any effects actively running or queued, else returns false.
     * @return {Mixed} anim if element has active effects, else false
     */
    hasActiveFx: function() {
        return Ext.fx.Manager.hasActiveFx(this.id);
    }
});

// Apply Animate mixin manually until Element is defined in the proper 4.x way
Ext.applyIf(Ext.core.Element.prototype, Ext.util.Animate.prototype);