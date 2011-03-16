describe("Ext.form.action.Submit", function() {

    var action;

    function createAction(config) {
        config = config || {};
        if (!config.form) {
            config.form = {};
        }
        Ext.applyIf(config.form, {
            isValid: function() { return true; },
            afterAction: Ext.emptyFn,
            getValues: Ext.emptyFn,
            hasUpload: function() { return false; },
            markInvalid: Ext.emptyFn
        });
        action = new Ext.form.action.Submit(config);
    }

    afterEach(function() {
        action = undefined;
    });



    it("should be registered in the action manager under the alias 'formaction.submit'", function() {
        var inst = Ext.ClassManager.instantiateByAlias('formaction.submit', {});
        expect(inst instanceof Ext.form.action.Submit).toBeTruthy();
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


    describe("AJAX call options", function() {
        var ajaxRequestCfg,
            formBase;

        beforeEach(function() {
            formBase = {
                getValues: function() { return {field1: 'foo', field2: 'bar'}; }
            };

            spyOn(Ext.Ajax, 'request').andCallFake(function() {
                // store what was passed to the request call for later inspection
                expect(arguments.length).toEqual(1);
                ajaxRequestCfg = arguments[0];
            });
        });

        it("should invoke Ext.Ajax.request", function() {
            createAction({ form: formBase });
            action.run();
            expect(Ext.Ajax.request).toHaveBeenCalled();
        });

        it("should use 'POST' as the ajax call method by default", function() {
            createAction({ form: formBase });
            action.run();
            expect(ajaxRequestCfg.method).toEqual('POST');
        });

        it("should use the BasicForm's 'method' config as the ajax call method if specified", function() {
            createAction({ form: Ext.apply({}, {method: 'FORMMETHOD'}, formBase) });
            action.run();
            expect(ajaxRequestCfg.method).toEqual('FORMMETHOD');
        });

        it("should use the Action's 'method' config as the ajax call method if specified", function() {
            createAction({ method: 'actionmethod', form: formBase });
            action.run();
            expect(ajaxRequestCfg.method).toEqual('ACTIONMETHOD');
        });

        it("should use the BasicForm's 'url' config as the ajax call url if specified", function() {
            createAction({ form: Ext.apply({}, {url: '/url-from-form'}, formBase) });
            action.run();
            expect(ajaxRequestCfg.url).toEqual('/url-from-form');
        });

        it("should use the Action's 'url' config as the ajax call url if specified", function() {
            createAction({ url: '/url-from-action', form: formBase });
            action.run();
            expect(ajaxRequestCfg.url).toEqual('/url-from-action');
        });

        it("should use the Action's 'headers' config as the ajax call headers if specified", function() {
            var headers = {foo: 'bar'};
            createAction({ headers: headers, form: formBase });
            action.run();
            expect(ajaxRequestCfg.headers).toBe(headers);
        });

        describe("params", function() {
            it("should add all the form's field values to the ajax call params", function() {
                createAction({ form: formBase });
                action.run();
                expect(ajaxRequestCfg.params).toEqual({field1: 'foo', field2: 'bar'});
            });

            it("should add the BasicForm's 'baseParams' config to the ajax call params if specified", function() {
                var params = {one: '1', two: '2'};
                createAction({ form: Ext.apply({}, {baseParams: params}, formBase) });
                action.run();
                expect(ajaxRequestCfg.params).toEqual({field1: 'foo', field2: 'bar', one: '1', two: '2'});
            });

            it("should use the Action's 'params' config for the ajax call params if specfied (as an Object)", function() {
                var params = {one: '1', two: '2'};
                createAction({ params: params, form: formBase });
                action.run();
                expect(ajaxRequestCfg.params).toEqual({field1: 'foo', field2: 'bar', one: '1', two: '2'});
            });

            it("should use the Action's 'params' config for the ajax call params if specfied (as a String)", function() {
                var params = 'one=1&two=2';
                createAction({ params: params, form: formBase });
                action.run();
                expect(ajaxRequestCfg.params).toEqual({field1: 'foo', field2: 'bar', one: '1', two: '2'});
            });

            it("should concatenate the Action's 'params' config (as an Object) with the BasicForm's 'baseParams' config", function() {
                createAction({ params: {one: '1', two: '2'}, form: Ext.apply({}, {baseParams: {three: '3', four: '4'} }, formBase) });
                action.run();
                expect(ajaxRequestCfg.params).toEqual({field1: 'foo', field2: 'bar', one: '1', two: '2', three: '3', four: '4'});
            });

            it("should concatenate the Action's 'params' config (as a String) with the BasicForm's 'baseParams' config", function() {
                createAction({ params: 'one=1&two=2', form: Ext.apply({}, {baseParams: {three: '3', four: '4'} }, formBase) });
                action.run();
                expect(ajaxRequestCfg.params).toEqual({field1: 'foo', field2: 'bar', one: '1', two: '2', three: '3', four: '4'});
            });
        });

        it("should use the BasicForm's 'timeout' config as the ajax call timeout if specified", function() {
            createAction({ form: Ext.apply({}, {timeout: 123}, formBase) });
            action.run();
            expect(ajaxRequestCfg.timeout).toEqual(123000);
        });

        it("should use the Action's 'timeout' config as the ajax call timeout if specified", function() {
            createAction({ timeout: 123, form: formBase });
            action.run();
            expect(ajaxRequestCfg.timeout).toEqual(123000);
        });

        it("should use the Action instance as the ajax call 'scope' parameter", function() {
            createAction({ form: formBase });
            action.run();
            expect(ajaxRequestCfg.scope).toBe(action);
        });
    });


    describe("ajax request error", function() {
        var response = {
            responseText: '{}'
        };

        beforeEach(function() {
            spyOn(Ext.Ajax, 'request').andCallFake(function(config) {
                // call the configured failure handler
                config.failure.call(config.scope, response);
            });
            createAction({
                form: {
                    afterAction: jasmine.createSpy(),
                    getValues: function() { return ''; }
                }
            });
            action.run();
        });

        it("should set the Action's failureType property to CONNECT_FAILURE", function() {
            expect(action.failureType).toEqual(Ext.form.action.Action.CONNECT_FAILURE);
        });

        it("should set the Action's response property to the ajax response", function() {
            expect(action.response).toEqual(response);
        });

        it("should call the BasicForm's afterAction method with a false success param", function() {
            expect(action.form.afterAction).toHaveBeenCalledWith(action, false);
        });
    });



    describe("response parsing", function() {
        function run(response, reader) {
            spyOn(Ext.Ajax, 'request').andCallFake(function(config) {
                // manually call the configured success handler
                config.success.call(config.scope, response);
            });
            createAction({
                form: {
                    markInvalid: jasmine.createSpy(),
                    errorReader: reader
                }
            });
            action.run();
        }

        it("should parse the responseText as JSON if no errorReader is configured", function() {
            run({responseText: '{"success":false,"errors":{"from":"responseText"}}'}, undefined);
            expect(action.form.markInvalid).toHaveBeenCalledWith({from: "responseText"});
        });

        it("should use the configured errorReader to parse the response if present", function() {
            var response = {responseText: '{"success":false,"errors":[]}'};
            run(response, {
                read: jasmine.createSpy().andReturn({
                    success: false,
                    records: [
                        {data: {id: 'field1', msg: 'message 1'}},
                        {data: {id: 'field2', msg: 'message 2'}}
                    ]
                })
            });
            expect(action.form.errorReader.read).toHaveBeenCalledWith(response);
            expect(action.form.markInvalid).toHaveBeenCalledWith([{id: 'field1', msg: 'message 1'}, {id: 'field2', msg: 'message 2'}]);
        });
    });



    describe("submit failure", function() {
        function run(response) {
            spyOn(Ext.Ajax, 'request').andCallFake(function(config) {
                // manually call the configured success handler
                config.success.call(config.scope, response);
            });
            createAction({
                form: {
                    markInvalid: jasmine.createSpy(),
                    afterAction: jasmine.createSpy(),
                    getValues: function() { return ''; }
                }
            });
            action.run();
        }

        // causes
        it("should require the result object to have success=true", function() {
            run({responseText: '{"success":false}'});
            expect(action.failureType).toBeDefined();
        });

        // effects
        it("should set the Action's failureType property to SERVER_INVALID", function() {
            run({responseText: '{"success":false}'});
            expect(action.failureType).toEqual(Ext.form.action.Action.SERVER_INVALID);
        });
        it("should call the BasicForm's afterAction method with a false success param", function() {
            run({responseText: '{"success":false}'});
            expect(action.form.afterAction).toHaveBeenCalledWith(action, false);
        });
        it("should call the BasicForm's markInvalid method with any errors in the result", function() {
            run({responseText: '{"success":false,"errors":{"foo":"bar"}}'});
            expect(action.form.markInvalid).toHaveBeenCalledWith({foo:"bar"});
        });

    });


    describe("submit success", function() {
        function run(response) {
            spyOn(Ext.Ajax, 'request').andCallFake(function(config) {
                // manually call the configured success handler
                config.success.call(config.scope, response);
            });
            createAction({
                form: {
                    afterAction: jasmine.createSpy(),
                    getValues: function() { return ''; }
                }
            });
            action.run();
        }

        it("should treat empty responseText and responseXML as success", function() {
            run({responseText: '', responseXML: ''});
            expect(action.failureType).not.toBeDefined();
        });

        it("should treat a result with success:true as success", function() {
            run({responseText: '{"success":true}'});
            expect(action.failureType).not.toBeDefined();
        });

        it("should invoke the BasicForm's afterAction method with a true success param", function() {
            run({responseText: '{"success":true,"data":{"from":"responseText"}}'});
            expect(action.form.afterAction).toHaveBeenCalledWith(action, true);
        });
    });

    // TODO specs for file uploads

});
