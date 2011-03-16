describe("Ext.Object", function(){

    describe("getKeys", function(){
        var getKeys = Ext.Object.getKeys;
        it("should return an empty array for a null value", function(){
            expect(getKeys(null)).toEqual([]);
        });

        it("should return an empty array for an empty object", function(){
            expect(getKeys({})).toEqual([]);
        });

        it("should return all the keys in the object", function(){
            expect(getKeys({
                foo: 1,
                bar: 2,
                baz: 3
            })).toEqual(['foo', 'bar', 'baz']);
        });
    });

    describe("getValues", function(){
        var getValues = Ext.Object.getValues;
        it("should return an empty array for a null value", function(){
            expect(getValues(null)).toEqual([]);
        });

        it("should return an empty array for an empty object", function(){
            expect(getValues({})).toEqual([]);
        });

        it("should return all the values in the object", function(){
            expect(getValues({
                foo: 1,
                bar: 2,
                baz: 3
            })).toEqual([1, 2, 3]);
        });
    });

    describe("keyOf", function(){
        var keyOf = Ext.Object.keyOf;

        it("should return null for a null object", function(){
            expect(keyOf(null, 'foo')).toBeNull();
        });

        it("should return null for an empty object", function(){
            expect(keyOf({}, 'foo')).toBeNull();
        });

        it("should return null if the value doesn't exist", function(){
            expect(keyOf({
                foo: 1,
                bar: 2
            }, 3)).toBeNull();
        });

        it("should only do strict matching", function(){
            expect(keyOf({
                foo: 1
            }, '1')).toBeNull();
        });

        it("should return the correct key if it matches", function(){
            expect(keyOf({
                foo: 1
            }, 1)).toEqual('foo');
        });

        it("should only return the first matched value", function(){
            expect(keyOf({
                bar: 1,
                foo: 1
            }, 1)).toEqual('bar');
        });
    });

    describe("each", function(){
        var each = Ext.Object.each;

        describe("scope/params", function(){
            it("should execute using the passed scope", function(){
                var scope = {},
                    actual;

                each({
                    foo: 1,
                    bar: 'value',
                    baz: false
                }, function(){
                    actual = this;
                }, scope);
                expect(actual).toBe(scope);
            });

            it("should default the scope to the object", function(){
                var o = {
                    foo: 1,
                    bar: 'value',
                    baz: false
                }, actual;

                each(o, function(){
                    actual = this;
                });
                expect(actual).toBe(o);
            });

            it("should execute passing the key value and object", function(){
                var keys = [],
                    values = [],
                    data = {
                        foo: 1,
                        bar: 'value',
                        baz: false
                    },
                    obj;

                each(data, function(key, value, o){
                    keys.push(key);
                    values.push(value);
                    obj = o;
                });

                expect(keys).toEqual(['foo', 'bar', 'baz']);
                expect(values).toEqual([1, 'value', false]);
                expect(obj).toBe(data);
            });
        });

        describe("stopping", function(){
            it("should not stop by default", function(){
                var count = 0;
                each({
                    a: 1,
                    b: 2,
                    c: 3,
                    d: 4
                }, function(){
                    ++count;
                });
                expect(count).toEqual(4);
            });

            it("should only stop if the function returns false", function(){
                var count = 0;
                each({
                    a: 1,
                    b: 2,
                    c: 3,
                    d: 4
                }, function(){
                    ++count;
                    return null;
                });
                expect(count).toEqual(4);
            });

            it("should stop immediately when false is returned", function(){
                var count = 0;
                each({
                    a: 1,
                    b: 2,
                    c: 3,
                    d: 4
                }, function(key){
                    ++count;
                    return key != 'b';
                });
                expect(count).toEqual(2);
            });
        });
    });

    describe("toQueryString", function(){
        var toQueryString = Ext.Object.toQueryString;

        describe("defaults", function(){
            it("should return an empty string for a null object", function(){
                expect(toQueryString(null)).toEqual('');
            });

            it("should return an empty string for an empty object", function(){
                expect(toQueryString({})).toEqual('');
            });
        });

        describe("simple values", function(){
            it("should separate a property/value by an =", function(){
                expect(toQueryString({
                    foo: 1
                })).toEqual('foo=1');
            });

            it("should separate pairs by an &", function(){
                expect(toQueryString({
                    foo: 1,
                    bar: 2
                })).toEqual('foo=1&bar=2');
            });

            it("should handle properties with empty values", function(){
                expect(toQueryString({
                    foo: null
                })).toEqual('foo=');
            });

            it("should encode dates", function(){
                var d = new Date(2011, 0, 1);
                expect(toQueryString({
                    foo: d
                })).toEqual('foo=2011-01-01T00:00:00');
            });

            it("should url encode the key", function(){
                expect(toQueryString({
                    'a prop': 1
                })).toEqual('a%20prop=1');
            });

            it("should url encode the value", function(){
                expect(toQueryString({
                    prop: '$300 & 5 cents'
                })).toEqual('prop=%24300%20%26%205%20cents');
            });

            it("should encode both key and value at the same time", function(){
               expect(toQueryString({
                   'a prop': '$300'
               })).toEqual('a%20prop=%24300');
            });
        });

        describe("arrays", function(){
            it("should support an array value", function(){
                expect(toQueryString({
                    foo: [1, 2, 3]
                })).toEqual('foo=1&foo=2&foo=3');
            });

            it("should be able to support multiple arrays", function(){
                expect(toQueryString({
                    foo: [1, 2],
                    bar: [3, 4]
                })).toEqual('foo=1&foo=2&bar=3&bar=4');
            });

            it("should be able to mix arrays and normal values", function(){
                expect(toQueryString({
                    foo: 'val1',
                    bar: ['val2', 'val3'],
                    baz: 'val4'
                })).toEqual('foo=val1&bar=val2&bar=val3&baz=val4');
            });
        });

        describe("prefix", function(){
            it("should have no prefix by default", function(){
                expect(toQueryString({
                    foo: 'val'
                })).toEqual('foo=val');
            });

            it("should prefix the querystring with the passed value", function(){
                expect(toQueryString({
                    foo: 1
                }, 'pre')).toEqual('pre&foo=1')
            });

            it("should include a leading ampersand when the prefix is specified", function(){
                expect(toQueryString({
                    val: 'val2'
                }, 'aprefix=val1')).toEqual('aprefix=val1&val=val2');
            });
        });
    });

    describe("merge", function(){
        var merge = Ext.Object.merge;

        describe("simple values", function(){
            it("should copy over numeric values", function(){
                expect(merge({}, 'prop1', 1)).toEqual({
                    prop1: 1
                });
            });

            it("should copy over string values", function(){
                expect(merge({}, 'prop1', 'val')).toEqual({
                    prop1: 'val'
                });
            });

            it("should copy over boolean values", function(){
                expect(merge({}, 'prop1', true)).toEqual({
                    prop1: true
                });
            });

            it("should copy over null values", function(){
                expect(merge({}, 'prop1', null)).toEqual({
                    prop1: null
                });
            });
        });

        describe("complex values", function(){
            it("should copy a date but not have the same reference", function(){
                var d = new Date(2011, 0, 1),
                    result = merge({}, 'prop', d);

                expect(result.prop).toEqual(d);
                expect(result.prop).not.toBe(d);
            });

            it("should copy a simple object but not have the same reference", function(){
                var o = {
                    foo: 'prop'
                }, result = merge({}, 'prop', o);

                expect(result.prop).toEqual({
                    foo: 'prop'
                });
                expect(result.prop).not.toBe(o);
            });

            it("should copy an array but not have the same reference", function(){
                var arr = [1, 2, 3],
                    result = merge({}, 'prop1', arr);

                expect(result.prop1).toEqual([1, 2, 3]);
                expect(result.prop1).not.toBe(arr);
            });

            it("should NOT merge an instance (the constructor of which is not Object)", function(){
                var o = new Ext.Base(),
                    result = merge({}, 'prop1', o);

                expect(result.prop1).toBe(o);
            });
        });

        describe("overwriting properties", function(){
            it("should merge objects if an object exists on the source and the passed value is an object literal", function(){
                expect(merge({
                    prop: {
                        foo: 1
                    }
                }, 'prop', {
                    bar: 2
                })).toEqual({
                    prop: {
                        foo: 1,
                        bar: 2
                    }
                });
            });

            it("should copy an object reference if an object exists on the source and the passed value is some kind of class", function(){
                var o = new Ext.Base(),
                    result = merge({
                        prop: {}
                    }, 'prop', o);

                expect(result).toEqual({
                    prop: o
                });
                expect(result.prop).toBe(o);
            });

            it("should replace the value of the target object if it is not an object", function(){
                var o = new Ext.Base(),
                    result = merge({
                        prop: 1
                    }, 'prop', o);

                expect(result.prop).toEqual(o);
                expect(result.prop).toBe(o);
            });

            it("should overwrite simple values", function(){
                expect(merge({
                    prop: 1
                }, 'prop', 2)).toEqual({
                    prop: 2
                });
            });
        });

        describe("merging objects", function(){
            it("should merge objects", function(){
                expect(merge({}, {
                    foo: 1
                })).toEqual({
                    foo: 1
                });
            });

            it("should merge left to right", function(){
                expect(merge({}, {
                    foo: 1
                }, {
                    foo: 2
                }, {
                    foo: 3
                })).toEqual({
                    foo: 3
                })
            });
        });

        it("should modify and return the source", function(){
            var o = {},
                result = merge(o, 'foo', 'bar');

            expect(result.foo).toEqual('bar');
            expect(result).toBe(o);

        });
    });

});
