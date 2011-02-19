describe("Ext.form.Basic", function() {

    var basicForm,
        container,
        currentActionInstance,
        mockActionCtorSpy,
        itemId = 0;


    /**
     * Mock object that mimics the basic API of a field.
     */
    var MockField = Ext.extend(Ext.util.Observable, {
        isFormField: true,
        valid: true,
        dirty: false,
        constructor: function(config) {
            if (config) {
                Ext.apply(this, config);
            }
            this.itemId = itemId++;
            this.addEvents('validitychange', 'dirtychange');
        },
        getItemId: function() {
            return this.itemId;
        },
        isValid: function() {
            return this.valid;
        },
        isDirty: function() {
            return this.dirty;
        },
        setValue: function(v) {
            this.value = v;
            return this;
        },
        getValue: function() {
            return this.value;
        },
        getSubmitValue: function() {
            return this.value;
        },
        getName: function() {
            return this.name;
        },
        reset: Ext.emptyFn,
        markInvalid: Ext.emptyFn,
        clearInvalid: Ext.emptyFn,
        onRemoved: Ext.emptyFn,
        destroy: Ext.emptyFn
    });


    Ext.define('MockAction', {
        alias: 'formaction.mock',
        constructor: function() {
            currentActionInstance = this;

            // allow spying on the constructor
            if (mockActionCtorSpy) {
                mockActionCtorSpy.apply(this, arguments);
            }
        },
        run: Ext.emptyFn
    });



    /**
     * Utility to add a MockField object to the container
     */
    function addField(config) {
        // add directly to the container's items collection instead of calling the add method,
        // to avoid creating a real component out of the MockField
        var field = container.items.add(new MockField(config));
        field.ownerCt = container;
        container.fireEvent('add', container, field, -1);
        return field;
    }


    /**
     * For each test create a container and bind a BasicForm instance to it.
     */
    beforeEach(function() {
        container = new Ext.container.Container({});
        basicForm = new Ext.form.Basic(container);
    });

    /**
     * Cleanup
     */
    afterEach(function() {
        container.destroy();
        basicForm = container = currentActionInstance = undefined;
    });




    /*========== SPECS ==========*/

    describe("paramOrder normalization", function() {
        var paramOrderArray = ['one', 'two', 'three'];

        it("should accept paramOrder config as an array", function() {
            var form = new Ext.form.Basic(container, { paramOrder: paramOrderArray });
            expect(form.paramOrder).toEqual(paramOrderArray);
        });
        it("should accept paramOrder config as a comma-separated string and normalize it to an array", function() {
            var form = new Ext.form.Basic(container, { paramOrder: 'one,two,three' });
            expect(form.paramOrder).toEqual(paramOrderArray);
        });
        it("should accept paramOrder config as a space-separated string and normalize it to an array", function() {
            var form = new Ext.form.Basic(container, { paramOrder: 'one two three' });
            expect(form.paramOrder).toEqual(paramOrderArray);
        });
        it("should accept paramOrder config as a pipe-separated string and normalize it to an array", function() {
            var form = new Ext.form.Basic(container, { paramOrder: 'one|two|three' });
            expect(form.paramOrder).toEqual(paramOrderArray);
        });
    });


    describe("getFields", function() {
        beforeEach(function() {
            addField({name: 'one'});
            addField({name: 'two'});
        });

        it("should return all field objects within the owner", function() {
            var fields = basicForm.getFields();
            expect(fields.length).toEqual(2);
            expect(fields.getAt(0).name).toEqual('one');
            expect(fields.getAt(1).name).toEqual('two');
        });

        it("should cache the list of fields after first access", function() {
            var fields1 = basicForm.getFields(),
                fields2 = basicForm.getFields();
            expect(fields2).toBe(fields1);
        });

        it("should requery the list when a field is added", function() {
            var fields1 = basicForm.getFields();
            addField({name: 'three'});
            var fields2 = basicForm.getFields();
            expect(fields2).not.toBe(fields1);
            expect(fields2.length).toEqual(3);
            expect(fields2.getAt(2).name).toEqual('three');
            expect(basicForm.getFields()).toBe(fields2);
        });

        it("should requery the list when a field is removed", function() {
            var fields1 = basicForm.getFields();
            container.remove(container.items.getAt(0));
            var fields2 = basicForm.getFields();
            expect(fields2).not.toBe(fields1);
            expect(fields2.length).toEqual(1);
            expect(fields2.getAt(0).name).toEqual('two');
        });
    });

    describe("isValid method", function() {
        it("should return true if no fields are invalid", function() {
            addField({name: 'one'});
            addField({name: 'two'});
            expect(basicForm.isValid()).toBeTruthy();
        });

        it("should return false if any fields are invalid", function() {
            addField({name: 'one'});
            addField({name: 'two', valid: false});
            expect(basicForm.isValid()).toBeFalsy();
        });
    });

    describe("isDirty method", function() {
        it("should return true if no fields are dirty", function() {
            addField({name: 'one'});
            addField({name: 'two'});
            expect(basicForm.isDirty()).toBeFalsy();
        });
        it("should return false if any fields are dirty", function() {
            addField({name: 'one'});
            addField({name: 'two', dirty: true});
            expect(basicForm.isDirty()).toBeTruthy();
        });
    });

    describe("reset method", function() {
        it("should reset all fields to their initial values", function() {
            var one = addField({name: 'one'}),
                two = addField({name: 'one'});
            spyOn(one, 'reset');
            spyOn(two, 'reset');
            basicForm.reset();
            expect(one.reset).toHaveBeenCalled();
            expect(two.reset).toHaveBeenCalled();
        });
    });

    describe("findField method", function() {
        it("should find a field by id", function() {
            var one = addField({name: 'one', id: 'oneId'}),
                result = basicForm.findField('oneId');
            expect(result).toBe(one);
        });

        it("should find a field by name", function() {
            var one = addField({name: 'one'}),
                result = basicForm.findField('one');
            expect(result).toBe(one);
        });

        it("should return null if no matching field is found", function() {
            var one = addField({name: 'one'}),
                result = basicForm.findField('doesnotmatch');
            expect(result).toBeNull();
        });
    });

    describe("markInvalid method", function() {
        //change to use selectors?
        it("should accept an object where the keys are field names and the values are error messages", function() {
            var one = addField({name: 'one'}),
                two = addField({name: 'two'});
            spyOn(one, 'markInvalid');
            spyOn(two, 'markInvalid');
            basicForm.markInvalid({
                one: 'error one',
                two: 'error two'
            });
            expect(one.markInvalid).toHaveBeenCalledWith('error one');
            expect(two.markInvalid).toHaveBeenCalledWith('error two');
        });

        it("should accept an array of objects with 'id' and 'msg' properties", function() {
            var one = addField({name: 'one'}),
                two = addField({name: 'two'});
            spyOn(one, 'markInvalid');
            spyOn(two, 'markInvalid');
            basicForm.markInvalid([
                {id: 'one', msg: 'error one'},
                {id: 'two', msg: 'error two'}
            ]);
            expect(one.markInvalid).toHaveBeenCalledWith('error one');
            expect(two.markInvalid).toHaveBeenCalledWith('error two');
        });
    });

    describe("clearInvalid method", function() {
        it("should clear the invalid state of all fields", function() {
            var one = addField({name: 'one'}),
                two = addField({name: 'two'});
            spyOn(one, 'clearInvalid');
            spyOn(two, 'clearInvalid');
            basicForm.clearInvalid();
            expect(one.clearInvalid).toHaveBeenCalled();
            expect(two.clearInvalid).toHaveBeenCalled();
        });
    });

    describe("applyToFields method", function() {
        it("should call apply() on all fields with the given arguments", function() {
            var one = addField({name: 'one'}),
                two = addField({name: 'two'});
            basicForm.applyToFields({customProp: 'custom'});
            expect(one.customProp).toEqual('custom');
            expect(two.customProp).toEqual('custom');
        });
    });

    describe("applyIfToFields method", function() {
        it("should call applyIf() on all fields with the given arguments", function() {
            var one = addField({name: 'one', customProp1: 1}),
                two = addField({name: 'two', customProp1: 1});
            basicForm.applyIfToFields({customProp1: 2, customProp2: 3});
            expect(one.customProp1).toEqual(1);
            expect(one.customProp2).toEqual(3);
            expect(two.customProp1).toEqual(1);
            expect(two.customProp2).toEqual(3);
        });
    });

    describe("setValues method", function() {
        it("should accept an object mapping field ids to new field values", function() {
            var one = addField({name: 'one'}),
                two = addField({name: 'two'});
            spyOn(one, 'setValue');
            spyOn(two, 'setValue');
            basicForm.setValues({
                one: 'value 1',
                two: 'value 2'
            });
            expect(one.setValue).toHaveBeenCalledWith('value 1');
            expect(two.setValue).toHaveBeenCalledWith('value 2');
        });

        it("should accept an array of objects with 'id' and 'value' properties", function() {
            var one = addField({name: 'one'}),
                two = addField({name: 'two'});
            spyOn(one, 'setValue');
            spyOn(two, 'setValue');
            basicForm.setValues([
                {id: 'one', value: 'value 1'},
                {id: 'two', value: 'value 2'}
            ]);
            expect(one.setValue).toHaveBeenCalledWith('value 1');
            expect(two.setValue).toHaveBeenCalledWith('value 2');
        });

        it("should not set the fields' originalValue property by default", function() {
            var one = addField({name: 'one', originalValue: 'orig value'});
            basicForm.setValues({
                one: 'new value'
            });
            expect(one.originalValue).toEqual('orig value');
        });

        it("should set the fields' originalValue property if the 'trackResetOnLoad' config is true", function() {
            var one = addField({name: 'one', originalValue: 'orig value'});
            basicForm.trackResetOnLoad = true;
            basicForm.setValues({
                one: 'new value'
            });
            expect(one.originalValue).toEqual('new value');
        });
    });

    describe("getValues method", function() {
        it("should return an object mapping field names to field values", function() {
            addField({name: 'one', value: 'value 1'});
            addField({name: 'two', value: 'value 2'});
            var vals = basicForm.getValues();
            expect(vals).toEqual({one: 'value 1', two: 'value 2'});
        });

        it("should populate an array of values for multi-value fields", function() {
            addField({name: 'one', value: 'value 1'});
            addField({name: 'two', value: 'value 2'});
            addField({name: 'two', value: 'value 3'});
            var vals = basicForm.getValues();
            expect(vals).toEqual({one: 'value 1', two: ['value 2', 'value 3']});
        });

        it("should return a url-encoded query parameter string if the 'asString' argument is true", function() {
            addField({name: 'one', value: 'value 1'});
            addField({name: 'two', value: 'value 2'});
            addField({name: 'two', value: 'value 3'});
            var vals = basicForm.getValues(true);
            expect(vals).toEqual('one=value%201&two=value%202&two=value%203');
        });

        it("should return only dirty fields if the 'dirtyOnly' argument is true", function() {
            addField({name: 'one', value: 'value 1', dirty: true});
            addField({name: 'two', value: 'value 2', dirty: false});
            var vals = basicForm.getValues(false, true);
            expect(vals).toEqual({one: 'value 1'});
        });

        it("should return the emptyText for empty fields if the 'includeEmptyText' argument is true", function() {
            addField({name: 'one', value: 'value 1', dirty: true, emptyText: 'empty 1'});
            addField({name: 'two', value: '', dirty: false, emptyText: 'empty 2'});
            var vals = basicForm.getValues(false, false, true);
            expect(vals).toEqual({one: 'value 1', two: 'empty 2'});
        });

        it("should include fields whose value is empty string", function() {
            addField({name: 'one', value: ''});
            addField({name: 'two', value: 'value 2'});
            var vals = basicForm.getValues();
            expect(vals).toEqual({one: '', two: 'value 2'});
        });
        it("should not include fields whose getSubmitValue method returns null", function() {
            addField({name: 'one', value: 'value 1', getSubmitValue: function() {
                return null;
            }});
            addField({name: 'two', value: 'value 2'});
            var vals = basicForm.getValues();
            expect(vals).toEqual({two: 'value 2'});
        });
    });

    describe("doAction method", function() {
        beforeEach(function() {
            mockActionCtorSpy = jasmine.createSpy();
        });

        afterEach(function() {
            mockActionCtorSpy = undefined;
        });

        it("should accept an instance of Ext.form.action.Action for the 'action' argument", function() {
            var action = new MockAction();
            spyOn(action, 'run');
            runs(function() {
                basicForm.doAction(action);
            });
            waitsFor(function() {
                return action.run.callCount === 1;
            }, "did not call the action's run method");
        });

        it("should accept an action name for the 'action' argument", function() {
            spyOn(MockAction.prototype, 'run');
            runs(function() {
                basicForm.doAction('mock');
            });
            waitsFor(function() {
                return MockAction.prototype.run.callCount === 1;
            }, "did not call the action's run method");
        });

        it("should pass the options argument to the Action constructor", function() {
            basicForm.doAction('mock', {});
            expect(mockActionCtorSpy).toHaveBeenCalledWith({form: basicForm});
        });

        it("should call the beforeAction method", function() {
            spyOn(basicForm, 'beforeAction');
            basicForm.doAction('mock');
            expect(basicForm.beforeAction).toHaveBeenCalledWith(currentActionInstance);
        });

        it("should fire the beforeaction event", function() {
            var spy = jasmine.createSpy();
            basicForm.on('beforeaction', spy);
            basicForm.doAction('mock');
            expect(spy).toHaveBeenCalledWith(basicForm, currentActionInstance, {});
        });

        it("should cancel the action if a beforeaction listener returns false", function() {
            var handler = function() {
                return false;
            };
            basicForm.on('beforeaction', handler);
            spyOn(basicForm, 'beforeAction');
            basicForm.doAction('mock');
            expect(basicForm.beforeAction).not.toHaveBeenCalled();
        });

        // Actual action behaviors are tested separately in Action.js specs
    });

    describe("beforeAction method", function() {
        it("should call syncValue on any fields with that method", function() {
            var action = new MockAction(),
                spy = jasmine.createSpy();
            addField({name: 'one', syncValue: spy});
            basicForm.beforeAction(action);
            expect(spy).toHaveBeenCalled();
        });

        // waiting on MessageBox implementation
        xit("should display a wait message box if waitMsg is defined and waitMsgTarget is not defined", function() {});
        xit("should mask the owner's element if waitMsg is defined and waitMsgTarget is true", function() {});
        xit("should mask the waitMsgTarget element if waitMsg is defined and waitMsgTarget is an element", function() {});
    });

    describe("afterAction method", function() {
        // waiting on MessageBox implementation
        xit("should hide the wait message box if waitMsg is defined and waitMsgTarget is not defined", function() {});
        xit("should unmask the owner's element if waitMsg is defined and waitMsgTarget is true", function() {});
        xit("should unmask the waitMsgTarget element if waitMsg is defined and waitMsgTarget is an element", function() {});

        describe("success", function() {
            it("should invoke the reset method if the Action's reset option is true", function() {
                var action = new MockAction();
                action.reset = false;
                spyOn(basicForm, 'reset');
                basicForm.afterAction(action, true);
                expect(basicForm.reset).not.toHaveBeenCalled();
                action.reset = true;
                basicForm.afterAction(action, true);
                expect(basicForm.reset).toHaveBeenCalled();
            });

            it("should invoke the Action's success option as a callback with a reference to the BasicForm and the Action", function() {
                var spy = jasmine.createSpy(),
                    action = new MockAction();
                action.success = spy;
                basicForm.afterAction(action, true);
                expect(spy).toHaveBeenCalledWith(basicForm, action);
            });

            it("should fire the 'actioncomplete' event with a reference to the BasicForm and the Action", function() {
                var spy = jasmine.createSpy(),
                    action = new MockAction();
                basicForm.on('actioncomplete', spy);
                basicForm.afterAction(action, true);
                expect(spy).toHaveBeenCalledWith(basicForm, action, {});
            });
        });

        describe("failure", function() {
            it("should invoke the Action's failure option as a callback with a reference to the BasicForm and the Action", function() {
                var spy = jasmine.createSpy(),
                    action = new MockAction();
                action.failure = spy;
                basicForm.afterAction(action, false);
                expect(spy).toHaveBeenCalledWith(basicForm, action);
            });

            it("should fire the 'actionfailed' event with a reference to the BasicForm and the Action", function() {
                var spy = jasmine.createSpy(),
                    action = new MockAction();
                basicForm.on('actionfailed', spy);
                basicForm.afterAction(action, false);
                expect(spy).toHaveBeenCalledWith(basicForm, action, {});
            });
        });
    });

    describe("submit method", function() {
        it("should call doAction with 'submit' by default", function() {
            var opts = {};
            spyOn(basicForm, 'doAction');
            basicForm.submit(opts);
            expect(basicForm.doAction).toHaveBeenCalledWith('submit', opts);
        });

        it("should call doAction with 'standardsubmit' if the standardSubmit config is true", function() {
            basicForm.standardSubmit = true;
            var opts = {};
            spyOn(basicForm, 'doAction');
            basicForm.submit(opts);
            expect(basicForm.doAction).toHaveBeenCalledWith('standardsubmit', opts);
        });

        it("should call doAction with 'directsubmit' if the api config is defined", function() {
            basicForm.api = {};
            var opts = {};
            spyOn(basicForm, 'doAction');
            basicForm.submit(opts);
            expect(basicForm.doAction).toHaveBeenCalledWith('directsubmit', opts);
        });
    });

    describe("load method", function() {
        it("should call doAction with 'load' by default", function() {
            var opts = {};
            spyOn(basicForm, 'doAction');
            basicForm.load(opts);
            expect(basicForm.doAction).toHaveBeenCalledWith('load', opts);
        });

        it("should call doAction with 'directload' if the api config is defined", function() {
            basicForm.api = {};
            var opts = {};
            spyOn(basicForm, 'doAction');
            basicForm.load(opts);
            expect(basicForm.doAction).toHaveBeenCalledWith('directload', opts);
        });
    });

    describe("checkValidity method", function() {
        it("should be called when a field's 'validitychange' event is fired", function() {
            runs(function() {
                spyOn(basicForm, 'checkValidity');
                var field = addField({name: 'one'});
                field.fireEvent('validitychange', field, false);
            });
            waitsFor(function() {
                return basicForm.checkValidity.callCount === 1;
            }, "checkValidity was not called");
        });

        it("should fire the 'validitychange' event if the overall validity of the form has changed", function() {
            var spy = jasmine.createSpy('validitychange handler'),
                field1 = addField({name: 'one', valid: true}),
                field2 = addField({name: 'two', valid: true});
            basicForm.checkValidity();
            basicForm.on('validitychange', spy);
            field1.valid = false;
            basicForm.checkValidity();
            expect(spy).toHaveBeenCalled();
        });

        it("should not fire the 'validitychange' event if the overally validity of the form has not changed", function() {
            var spy = jasmine.createSpy('validitychange handler'),
                field1 = addField({name: 'one', valid: false}),
                field2 = addField({name: 'two', valid: false});
            basicForm.checkValidity();
            basicForm.on('validitychange', spy);
            field1.valid = true;
            basicForm.checkValidity();
            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe("checkDirty method", function() {
        it("should be called when a field's 'dirtychange' event is fired", function() {
            runs(function() {
                spyOn(basicForm, 'checkDirty');
                var field = addField({name: 'one'});
                field.fireEvent('dirtychange', field, false);
            });
            waitsFor(function() {
                return basicForm.checkDirty.callCount === 1;
            }, "checkDirty was not called");
        });

        it("should fire the 'dirtychange' event if the overall dirty state of the form has changed", function() {
            var spy = jasmine.createSpy('dirtychange handler'),
                field1 = addField({name: 'one', dirty: false}),
                field2 = addField({name: 'two', dirty: false});
            basicForm.checkDirty();
            basicForm.on('dirtychange', spy);
            field1.dirty = true;
            basicForm.checkDirty();
            expect(spy).toHaveBeenCalled();
        });

        it("should not fire the 'dirtychange' event if the overally dirty state of the form has not changed", function() {
            var spy = jasmine.createSpy('dirtychange handler'),
                field1 = addField({name: 'one', dirty: true}),
                field2 = addField({name: 'two', dirty: true});
            basicForm.checkDirty();
            basicForm.on('dirtychange', spy);
            field1.dirty = false;
            basicForm.checkDirty();
            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe("formBind child component property", function() {
        it("should disable a child component with formBind=true when the form becomes invalid", function() {
            var field1 = addField({name: 'one', valid: true}),
                field2 = addField({name: 'two', valid: true}),
                button = new Ext.Button({formBind: true});
            basicForm.checkValidity();

            spyOn(button, 'setDisabled');
            container.add(button);

            field1.valid = false;
            basicForm.checkValidity();
            expect(button.setDisabled).toHaveBeenCalledWith(true);
        });

        it("should enable a child component with formBind=true when the form becomes valid", function() {
            var field1 = addField({name: 'one', valid: false}),
                field2 = addField({name: 'two', valid: true}),
                button = new Ext.Button({formBind: true, disabled: true});
            basicForm.checkValidity();

            spyOn(button, 'setDisabled');
            container.add(button);

            field1.valid = true;
            basicForm.checkValidity();
            expect(button.setDisabled).toHaveBeenCalledWith(false);
        });

        it("should not disable a child component with formBind=true when the form remains invalid", function() {
            var field1 = addField({name: 'one', valid: true}),
                field2 = addField({name: 'two', valid: false}),
                button = new Ext.Button({formBind: true});
            basicForm.checkValidity();

            spyOn(button, 'setDisabled');
            container.add(button);

            field1.valid = false;
            basicForm.checkValidity();
            expect(button.setDisabled).not.toHaveBeenCalled();
        });

        it("should not enable a child component with formBind=true when the form remains valid", function() {
            var field1 = addField({name: 'one', valid: true}),
                field2 = addField({name: 'two', valid: true}),
                button = new Ext.Button({formBind: true, disabled: true});
            basicForm.checkValidity();

            spyOn(button, 'setDisabled');
            container.add(button);

            field1.valid = true;
            basicForm.checkValidity();
            expect(button.setDisabled).not.toHaveBeenCalled();
        });
    });

    describe("loadRecord method", function() {
        it("should call setValues with the record's data", function() {
            var record = {
                data: {
                    one: 'value 1',
                    two: 'value 2'
                }
            };
            spyOn(basicForm, 'setValues');
            basicForm.loadRecord(record);
            expect(basicForm.setValues).toHaveBeenCalledWith(record.data);
        });
    });

    //TODO this method probably needs to change to match the new data package
    xdescribe("updateRecord method", function() {
        it("", function() {});
    });


});
