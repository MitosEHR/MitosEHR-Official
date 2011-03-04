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
        var gel = Ext.get(el);
        if(!gel.dom.rel) gel = Ext.get(el).up('a.docClass');
        showClassDoc(gel.dom.rel);
      });
    });

    var hideMember = function(m, delay) {
        setTimeout(function(){
            if(!memberOverStates[m].but && !memberOverStates[m].tab) {
                  Ext.get(m + '_sm').setStyle({'display': 'none'})
            } else {
                  Ext.get(m + '_sm').setStyle({'display': 'block'})
            }
        }, delay || 100);
    }

    var memberOverStates = {
        'cfgs': { but: false, tab: false },
        'properties': { but: false, tab: false },
        'methods': { but: false, tab: false },
        'events': { but: false, tab: false }
    }

    var addMemberEvents = function(m) {
        if(Ext.get('m-' + m)) {
            Ext.get('m-' + m).on('mouseover', function(e, el) {
                memberOverStates[m].but = true;
                hideMember(m, 100);
            });
            Ext.get('m-' + m).on('mouseout', function(e, el) {
                memberOverStates[m].but = false;
                hideMember(m);
            });
            Ext.get('m-' + m).on('click', function(e, el) {
                memberOverStates[m].but = false;
                Ext.get(m + '_sm').setStyle({'display': 'none'})
            });
        }

        if(Ext.get(m + '_sm')) {
            Ext.get(m + '_sm').on('mouseover', function(e, el) {
                memberOverStates[m].tab = true;
                hideMember(m);
            });
            Ext.get(m + '_sm').on('mouseout', function(e, el) {
                memberOverStates[m].tab = false;
                hideMember(m)
            });
            Ext.get(m + '_sm').on('click', function(e, el) {
                memberOverStates[m].tab = false;
                Ext.get(m + '_sm').setStyle({'display': 'none'})
            });
        }
    }

    for(var m in memberOverStates) {
        addMemberEvents(m)
    }

    var him = Ext.get('hideInheritedMembers');
    if(him) {
        him.on('click', function(e, el) {
            Ext.query('.member.inherited').forEach(function(m) {
                if(el.checked) {
                    Ext.get(m).setStyle({display: 'none'});
                } else {
                    Ext.get(m).setStyle({display: 'block'});
                }
            });
            Ext.query('.member.f').forEach(function(m) {
                Ext.get(m).removeClass('f');
            });
            ['cfgs', 'properties', 'methods', 'events'].forEach(function(m) {
                // If the number of inherited members is the same as the total number of members...
                if (Ext.query('.m-'+m+' .member').length == Ext.query('.m-'+m+' .member.inherited').length) {
                    if (el.checked) {
                        Ext.get(Ext.query('.m-'+m)[0]).setStyle({display: 'none'});                        
                    } else {
                        Ext.get(Ext.query('.m-'+m)[0]).setStyle({display: 'block'});
                    }
                }
                var t = el.checked ? 'ni' : 'member';
                var firstMemberEl = Ext.query('.m-'+m+' .member.' + t);
                if (firstMemberEl.length > 0) {
                    Ext.get(firstMemberEl[0]).addClass('f')
                }
            });
        });
    }
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

    ['overview', 'examples', 'guide', 'discussion', 'exercises', 'videos', 'source'].forEach(function(t){
      bindTabs(t);
    });


    /**
     * Member expansions
     */

    Ext.query('.member a.expand').forEach(function(el) {
        Ext.get(el).on('click', function(e, el) {
            e.preventDefault();
            if (el.nodeName.match(/span/i)) {
                el = el.parentNode;
            }
            var prnt = Ext.get(el);
            if (Ext.get(prnt.dom.rel).hasClass('open')) {
                Ext.get(prnt.dom.rel).removeClass('open');
            } else {
                Ext.get(prnt.dom.rel).addClass('open');
            }
        });
    });

    Ext.get('expandAllMembers').on('click', function(e, el) {
        e.preventDefault();
        Ext.query('.member').forEach(function(el) {
            Ext.get(el).addClass('open')
        });
    });
    Ext.get('collapseAllMembers').on('click', function(e, el) {
        e.preventDefault();
        Ext.query('.member').forEach(function(el) {
            Ext.get(el).removeClass('open')
        });
    });


    // Ext.query('#a-new-example').forEach(function(el) {
    //     Ext.get(el).on('click', function(e, el) {
    //         ev.preventDefault();
    //         showNewExampleForm();
    //     });
    // });
    //
    // Ext.query('#editClass').forEach(function(el) {
    //     Ext.get(el).on('click', function(ev, el) {
    //         ev.preventDefault();
    //         el = Ext.get(el);
    //         var head = Ext.get(document.getElementsByTagName("head")[0]);
    //         var script = document.createElement("script");
    //         script.setAttribute("src", 'http://localhost:3030/' + el.dom.rel);
    //         script.setAttribute("async", true);
    //         script.setAttribute("type", "text/javascript");
    //
    //         Ext.getHead().appendChild(script);
    //     });
    // });

    prettyPrint();

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

        window.addEventListener('hashchange', function(e) {
            // console.log('Hash changed')
        });
        window.addEventListener('popstate', function(e) {
            // console.log('History changed')
            if (e.state && e.state.docClass) {
                showClassDoc(e.state.docClass, true);
                Ext.getCmp('treePanelCmp').selectCurrentClass();
            } else if (e.state == null) { // If no state is set, must be the first page
                showClassDoc(req.origDocClass, true);
                var treeCmpPanel = Ext.getCmp('treePanelCmp');
                if(treeCmpPanel) treeCmpPanel.selectCurrentClass();
            }
        }, false);
    }

  /**
   * CSS Refresher
   */

  // setInterval(function() {
  //     Ext.get('styleCss').dom.href = "/css/style.css?" + Math.ceil(Math.random() * 10000);
  // }, 2000)

  applyLinkCallbacks();

});
