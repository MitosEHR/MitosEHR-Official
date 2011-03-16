describe("Ext.util.KeyMap", function(){
    var el, map, createMap, defaultFn, fireKey, origProcessEvent, KEYS = {
        a: 97,
        b: 98,
        c: 99,
        x: 120,
        y: 121,
        z: 122 
    };
    
    beforeEach(function(){
        el = Ext.getBody().dom.ownerDocument.createElement('div');
        el.id = 'test-keyMap-el';
        Ext.getBody().dom.appendChild(el);
        
        createMap = function(config, eventName){
            map = new Ext.KeyMap(el, config, eventName);
        };
        
        fireKey = function(key, eventName, options){
            jasmine.fireKeyEvent(el, eventName || 'keydown', key, options || null);
        };
        
        defaultFn = jasmine.createSpy('defaultKeyNavHandler');
        origProcessEvent = Ext.util.KeyMap.prototype.processEvent;
    });
    
    afterEach(function(){
        if (map) {
            map.disable();
        }
        
        if (el) {
            Ext.getBody().dom.removeChild(el);
        }
        
        Ext.util.KeyMap.prototype.processEvent = origProcessEvent;
        origProcessEvent = fireKey = defaultFn = map = createMap = el = null;
    });
    
    describe("constructor", function(){
        describe("receiving element", function(){
            it("should take a string id", function(){
                map = new Ext.util.KeyMap('test-keyMap-el');
                map.addBinding({
                    key: KEYS.a,
                    handler: defaultFn
                });
                fireKey(KEYS.a);
                expect(defaultFn).toHaveBeenCalled();
            });
            
            it("should take a dom element", function(){
                map = new Ext.util.KeyMap(el);
                map.addBinding({
                    key: KEYS.x,
                    handler: defaultFn
                });
                fireKey(KEYS.x);
                expect(defaultFn).toHaveBeenCalled();
            });
            
            it("should take an Ext.Element", function(){
                map = new Ext.util.KeyMap(Ext.get(el));
                map.addBinding({
                    key: KEYS.z,
                    handler: defaultFn
                });
                fireKey(KEYS.z);
                expect(defaultFn).toHaveBeenCalled();
            });
        });
        
        it("should pass the config to addBinding", function(){
            createMap({
                key: KEYS.z,
                handler: defaultFn
            });
            fireKey(KEYS.z);
            expect(defaultFn).toHaveBeenCalled();
        });
        
        it("should default the eventName to keydown", function(){
            createMap({
                key: KEYS.c,
                handler: defaultFn
            });
            fireKey(KEYS.c, 'keydown');
            expect(defaultFn).toHaveBeenCalled();
        });
        
        it("should accept an eventName argument", function(){
            createMap({
                key: KEYS.b,
                handler: defaultFn
            }, 'keyup');
            fireKey(KEYS.b, 'keyup');
            expect(defaultFn).toHaveBeenCalled();
        });
    });
    
    describe("addBinding", function(){
        
        describe("single binding", function(){
            it("should listen to a single keycode", function(){
                createMap();
                map.addBinding({
                    key: KEYS.a,
                    handler: defaultFn
                });
                fireKey(KEYS.a);
                expect(defaultFn).toHaveBeenCalled();
            });
        
            it("should accept an array of keycodes", function(){
                createMap();
                map.addBinding({
                    key: [KEYS.a, KEYS.z],
                    handler: defaultFn
                });
                fireKey(KEYS.a);
                fireKey(KEYS.z);
            
                expect(defaultFn.callCount).toEqual(2);
            });
        
            it("should accept a single character as a string", function(){
                createMap();
                map.addBinding({
                    key: 'b',
                    handler: defaultFn
                });
                fireKey(KEYS.b);
                expect(defaultFn).toHaveBeenCalled();
            });
        
            it("should accept multiple characters as a string", function(){
                createMap();
                map.addBinding({
                    key: 'xyz',
                    handler: defaultFn
                });
                fireKey(KEYS.x);
                fireKey(KEYS.y);
                fireKey(KEYS.z);
                
                expect(defaultFn.callCount).toEqual(3);
            });
        
            it("should accept an array of characters", function(){
                createMap();
                map.addBinding({
                    key: ['c', 'y'],
                    handler: defaultFn
                });
                fireKey(KEYS.c);
                fireKey(KEYS.y);
                
                expect(defaultFn.callCount).toEqual(2);
            });
        });
        
        describe("array binding", function(){
            it("should support an array of mixed bindings", function(){
                createMap();
                map.addBinding([{
                    key: KEYS.a,
                    handler: defaultFn
                }, {
                    key: 'b',
                    handler: defaultFn
                }]);
                fireKey(KEYS.a);
                fireKey(KEYS.b);
                
                expect(defaultFn.callCount).toEqual(2);
            });
            
            it("should process all bindings", function(){
                createMap();
                map.addBinding([{
                    key: KEYS.a,
                    handler: defaultFn
                }, {
                    key: KEYS.a,
                    handler: defaultFn
                }]);
                fireKey(KEYS.a);
                expect(defaultFn.callCount).toEqual(2);
            });
        });
        
        it("should support multiple addBinding calls", function(){
            createMap();
            map.addBinding({
                key: KEYS.a,
                handler: defaultFn
            });
            map.addBinding({
                key: KEYS.b,
                handler: defaultFn
            });
            fireKey(KEYS.a);
            fireKey(KEYS.b);
            expect(defaultFn.callCount).toEqual(2);
        });
    });
    
    describe("ctrl/alt/shift", function(){
        
        var createOverride = function(altKey, ctrlKey, shiftKey){
            Ext.util.KeyMap.prototype.processEvent = function(event) {
                event.altKey = altKey || false;
                event.ctrlKey = ctrlKey || false;
                event.shiftKey = shiftKey || false;
                return event;
            }
        };
        
        describe("alt", function(){
            it("should fire the event if the alt key is not pressed and the alt option is undefined", function(){
                createOverride();
                createMap({
                    key: KEYS.a,
                    handler: defaultFn
                });
                fireKey(KEYS.a);
                expect(defaultFn).toHaveBeenCalled();
            });
            
            it("should fire the event if the alt key is pressed and the alt option is undefined", function(){
                createOverride(true);
                createMap({
                    key: KEYS.a,
                    handler: defaultFn
                });
                fireKey(KEYS.a);
                expect(defaultFn).toHaveBeenCalled();
            });
            
            it("should fire the event if the alt key is not pressed and the alt option is false", function(){
                createOverride();
                createMap({
                    key: KEYS.b,
                    handler: defaultFn,
                    alt: false
                });
                fireKey(KEYS.b);
                expect(defaultFn).toHaveBeenCalled();
            });
            
            it("should not fire the event if the alt key is pressed and the alt option is true", function(){
                createOverride();
                createMap({
                    key: KEYS.c,
                    handler: defaultFn,
                    alt: true
                });
                fireKey(KEYS.c);
                expect(defaultFn).not.toHaveBeenCalled();
            });
            
            it("should not fire the event if the alt key is pressed and the alt option is false", function(){
                createOverride(true);
                createMap({
                    key: KEYS.x,
                    handler: defaultFn,
                    alt: false
                });
                fireKey(KEYS.x);
                expect(defaultFn).not.toHaveBeenCalled();
            });
            
            it("should fire the event if the alt key is pressed and the alt option is true", function(){
                createOverride(true);
                createMap({
                    key: KEYS.x,
                    handler: defaultFn,
                    alt: true
                });
                fireKey(KEYS.x);
                expect(defaultFn).toHaveBeenCalled();
            });
        });
        
        describe("ctrl", function(){
            it("should fire the event if the ctrl key is not pressed and the ctrl option is undefined", function(){
                createOverride();
                createMap({
                    key: KEYS.a,
                    handler: defaultFn
                });
                fireKey(KEYS.a);
                expect(defaultFn).toHaveBeenCalled();
            });
            
            it("should fire the event if the ctrl key is pressed and the ctrl option is undefined", function(){
                createOverride(false, true);
                createMap({
                    key: KEYS.a,
                    handler: defaultFn
                });
                fireKey(KEYS.a);
                expect(defaultFn).toHaveBeenCalled();
            });
            
            it("should fire the event if the ctrl key is not pressed and the ctrl option is false", function(){
                createOverride();
                createMap({
                    key: KEYS.b,
                    handler: defaultFn,
                    ctrl: false
                });
                fireKey(KEYS.b);
                expect(defaultFn).toHaveBeenCalled();
            });
            
            it("should not fire the event if the ctrl key is pressed and the ctrl option is true", function(){
                createOverride();
                createMap({
                    key: KEYS.c,
                    handler: defaultFn,
                    ctrl: true
                });
                fireKey(KEYS.c);
                expect(defaultFn).not.toHaveBeenCalled();
            });
            
            it("should not fire the event if the ctrl key is pressed and the ctrl option is false", function(){
                createOverride(false, true);
                createMap({
                    key: KEYS.x,
                    handler: defaultFn,
                    ctrl: false
                });
                fireKey(KEYS.x);
                expect(defaultFn).not.toHaveBeenCalled();
            });
            
            it("should fire the event if the ctrl key is pressed and the ctrl option is true", function(){
                createOverride(false, true);
                createMap({
                    key: KEYS.x,
                    handler: defaultFn,
                    ctrl: true
                });
                fireKey(KEYS.x);
                expect(defaultFn).toHaveBeenCalled();
            });
        });
        
        describe("shift", function(){
            it("should fire the event if the shift key is not pressed and the shift option is undefined", function(){
                createOverride();
                createMap({
                    key: KEYS.a,
                    handler: defaultFn
                });
                fireKey(KEYS.a);
                expect(defaultFn).toHaveBeenCalled();
            });
            
            it("should fire the event if the shift key is pressed and the shift option is undefined", function(){
                createOverride(false, false, true);
                createMap({
                    key: KEYS.a,
                    handler: defaultFn
                });
                fireKey(KEYS.a);
                expect(defaultFn).toHaveBeenCalled();
            });
            
            it("should fire the event if the shift key is not pressed and the shift option is false", function(){
                createOverride();
                createMap({
                    key: KEYS.b,
                    handler: defaultFn,
                    shift: false
                });
                fireKey(KEYS.b);
                expect(defaultFn).toHaveBeenCalled();
            });
            
            it("should not fire the event if the shift key is pressed and the shift option is true", function(){
                createOverride();
                createMap({
                    key: KEYS.c,
                    handler: defaultFn,
                    shift: true
                });
                fireKey(KEYS.c);
                expect(defaultFn).not.toHaveBeenCalled();
            });
            
            it("should not fire the event if the shift key is pressed and the shift option is false", function(){
                createOverride(false, false, true);
                createMap({
                    key: KEYS.x,
                    handler: defaultFn,
                    shift: false
                });
                fireKey(KEYS.x);
                expect(defaultFn).not.toHaveBeenCalled();
            });
            
            it("should fire the event if the shift key is pressed and the shift option is true", function(){
                createOverride(false, false, true);
                createMap({
                    key: KEYS.x,
                    handler: defaultFn,
                    shift: true
                });
                fireKey(KEYS.x);
                expect(defaultFn).toHaveBeenCalled();
            });
        });    
        
        describe("combinations", function(){
            // these are just some of the combinations, but are sufficient for testing purposes
            it("should not fire the event if alt & ctrl are set to true but only alt is pressed", function(){
                createOverride(true);
                createMap({
                    key: KEYS.y,
                    handler: defaultFn,
                    alt: true,
                    ctrl: true
                });
                fireKey(KEYS.y);
                expect(defaultFn).not.toHaveBeenCalled();
            });
            
            it("should not fire the event if alt, ctrl & shift are set but only shift and ctrl are pressed", function(){
                createOverride(false, true, true);
                createMap({
                    key: KEYS.y,
                    handler: defaultFn,
                    alt: true,
                    ctrl: true,
                    shift: true
                });
                fireKey(KEYS.y);
                expect(defaultFn).not.toHaveBeenCalled();
            });
            
            it("should fire the event if alt & shift are set and alt, ctrl & shift are pressed", function(){
                createOverride(true, true, true);
                createMap({
                    key: KEYS.z,
                    handler: defaultFn,
                    alt: true,
                    shift: true
                });
                fireKey(KEYS.z);
                expect(defaultFn).toHaveBeenCalled();
            });
        });
    });
    
    describe("params/scope", function(){
        describe("scope", function(){
            it("should default the scope to the map", function(){
                var actual;
                
                createMap({
                    key: KEYS.a,
                    handler: function(){
                        actual = this;
                    }
                });
                fireKey(KEYS.a);
                expect(actual).toEqual(map);    
            });
            
            it("should execute the callback in the passed scope", function(){
                var scope = {},
                    actual;
                
                createMap({
                    key: KEYS.y,
                    scope: scope,
                    handler: function(){
                        actual = this;
                    }
                });
                fireKey(KEYS.y);
                expect(actual).toBe(scope);
            });
            
            it("should execute each matched binding in the specified scope", function(){
                var scope1 = {},
                    scope2 = {},
                    actual1,
                    actual2;
                    
                createMap([{
                    key: KEYS.b,
                    scope: scope1,
                    handler: function(){
                        actual1 = this;
                    }
                }, {
                    key: KEYS.x,
                    scope: scope2,
                    handler: function(){
                        actual2 = this;
                    }
                }]);
                
                fireKey(KEYS.b);
                fireKey(KEYS.x);
                
                expect(actual1).toBe(scope1);
                expect(actual2).toBe(scope2);
            });
        });
        
        it("should execute the handler with the key and an event", function(){
            var realKey,
                realEvent;
                
            createMap({
                key: KEYS.z,
                handler: function(key, event){
                    realKey = key;
                    realEvent = event;
                }
            });
            fireKey(KEYS.z);
            
            expect(realKey).toEqual(KEYS.z);
            expect(realEvent.xy).toBeTruthy();
            expect(realEvent.type).toBeTruthy();
            expect(realEvent.target).toBeTruthy();
        });
    });
    
    describe("disable/enabling", function(){
        it("should be enabled by default", function(){
            createMap({
                key: KEYS.b,
                fn: defaultFn
            });
            fireKey(KEYS.b);
            expect(defaultFn).toHaveBeenCalled();
        });
        
        it("should not fire any events when disabled", function(){
            createMap({
                key: KEYS.c,
                fn: defaultFn
            });
            map.disable();
            fireKey(KEYS.c);
            expect(defaultFn).not.toHaveBeenCalled();
        });
        
        it("should fire events after being disabled/enabled", function(){
            createMap({
                key: KEYS.z,
                fn: defaultFn
            });
            map.disable();
            fireKey(KEYS.z);
            expect(defaultFn).not.toHaveBeenCalled();
            map.enable();
            fireKey(KEYS.z);
            expect(defaultFn).toHaveBeenCalled();
        });
    });
    
    describe("destroying", function(){
        it("should unbind any events on the element", function(){
            createMap({
                key: KEYS.a
            });
            map.destroy();
            fireKey(KEYS.a);
            expect(defaultFn).not.toHaveBeenCalled();
        });
        
        /**
         * This test has been commented out because I'm unable to get it to check
         * whether the item has been removed from the DOM. Tried:
         * a) expect(el.parentNode).toBeNull();
         * b) expect(el.parentNode).toBeFalsy();
         * c) expect(jasmine.util.argsToArray(Ext.getBody().dom.childNodes)).not.toContain(el)
         * 
         * None of which work. Odd.
         */
        xit("should remove the element if removeEl is specified", function(){
            createMap({
                key: KEYS.a
            });
            map.destroy(true);
            expect(jasmine.util.argsToArray(Ext.getBody().dom.childNodes)).not.toContain(el);
        });
    });
});
