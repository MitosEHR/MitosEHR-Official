describe("Ext.form.Radio", function() {
    
    var destroyGroup;
    
    beforeEach(function(){
        destroyGroup = function(arr){
            var i = 0,
                len = arr.length;
                
            for (; i < len; ++i) {
                arr[i].destroy();
            }
        };
    });
    
    afterEach(function(){
        destroyGroup = null;  
    });

    it("should be registered with the 'radiofield' xtype", function() {
        var component = Ext.create("Ext.form.Radio", {name: 'test'});
        expect(component instanceof Ext.form.Radio).toBe(true);
        expect(Ext.getClass(component).xtype).toBe("radiofield");
    });

    
    it("should render a radio", function(){
        var component = new Ext.form.Radio({
            name: 'test',
            renderTo: Ext.getBody()
        });
        expect(component.inputEl.dom.type.toLowerCase()).toEqual("radio");
        component.destroy();    
    });
    
    it("should respect the checked value", function(){
        var component = new Ext.form.Radio({
            checked: true,
            name: 'test',
            renderTo: Ext.getBody()
        });
        
        expect(component.getValue()).toBeTruthy();
        component.destroy();
        
        component = new Ext.form.Radio({
            name: 'test',
            renderTo: Ext.getBody()
        });
        expect(component.getValue()).toBeFalsy();
        component.destroy();
    });
    
    it("should get the correct group value", function(){
        var radios = [],
            i = 0;
            
        for(i = 0; i < 5; ++i){
            radios.push(new Ext.form.Radio({
                renderTo: Ext.getBody(),
                name: 'test',
                inputValue: i + 1,
                checked: i + 1 == 3
            }));
        }
        
        expect(radios[0].getGroupValue()).toEqual(3);
        
        destroyGroup(radios);
    });
    
    it("should unset the values when checking in a group", function(){
        var radios = [],
            i = 0;
            
        for(i = 0; i < 3; ++i){
            radios.push(new Ext.form.Radio({
                renderTo: Ext.getBody(),
                name: 'test',
                inputValue: i + 1
            }));
        }
        
        expect(radios[0].getGroupValue()).toBeNull();
        
        radios[1].setValue(true);
        expect(radios[0].getValue()).toBeFalsy();
        expect(radios[1].getValue()).toBeTruthy();
        expect(radios[2].getValue()).toBeFalsy();
        
        radios[2].setValue(true);
        expect(radios[0].getValue()).toBeFalsy();
        expect(radios[1].getValue()).toBeFalsy();
        expect(radios[2].getValue()).toBeTruthy();
        
        destroyGroup(radios);
    });
    
    it("should call handlers for all items in a group", function(){
        var radios = [],
            handlers = [],
            spies = [],
            i = 0;
            
        for(i = 0; i < 3; ++i){
            handlers.push({
                fn: function(){}
            });
            spies.push(spyOn(handlers[i], 'fn'));
            radios.push(new Ext.form.Radio({
                renderTo: Ext.getBody(),
                name: 'test',
                inputValue: i + 1,
                handler: handlers[i].fn
            }));
        }
        
        radios[1].setValue(true);
        expect(handlers[1].fn).toHaveBeenCalledWith(radios[1], true);
        
        radios[0].setValue(true);
        expect(handlers[0].fn).toHaveBeenCalledWith(radios[0], true);        
        expect(handlers[1].fn).toHaveBeenCalledWith(radios[1], false);
    });
    
});
