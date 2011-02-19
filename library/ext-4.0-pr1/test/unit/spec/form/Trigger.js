describe("Ext.form.Trigger", function() {

    var component, makeComponent;

    beforeEach(function() {
        makeComponent = function(config) {
            config = config || {};
            Ext.applyIf(config, {
                name: 'test',
                width: 100
            });
            component = new Ext.form.Trigger(config);
        };
    });

    afterEach(function() {
        if (component) {
            component.destroy();
        }
        component = makeComponent = null;
    });

    /**
     * Utility to dispatch a click event to the given element
     */
    function clickOn(el) {
        var xy = Ext.fly(el).getXY();
        jasmine.fireMouseEvent(el, 'click', xy[0], xy[1]);
    }


    it("should be registered with xtype 'triggerfield'", function() {
        component = Ext.create("Ext.form.Trigger", {name: 'test'});
        expect(component instanceof Ext.form.Trigger).toBe(true);
        expect(Ext.getClass(component).xtype).toBe("triggerfield");
    });


    describe("defaults", function() {
        beforeEach(function() {
            makeComponent();
        });
        it("should have triggerCls = undefined", function() {
            expect(component.triggerCls).not.toBeDefined();
        });
        it("should have triggerBaseCls = 'x-form-trigger'", function() {
            expect(component.triggerBaseCls).toEqual('x-form-trigger');
        });
        it("should have wrapFocusCls = 'x-form-trigger-wrap-focus'", function() {
            expect(component.wrapFocusCls).toEqual('x-form-trigger-wrap-focus');
        });
        it("should have hideTrigger = false", function() {
            expect(component.hideTrigger).toBe(false);
        });
        it("should have editable = true", function() {
            expect(component.editable).toBe(true);
        });
        it("should have readOnly = false", function() {
            expect(component.readOnly).toBe(false);
        });
    });


    describe("rendering", function() {
        beforeEach(function() {
            makeComponent({
                triggerCls: 'my-triggerCls',
                renderTo: Ext.getBody()
            });
        });

        describe("triggerWrap", function() {
            it("should be defined", function() {
                expect(component.triggerWrap).toBeDefined();
            });
            it("should be a child of the bodyEl", function() {
                expect(component.triggerWrap.dom.parentNode === component.bodyEl.dom).toBe(true);
            });
            it("should have a class of 'x-form-trigger-wrap'", function() {
                expect(component.triggerWrap.hasCls('x-form-trigger-wrap')).toBe(true);
            });
        });

        describe("triggerEl", function() {
            it("should be defined", function() {
                expect(component.triggerEl).toBeDefined();
            });
            it("should be a CompositeElement", function() {
                expect(component.triggerEl instanceof Ext.CompositeElement).toBe(true);
            });
            it("should give the trigger a class of 'x-form-trigger'", function() {
                expect(component.triggerEl.first().hasCls('x-form-trigger')).toBe(true);
            });
            it("should give the trigger a class matching the 'triggerCls' config", function() {
                expect(component.triggerEl.first().hasCls('my-triggerCls')).toBe(true);
            });

            //TODO multiple triggers
        });
    });


    describe("onTriggerClick method", function() {
        var spy;

        beforeEach(function() {
            makeComponent({
                renderTo: Ext.getBody(),
                onTriggerClick: (spy = jasmine.createSpy())
            });
        });

        it("should be called when the trigger is clicked", function() {
            clickOn(component.triggerEl.first().dom);
            expect(spy).toHaveBeenCalled();
        });

        it("should be passed the Ext.EventObject for the click", function() {
            clickOn(component.triggerEl.first().dom);
            expect(spy.mostRecentCall.args[0].browserEvent).toBeDefined();
        });
    });


    describe("getTriggerWidth", function() {
        it("should return the total width of the triggerWrap", function() {
            makeComponent({
                renderTo: Ext.getBody()
            });
            expect(component.getTriggerWidth()).toEqual(component.triggerWrap.getWidth());
        });
    });


    describe("trigger hiding", function() {
        describe("hideTrigger config", function() {
            it("should hide the triggerWrap element when set to true", function() {
                makeComponent({
                    hideTrigger: true,
                    renderTo: Ext.getBody()
                });
                expect(component.triggerWrap.isVisible()).toBe(false);
            });
            it("should not hide the triggerWrap element when set to false", function() {
                makeComponent({
                    hideTrigger: false,
                    renderTo: Ext.getBody()
                });
                expect(component.triggerWrap.isVisible()).toBe(true);
            });
        });

        describe("setHideTrigger method", function() {
            it("should hide the triggerWrap element when passed true", function() {
                makeComponent({
                    hideTrigger: false,
                    renderTo: Ext.getBody()
                });
                component.setHideTrigger(true);
                expect(component.triggerWrap.isVisible()).toBe(false);
            });
            it("should unhide the triggerWrap element when passed false", function() {
                makeComponent({
                    hideTrigger: true,
                    renderTo: Ext.getBody()
                });
                component.setHideTrigger(false);
                expect(component.triggerWrap.isVisible()).toBe(true);
            });
        });
    });


    describe("editable", function() {
        describe("editable config", function() {
            it("should add the 'x-trigger-noedit' class to the input when set to false", function() {
                makeComponent({
                    renderTo: Ext.getBody(),
                    editable: false
                });
                expect(component.inputEl.hasCls('x-trigger-noedit')).toBe(true);
            });

            it("should set the input to readOnly when set to false", function() {
                makeComponent({
                    renderTo: Ext.getBody(),
                    editable: false
                });
                expect(component.inputEl.dom.readOnly + '').toEqual('true');
            });

            it("should not add the 'x-trigger-noedit' class to the input when set to true", function() {
                makeComponent({
                    renderTo: Ext.getBody(),
                    editable: true
                });
                expect(component.inputEl.hasCls('x-trigger-noedit')).toBe(false);
            });

            it("should not set the input to readOnly when set to true", function() {
                makeComponent({
                    renderTo: Ext.getBody(),
                    editable: true
                });
                expect(component.inputEl.dom.readOnly + '').toEqual('false');
            });
        });

        describe("setEditable method", function() {
            it("should add the 'x-trigger-noedit' class to the input when passed false", function() {
                makeComponent({
                    renderTo: Ext.getBody(),
                    editable: true
                });
                component.setEditable(false);
                expect(component.inputEl.hasCls('x-trigger-noedit')).toBe(true);
            });

            it("should set the input to readOnly when passed false", function() {
                makeComponent({
                    renderTo: Ext.getBody(),
                    editable: true
                });
                component.setEditable(false);
                expect(component.inputEl.dom.readOnly + '').toEqual('true');
            });

            it("should not add the 'x-trigger-noedit' class to the input when passed true", function() {
                makeComponent({
                    renderTo: Ext.getBody(),
                    editable: false
                });
                component.setEditable(true);
                expect(component.inputEl.hasCls('x-trigger-noedit')).toBe(false);
            });

            it("should not set the input to readOnly when passed true", function() {
                makeComponent({
                    renderTo: Ext.getBody(),
                    editable: false
                });
                component.setEditable(true);
                expect(component.inputEl.dom.readOnly + '').toEqual('false');
            });
        });
    });


    describe("readOnly", function() {
        describe("readOnly config", function() {
            it("should add the 'x-trigger-noedit' class to the input when set to true", function() {
                makeComponent({
                    renderTo: Ext.getBody(),
                    readOnly: true
                });
                expect(component.inputEl.hasCls('x-trigger-noedit')).toBe(true);
            });

            it("should set the input to readOnly when set to true", function() {
                makeComponent({
                    renderTo: Ext.getBody(),
                    readOnly: true
                });
                expect(component.inputEl.dom.readOnly + '').toEqual('true');
            });

            it("should not call the onTriggerClick method upon clicking the trigger, when set to true", function() {
                makeComponent({
                    renderTo: Ext.getBody(),
                    readOnly: true
                });
                var spy = spyOn(component, 'onTriggerClick');
                clickOn(component.triggerEl.first().dom);
                expect(spy).not.toHaveBeenCalled();
            });

            it("should not add the 'x-trigger-noedit' class to the input when set to false", function() {
                makeComponent({
                    renderTo: Ext.getBody(),
                    readOnly: false
                });
                expect(component.inputEl.hasCls('x-trigger-noedit')).toBe(false);
            });

            it("should not set the input to readOnly when set to false", function() {
                makeComponent({
                    renderTo: Ext.getBody(),
                    readOnly: false
                });
                expect(component.inputEl.dom.readOnly + '').toEqual('false');
            });

            it("should call the onTriggerClick method upon clicking the trigger, when set to false", function() {
                makeComponent({
                    renderTo: Ext.getBody(),
                    readOnly: false
                });
                var spy = spyOn(component, 'onTriggerClick');
                clickOn(component.triggerEl.first().dom);
                expect(spy).toHaveBeenCalled();
            });
        });

        describe("setReadOnly method", function() {
            it("should add the 'x-trigger-noedit' class to the input when passing true", function() {
                makeComponent({
                    renderTo: Ext.getBody(),
                    readOnly: false
                });
                component.setReadOnly(true);
                expect(component.inputEl.hasCls('x-trigger-noedit')).toBe(true);
            });

            it("should set the input to readOnly when passing true", function() {
                makeComponent({
                    renderTo: Ext.getBody(),
                    readOnly: false
                });
                component.setReadOnly(true);
                expect(component.inputEl.dom.readOnly + '').toEqual('true');
            });

            it("should not call the onTriggerClick method upon clicking the trigger, when passing true", function() {
                makeComponent({
                    renderTo: Ext.getBody(),
                    readOnly: false
                });
                var spy = spyOn(component, 'onTriggerClick');
                component.setReadOnly(true);
                clickOn(component.triggerEl.first().dom);
                expect(spy).not.toHaveBeenCalled();
            });

            it("should not add the 'x-trigger-noedit' class to the input when passing false", function() {
                makeComponent({
                    renderTo: Ext.getBody(),
                    readOnly: true
                });
                component.setReadOnly(false);
                expect(component.inputEl.hasCls('x-trigger-noedit')).toBe(false);
            });

            it("should not set the input to readOnly when passing false", function() {
                makeComponent({
                    renderTo: Ext.getBody(),
                    readOnly: true
                });
                component.setReadOnly(false);
                expect(component.inputEl.dom.readOnly + '').toEqual('false');
            });

            it("should call the onTriggerClick method upon clicking the trigger, when passing false", function() {
                makeComponent({
                    renderTo: Ext.getBody(),
                    readOnly: true
                });
                var spy = spyOn(component, 'onTriggerClick');
                component.setReadOnly(false);
                clickOn(component.triggerEl.first().dom);
                expect(spy).toHaveBeenCalled();
            });
        });
    });

});
