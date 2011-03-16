describe("Ext.tab.TabBar", function() {
    var tabBar;
    
    function createTabBar(config) {
        return Ext.createWidget('tabbar', Ext.apply({}, config));
    }
    
    function doClick(targetId, tab) {
        tabBar.onClick({
            // mock event object can go here if needed
            getTarget: function() {
                return (tab) ? tab.el : null;
            }
        }, {
            // target el
            id: targetId
        });
    }
    
    describe("layout", function() {
        var layout;
        
        beforeEach(function() {
            tabBar = createTabBar();
            layout = tabBar.layout;
        });
        
        it("should be hbox by default", function() {
            expect(layout.type).toEqual('hbox');
        });
        
        it("should have pack start by default", function() {
            expect(layout.pack).toEqual('start');
        });
    });
    
    describe("closing a tab", function() {
        var tab, card, tabPanel;
        
        beforeEach(function() {
            card = {
                title: 'Some Card'
            };
            
            tabPanel = {
                remove: jasmine.createSpy()
            };
            
            tab = new Ext.tab.Tab({
                card: card
            });
            
            tabBar = createTabBar({
                tabPanel: tabPanel
            });
            
            tabBar.add(tab);
            
            spyOn(tabBar, 'remove').andReturn(true);
            
            tabBar.closeTab(tab);
        });
        
        it("should remove the tab from the tabBar", function() {
            expect(tabBar.remove).toHaveBeenCalledWith(tab);
        });
        
        it("should remove the card from the tabPanel", function() {
            expect(tabPanel.remove).toHaveBeenCalledWith(card);
        });
    });
    
    describe("clicking on a tab", function() {
        var tab, cardLayout;
        
        describe("if the tab is enabled", function() {
            beforeEach(function() {
                cardLayout = {
                    setActiveItem: jasmine.createSpy()
                };
                
                tabBar = createTabBar({
                    cardLayout: cardLayout
                });
                
                tabBar.add({
                    xtype: 'tab',
                    id: 'tab1',
                    card: {
                        some: 'card'
                    },
                    tabBar: tabBar
                });
                
                tabBar.render(document.body);
                
                tab = tabBar.getComponent('tab1');
                
                spyOn(tabBar, 'setActiveTab').andCallThrough();
            });
            
            afterEach(function() {
                tabBar.destroy();
            });
            
            it("should call setActiveTab", function() {
                doClick('tab1', tab);
                expect(tabBar.setActiveTab).toHaveBeenCalledWith(tab);
            });
            
            it("should fire the 'change' event", function() {
                var called = false;
                
                tabBar.on('change', function() {
                    called = true;
                }, this);
                
                doClick('tab1');
                expect(called).toBeTruthy();
            });
            
            xit("should set the cardLayout's card to the tab's card", function() {
                doClick('tab1');
                /*
                 * Currently the layout is not called if the component is not rendered
                 * because it causes a null error inside CardLayout. This is either a
                 * change in behavior or a bug in the layout, but either way it invalidates
                 * this test for the time being...
                 */
                expect(cardLayout.setActiveItem).toHaveBeenCalledWith(tab.card);
            });
            
            describe("the 'change' event", function() {
                var args;
                
                beforeEach(function() {
                    tabBar.on('change', function() {
                        args = arguments;
                    }, this);

                    doClick('tab1');
                });
                
                it("should have a reference to the tabBar", function() {
                    expect(args[0]).toEqual(tabBar);
                });
                
                it("should have a reference to the tab", function() {
                    expect(args[1]).toEqual(tab);
                });
                
                it("should have a reference to the tab's card", function() {
                    expect(args[2]).toEqual(tab.card);
                });
            });
        });
        
        describe("if the tab disabled config is true", function() {
            var cardLayout, tab1, tab2;
            
            beforeEach(function() {
                cardLayout = {
                    setActiveItem: jasmine.createSpy()
                };
                
                tabBar = createTabBar({
                    cardLayout: cardLayout
                });
                
                tabBar.add({
                    xtype: 'tab',
                    id: 'tab1',
                    card: {
                        some: 'card'
                    },
                    tabBar: tabBar
                },{
                    xtype: 'tab',
                    id: 'tab2',
                    disabled: true,
                    card: {
                        other: 'card'
                    },
                    tabBar: tabBar
                });
                
                tab1 = tabBar.items.items[0];
                tab2 = tabBar.items.items[1];
            });
            
            it("should set the tab instance to disabled", function(){
                expect(tabBar.getComponent('tab2').disabled).toBe(true);
            });
            
            it("should not call setActiveItem on the layout", function() {
                doClick('tab2');
                expect(cardLayout.setActiveItem).not.toHaveBeenCalled();
            });
        });
    });
    
    describe("setting the active tab", function() {
        var tab;
        
        beforeEach(function() {
            tabBar = createTabBar();
            
            tabBar.add({
                xtype: 'tab',
                card: {
                    some: 'card'
                },
                tabBar: tabBar
            });
            
            tab = tabBar.getComponent(0);
        });
        
        it("should set the activeTab property to that tab", function() {
            tabBar.setActiveTab(tab);
            
            expect(tabBar.activeTab).toEqual(tab);
        });
    });
});
