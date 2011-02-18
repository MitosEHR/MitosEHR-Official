describe("Ext.tip.Tip", function() {

    var tip;

    function createTip(config) {
        tip = new Ext.tip.Tip(config || {});
        return tip;
    }

    beforeEach(function() {
        this.addMatchers({
            toHaveClass: function(cls) {
                return Ext.fly(this.actual).hasCls(cls);
            }
        });
    });

    afterEach(function() {
        if (tip) {
            tip.destroy();
            tip = null;
        }
    });


    describe("basic", function() {
        it("should extend Ext.Panel", function() {
            createTip();
            expect(tip instanceof Ext.Panel).toBeTruthy();
        });

        it("should be automatically rendered when shown", function() {
            createTip().show();
            expect(tip.el).toBeDefined();
            expect(tip.el.dom.parentNode).toBe(Ext.getBody().dom);
        });

        it("should be given a class of 'x-tip' on its main element", function() {
            createTip().show();
            expect(tip.el).toHaveClass('x-tip');
        });
    });


    describe("showAt", function() {
        it("should show the tip at the specified x/y coordinates", function() {
            createTip().showAt([100, 50]);
            var xy = tip.el.getXY();
            expect(xy[0]).toEqual(100);
            expect(xy[1]).toEqual(50);
        });

        it("should not be constrained to the viewport by default", function() {
            var viewportWidth = Ext.core.Element.getViewportWidth(),
                viewportHeight = Ext.core.Element.getViewportHeight();
            createTip().showAt([viewportWidth + 1, viewportHeight + 1]);
            var xy = tip.el.getXY();
            expect(xy[0]).toEqual(viewportWidth + 1);
            expect(xy[1]).toEqual(viewportHeight + 1);
        });

        it("should be constrained to the viewport if 'constrainPosition' config is true", function() {
            var viewportWidth = Ext.core.Element.getViewportWidth(),
                viewportHeight = Ext.core.Element.getViewportHeight();
            createTip({constrainPosition: true}).showAt([viewportWidth + 1, viewportHeight + 1]);
            var xy = tip.el.getXY();
            expect(xy[0]).not.toEqual(viewportWidth + 1);
            expect(xy[1]).not.toEqual(viewportHeight + 1);
        });
    });

    describe("draggable", function() {
        it("should attach a Ext.util.ComponentDragger instance to the tip", function() {
            createTip({draggable: true, title: 'Title'}).showAt(0, 0);
            expect(tip.dd).toBeDefined();
            expect(tip.dd instanceof Ext.util.ComponentDragger).toBeTruthy();
            expect(tip.dd.handle.id).toEqual(tip.header.el.id);
        });

        it("should add an 'x-tip-header-draggable' class to the tip header", function() {
            createTip({draggable: true, title: 'Title'}).show();
            expect(tip.header.el).toHaveClass('x-tip-header-draggable');
        });
    });


    describe("closable", function() {
        it("should not have a close button by default", function() {
            createTip().show();
            expect(tip.header).not.toBeDefined();
        });

        it("should add a close button when 'closable' config is true", function() {
            createTip({closable: true}).show();
            expect(tip.header).toBeDefined();
            expect(tip.header.items.findBy(function(item) {
                return item.toolEl && item.type === 'close';
            })).not.toBeNull();
        });

        it("should give the main tip element a class of 'x-tip-closable'", function() {
            createTip({closable: true}).show();
            expect(tip.el).toHaveClass('x-tip-closable');
        });
    });


    describe("title", function() {
        it("should have no title by default", function() {
            createTip().show();
            expect(tip.header).not.toBeDefined();
        });

        it("should display a configured title as header text", function() {
            createTip({title: 'Tip Title'}).show();
            expect(tip.header).toBeDefined();
            expect(tip.header.titleCmp).toBeDefined();
            expect(tip.header.titleCmp.textEl.dom.innerHTML).toEqual('Tip Title');
        });
    });


    describe("content", function() {
        it("should display the configured html value", function() {
            createTip({html: 'Tip Body Text'}).show();
            expect(tip.body.dom.innerHTML).toEqual('Tip Body Text');
        });
    });


    describe("widths", function() {
        it("should allow setting an explicit width", function() {
            createTip({width: 200}).show();
            expect(tip.el.getWidth()).toEqual(200);
        });

        it("should default to automatic width", function() {
            createTip({html: '<div style="width: 200px;">x</div>'}).show();
            expect(tip.el.getWidth()).toEqual(200 + tip.el.getFrameWidth('lr') + tip.body.getFrameWidth('lr'));
        });

        it("should constrain the automatic width to at or above the configured minWidth", function() {
            createTip({html: '<div style="width: 20px;">x</div>', minWidth: 60}).show();
            expect(tip.el.getWidth()).toEqual(tip.minWidth);
        });
        
        it("should constrain the automatic width to at or below the configured maxWidth", function() {
            createTip({html: '<div style="width: 2000px;">x</div>'}).show();
            expect(tip.el.getWidth()).toEqual(tip.maxWidth);
        });
    });


});
