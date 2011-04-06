/**
 * @class Ext.ux.DataViewDragSelector
 * @extends Object
 */
Ext.define('Ext.ux.DataViewDragSelector', {
    
    extend: 'Ext.util.Observable',
    
    requires: [
        'Ext.dd.DragTracker',
        'Ext.util.Region'
    ],
    

    // plugin initialization
    init: function(dataView) {
        this.view = dataView;
        this.mon(this.view, 'render', this.onRender, this);
    },
    
    // initialize the dragtracker 
    onRender: function(view) {
        this.tracker = new Ext.dd.DragTracker({
            onBeforeStart: Ext.Function.bind(this.onBeforeStart, this),
            onStart: Ext.Function.bind(this.onStart, this),
            onDrag: Ext.Function.bind(this.onDrag, this),
            onEnd: Ext.Function.bind(this.onEnd, this)
        });
        
        this.tracker.initEl(view.el);
    },
    
    // get region for all view items
    fillRegions: function() {
        var regions = this.regions = [];
        
        this.view.all.each(function(el){
            regions.push(el.getRegion());
        });
    },

    // start only if the first click is inside the view dom element
    onBeforeStart: function (e){
        if (!e.ctrlKey && !e.shiftKey) {
            this.view.getSelectionModel().deselectAll();
        }
        return !this.dragSafe || e.getTarget() === this.view.el.dom;
    },

    // show the drag selector element
    onStart: function(e){
        this.proxy = this.proxy || this.view.el.createChild({cls:'x-view-selector'});
        this.proxy.setDisplayed('block');
        this.fillRegions();
    },
    
    // set the size of drag selector element
    onDrag: function(e){
        var startXY = this.tracker.startXY,
            xy = this.tracker.getXY(),
            x = Math.min(startXY[0], xy[0]),
            y = Math.min(startXY[1], xy[1]),
            w = Math.abs(startXY[0] - xy[0]),
            h = Math.abs(startXY[1] - xy[1]),
            dragRegion = new Ext.util.Region(y, x + w, y + h, x),
            regions = this.regions,
            view = this.view,
            region, intersection, length, i;

        dragRegion.constrainTo(view.el.getRegion());

        this.proxy.setRegion(dragRegion);

        for(i = 0, length = regions.length; i < length; i++){
            region = regions[i];
            intersection = dragRegion.intersect(region);
            if(intersection && !region.selected){
                region.selected = true;
                view.getSelectionModel().select(i, true);
            } else if (!intersection && region.selected){
                region.selected = false;
                view.getSelectionModel().deselect(i);
            }
        }
    },
    // hide the drag selector element
    onEnd: function(e){    
        if(this.proxy){
            this.proxy.setDisplayed(false);
        }
        e.preventDefault();
    }
});