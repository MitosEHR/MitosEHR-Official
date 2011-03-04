/**
*  @private
 * @class Ext.util.OfflineDebug
 * @singleton
 *
 * Helper class to implement cache manifest.
 *
 * Exposes a number of events and prints them out to the console to help
 * troubleshoot potential problems with CacheManifests.
 */
Ext.util.OfflineDebug = function() {
    var cacheStatuses = ['uncached', 'idle', 'checking', 'downloading', 'updateready', 'obsolete'],
        cacheEvents = ['cached', 'checking', 'downloading', 'error', 'noupdate', 'obsolete', 'progress', 'updateready'],
        appcache = window.applicationCache;

    var logEvent = function(e){
        var online = (navigator.onLine) ? 'yes' : 'no',
            status = cacheStatuses[appcache.status],
            type = e.type;

        var message = 'online: ' + online;
        message += ', event: ' + type;
        message += ', status: ' + status;

        if (type == 'error' && navigator.onLine) {
            message += ' There was an unknown error, check your Cache Manifest.';
        }
        if(console && console.log) {
            console.log(message);
        }
    };

    // First add event listeners to the application cache
    for (var i = cacheEvents.length - 1; i >= 0; i--) {
        appcache.addEventListener(cacheEvents[i], logEvent, false);
    }

    appcache.addEventListener('updateready', function(e) {
        // Don't perform "swap" if this is the first cache
        if (cacheStatuses[cache.status] != 'idle') {
            cache.swapCache();
            console.log('Swapped/updated the Cache Manifest.');
        }
    }, false);

    return {
        checkForUpdates: function(){
            appcache.update();
        }
    };
};
