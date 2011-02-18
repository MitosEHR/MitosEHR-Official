if (!Array.prototype.forEach)
{
  Array.prototype.forEach = function(fun /*, thisp*/)
  {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this)
        fun.call(thisp, this[i], i, this);
    }
  };
}

/**
 * Examples
 */
var applyLinkCallbacks = function() {

    Ext.query('.a-example').forEach(function(el) {
      Ext.get(el).on('click', function(e, el) {
        e.preventDefault();

        Ext.select('.a-example').invoke('removeClass', ['sel']);

        Ext.query('.example').forEach(function(el) {
          Ext.get(el).setStyle({display: 'none'});
        });
        Ext.get(el).addClass('sel');
        refreshExample(el.rel);
      });
    });

    Ext.query('a.docClass').forEach(function(el) {
      Ext.get(el).on('click', function(e, el) {
        e.preventDefault();
        req.docClass = Ext.get(el).dom.rel;
        showClassDoc(Ext.get(el).dom.rel);
      });
    });

    Ext.query('.a-example-edit').forEach(function(el) {
      Ext.get(el).on('click', function(e, el) {
        e.preventDefault();

        Ext.Ajax.request({
            method  : 'GET',
            url     : el.href,

            success : function(response, opts) {
                showNewExampleForm(JSON.parse(response.responseText));
            },
            failure : function(response, opts) {
              console.log('Fail')
            }
        });
      });
    });

    Ext.query('.a-example-del').forEach(function(el) {
      Ext.get(el).on('click', function(e, el) {
        e.preventDefault();
        Ext.MessageBox.confirm('Confirm', 'Are you sure you want to do that?', function(btn) {
            if (btn == 'yes') {
                Ext.Ajax.request({

                    method  : 'POST',
                    url     : el.href,

                    success : function(response, opts) {
                        Ext.get(Ext.query('#doc-examples .rgt')[0]).update(response.responseText);
                        applyLinkCallbacks();
                    },
                    failure : function(response, opts) {
                        console.log(response)
                    }
                });
            }
        });


      });
    });

    /**
     * Tabs
     */

    function bindTabs(tabId) {
      var t = Ext.get('a-doc-'+tabId)
      if(t) {
        t.on('click', function(e, el) {
          e.preventDefault();

          if (tabId == 'overview') {
              Ext.get('member-links').setStyle({display: 'block'});
          } else {
              Ext.get('member-links').setStyle({display: 'none'});
          }

          Ext.query('.doc-tab').forEach(function(el) {
            Ext.get(el).setStyle({display: 'none'});
          });

          Ext.query('.tabs a').forEach(function(el) {
            Ext.get(el).removeClass('sel');
          });

          Ext.get('a-doc-'+tabId).addClass('sel');
          Ext.get('doc-'+tabId).setStyle({display: 'block'});
        });
      }
    }

    ['overview', 'examples', 'guide', 'discussion', 'exercises', 'videos'].forEach(function(t){
      bindTabs(t);
    });

    /**
     * Member expansions
     */

    Ext.query('.member a.more').forEach(function(el) {
        Ext.get(el).on('click', function(e, el) {
            e.preventDefault();
            var prnt = el.parentNode;
            if (prnt.nodeName == 'A') {
                prnt = prnt.parentNode;
            }
            if (Ext.get(prnt).hasClass('open')) {
                Ext.get(prnt).removeClass('open');
            } else {
                Ext.get(prnt).addClass('open');
            }
        });
    });


    Ext.query('#a-new-example').forEach(function(el) {
        Ext.get(el).on('click', function(e, el) {
            ev.preventDefault();
            showNewExampleForm();
        });
    });
    
    Ext.query('#editClass').forEach(function(el) {
        Ext.get(el).on('click', function(ev, el) {
            ev.preventDefault();
            el = Ext.get(el);
            console.log(el.dom.rel);
            var head = Ext.get(document.getElementsByTagName("head")[0]);
            var script = document.createElement("script");
            script.setAttribute("src", 'http://localhost:3030/' + el.dom.rel);
            script.setAttribute("async", true);
            script.setAttribute("type", "text/javascript");

            Ext.getHead().appendChild(script);
        });
    });

}

var classListStore = new Ext.data.JsonStore({
    url: req.baseDocURL + '/classes.json',
    root: 'rows',
    autoLoad: true,
    idProperty: 'id',
    fields: [
        'id',
        'key'
    ]
});


Ext.reg('classCombo', function(h) {
    var curClassName = (h && typeof h.value == 'string') ? h.value : Ext.query('#currentClassName')[0].innerHTML;
    var c = new Ext.Container({
        style: 'padding-top: 5px;',
        layout: 'hbox',
        items: [
            {
                xtype: 'combo',
                mode: 'local',
                hiddenName: 'classes[]',
                typeAhead: true,
                triggerAction: 'all',
                forceSelection: true,
                store: classListStore,
                valueField: 'key',
                value: curClassName,
                displayField: 'key'
            },
            {
                xtype: 'button',
                width: 20,
                text: 'X',
                style: 'margin-left: 5px;',
                handler: function() {
                    var c = this.ownerCt.ownerCt;
                    this.ownerCt.destroy();
                    c.doLayout();
                }
            }
        ]
    });

    return c;
});

Ext.onReady(function() {

    /**
     * History manager for compliant browsers
     */
    if (window.history && window.history.pushState && !req.standAloneMode) {

        window.addEventListener('popstate', function(e) {
            if (e.state && e.state.docClass) {
                showClassDoc(e.state.docClass, true);
                Ext.getCmp('treePanelCmp').selectCurrentClass();
            } else if (e.state == null) { // If no state is set, must be the first page
                showClassDoc(req.origDocClass, true);
                Ext.getCmp('treePanelCmp').selectCurrentClass();
            }
        }, false);
    }

  /**
   * CSS Refresher
   */

  // setInterval(function() {
  //     Ext.get('styleCss').dom.href = "/stylesheets/style.css?" + Math.ceil(Math.random() * 10000);
  // }, 2000)

  applyLinkCallbacks();

});
