describe("Ext.Class", function() {
    var cls;
    beforeEach(function() {
        window.My = {
            awesome: {
                Class: function(){console.log(11)},
                Class1: function(){console.log(12)},
                Class2: function(){console.log(13)}
            },
            cool: {
                AnotherClass: function(){console.log(21)},
                AnotherClass1: function(){console.log(22)},
                AnotherClass2: function(){console.log(23)}
            }
        };
    });

    afterEach(function() {
        if (window.My) {
            window.My = undefined;
        }

        try {
            delete window.My;
        } catch (e) {}
    });

    // START PREPROCESSORS =================================================================== /
    describe("preprocessors", function() {

        beforeEach(function() {
            cls = function() {};
        });

        describe("extend", function() {

            it("should extend from Base if no 'extend' property found", function() {
                var data = {};

                Ext.Class.preprocessors.extend(cls, data);

                expect((new cls) instanceof Ext.Base).toBeTruthy();
            });

            it("should extend from given parent class", function() {
                var data = {
                    extend: My.awesome.Class
                };

                Ext.Class.preprocessors.extend(cls, data);

                expect((new cls) instanceof My.awesome.Class).toBeTruthy();
            });

            it("should have superclass reference", function() {
                var data = {
                    extend: My.awesome.Class
                };

                var parentPrototype = My.awesome.Class.prototype;

                Ext.Class.preprocessors.extend(cls, data);

                expect(cls.superclass).toEqual(parentPrototype);
                expect((new cls).superclass).toEqual(parentPrototype);
            });
        });

        describe("config", function() {

            it("should create getter if not exists", function() {
                var data = {
                    config: {
                        someName: 'someValue'
                    }
                };

                Ext.Class.preprocessors.config(cls, data);

                var obj = new cls;

                expect(obj.getSomeName).toBeDefined();
            });

            it("should NOT create getter if already exists", function() {
                var data = {
                    config: {
                        someName: 'someValue'
                    }
                };

                var called = false;
                cls.prototype.getSomeName = function() {
                    called = true;
                };

                Ext.Class.preprocessors.config(cls, data);

                var obj = new cls;
                obj.getSomeName();

                expect(called).toBeTruthy();
            });

            it("should create setter if not exists", function() {
                var data = {
                    config: {
                        someName: 'someValue'
                    }
                };

                Ext.Class.preprocessors.config(cls, data);

                var obj = new cls;

                expect(obj.setSomeName).toBeDefined();

                obj.setSomeName('valueHere');

                expect(obj.getSomeName()).toEqual('valueHere');
            });

            it("should NOT create setter if already exists", function() {
                var data = {
                    config: {
                        someName: 'someValue'
                    }
                };

                var called = false;

                cls.prototype.setSomeName = function() {
                    called = true;
                };

                Ext.Class.preprocessors.config(cls, data);

                var obj = new cls;
                obj.setSomeName('valueHere');

                expect(called).toBeTruthy();
            });

            it("should create apply if not exists", function() {
                var data = {
                    config: {
                        someName: 'someValue'
                    }
                };

                Ext.Class.preprocessors.config(cls, data);

                var obj = new cls;
                expect(obj.applySomeName).toBeDefined();

                spyOn(obj, 'applySomeName').andCallThrough();

                obj.setSomeName('valueHere');

                expect(obj.applySomeName).toHaveBeenCalledWith('valueHere', undefined);

                obj.setSomeName('newValueHere');

                expect(obj.applySomeName).toHaveBeenCalledWith('newValueHere', 'valueHere');
            });

            it("should NOT create apply if already exists", function() {
                var data = {
                    config: {
                        someName: 'someValue'
                    }
                };

                var called = false;
                cls.prototype.applySomeName = function() {
                    called = true;
                };

                Ext.Class.preprocessors.config(cls, data);

                var obj = new cls;
                obj.applySomeName('anything');
                expect(called).toBeTruthy();
            });

            it("should create shortcuts for boolean getters", function() {
                var data = {
                    config: {
                        isCool: true,
                        hasWings: false
                    }
                };

                Ext.Class.preprocessors.config(cls, data);

                var obj = new cls;

                expect(obj.isCool).toBeDefined();
                expect(obj.hasWings).toBeDefined();
            });
        });

        describe("statics", function() {
            it("should copy static properties to the class", function() {
                var data = {
                    statics: {
                        someName: 'someValue',
                        someMethod: Ext.emptyFn
                    }
                };

                Ext.Class.preprocessors.statics(cls, data);

                var obj = new cls;

                expect(obj.statics).not.toBeDefined();
                expect(cls.someName).toBe('someValue');
                expect(cls.someMethod).toBe(Ext.emptyFn);
            });

            it("should store names of inheritable static properties", function() {
                var data = {
                    inheritableStatics: {
                        someName: 'someValue',
                        someMethod: Ext.emptyFn
                    }
                };

                Ext.Class.preprocessors.statics(cls, data);

                var obj = new cls;

                expect(obj.statics).not.toBeDefined();
                expect(cls.someName).toBe('someValue');
                expect(cls.$inheritableStatics).toEqual(['someName', 'someMethod']);
                expect(cls.someMethod).toBe(Ext.emptyFn);
            });

            it("should inherit inheritable statics", function() {
                var data = {
                    inheritableStatics: {
                        someName: 'someValue',
                        someMethod: Ext.emptyFn
                    }
                }, cls2 = function(){};

                Ext.Class.preprocessors.statics(cls, data);
                Ext.Class.preprocessors.extend(cls2, { extend: cls });

                expect(cls2.someName).toEqual('someValue');
                expect(cls2.someMethod).toBe(Ext.emptyFn);
            });

            it("should NOT inherit inheritable statics if the class already has it", function() {
                var data = {
                    inheritableStatics: {
                        someName: 'someValue',
                        someMethod: Ext.emptyFn
                    }
                }, cls2 = function(){};

                cls2.someName = 'someOtherValue';
                cls2.someMethod = function(){};

                Ext.Class.preprocessors.statics(cls, data);
                Ext.Class.preprocessors.extend(cls2, { extend: cls });

                expect(cls2.someName).toEqual('someOtherValue');
                expect(cls2.someMethod).not.toBe(Ext.emptyFn);
            });
        });
    });

    // END PREPROCESSORS =================================================================== /

    describe("Instantiation", function() {
        var subClass, parentClass, mixinClass1, mixinClass2;

        beforeEach(function() {
            mixinClass1 = new Ext.Class({
                config: {
                    mixinConfig: 'mixinConfig'
                },

                constructor: function(config) {
                    this.initConfig(config);

                    this.mixinConstructor1Called = true;
                },

                mixinProperty1: 'mixinProperty1',

                mixinMethod1: function() {
                    this.mixinMethodCalled = true;
                }
            });

            mixinClass2 = new Ext.Class({
                constructor: function(config) {
                    this.initConfig(config);

                    this.mixinConstructor2Called = true;
                },

                mixinProperty2: 'mixinProperty2',

                mixinMethod2: function() {
                    this.mixinMethodCalled = true;
                }
            });

            parentClass = new Ext.Class({
                mixins: {
                    mixin1: mixinClass1
                },
                config: {
                    name: 'parentClass',
                    isCool: false,
                    members: {
                        abe: 'Abraham Elias',
                        ed: 'Ed Spencer'
                    },
                    hobbies: ['football', 'bowling']
                },
                constructor: function(config) {
                    this.initConfig(config);

                    this.parentConstructorCalled = true;

                    this.mixins.mixin1.constructor.apply(this, arguments);
                },

                parentProperty: 'parentProperty',

                parentMethod: function() {
                    this.parentMethodCalled = true;
                }
            });

            subClass = new Ext.Class({
                extend: parentClass,
                mixins: {
                    mixin1: mixinClass1,
                    mixin2: mixinClass2
                },
                config: {
                    name: 'subClass',
                    isCool: true,
                    members: {
                        jacky: 'Jacky Nguyen',
                        tommy: 'Tommy Maintz'
                    },
                    hobbies: ['sleeping', 'eating', 'movies'],
                    isSpecial: true
                },
                constructor: function(config) {
                    this.initConfig(config);

                    this.subConstrutorCalled = true;

                    subClass.superclass.constructor.apply(this, arguments);

                    this.mixins.mixin2.constructor.apply(this, arguments);
                },
                myOwnMethod: function() {
                    this.myOwnMethodCalled = true;
                }
            });
        });

        describe("addStatics", function() {
            it("single with name - value arguments", function() {
                var called = false;

                subClass.addStatics({
                    staticMethod: function(){
                        called = true;
                    }
                });

                expect(subClass.staticMethod).toBeDefined();
                subClass.staticMethod();

                expect(called).toBeTruthy();
            });

            it("multiple with object map argument", function() {
                subClass.addStatics({
                    staticProperty: 'something',
                    staticMethod: function(){}
                });

                expect(subClass.staticProperty).toEqual('something');
                expect(subClass.staticMethod).toBeDefined();
            });
        });

        describe("extend", function() {
            it("should extend", function() {
                subClass.extend({
                    newMethod: function(){}
                });

                expect((new subClass).newMethod).toBeDefined();
            });

            it("should extend from data", function() {
                subClass.extend({
                    newMethod: function(){}
                });

                expect((new subClass).newMethod).toBeDefined();
            });
        });

        describe("override", function() {
            it("should override", function() {
                subClass.override({
                    myOwnMethod: function(){
                        this.isOverridden = true;

                        this.callOverridden(arguments);
                    }
                });

                var obj = new subClass;
                obj.myOwnMethod();

                expect(obj.isOverridden).toBe(true);
                expect(obj.myOwnMethodCalled).toBe(true);
            });
        });

        describe("mixin", function() {
            it("should have all properties of mixins", function() {
                var obj = new subClass;
                expect(obj.mixinProperty1).toEqual('mixinProperty1');
                expect(obj.mixinProperty2).toEqual('mixinProperty2');
                expect(obj.mixinMethod1).toBeDefined();
                expect(obj.mixinMethod2).toBeDefined();
                expect(obj.config.mixinConfig).toEqual('mixinConfig');
            });
        });

        describe("config", function() {
            it("should merge properly", function() {
                var obj = new subClass;
                expect(obj.config).toEqual({
                    mixinConfig: 'mixinConfig',
                    name: 'subClass',
                    isCool: true,
                    members: {
                        abe: 'Abraham Elias',
                        ed: 'Ed Spencer',
                        jacky: 'Jacky Nguyen',
                        tommy: 'Tommy Maintz'
                    },
                    hobbies: ['sleeping', 'eating', 'movies'],
                    isSpecial: true
                });
            });

            it("should apply default config", function() {
                var obj = new subClass;
                expect(obj.getName()).toEqual('subClass');
                expect(obj.isCool()).toEqual(true);
                expect(obj.getHobbies()).toEqual(['sleeping', 'eating', 'movies']);
            });

            it("should apply with supplied config", function() {
                var obj = new subClass({
                    name: 'newName',
                    isCool: false,
                    members: {
                        aaron: 'Aaron Conran'
                    }
                });

                expect(obj.getName()).toEqual('newName');
                expect(obj.isCool()).toEqual(false);
                expect(obj.getMembers().aaron).toEqual('Aaron Conran');
            });

            it("should not share the same config", function() {
                var obj1 = new subClass({
                    name: 'newName',
                    isCool: false,
                    members: {
                        aaron: 'Aaron Conran'
                    }
                });

                var obj2 = new subClass();

                expect(obj2.getName()).not.toEqual('newName');
            });
        });

        describe("overriden methods", function() {
            it("should call self constructor", function() {
                var obj = new subClass;
                expect(obj.subConstrutorCalled).toBeTruthy();
            });

            it("should call parent constructor", function() {
                var obj = new subClass;
                expect(obj.parentConstructorCalled).toBeTruthy();
            });

            it("should call mixins constructors", function() {
                var obj = new subClass;
                expect(obj.mixinConstructor1Called).toBeTruthy();
                expect(obj.mixinConstructor2Called).toBeTruthy();
            });
        });

    });

});
