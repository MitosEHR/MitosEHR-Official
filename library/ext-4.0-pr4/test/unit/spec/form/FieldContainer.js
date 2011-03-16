describe("Ext.form.FieldContainer", function() {

    var component, makeComponent;

    beforeEach(function() {
        makeComponent = function(config) {
            config = config || {};
            component = new Ext.form.FieldContainer(config);
        };
    });

    afterEach(function() {
        if (component) {
            component.destroy();
            Ext.tip.QuickTips.destroy();
        }
        component = makeComponent = null;
    });



    describe('combineLabels', function() {
        it("should combine the labels of its sub-fields", function() {
            makeComponent({
                defaultType: 'textfield',
                combineLabels: true,
                items: [{fieldLabel: 'One'}, {fieldLabel: 'Two'}]
            });
            expect(component.getFieldLabel()).toEqual('One, Two');
        });

        it("should use the labelConnector to combine the labels", function() {
            makeComponent({
                defaultType: 'textfield',
                combineLabels: true,
                labelConnector: ' - ',
                items: [{fieldLabel: 'One'}, {fieldLabel: 'Two'}]
            });
            expect(component.getFieldLabel()).toEqual('One - Two');
        });

        it("should update the combined label when a field is added to the tree", function() {
            makeComponent({
                defaultType: 'textfield',
                combineLabels: true,
                items: [{fieldLabel: 'One'}, {fieldLabel: 'Two'}]
            });
            component.add({fieldLabel: 'Three'});
            expect(component.getFieldLabel()).toEqual('One, Two, Three');
        });

        it("should update the combined label when a field is removed from the tree", function() {
            makeComponent({
                defaultType: 'textfield',
                combineLabels: true,
                items: [{fieldLabel: 'One'}, {fieldLabel: 'Two'}, {fieldLabel: 'Three'}]
            });
            component.remove(component.items.getAt(1));
            expect(component.getFieldLabel()).toEqual('One, Three');
        });

        it("should use the fieldLabel config rather than combining", function() {
            makeComponent({
                defaultType: 'textfield',
                combineLabels: true,
                fieldLabel: 'Main Label',
                items: [{fieldLabel: 'One'}, {fieldLabel: 'Two'}]
            });
            expect(component.getFieldLabel()).toEqual('Main Label');
        });

        it("should not combine labels if combineLabels is false", function() {
            makeComponent({
                defaultType: 'textfield',
                combineLabels: false,
                items: [{fieldLabel: 'One'}, {fieldLabel: 'Two'}]
            });
            expect(component.getFieldLabel()).toEqual('');
        });
    });


    describe("combineErrors", function() {
        it("should display no error when there are no sub-field errors", function() {
            runs(function() {
                makeComponent({
                    renderTo: Ext.getBody(),
                    combineErrors: true,
                    defaultType: 'textfield',
                    items: [{fieldLabel: 'One'}, {fieldLabel: 'Two'}]
                });
            });
            waits(20);
            runs(function() {
                expect(component.errorEl.dom).hasHTML('');
            });
        });

        it("should display a combined error when there are sub-field errors", function() {
            runs(function() {
                makeComponent({
                    renderTo: Ext.getBody(),
                    combineErrors: true,
                    defaultType: 'textfield',
                    items: [{fieldLabel: 'One', allowBlank: false}, {fieldLabel: 'Two', allowBlank: false}]
                });
                component.items.getAt(0).validate();
                component.items.getAt(1).validate();
            });
            waitsFor(function() {
                return component.getActiveError().length > 0;
            }, 'population of errorEl');
            runs(function() {
                expect(component.getActiveError()).toEqual('One: This field is required<br>Two: This field is required');
            });
        });

        it("should remove the combined error when sub-field errors are removed", function() {
            runs(function() {
                makeComponent({
                    renderTo: Ext.getBody(),
                    combineErrors: true,
                    defaultType: 'textfield',
                    items: [{fieldLabel: 'One', allowBlank: false}, {fieldLabel: 'Two', allowBlank: false}]
                });
                component.items.getAt(0).validate();
                component.items.getAt(1).validate();
            });
            waitsFor(function() {
                return component.getActiveError().length > 0;
            }, 'population of errorEl');
            runs(function() {
                component.items.getAt(0).setValue('a');
                component.items.getAt(1).setValue('b');
            });
            waitsFor(function() {
                return component.getActiveError().length == 0;
            }, 'clearing of errorEl');
        });

        it("should not combine errors when combineErrors is false", function() {
            runs(function() {
                makeComponent({
                    renderTo: Ext.getBody(),
                    combineErrors: true,
                    defaultType: 'textfield',
                    items: [{fieldLabel: 'One'}, {fieldLabel: 'Two'}]
                });
                component.items.getAt(0).validate();
                component.items.getAt(1).validate();
            });
            waits(20);
            runs(function() {
                expect(component.errorEl.dom).hasHTML('');
            });
        });
    });

});