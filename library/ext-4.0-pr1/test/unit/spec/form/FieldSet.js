describe("Ext.form.FieldSet", function() {
    var component, makeComponent;
    
    beforeEach(function() {
        makeComponent = function(config) {
            config = config || {};
            Ext.apply(config, {
                renderTo: Ext.getBody(),
                name: 'test'
            });
            component = new Ext.form.FieldSet(config);
        };
    });
    
    afterEach(function() {
        if (component) {
            component.destroy();
        }
        component = makeComponent = null;
    });

    describe("defaults", function() {
        beforeEach(function() {
            makeComponent({});
        });
        it("should default to no title", function() {
            expect(component.title).not.toBeDefined();
        });
        it("should default to falsy checkboxToggle", function() {
            expect(component.checkboxToggle).toBeFalsy();
        });
        it("should default to no checkboxName", function() {
            expect(component.checkboxName).not.toBeDefined();
        });
        it("should default to not collapsible", function() {
            expect(component.collapsible).toBeFalsy();
        });
        it("should default to not collapsed", function() {
            expect(component.collapsed).toBeFalsy();
        });
        it("should default to anchor layout", function() {
            expect(component.layout.type).toEqual('anchor');
        });
    });
    
    describe("rendering", function(){
        it("should have a fieldset as the main element", function(){
            makeComponent();
            expect(component.el.dom.tagName.toLowerCase()).toEqual("fieldset");    
        });

        it("should give the fieldset a class of 'x-fieldset'", function(){
            makeComponent();
            expect(component.el.dom.tagName.toLowerCase()).toEqual("fieldset");
        });

        it("should create a body element with class 'x-fieldset-body'", function() {
            makeComponent();
            expect(component.body).toBeDefined();
            expect(component.body.hasCls('x-fieldset-body')).toBeTruthy();
        });
    });

    describe("legend", function() {
        it ("should not create the legend component by default", function() {
            makeComponent({});
            expect(component.legend).not.toBeDefined();
        });
        
        it("should create a legend component when the 'title' config is set", function(){
            makeComponent({
                title: "Foo"
            });
            expect(component.legend).toBeDefined();
        });
            
        it("should create a legend component when the 'checkboxToggle' config is true", function(){
            makeComponent({
                checkboxToggle: true
            });
            expect(component.legend).toBeDefined();
        });

        it("should create a legend element for the legend component", function() {
            makeComponent({
                title: "Foo"
            });
            expect(component.legend.el.dom.tagName.toLowerCase()).toEqual('legend');
        });

        it("should give the legend element a class of 'x-fieldset-header'", function() {
            makeComponent({
                title: "Foo"
            });
            expect(component.legend.el.hasCls('x-fieldset-header')).toBeTruthy();
        });

        describe("title", function() {
            it("should create a title component when title config is used", function(){
                makeComponent({
                    title: "Foo"
                });
                expect(component.titleCmp).toBeDefined();
            });
            it("should set the title component's content to the title config value", function(){
                makeComponent({
                    title: "Foo"
                });
                expect(component.titleCmp.el.dom.innerHTML).toEqual("Foo");
            });
            it("should give the title component's element a class of 'x-fieldset-header-text'", function(){
                makeComponent({
                    title: "Foo"
                });
                expect(component.titleCmp.el.hasCls('x-fieldset-header-text')).toBeTruthy();
            });
        });

        describe("checkbox", function() {
            it("should not create a checkbox component by default", function() {
                makeComponent({
                    title: 'Foo'
                });
                expect(component.legend.down('checkboxfield')).toBeNull();
            });

            it("should create a checkbox component when the checkboxToggle config is true", function() {
                makeComponent({
                    title: 'Foo',
                    checkboxToggle: true
                });
                expect(component.legend.down('checkboxfield')).not.toBeNull();
            });

            it("should give the checkbox a class of 'x-fieldset-header-checkbox'", function() {
                makeComponent({
                    title: 'Foo',
                    checkboxToggle: true
                });
                expect(component.legend.down('checkboxfield').el.hasCls('x-fieldset-header-checkbox')).toBeTruthy();
            });

            it("should set the checkbox's name to the 'checkboxName' config", function() {
                makeComponent({
                    title: 'Foo',
                    checkboxToggle: true,
                    checkboxName: 'theCheckboxName'
                });
                expect(component.legend.down('checkboxfield').name).toEqual('theCheckboxName');
            });

            it("should set the checkbox's name to '[fieldset_id]-checkbox' if the 'checkboxName' config is not set", function() {
                makeComponent({
                    title: 'Foo',
                    checkboxToggle: true
                });
                expect(component.legend.down('checkboxfield').name).toEqual(component.id + '-checkbox');
            });

            it("should set the checkbox to checked by default if the collapsed config is not true", function() {
                makeComponent({
                    title: 'Foo',
                    checkboxToggle: true
                });
                expect(component.legend.down('checkboxfield').getValue()).toBeTruthy();
            });

            it("should set the checkbox to unchecked by default if the collapsed config is true", function() {
                makeComponent({
                    title: 'Foo',
                    checkboxToggle: true,
                    collapsed: true
                });
                expect(component.legend.down('checkboxfield').getValue()).toBeFalsy();
            });
        });

        it("should be included in ComponentQuery searches from the fieldset container", function() {
            makeComponent({
                title: "Foo",
                checkboxToggle: true,
                checkboxName: 'theCheckboxName'
            });
            expect(component.down('[name=theCheckboxName]')).not.toBeNull();
        });
    });


    describe("collapse method", function() {
        it("should set the 'collapsed' property to true", function() {
            makeComponent({collapsed: false});
            component.collapse();
            expect(component.collapsed).toBeTruthy();
        });

        it("should uncheck the checkboxToggle", function() {
            makeComponent({collapsed: false, checkboxToggle: true});
            component.collapse();
            expect(component.legend.down('checkboxfield').getValue()).toBeFalsy();
        });

        it("should give the main element a class of 'x-fieldset-collapsed'", function() {
            makeComponent({collapsed: false});
            component.collapse();
            expect(component.el.hasCls('x-fieldset-collapsed')).toBeTruthy();
        });
    });

    describe("expand method", function() {
        it("should set the 'collapsed' property to false", function() {
            makeComponent({collapsed: true});
            component.expand();
            expect(component.collapsed).toBeFalsy();
        });

        it("should check the checkboxToggle", function() {
            makeComponent({collapsed: true, checkboxToggle: true});
            component.expand();
            expect(component.legend.down('checkboxfield').getValue()).toBeTruthy();
        });

        it("should remove the 'x-fieldset-collapsed' class from the main element", function() {
            makeComponent({collapsed: true});
            component.expand();
            expect(component.el.hasCls('x-fieldset-collapsed')).toBeFalsy();
        });
    });

    describe('toggle method', function() {
        it("should collapse the fieldset if it is expanded", function() {
            makeComponent({collapsed: false});
            component.toggle();
            expect(component.el.hasCls('x-fieldset-collapsed')).toBeTruthy();
        });

        it("should expand the fieldset if it is collapsed", function() {
            makeComponent({collapsed: true});
            component.toggle();
            expect(component.el.hasCls('x-fieldset-collapsed')).toBeFalsy();
        });
    });

    describe("setTitle method", function() {
        it("should set the legend title to the argument value", function() {
            makeComponent({title: 'Old and busted'});
            component.setTitle('New hotness');
            expect(component.titleCmp.el.dom.innerHTML).toEqual('New hotness');
        });
    });

});
