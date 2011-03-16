describe("Ext.tab.TabPanel", function() {
    var tabPanel, fakeTabBar;
    
    function createTabPanel(config) {
        //tabPanel = new Ext.TabPanel(Ext.apply({}, config));
        tabPanel = Ext.create('Ext.tab.TabPanel', Ext.apply({}, config));
        return tabPanel;
    }
    
    //creates a tab panel with x children
    function createTabPanelWithTabs(count, config) {
        var items = [];
        
        for (var i = 0; i < count; i++) {
            items[i] = {
                xtype: 'panel',
                html : 'test ' + (i + 1)
            };
        }
       
        return createTabPanel(Ext.apply({}, config, {
            items: items
        }));
    }
    
    afterEach(function() {
        if (tabPanel) {
            tabPanel.destroy();
            tabPanel = null;
        }
    });
    
    describe("the tabBar", function() {
        beforeEach(function() {
            fakeTabBar = {
                something: 'yea'
            };
        });
        
        it("should be referenced as .tabBar", function() {
            createTabPanel();
            expect(tabPanel.tabBar).toBeDefined();
        });
        
        it("should be docked to the top", function() {
            createTabPanel();
            expect(tabPanel.tabBar.dock).toEqual('top');
        });
        
        it("should be given a reference to the TabPanel's CardLayout", function() {
            createTabPanel();
            expect(tabPanel.tabBar.cardLayout).toEqual(tabPanel.layout);
        });
        
        it("should be accessible through getTabBar()", function() {
            createTabPanel();
            expect(tabPanel.getTabBar()).toBeDefined();
        });
        
        it("should accept additional config", function() {
            createTabPanel({
                tabBar: {
                    someConfig: 'something'
                }
            });
            
            expect(tabPanel.tabBar.someConfig).toEqual('something');
        });
        
        describe("if there were no other dockedItems", function() {
            beforeEach(function() {
                createTabPanel();
            });

            it("should create the dockedItems MixedCollection", function() {
                expect(tabPanel.dockedItems instanceof Ext.util.MixedCollection).toBe(true);
            });
            
            it("should place the tabBar in the array", function() {
                expect(tabPanel.dockedItems.items[0]).toEqual(tabPanel.tabBar);
            });
        });
        
        describe("if there was an array of dockedItems", function() {
            beforeEach(function() {
                createTabPanel({
                    dockedItems: [
                        {
                            xtype: 'panel',
                            html : 'test',
                            dock : 'top'
                        }
                    ]
                });
            });
            
            it("should add the tabBar to the dockedItems", function() {
                expect(tabPanel.dockedItems.length).toEqual(2);
            });
            
            it("should place the tabBar as the last item in the array", function() {
                expect(tabPanel.dockedItems.items[1]).toEqual(tabPanel.tabBar);
            });
        });
        
        describe("if there was a single dockedItem, not in an array", function() {
            beforeEach(function() {
                createTabPanel({
                    dockedItems: {
                        xtype: 'panel',
                        html : 'test',
                        dock : 'top'
                    }
                });
            });
            
            it("should turn the dockedItems into an array", function() {
                expect(tabPanel.dockedItems instanceof Ext.util.MixedCollection).toBe(true);
            });
            
            it("should add the tabBar to the dockedItems", function() {
                expect(tabPanel.dockedItems.length).toEqual(2);
            });
            
            it("should place the tabBar as the last item in the array", function() {
                expect(tabPanel.dockedItems.items[1]).toEqual(tabPanel.tabBar);
            });
        });
    });
    
    describe("the layout", function() {
        beforeEach(function() {
            createTabPanel({
                layout: {
                    someConfig: 'something'
                }
            });
        });
        
        it("should be a card layout", function() {
            expect(tabPanel.layout instanceof Ext.layout.CardLayout).toBe(true);
        });
        
        it("should accept additional config", function() {
            expect(tabPanel.layout.someConfig).toEqual('something');
        });
    });
    
    describe("after initialization", function() {
        it("should have created a tab for each child component", function() {
            var count = 0;
            createTabPanelWithTabs(2);
            tabPanel.getTabBar().items.each(function(item) {
                if (item.is('tab')) {
                    count = count + 1;
                }
            });
            expect(count).toEqual(2);
        });
        
        describe("if there was an activeTab config", function() {
            it("should call setActiveTab with the correct item", function() {
                createTabPanelWithTabs(2, {
                    activeTab: 1
                });
                tabPanel.render(document.body);
                expect(tabPanel.getActiveTab()).toEqual(tabPanel.items.items[1]);
            });
        });
    });
    
    describe("adding child components", function() {
        var tabBar;
        
        function addChild() {
            return tabPanel.add({
                xtype: 'panel',
                html : 'New Panel'
            });
        }
        
        beforeEach(function() {
            createTabPanel();
            
            tabBar = tabPanel.getTabBar();
        });
        
        it("should add a new tab to the tabBar", function() {
            var oldCount = tabBar.items.length;
            
            addChild();
            
            expect(tabBar.items.length).toEqual(oldCount + 1);
        });
        
        it("should give the tab a reference to the card", function() {
            var newChild = addChild(),            
                newTab   = tabBar.items.first();
            
            expect(newTab.card).toEqual(newChild);
        });
        
        it("should give the tab a reference to the tabBar", function() {
            var newChild = addChild(),            
                newTab   = tabBar.items.first();
            
            expect(newTab.tabBar).toEqual(tabBar);
        });
    });
    
    describe("setting the active tab", function() {
        var panel, tab, tabBar;
        
        beforeEach(function() {
            createTabPanel();
            tabBar = tabPanel.tabBar;
            
            tab = {
                text: 'Some Tab'
            };
            
            panel = {
                tab: tab,
                title: 'Some Tab'
            };
            
            spyOn(tabPanel, 'getComponent').andReturn(panel);
            spyOn(tabPanel.layout, 'setActiveItem').andReturn(true);
            spyOn(tabBar, 'setActiveTab').andReturn(true);
        });
        
        it("should use getComponent to find the child component", function() {
            tabPanel.setActiveTab(0);
            
            expect(tabPanel.getComponent).toHaveBeenCalledWith(0);
        });
        
        it("should set the tabBar's active item to the tab related to that child", function() {
            tabPanel.setActiveTab(panel);
            
            expect(tabBar.setActiveTab).toHaveBeenCalledWith(tab);
        });
        
        xit("should set the active item in the layout", function() {
            tabPanel.setActiveTab(panel);
            /*
             * Currently the layout is not called if the component is not rendered
             * because it causes a null error inside CardLayout. This is either a
             * change in behavior or a bug in the layout, but either way it invalidates
             * this test for the time being...
             */
            expect(tabPanel.layout.setActiveItem).toHaveBeenCalledWith(panel);
        });
        
        it("should set a reference to the active tab", function() {
            tabPanel.setActiveTab(panel);
            
            expect(tabPanel.activeTab).toEqual(panel);
        });
        
        it("should fire the beforetabchange event", function() {
            var called = false;
            
            tabPanel.on('beforetabchange', function() {
                called = true;
            }, this);
            
            tabPanel.setActiveTab(panel);
            
            expect(called).toBe(true);
        });
        
        it("should fire the tabchange event", function() {
            var called = false;
            
            tabPanel.on('tabchange', function() {
                called = true;
            }, this);
            
            tabPanel.setActiveTab(panel);
            
            expect(called).toBe(true);
        });
        
        describe("the beforetabchange event", function() {
            var args, currentlyActive;
            
            beforeEach(function() {
                currentlyActive = {
                    some: 'card'
                };
                
                spyOn(tabPanel, 'getActiveTab').andReturn(currentlyActive);
                
                tabPanel.on('beforetabchange', function() {
                    args = arguments;
                }, this);

                tabPanel.setActiveTab(panel);
            });
            
            it("should send the tabPanel", function() {
                expect(args[0]).toEqual(tabPanel);
            });
            
            it("should send the new item", function() {
                expect(args[1]).toEqual(panel);
            });
            
            it("should send the currently active tab", function() {
                expect(args[2]).toEqual(currentlyActive);
            });
        });
        
        describe("the tabchange event", function() {
            var args, currentlyActive;
            
            beforeEach(function() {
                currentlyActive = {
                    some: 'card'
                };
                
                spyOn(tabPanel, 'getActiveTab').andReturn(currentlyActive);
                
                tabPanel.on('beforetabchange', function() {
                    args = arguments;
                }, this);

                tabPanel.setActiveTab(panel);
            });
            
            it("should send the tabPanel", function() {
                expect(args[0]).toEqual(tabPanel);
            });
            
            it("should send the new item", function() {
                expect(args[1]).toEqual(panel);
            });
            
            it("should send the old item", function() {
                expect(args[2]).toEqual(currentlyActive);
            });
        });
        
        describe("if any listener returns false to beforetabchange", function() {
            beforeEach(function() {
                tabPanel.on('beforetabchange', function() {
                    return false;
                }, this);
            });
            
            it("should not fire the tabchange event", function() {
                var called = false;

                tabPanel.on('beforetabchange', function() {
                    called = true;
                }, this);

                tabPanel.setActiveTab(panel);

                expect(called).toEqual(false);
            });
        });
    });
    
    describe("removing child components", function() {
        it("should remove the corresponding tab from the tabBar", function() {
            createTabPanelWithTabs(2);
            
            var secondPanel = tabPanel.items.last(),
                tabBar      = tabPanel.getTabBar(),
                oldCount    = tabBar.items.length;
            
            tabPanel.remove(secondPanel);
            
            expect(tabBar.items.length).toEqual(oldCount - 1);
        });
        
        describe("if the removed child is the currently active tab", function() {
            var firstItem, secondItem, thirdItem;

            describe("and there is at least one tab before it", function() {
                beforeEach(function() {
                    createTabPanelWithTabs(3);
                    
                    spyOn(tabPanel.layout, 'setActiveItem').andCallFake(function(item) {
                        tabPanel.layout.activeItem = item;
                    });
                    
                    firstItem  = tabPanel.items.first();
                    secondItem = tabPanel.items.getAt(1);
                    thirdItem = tabPanel.items.last();
                    
                    tabPanel.setActiveTab(secondItem);
                });
                
                it("should activate the next tab", function() {
                    // second is currently active
                    tabPanel.remove(secondItem);
                    expect(tabPanel.getActiveTab()).toEqual(thirdItem);
                });
            });
            
            describe("and there is no tab before it but at least one after it", function() {
                beforeEach(function() {
                    createTabPanelWithTabs(2);
                    
                    spyOn(tabPanel.layout, 'setActiveItem').andCallFake(function(item) {
                        tabPanel.layout.activeItem = item;
                    });
                    
                    firstItem  = tabPanel.items.items[0];
                    secondItem = tabPanel.items.items[1];
                    
                    tabPanel.setActiveTab(firstItem);
                });
                
                it("should activate the next tab", function() {
                    // first is currently active
                    tabPanel.remove(firstItem);
                    expect(tabPanel.getActiveTab()).toEqual(secondItem);
                });
            });
            
            describe("and there are no other tabs", function() {
                beforeEach(function() {
                    createTabPanelWithTabs(1);
                    firstItem = tabPanel.items.first();
                });
                
                it("should not activate any other tabs", function() {
                    tabPanel.remove(firstItem);
                    expect(tabPanel.getActiveTab()).toBeNull();
                });
            });
        });
    });
});
