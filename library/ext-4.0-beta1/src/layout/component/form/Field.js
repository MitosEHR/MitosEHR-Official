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
            info;

        info = {
            width: width,
            height: height,

            // insets for the bodyEl from each side of the component layout area
            insets: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        };

        // NOTE the order of calculating insets and setting styles here is very important; we must first
        // calculate and set horizontal layout alone, as the horizontal sizing of elements can have an impact
        // on the vertical sizes due to wrapping, then calculate and set the vertical layout.

        // perform preparation on the label and error (setting css classes, qtips, etc.)
        labelStrategy.prepare(owner, info);
        errorStrategy.prepare(owner, info);

        // preparation may have adjusted the target dimensions
        me.setTargetSize(info.width, info.height);

        // calculate the horizontal insets for the label and error
        labelStrategy.adjustHorizInsets(owner, info);
        errorStrategy.adjustHorizInsets(owner, info);

        // set horizontal styles for label and error based on the current insets
        labelStrategy.layoutHoriz(owner, info);
        errorStrategy.layoutHoriz(owner, info);

        // calculate the vertical insets for the label and error
        labelStrategy.adjustVertInsets(owner, info);
        errorStrategy.adjustVertInsets(owner, info);

        // set vertical styles for label and error based on the current insets
        labelStrategy.layoutVert(owner, info);
        errorStrategy.layoutVert(owner, info);

        // perform sizing of the bodyEl, inputEl, etc. based on the final insets
        me.sizeBody(info);

        me.activeError = owner.getActiveError();
    },


    /**
     * Perform sizing and alignment of the bodyEl (and children) to match the calculated insets.
     */
    sizeBody: function(info) {
        var me = this,
            owner = me.owner,
            insets = info.insets,
            totalHeight = info.height,
            width = info.width - insets.left - insets.right,
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
                strategies.none;
    },



    /**
     * Collection of named strategies for laying out and adjusting labels to accommodate error messages.
     * An appropriate one will be chosen based on the owner field's {@link Ext.form.Field#labelAlign} config.
     */
    labelStrategies: (function() {
        var applyIf = Ext.applyIf,
            emptyFn = Ext.emptyFn,
            base = {
                prepare: function(owner, info) {
                    var cls = owner.labelCls + '-' + owner.labelAlign,
                        labelEl = owner.labelEl;
                    if (labelEl && !labelEl.hasCls(cls)) {
                        labelEl.addCls(cls);
                    }
                },
                adjustHorizInsets: emptyFn,
                adjustVertInsets: emptyFn,
                layoutHoriz: emptyFn,
                layoutVert: emptyFn
            },
            left = applyIf({
                prepare: function(owner, info) {
                    base.prepare(owner, info);
                    // For auto-width, set the target width to the label size plus the body size; we can't just
                    // use the outer el width because the body may be wrapping to below the label at this point;
                    // also we want the shrink-wrapped size and not the full width of the container.
                    if (!Ext.isNumber(info.width)) {
                        info.width = (owner.hideLabel ? 0 : owner.labelWidth + owner.labelPad) + owner.getBodyNaturalWidth();
                    }
                },
                adjustHorizInsets: function(owner, info) {
                    if (!owner.hideLabel) {
                        info.insets.left += owner.labelWidth + owner.labelPad;
                    }
                },
                layoutHoriz: function(owner, info) {
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
                prepare: function(owner, info) {
                    base.prepare(owner, info);
                    if (!Ext.isNumber(info.width)) {
                        var width = owner.getBodyNaturalWidth(),
                            labelEl = owner.labelEl;
                        if (labelEl) {
                            // Use unwrapped label width if greater than body width
                            width = Math.max(width, labelEl.getTextWidth());
                        }
                        info.width = width;
                    }
                },
                adjustVertInsets: function(owner, info) {
                    if (!owner.hideLabel) {
                        info.insets.top += owner.labelEl.getHeight() + owner.labelPad;
                    }
                },
                layoutHoriz: function(owner, info) {
                    if (!owner.hideLabel) {
                        owner.labelEl.setWidth(info.width);
                    }
                },
                layoutVert: function(owner, info) {
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
                prepare: function(owner) {
                    owner.errorEl.setDisplayed(false);
                },
                adjustHorizInsets: emptyFn,
                adjustVertInsets: emptyFn,
                layoutHoriz: emptyFn,
                layoutVert: emptyFn
            };

        return {
            none: base,

            /**
             * Error displayed as icon (with QuickTip on hover) to right of the bodyEl
             */
            side: applyIf({
                prepare: function(owner) {
                    var errorEl = owner.errorEl;
                    errorEl.addCls(Ext.baseCSSPrefix + 'form-invalid-icon');
                    errorEl.dom.qtip = owner.activeError || '';
                    errorEl.dom.setAttribute('ext:qclass', Ext.baseCSSPrefix + 'form-invalid-tip');
                    Ext.tip.QuickTips.init();
                    errorEl.setDisplayed(owner.hasActiveError());
                },
                adjustHorizInsets: function(owner, info) {
                    if (owner.autoFitErrors && owner.hasActiveError()) {
                        info.insets.right += owner.errorEl.getWidth();
                    }
                },
                layoutHoriz: function(owner, info) {
                    owner.errorEl.setLeft(info.width - info.insets.right);
                },
                layoutVert: function(owner, info) {
                    owner.errorEl.setTop(info.insets.top);
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
                adjustVertInsets: function(owner, info) {
                    if (owner.autoFitErrors) {
                        info.insets.bottom += owner.errorEl.getHeight();
                    }
                },
                layoutHoriz: function(owner, info) {
                    var errorEl = owner.errorEl,
                        insets = info.insets;
                    errorEl.setWidth(info.width - insets.right - insets.left);
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
                    elDom.setAttribute('ext:qclass', Ext.baseCSSPrefix + 'form-invalid-tip');
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
