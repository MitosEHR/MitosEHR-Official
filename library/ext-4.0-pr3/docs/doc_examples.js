var refreshExample = function(exampleId) {

    var url = req.baseDocURL + "/api/" + req.docClass + '/examples/' + exampleId;

    Ext.Ajax.request({

        headers : { 'Content-Type' : 'application/json' },
        method  : 'GET',
        url     : url,

        success : function(response, opts) {
            Ext.get(Ext.query('#doc-examples')[0]).update(response.responseText);
            applyLinkCallbacks();
        },
        failure : function(response, opts) {
          console.log('Fail')
        }
    });
}

var showNewExampleForm = function(doc) {

    var oldWindow = Ext.getCmp('new-example-window');
    if (oldWindow) oldWindow.destroy();

    var examplesStore = new Ext.data.JsonStore({
        url: '/sencha_examples',
        storeId: 'examplesStore',
        root: 'doc',
        idProperty: '_id',
        fields: ['content', 'description', 'screenshot', 'title']
    });
    
    var inlineExample = [
        {
            plugins: [ Ext.ux.FieldLabeler ],
            fieldLabel: 'Title',
            name: 'title',
            value: doc ? doc.title : ''
        },
        {
            xtype: 'textarea',
            plugins: [ Ext.ux.FieldLabeler ],
            fieldLabel: 'Description',
            name: 'description',
            height: 35,
            value: doc ? doc.description : ''
        },
        {
            plugins: [ Ext.ux.FieldLabeler ],
            fieldLabel: 'Screenshot URL',
            name: 'screenshot',
            value: doc ? doc.screenshot : ''
        },
        {
            xtype: 'textarea',
            id: 'exampleFormContent',
            style: 'font-family: courier',
            plugins: [ Ext.ux.FieldLabeler ],
            fieldLabel: 'Content',
            name: 'content',
            flex: 2,
            value: doc ? doc.content : ''
        }
    ];

    var urlExample = [
        {
            plugins: [ Ext.ux.FieldLabeler ],
            fieldLabel: 'Title',
            name: 'title',
            value: doc ? doc.title : ''
        },
        {
            xtype: 'textarea',
            plugins: [ Ext.ux.FieldLabeler ],
            fieldLabel: 'Description',
            name: 'description',
            height: 35,
            value: doc ? doc.description : ''
        },
        {
            plugins: [ Ext.ux.FieldLabeler ],
            fieldLabel: 'Screenshot URL',
            name: 'screenshot',
            value: doc ? doc.screenshot : ''
        },
        {
            plugins: [ Ext.ux.FieldLabeler ],
            fieldLabel: 'URL',
            name: 'content',
            value: doc ? doc.content : ''
        }
    ];

    var form = new Ext.Container({
        labelWidth: 100,
        flex: 2,
        height: 200,
        layout: {
            type: 'vbox',
            align: 'stretch'  // Child items are stretched to full width
        },
        defaults: {
            xtype: 'textfield'
        },

        items: (doc && doc.exampleType && doc.exampleType == 'url') ? urlExample : inlineExample
    });

    var newClassCombo = function(value) {
        var rhs = Ext.getCmp('newExampleRhs'),
            idx = rhs.items.indexOf(Ext.getCmp('newExampleAddClassButton'));
        if (value == undefined) {
            rhs.insert(idx, {xtype: 'classCombo'});
        } else {
            rhs.insert(idx, {xtype: 'classCombo', value: value});
        }
        rhs.doLayout();
    }

    var rightHandSide = new Ext.Container({
        id: 'newExampleRhs',
        width: 200,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [
            {
                xtype: 'label',
                text: 'Example type'
            },
            {
                xtype: 'combo',
                triggerAction: 'all',
                forceSelection: true,
                hiddenName: 'exampleType',
                mode: 'local',
                store: new Ext.data.ArrayStore({
                    id: 0,
                    fields: ['id', 'displayText'],
                    data: [
                        ['inline', 'Inline example'],
                        ['file', 'Stand alone HTML'],
                        ['url', 'URL for iFrame'],
                        ['zip', 'Contained Zip file']
                    ]
                }),
                value: doc ? doc.exampleType : 'inline',
                valueField: 'id',
                displayField: 'displayText',
                listeners: {
                    select: function(field, b, c, d) {
                        if (field.value == 'url') {
                            form.removeAll();
                            form.add(urlExample);
                            form.doLayout();
                        } else {
                            form.removeAll();
                            form.add(inlineExample);
                            form.doLayout();                            
                        }
                    }
                }
            },
            {
                xtype: 'label',
                style: 'padding-top: 8px',
                text: 'Classes'
            },
            {
                xtype: 'container',
                style: 'padding: 5px 0 5px 0',
                id: 'newExampleAddClassButton',
                items: [
                    {
                        xtype: 'button',
                        width: 60,
                        text: 'Add',
                        handler: function() {
                            newClassCombo('');
                        }
                    }
                ]
            },
            {
                xtype: 'container',
                items: {
                    xtype: 'panel',
                    collapsible: true,
                    collapsed: true,
                    title: 'How to Format',
                    padding: 10,
                    html: [
                        'put returns between paragraphs',
                        '<br/>for linebreak add 2 spaces at end',
                        '<br/>_italic_ or **bold**',
                        '<br/>indent code by 4 spaces',
                        '<br/>backtick escapes `like _so_`',
                        '<br/>quote by placing > at start of line',
                        '<br/>links: [foo](http://foo.com)',
                        '<br/>images: ![Alt txt](img_url.jpg)'
                    ].join('')
                }
            }
        ]
    });

    container = new Ext.form.FormPanel({
        baseCls: 'x-plain',
        url: '/sencha_examples',
        id: 'new-example-form',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [
           form,
           { xtype: 'spacer', width: 20 },
           rightHandSide
        ]
    });

    container.add({ id: 'newExampleId', xtype: 'hidden', name: '_id', value: doc ? doc._id : '' });
    container.add({ id: 'newExampleRev', xtype: 'hidden', name: '_rev', value: doc ? doc._rev : '' });

    var w = new Ext.Window({
        title: 'New Example',
        id: 'new-example-window',
        width: 750,
        height: 500,
        minWidth: 300,
        minHeight: 200,
        layout: 'fit',
        plain: true,
        bodyStyle: 'padding:5px;',
        buttonAlign: 'center',
        items: container,
        buttons: [
            {
                text: 'Save',
                listeners: {
                    click: function() {
                        var data = Ext.apply(doc || {}, container.getForm().getValues());

                        if (typeof data['classes[]'] == 'string') {
                            data.classes = [data['classes[]']];
                        } else {
                            data.classes = data['classes[]'];
                        }
                        delete data['classes[]'];

                        if (!data['_id']) delete data['_id'];
                        if (!data['_rev']) delete data['_rev'];

                        data.position = Number(new Date);
                        data.example = true;

                        var method = 'POST', url = '/sencha_examples';
                        if (data['_id'] && data['_rev']) {
                            method = 'PUT';
                            url = url + '/' + data['_id'];
                        }

                        Ext.Ajax.request({

                            headers : { 'Content-Type' : 'application/json' },
                            method  : method,
                            url     : url,
                            encode  : false,
                            jsonData: data,

                            success : function(response, opts) {
                                var responseDoc = JSON.parse(response.responseText);

                                if(responseDoc.id && responseDoc.rev) {

                                    refreshExample(responseDoc.id);

                                    Ext.getCmp('newExampleId').setValue(responseDoc.id);
                                    Ext.getCmp('newExampleRev').setValue(responseDoc.rev);
                                    if (!Ext.getCmp('newExampleDropScreenshot')) {
                                        addDragDropFields(responseDoc);
                                    }
                                }
                            },
                            failure : function(response, opts) {
                              console.log('Fail')
                            }
                        });
                    }
                }
            },
            {
                text: 'Cancel',
                handler: function() {
                    w.close();
                }
            }
        ]
    });

    w.show();

    if (doc) {
        for (var i=0; i< doc.classes.length; i++) {
            newClassCombo(doc.classes[i]);
        }
    } else {
        newClassCombo();
    }

    var addDragDropFields = function(doc) {

        rightHandSide.add({ xtype: 'spacer', height: 20 });

        if (doc._attachments) {
            for(var a in doc._attachments) {
                var cls = doc._attachments[a].content_type.replace(/[^a-z]/g, '-');
                rightHandSide.add({
                    xtype: 'container',
                    html: [
                        '<a href="/sencha_examples/'+doc._id+'/' + a + '" class="attachment '+cls+'">' + a + '</a>'
                    ].join('')
                });
            }
        }

        rightHandSide.add({
            xtype: 'container',
            id: 'newExampleDropScreenshot',
            style: 'padding: 20px; border: 2px solid black; width: 200px; text-align: center; font-weight: bold;',
            html: 'Drag attachments',
            // flex: 1,
            listeners: {
                render: function(p) {
                    p.getEl().on('dragenter', function(e){
                        e.stopPropagation();
                        e.preventDefault();
                        Ext.get(e.target).setStyle({border: '2px dashed red'})
                        // console.log('enter', e.target.id)
                    });
                    p.getEl().on('dragover', function(e){
                        e.stopPropagation();
                        e.preventDefault();
                    });
                    p.getEl().on('dragleave', function(e){
                        e.stopPropagation();
                        e.preventDefault();
                        Ext.get(e.target).setStyle({border: '2px solid black'})
                        // console.log('leave')
                    });
                    p.getEl().on('drop', function(e){
                        // console.log( e.browserEvent.dataTransfer.files );
                        var files = e.browserEvent.dataTransfer.files;
                        if (files.length == 1) {
                            var file = files[0];
                            Ext.get(e.target).update("Dropped");
                            var xhr = new XMLHttpRequest();

                            xhr.open('POST', "/upload_screenshot", true);
                            var formData = new FormData();
                            formData.append("attachment", file);

                            doc._id = Ext.getCmp('newExampleId').value;
                            doc._rev = Ext.getCmp('newExampleRev').value;
                            formData.append("doc", JSON.stringify(doc));

                            xhr.onreadystatechange = function (aEvt) {
                                if (xhr.readyState == 4) {
                                    var resp = JSON.parse(aEvt.target.response)
                                    showNewExampleForm(resp);
                                    Ext.getCmp('newExampleId').setValue(resp._id);
                                    Ext.getCmp('newExampleRev').setValue(resp._rev);

                                    // console.log(JSON.parse(aEvt.target.response));
                                }
                            };

                            xhr.send(formData);
                        }
                        Ext.get(e.target).setStyle({border: '2px solid black'})

                        e.stopPropagation();
                        e.preventDefault();
                    });
                }
            }
        });

        container.doLayout();
    };

    if (doc && doc._id) {
        addDragDropFields(doc);
    }

}
