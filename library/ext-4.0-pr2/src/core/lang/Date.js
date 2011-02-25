/**
 * @class Ext.Date
 *
 * A set of useful static methods to deal with date
 * @singleton
 */

/*
 * Note that if Ext.util.Date is required and loaded, it will copy all methods / properties to
 * this object, for convenience
 */
Ext.Date = {
    /**
     * Returns the current timestamp
     * @return {Date} The current timestamp
     */
    now: Date.now || function() {
        return +new Date();
    },

    /**
     * Returns the number of milliseconds between two dates
     * @param {Date} dateA
     * @param {Date} dateB (optional) Defaults to now
     * @return {Number} The diff in milliseconds
     */
    getElapsed: function(dateA, dateB) {
        return Math.abs(dateA - (dateB || new Date()));
    }
};
