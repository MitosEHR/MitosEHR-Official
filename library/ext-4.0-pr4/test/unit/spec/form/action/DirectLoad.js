describe("Ext.form.action.DirectLoad", function() {

    var action;

    function createAction(config) {
        config = config || {};
        if (!config.form) {
            config.form = {};
        }
        Ext.applyIf(config.form, {
            clearInvalid: Ext.emptyFn,
            setValues: Ext.emptyFn,
            afterAction: Ext.emptyFn,
            api: {
                load: Ext.emptyFn,
                submit: Ext.emptyFn
            }
        });
        action = new Ext.form.action.DirectLoad(config);
        return action;
    }

    function createActionWithCallbackArgs(config, result, trans) {
        createAction(config);
        spyOn(action.form.api, 'load').andCallFake(function() {
            var cb = arguments[arguments.length - 2],
                scope = arguments[arguments.length - 1];
            cb.call(scope, result, trans);
        });
    }


    it("should be registered in the action manager under the alias 'formaction.directload'", function() {
        var inst = Ext.ClassManager.instantiateByAlias('formaction.directload', {});
        expect(inst instanceof Ext.form.action.DirectLoad).toBeTruthy();
    });

    describe("run", function() {
        it("should invoke the 'load' function in the BasicForm's 'api' config", function() {
            createAction();
            spyOn(action.form.api, 'load');
            action.run();
            expect(action.form.api.load).toHaveBeenCalled();
        });

        it("should pass the params as a single object argument if 'paramsAsHash' is true", function() {
            createAction({form: {paramsAsHash: true}, params: {foo: 'bar'}});
            spyOn(action.form.api, 'load');
            action.run();
            expect(action.form.api.load.mostRecentCall.args[0]).toEqual({foo: 'bar'});
        });

        it("should pass the param values as separate arguments in the 'paramOrder' order if specified", function() {
            createAction({form: {paramOrder: ['one', 'two']}, params: {one: 'foo', two: 'bar'}});
            spyOn(action.form.api, 'load');
            action.run();
            var args = action.form.api.load.mostRecentCall.args;
            expect(args[0]).toEqual('foo');
            expect(args[1]).toEqual('bar');
        });

        it("should grab params from the action's 'params' config and the BasicForm's 'baseParams' config", function() {
            createAction({form: {paramsAsHash: true, baseParams: {baseOne: '1', baseTwo: '2'}}, params: {one: '1', two: '2'}});
            spyOn(action.form.api, 'load');
            action.run();
            expect(action.form.api.load.mostRecentCall.args[0]).toEqual({baseOne: '1', baseTwo: '2', one: '1', two: '2'});
        });

        it("should pass the onSuccess callback function and the callback scope as the final 2 arguments", function() {
            createAction({form: {paramsAsHash: true}, params: {foo: 'bar'}});
            spyOn(action.form.api, 'load');
            action.run();
            var args = action.form.api.load.mostRecentCall.args;
            expect(typeof args[args.length - 2]).toEqual('function');
            expect(args[args.length - 1]).toBe(action);
        });
    });


    describe("load failure", function() {
        // effects
        it("should set the Action's failureType property to LOAD_FAILURE", function() {
            createActionWithCallbackArgs({}, {}, {});
            action.run();
            expect(action.failureType).toEqual(Ext.form.action.Action.LOAD_FAILURE);
        });

        it("should call the BasicForm's afterAction method with a false success param", function() {
            createActionWithCallbackArgs({}, {}, {});
            spyOn(action.form, 'afterAction');
            action.run();
            expect(action.form.afterAction).toHaveBeenCalledWith(action, false);
        });

        //causes
        it("should fail if the callback is passed an exception with type=Ext.direct.Manager.exceptions.SERVER", function() {
            createActionWithCallbackArgs({}, {}, {type: Ext.direct.Manager.self.exceptions.SERVER});
            action.run();
            expect(action.failureType).toEqual(Ext.form.action.Action.LOAD_FAILURE);
        });

        it("should fail if the result object does not have success=true", function() {
            createActionWithCallbackArgs({}, {success: false, data: {}}, {});
            action.run();
            expect(action.failureType).toEqual(Ext.form.action.Action.LOAD_FAILURE);
        });

        it("should fail if the result object does not have a data member", function() {
            createActionWithCallbackArgs({}, {success: true}, {});
            action.run();
            expect(action.failureType).toEqual(Ext.form.action.Action.LOAD_FAILURE);
        });
    });


    describe("load success", function() {
        beforeEach(function() {
            createActionWithCallbackArgs({}, {success: true, data: {foo: 'bar'}}, {});
        });

        it("should call the BasicForm's clearInvalid method", function() {
            spyOn(action.form, 'clearInvalid');
            action.run();
            expect(action.form.clearInvalid).toHaveBeenCalled();
        });

        it("should call the BasicForm's setValues method with the result data object", function() {
            spyOn(action.form, 'setValues');
            action.run();
            expect(action.form.setValues).toHaveBeenCalledWith({foo: 'bar'});
        });

        it("should invoke the BasicForm's afterAction method with a true success param", function() {
            spyOn(action.form, 'afterAction');
            action.run();
            expect(action.form.afterAction).toHaveBeenCalledWith(action, true);
        });
    });

});
