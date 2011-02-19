Ext.define('FrameSprite', {
    extend: 'Object',
    left: 1500,
    top: 100,
    height: 0,
    width: 0,
    stretchGradientY: 100,
    stretchGradientX: 14,
    
    constructor: function(config) {
        PageSlice.capture();
        Ext.apply(this, config);
        this.offsetX = this.left;
        this.offsetY = this.top;
    },
    
    addCorner: function(x, y, width, height) {
        PageSlice.copyPixels(x, y, width, height, this.left, this.offsetY);
        
        this.offsetY += height;
        this.height += height;
        this.width = Math.max(this.width, width);
    },
    
    addVerticalSide: function(x, y, width, height, stretchY, stretchX) {
        PageSlice.copyPixels(x, y, width, height, this.offsetX, this.top);  
        
        if (stretchY) {
            for (i = 1; i <= this.stretchGradientY; i++) {
                PageSlice.copyPixels(this.offsetX, this.offsetY + height - 1, width, 1, this.offsetX, this.top + height + i - 1);
            }
            height += this.stretchGradientY;
        }
        
        if (stretchX) {
            for (i = 1; i <= this.stretchGradientX; i++) {
                PageSlice.copyPixels(this.offsetX + width - 1, this.top, 1, height, this.offsetX + i, this.top);
            }
            width += this.stretchGradientX;            
        }
        
        this.offsetX += width;
        this.width += width;
        this.height = Math.max(this.height, height);
    },
    
    addHorizontalSide: function(x, y, width, height) {
        PageSlice.copyPixels(x, y, width, height, this.left, this.offsetY);
        this.offsetY += height;
        this.height += height;
        this.width = Math.max(this.width, width);
    },
    
    save: function(location) {
        PageSlice.save(this.left, this.top, this.width, this.height, location);
    }
});