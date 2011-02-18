describe("Ext.slider.Tip", function() {
    var slider, tip, thumb0,
        createSlider = function(config) {
            tip = new Ext.slider.Tip();
            
            spyOn(tip, "show").andCallThrough();
            spyOn(tip, "update").andCallThrough();
            
            slider = new Ext.slider.Single(Ext.apply({
                renderTo: Ext.getBody(),
                name: "test",
                width: 205,
                labelWidth: 0,
                minValue: 0,
                maxValue: 100,
                plugins: [tip]
            }, config));

            thumb0 = slider.thumbs[0];
    };

    afterEach(function() {
        if (slider) {
            slider.destroy();
        }
        slider = null;
    });

    describe("when thumb is dragged", function() {
            var thumbXY, thumbSize, tipXY;
            beforeEach(function() {
                createSlider();
                var xy = thumb0.el.getXY();
                jasmine.fireMouseEvent(thumb0.el, 'mousedown', xy[0], xy[1]);
                jasmine.fireMouseEvent(thumb0.el, 'mousemove', xy[0] + 12, xy[1] + 5);
                tipXY = tip.el.getXY();
                thumbXY = thumb0.el.getXY();
                thumbSize = thumb0.el.getSize();
                jasmine.fireMouseEvent(thumb0.el, 'mouseup', xy[0] + 12, xy[1] + 5);
            });

            it("should show the tooltip", function() {
                expect(tip.show).toHaveBeenCalled();
            });
            
            it("should show the tooltip", function() {
                expect(tip.update).toHaveBeenCalledWith(tip.getText(thumb0));
            });

            it("should align the tip to t-b?", function() {
                expect(tipXY[0] >= thumbXY[0]).toBe(true);
                expect(tipXY[1] >= thumbXY[1]).toBe(true);
            });
            
    });
    
});