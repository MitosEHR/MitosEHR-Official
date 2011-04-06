/**
 * @author Ed Spencer
 * @class Ext.data.ScriptTagProxy
 * @extends Ext.data.ServerProxy
 * 
 * <p>ScriptTagProxy is useful when you need to load data from a domain other than the one your application is running
 * on. If your application is running on http://domainA.com it cannot use {@link Ext.data.AjaxProxy Ajax} to load its
 * data from http://domainB.com because cross-domain ajax requests are prohibited by the browser.</p>
 * 
 * <p>We can get around this using a ScriptTagProxy. ScriptTagProxy injects a &lt;script&gt; tag into the DOM whenever
 * an AJAX request would usually be made. Let's say we want to load data from http://domainB.com/users - the script tag
 * that would be injected might look like this:</p>
 * 
<pre><code>
&lt;script src="http://domainB.com/users?callback=someCallback"&gt;&lt;/script&gt;
</code></pre>
 * 
 * <p>When we inject the tag above, the browser makes a request to that url and includes the response as if it was any
 * other type of JavaScript include. By passing a callback in the url above, we're telling domainB's server that we
 * want to be notified when the result comes in and that it should call our callback function with the data it sends 
 * back. So long as the server formats the response to look like this, everything will work:</p>
 * 
<pre><code>
someCallback({
    users: [
        {
            id: 1,
            name: "Ed Spencer",
            email: "ed@sencha.com"
        }
    ]
});
</code></pre>
 * 
 * <p>As soon as the script finishes loading, the 'someCallback' function that we passed in the url is called with the
 * JSON object that the server returned.</p>
 * 
 * <p>ScriptTagProxy takes care of all of this automatically. It formats the url you pass, adding the callback 
 * parameter automatically. It even creates a temporary callback function, waits for it to be called and then puts
 * the data into the Proxy making it look just like you loaded it through a normal {@link Ext.data.AjaxProxy AjaxProxy}.
 * Here's how we might set that up:</p>
 * 
<pre><code>
Ext.regModel('User', {
    fields: ['id', 'name', 'email']
});

var store = new Ext.data.Store({
    model: 'User',
    proxy: {
        type: 'scripttag',
        url : 'http://domainB.com/users'
    }
});

store.load();
</code></pre>
 * 
 * <p>That's all we need to do - ScriptTagProxy takes care of the rest. In this case the Proxy will have injected a 
 * script tag like this:
 * 
<pre><code>
&lt;script src="http://domainB.com/users?callback=stcCallback001" id="stcScript001"&gt;&lt;/script&gt;
</code></pre>
 * 
 * <p><u>Customization</u></p>
 * 
 * <p>Most parts of this script tag can be customized using the {@link #callbackParam}, {@link #callbackPrefix} and 
 * {@link #scriptIdPrefix} configurations. For example:
 * 
<pre><code>
var store = new Ext.data.Store({
    model: 'User',
    proxy: {
        type: 'scripttag',
        url : 'http://domainB.com/users',
        callbackParam: 'theCallbackFunction',
        callbackPrefix: 'ABC',
        scriptIdPrefix: 'injectedScript'
    }
});

store.load();
</code></pre>
 * 
 * <p>Would inject a script tag like this:</p>
 * 
<pre><code>
&lt;script src="http://domainB.com/users?theCallbackFunction=ABC001" id="injectedScript001"&gt;&lt;/script&gt;
</code></pre>
 * 
 * <p><u>Implementing on the server side</u></p>
 * 
 * <p>The remote server side needs to be configured to return data in this format. Here are suggestions for how you 
 * might achieve this using Java, PHP and ASP.net:</p>
 * 
 * <p>Java:</p>
 * 
<pre><code>
boolean scriptTag = false;
String cb = request.getParameter("callback");
if (cb != null) {
    scriptTag = true;
    response.setContentType("text/javascript");
} else {
    response.setContentType("application/x-json");
}
Writer out = response.getWriter();
if (scriptTag) {
    out.write(cb + "(");
}
out.print(dataBlock.toJsonString());
if (scriptTag) {
    out.write(");");
}
</code></pre>
 * 
 * <p>PHP:</p>
 * 
<pre><code>
$callback = $_REQUEST['callback'];

// Create the output object.
$output = array('a' => 'Apple', 'b' => 'Banana');

//start output
if ($callback) {
    header('Content-Type: text/javascript');
    echo $callback . '(' . json_encode($output) . ');';
} else {
    header('Content-Type: application/x-json');
    echo json_encode($output);
}
</code></pre>
 * 
 * <p>ASP.net:</p>
 * 
<pre><code>
String jsonString = "{success: true}";
String cb = Request.Params.Get("callback");
String responseString = "";
if (!String.IsNullOrEmpty(cb)) {
    responseString = cb + "(" + jsonString + ")";
} else {
    responseString = jsonString;
}
Response.Write(responseString);
</code></pre>
 *
 */
Ext.define('Ext.data.ScriptTagProxy', {
    extend: 'Ext.data.ServerProxy',
    alias: 'proxy.scripttag',
    
    statics: {
        TRANS_ID: 1000
    },
    
    defaultWriterType: 'base',
    
    /**
     * @cfg {String} callbackParam (Optional) The name of the parameter to pass to the server which tells
     * the server the name of the callback function set up by the load call to process the returned data object.
     * Defaults to "callback".<p>The server-side processing must read this parameter value, and generate
     * javascript output which calls this named function passing the data object as its only parameter.
     */
    callbackParam : "callback",
    
    /**
     * @cfg {String} scriptIdPrefix
     * The prefix string that is used to create a unique ID for the injected script tag element (defaults to 'stcScript')
     */
    scriptIdPrefix: 'stcScript',
    
    /**
     * @cfg {String} callbackPrefix
     * The prefix string that is used to create a unique callback function name in the global scope. This can optionally
     * be modified to give control over how the callback string passed to the remote server is generated. Defaults to 'stcCallback'
     */
    callbackPrefix: 'stcCallback',
    
    /**
     * @cfg {String} recordParam
     * The param name to use when passing records to the server (e.g. 'records=someEncodedRecordString').
     * Defaults to 'records'
     */
    recordParam: 'records',
    
    /**
     * Reference to the most recent request made through this Proxy. Used internally to clean up when the Proxy is destroyed
     * @property lastRequest 
     * @type Ext.data.Request
     */
    lastRequest: undefined,
    
    /**
     * @cfg {Boolean} autoAppendParams True to automatically append the request's params to the generated url. Defaults to true
     */
    autoAppendParams: true,
    
    constructor: function(){
        this.addEvents(
            /**
             * @event exception
             * Fires when the server returns an exception
             * @param {Ext.data.Proxy} this
             * @param {Ext.data.Request} request The request that was sent
             * @param {Ext.data.Operation} operation The operation that triggered the request
             */
            'exception'
        );
        this.callParent(arguments);    
    },

    /**
     * @private
     * Performs the read request to the remote domain. ScriptTagProxy does not actually create an Ajax request,
     * instead we write out a <script> tag based on the configuration of the internal Ext.data.Request object
     * @param {Ext.data.Operation} operation The {@link Ext.data.Operation Operation} object to execute
     * @param {Function} callback A callback function to execute when the Operation has been completed
     * @param {Object} scope The scope to execute the callback in
     */
    doRequest: function(operation, callback, scope) {
        //generate the unique IDs for this request
        var me         = this,
            format     = Ext.Function.bind(Ext.String.format, Ext.String),
            transId    = ++Ext.data.ScriptTagProxy.TRANS_ID,
            scriptId   = format("{0}{1}", me.scriptIdPrefix, transId),
            stCallback = format("{0}{1}", me.callbackPrefix, transId),
            writer     = me.getWriter(),
            request    = me.buildRequest(operation),
            //FIXME: ideally this would be in buildUrl, but we don't know the stCallback name at that point
            url        = Ext.urlAppend(request.url, format("{0}={1}", me.callbackParam, stCallback)),
            script;
            
        if (operation.allowWrite()) {
            request = writer.write(request);
        }
        
        //apply ScriptTagProxy-specific attributes to the Request
        Ext.apply(request, {
            url       : url,
            transId   : transId,
            scriptId  : scriptId,
            stCallback: stCallback
        });
        
        //if the request takes too long this timeout function will cancel it
        request.timeoutId = Ext.defer(me.timeoutHandler, me.timeout, me, [request, operation]);
        
        //this is the callback that will be called when the request is completed
        window[stCallback] = me.createRequestCallback(request, operation, callback, scope);
        
        //create the script tag and inject it into the document
        script = document.createElement("script");
        script.setAttribute("src", url);
        script.setAttribute("async", true);
        script.setAttribute("type", "text/javascript");
        script.setAttribute("id", scriptId);
        
        Ext.getHead().appendChild(script);
        operation.setStarted();
        
        me.lastRequest = request;
        
        return request;
    },
    
    /**
     * @private
     * Creates and returns the function that is called when the request has completed. The returned function
     * should accept a Response object, which contains the response to be read by the configured Reader.
     * The third argument is the callback that should be called after the request has been completed and the Reader has decoded
     * the response. This callback will typically be the callback passed by a store, e.g. in proxy.read(operation, theCallback, scope)
     * theCallback refers to the callback argument received by this function.
     * See {@link #doRequest} for details.
     * @param {Ext.data.Request} request The Request object
     * @param {Ext.data.Operation} operation The Operation being executed
     * @param {Function} callback The callback function to be called when the request completes. This is usually the callback
     * passed to doRequest
     * @param {Object} scope The scope in which to execute the callback function
     * @return {Function} The callback function
     */
    createRequestCallback: function(request, operation, callback, scope) {
        var me = this;
        
        return function(response) {
            me.processResponse(true, operation, request, response, callback, scope);
        };
    },
    
    /**
     * Cleans up after a completed request by removing the now unnecessary script tag from the DOM. Also removes the 
     * global JSON-P callback function.
     * @param {Ext.data.Request} request The request object
     * @param {Boolean} isLoaded True if the request completed successfully
     */
    afterRequest: function() {
        var cleanup = function(functionName) {
            return function() {
                window[functionName] = undefined;
                
                try {
                    delete window[functionName];
                } catch(e) {}
            };
        };
        
        return function(request, isLoaded) {
            Ext.fly(request.scriptId).remove();
            clearTimeout(request.timeoutId);
            
            var callbackName = request.stCallback;
            
            if (isLoaded) {
                cleanup(callbackName)();
                this.lastRequest.completed = true;
            } else {
                // if we haven't loaded yet, the callback might still be called in the future so don't unset it immediately
                window[callbackName] = cleanup(callbackName);
            }
        };
    }(),
    
    /**
     * Generates a url based on a given Ext.data.Request object. Adds the params and callback function name to the url
     * @param {Ext.data.Request} request The request object
     * @return {String} The url
     */
    buildUrl: function(request) {
        var me      = this,
            url     = me.callParent(arguments),
            params  = Ext.apply({}, request.params),
            filters = params.filters,
            records,
            filter, i;
            
        delete params.filters;
        
        if (me.autoAppendParams) {
            url = Ext.urlAppend(url, Ext.urlEncode(params));
        }
        
        if (filters && filters.length) {
            for (i = 0; i < filters.length; i++) {
                filter = filters[i];
                
                if (filter.value) {
                    url = Ext.urlAppend(url, filter.property + "=" + filter.value);
                }
            }
        }
        
        //if there are any records present, append them to the url also
        records = request.records;
        
        if (Ext.isArray(records) && records.length > 0) {
            url = Ext.urlAppend(url, Ext.String.format("{0}={1}", me.recordParam, me.encodeRecords(records)));
        }
        
        return url;
    },
    
    //inherit docs
    destroy: function() {
        this.abort();
        this.callParent();
    },
        
    /**
     * @private
     * @return {Boolean} True if there is a current request that hasn't completed yet
     */
    isLoading : function(){
        var lastRequest = this.lastRequest;
        
        return (lastRequest !== undefined && !lastRequest.completed);
    },
    
    /**
     * Aborts the current server request if one is currently running
     */
    abort: function() {
        if (this.isLoading()) {
            this.afterRequest(this.lastRequest);
        }
    },
        
    /**
     * Encodes an array of records into a string suitable to be appended to the script src url. This is broken
     * out into its own function so that it can be easily overridden.
     * @param {Array} records The records array
     * @return {String} The encoded records string
     */
    encodeRecords: function(records) {
        var encoded = "",
            i = 0,
            len = records.length;
        
        for (; i < len; i++) {
            encoded += Ext.urlEncode(records[i].data);
        }
        
        return encoded;
    },
    
    /**
     * @private
     * If this fires it means the request took too long so we cancel the request. If the request was 
     * successful this timer is cancelled by this.afterRequest
     * @param {Ext.data.Request} request The Request to handle
     */
    timeoutHandler: function(request, operation) {
        this.afterRequest(request, false);
        this.fireEvent('exception', this, request, operation);
        Ext.callback(request.callback, request.scope || window, [null, request.options, false]);
    }
});
