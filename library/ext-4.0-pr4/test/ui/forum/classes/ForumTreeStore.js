
Ext.define('Forum.TreeStore', {
    extend: 'Ext.data.TreeStore',
    
    initComponent: function(){
        Ext.regModel('Forum', {
            fields: [
                {name: 'id', type: 'string'},
                {name: 'text', type: 'string'}
            ]
        });
        
        Ext.apply(this, {
            model: 'Forum',
            proxy: {
                type: 'ajax',
                //url: 'http://extjs.com/forum/forums-remote.php',
                url: 'forums.json',
                reader: {
                    type: 'tree',
                    root: 'forums'
                }
            }
        });
        
        this.callParent();
    }

//Forum.TreeLoader = function(){
//    Forum.TreeLoader.superclass.constructor.call(this);
//    this.proxy = new Ext.data.ScriptTagProxy({
//        url : this.dataUrl
//    });
//};
//Ext.extend(Forum.TreeLoader, Ext.tree.TreeLoader, {
//    dataUrl: 'http://extjs.com/forum/forums-remote.php',
//    requestData : function(node, cb){
//        this.proxy.request('read', null, {}, {
//            readRecords : function(o){
//                return o;
//            }
//        }, this.addNodes, this, {node:node, cb:cb});
//    },
//
//    addNodes : function(o, arg){
//        var node = arg.node;
//        for(var i = 0, len = o.length; i < len; i++){
//            var n = this.createNode(o[i]);
//            if(n){
//                node.appendChild(n);
//            }
//        }
//        arg.cb(this, node);
//    }
});