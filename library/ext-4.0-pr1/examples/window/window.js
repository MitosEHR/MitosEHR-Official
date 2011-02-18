Ext.require([
    'Ext.window.Window',
    'Ext.tab.*',
    'Ext.toolbar.Spacer',
    'Ext.layout.container.Card',
    'Ext.layout.container.Border'
]);

Ext.onReady(function(){

    Ext.util.Region.override({
        colours: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'],
        nextColour: 0,
        show: function(){
            var style = {
                display: 'block',
                position: 'absolute',
                top: this.top + 'px',
                left: this.left + 'px',
                height: ((this.bottom - this.top) + 1) + 'px',
                width: ((this.right - this.left) + 1) + 'px',
                opacity: 0.3,
                'pointer-events': 'none',
                'z-index': 9999999
            };
            if (!this.highlightEl) {
                style['background-color'] = this.colours[this.nextColour];
                Ext.util.Region.prototype.nextColour++;
                this.highlightEl = Ext.getBody().createChild({
                    style: style
                });
                if (this.nextColour >= this.colours.length) {
                    this.nextColour = 0;
                }
            } else {
                this.highlightEl.setStyle(style);
            }
        },
        hide: function(){
            if (this.highlightEl) {
                this.highlightEl.setStyle({
                    display: 'none'
                });
            }
        }
    });

    var win2 = Ext.create('widget.window', {
        height: 200,
        width: 400,
        x: 450,
        y: 450,
        title: 'Constraining Window',
        closable: false,
        items: [floater = new Ext.Component({
            xtype: 'component',
            floating: true,
            height: 50,
            width: 50,
            x: 175,
            y: 75
        }), constrainedWin = new Ext.Window({
            title: 'Constrained Window',
            width: 100,
            height: 100,
            x: 20,
            y: 20,
            constrain: true
        }), constrainedWin2 = new Ext.Window({
            title: 'Header-Constrained Win',
            width: 100,
            height: 100,
            x: 120,
            y: 120,
            constrainHeader: true
        })]
    });
    win2.show();
    floater.show();
    constrainedWin.show();
    constrainedWin2.show();
    
    new Ext.Window({
        title: 'Left Header',
        width: 400,
        height: 200,
        x: 10,
        y: 200,
        headerPosition: 'left'
    }).show();

    new Ext.Window({
        title: 'Right Header',
        width: 400,
        height: 200,
        x: 450,
        y: 200,
        headerPosition: 'right'
    }).show();

    new Ext.Window({
        title: 'Bottom Header',
        width: 400,
        height: 200,
        x: 10,
        y: 450,
        headerPosition: 'bottom'
    }).show();
});
