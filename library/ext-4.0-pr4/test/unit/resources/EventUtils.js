/**
 * Utility function to fire a fake mouse event to a given target element
 */
jasmine.fireMouseEvent = function (target, type, x, y) {
    var e, doc, body, ret;
    target = Ext.getDom(target);
    if (document.createEventObject && !jasmine.browser.isIE9){ //IE event model
        e = document.createEventObject();
        doc = document.documentElement;
        body = document.body;
        x = x + (doc && doc.clientLeft || 0) + (body && body.clientLeft || 0);
        y = y + (doc && doc.clientTop || 0) + (body && body.clientLeft || 0);
        Ext.apply(e, {
            bubbles: true,
            cancelable: true,
            screenX: x,
            screenY: y,
            clientX: x,
            clientY: y,
            button: 4
        });
        ret = target.fireEvent('on' + type, e);
    }
    else{
        e = document.createEvent("MouseEvents");
        e.initMouseEvent(type, true, true, window, 1, x, y, x, y, false, false, false, false, 0, null);
        ret = target.dispatchEvent(e);
    }
    
    return (ret === false ? ret : e);
};


/**
 * Utility function to fire a fake key event to a given target element
 */
jasmine.fireKeyEvent = function(target, type, key) {
    var e, ret;
    target = Ext.getDom(target);
    if (document.createEventObject && !jasmine.browser.isIE9) { //IE event model
        e = document.createEventObject();
        Ext.apply(e, {
            bubbles: true,
            cancelable: true,
            keyCode: key
        });
        return target.fireEvent('on' + type, e);
    }
    else {
        e = document.createEvent("Events");
        e.initEvent(type, true, true);
        e.keyCode = key;
        return target.dispatchEvent(e);
    }
};

/*
This version is commented out because there is a bug in WebKit that prevents
key events to be fired with both options and a valid keycode. When the bug gets fixed
this method can be reintroduced. See https://bugs.webkit.org/show_bug.cgi?id=16735
jasmine.fireKeyEvent = function(target, type, key, options) {
    var e, ret, prop;
    
    options = options || {};
    target = Ext.getDom(target);
    if (document.createEventObject) { //IE event model
        e = document.createEventObject();
        Ext.apply(e, {
            bubbles: true,
            cancelable: true,
            keyCode: key
        });
        if (options) {
            for (prop in options) {
                if (options.hasOwnProperty(prop)) {
                    e[prop] = options[prop];
                }
            }
        }
        return target.fireEvent('on' + type, e);
    }
    else {
        e = document.createEvent('KeyboardEvent');
        if (typeof e.initKeyboardEvent != 'undefined') {
            e.initKeyboardEvent(type, true, true, window, 
                false, 
                false, 
                false, 
                false, 97, 97);
        } else {
            e.initKeyEvent(type, true, true, window, 
                options.ctrlKey || false, 
                options.altKey || false, 
                options.shiftKey || false, 
                options.metaKey || false, key, key);
        }
        return target.dispatchEvent(e);
    }
};
*/