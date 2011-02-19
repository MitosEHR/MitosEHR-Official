describe("Ext.form.Text", function() {
    var component, makeComponent, render;
    
    beforeEach(function() {
        makeComponent = function(config) {
            config = config || {};
            if (!config.name) {
                config.name = 'test';
            }
            component = new Ext.form.Text(config);
        };

        render = function(parent) {
            component.render(parent || Ext.getBody());
        };
    });
    
    afterEach(function() {
        if (component) {
            component.destroy();
        }
        /**
         * Need to clear out the shared reference here. Each time
         * the test resets the frame, the element gets removed from'
         * the DOM but the reference is never cleared in TextMetrics 
         * itself.
         */
        Ext.util.TextMetrics.shared = null;
        component = makeComponent = null;
    });




    it("should be registered as 'textfield' xtype", function() {
        component = Ext.create("Ext.form.Text", {name: 'test'});
        expect(component instanceof Ext.form.Text).toBe(true);
        expect(Ext.getClass(component).xtype).toBe("textfield");
    });

    describe("defaults", function() {
        beforeEach(function() {
            makeComponent();
        });

        it("should have inputType = 'text'", function() {
            expect(component.inputType).toEqual('text');
        });
        it("should have vtypeText = undefined", function() {
            expect(component.vtypeText).not.toBeDefined();
        });
        it("should have stripCharsRe = undefined", function() {
            expect(component.stripCharsRe).not.toBeDefined();
        });
        it("should have grow = falsy", function() {
            expect(component.grow).toBeFalsy();
        });
        it("should have growMin = 30", function() {
            expect(component.growMin).toEqual(30);
        });
        it("should have growMax = 800", function() {
            expect(component.growMax).toEqual(800);
        });
        it("should have vtype = undefined", function() {
            expect(component.vtype).not.toBeDefined();
        });
        it("should have maskRe = undefined", function() {
            expect(component.maskRe).not.toBeDefined();
        });
        it("should have disableKeyFilter = falsy", function() {
            expect(component.disableKeyFilter).toBeFalsy();
        });
        it("should have allowBlank = true", function() {
            expect(component.allowBlank).toBe(true);
        });
        it("should have minLength = 0", function() {
            expect(component.minLength).toEqual(0);
        });
        it("should have maxLength = MAX_VALUE", function() {
            expect(component.maxLength).toEqual(Number.MAX_VALUE);
        });
        it("should have enforceMaxLength = falsy", function() {
            expect(component.enforceMaxLength).toBeFalsy();
        });
        it("should have minLengthText = 'The minimum length for this field is {0}'", function() {
            expect(component.minLengthText).toEqual('The minimum length for this field is {0}');
        });
        it("should have maxLengthText = 'The maximum length for this field is {0}'", function() {
            expect(component.maxLengthText).toEqual('The maximum length for this field is {0}');
        });
        it("should have selectOnFocus = falsy", function() {
            expect(component.selectOnFocus).toBeFalsy();
        });
        it("should have blankText = 'This field is required'", function() {
            expect(component.blankText).toEqual('This field is required');
        });
        it("should have validator = undefined", function() {
            expect(component.vtypeText).not.toBeDefined();
        });
        it("should have regex = undefined", function() {
            expect(component.regex).not.toBeDefined();
        });
        it("should have regexText = ''", function() {
            expect(component.regexText).toEqual('');
        });
        it("should have emptyText = undefined", function() {
            expect(component.emptyText).not.toBeDefined();
        });
        it("should have emptyCls = 'x-form-empty-field'", function() {
            expect(component.emptyCls).toEqual('x-form-empty-field');
        });
        it("should have enableKeyEvents = falsy", function() {
            expect(component.enableKeyEvents).toBeFalsy();
        });
    });



    describe("rendering", function() {
        // NOTE this doesn't yet test the main label, error icon, etc. just the parts specific to Text.

        beforeEach(function() {
            makeComponent({
                name: 'fieldName',
                value: 'fieldValue',
                tabIndex: 5,
                size: 12,
                renderTo: Ext.getBody()
            });
        });

        describe("bodyEl", function() {
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

        describe("inputEl", function() {
            it("should be a child of the bodyEl", function() {
                expect(component.inputEl.dom.parentNode).toBe(component.bodyEl.dom);
            });

            it("should be an input element", function() {
                expect(component.inputEl.dom.tagName.toLowerCase()).toEqual('input');
            });

            it("should have type = the inputType config of the element", function() {
                expect(component.inputEl.dom.type).toEqual(component.inputType);
            });

            it("should have the component's inputId as its id", function() {
                expect(component.inputEl.dom.id).toEqual(component.inputId);
            });

            it("should have the 'fieldCls' config as a class", function() {
                expect(component.inputEl.hasCls(component.fieldCls)).toBe(true);
            });

            it("should have a class of 'x-form-[inputType]'", function() {
                expect(component.inputEl.hasCls('x-form-' + component.inputType)).toBe(true);
            });

            it("should have its name set to the 'name' config", function() {
                expect(component.inputEl.dom.name).toEqual('fieldName');
            });

            it("should have its value set to the 'value' config", function() {
                expect(component.inputEl.dom.value).toEqual('fieldValue');
            });

            it("should have autocomplete = 'off'", function() {
                expect(component.inputEl.dom.getAttribute('autocomplete')).toEqual('off');
            });

            it("should have tabindex set to the tabIndex config", function() {
                expect('' + component.inputEl.dom.getAttribute("tabIndex")).toEqual('5');
            });

            it("should have its size attribute set to the size config", function() {
                expect('' + component.inputEl.dom.getAttribute("size")).toEqual('12');
            });
        });
    });


    describe("readOnly", function() {
        describe("readOnly config", function() {
            it("should set the readonly attribute of the field when rendered", function() {
                makeComponent({
                    readOnly: true,
                    renderTo: Ext.getBody()
                });
                expect(component.inputEl.dom.readOnly).toBe(true);
            });
        });

        describe("setReadOnly method", function() {
            it("should set the readOnly state of the field immediately if rendered", function() {
                makeComponent({
                    renderTo: Ext.getBody()
                });
                component.setReadOnly(true);
                expect(component.inputEl.dom.readOnly).toBe(true);
            });

            it("should remember the value if the field has not yet been rendered", function() {
                makeComponent();
                component.setReadOnly(true);
                component.render(Ext.getBody());
                expect(component.inputEl.dom.readOnly).toBe(true);
            });
        });
    });

    
    describe("emptyText", function() {
        // NOTE emptyText is handled via the HTML5 'placeholder' attribute for those browsers which
        // support it, and the old modified-value method for other browsers, so the tests differ.

        if ('placeholder' in document.createElement('input')) { //ala Ext.supports.Placeholder
            it("should set the input's placeholder attribute", function() {
                makeComponent({
                    emptyText: 'empty',
                    renderTo: Ext.getBody()
                });
                expect(component.inputEl.dom.placeholder).toEqual('empty');
            });
        }
        else {
            describe("when the value is empty", function() {
                beforeEach(function() {
                    makeComponent({
                        emptyText: 'empty',
                        renderTo: Ext.getBody()
                    });
                });

                it("should set the input field's value to the emptyText", function() {
                    expect(component.inputEl.dom.value).toEqual('empty');
                });

                it("should add the emptyCls to the input element", function() {
                    expect(component.inputEl.hasCls(component.emptyCls)).toBe(true);
                });

                it("should return empty string from the value getters", function() {
                    expect(component.getValue()).toEqual('');
                    expect(component.getRawValue()).toEqual('');
                });
            });

            describe("when the value is not empty", function() {
                beforeEach(function() {
                    makeComponent({
                        emptyText: 'empty',
                        value: 'value',
                        renderTo: Ext.getBody()
                    });
                });

                it("should set the input field's value to the specified value", function() {
                    expect(component.inputEl.dom.value).toEqual('value');
                });

                it("should remove the emptyCls from the input element", function() {
                    expect(component.inputEl.hasCls(component.emptyCls)).toBe(false);
                });

                it("should return the value from the value getters", function() {
                    expect(component.getValue()).toEqual('value');
                    expect(component.getRawValue()).toEqual('value');
                });
            });

            // TODO check that the empty text is removed/added when focusing/blurring the field
        }
    });

    
    describe("validation", function(){
        describe("minLength", function(){
            it("should ignore minLength when allowBlank is set", function(){
                makeComponent({
                    minLength: 5,
                    allowBlank: true
                });
                expect(component.getErrors()).toEqual([]);
            });
        
            it("should have an error if the value is less than the minLength", function(){
                makeComponent({
                    minLength: 5,
                    allowBlank: false
                });    
                expect(component.getErrors()).toContain("The minimum length for this field is 5");
            });
        
            it("should not have an error if the value length exceeds minLength", function(){
                makeComponent({
                    minLength: 5,
                    allowBlank: false,
                    value: "more than 5"
                });    
                expect(component.getErrors()).toEqual([]);
            });    
        });
        
        describe("maxLength", function(){
            it("should have an error if the value is more than the maxLength", function(){
                makeComponent({
                    maxLength: 5,
                    value: "more than 5"
                });    
                expect(component.getErrors()).toContain("The maximum length for this field is 5");
            });
        
            it("should not have an error if the value length is less than the maxLength", function(){
                makeComponent({
                    maxLength: 5,
                    value: "foo"
                });    
                expect(component.getErrors()).toEqual([]);
            });
            
            it("should set the maxlength attribute when enforceMaxLength is used", function(){
                makeComponent({
                    maxLength: 5,
                    enforceMaxLength: true,
                    renderTo: Ext.getBody()
                });   
                expect(component.inputEl.dom.maxLength).toEqual(5);
            });
        });
        
        describe("allowBlank", function(){
            it("should have no errors if allowBlank is true and the field is empty", function(){
                makeComponent();
                expect(component.getErrors()).toEqual([]);    
            });
            
            it("should have no errors if allowBlank is false and the field is not empty", function(){
                makeComponent({
                    allowBlank: false,
                    value: "not empty"
                });
                expect(component.getErrors()).toEqual([]);    
            });
            
            it("should have an error if allowBlank is false and the field is empty", function(){
                makeComponent({
                    allowBlank: false
                });   
                expect(component.getErrors()).toContain("This field is required");   
            });
        });
        
        describe("regex", function(){
            it("should have an error if the value doesn't match the regex", function(){
                makeComponent({
                    value: "bar",
                    regex: /foo/,
                    regexText: "regex error"
                });
                expect(component.getErrors()).toContain("regex error");
            }); 
            
            it("should not have an error if the value matches the regex", function(){
                makeComponent({
                    regex: /foo/,
                    regexText: "foo"
                });
                expect(component.getErrors()).toEqual([]);
            }); 
        });
        
        describe("validator", function(){
            it("should have an error if the value doesn't match the validator", function(){
                makeComponent({
                    allowBlank: false,
                    validator: function(value){
                        return value == "foo" ? true : "error message";
                    },
                    value: "bar"    
                });  
                expect(component.getErrors()).toContain("error message");
            });  
            
            it("should not have an error if the value matches the validator", function(){
                makeComponent({
                    allowBlank: false,
                    validator: function(value){
                        return value == "foo" ? true : "error message";
                    },
                    value: "foo"    
                });  
                expect(component.getErrors()).toEqual([]);
            });
        });

        describe("invalid mark", function() {
            it("should set the 'aria-invalid' attribute to true", function() {
                makeComponent({
                    renderTo: Ext.getBody(),
                    allowBlank: false,
                    value: "foo"
                });
                expect(component.inputEl.dom.getAttribute('aria-invalid') + '').toEqual('false');
                component.setValue('');
                expect(component.inputEl.dom.getAttribute('aria-invalid') + '').toEqual('true');
            });
        });
    });


    describe("enableKeyEvents", function() {
        describe("enableKeyEvents=false", function() {
            beforeEach(function() {
                makeComponent({
                    enableKeyEvents: false,
                    renderTo: Ext.getBody()
                });
            });
            it("should not fire the keydown event", function() {
                var spy = jasmine.createSpy();
                component.on('keydown', spy);
                jasmine.fireKeyEvent(component.inputEl.dom, 'keydown');
                expect(spy).not.toHaveBeenCalled();
            });
            it("should not fire the keypress event", function() {
                var spy = jasmine.createSpy();
                component.on('keypress', spy);
                jasmine.fireKeyEvent(component.inputEl.dom, 'keypress');
                expect(spy).not.toHaveBeenCalled();
            });
            it("should not fire the keyup event", function() {
                var spy = jasmine.createSpy();
                component.on('keyup', spy);
                jasmine.fireKeyEvent(component.inputEl.dom, 'keyup');
                expect(spy).not.toHaveBeenCalled();
            });
        });
        describe("enableKeyEvents=true", function() {
            beforeEach(function() {
                makeComponent({
                    enableKeyEvents: true,
                    renderTo: Ext.getBody()
                });
            });
            it("should not fire the keydown event", function() {
                var spy = jasmine.createSpy();
                component.on('keydown', spy);
                jasmine.fireKeyEvent(component.inputEl.dom, 'keydown');
                expect(spy).toHaveBeenCalled();
            });
            it("should not fire the keypress event", function() {
                var spy = jasmine.createSpy();
                component.on('keypress', spy);
                jasmine.fireKeyEvent(component.inputEl.dom, 'keypress');
                expect(spy).toHaveBeenCalled();
            });
            it("should not fire the keyup event", function() {
                var spy = jasmine.createSpy();
                component.on('keyup', spy);
                jasmine.fireKeyEvent(component.inputEl.dom, 'keyup');
                expect(spy).toHaveBeenCalled();
            });
        });
    });


    describe("disable/enable", function() {
        describe("disabled config", function() {
            beforeEach(function() {
                makeComponent({
                    disabled: true,
                    renderTo: Ext.getBody()
                });
            });

            it("should set the input element's disabled property to true", function() {
                expect(component.inputEl.dom.disabled).toBe(true);
            });
            if (Ext.isIE) {
                it("should set the input element's unselectable property to 'on'", function() {
                    expect(component.inputEl.dom.unselectable).toEqual('on');
                });
            }
        });
        describe("disable method", function() {
            beforeEach(function() {
                makeComponent({
                    renderTo: Ext.getBody()
                });
                component.disable();
            });

            it("should set the input element's disabled property to true", function() {
                expect(component.inputEl.dom.disabled).toBe(true);
            });
            if (Ext.isIE) {
                it("should set the input element's unselectable property to 'on'", function() {
                    expect(component.inputEl.dom.unselectable).toEqual('on');
                });
            }
        });
        describe("enable method", function() {
            beforeEach(function() {
                makeComponent({
                    disabled: true,
                    renderTo: Ext.getBody()
                });
                component.enable();
            });

            it("should set the input element's disabled property to false", function() {
                expect(component.inputEl.dom.disabled).toBe(false);
            });
            if (Ext.isIE) {
                it("should set the input element's unselectable property to ''", function() {
                    expect(component.inputEl.dom.unselectable).toEqual('');
                });
            }
        });
    });



    describe("maskRe", function() {
        //TODO need a good way to test the cancellation of keypress events for masked chars
    });


    describe("stripCharsRe", function() {
        beforeEach(function() {
            makeComponent({
                stripCharsRe: /[B9]/gi,
                renderTo: Ext.getBody()
            });
            component.setRawValue('ab9 cB9d');
        });

        it("should remove characters matching the RE from the value that is returned", function() {
            expect(component.getValue()).toEqual('a cd');
        });

        it("should update the raw field value with the stripped value", function() {
            expect(component.inputEl.dom.value).toEqual('ab9 cB9d');
            component.getValue();
            expect(component.inputEl.dom.value).toEqual('a cd');
        });
    });


    describe("selectText method", function() {
        // utility to get the begin and end of the selection range across browsers
        function getSelectedText() {
            var el = component.inputEl.dom;
            return el.setSelectionRange ?
                   el.value.substring(el.selectionStart, el.selectionEnd) : //Standard
                   document.selection.createRange().text; //IE<9
        }

        beforeEach(function() {
            makeComponent({renderTo: Ext.getBody()});
        });

        it("should call the focus method if the field's value is empty", function() {
            spyOn(component, 'focus');
            component.selectText();
            expect(component.focus).toHaveBeenCalled();
        });
        it("should select the entire value by default", function() {
            component.setValue('field value');
            component.selectText();
            expect(getSelectedText()).toEqual('field value');
        });
        it("should select from the 'start' argument", function() {
            component.setValue('field value');
            component.selectText(3);
            expect(getSelectedText()).toEqual('ld value');
        });
        it("should select to the 'end' argument", function() {
            component.setValue('field value');
            component.selectText(3, 8);
            expect(getSelectedText()).toEqual('ld va');
        });
    });


    describe("autoSize method and grow configs", function() {
        beforeEach(function() {
            makeComponent({
                grow: true,
                growMin: 30,
                growMax: 100
            });
        });

        it("should be called after render", function() {
            var spy = spyOn(component, 'autoSize');
            component.render(Ext.getBody());
            expect(spy).toHaveBeenCalled();
        });

        it("should be called when the field's value is changed", function() {
            component.render(Ext.getBody());
            var spy = spyOn(component, 'autoSize');
            component.setValue('some other value');
            expect(spy).toHaveBeenCalled();
        });

        it("should increase the width of the input as the value becomes longer", function() {
            component.render(Ext.getBody());
            component.setValue('value A');
            var width1 = component.inputEl.getWidth();
            component.setValue('value AB');
            var width2 = component.inputEl.getWidth();
            expect(width2).toBeGreaterThan(width1);
        });

        it("should decrease the width of the input as the value becomes shorter", function() {
            component.render(Ext.getBody());
            component.setValue('value AB');
            var width1 = component.inputEl.getWidth();
            component.setValue('value A');
            var width2 = component.inputEl.getWidth();
            expect(width2).toBeLessThan(width1);
        });

        it("should not increase the width above the growMax config", function() {
            component.render(Ext.getBody());
            component.setValue('a really long value that would go above the growMax config');
            var width = component.inputEl.getWidth();
            expect(width).toEqual(100);
        });

        it("should not decrease the width below the growMin config", function() {
            component.render(Ext.getBody());
            component.setValue('.');
            var width = component.inputEl.getWidth();
            expect(width).toEqual(30);
        });
    });
});
