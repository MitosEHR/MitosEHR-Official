/**
 * @class Ext.Number
 *
 * A collection of useful static methods to deal with numbers
 * @singleton
 */

(function() {

var isToFixedBroken = (0.9).toFixed() !== '1';

Ext.Number = {
    /**
     * Checks whether or not the current number is within a desired range.  If the number is already within the
     * range it is returned, otherwise the min or max value is returned depending on which side of the range is
     * exceeded. Note that this method returns the constrained value but does not change the current number.
     * @param {Number} number The number to check
     * @param {Number} min The minimum number in the range
     * @param {Number} max The maximum number in the range
     * @return {Number} The constrained value if outside the range, otherwise the current value
     */
    constrain: function(number, min, max) {
        number = parseFloat(number);

        if (!isNaN(min)) {
            number = Math.max(number, min);
        }
        if (!isNaN(max)) {
            number = Math.min(number, max);
        }
        return number;
    },

    /**
     * Formats a number using fixed-point notation
     * @param {Number} value The number to format
     * @param {Number} precision The number of digits to show after the decimal point
     */
    toFixed: function(value, precision) {
        if (isToFixedBroken) {
            precision = precision || 0;
            var pow = Math.pow(10, precision);
            return (Math.round(value * pow) / pow).toFixed(precision);
        }

        return value.toFixed(precision);
    }
};

})();

/**
 * Utility method for validating that a value is numeric, returning the specified default value if it is not.
 * @param {Mixed} value Should be a number, but any type will be handled appropriately
 * @param {Number} defaultValue The value to return if the original value is non-numeric
 * @return {Number} Value, if numeric, else defaultValue
 */
Ext.num = function(v, defaultValue) {
    v = Number(Ext.isEmpty(v) || Ext.isArray(v) || typeof v === 'boolean' || (typeof v === 'string' && Ext.String.trim(v).length === 0) ? NaN : v);
    return isNaN(v) ? defaultValue : v;
};
