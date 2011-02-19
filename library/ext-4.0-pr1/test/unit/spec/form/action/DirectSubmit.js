describe("Ext.form.action.DirectSubmit", function() {

    var action;

    function createAction(config) {
        config = config || {};
        if (!config.form) {
            config.form = {};
        }
        Ext.applyIf(config.form, {
            clearInvalid: Ext.emptyFn,
            markInvalid: Ext.emptyFn,
            getValues: Ext.emptyFn,
            getFields: function() {
                return new Ext.util.MixedCollection();
            },
            afterAction: Ext.emptyFn,
            isValid: function() { return true; },
            api: {
                load: Ext.emptyFn,
                submit: Ext.emptyFn
            }
        });
        action = new Ext.form.action.DirectSubmit(config);
        return action;
    }

    function createActionWithCallbackArgs(config, result, trans) {
        createAction(config);
        spyOn(action.form.api, 'submit').andCallFake(function() {
            var cb = arguments[1],
                scope = arguments[2];
            cb.call(scope, result, trans);
        });
    }



    it("should be registered in the action manager under the alias 'formaction.directsubmit'", function() {
        var inst = Ext.ClassManager.instantiateByAlias('formaction.directsubmit', {});
        expect(inst instanceof Ext.form.action.DirectSubmit).toBeTruthy();
    });

    describe("run", function() {
        it("should invoke the 'submit' function in the BasicForm's 'api' config", function() {
            createAction();
            spyOn(action.form.api, 'submit');
            action.run();
            expect(action.form.api.submit).toHaveBeenCalled();
        });

        it("should pass a form element containing all the field values and configured base params as the first argument", function() {
            var fieldValues = {one: '1', two: '2', three: '3'},
                allParams = Ext.apply({}, fieldValues, { fromParams: '1', fromBaseParams: '1' });
            createAction({
                params: { fromParams: '1' },
                form: {
                    baseParams: { fromBaseParams: '1' },
                    getValues: function() {
                        return fieldValues;
                    }
                }
            });
            spyOn(Ext, 'removeNode');
            action.run();
            var form = Ext.removeNode.mostRecentCall.args[0];

            expect(form).toBeDefined();
            expect(form.tagName).toEqual('FORM');

            //collect the name-value pairs from the form
            var valuesFromForm = {},
                inputs = form.getElementsByTagName("*"),
                i = 0, len = inputs.length;

            for(; i < len; i++) {
                valuesFromForm[inputs[i].name] = inputs[i].value;
            }

            expect(valuesFromForm).toEqual(allParams);
            Ext.removeNode.andCallThrough();
            
            Ext.removeNode(form);
        });

        it("should pass the callback function as the second argument", function() {
            createAction();
            spyOn(action.form.api, 'submit');
            action.run();
            var args = action.form.api.submit.mostRecentCall.args;
            expect(typeof args[1]).toEqual('function');
        });

        it("should pass the callback scope as the third argument", function() {
            createAction();
            spyOn(action.form.api, 'submit');
            action.run();
            var args = action.form.api.submit.mostRecentCall.args;
            expect(args[2]).toBe(action);
        });

    });


    describe("validation", function() {
        beforeEach(function() {
            spyOn(Ext.Ajax, 'request'); //block ajax request
        });

        it("should validate by default", function() {
            createAction();
            spyOn(action.form, 'isValid');
            action.run();
            expect(action.form.isValid).toHaveBeenCalled();
        });

        it("should not validate if the 'clientValidation' config is false", function() {
            createAction({ clientValidation: false });
            spyOn(action.form, 'isValid');
            action.run();
            expect(action.form.isValid).not.toHaveBeenCalled();
        });

        it("should set the failureType to CLIENT_INVALID if validation fails", function() {
            createAction({
                form: {
                    isValid: function() { return false; }
                }
            });
            action.run();
            expect(action.failureType).toEqual(Ext.form.action.Action.CLIENT_INVALID);
        });

        it("should call the BasicForm's afterAction method with success=false if validation fails", function() {
            createAction({
                form: {
                    isValid: function() { return false; }
                }
            });
            spyOn(action.form, 'afterAction');
            action.run();
            expect(action.form.afterAction).toHaveBeenCalledWith(action, false);
        });
    });


    describe("submit failure", function() {
        //causes
        it("should fail if the callback is passed an exception with type=Ext.Direct.exceptions.SERVER", function() {
            createActionWithCallbackArgs({}, {}, {type: Ext.Direct.exceptions.SERVER});
            action.run();
            expect(action.failureType).toBeDefined();
        });

        it("should fail if the result object does not have success=true", function() {
            createActionWithCallbackArgs({}, {success: false}, {});
            action.run();
            expect(action.failureType).toBeDefined();
        });


        // effects
        it("should set the Action's failureType property to SERVER_INVALID", function() {
            createActionWithCallbackArgs({}, {}, {});
            action.run();
            expect(action.failureType).toEqual(Ext.form.action.Action.SERVER_INVALID);
        });

        it("should call the BasicForm's afterAction method with a false success param", function() {
            createActionWithCallbackArgs({}, {}, {});
            spyOn(action.form, 'afterAction');
            action.run();
            expect(action.form.afterAction).toHaveBeenCalledWith(action, false);
        });

        it("should call the BasicForm's markInvalid method with any errors in the result", function() {
            createActionWithCallbackArgs({}, {success:false, errors:{foo:'bar'}}, {});
            spyOn(action.form, 'markInvalid');
            action.run();
            expect(action.form.markInvalid).toHaveBeenCalledWith({foo:"bar"});
        });
    });


    describe("submit success", function() {
        beforeEach(function() {
            createActionWithCallbackArgs({}, {success: true}, {});
        });

        it("should treat a result with success:true as success", function() {
            expect(action.failureType).not.toBeDefined();
        });

        it("should invoke the BasicForm's afterAction method with a true success param", function() {
            spyOn(action.form, 'afterAction');
            action.run();
            expect(action.form.afterAction).toHaveBeenCalledWith(action, true);
        });
    });

});
