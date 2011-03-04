/**
 * @class Ext.layout.container.HBox
 * @extends Ext.layout.container.Box
 * <p>A layout that arranges items horizontally across a Container. This layout optionally divides available horizontal
 * space between child items containing a numeric <code>flex</code> configuration.</p>
 * This layout may also be used to set the heights of child items by configuring it with the {@link #align} option.
 */
Ext.define('Ext.layout.container.HBox', {

    /* Begin Definitions */

    alias: ['layout.hbox'],

    extend: 'Ext.layout.container.Box',

    /* End Definitions */

    /**
     * @cfg {String} align
     * Controls how the child items of the container are aligned. Acceptable configuration values for this
     * property are:
     * <div class="mdetail-params"><ul>
     * <li><b><tt>top</tt></b> : <b>Default</b><div class="sub-desc">child items are aligned vertically
     * at the <b>top</b> of the container</div></li>
     * <li><b><tt>middle</tt></b> : <div class="sub-desc">child items are aligned vertically in the
     * <b>middle</b> of the container</div></li>
     * <li><b><tt>stretch</tt></b> : <div class="sub-desc">child items are stretched vertically to fill
     * the height of the container</div></li>
     * <li><b><tt>stretchmax</tt></b> : <div class="sub-desc">child items are stretched vertically to
     * the height of the largest item.</div></li>
     * </ul></div>
     */
    align: 'top', // top, middle, stretch, strechmax

    //@private
    alignCenteringString: 'middle',

    type : 'hbox',

    direction: 'horizontal',

    // When creating an argument list to setSize, use this order
    parallelSizeIndex: 0,
    perpendicularSizeIndex: 1,

    parallelPrefix: 'width',
    parallelPrefixCap: 'Width',
    parallelLT: 'l',
    parallelRB: 'r',
    parallelBefore: 'left',
    parallelAfter: 'right',

    perpendicularPrefix: 'height',
    perpendicularPrefixCap: 'Height',
    perpendicularLT: 't',
    perpendicularRB: 'b',
    perpendicularLeftTop: 'top',
    perpendicularRightBottom: 'bottom'
});