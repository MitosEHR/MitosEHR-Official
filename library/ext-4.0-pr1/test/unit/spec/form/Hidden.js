describe("Ext.form.Hidden", function() {

    it("should be registered with the 'hiddenfield' xtype", function() {
        var component = Ext.create("Ext.form.Hidden", {name: 'test'});
        expect(component instanceof Ext.form.Hidden).toBe(true);
        expect(Ext.getClass(component).xtype).toBe("hiddenfield");
    });

    
    it("should render as input hidden", function(){
        var component = new Ext.form.Hidden({
            name: 'test',
            renderTo: Ext.getBody()
        });    
        expect(component.inputEl.dom.type).toEqual('hidden');
        component.destroy();
    });
    
});
