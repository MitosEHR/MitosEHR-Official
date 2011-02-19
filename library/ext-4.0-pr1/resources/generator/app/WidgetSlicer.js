Ext.define('WidgetSlicer', {
    mixins: {
        observable: 'Ext.util.Observable'
    },
    
    constructor: function(config) {
        this.mixins.observable.constructor.apply(this, arguments);
        this.render();

        Slicer.on('slice', this.onSlice, this);
    },
    
    onSlice : function(slicer) {
        var sprite = new FrameSprite({
                radius: this.frameWidth
            }),
            widget = this.widget,
            box = this.box,
            width = this.frameWidth,
            borders = this.borders,
            height = width,
            verticalHeight = box.height - (height ? (height * 2) : (borders.top + borders.bottom)),
            location = (this.record.data.folder || widget.baseCls.replace(Ext.baseCSSPrefix, '')) + '/' + (this.record.data.filename || widget.baseCls.replace(Ext.baseCSSPrefix, '') + '-' + widget.ui);

        if (this.frameWidth) {
            sprite.addHorizontalSide(box.x + width, box.y              , width, height);
            sprite.addHorizontalSide(box.x + width, box.bottom - height, width, height);

            sprite.addCorner(box.x            , box.y             , width, height);
            sprite.addCorner(box.right - width, box.y             , width, height);
            sprite.addCorner(box.x            , box.bottom - width, width, height);
            sprite.addCorner(box.right - width, box.bottom - width, width, height);

            PageSlice.log('Saving sprite ' + location + '-corners');
            sprite.save(location + '-corners.png');

            sprite = new FrameSprite({
                radius: this.frameWidth
            });

            sprite.addVerticalSide(box.x            , box.y      + width, width, verticalHeight, !!this.gradient);
            sprite.addVerticalSide(box.right - width, box.y      + width, width, verticalHeight, !!this.gradient);

            PageSlice.log('Saving sprite ' + location + '-sides');
            sprite.save(location + '-sides.png');            
        }
        
        if (this.gradient) {
            sprite = new FrameSprite({
                radius: 1
            });

            sprite.addVerticalSide(box.x + (width || borders.left), box.y + (height || borders.top), 1, verticalHeight, true, true);

            PageSlice.log('Saving sprite ' + location + '-bg');
            sprite.save(location + '-bg.png');            
        }
    },
    
    render : function() {
        var record = this.record,
            data = this.record.data,
            config = data.config,
            widget, ct, el;
        
        delete data.config;        
        config = Ext.apply({}, config, data);
        widget = Ext.create(config.xtype, config);

        ct = Ext.fly(document.body).createChild({
            tag: 'div',
            cls: 'widget-container',
            style: 'position: relative; overflow: visible;'
        });
        
        if (config.setup) {
            config.setup.call(widget, widget, ct);
        }
        else {
            widget.render(ct);
        }
        
        this.widget = widget;
        this.config = config;
        
        if (config.delegate) {
            el = widget.el;
        }
        else {
            el = widget.el;
        }
        
        this.radius = [
            parseInt(el.getStyle('border-top-left-radius'), 10),
            parseInt(el.getStyle('border-top-right-radius'), 10),
            parseInt(el.getStyle('border-bottom-right-radius'), 10),
            parseInt(el.getStyle('border-bottom-left-radius'), 10)
        ];

        this.gradient = (el.getStyle('background-image').indexOf('-gradient') !== -1);
        
        this.borders = {
            top:    el.getBorderWidth('t'),
            right:  el.getBorderWidth('r'),
            bottom: el.getBorderWidth('b'),
            left:   el.getBorderWidth('l')
        };
        
        this.frameWidth = Math.max(this.radius[0], this.radius[1], this.radius[2], this.radius[3]);

        this.radius = {
            tl: this.radius[0],
            tr: this.radius[1],
            br: this.radius[2],
            bl: this.radius[3]
        };
        
        this.box = el.getBox();
        return widget;
    }
});