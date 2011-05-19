//**************************************************************************************
// global_funstions.js
// Description: This file will contain all custom funtions to be propagated thruout
// MirtosEHR Application. Place your function here if you think will be use in more
// than one page.
//
// Thank you for your conribution \m/ Rock on!
//
// v0.1
//
// Author: Ernesto J Rodriguez
// Modified: n/a
// 
// MitosEHR (Eletronic Health Records) 2011
//**************************************************************************************

//**************************************************************************************
// Top message  window - Author: ExtJs 4 Examples (2011)
//**************************************************************************************
Ext.topAlert = function(){
    var msgCt;
    function createBox(t, s){
       return '<div class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';
    }
    return {
        msg : function(title, format){
            if(!msgCt){
                msgCt = Ext.core.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
            }
            var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.core.DomHelper.append(msgCt, createBox(title, s), true);
            m.hide();
            m.slideIn('t').ghost("t", { delay: 5000, remove: true});
        },
    };
}();