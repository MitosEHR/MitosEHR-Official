describe("Ext.Button", function() {
    var proto = Ext.Button.prototype,
        button, makeButton;
    
    beforeEach(function() {
        makeButton = function(config) {
            button = new Ext.Button(Ext.apply({
                text: 'Button'
            }, config || {}));
        };
    });
    
    afterEach(function() {
        if (button) {
            button.destroy();
        }
        button = makeButton = null;
    });
    
    it("should be isButton", function() {
        expect(proto.isButton).toBeTruthy();
    });
    
    it("should not be hidden", function() {
        expect(proto.hidden).toBeFalsy();
    });
    
    it("should not be disabled", function() {
        expect(proto.disabled).toBeFalsy();
    });
    
    it("should not be pressed", function() {
        expect(proto.pressed).toBeFalsy();
    });
    
    it("should not enableToggle", function() {
        expect(proto.enableToggle).toBeFalsy();
    });
    
    it("should have a menuAlign", function() {
        expect(proto.menuAlign).toEqual('tl-bl?');
    });
    
    it("should have a type", function() {
        expect(proto.type).toEqual('button');
    });
    
    it("should have a clickEvent", function() {
        expect(proto.clickEvent).toEqual('click');
    });
    
    it("should handleMouseEvents", function() {
        expect(proto.handleMouseEvents).toBeTruthy();
    });
    
    it("should have a tooltipType", function() {
        expect(proto.tooltipType).toEqual('qtip');
    });
    
    it("should have a baseCls", function() {
        expect(proto.baseCls).toEqual('x-btn');
    });
    
    it("should have a pressedCls after rendering", function() {
        makeButton();
        expect(button.pressedCls).not.toBeDefined();
        button.render(document.body);
        expect(button.pressedCls).toEqual('x-btn-' + button.ui + '-pressed');
    });
    
    it("should have a ariaRole", function() {
        expect(proto.ariaRole).toEqual('button');
    });
    
    it("should return a renderTpl", function() {
        expect(proto.renderTpl).toBeDefined();
    });
    
    it("should have a scale", function() {
        expect(proto.scale).toEqual('small');
    });
    
    it("should have a ui", function() {
        expect(proto.ui).toEqual('default');
    });
        
    it("should have an iconAlign", function() {
        expect(proto.iconAlign).toEqual('left');
    });
    
    it("should have a arrowAlign", function() {
        expect(proto.arrowAlign).toEqual('right');
    });
    
    describe("initComponent", function() {
        // TODO add initComponent specs for button.menu
        
        describe("toggleGroup", function() {
            it("if defined, it should enableToggle", function() {
                makeButton({
                    toggleGroup: 'testgroup'
                });
                
                expect(button.enableToggle).toBeTruthy();
            });
        });
    });
    
    // TODO complete initAria spec for button.menu
    xdescribe("initAria", function() {
        
    });
    
    describe("getActionEl", function() {
        beforeEach(function() {
            makeButton({renderTo:Ext.getBody()});
        });
        
        it("should return btnEl", function() {
            expect(button.getActionEl()).toEqual(button.btnEl);
        });
    });
    
    describe("setButtonCls", function() {
        describe("when no icon", function() {
            beforeEach(function() {
                makeButton({renderTo:Ext.getBody()});
            });
            
            it("should set the dom className", function() {
                expect(button.el.hasCls('x-btn-default-small-noicon')).toBeTruthy();
            });
        });
        
        describe("when icon and text", function() {
            beforeEach(function() {
                makeButton({
                    icon: 'test',
                    setIcon: jasmine.createSpy(), //block icon img request
                    renderTo: Ext.getBody()
                });
            });
            
            it("should set the dom className", function() {
                expect(button.el.hasCls('x-btn-text-icon')).toBeTruthy();
            });
        });
        
        describe("when icon and no text", function() {
            beforeEach(function() {
                makeButton({
                    text: null,
                    icon: 'test',
                    setIcon: jasmine.createSpy(), //block icon img request
                    renderTo: Ext.getBody()
                });
            });
            
            it("should set the dom className", function() {
                expect(button.el.hasCls('x-btn-icon')).toBeTruthy();
            });
        });
        
        describe("when pressed", function() {
            beforeEach(function() {
                makeButton({
                    pressed: true,
                    
                    renderTo: Ext.getBody()
                });
            });
            
            it("should set the dom className", function() {
                expect(button.el.hasCls(button.pressedCls)).toBeTruthy();
            });
        });
    });
});
