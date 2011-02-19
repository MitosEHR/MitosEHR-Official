/**
 * Tests Ext.data.Store functionality
 * @author Ed Spencer
 */
(function() {
    var suite  = Ext.test.session.getSuite('Ext.layout.ContainerLayout'),
        assert = Y.Assert;
    
    function buildLayout(config) {
        var layout = new Ext.layout.FormLayout(config || {});
        
        //give a mock container
        layout.container = {
            itemCls: 'ctCls'
        };
        
        return layout;
    };
    
    suite.add(new Y.Test.Case({
        name: 'configureItem',
        
        setUp: function() {
            this.layout = new Ext.layout.ContainerLayout({
                extraCls: 'myExtraClass'
            });
            
            //mock component object
            this.component = {
                addCls: Ext.emptyFn,
                doLayout: Ext.emptyFn
            };
        },
        
        testAddsExtraCls: function() {
            var layout = this.layout;
            
            var addedClass = "";
            
            //mock component object
            c = {
                addCls: function(cls) {
                    addedClass = cls;
                }
            };
            
            layout.configureItem(c, 0);
            
            assert.areEqual('myExtraClass', addedClass);
        },
        
        testAddsExtraClsToPositionEl: function() {
            var layout = this.layout;
            
            var addedClass = "";
            
            //mock component object
            c = {
                getPositionEl: function() {
                    return posEl;
                }
            };
            
            //mock position el
            posEl = {
                addCls: function(cls) {
                    addedClass = cls;
                }
            };
            
            layout.configureItem(c, 0);
            
            assert.areEqual('myExtraClass', addedClass);
        },
        
        testLaysOutIfForced: function() {
            var laidOut = false;
            
            var layout = this.layout,
                comp   = this.component;
            
            //mock component object
            comp.doLayout = function() {
                laidOut = true;
            };
            
            layout.configureItem(comp, 0);
            
            assert.isFalse(laidOut);
            
            layout.forceLayout = true;
            layout.configureItem(comp, 0);
            
            assert.isTrue(laidOut);
        },
        
        testHidesIfRenderHidden: function() {
            
        }
    }));
})();