describe("Ext.form.Display", function() {

    var component,
        makeComponent;

    beforeEach(function() {
        makeComponent = function(config) {
            config = config || {};
            if (!config.name) {
                config.name = 'fieldname';
            }
            if (!config.renderTo) {
                config.renderTo = Ext.getBody();
            }
            component = new Ext.form.Display(config);
        };
    });

    afterEach(function() {
        if (component && component.destroy) {
            component.destroy();
        }
        component = null;
    });



    it("should be registered as xtype 'displayfield'", function() {
        component = Ext.create("Ext.form.Display", {name: 'test'});
        expect(component instanceof Ext.form.Display).toBe(true);
        expect(Ext.getClass(component).xtype).toBe("displayfield");
    });

    describe("defaults", function() {
        beforeEach(function() {
            makeComponent();
        });

        it("should have a fieldCls of 'x-form-display-field'", function() {
            expect(component.fieldCls).toEqual('x-form-display-field');
        });

        it("should have htmlEncode set to false", function() {
            expect(component.htmlEncode).toBeFalsy();
        });
    });

    describe("rendering", function() {
        // NOTE this doesn't test the label, error icon, etc. just the parts specific to Display.

        beforeEach(function() {
            makeComponent({value: 'foo'});
        });

        describe("bodyEl", function() {
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

            it("should have the id 'x-form-item-body-[generated_id]'", function() {
                expect(component.bodyEl.dom.id.indexOf('x-form-item-body-')).toEqual(0);
            });
        });

        describe("inputEl", function() {
            it("should exist", function() {
                expect(component.inputEl).toBeDefined();
            });

            it("should be a child of the bodyEl", function() {
                expect(component.inputEl.dom.parentNode).toBe(component.bodyEl.dom);
            });

            it("should be a div", function() {
                expect(component.inputEl.dom.tagName.toLowerCase()).toEqual('div');
            });

            it("should have the 'fieldCls' config as a class", function() {
                expect(component.inputEl.hasCls(component.fieldCls)).toBe(true);
            });

            it("should have the field value as its innerHTML", function() {
                expect(component.inputEl.dom.innerHTML).toEqual(component.value);
            });
        });
    });

    describe("validation", function() {
        beforeEach(function() {
            makeComponent();
        });

        it("should always return true from the validate method", function() {
            expect(component.validate()).toBe(true);
        });

        it("should always return true from the isValid method", function() {
            expect(component.isValid()).toBe(true);
        });
    });

    describe("value getters", function() {
        describe("getValue", function() {
            it("should return the field's value", function() {
                makeComponent({value: 'the field value'});
                expect(component.getValue()).toEqual('the field value');
            });

            it("should return the same value when htmlEncode is true", function() {
                makeComponent({value: '<p>the field value</p>', htmlEncode: true});
                expect(component.getValue()).toEqual('<p>the field value</p>');
            });
        });
        describe("getRawValue", function() {
            it("should return the field's value", function() {
                makeComponent({value: 'the field value'});
                expect(component.getRawValue()).toEqual('the field value');
            });

            it("should return the same value when htmlEncode is true", function() {
                makeComponent({value: '<p>the field value</p>', htmlEncode: true});
                expect(component.getRawValue()).toEqual('<p>the field value</p>');
            });
        });
        describe("getSubmitValue", function() {
            it("should return null", function() {
                makeComponent({value: 'the field value'});
                expect(component.getSubmitValue()).toBeNull();
            });
        });
    });

    describe("setting value", function() {
        describe("setRawValue", function() {
            it("should set the inputEl's innerHTML to the specified value", function() {
                makeComponent({value: 'the field value'});
                component.setRawValue('the new value');
                expect(component.inputEl.dom.innerHTML).toEqual('the new value');
            });

            it("should not html-encode the value by default", function() {
                makeComponent({value: 'the field value'});
                component.setRawValue('<p>the new value</p>');
                expect(component.inputEl.dom.innerHTML).toEqual(Ext.isIE ? '<P>the new value</P>' : '<p>the new value</p>');
            });

            it("should html-encode the value when htmlEncode config is true", function() {
                makeComponent({value: 'the field value', htmlEncode: true});
                component.setRawValue('<p>the new value</p>');
                expect(component.inputEl.dom.innerHTML).toEqual('&lt;p&gt;the new value&lt;/p&gt;');
            });
        });

        describe("setValue", function() {
            it("should set the inputEl's innerHTML to the specified value", function() {
                makeComponent({value: 'the field value'});
                component.setValue('the new value');
                expect(component.inputEl.dom.innerHTML).toEqual('the new value');
            });

            it("should not html-encode the value by default", function() {
                makeComponent({value: 'the field value'});
                component.setValue('<p>the new value</p>');
                expect(component.inputEl.dom.innerHTML).toEqual(Ext.isIE ? '<P>the new value</P>' : '<p>the new value</p>');
            });

            it("should html-encode the value when htmlEncode config is true", function() {
                makeComponent({value: 'the field value', htmlEncode: true});
                component.setValue('<p>the new value</p>');
                expect(component.inputEl.dom.innerHTML).toEqual('&lt;p&gt;the new value&lt;/p&gt;');
            });
        });

    });

});
