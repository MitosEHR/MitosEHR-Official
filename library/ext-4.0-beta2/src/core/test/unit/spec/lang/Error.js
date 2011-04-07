if (Ext.Error) {
    describe("Ext.Error", function() {
    
        var globalConsole,
            consoleWarningMsg = 'An error was raised with the following data:';
    
        beforeEach(function() {
            globalConsole = Ext.global.console;

            // mock the console to avoid logging to the real console during the tests
            Ext.global.console = {
                log: function(s) {
                    return s;
                },
                warn: function(s) {
                    return s;
                },
                dir: function(o) {
                    return o;
                }
            };
        });
    
        afterEach(function() {
            Ext.global.console = globalConsole;
        });
    
        describe("raising an error via Ext.Error.raise", function() {

            describe("passing a string", function() {
        
                it("should throw an error with a msg property", function() {
                    try {
                        Ext.Error.raise('foo');
                    }
                    catch (err) {
                        expect(err.msg).toEqual('foo');
                    }
                });
            
                it("should log a warning to the console", function() {
                    spyOn(Ext.global.console, 'warn');
                    try {
                        Ext.Error.raise('foo');
                    } 
                    catch (err) {}
                    expect(Ext.global.console.warn).toHaveBeenCalledWith(consoleWarningMsg);
                });
            
                it("should log the error object to the console", function() {
                    spyOn(Ext.global.console, 'dir').andCallFake(function(err){
                        expect(err.msg).toEqual('foo');
                    });
                    try {
                        Ext.Error.raise('foo');
                    } 
                    catch (err) {}
                });
            
                it("should do nothing when Ext.Error.ignore = true", function() {
                    spyOn(Ext.global.console, 'warn');
                
                    Ext.Error.ignore = true;
                    try {
                        Ext.Error.raise('foo');
                    } 
                    catch (err) {
                        expect('Error should not have been caught').toBe(true);
                    }
                    expect(Ext.global.console.warn).not.toHaveBeenCalled();
                    Ext.Error.ignore = false;
                });
            
                it("should not throw an error if handled by Ext.Error.handle", function() {
                    spyOn(Ext.global.console, 'warn');
                
                    var origHandle = Ext.Error.handle;
                    Ext.Error.handle = function(err) {
                        expect(err.msg).toEqual('foo');
                        return true;
                    }
                    try {
                        Ext.Error.raise('foo');
                    } 
                    catch (err) {
                        expect('Error should not have been caught').toBe(true);
                    }
                    expect(Ext.global.console.warn).not.toHaveBeenCalled();
                    Ext.Error.handle = origHandle;
                });
            });
        
            describe("passing an object with a msg property", function() {
        
                it("should throw an error with a msg property", function() {
                    try {
                        Ext.Error.raise({msg: 'foo'});
                    }
                    catch (err) {
                        expect(err.msg).toEqual('foo');
                    }
                });
            
                it("should log a warning to the console", function() {
                    spyOn(Ext.global.console, 'warn');
                    try {
                        Ext.Error.raise({msg: 'foo'});
                    } 
                    catch (err) {}
                    expect(Ext.global.console.warn).toHaveBeenCalledWith(consoleWarningMsg);
                });
            
                it("should log the error object to the console", function() {
                    spyOn(Ext.global.console, 'dir').andCallFake(function(err){
                        expect(err.msg).toEqual('foo');
                    });
                    try {
                        Ext.Error.raise({msg: 'foo'});
                    } 
                    catch (err) {}
                });
                                
                it("should do nothing when Ext.Error.ignore = true", function() {
                    spyOn(Ext.global.console, 'warn');
                
                    Ext.Error.ignore = true;
                    try {
                        Ext.Error.raise({msg: 'foo'});
                    } 
                    catch (err) {
                        expect('Error should not have been caught').toBe(true);
                    }
                    expect(Ext.global.console.warn).not.toHaveBeenCalled();
                    Ext.Error.ignore = false;
                });
            
                it("should not throw an error if handled by Ext.Error.handle", function() {
                    spyOn(Ext.global.console, 'warn');
                
                    var origHandle = Ext.Error.handle;
                    Ext.Error.handle = function(err) {
                        expect(err.msg).toEqual('foo');
                        return true;
                    }
                    try {
                        Ext.Error.raise({msg: 'foo'});
                    } 
                    catch (err) {
                        expect('Error should not have been caught').toBe(true);
                    }
                    expect(Ext.global.console.warn).not.toHaveBeenCalled();
                    Ext.Error.handle = origHandle;
                });
            });
        
            describe("passing an object with custom metadata", function() {
        
                it("should throw an error with matching metadata", function() {
                    try {
                        Ext.Error.raise({
                            msg: 'Custom error',
                            data: {
                                foo: 'bar'
                            }
                        });
                    }
                    catch (err) {
                        expect(err.msg).toEqual('Custom error');
                        expect(err.data).not.toBe(null);
                        expect(err.data.foo).toEqual('bar');
                    }
                });
            
                it("should log the complete metadata to the console", function() {
                    spyOn(Ext.global.console, 'dir').andCallFake(function(err){
                        expect(err.msg).toEqual('Custom error');
                        expect(err.data).not.toBe(null);
                        expect(err.data.foo).toEqual('bar');
                    });
                    try {
                        Ext.Error.raise({
                            msg: 'Custom error',
                            data: {
                                foo: 'bar'
                            }
                        });
                    } 
                    catch (err) {}
                });
            });
        
            describe("originating from within a class defined by Ext", function() {
        
                Ext.define('CustomClass', {
                    doSomething: function(o){
                        Ext.Error.raise({
                            msg: 'Custom error',
                            data: o,
                            foo: 'bar'
                        });
                    }
                });
                var customObj = Ext.create('CustomClass');
            
                it("should throw an error containing the source class and method", function() {
                    try {
                        customObj.doSomething({
                            extraData: 'extra'
                        });
                    }
                    catch (err) {
                        expect(err.msg).toEqual('Custom error');
                        expect(err.sourceClass).toEqual('CustomClass');
                        expect(err.sourceMethod).toEqual('doSomething');
                    }
                });
            
                it("should log the complete metadata to the console", function() {
                    spyOn(Ext.global.console, 'dir').andCallFake(function(err){
                        expect(err.msg).toEqual('Custom error');
                        expect(err.sourceClass).toEqual('CustomClass');
                        expect(err.sourceMethod).toEqual('doSomething');
                        expect(err.data).not.toBe(null);
                        expect(err.data.extraData).not.toBe(null);
                        expect(err.data.extraData).toEqual('extra');
                        expect(err.foo).toEqual('bar');
                    });
                    try {
                        customObj.doSomething({
                            extraData: 'extra'
                        });
                    } 
                    catch (err) {}
                });
            });
        });
    });
}