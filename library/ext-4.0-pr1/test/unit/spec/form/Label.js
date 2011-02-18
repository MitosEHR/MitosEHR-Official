describe("Ext.form.Label", function() {
    var component, makeComponent;
    
    beforeEach(function() {
        makeComponent = function(config) {
            config = config || {};
            Ext.apply(config, {
                name: 'test'
            });
            component = new Ext.form.Label(config);
        };
    });
    
    afterEach(function() {
        if (component) {
            component.destroy();
        }
        component = makeComponent = null;
    });
    
    it("should have a label as the element", function(){
        makeComponent({
            renderTo: Ext.getBody()
        });
        
        expect(component.el.dom.tagName.toUpperCase()).toEqual("LABEL");
    });
    
    it("should use the forId attribute", function(){
        makeComponent({
            renderTo: Ext.getBody(),
            forId: "foo"
        });
        
        expect(component.el.dom.htmlFor).toEqual("foo");
    });
    
    it("should encode the text attribute", function(){
        makeComponent({
            text: "<div>foo</div>",
            renderTo: Ext.getBody()
        });
        
        expect(component.el.dom.innerHTML).toEqual("&lt;div&gt;foo&lt;/div&gt;");
    });
    
    it("should not encode the html attribute", function(){
        makeComponent({
            html: "<div>foo</div>",
            renderTo: Ext.getBody()
        });
        expect(component.el.dom.innerHTML).toEqual(Ext.isIE ? "<DIV>foo</DIV>" : "<div>foo</div>");
    });
    
    it("should support setText when not rendered", function(){
        makeComponent();
        component.setText("foo");
        component.render(Ext.getBody());
        expect(component.el.dom.innerHTML).toEqual("foo");
        component.destroy();
        
        makeComponent({
            text: "foo"
        });
        component.setText("bar");
        component.render(Ext.getBody());
        expect(component.el.dom.innerHTML).toEqual("bar");
    });
    
    it("should enforce the encode attribute", function(){
        makeComponent();
        component.setText("<div>bar</div>", false);
        component.render(Ext.getBody());
        expect(component.el.dom.innerHTML).toEqual(Ext.isIE ? "<DIV>bar</DIV>" : "<div>bar</div>");
        
        component.setText("<span>foo</span>");
        expect(component.el.dom.innerHTML).toEqual("&lt;span&gt;foo&lt;/span&gt;");
        
        component.setText("<span>bar</span>", false);
        expect(component.el.dom.innerHTML).toEqual(Ext.isIE ? "<SPAN>bar</SPAN>" : "<span>bar</span>");
    });
});
