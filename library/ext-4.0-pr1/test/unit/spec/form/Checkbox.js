describe("Ext.form.Checkbox", function() {
    var component, makeComponent;
    
    beforeEach(function() {
        makeComponent = function(config) {
            config = config || {};
            Ext.applyIf(config, {
                name: "test",
                renderTo: Ext.getBody()
            });
            component = new Ext.form.Checkbox(config);
        };
    });
    
    afterEach(function() {
        if (component) {
            component.destroy();
        }
        component = makeComponent = null;
    });



    it("should be registered with the 'checkboxfield' xtype", function() {
        component = Ext.create("Ext.form.Checkbox", {name: 'test'});
        expect(component instanceof Ext.form.Checkbox).toBe(true);
        expect(Ext.getClass(component).xtype).toBe("checkboxfield");
    });
    

    describe("defaults", function() {
        beforeEach(function() {
            makeComponent();
        });
        it("should have focusCls=''", function() {
            expect(component.focusCls).toEqual('');
        });
        it("should have fieldCls='x-form-field'", function() {
            expect(component.fieldCls).toEqual('x-form-field');
        });
        it("should have checked=false", function() {
            expect(component.checked).toBe(false);
        });
        it("should have inputValue='on'", function() {
            expect(component.inputValue).toEqual('on');
        });
    });


    describe("rendering", function() {
        // NOTE this doesn't test the main label, error icon, etc. just the parts specific to Checkbox.

        describe("bodyEl", function() {
            beforeEach(function() {
                makeComponent({value: 'foo'});
            });

            it("should exist", function() {
                expect(component.bodyEl).toBeDefined();
            });

            it("should be a child of the main component el", function() {
                expect(component.bodyEl.dom.parentNode).toBe(component.el.dom);
            });

            it("should be a div", function() {
                expect(component.bodyEl.dom.tagName.toLowerCase()).toEqual('div');
            });

            it("should have the class 'x-form-item-body'", function() {
                expect(component.bodyEl.hasCls('x-form-item-body')).toBe(true);
            });

            it("should have the id 'x-form-item-body-[inputId]'", function() {
                expect(component.bodyEl.dom.id).toEqual('x-form-item-body-' + component.inputId);
            });

            it("should have an aria role of 'presentation'", function() {
                expect(component.bodyEl.dom.getAttribute('role')).toEqual('presentation');
            });
        });

        describe("inputEl (checkbox element)", function() {
            beforeEach(function() {
                makeComponent({value: 'foo'});
            });

            it("should exist", function() {
                expect(component.inputEl).toBeDefined();
            });

            it("should be a child of the bodyEl", function() {
                expect(component.inputEl.dom.parentNode).toBe(component.bodyEl.dom);
            });

            it("should be an input element", function() {
                expect(component.inputEl.dom.tagName.toLowerCase()).toEqual('input');
            });

            it("should have type='checkbox'", function() {
                expect(component.inputEl.dom.tagName.toLowerCase()).toEqual('input');
            });

            it("should have the component's inputId as its id", function() {
                expect(component.inputEl.dom.id).toEqual(component.inputId);
            });

            it("should have the 'fieldCls' config as a class", function() {
                expect(component.inputEl.hasCls(component.fieldCls)).toBe(true);
            });
        });


        describe("box label", function() {
            it("should not be created by default", function() {
                makeComponent({});
                expect(component.bodyEl.child('label')).toBeNull();
            });

            it("should be created if the boxLabel config is defined", function() {
                makeComponent({boxLabel: 'the box label'});
                expect(component.bodyEl.child('label')).not.toBeNull();
            });

            it("should be a next-sibling of the checkbox", function() {
                makeComponent({boxLabel: 'the box label'});
                expect(component.bodyEl.child('label').prev().dom).toBe(component.inputEl.dom);
            });

            it("should have the class 'x-form-cb-label'", function() {
                makeComponent({boxLabel: 'the box label'});
                expect(component.bodyEl.child('label').hasCls('x-form-cb-label')).toBe(true);
            });

            it("should have a 'for' attribute set to the inputId", function() {
                makeComponent({boxLabel: 'the box label'});
                expect(component.bodyEl.child('label').getAttribute('for')).toEqual(component.inputId);
            });

            it("should contain the boxLabel as its inner text node", function() {
                makeComponent({boxLabel: 'the box label'});
                expect(component.bodyEl.child('label').dom.innerHTML).toEqual('the box label');
            });
        });
    });

    describe("setting value", function() {

        it("should accept the checked attribute", function(){
            makeComponent({
                checked: true
            });
            expect(component.getValue()).toBeTruthy();
            component.destroy();

            makeComponent();
            expect(component.getValue()).toBeFalsy();

        });

        it("should allow the value to be set while not rendered", function(){
            makeComponent({
                renderTo: null
            });
            component.setValue(true);
            component.render(Ext.getBody());
            expect(component.getValue()).toBeTruthy();
        });

        it("should support different values for setValue", function(){
            makeComponent();
            component.setValue('true');
            expect(component.getValue()).toBeTruthy();
            component.destroy();

            makeComponent();
            component.setValue('1');
            expect(component.getValue()).toBeTruthy();
            component.destroy();

            makeComponent();
            component.setValue('on');
            expect(component.getValue()).toBeTruthy();
            component.destroy();

            makeComponent({
                inputValue: 'foo'
            });
            component.setValue('foo');
            expect(component.getValue()).toBeTruthy();
            component.setValue('bar');
            expect(component.getValue()).toBeFalsy();
        });

        it("should fire the handler, with the correct scope", function(){
            var o1 = {
                fn: function(){}
            }, o2 = {},
            spy = spyOn(o1, 'fn');


            makeComponent({
                handler: o1.fn
            });
            component.setValue(true);
            expect(o1.fn).toHaveBeenCalledWith(component, true);
            expect(spy.calls[0].object).toEqual(component);
            component.destroy();

            makeComponent({
                handler: o1.fn,
                scope: o1
            });
            component.setValue(true);
            expect(o1.fn).toHaveBeenCalledWith(component, true);
            expect(spy.calls[1].object).toEqual(o1);
            component.destroy();

            makeComponent({
                handler: o1.fn,
                scope: o2
            });
            component.setValue(true);
            expect(o1.fn).toHaveBeenCalledWith(component, true);
            expect(spy.calls[2].object).toEqual(o2);
        });

        it("should not fire the handler if the value doesn't change", function() {
            makeComponent({
                handler: function() {}
            });
            spyOn(component, 'handler');
            component.setValue(false);
            expect(component.handler).not.toHaveBeenCalled();
        });
    });
});
