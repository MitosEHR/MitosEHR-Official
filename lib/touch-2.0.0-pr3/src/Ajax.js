/**
 * A singleton instance of an {@link Ext.data.Connection}. This class
 * is used to communicate with your server side code. It can be used as follows:
 *
 *     Ext.Ajax.request({
 *         url: 'page.php',
 *         params: {
 *             id: 1
 *         },
 *         success: function(response){
 *             var text = response.responseText;
 *             // process server response here
 *         }
 *     });
 *
 * Default options for all requests can be set by changing a property on the Ext.Ajax class:
 *
 *     Ext.Ajax.timeout = 60000; // 60 seconds
 *
 * Any options specified in the request method for the Ajax request will override any
 * defaults set on the Ext.Ajax class. In the code sample below, the timeout for the
 * request will be 60 seconds.
 *  
 *     Ext.Ajax.timeout = 120000; // 120 seconds
 *     Ext.Ajax.request({
 *         url: 'page.aspx',
 *         timeout: 60000
 *     });
 *
 * In general, this class will be used for all Ajax requests in your application.
 * The main reason for creating a separate {@link Ext.data.Connection} is for a
 * series of requests that share common settings that are different to all other
 * requests in the application.
 */
Ext.define('Ext.Ajax', {
    extend: 'Ext.data.Connection',
    singleton: true,

    /**
     * @cfg {String} url @hide
     */
    /**
     * @cfg {Object} extraParams @hide
     */
    /**
     * @cfg {Object} defaultHeaders @hide
     */
    /**
     * @cfg {String} method (Optional) @hide
     */
    /**
     * @cfg {Number} timeout (Optional) @hide
     */
    /**
     * @cfg {Boolean} autoAbort (Optional) @hide
     */

    /**
     * @cfg {Boolean} disableCaching (Optional) @hide
     */

    /**
     * @property  disableCaching
     * True to add a unique cache-buster param to GET requests. (defaults to true)
     * @type Boolean
     */
    /**
     * @property  url
     * The default URL to be used for requests to the server. (defaults to undefined)
     * If the server receives all requests through one URL, setting this once is easier than
     * entering it on every request.
     * @type String
     */
    /**
     * @property  extraParams
     * An object containing properties which are used as extra parameters to each request made
     * by this object (defaults to undefined). Session information and other data that you need
     * to pass with each request are commonly put here.
     * @type Object
     */
    /**
     * @property  defaultHeaders
     * An object containing request headers which are added to each request made by this object
     * (defaults to undefined).
     * @type Object
     */
    /**
     * @property  method
     * The default HTTP method to be used for requests. Note that this is case-sensitive and
     * should be all caps (defaults to undefined; if not set but params are present will use
     * <tt>"POST"</tt>, otherwise will use <tt>"GET"</tt>.)
     * @type String
     */
    /**
     * @property  timeout
     * The timeout in milliseconds to be used for requests. (defaults to 30000)
     * @type Number
     */

    /**
     * @property  autoAbort
     * Whether a new request should abort any pending requests. (defaults to false)
     * @type Boolean
     */
    autoAbort : false
});