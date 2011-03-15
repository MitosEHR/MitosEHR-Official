/**
 * @class Ext.grid.Feature
 * @extends Ext.util.Observable
 *
 * Features allow you to manipulate the functionality available within a grid
 * view such as grouping, treegrid, rowbody, rowwrap, etc.
 */

Ext.define('Ext.grid.Feature', {
    extend: 'Ext.util.Observable',
    alias: 'feature.feature',
    
    isFeature: true,
    disabled: false,
    
    /**
     * @property {Boolean}
     * Most features will expose additional events, some may not and will
     * need to change this to false.
     */
    hasFeatureEvent: true,
    
    /**
     * @property {String}
     * Prefix to use when firing events on the view.
     * For example a prefix of group would expose "groupclick", "groupcontextmenu", "groupdblclick".
     */
    eventPrefix: null,
    
    /**
     * @property {String}
     * Selector used to determine when to fire the event with the eventPrefix.
     */
    eventSelector: null,
    
    /**
     * @property {Ext.grid.View}
     * Reference to the grid view.
     */
    view: null,
    
    /**
     * @property {Ext.grid.GridPanel}
     * Reference to the grid panel
     */
    grid: null,
    
    
    /**
     * Most features will not modify the data returned to the view.
     * This is limited to one feature that manipulates the data per grid view.
     */
    collectData: false,
        
    getFeatureTpl: function() {
        return '';
    },
    
    /**
     * Approriate place to attach events to the view, selectionmodel, headerCt, etc
     */
    attachEvents: function() {
        
    },
    
    getTplFragments: function() {
        return;
    },
    
    /**
     * Allows a feature to mutate the metaRowTpl.
     * The array received as a single argument can be manipulated to add things
     * on the end/begining of a particular row.
     */
    mutateMetaRowTpl: function(metaRowTplArray) {
        
    },
    
    /**
     * Allows a feature to inject member methods into the metaRowTpl. This is
     * important for embedding functionality which will become part of the proper
     * row tpl.
     */
    getMetaRowTplFragments: function() {
        return {};
    },
    getTableFragments: function() {
        return {};
    },
    
    /**
     * Provide additional data to the prepareData call within the grid view.
     * @param {Object} data The data for this particular record.
     * @param {Number} idx The row index for this record.
     * @param {Ext.data.Model} record The record instance
     * @param {Object} orig The original result from the prepareData call to massage.
     */
    getAdditionalData: function(data, idx, record, orig) {
        return {};
    },
    
    /**
     * Enable a feature
     */
    enable: function() {
        this.disabled = false;
    },
    
    /**
     * Disable a feature
     */
    disable: function() {
        this.disabled = true;
    }
});