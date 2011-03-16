/**
 * @class Vimeo.List
 * @extends Ext.panel.Panel
 * 
 */
Ext.define("Vimeo.List", {
    extend: 'Ext.panel.Panel',
    alias: 'widget.videolist',

    singleSelect: true,
    
    initComponent: function() {
        Ext.apply(this, {
            layout: 'fit',
            
            items: [
                {
                    xtype: 'dataview',
                    store: 'Videos',
                    autoScroll: true,
                    overItemCls: 'x-view-over',
                    itemSelector: "div.video",
                    bubbleEvents: ['click'],
                    tpl: [
                        '<tpl for=".">',
                            '<div class="video">',
                                '<img src="{thumbnail_medium}" />',
                                '<h2>{title:ellipsis(30)}</h2>',
                                '<h3>{user_name}</h3>',
                            '</div>',
                        '</tpl>'
                    ]
                }
            ],
            
            dockedItems: [
                {
                    dock: 'left',
                    width: 200,
                    xtype: 'panel',
                    title: 'Tags',
                    layout: 'fit',
                    items: [
                        {
                            xtype: 'tagslist',
                            listeners: {
                                scope: this,
                                selectionchange: function(dataview, tags) {
                                    this.fireEvent('filterByTags', tags);
                                }
                            }
                        }
                    ]
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [
                        {
                            xtype: 'textfield',
                            name : 'search',
                            fieldLabel: "Filter",
                            labelWidth: 35,
                            width: 250,
                            listeners: {
                                scope : this,
                                change: function(field, newValue, oldValue) {
                                    if (oldValue != undefined) {
                                        this.fireEvent('filterByQuery', newValue);
                                    }
                                }
                            }
                        }
                    ]
                }
            ]
        });
        
        Vimeo.List.superclass.initComponent.apply(this, arguments);
    }
});
