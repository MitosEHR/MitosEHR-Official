describe("Ext.form.CheckboxGroup", function() {

    var component, makeComponent;

    beforeEach(function() {
        makeComponent = function(config) {
            config = config || {};
            component = new Ext.form.CheckboxGroup(config);
        };
    });

    afterEach(function() {
        if (component) {
            component.destroy();
        }
        component = makeComponent = null;
    });


    it("should default descendant fields to hideLabel=true", function() {
        makeComponent({
            items: [{name: 'one'}, {name: 'two', hideLabel: false}]
        });
        expect(component.items.getAt(0).hideLabel).toBe(true);
        expect(component.items.getAt(1).hideLabel).toBe(false);
    });

    describe("initial value", function() {
        it("should set its originalValue to the aggregated value of its sub-checkboxes", function() {
            makeComponent({
                items: [
                    {name: 'one', checked: true},
                    {name: 'two', checked: true, inputValue: 'two-1'},
                    {name: 'two', checked: false, inputValue: 'two-2'},
                    {name: 'two', checked: true, inputValue: 'two-3'}
                ]
            });
            expect(component.originalValue).toEqual({one:'on', two: ['two-1', 'two-3']});
        });

        it("should set the values of its sub-checkboxes if the value config is specified", function() {
            makeComponent({
                items: [
                    {name: 'one', checked: true},
                    {name: 'two', checked: true, inputValue: 'two-1'},
                    {name: 'two', checked: false, inputValue: 'two-2'},
                    {name: 'two', checked: true, inputValue: 'two-3'}
                ],
                value: {two: ['two-1', 'two-2']}
            });
            expect(component.originalValue).toEqual({two: ['two-1', 'two-2']});
            expect(component.items.getAt(0).getValue()).toBe(false);
            expect(component.items.getAt(1).getValue()).toBe(true);
            expect(component.items.getAt(2).getValue()).toBe(true);
            expect(component.items.getAt(3).getValue()).toBe(false);
        });
    });

    it("should fire the change event when a sub-checkbox is changed", function() {
        makeComponent({
            items: [{name: 'foo', checked: true}]
        });
        var spy = jasmine.createSpy();
        component.on('change', spy);

        component.items.getAt(0).setValue(false);
        expect(spy.calls[0].args).toEqual([component, {}, {foo:'on'}, {}]);

        component.items.getAt(0).setValue(true);
        expect(spy.calls[1].args).toEqual([component, {foo:'on'}, {}, {}]);
    });

    describe("getValue", function() {
        it("should return an object with keys matching the names of checked items", function() {
            makeComponent({
                items: [{name: 'one', checked: true}, {name: 'two'}]
            });
            var val = component.getValue();
            expect(val.one).toBeDefined();
            expect(val.two).not.toBeDefined();
        });
        it("should give the inputValue of a single checked item with a given name", function() {
            makeComponent({
                items: [{name: 'one', checked: true, inputValue: 'foo'}, {name: 'two'}]
            });
            expect(component.getValue().one).toEqual('foo');
        });
        it("should give an array of inputValues of multiple checked items with the same name", function() {
            makeComponent({
                items: [{name: 'one', checked: true, inputValue: '1'}, {name: 'one', checked: true, inputValue: '2'}, {name: 'one'}]
            });
            expect(component.getValue().one).toEqual(['1', '2']);
        });
    });

    describe("getSubmitData", function() {
        it("should return null", function() {
            makeComponent({
                value: {foo: true},
                items: [{name: 'foo', inputValue: 'bar'}]
            });
            expect(component.getSubmitData()).toBeNull();
        });
    });

    describe("reset", function() {
        it("should reset each checkbox to its initial checked state", function() {
            makeComponent({
                items: [{name: 'one', checked: true}, {name: 'two'}, {name: 'three', checked: true}]
            });
            component.setValue({one: false, two: true});
            component.reset();
            expect(component.items.getAt(0).getValue()).toBe(true);
            expect(component.items.getAt(1).getValue()).toBe(false);
            expect(component.items.getAt(2).getValue()).toBe(true);
        });
    });

    describe("allowBlank = false", function() {
        it("should return a validation error when no sub-checkboxes are checked", function() {
            makeComponent({
                allowBlank: false,
                items: [{name: 'one'}]
            });
            expect(component.isValid()).toBe(false);
        });

        it("should not return an error when a sub-checkbox is checked", function() {
            makeComponent({
                allowBlank: false,
                items: [{name: 'one', checked: true}]
            });
            expect(component.isValid()).toBe(true);
        });
    });

});