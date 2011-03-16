Ext.regModel('States', {
    fields: [
        {type: 'string', name: 'abbr'},
        {type: 'string', name: 'state'}
    ]
});

var getRemoteStore = function() {
    return  new Ext.data.Store({
        autoLoad: true,
        model: 'States',
        proxy: {
            type: 'ajax',
            url: 'states.json',
            reader: {
                root: 'states'
            }
        }
    });
};

    

var myData = [
    {
        company: '3m Co',
        price  : 71.72
    },
    {
        company: 'Alcoa Inc',
        price  : 29.01
    },
    {
        company: 'Altria Group Inc',
        price  : 83.81
    },
    {
        company: 'afs Inc',
        price  : 83.81
    },
    {
        company: 'asfasf Inc',
        price  : 83.81
    },
    {
        company: 'another Group Inc',
        price  : 83.81
    },
    {
        company: 'Fooo',
        price  : 83.81
    },
    {
        company: 'Stuff',
        price  : 83.81
    }
];

Ext.regModel('Company', {
    fields: [
       {name: 'company'},
       {name: 'price',      type: 'float'}
    ]
});

var getLocalStore = function() {
    return new Ext.data.Store({
        model: 'Company',
        data: myData
    });
};



Ext.define("Ext.layout.MultiSelectFieldLayout", {
    extend: "Ext.layout.component.form.Field",
    
    type: 'multiselectfield',
    alias: 'layout.multiselectfield',

    setElementSize: function(target, w, h) {
        var owner = this.owner,
            labelWidth = owner.labelEl.getWidth();

        owner.list.setSize(w - labelWidth, h);
    }
});

// Ext.regLayout('multiselectfield', Ext.layout.MultiSelectFieldLayout);

Ext.define("Ext.form.MultiSelect", {
    extend: 'Ext.form.Field',
    alias: 'widget.multiselect',

    componentLayout: 'multiselectfield',
    // SIMPLE/SINGLE/MULTI
    selectionMode: 'SIMPLE',
    fieldSubTpl: new Ext.XTemplate(
        '<div class="x-form-element" id="x-form-el-{id}" style="{elementStyle}">',
        '</div>', {
        compiled: true,
        disableFormats: true
    }),
    
    displayField: 'text',
    valueField: undefined,
    initComponent: function() {
        this.store = Ext.data.StoreMgr.lookup(this.store);
        //<debug>
        if (!this.store) {
            throw "No store defined on MultiSelect.";
        }
        //</debug>
        if (!Ext.isDefined(this.valueField)) {
            this.valueField = this.displayField;
        }
        Ext.form.MultiSelect.superclass.initComponent.call(this);
    },
    onRender: function(ct, pos) {
        Ext.form.MultiSelect.superclass.onRender.apply(this, arguments);
        var list = this.getList();
    },
    getList: function() {
        // if no list, initialize it
        if (!this.list) {
            var opts = {
                selModel: {
                    mode: this.selectionMode
                },
                renderTo: this.formEl,
                store: this.store,
                displayField: this.displayField
            };

            this.list = new Ext.BoundList(opts);
        }
        return this.list;
    },
    
    getValue: function() {
        var list   = this.getList(),
            rs     = list.getSelectionModel().getSelection(),
            ln     = rs.length,
            values = [],
            i      = 0;
        
        for (; i < ln; i++) {
            values.push(
                rs[i].get(this.valueField)
            );
        }
        return values;
        
    }
});

Ext.onReady(function(){

    // Basic Usage of MultiSelect
    var itemSelector = new Ext.form.MultiSelect({
        store: getLocalStore(),
        height: 200,
        displayField: 'company',
        name: 'companySelected',
        fieldLabel: 'MultiSelect'
    });
    
    // Reorderable MultiSelect
    // Should getValue return only selected records or is order enough
    
    // ItemSelector
    
    // Basic Usage of ComboBox with local data (store has already been loaded)
    var single = new Ext.form.ComboBox({
        fieldLabel: 'Single Combo',
        displayField: 'company',
        name: 'single',
        typeAhead: true,
        store: getLocalStore(),
        queryMode: 'local',
        selectOnFocus: true,
        value: 'Alcoa Inc'
    });
    
    // ComboBox with local data and multiSelect
    // implies that typeAhead is off
    var multi = new Ext.form.ComboBox({
        fieldLabel: 'Multi Combo',
        displayField: 'company',
        name: 'multi',
        store: getLocalStore(),
        queryMode: 'local',
        multiSelect: true
    });
    
    // ComboBox with editable: false, canned list of values to select from
    var singleNotEditable = new Ext.form.ComboBox({
        editable: false,
        fieldLabel: 'Single Combo',
        displayField: 'company',
        name: 'single',
        queryMode: 'local',
        store: getLocalStore()
    });
    
    // Multiple not editable
    var multipleNotEditable = new Ext.form.ComboBox({
        editable: false,
        multiSelect: true,
        fieldLabel: 'Multi Select Not Editable Combo',
        displayField: 'company',
        name: 'single',
        queryMode: 'local',
        store: getLocalStore()
    });
    
    // ComboBox with remote data
    var remote = new Ext.form.ComboBox({
        id: 'remote',
        fieldLabel: 'Remote',
        displayField: 'state',
        valueField: 'abbr',
        name: 'remote',
        value: 'CA',
        store: getRemoteStore()
    });
    
    // ComboBox with custom template
    var custTpl = new Ext.form.ComboBox({
        fieldLabel: 'Custom Tpl',
        displayField: 'company',
        name: 'single',
        queryMode: 'local',
        store: getLocalStore(),
        emptyText: 'Pick a Company',
        getInnerTpl: function(displayField) {
            return '&raquo; {' + displayField + '}';
        }
    });
    
    
    // Cascading ComboBox example/subclass
    
    
    // ComboBox with remote store where user enters a query
    // and then clicks on triggerfield to perform the search
    // no automatic searching is done during typing should
    // this be a separate class? SearchField
    
    
    
    var form = new Ext.form.FormPanel({
        title: 'Bound Lists in Use',
        resizable: true,
        bodyStyle: 'padding: 10px',
        renderTo: Ext.getBody(),
        width: 600,
        items: [
            itemSelector,
            single,
            multi,
            singleNotEditable,
            multipleNotEditable,
            remote,
            custTpl
        ],
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: [{
                xtype: 'button',
                handler: function() {
                    console.dir(form.getForm().getFieldValues());
                },
                text: 'Get values'
            }]
        }]
    });
    
});
