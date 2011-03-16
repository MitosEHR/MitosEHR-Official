describe("Ext.form.ComboBox", function() {

    var component, makeComponent, store;

    beforeEach(function() {
        Ext.regModel('CBTestModel', {
            fields: [
                {type: 'string', name: 'text'},
                {type: 'string', name: 'val'}
            ]
        });
        store = new Ext.data.Store({
            proxy: {
                type: 'memory'
            },
            model: 'CBTestModel',
            data: [
                {text: 'text 1', val: 'value 1'},
                {text: 'text 2', val: 'value 2'},
                {text: 'text 3', val: 'value 3'}
            ]
        });

        makeComponent = function(config) {
            config = config || {};
            if (!config.name) {
                config.name = 'test';
            }
            if (!config.store) {
                config.store = store;
            }
            component = new Ext.form.ComboBox(config);
        };
    });

    afterEach(function() {
        if (component) {
            component.destroy();
            Ext.tip.QuickTips.destroy();
        }
        if (store) {
            store.destroy();
        }
        component = makeComponent = store = null;
        Ext.ModelMgr.types = [];
        try {
            delete window.CBTestModel;
        } catch(e) {};
    });

    it("should set the valueField/displayField on an auto created store", function(){
        component = new Ext.form.ComboBox({
            store: [[1, 'Item 1'], [2, 'Item 2'], [3, 'Item 3']]
        }); 
        expect(component.valueField).toBe('field1');
        expect(component.displayField).toBe('field2');
    });


    describe("defaults", function() {
        describe("normal", function() {
            beforeEach(function() {
                makeComponent();
            });

            it("should have triggerCls = 'x-form-arrow-trigger'", function() {
                expect(component.triggerCls).toEqual('x-form-arrow-trigger');
            });
            it("should have multiSelect = false", function() {
                expect(component.multiSelect).toBe(false);
            });
            it("should have delimiter = ', '", function() {
                expect(component.delimiter).toEqual(', ');
            });
            it("should have displayField = 'text'", function() {
                expect(component.displayField).toEqual('text');
            });
            it("should have valueField = displayField", function() {
                expect(component.valueField).toEqual('text');
            });
            it("should have triggerAction = 'all'", function() {
                expect(component.triggerAction).toEqual('all');
            });
            it("should have allQuery = ''", function() {
                expect(component.allQuery).toEqual('');
            });
            it("should have queryParam = 'query'", function() {
                expect(component.queryParam).toEqual('query');
            });
            it("should have queryMode = 'remote'", function() {
                expect(component.queryMode).toEqual('remote');
            });
            it("should have queryDelay = 500", function() {
                expect(component.queryDelay).toEqual(500);
            });
            it("should have minChars = 4", function() {
                expect(component.minChars).toEqual(4);
            });
            it("should have autoSelect = true", function() {
                expect(component.autoSelect).toBe(true);
            });
            it("should have typeAhead = false", function() {
                expect(component.typeAhead).toBe(false);
            });
            it("should have typeAheadDelay = 250", function() {
                expect(component.typeAheadDelay).toEqual(250);
            });
            it("should have forceSelection = false", function() {
                expect(component.forceSelection).toBe(false);
            });
            it("should have listEmptyText = ''", function() {
                expect(component.listEmptyText).toEqual('');
            });
            it("should have listLoadingText = 'Loading...'", function() {
                expect(component.listLoadingText).toEqual('Loading...');
            });
            it("should have listMaxHeight = 300", function() {
                expect(component.listMaxHeight).toEqual(300);
            });
            it("should have listWidth = undefined", function() {
                expect(component.listWidth).not.toBeDefined();
            });
            it("should have getInnerTpl = undefined", function() {
                expect(component.getInnerTpl).not.toBeDefined();
            });
        });

        describe("with queryMode = 'local'", function() {
            beforeEach(function() {
                makeComponent({
                    queryMode: 'local'
                })
            });
            it("should have queryDelay = 10", function() {
                expect(component.queryDelay).toEqual(10);
            });
            it("should have minChars = 0", function() {
                expect(component.minChars).toEqual(0);
            });
        });
    });
    
    describe("getSubmitValue", function(){
        it("should get the underlying field value", function(){
            makeComponent({
                queryMode: 'local',
                value: 'val 2'
            });
            expect(component.getSubmitValue()).toEqual('val 2');
        });
    });


    describe("onExpand", function() {
        var getInnerTpl = function() {
            return 'foo';
        };

        beforeEach(function() {
            makeComponent({
                renderTo: Ext.getBody(),
                getInnerTpl: getInnerTpl,
                listWidth: 234,
                matchFieldWidth: false,
                value: 'value 2'
            });
            component.expand();
        });

        it("should create a Ext.view.BoundList as the picker", function() {
            expect(component.picker).toBeDefined();
            expect(component.picker instanceof Ext.view.BoundList).toBe(true);
        });
        it("should pass the configured store to the BoundList", function() {
            expect(component.picker.store).toBe(component.store);
        });
        it("should pass the configured displayField to the BoundList", function() {
            expect(component.picker.displayField).toEqual(component.displayField);
        });
        it("should pass the configured listWidth to the BoundList", function() {
            expect(component.picker.width).toEqual(component.listWidth);
        });
        it("should pass the configured listMaxHeight to the BoundList", function() {
            expect(component.picker.maxHeight).toEqual(component.listMaxHeight);
        });
        it("should pass the configured listLoadingText to the BoundList", function() {
            expect(component.picker.loadingText).toEqual(component.listLoadingText);
        });
        it("should pass the configured listEmptyText to the BoundList", function() {
            expect(component.picker.emptyText).toEqual(component.listEmptyText);
        });
        it("should pass a configured getInnerTpl method to the BoundList config", function() {
            expect(component.picker.getInnerTpl).toBe(getInnerTpl);
        });
/*
        it("should set the BoundList's selection to match the current value", function() {
            expect(component.picker.getSelectionModel().getSelection().length).toEqual(1);
            expect(component.picker.getSelectionModel().getSelection()[0].get('value')).toEqual(component.value);
        });
*/
        it("should initalize a BoundListKeyNav on the BoundList", function() {
            expect(component.listKeyNav).toBeDefined();
            expect(component.listKeyNav instanceof Ext.view.BoundListKeyNav).toBe(true);
        });
        it("should enable the BoundListKeyNav", function() {
            waitsFor(function() {
                return component.listKeyNav.disabled === false;
            });
        })
    });


    describe("onCollapse", function() {
        it("should disable the BoundListKeyNav", function() {
            runs(function() {
                makeComponent({
                    renderTo: Ext.getBody()
                });
                component.expand();
            });
            waitsFor(function() {
                return component.listKeyNav.disabled === false;
            });
            runs(function() {
                component.collapse();
                expect(component.listKeyNav.disabled).toBe(true);
            });
        })
    });


    describe("setting value", function() {
        describe("value config", function() {
            it("should accept a single string", function() {
                makeComponent({
                    value: 'value 2',
                    valueField: 'val'
                });
                expect(component.value).toEqual('value 2');
            });
            it("should accept an array of string values", function() {
                makeComponent({
                    value: ['value 3', 'not in store'],
                    valueField: 'val'
                });
                expect(component.value).toEqual(['value 3', 'not in store'])
            });
            it("should accept a single Ext.data.Model", function() {
                makeComponent({
                    value: store.getAt(0),
                    valueField: 'val'
                });
                expect(component.value).toEqual('value 1');
            });
            it("should accept an array of Ext.data.Model objects", function() {
                makeComponent({
                    value: [store.getAt(0), store.getAt(2)],
                    valueField: 'val'
                });
                expect(component.value).toEqual(['value 1', 'value 3']);
            });
            it("should display the values separated by the configured delimiter", function() {
                makeComponent({
                    value: ['value 1', 'value 2'],
                    valueField: 'val',
                    renderTo: Ext.getBody(),
                    delimiter: '|'
                });
                expect(component.inputEl.dom.value).toEqual('text 1|text 2');
            });
        });

        describe("setValue method", function() {
            it("should accept a single string", function() {
                makeComponent({
                    valueField: 'val'
                });
                component.setValue('value 2');
                expect(component.value).toEqual('value 2');
            });
            it("should accept an array of string values", function() {
                makeComponent({
                    valueField: 'val'
                });
                component.setValue(['value 3', 'not in store']);
                expect(component.value).toEqual(['value 3', 'not in store'])
            });
            it("should accept a single Ext.data.Model", function() {
                makeComponent({
                    valueField: 'val'
                });
                component.setValue(store.getAt(0));
                expect(component.value).toEqual('value 1');
            });
            it("should accept an array of Ext.data.Model objects", function() {
                makeComponent({
                    valueField: 'val'
                });
                component.setValue([store.getAt(0), store.getAt(2)]);
                expect(component.value).toEqual(['value 1', 'value 3']);
            });
            it("should display the values separated by the configured delimiter", function() {
                makeComponent({
                    valueField: 'val',
                    renderTo: Ext.getBody(),
                    delimiter: '|'
                });
                component.setValue(['value 1', 'value 2']);
                expect(component.inputEl.dom.value).toEqual('text 1|text 2');
            });
            it("should update the expanded dropdown's selection - single select", function() {
                makeComponent({
                    valueField: 'val',
                    renderTo: Ext.getBody()
                });
                component.expand();
                component.setValue('value 2');
                expect(component.picker.getSelectionModel().getSelection()).toEqual([store.getAt(1)]);
            });
            it("should update the expanded dropdown's selection - multi select", function() {
                makeComponent({
                    valueField: 'val',
                    renderTo: Ext.getBody(),
                    multiSelect: true
                });
                component.expand();
                component.setValue(['value 1', 'value 3']);
                expect(component.picker.getSelectionModel().getSelection()).toEqual([store.getAt(0), store.getAt(2)]);
            });
        });
    });


    describe("doQuery method", function() {
        it("should set the lastQuery property", function() {
            makeComponent();
            component.doQuery('foobar');
            expect(component.lastQuery).toEqual('foobar');
        });

        it("should clear the current store filter", function() {
            makeComponent();
            spyOn(component.store, 'clearFilter');
            component.doQuery('foobar');
            expect(component.store.clearFilter).toHaveBeenCalled();
        });

        describe("local queryMode", function() {
            it("should filter the store based on the displayField", function() {
                makeComponent({
                    queryMode: 'local',
                    displayField: 'val'
                });
                spyOn(component.store, 'filter').andCallThrough();
                component.doQuery('value 2');
                expect(component.store.filter).toHaveBeenCalledWith('val', 'value 2');
                expect(component.store.getCount()).toEqual(1);
                expect(component.store.getAt(0).get('val')).toEqual('value 2');
            });
            it("should not filter the store if forceAll = true", function() {
                makeComponent({
                    queryMode: 'local',
                    displayField: 'val'
                });
                spyOn(component.store, 'filter').andCallThrough();
                component.doQuery('value 2', true);
                expect(component.store.filter).not.toHaveBeenCalled();
                expect(component.store.getCount()).toEqual(3);
            });
        });

        describe("remote queryMode", function() {
            it("should call the store's load method", function() {
                makeComponent({
                    queryMode: 'remote',
                    displayField: 'val'
                });
                spyOn(component.store, 'load');
                component.doQuery('foobar');
                expect(component.store.load).toHaveBeenCalledWith({params: {query: 'foobar'}})
            });
            it("should pass the query string using the 'queryParam' as the parameter name", function() {
                makeComponent({
                    queryMode: 'remote',
                    displayField: 'val',
                    queryParam: 'customparam'
                });
                spyOn(component.store, 'load');
                component.doQuery('foobar');
                expect(component.store.load).toHaveBeenCalledWith({params: {customparam: 'foobar'}})
            });
        });

        describe("beforequery event", function() {
            it("should fire the 'beforequery' event", function() {
                makeComponent();
                var spy = jasmine.createSpy();
                component.on('beforequery', spy);
                component.doQuery('foobar', true);
                expect(spy).toHaveBeenCalledWith({
                    query: 'foobar',
                    forceAll: true,
                    combo: component,
                    cancel: false
                }, {});
                expect(component.lastQuery).toBeDefined();
            });
            it("should not query if a 'beforequery' handler returns false", function() {
                makeComponent();
                component.on('beforequery', function() {
                    return false;
                });
                expect(component.lastQuery).not.toBeDefined();
            });
            it("should not query if a 'beforequery' handler sets the query event object's cancel property to true", function() {
                makeComponent();
                component.on('beforequery', function(qe) {
                    qe.cancel = true;
                });
                expect(component.lastQuery).not.toBeDefined();
            });
        });

        describe("minChars config", function() {
            it("should not query if the number of entered chars is less than the minChars config", function() {
                makeComponent({
                    minChars: 100
                });
                component.doQuery('foobar');
                expect(component.lastQuery).not.toBeDefined();
            });
            it("should ignore the minChars if forceAll = true", function() {
                makeComponent({
                    minChars: 100
                });
                component.doQuery('foobar', true);
                expect(component.lastQuery).toBeDefined();
            });
        });

        it("should expand the dropdown", function() {
            makeComponent();
            spyOn(component, 'expand');
            component.doQuery('foobar');
            expect(component.expand).toHaveBeenCalled();
        });
    });


    describe("doRawQuery method", function() {
        it("should call the doQuery method with the contents of the field", function() {
            makeComponent({
                renderTo: Ext.getBody()
            });
            spyOn(component, 'doQuery');
            component.inputEl.dom.value = 'foobar';
            component.doRawQuery();
            expect(component.doQuery).toHaveBeenCalledWith('foobar');
        });
    });


    describe("trigger click", function() {
        it("should perform an 'all' query with the allQuery config if triggerAction='all'", function() {
            makeComponent({
                renderTo: Ext.getBody(),
                triggerAction: 'all',
                allQuery: 'the-all-query'
            });
            spyOn(component, 'doQuery');
            component.onTriggerClick();
            expect(component.doQuery).toHaveBeenCalledWith('the-all-query', true);
        });
        it("should perform a query with the current field value if triggerAction='query'", function() {
            makeComponent({
                renderTo: Ext.getBody(),
                triggerAction: 'query',
                allQuery: 'the-all-query',
                value: 'value 2',
                valueField: 'val'
            });
            spyOn(component, 'doQuery');
            component.onTriggerClick();
            expect(component.doQuery).toHaveBeenCalledWith('text 2');
        });
    });


    describe("keyboard input", function() {
        beforeEach(function() {
            makeComponent({
                renderTo: Ext.getBody(),
                queryMode: 'local',
                valueField: 'val',
                queryDelay: 1
            });
        });

        it("should initiate a query after the queryDelay", function() {
            runs(function() {
                spyOn(component, 'doQuery');
                component.inputEl.dom.value = 'foob';
                jasmine.fireKeyEvent(component.inputEl.dom, 'keyup', 66);
            });
            waitsFor(function() {
                return component.doQuery.callCount > 0;
            }, 'query not executed');
            runs(function() {
                expect(component.doQuery.mostRecentCall.args).toEqual(['foob']);
            });
        });
        it("should not respond to special keys", function() {
            runs(function() {
                spyOn(component, 'doQuery');
                component.inputEl.dom.value = 'foob';
                jasmine.fireKeyEvent(component.inputEl.dom, 'keyup', Ext.EventObject.DOWN);
            });
            waits(10);
            runs(function() {
                expect(component.doQuery).not.toHaveBeenCalled();
            })
        });
        it("should respond to backspace", function() {
            runs(function() {
                spyOn(component, 'doQuery');
                component.inputEl.dom.value = 'foob';
                jasmine.fireKeyEvent(component.inputEl.dom, 'keyup', Ext.EventObject.BACKSPACE);
            });
            waitsFor(function() {
                return component.doQuery.callCount > 0;
            }, 'query not executed');
        });
        it("should respond to delete", function() {
            runs(function() {
                spyOn(component, 'doQuery');
                component.inputEl.dom.value = 'foob';
                jasmine.fireKeyEvent(component.inputEl.dom, 'keyup', Ext.EventObject.DELETE);
            });
            waitsFor(function() {
                return component.doQuery.callCount > 0;
            }, 'query not executed');
        });
    });


});