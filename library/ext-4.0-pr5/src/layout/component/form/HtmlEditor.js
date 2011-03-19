/**
 * @private
 * @class Ext.layout.component.form.HtmlEditor
 * @extends Ext.layout.component.form.Field
 * Layout class for {@link Ext.form.HtmlEditor} fields. Sizes the toolbar, textarea, and iframe elements.
 * @private
 */

Ext.define('Ext.layout.component.form.HtmlEditor', {
    extend: 'Ext.layout.component.form.Field',
    alias: ['layout.htmleditor'],

    type: 'htmleditor',

    sizeBodyContents: function(width, height) {
        var me = this,
            owner = me.owner,
            bodyEl = owner.bodyEl,
            toolbar = owner.getToolbar(),
            textarea = owner.textareaEl,
            iframe = owner.iframeEl,
            editorHeight;

        width -= bodyEl.getFrameWidth('lr');
        toolbar.setWidth(width);
        textarea.setWidth(width);
        iframe.setWidth(width);

        // If fixed height, subtract toolbar height from the input area height
        if (Ext.isNumber(height)) {
            editorHeight = height - toolbar.getHeight() - bodyEl.getFrameWidth('tb');
            textarea.setHeight(editorHeight);
            iframe.setHeight(editorHeight);
        }
    }
});