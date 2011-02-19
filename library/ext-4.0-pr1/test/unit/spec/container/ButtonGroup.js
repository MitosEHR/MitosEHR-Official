describe("Ext.container.ButtonGroup", function() {

    var group;

    beforeEach(function() {
        this.addMatchers({
            toHaveClass: function(cls) {
                return Ext.fly(this.actual).hasCls(cls);
            }
        });
    });

    afterEach(function() {
        if (group) {
            group.destroy();
            group = null;
        }
    });

    function createButtonGroup(config) {
        group = new Ext.container.ButtonGroup(config || {});
        return group;
    }


    describe("Structure and creation", function() {
        it("should extend Ext.Panel", function() {
            expect(createButtonGroup() instanceof Ext.Panel).toBeTruthy();
        });

        it("should allow instantiation via the 'buttongroup' xtype", function() {
            var panel = new Ext.Panel({
                items: [{
                    xtype: 'buttongroup'
                }]
            });
            expect(panel.items.getAt(0) instanceof Ext.container.ButtonGroup).toBeTruthy();
        });
    });


    describe("Layout", function() {
        it("should default to table layout", function() {
            createButtonGroup();
            expect(group.getLayout() instanceof Ext.layout.container.Table).toBeTruthy();
        });

        it("should allow overriding the layout", function() {
            createButtonGroup({
                layout: {type: 'hbox'}
            });
            expect(group.getLayout() instanceof Ext.layout.container.HBox).toBeTruthy();
        });
        
        // TODO: move this spec to a future TableLayout test suite
        xit("should default to one table row", function() {
            createButtonGroup({
                items: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
                renderTo: Ext.getBody()
            });

            expect(group.el.select('tr').getCount()).toEqual(1);
            expect(group.el.select('tr').item(0).select('td').getCount()).toEqual(10);
        });

        it("should honor a 'columns' config property", function() {
            createButtonGroup({
                columns: 5,
                items: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
                renderTo: Ext.getBody()
            });
            
            expect(group.getLayout().columns).toEqual(5);
        });
    });


    describe("Children", function() {
        it("should default child items to an xtype of 'button'", function() {
            createButtonGroup({
                items: [
                    {},
                    {type: 'splitbutton'}
                ]
            });

            expect(group.items.getAt(0).type).toEqual('button');
            expect(group.items.getAt(1).type).toEqual('splitbutton');
        });
    });


    describe("Title", function() {
        it("should have no title by default", function() {
            createButtonGroup({
                renderTo: Ext.getBody()
            });

            expect(group.title).not.toBeDefined();
            expect(group.el.select('.x-btn-group-header').getCount()).toEqual(0);
        });

        it("should allow configuring a title", function() {
            createButtonGroup({
                title: 'Group Title',
                renderTo: Ext.getBody()
            });

            expect(group.title).toEqual('Group Title');
            expect(group.el.select('.x-btn-group-header').getCount()).toEqual(1);
            expect(Ext.util.Format.trim(group.el.select('.x-btn-group-header-text').item(0).dom.innerHTML)).toEqual('Group Title');
        });
    });


    describe("Element classes", function() {
        it("should have a className of 'x-btn-group-notitle' when no title is configured", function() {
            createButtonGroup({
                renderTo: Ext.getBody()
            });

            expect(group.el).toHaveClass('x-btn-group-notitle');
        });

        it("should not have a className of 'x-btn-group-notitle' when a title is configured", function() {
            createButtonGroup({
                title: 'Group Title',
                renderTo: Ext.getBody()
            });

            expect(group.el).not.toHaveClass('x-btn-group-notitle');
        });

        it("should have a className of 'x-btn-group' by default", function() {
            createButtonGroup({
                renderTo: Ext.getBody()
            });

            expect(group.el).toHaveClass('x-btn-group');
        });

        it("should allow overriding the baseCls", function() {
            createButtonGroup({
                baseCls: 'x-test',
                renderTo: Ext.getBody()
            });

            expect(group.el).not.toHaveClass('x-btn-group');
            expect(group.el).toHaveClass('x-test');
        });
    });


    describe("Framing", function() {
        it("should default to having a frame", function() {
            createButtonGroup({
                renderTo: Ext.getBody()
            });

            expect(group.frame).toBeTruthy();

            expect(group.el).toHaveClass('x-btn-group-framed')
        });

        it("should allow turning off the frame", function() {
            createButtonGroup({
                frame: false,
                renderTo: Ext.getBody()
            });

            expect(group.frame).toBeFalsy();
            expect(group.el).not.toHaveClass('x-btn-group-frame')
        });
    });

});
