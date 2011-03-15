/**
 * @class Ext.grid.HeaderDropZone
 * @extends Ext.dd.DropZone
 * @private
 */
Ext.define('Ext.grid.HeaderDropZone', {
    extend: 'Ext.dd.DropZone',
    colHeaderCls: Ext.baseCSSPrefix + 'column-header',
    proxyOffsets: [-4, -9],
    
    constructor: function(headerCt){
        this.headerCt = headerCt;
        this.ddGroup = 'header-dd-zone-' + headerCt.id;   
        Ext.grid.HeaderDropZone.superclass.constructor.call(this, headerCt.el);
    },
    
    getTargetFromEvent : function(e){
        return e.getTarget('.' + this.colHeaderCls);
    },
    
    getTopIndicator: function() {
        if (!this.topIndicator) {
            this.topIndicator = Ext.core.DomHelper.append(Ext.getBody(), {
                cls: "col-move-top",
                html: "&#160;"
            }, true);
            this.topIndicator.hide = function(){
                this.setLeftTop(-100,-100);
                this.setStyle("visibility", "hidden");
            };
        }
        return this.topIndicator;
    },
    
    getBottomIndicator: function() {
        if (!this.bottomIndicator) {
            this.bottomIndicator = Ext.core.DomHelper.append(Ext.getBody(), {
                cls: "col-move-bottom",
                html: "&#160;"
            }, true);
            this.bottomIndicator.hide = function(){
                this.setLeftTop(-100,-100);
                this.setStyle("visibility", "hidden");
            };
        }
        return this.bottomIndicator;
    },
    
    getLocation: function(e, t) {
        var x      = e.getXY()[0],
            region = Ext.fly(t).getRegion(),
            pos, header;

        if ((region.right - x) <= (region.right - region.left) / 2) {
            pos = "after";
        } else {
            pos = "before";
        }
        return {
            pos: pos,
            header: Ext.getCmp(t.id),
            node: t
        };
    },

    positionIndicator: function(movedHeader, node, e){
        var location = this.getLocation(e, node),
            header = location.header,
            pos    = location.pos,
            // TODO: Must verify these are NOT hidden
            nextHd = Ext.getCmp(movedHeader.id).nextSibling('gridheader:not(gridheader[hidden])'),
            prevHd = Ext.getCmp(movedHeader.id).previousSibling('gridheader:not(gridheader[hidden])'),
            region, topIndicator, bottomIndicator, topAnchor, bottomAnchor,
            topXY, bottomXY, headerCtEl, minX, maxX;
            
        this.lastLocation = location;

        if ((movedHeader !== header) &&
            ((pos === "before" && nextHd !== header) ||
            (pos === "after" && prevHd !== header))) {
            this.valid = true;
            //console.log('move the header ', pos);
            topIndicator = this.getTopIndicator();
            bottomIndicator = this.getBottomIndicator();
            if (pos === 'before') {
                topAnchor = 'tl';
                bottomAnchor = 'bl';
            } else {
                topAnchor = 'tr';
                bottomAnchor = 'br';
            }
            topXY = header.el.getAnchorXY(topAnchor);
            bottomXY = header.el.getAnchorXY(bottomAnchor);
            
            // constrain the indicators to the viewable section
            headerCtEl = this.headerCt.el;
            minX = headerCtEl.getLeft();
            maxX = headerCtEl.getRight();
            
            topXY[0] = Ext.Number.constrain(topXY[0], minX, maxX);
            bottomXY[0] = Ext.Number.constrain(bottomXY[0], minX, maxX);
            
            
            // adjust by offsets, this is to center the arrows so that they point
            // at the split point
            topXY[0] -= 4;
            topXY[1] -= 9;
            bottomXY[0] -= 4;
            
            // position and show indicators
            topIndicator.setXY(topXY);
            bottomIndicator.setXY(bottomXY);
            topIndicator.show();
            bottomIndicator.show();
        // invalidate drop operation and hide indicators
        } else {
            this.invalidateDrop();
        }
    },
    
    invalidateDrop: function() {
        this.valid = false;
        this.getTopIndicator().hide();
        this.getBottomIndicator().hide();
    },
    
    onNodeOver: function(node, dragZone, e, data) {
        if (data.header != node) {
            this.positionIndicator(data.header, node, e);
        }
        return this.valid ? this.dropAllowed : this.dropNotAllowed;
    },
    
    onNodeOut: function() {
        this.getTopIndicator().hide();
        this.getBottomIndicator().hide();
    },

    onNodeDrop: function(node, dragZone, e, data) {
        if (this.valid) {
            this.invalidateDrop();
            var hd = data.header,
                lastLocation = this.lastLocation,
                items   = this.headerCt.items,
                fromIdx = items.indexOf(Ext.getCmp(hd.id)),
                toIdx   = items.indexOf(Ext.getCmp(lastLocation.header.id));
            if (lastLocation === 'after') {
                toIdx++;
            }
            this.headerCt.moveHeader(fromIdx, toIdx);
        }
    }
});