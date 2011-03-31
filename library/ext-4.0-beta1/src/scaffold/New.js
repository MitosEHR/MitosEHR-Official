/**
 * @class Ext.scaffold.Build
 * @extends Ext.scaffold.Form
 * @private
 * Scaffold component allowing the easy creation of a new model instance
 */
Ext.scaffold.Build = Ext.extend(Ext.scaffold.Form, {
    titleFormat: "New {0}"
});

Ext.reg('scaffold-build', Ext.scaffold.Build);