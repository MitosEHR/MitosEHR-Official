describe("Ext.form.Number", function() {
    var component, makeComponent;
    
    beforeEach(function() {
        makeComponent = function(config) {
            config = config || {};
            Ext.apply(config, {
                name: 'test'
            });
            component = new Ext.form.Number(config);
        };
    });

    afterEach(function() {
        if (component) {
            component.destroy();
        }
        component = makeComponent = null;
    });

    describe("defaults", function() {
        beforeEach(function() {
            makeComponent();
        });

        it("should have an inputType of 'text'", function() {
            expect(component.inputType).toEqual('text');
        });
        it("should have allowDecimals = true", function() {
            expect(component.allowDecimals).toBe(true);
        });
        it("should have decimalSeparator = '.'", function() {
            expect(component.decimalSeparator).toEqual('.');
        });
        it("should have decimalPrecision = 2", function() {
            expect(component.decimalPrecision).toEqual(2);
        });
        it("should have minValue = NEGATIVE_INFINITY", function() {
            expect(component.minValue).toEqual(Number.NEGATIVE_INFINITY);
        });
        it("should have maxValue = MAX_VALUE", function() {
            expect(component.maxValue).toEqual(Number.MAX_VALUE);
        });
        it("should have step = 1", function() {
            expect(component.step).toEqual(1);
        });
        it("should have minText = 'The minimum value for this field is {0}'", function() {
            expect(component.minText).toEqual('The minimum value for this field is {0}');
        });
        it("should have maxText = 'The maximum value for this field is {0}'", function() {
            expect(component.maxText).toEqual('The maximum value for this field is {0}');
        });
        it("should have nanText = '{0} is not a valid number'", function() {
            expect(component.nanText).toEqual('{0} is not a valid number');
        });
        it("should have negativeText = 'The value cannot be negative'", function() {
            expect(component.negativeText).toEqual('The value cannot be negative');
        });
        it("should have baseChars = '0123456789'", function() {
            expect(component.baseChars).toEqual('0123456789');
        });
        it("should have autoStripChars = false", function() {
            expect(component.autoStripChars).toBe(false);
        });

    });

    describe("setMinValue method", function() {
        beforeEach(function() {
            makeComponent({
                renderTo: Ext.getBody(),
                minValue: -10
            });
        });

        it("should set the minValue property to the argument", function() {
            component.setMinValue(-5);
            expect(component.minValue).toEqual(-5);
        });
        it("should default a non-numeric argument to NEGATIVE_INFINITY", function() {
            component.setMinValue('foobar');
            expect(component.minValue).toEqual(Number.NEGATIVE_INFINITY);
        });
    });
    
    describe("setMaxValue method", function() {
        beforeEach(function() {
            makeComponent({
                renderTo: Ext.getBody(),
                maxValue: 10
            });
        });

        it("should set the maxValue property to the argument", function() {
            component.setMaxValue(25);
            expect(component.maxValue).toEqual(25);
        });
        it("should default a non-numeric argument to MAX_VALUE", function() {
            component.setMaxValue('foobar');
            expect(component.maxValue).toEqual(Number.MAX_VALUE);
        });
    });

    describe("parsing invalid values", function(){
        
        it("should be null if configured with no value", function(){
            makeComponent();
            expect(component.getValue()).toBeNull();    
        });  
        
        it("should be null if configured with an invalid value", function(){
            makeComponent({
                value: "foo"
            });
            expect(component.getValue()).toBeNull();   
        });

        it("should set the field value to the parsed value on blur", function() {
            makeComponent({
                inputType: 'text', //forcing to text, otherwise chrome ignores the whole value if it contains non-numeric chars
                renderTo: Ext.getBody()
            });
            component.inputEl.dom.value = '15foo';
            component.beforeBlur();
            expect(component.inputEl.dom.value).toEqual('15');
        });
    });

    describe("respecting allowDecimals", function(){
        it("should round any decimals when allowDecimals is false", function(){
            makeComponent({
                allowDecimals: false
            });
            
            component.setValue(1.2345);
            expect(component.getValue()).toEqual(1);
            
            component.setValue(7.9);
            expect(component.getValue()).toEqual(8);
            
            component.setValue(2);
            expect(component.getValue()).toEqual(2); 
        });  
        
        it("should round any decimals when decimalPrecision is 0", function(){
            makeComponent({
                decimalPrecision: 0
            });  
            
            component.setValue(3.14);
            expect(component.getValue()).toEqual(3);  
            
            component.setValue(19);
            expect(component.getValue()).toEqual(19); 
        });
        
        it("should round values correctly", function(){
            makeComponent({
                decimalPrecision: 3
            });
            
            component.setValue(3.14159);
            expect(component.getValue()).toEqual(3.142);
            
            component.decimalPrecision = 1;
            component.setValue(1.94430194859);
            expect(component.getValue()).toEqual(1.9);
        });
    });
    
    describe("respecting decimalSeparator", function(){
        it("should parse values containing the separator", function(){
            makeComponent({
                decimalSeparator: ",",
                decimalPrecision: 2
            });
            
            component.setValue("1,3");
            expect(component.getValue()).toEqual(1.3);
        
            component.setValue(4);
            expect(component.getValue()).toEqual(4);
        
            component.setValue("1,728");
            expect(component.getValue()).toEqual(1.73);
        });
    });
    
    describe("validation", function(){
        it("should have an error when the number is outside the bounds", function(){
            makeComponent({
                minValue: 5,
                maxValue: 30
            });    
            
            expect(component.getErrors(3)).toContain("The minimum value for this field is 5");
            
            expect(component.getErrors(100)).toContain("The maximum value for this field is 30");
            
            expect(component.getErrors(7.2)).toEqual([]);
        });
        
        it("should have an error when the number is invalid", function(){
            makeComponent();
            
            expect(component.getErrors("foo")).toContain("foo is not a valid number");
            
            expect(component.getErrors(17).length).toEqual(0);
        });
        
        it("should have an error if the value is negative and minValue is 0", function(){
            makeComponent({
                minValue: 0
            }); 
            
            expect(component.getErrors(-3)).toContain("The value cannot be negative");
        });
    });

    describe("autoStripChars", function() {
        it("should remove non-numeric characters from the input's raw value", function() {
            makeComponent({
                autoStripChars: true,
                inputType: 'text', //forcing to text, since chrome doesn't allow setting non-numeric chars in number field
                renderTo: Ext.getBody()
            });
            component.inputEl.dom.value = '123abc45de';
            expect(component.getValue()).toEqual(12345);
        });
    });

    describe("spinner buttons", function() {
        describe("spin up", function() {
            beforeEach(function() {
                makeComponent({
                    renderTo: Ext.getBody(),
                    value: 5,
                    step: 2,
                    maxValue: 8
                });
            });
            it("should increment the value by the step config", function() {
                component.onSpinUp();
                expect(component.getValue()).toEqual(7);
            });
            it("should not increment past the maxValue", function() {
                component.onSpinUp();
                component.onSpinUp();
                expect(component.getValue()).toEqual(8);
                component.onSpinUp();
                expect(component.getValue()).toEqual(8);
            });
            it("should disable the up button when at the maxValue", function() {
                component.onSpinUp();
                expect(component.spinUpEnabled).toBe(true);
                component.onSpinUp();
                expect(component.spinUpEnabled).toBe(false);
            });
        });

        describe("spin down", function() {
            beforeEach(function() {
                makeComponent({
                    renderTo: Ext.getBody(),
                    value: 5,
                    step: 2,
                    minValue: 2
                });
            });
            it("should decrement the value by the step config", function() {
                component.onSpinDown();
                expect(component.getValue()).toEqual(3);
            });
            it("should not decrement past the minValue", function() {
                component.onSpinDown();
                component.onSpinDown();
                expect(component.getValue()).toEqual(2);
                component.onSpinDown();
                expect(component.getValue()).toEqual(2);
            });
            it("should disable the down button when at the minValue", function() {
                component.onSpinDown();
                expect(component.spinDownEnabled).toBe(true);
                component.onSpinDown();
                expect(component.spinDownEnabled).toBe(false);
            });
        });
    });
});
