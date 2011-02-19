describe("Ext.slider.Thumb", function() {
    var slider, thumb, createSlider, createThumb;
    
    beforeEach(function() {
        createSlider = function(config) {
            slider = new Ext.slider.Multi(Ext.apply({
                renderTo: Ext.getBody(),
                name: "test",
                width: 219,
                labelWidth: 0,
                minValue: 0,
                maxValue: 100,
                animate: false
            }, config));
        };
        createThumb = function(config) {
            thumb = new Ext.slider.Thumb(config);
        };
    });
    
    afterEach(function() {
        if (slider) {
            slider.destroy();
        }
        slider = null;
        
        if (thumb) {
            thumb.destroy();
        }
        thumb = null;
    });
    
    describe("component initialization", function() {
        describe("if slider is vertical", function() {
            beforeEach(function() {
                createThumb({
                    slider: {
                        vertical: true
                    }
                });
            });
            
            specFor(Ext.slider.Thumb.Vertical, function(key, value) {
                it("should override " + key + " method", function() {
                    expect(thumb[key]).toBe(value);
                });
            });
        });
    });
    
    describe("thumb slide", function() {
        describe("horizontal", function() {
            var thumb0, thumb60, thumb90,
                setupSlider = function(config) {
                    createSlider(Ext.apply({
                        values: [0, 60, 90]
                    }, config));
                    
                    thumb0 = slider.thumbs[0];
                    thumb60 = slider.thumbs[1];
                    thumb90 = slider.thumbs[2];
                    
                    spyOn(slider, "fireEvent").andCallThrough();
                };
            
            describe("mouse events", function() {
                describe("on slider mousedown", function() {
                    describe("on thumb", function() {
                        describe("no drag (mousedown/mouseup)", function() {
                            beforeEach(function() {
                                setupSlider();
                                var xy = thumb0.el.getXY();
                                jasmine.fireMouseEvent(thumb0.el, 'mousedown', xy[0], xy[1]);
                                jasmine.fireMouseEvent(thumb0.el, 'mouseup', xy[0], xy[1]);
                            });

                            it("should not change the thumb value", function() {
                                expect(thumb0.value).toEqual(0);
                            });   
                        });

                        var dragConfig = {};
                        
                        dragConfig["drag without snapping"] = {
                            config: {},
                            expected: 3
                        };
                        
                        dragConfig["drag with snapping"] = {
                            config: {
                                increment: 5
                            },
                            expected: 5
                        };
                        
                        specFor(dragConfig, function(key, value) {
                           describe(key, function() {
                                beforeEach(function() {
                                    setupSlider(value.config);
                                    var xy = thumb0.el.getXY();
                                    jasmine.fireMouseEvent(thumb0.el, 'mousedown', xy[0], xy[1]);
                                    jasmine.fireMouseEvent(thumb0.el, 'mousemove', xy[0] + 12, xy[1]);
                                    jasmine.fireMouseEvent(thumb0.el, 'mouseup', xy[0] + 12, xy[1]);
                                });

                                it("should change the thumb value", function() {
                                    expect(thumb0.value).toEqual(value.expected);
                                });

                                describe("z-index", function() {
                                    it("should increase z-index of dragged thumb", function() {
                                        expect(thumb0.el.dom.style.zIndex).toBeGreaterThan(0);
                                    });

                                    it("should remove z-index of non-dragged thumb", function() {
                                        expect(thumb60.el.dom.style.zIndex).toBe("");
                                        expect(thumb90.el.dom.style.zIndex).toBe("");
                                    });
                                });
                            });
                        });
                    });

                    describe("outside thumbs", function() {
                        beforeEach(function() {
                            setupSlider();
                        });
                        
                        describe("if slider enabled", function() {
                            beforeEach(function() {
                                var xy = slider.innerEl.getXY();
                                jasmine.fireMouseEvent(slider.el, 'mousedown', xy[0] + 100, xy[1] + 10);
                                jasmine.fireMouseEvent(slider.el, 'mouseup', xy[0] + 100, xy[1] + 10);
                                jasmine.fireMouseEvent(slider.el, 'mouseclick', xy[0] + 100, xy[1] + 10);
                            });
                            
                            it("should change the thumb value", function() {
                                expect(thumb60.value).toEqual(50);
                            });
                        });
                        
                        describe("if slider disabled", function() {
                            beforeEach(function() {
                                slider.disable();
                                var xy = slider.innerEl.getXY();
                                jasmine.fireMouseEvent(slider.el, 'mousedown', xy[0] + 10, xy[1] + 10);
                            });

                            it("should not change the thumb value", function() {
                                expect(thumb0.value).toEqual(0);
                            });                        
                        });
                    });                    
                });
            });
        });

        describe("vertical", function() {
            var thumb0, thumb60, thumb90,
                setupSlider = function(config) {
                    createSlider(Ext.apply({
                        values: [0, 60, 90],
                        height: 214,
                        vertical: true
                    }, config));

                    thumb0 = slider.thumbs[0];
                    thumb60 = slider.thumbs[1];
                    thumb90 = slider.thumbs[2];
                    
                    spyOn(slider, "fireEvent").andCallThrough();
                };
            
            describe("mouse events", function() {
                describe("on slider mousedown", function() {
                    describe("on thumb", function() {
                        var dragConfig = {};
                        
                        dragConfig["drag without snapping"] = {
                            config: {},
                            expected: 54
                        };
                        
                        dragConfig["drag with snapping"] = {
                            config: {
                                increment: 10
                            },
                            expected: 50
                        };
                        
                        specFor(dragConfig, function(key, value) {
                           describe(key, function() {
                                beforeEach(function() {
                                    setupSlider(value.config);
                                    var xy = thumb0.el.getXY();
                                    jasmine.fireMouseEvent(thumb0.el, 'mousedown', xy[0], xy[1]);
                                    jasmine.fireMouseEvent(thumb0.el, 'mousemove', xy[0], xy[1] - 100);
                                    jasmine.fireMouseEvent(thumb0.el, 'mouseup', xy[0], xy[1] - 100);
                                });

                                it("should change the thumb value", function() {
                                    expect(thumb0.value).toEqual(value.expected);
                                });

                                describe("z-index", function() {
                                    it("should increase z-index of dragged thumb", function() {
                                        expect(thumb0.el.dom.style.zIndex).toBeGreaterThan(0);
                                    });

                                    it("should remove z-index of non-dragged thumb", function() {
                                        expect(thumb60.el.dom.style.zIndex).toBe("");
                                        expect(thumb90.el.dom.style.zIndex).toBe("");
                                    });
                                });
                            });
                        });
                    });
                    describe("outside thumbs", function() {
                        beforeEach(function() {
                            setupSlider();
                        });
                        
                        describe("if slider enabled", function() {
                            beforeEach(function() {
                                var xy = slider.innerEl.getXY();
                                jasmine.fireMouseEvent(slider.el, 'mousedown', xy[0] + 8 , xy[1] + 100);
                                jasmine.fireMouseEvent(slider.el, 'mouseup', xy[0] + 8, xy[1] + 100);
                                jasmine.fireMouseEvent(slider.el, 'click', xy[0] + 8, xy[1] + 100);
                            });
                            

                            it("should change the thumb value", function() {
                                expect(thumb60.value).toEqual(50);
                            });
                        });
                        
                        describe("if slider disabled", function() {
                            beforeEach(function() {
                                slider.disable();
                                var xy = slider.innerEl.getXY();
                                jasmine.fireMouseEvent(slider.el, 'mousedown', xy[0] + 10, xy[1] - 10);
                            });

                            it("should not change the thumb value", function() {
                                expect(thumb0.value).toEqual(0);
                            });                        
                        });
                    });
                });
            });
        });
    });
});