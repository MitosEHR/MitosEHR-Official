describe("Ext.form.TextArea", function() {
    var component, makeComponent;
    
    beforeEach(function() {
        makeComponent = function(config) {
            config = config || {};
            Ext.applyIf(config, {
                name: 'test'
            });
            component = new Ext.form.TextArea(config);
        };
    });
    
    afterEach(function() {
        if (component) {
            component.destroy();
        }
        /**
         * Need to clear out the shared reference here. Each time
         * the test resets the frame, the element gets removed from'
         * the DOM but the reference is never cleared in TextMetrics 
         * itself.
         */
        Ext.util.TextMetrics.shared = null;
        component = makeComponent = null;
    });



    it("should be registered with the 'textareafield' xtype", function() {
        component = Ext.create("Ext.form.TextArea", {name: 'test'});
        expect(component instanceof Ext.form.TextArea).toBe(true);
        expect(Ext.getClass(component).xtype).toBe("textareafield");
    });


    describe("defaults", function() {
        beforeEach(function() {
            makeComponent();
        });

        it("should have growMin = 60", function() {
            expect(component.growMin).toEqual(60);
        });
        it("should have growMax = 1000", function() {
            expect(component.growMax).toEqual(1000);
        });
        it("should have growAppend = '\n-'", function() {
            expect(component.growAppend).toEqual('\n-');
        });
        it("should have enterIsSpecial = false", function() {
            expect(component.enterIsSpecial).toBe(false);
        });
        it("should have preventScrollbars = false", function() {
            expect(component.preventScrollbars).toBe(false);
        });
    });


    describe("rendering", function() {
        // NOTE this doesn't yet test the main label, error icon, etc. just the parts specific to TextArea.

        beforeEach(function() {
            makeComponent({
                name: 'fieldName',
                value: 'fieldValue',
                tabIndex: 5,
                rows: 10,
                cols: 30,
                renderTo: Ext.getBody()
            });
        });

        describe("bodyEl", function() {
            it("should be a child of the main component el", function() {
                expect(component.bodyEl.dom.parentNode).toBe(component.el.dom);
            });

            it("should be a div", function() {
                expect(component.bodyEl.dom.tagName.toLowerCase()).toEqual('div');
            });

            it("should have the class 'x-form-item-body'", function() {
                expect(component.bodyEl.hasCls('x-form-item-body')).toBe(true);
            });

            it("should have the id 'x-form-item-body-[inputId]'", function() {
                expect(component.bodyEl.dom.id).toEqual('x-form-item-body-' + component.inputId);
            });

            it("should have an aria role of 'presentation'", function() {
                expect(component.bodyEl.dom.getAttribute('role')).toEqual('presentation');
            });
        });

        describe("inputEl", function() {
            it("should be a child of the bodyEl", function() {
                expect(component.inputEl.dom.parentNode).toBe(component.bodyEl.dom);
            });

            it("should be a textarea element", function() {
                expect(component.inputEl.dom.tagName.toLowerCase()).toEqual('textarea');
            });

            it("should have the component's inputId as its id", function() {
                expect(component.inputEl.dom.id).toEqual(component.inputId);
            });

            it("should have the 'fieldCls' config as a class", function() {
                expect(component.inputEl.hasCls(component.fieldCls)).toBe(true);
            });

            it("should have a class of 'x-form-text'", function() {
                expect(component.inputEl.hasCls('x-form-text')).toBe(true);
            });

            it("should have its name set to the 'name' config", function() {
                expect(component.inputEl.dom.name).toEqual('fieldName');
            });

            it("should have its value set to the 'value' config", function() {
                expect(component.inputEl.dom.value).toEqual('fieldValue');
            });

            it("should have autocomplete = 'off'", function() {
                expect(component.inputEl.dom.getAttribute('autocomplete')).toEqual('off');
            });

            it("should have tabindex set to the tabIndex config", function() {
                expect('' + component.inputEl.dom.getAttribute("tabIndex")).toEqual('5');
            });

            it("should have its rows attribute set to the rows config", function() {
                expect('' + component.inputEl.dom.getAttribute("rows")).toEqual('10');
            });

            it("should have its cols attribute set to the cols config", function() {
                expect('' + component.inputEl.dom.getAttribute("cols")).toEqual('30');
            });

            it("should have the aria-multiline attribute set", function() {
                expect('' + component.inputEl.dom.getAttribute("aria-multiline")).toEqual('true');
            });
        });
    });


    describe("autoSize method and grow configs", function() {
        beforeEach(function() {
            makeComponent({
                grow: true,
                growMin: 40,
                growMax: 200
            });
        });

        it("should set the initial textarea height to growMin", function() {
            component.render(Ext.getBody());
            expect(component.inputEl.getHeight()).toEqual(40);
        });

        it("should be called when the field's value is changed", function() {
            component.render(Ext.getBody());
            var spy = spyOn(component, 'autoSize');
            component.setValue('some other value');
            expect(spy).toHaveBeenCalled();
        });

        it("should increase the height of the input as the value becomes taller", function() {
            component.render(Ext.getBody());
            component.setValue('A\nB\nC\nD');
            var height1 = component.inputEl.getHeight();
            component.setValue('A\nB\nC\nD\nE');
            var height2 = component.inputEl.getHeight();
            expect(height2).toBeGreaterThan(height1);
        });

        it("should decrease the height of the input as the value becomes shorter", function() {
            component.render(Ext.getBody());
            component.setValue('A\nB\nC\nD\nE');
            var height1 = component.inputEl.getHeight();
            component.setValue('A\nB\nC\nD');
            var height2 = component.inputEl.getHeight();
            expect(height2).toBeLessThan(height1);
        });

        it("should not increase the height above the growMax config", function() {
            component.render(Ext.getBody());
            component.setValue('A\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nK\nL\nM\nN\nO\nP');
            var height = component.inputEl.getHeight();
            expect(height).toEqual(200);
        });

        it("should not decrease the height below the growMin config", function() {
            component.render(Ext.getBody());
            component.setValue('');
            var height = component.inputEl.getHeight();
            expect(height).toEqual(40);
        });

    });

    describe("preventScrollbars config", function() {
        it("should set overflow:hidden on the textarea if true", function() {
            makeComponent({
                grow: true,
                preventScrollbars: true,
                renderTo: Ext.getBody()
            });
            expect(component.inputEl.dom.style.overflow).toEqual('hidden');
        });
        it("should should do nothing if preventScrollbars is false", function() {
            makeComponent({
                grow: true,
                preventScrollbars: false,
                renderTo: Ext.getBody()
            });
            expect(component.inputEl.dom.style.overflow).not.toEqual('hidden');
        });
        it("should should do nothing if grow is false", function() {
            makeComponent({
                grow: false,
                preventScrollbars: true,
                renderTo: Ext.getBody()
            });
            expect(component.inputEl.dom.style.overflow).not.toEqual('hidden');
        });
    });

});
