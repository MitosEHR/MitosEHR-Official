/**
 * @ignore
 */
Ext.define('Ext.window.MessageBoxWindow', {
    extend: 'Ext.window.Window',

    requires: [
        'Ext.Component',
        'Ext.toolbar.Toolbar',
        'Ext.form.Text',
        'Ext.form.TextArea',
        'Ext.button.Button',
        'Ext.layout.container.Card'
    ],

    alias: 'widget.messagebox',

    // hide it by offsets. Windows are hidden on render by default.
    hideMode: 'offsets',

    height: 200,
    width: 300,

    layout: 'card',

    buttonText: {
        ok: 'Ok',
        cancel: 'Cancel',
        yes: 'Yes',
        no: 'No'
    },

    titleText: {
        confirm: 'Confirm',
        prompt: 'Prompt',
        wait: 'Loading...',
        alert: 'Attention'
    },

    makeButton: function(btn) {
        return Ext.create('Ext.button.Button', {
            handler: Ext.Function.bind(this.btnCallback, this, [btn]),
            scope: this,
            text: this.buttonText[btn],
            hidden: true
        });
    },

    btnCallback: function(btn) {
        var value, field;
        if (this.type == 'prompt') {
            if (this.multiline) {
                field = this.textAreaCard;
            } else {
                field = this.textFieldCard;
            }
            value = field.getValue();
            field.reset();
        }
        this.userCallback(btn, value);
    },

    initComponent: function() {
        this.title = '&nbsp;';

        this.okBtn = this.makeButton('ok');
        this.cancelBtn = this.makeButton('cancel');
        this.yesBtn = this.makeButton('yes');
        this.noBtn = this.makeButton('no');

        this.bottomTb = new Ext.toolbar.Toolbar({
            dock: 'bottom',
            items: [
                this.cancelBtn,
                this.noBtn,
                {xtype: 'component', flex: 1},
                this.okBtn,
                this.yesBtn
            ]
        });
        this.dockedItems = [this.bottomTb];

        this.textCard = new Ext.Component({
            styleHtmlContent: true
        });
        this.textFieldCard = new Ext.form.Text({name:Ext.id(null, 'messagebox-textfield-')});
        this.textAreaCard = new Ext.form.TextArea({name:Ext.id(null, 'messagebox-textarea-')});
        this.items = [this.textCard, this.textFieldCard, this.textAreaCard];

        Ext.window.MessageBoxWindow.superclass.initComponent.call(this);
    },

    reconfigure: function(type, cfg) {
        cfg = cfg || {};
        this.type = type;
        if (!this.rendered) {
            this.render(Ext.getBody());
        }

        // wrap the user callback
        this.userCallback = Ext.Function.bind(cfg.callback || Ext.emptyFn, cfg.scope || window);

        var okCancelMth, yesNoMth, card;
        switch (type) {
            case 'confirm':
                okCancelMth = 'hide';
                yesNoMth = 'show';
                this.textCard.update(cfg.text);
                this.getLayout().setActiveItem(this.textCard);
                break;
            case 'prompt':
                okCancelMth = 'show';
                yesNoMth = 'hide';
                this.multiline = cfg.multiline;
                if (cfg.multiline) {
                    this.getLayout().setActiveItem(this.textAreaCard);
                } else {
                    this.getLayout().setActiveItem(this.textFieldCard);
                }
                break;
            case 'wait':
                okCancelMth = 'hide';
                yesNoMth = 'hide';
                this.textCard.update(cfg.text);
                this.getLayout().setActiveItem(this.textCard);
                break;
            case 'alert':
                okCancelMth = 'hide';
                yesNoMth = 'hide';
                this.textCard.update(cfg.text);
                this.getLayout().setActiveItem(this.textCard);
                break;
        }
        if (okCancelMth == 'hide' && yesNoMth == 'hide' && this.type !== 'alert') {
            this.bottomTb.hide();
        } else {
            this.bottomTb.show();
        }
        this.yesBtn[yesNoMth]();
        this.noBtn[yesNoMth]();
        this.okBtn[this.type == 'alert' ? 'show' : okCancelMth]();
        this.cancelBtn[okCancelMth]();
        //this.topTb.setTitle(cfg.title || this.titleText[type]);
    },

    showType: function(type, cfg) {
        this.reconfigure(type, cfg);
        this.center();
        this.show();
        return this;
    },

    confirm: function(cfg) {
        return this.showType('confirm', cfg);
    },
    prompt: function(cfg) {
        return this.showType('prompt', cfg);
    },
    wait: function(cfg) {
        return this.showType('wait', cfg);
    },
    alert: function(cfg) {
        return this.showType('alert', cfg);
    }
}, function() {
    Ext.Loader.onReady(function() {
        Ext.MessageBox = Ext.Msg = new Ext.window.MessageBoxWindow();
    });
});