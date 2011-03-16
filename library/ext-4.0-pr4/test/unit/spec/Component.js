describe("Ext.Component", function() {
    var proto = Ext.Component.prototype,
        component, makeComponent;
    
    beforeEach(function() {
        makeComponent = function(config) {
            component = new Ext.Component(config || {});
        };
    });
    
    afterEach(function() {
        if (component) component.destroy();
        component = makeComponent = null;
    });
    
    it("should have a hideMode", function() {
        expect(proto.hideMode).toEqual('display');
    });
    
    it("should hideParent", function() {
        expect(proto.hideParent).toBeFalsy();
    });
    
    it("should have no bubbleEvents", function() {
        expect(proto.bubbleEvents).toEqual([]);
    });
    
    it("should have a actionMode", function() {
        expect(proto.actionMode).toEqual('el');
    });
    
    it("should have a monPropRe", function() {
        expect(proto.monPropRe).toBeDefined();
    });
    
    it("should have a renderTpl", function() {
        expect(proto.renderTpl).toBeDefined();
    });
    
    describe("afterRender", function() {
        var spy;

        describe("when pageX/pageY is set", function() {
            describe("call setPagePosition", function() {
                it("pageX", function() {
                    makeComponent({pageX:10});
                    
                    spy = spyOn(component, "setPagePosition");
                    
                    component.render(Ext.getBody());
                    
                    expect(spy).wasCalledWith(10, undefined);
                });
                
                it("pageY", function() {
                    makeComponent({pageY:10});
                    
                    spy = spyOn(component, "setPagePosition");
                    
                    component.render(Ext.getBody());
                    
                    expect(spy).wasCalledWith(undefined, 10);
                });
            });
        });
        
        describe("resizable/resizeable", function() {
            describe("should call initResizable", function() {
                it("resizable", function() {
                    makeComponent({resizable:true});
                    
                    spy = spyOn(component, "initResizable");
                    
                    component.render(Ext.getBody());
                    
                    expect(spy).wasCalled();
                });
                
                it("resizeable", function() {
                    makeComponent({resizeable:true});
                    
                    spy = spyOn(component, "initResizable");
                    
                    component.render(Ext.getBody());
                    
                    expect(spy).wasCalled();
                });
            });
        });
        
        describe("draggable", function() {
            it("should call initDraggable", function() {
                makeComponent({draggable:true});
                
                spy = spyOn(component, "initDraggable");
                
                component.render(Ext.getBody());
                
                expect(spy).wasCalled();
            });
        });
        
        describe("floating", function() {
            it("should call makeFloating", function() {
                makeComponent({floating:true});
                
                spy = spyOn(component, "makeFloating");
                
                component.render(Ext.getBody());
                
                expect(spy).wasCalledWith(true);
            });
        });
        
        it("should call setAutoScroll", function() {
            makeComponent();
            
            spy = spyOn(component, "setAutoScroll");
            
            component.render(Ext.getBody());
            
            expect(spy).wasCalled();
        });
        
        it("should call initAria", function() {
            makeComponent();
            
            spy = spyOn(component, "initAria");
            
            component.render(Ext.getBody());
            
            expect(spy).wasCalled();
        });
    });
    
    describe("initAria", function() {
        beforeEach(function() {
            makeComponent({renderTo: Ext.getBody()});
        });
        
        it("should set the role attribute of the el", function() {
            var actionEl = component.getActionEl();
            expect(actionEl.dom.getAttribute('role')).toEqual(component.ariaRole);
        });
    });
    
    describe("setAutoScroll", function() {
        var el;
        
        beforeEach(function() {
            makeComponent({renderTo: Ext.getBody()});
            el = component.getTargetEl();
        });
        
        afterEach(function() {
            el = null;
        });
        
        describe("true", function() {
            it("should set the overflow to auto", function() {
                component.setAutoScroll(true);
                expect(el.getStyle('overflow')).toEqual('auto');
            });
        });
        
        describe("false", function() {
            it("should not touch overflow", function() {
                component.setAutoScroll(false);
                expect(el.getStyle('overflow')).toEqual('visible');
            });
        });
    });
    
    describe("makeFloating", function() {
        beforeEach(function() {
            makeComponent({renderTo: Ext.getBody()});
        });
        
        it("should set floating", function() {
            expect(component.floating).toBeFalsy();
            
            component.makeFloating();
            
            expect(component.floating).toBeTruthy();
        });
    });
    
    describe("initResizer", function() {
        beforeEach(function() {
            makeComponent({renderTo: Ext.getBody()});
        });
        
        it("should create this.resizer", function() {
            expect(component.resizer).not.toBeDefined();
            
            component.initResizable();
            
            expect(component.resizer).toBeDefined();
        });
    });
    
    xdescribe("initDraggable", function() {
        
    });
    
    describe("setPosition", function() {
        beforeEach(function() {
            makeComponent({renderTo: Ext.getBody()});
        });
        
        describe("when arguments", function() {
            it("should set x", function() {
                component.setPosition(10, 0);
                
                expect(component.x).toEqual(10);
            });
            
            it("should set y", function() {
                component.setPosition(0, 10);
                
                expect(component.y).toEqual(10);
            });
        });
        
        describe("when array", function() {
            it("should set x", function() {
                component.setPosition([10, 0]);
                
                expect(component.x).toEqual(10);
            });
            
            it("should set y", function() {
                component.setPosition([0, 10]);
                
                expect(component.y).toEqual(10);
            });
        });
        
        describe("when rendered", function() {
            it("should call adjustPosition", function() {
                var spy = spyOn(component, "adjustPosition").andCallThrough();
                
                component.setPosition(10, 0);
                
                expect(spy).wasCalled();
            });
            
            it("should call onPosition", function() {
                var spy = spyOn(component, "onPosition");
                
                component.setPosition(10, 0);
                
                expect(spy).wasCalled();
            });
            
            it("should fire the move event", function() {
                var fired = false;
                
                component.on({move:function() {fired = true;}});
                
                component.setPosition(10, 0);
                
                expect(fired).toBeTruthy();
            });
        });
    });
    
    describe("showAt", function() {
        beforeEach(function() {
            makeComponent({renderTo: Ext.getBody()});
        });
        
        it("should call setPagePosition", function() {
            var spy = spyOn(component, "setPagePosition");
            
            component.showAt(10, 0);
            
            expect(spy).wasCalledWith(10, 0, undefined);
        });
        
        it("should call show", function() {
            var spy = spyOn(component, "show");
            
            component.showAt(10, 0);
            
            expect(spy).wasCalled();
        });
    });
    
    describe("setPagePosition", function() {
        beforeEach(function() {
            makeComponent({renderTo: Ext.getBody()});
        });
        
        describe("when arguments", function() {
            it("should set x", function() {
                component.setPagePosition(10, 0);
                
                expect(component.pageX).toEqual(10);
            });
            
            it("should set y", function() {
                component.setPagePosition(0, 10);
                
                expect(component.pageY).toEqual(10);
            });
        });
        
        describe("when array", function() {
            it("should set x", function() {
                component.setPagePosition([10, 0]);
                
                expect(component.pageX).toEqual(10);
            });
            
            it("should set y", function() {
                component.setPagePosition([0, 10]);
                
                expect(component.pageY).toEqual(10);
            });
        });

        it("should call setPosition", function() {
            var spy = spyOn(component, "setPosition");
            
            component.setPagePosition(10, 0);
            
            expect(spy).wasCalled();
        });
    });

    describe("Component traversal", function() {
        var cq = Ext.ComponentQuery,
            result, f1, f2, f3, fieldset, p = new Ext.Panel({
            layout: 'card',
            items: fieldset = new Ext.form.FieldSet({
                id: 'fieldset-1',
                items: [
                    f1 = new Ext.form.Number({
                        name: 'tab1-field1'
                    }),
                    f2 = new Ext.form.Date({
                        name: 'tab1-field2'
                    }),
                    f3 = new Ext.form.Text({
                        name: 'tab1-field3'
                    })
                ]
            })
        });

        describe("Component.prev()", function() {
            it("Should select f2", function() {
                result = f3.prev();
                expect(result).toEqual(f2);
            });
        });

        describe("Component.prev('selector')", function() {
            it("Should select f1", function() {
                result = f3.prev('numberfield');
                expect(result).toEqual(f1);
            });
        });

        describe("Component.prev() on first child", function() {
            it("Should select null", function() {
                result = f1.prev();
                expect(result).toBeNull();
            });
        });

        describe("Component.next()", function() {
            it("Should select f2", function() {
                result = f1.next();
                expect(result).toEqual(f2);
            });
        });

        describe("Component.next('selector')", function() {
            it("Should select f3", function() {
                result = f1.next('textfield(true)');
                expect(result).toEqual(f3);
            });
        });

        describe("Component.next() on last child", function() {
            it("Should select null", function() {
                result = f3.next();
                expect(result).toBeNull();
            });
        });

        describe("Component.up()", function() {
            it("Should select fieldset", function() {
                result = f3.up();
                expect(result).toEqual(fieldset);
            });
        });

        describe("Component.up('selector')", function() {
            it("Should select panel", function() {
                result = f3.up('panel');
                expect(result).toEqual(p);
            });
        });

        describe("Component.up() on outermost container", function() {
            it("Should select undefined", function() {
                result = p.up();
                expect(result).toBeUndefined();
            });
        });

        describe("Component.up('selector') on xtype which does not occur", function() {
            it("Should select undefined", function() {
                result = f3.up('gridpanel');
                expect(result).toBeUndefined();
            });
        });

        describe("Component.up(':pseudo-class')", function() {
            beforeEach(function() {
                cq.pseudos.cardLayout = function(items) {
                    var result = [], c, i = 0, l = items.length;
                    for (; i < l; i++) {
                        if ((c = items[i]).getLayout() instanceof Ext.layout.CardLayout) {
                            result.push(c);
                        }
                    }
                    return result;
                };
            });
            
            afterEach(function() {
                delete cq.pseudos.cardLayout;
            });
             
            it("Should select the panel", function() {
                result = f3.up(':cardLayout');
                expect(result).toEqual(p);
            });
        });
    });
});
