/**
 * @class Ext.layout.component.form.Field
 * @extends Ext.layout.Component
 * Layout class for components with {@link Ext.form.Labelable field labeling}, handling the sizing and alignment of
 * the form control, label, and error message treatment.
 * @private
 */
Ext.define('Ext.layout.component.form.Field', {

    /* Begin Definitions */

    alias: ['layout.field'],

    extend: 'Ext.layout.Component',

    requires: ['Ext.tip.QuickTips'],

    /* End Definitions */

    type: 'field',

    beforeLayout: function(width, height) {
        var me = this;
        return me.callParent(arguments) || (!me.owner.preventMark && me.activeError !== me.owner.getActiveError());
    },

    onLayout: function(width, height) {
        var me = this,
            owner = me.owner,
            labelStrategy = me.getLabelStrategy(),
            errorStrategy = me.getErrorStrategy(),
            insets, totalWidth, totalHeight;

        me.setTargetSize(width, height);

        // we always need some sort of pixel width, so use the natural width of the outer div if not fixed
        totalWidth = me.totalWidth = Ext.isNumber(width) ? width : owner.el.getWidth();
        totalHeight = me.totalHeight = height;

        // insets for the bodyEl from each side of the component layout area
        insets = me.insets = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };

        // NOTE the order of calculating insets and setting styles here is very important; we must first
        // calculate and set horizontal layout alone, as the horizontal sizing of elements can have an impact
        // on the vertical sizes due to wrapping, then calculate and set the vertical layout.

        // perform preparation on the label and error (setting css classes, qtips, etc.)
        labelStrategy.prepare(owner);
        errorStrategy.prepare(owner);

        // calculate the horizontal insets for the label and error
        labelStrategy.adjustHorizInsets(owner, insets);
        errorStrategy.adjustHorizInsets(owner, insets);

        // set horizontal styles for label and error based on the current insets
        labelStrategy.layoutHoriz(owner, insets, totalWidth);
        errorStrategy.layoutHoriz(owner, insets, totalWidth);

        // calculate the vertical insets for the label and error
        labelStrategy.adjustVertInsets(owner, insets);
        errorStrategy.adjustVertInsets(owner, insets);

        // set vertical styles for label and error based on the current insets
        labelStrategy.layoutVert(owner, insets, totalHeight);
        errorStrategy.layoutVert(owner, insets, totalHeight);

        // perform sizing of the bodyEl, inputEl, etc. based on the final insets
        me.sizeBody();

        me.activeError = owner.getActiveError();
    },


    /**
     * Perform sizing and alignment of the bodyEl (and children) to match the calculated insets.
     */
    sizeBody: function() {
        var me = this,
            owner = me.owner,
            insets = me.insets,
            totalHeight = me.totalHeight,
            width = me.totalWidth - insets.left - insets.right,
            height = Ext.isNumber(totalHeight) ? totalHeight - insets.top - insets.bottom : totalHeight;

        // size the bodyEl
        me.setElementSize(owner.bodyEl, width, height);

        // size the bodyEl's inner contents if necessary
        me.sizeBodyContents(width, height);
    },

    /**
     * Size the contents of the field body, given the full dimensions of the bodyEl. Does nothing by
     * default, subclasses can override to handle their specific contents.
     * @param {Number} width The bodyEl width
     * @param {Number} height The bodyEl height
     */
    sizeBodyContents: Ext.emptyFn,


    /**
     * Return the set of strategy functions from the {@link #labelStrategies labelStrategies collection}
     * that is appropriate for the field's {@link Ext.form.Field#labelAlign labelAlign} config.
     */
    getLabelStrategy: function() {
        var me = this,
            strategies = me.labelStrategies,
            labelAlign = me.owner.labelAlign;
        return strategies[labelAlign] || strategies.base;
    },

    /**
     * Return the set of strategy functions from the {@link #errorStrategies errorStrategies collection}
     * that is appropriate for the field's {@link Ext.form.Field#msgTarget msgTarget} config.
     */
    getErrorStrategy: function() {
        var me = this,
            owner = me.owner,
            strategies = me.errorStrategies,
            msgTarget = owner.msgTarget;
        return !owner.preventMark && Ext.isString(msgTarget) ?
                (strategies[msgTarget] || strategies.elementId) :
                strategies.base;
    },



    /**
     * Collection of named strategies for laying out and adjusting labels to accommodate error messages.
     * An appropriate one will be chosen based on the owner field's {@link Ext.form.Field#labelAlign} config.
     */
    labelStrategies: (function() {
        var applyIf = Ext.applyIf,
            emptyFn = Ext.emptyFn,
            base = {
                prepare: function(owner) {
                    var cls = Ext.baseCSSPrefix + 'form-label-' + owner.labelAlign,
                        el = owner.el;
                    if (!el.hasCls(cls)) {
                        el.addCls(cls);
                    }
                },
                adjustHorizInsets: emptyFn,
                adjustVertInsets: emptyFn,
                layoutHoriz: emptyFn,
                layoutVert: emptyFn
            },
            left = applyIf({
                adjustHorizInsets: function(owner, insets) {
                    if (!owner.hideLabel) {
                        insets.left += owner.labelWidth + owner.labelPad;
                    }
                },
                layoutHoriz: function(owner, insets, totalWidth) {
                    if (!owner.hideLabel) {
                        var labelEl = owner.labelEl;
                        labelEl.setWidth(owner.labelWidth);
                        labelEl.setStyle('marginRight', owner.labelPad + 'px');
                    }
                }
            }, base);


        return {
            base: base,

            /**
             * Label displayed above the bodyEl
             */
            top: applyIf({
                adjustVertInsets: function(owner, insets) {
                    if (!owner.hideLabel) {
                        insets.top += owner.labelEl.getHeight() + owner.labelPad;
                    }
                },
                layoutHoriz: function(owner, insets, totalWidth) {
                    if (!owner.hideLabel) {
                        owner.labelEl.setWidth(totalWidth);
                    }
                },
                layoutVert: function(owner, insets, totalHeight) {
                    if (!owner.hideLabel) {
                        owner.labelEl.setStyle('marginBottom', owner.labelPad + 'px');
                    }
                }
            }, base),

            /**
             * Label displayed to the left of the bodyEl
             */
            left: left,

            /**
             * Same as left, only difference is text-align in CSS
             */
            right: left
        };
    })(),



    /**
     * Collection of named strategies for laying out and adjusting insets to accommodate error messages.
     * An appropriate one will be chosen based on the owner field's {@link Ext.form.Field#msgTarget} config.
     */
    errorStrategies: (function() {
        var applyIf = Ext.applyIf,
            emptyFn = Ext.emptyFn,
            base = {
                prepare: emptyFn,
                adjustHorizInsets: emptyFn,
                adjustVertInsets: emptyFn,
                layoutHoriz: emptyFn,
                layoutVert: emptyFn
            };

        return {
            base: base,

            /**
             * Error displayed as icon (with QuickTip on hover) to right of the bodyEl
             */
            side: applyIf({
                prepare: function(owner) {
                    var errorEl = owner.errorEl;
                    errorEl.addCls(Ext.baseCSSPrefix + 'form-invalid-icon');
                    errorEl.dom.qtip = owner.activeError || '';
                    errorEl.dom.qclass = Ext.baseCSSPrefix + 'form-invalid-tip';
                    Ext.tip.QuickTips.init();
                    errorEl.setDisplayed(owner.hasActiveError());
                },
                adjustHorizInsets: function(owner, insets) {
                    if (owner.autoFitErrors) {
                        insets.right += owner.errorEl.getWidth();
                    }
                },
                layoutHoriz: function(owner, insets, totalWidth) {
                    owner.errorEl.setLeft(totalWidth - insets.right);
                },
                layoutVert: function(owner, insets, totalHeight) {
                    owner.errorEl.setTop(insets.top);
                }
            }, base),

            /**
             * Error message displayed underneath the bodyEl
             */
            under: applyIf({
                prepare: function(owner) {
                    var errorEl = owner.errorEl,
                        cls = Ext.baseCSSPrefix + 'form-invalid-under';
                    if (!errorEl.hasCls(cls)) {
                        errorEl.addCls(cls);
                    }
                    errorEl.setDisplayed(owner.hasActiveError());
                },
                adjustVertInsets: function(owner, insets) {
                    if (owner.autoFitErrors) {
                        insets.bottom += owner.errorEl.getHeight();
                    }
                },
                layoutHoriz: function(owner, insets, totalWidth) {
                    var errorEl = owner.errorEl;
                    errorEl.setWidth(totalWidth - insets.right - insets.left);
                    errorEl.setStyle('marginLeft', insets.left + 'px');
                }
            }, base),

            /**
             * Error displayed as QuickTip on hover of the field container
             */
            qtip: applyIf({
                prepare: function(owner) {
                    var elDom = owner.getActionEl().dom;
                    owner.errorEl.setDisplayed(false);
                    elDom.qtip = owner.activeError || '';
                    elDom.qclass = Ext.baseCSSPrefix + 'form-invalid-tip';
                    Ext.tip.QuickTips.init();
                }
            }, base),

            /**
             * Error displayed as title tip on hover of the field container
             */
            title: applyIf({
                prepare: function(owner) {
                    owner.errorEl.setDisplayed(false);
                    owner.el.dom.title = owner.activeError || '';
                }
            }, base),

            /**
             * Error message displayed as content of an element with a given id elsewhere in the app
             */
            elementId: applyIf({
                prepare: function(owner) {
                    owner.errorEl.setDisplayed(false);
                    var targetEl = Ext.getDom(owner.msgTarget);
                    if (targetEl) {
                        targetEl.innerHTML = owner.activeError;
                        targetEl.style.display = owner.hasActiveError() ? '' : 'none';
                    }
                }
            }, base)
        };
    })()

});