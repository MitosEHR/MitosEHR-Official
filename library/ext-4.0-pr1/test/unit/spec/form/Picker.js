describe("Ext.form.Picker", function() {

    var component, makeComponent;

    beforeEach(function() {
        makeComponent = function(config) {
            config = config || {};
            Ext.applyIf(config, {
                name: 'test',
                width: 300,
                // simple implementation
                createPicker: function() {
                    return new Ext.Component({
                        hidden: true,
                        renderTo: Ext.getBody(),
                        floating: true,
                        html: 'foo'
                    })
                }
            });
            component = new Ext.form.Picker(config);
        };
    });

    afterEach(function() {
        if (component) {
            component.destroy();
        }
        component = makeComponent = null;
    });

    function clickTrigger() {
        var trigger = component.triggerEl.first(),
            xy = trigger.getXY();
        jasmine.fireMouseEvent(trigger.dom, 'click', xy[0], xy[1]);
    }



    describe("defaults", function() {
        beforeEach(function() {
            makeComponent();
        });
        it("should have matchFieldWidth = true", function() {
            expect(component.matchFieldWidth).toBe(true);
        });
        it("should have pickerAlign = 'tl-bl?'", function() {
            expect(component.pickerAlign).toEqual('tl-bl?');
        });
        it("should have pickerOffset = undefined", function() {
            expect(component.pickerOffset).not.toBeDefined();
        });
    });


    describe("expand", function() {
        it("should create the picker component", function() {
            makeComponent({
                renderTo: Ext.getBody()
            });
            expect(component.picker).not.toBeDefined();
            component.expand();
            expect(component.picker).toBeDefined();
            expect(component.picker instanceof Ext.Component).toBe(true);
        });

        it("should show the picker component", function() {
            makeComponent({
                renderTo: Ext.getBody()
            });
            component.expand();
            expect(component.picker.hidden).toBe(false);
        });

        it("should align the picker to the field", function() {
            makeComponent({
                renderTo: Ext.getBody()
            });
            component.expand();
            expect(component.picker.el.getX()).toEqual(component.bodyEl.getX());
        });

        it("should set the picker's width to the width of the field", function() {
            makeComponent({
                renderTo: Ext.getBody()
            });
            component.expand();
            expect(component.picker.getWidth()).toEqual(component.bodyEl.getWidth());
        });

        it("should not set the picker's width if matchFieldWidth is false", function() {
            makeComponent({
                renderTo: Ext.getBody(),
                matchFieldWidth: false
            });
            component.expand();
            expect(component.picker.getWidth()).not.toEqual(component.inputEl.getWidth());
        });

        it("should fire the 'expand' event", function() {
            makeComponent({
                renderTo: Ext.getBody()
            });
            var spy = jasmine.createSpy();
            component.on('expand', spy);
            component.expand();
            expect(spy).toHaveBeenCalledWith(component, {});
        });

        it("should call the onExpand method", function() {
            makeComponent({
                renderTo: Ext.getBody(),
                onExpand: jasmine.createSpy()
            });
            component.expand();
            expect(component.onExpand).toHaveBeenCalledWith();
        });

        // TODO
        xit("should monitor mousedown events on the document", function() { });
        xit("should monitor mousewheel events on the document", function() { });
    });


    describe("collapse", function() {
        beforeEach(function() {
            makeComponent({
                renderTo: Ext.getBody()
            });
            component.expand();
        });

        it("should hide the picker component", function() {
            component.collapse();
            expect(component.picker.hidden).toBe(true);
        });

        it("should fire the 'collapse' event", function() {
            var spy = jasmine.createSpy();
            component.on('collapse', spy);
            component.collapse();
            expect(spy).toHaveBeenCalledWith(component, {});
        });

        it("should call the onCollapse method", function() {
            spyOn(component, 'onCollapse');
            component.collapse();
            expect(component.onCollapse).toHaveBeenCalledWith();
        });

        // TODO
        xit("should stop monitoring mousedown events on the document", function() { });
        xit("should stop monitoring mousewheel events on the document", function() { });
    });


    describe("trigger click", function() {
        beforeEach(function() {
            makeComponent({
                renderTo: Ext.getBody()
            });
        });

        it("should expand the picker if not already expanded", function() {
            spyOn(component, 'expand');
            clickTrigger();
            expect(component.expand).toHaveBeenCalled();
        });

        it("should collapse the picker if already expanded", function() {
            component.expand();
            spyOn(component, 'collapse');
            clickTrigger();
            expect(component.collapse).toHaveBeenCalled();
        });

        it("should focus the field", function() {
            var spy = spyOn(component.inputEl, 'focus');
            clickTrigger();
            expect(spy).toHaveBeenCalled();
        });

        it("should do nothing if the field is readOnly", function() {
            component.setReadOnly(true);
            spyOn(component, 'expand');
            clickTrigger();
            expect(component.expand).not.toHaveBeenCalled();
        });

        it("should do nothing if the field is disabled", function() {
            component.setDisabled(true);
            spyOn(component, 'expand');
            clickTrigger();
            expect(component.expand).not.toHaveBeenCalled();
        });
    });

    describe("keyboard access", function() {
        beforeEach(function() {
            makeComponent({
                renderTo: Ext.getBody()
            });
        });

        function fireKey(key) {
            jasmine.fireKeyEvent(component.inputEl, 'keydown', key);
            jasmine.fireKeyEvent(component.inputEl, 'keypress', key);
        }

        it("should invoke the trigger click when the down key is pressed", function() {
            makeComponent({
                renderTo: Ext.getBody(),
                onTriggerClick: jasmine.createSpy()
            });
            fireKey(40);
            expect(component.onTriggerClick).toHaveBeenCalled();
        });

        it("should collapse the picker when the escape key is pressed", function() {
            makeComponent({
                renderTo: Ext.getBody(),
                collapse: jasmine.createSpy()
            });
            fireKey(27);
            expect(component.collapse).toHaveBeenCalled();
        });
    });

});