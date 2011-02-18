describe("Ext.tip.QuickTips", function() {

    beforeEach(function() {
        Ext.tip.QuickTips.destroy();
    });
    
    afterEach(function() {
        Ext.tip.QuickTips.destroy();
    });

    describe("init", function() {
        // Just in case a previous test called init
        Ext.tip.QuickTips.destroy();

        it("should create a new Ext.QuickTip instance", function() {
            expect(Ext.tip.QuickTips.getQuickTip()).not.toBeDefined();
            Ext.tip.QuickTips.init();
            expect(Ext.tip.QuickTips.getQuickTip()).toBeDefined();
            expect(Ext.tip.QuickTips.getQuickTip() instanceof Ext.tip.QuickTip).toBeTruthy();
        });

        it("should automatically render by default", function() {
            Ext.tip.QuickTips.init();
            expect(Ext.tip.QuickTips.getQuickTip().rendered).toBeTruthy();
        });

        it("should automatically render if the 'autorender' param is true", function() {
            Ext.tip.QuickTips.init(true);
            expect(Ext.tip.QuickTips.getQuickTip().rendered).toBeTruthy();
        });

        it("should not automatically render if the 'autorender' param is false", function() {
            Ext.tip.QuickTips.init(false);
            expect(Ext.tip.QuickTips.getQuickTip().rendered).toBeFalsy();
        });
    });

    describe("destroy", function() {
        it("should destroy the QuickTip instance", function() {
            Ext.tip.QuickTips.init();
            Ext.tip.QuickTips.destroy();
            expect(Ext.tip.QuickTips.getQuickTip()).not.toBeDefined();
        });
    });

    describe("disable", function() {
        it("should disable the QuickTip instance", function() {
            Ext.tip.QuickTips.init();
            Ext.tip.QuickTips.disable();
            expect(Ext.tip.QuickTips.getQuickTip().disabled).toBeTruthy();
        });
    });

    describe("ddDisable", function() {
        it("should disable the QuickTip instance", function() {
            Ext.tip.QuickTips.init();
            Ext.tip.QuickTips.ddDisable();
            expect(Ext.tip.QuickTips.getQuickTip().disabled).toBeTruthy();
        });
    });

    describe("enable", function() {
        it("should enable the QuickTip instance", function() {
            Ext.tip.QuickTips.init();
            Ext.tip.QuickTips.enable();
            expect(Ext.tip.QuickTips.getQuickTip().disabled).toBeFalsy();
        });
    });

    describe("ddEnable", function() {
        it("should enable the QuickTip instance", function() {
            Ext.tip.QuickTips.init();
            Ext.tip.QuickTips.ddEnable();
            expect(Ext.tip.QuickTips.getQuickTip().disabled).toBeFalsy();
        });
    });

    describe("isEnabled", function() {
        it("should enable the QuickTip instance", function() {
            Ext.tip.QuickTips.init();
            Ext.tip.QuickTips.enable();
            expect(Ext.tip.QuickTips.isEnabled()).toBeTruthy();
            Ext.tip.QuickTips.disable();
            expect(Ext.tip.QuickTips.isEnabled()).toBeFalsy();
        });
    });

    describe("register", function() {
        // this gets tested more thoroughly in QuickTip.js, here just ensure it calls through
        it("should call the QuickTip's register method", function() {
            Ext.tip.QuickTips.init();
            var spy = spyOn(Ext.tip.QuickTips.getQuickTip(), 'register'),
                arg = {};
            Ext.tip.QuickTips.register(arg);
            expect(spy).toHaveBeenCalledWith(arg);
        });
    });

    describe("unregister", function() {
        // this gets tested more thoroughly in QuickTip.js, here just ensure it calls through
        it("should call the QuickTip's unregister method", function() {
            Ext.tip.QuickTips.init();
            var spy = spyOn(Ext.tip.QuickTips.getQuickTip(), 'unregister'),
                arg = Ext.getBody();
            Ext.tip.QuickTips.unregister(arg);
            expect(spy).toHaveBeenCalledWith(arg);
        });
    });

});
