var docCache = {};

var showClassDoc = function(ref, noHistory) {
    if(!ref || req.docReq == ref) {
        return;
    }
	req.docReq = ref;

    var anchor, cls;
    var splt = ref.split('#');
    var fullUrl = req.baseDocURL + "/api/" + ref;

    var gotoAnchor = function() {
        
        if (!noHistory && window.history && window.history.pushState) {
			window.history.pushState({
				docClass: ref
			},
			'', fullUrl);
		}
		
        if (anchor && Ext.get('doc-overview')) {
            var scroll = Ext.get('doc-overview').getScroll();
            var anchorEl = Ext.get(anchor);
            if (!anchorEl) {
                 anchorEl = Ext.query('a[name=' + anchor + ']');
                 if(anchorEl.length) anchorEl = Ext.get(anchorEl[0]).up('.member');
            }

            if (anchorEl && anchorEl.addClass) {
                anchorEl.addClass('open');
                var scrollOffset = anchorEl.getOffsetsTo('doc-overview');
                if (scroll && scrollOffset) Ext.get('doc-overview').scrollTo('top', scroll['top'] + scrollOffset[1] - 10);
            }
        } else {
            Ext.get('doc-overview').scrollTo('top', 0);
        }
    }

    if (splt.length > 1) {
        cls = splt[0];
        anchor = splt[1];
    } else {
        cls = ref;
    }
    
	var url = req.baseDocURL + "/api/" + cls;

    if(req.docClass == cls) {
        gotoAnchor();
        return;
    }
	req.docClass = cls;

	if (req.standAloneMode) {
		if (window.location.href.match(/api/)) {
			window.location = cls + '.html';
		} else {
			window.location = 'api/' + cls + '.html';
		}
		return;
	}

	var successFunc = function(response) {
		var title = document.title.split(" | ");
		document.title = cls + " | " + title.slice(1).join(" | ");

		Ext.get(Ext.query('#docContent')[0]).update(response.responseText);
		applyLinkCallbacks();
		codeEditors();
		var treeCmpPanel = Ext.getCmp('treePanelCmp');
        if (treeCmpPanel) treeCmpPanel.selectCurrentClass();
        gotoAnchor();
	};

	if (docCache[url]) {
		successFunc(docCache[url]);
	} else {
		Ext.Ajax.request({
			url: url + '/ajax',
			success: function(response) {
				docCache[url] = response;
				successFunc(response);
			}
		});
	}
}

Ext.onReady(function() {

	var convert = function(classes) {
		var tree = {},
			nodes = [],
			id = 0;

			c = classes;

		classes.keys.forEach(function(cls) {

			var parts = cls.split('.'),
				prevObject = tree;

			var stitchedParts = [];
			for (var i = 0; i < parts.length; i++) {
				if (i > 0 && parts[i + 1]  && parts[i + 1][0] && parts[i][0] && parts[i][0].match(/^[A-Z]/) && parts[i + 1][0].match(/^[A-Z]/)) {
					var n = parts.splice(i, 2).join('.');
					parts.splice(i, 0, n);
				}
			}

			parts.forEach(function(part) {
				if (!prevObject[part]) {
					prevObject[part] = {};
				}

				prevObject = prevObject[part];
			});
		});

		function handleTree(cls, tree) {
			var innerNodes = [];

            var treeKeys = [];
            for (var key in tree) treeKeys.push(key);

			treeKeys.forEach(function(key) {
				innerNodes.push({
					id: id++,
					text: key
				});
				innerNodes[innerNodes.length - 1].allowDrop = false;
				var clsName = (cls ? (cls + ".") : "") + key;
				var clsData = classes.get(clsName);

				var subTreeKeys = [];
                for (var k2 in tree[key]) subTreeKeys.push(k2);
				if (subTreeKeys.length) {
					innerNodes[innerNodes.length - 1].children = handleTree(clsName, tree[key]);
					innerNodes[innerNodes.length - 1].allowDrag = false;
                    innerNodes[innerNodes.length - 1].iconCls = 'icon-pkg';
                    if(clsData) {
                        innerNodes[innerNodes.length - 1].className = clsName;
                        innerNodes[innerNodes.length - 1].text = innerNodes[innerNodes.length - 1].text + '<a rel="'+clsName+'" class="fav"></a>';
                        innerNodes[innerNodes.length - 1].iconCls = 'icon-' + clsData.data.value.clsType;
                    }
				} else {
    				if(clsData) {
                        innerNodes[innerNodes.length - 1].iconCls = 'icon-' + clsData.data.value.clsType;
    				}

                    innerNodes[innerNodes.length - 1].text = innerNodes[innerNodes.length - 1].text + '<a rel="'+clsName+'" class="fav"></a>';
					innerNodes[innerNodes.length - 1].leaf = true;
					innerNodes[innerNodes.length - 1].className = clsName;
				}
			});

			return innerNodes;
		}

		return handleTree(null, tree);
	};

	var convertArr = function(classes) {
		var tree = {},
			nodes = [],
			id = 0;

		classes.keys.forEach(function(cls) {
			var parts = cls,
				prevObject = tree;

			parts.forEach(function(part) {
				if (!prevObject[part]) {
					prevObject[part] = {};
				}

				prevObject = prevObject[part];
			});
		});

		function handleTree(cls, tree) {
			var innerNodes = [];

			for (var key in tree) {
				innerNodes.push({
					id: id++,
					text: key
				});
				innerNodes[innerNodes.length - 1].allowDrop = false;

				var clsName = key;
                var clsData = classPackagesStore.data.get(key);

				innerNodes[innerNodes.length - 1].className = clsName;
				var l = 0;
				for (var k2 in tree[key]) l++;
				if (l) {
					innerNodes[innerNodes.length - 1].children = handleTree(clsName, tree[key]);
					innerNodes[innerNodes.length - 1].allowDrag = false;
					innerNodes[innerNodes.length - 1].iconCls = 'icon-pkg';
                    if(clsData) {
                        innerNodes[innerNodes.length - 1].className = clsName;
                        innerNodes[innerNodes.length - 1].iconCls = 'icon-' + clsData.data.value.clsType;
                    }
				} else {
                    if(clsData) {
                        innerNodes[innerNodes.length - 1].iconCls = 'icon-' + clsData.data.value.clsType;
                    }

					innerNodes[innerNodes.length - 1].leaf = true;
					innerNodes[innerNodes.length - 1].className = clsName;
				}
			}

			return innerNodes;
		}

		return handleTree(null, tree);
	};

	var treePanel, treePanelContainer;

	showClassTree = function(treeType) {

		var rootNode = new Ext.tree.AsyncTreeNode({
			expanded: true,
			children: (treeType == 'byPackage') ? classesByPackage : (treeType == 'byCategory' ? classesByCategory : classesByHierarchy)
		});

		if (!treePanel) {

			treePanel = new Ext.tree.TreePanel({
				cls: 'treePanel',
				id: 'treePanelCmp',
				animate: false,
				autoScroll: false,
				border: false,
				split: true,
				enableDD: false,
				dropConfig: {
					allowContainerDrop: false
				},
				loader: new Ext.tree.TreeLoader({
					preloadChildren: true
				}),
				root: rootNode,
				rootVisible: false,
				listeners: {
					click: function(node, evt) {
					    if (evt.target.className == 'fav') {
    					    evt.preventDefault();
    					    var elNode = Ext.get(node.ui.elNode);
    					    var store = Ext.getCmp('favClasses').getStore();
    					    if (elNode.hasClass('fav')) {
    					        elNode.removeClass('fav');
    					        store.removeAt(store.indexOfId(node.attributes.className));
    					    } else {
    					        elNode.addClass('fav');
    					        store.add(new store.recordType({value: node.attributes.className}, node.attributes.className));
    					    }
    					    Ext.getCmp('favClasses').refresh();
    					    Ext.get('treePanelCmp').setStyle({'top': Ext.get('sortPackagesBy').getY() + 35 + 'px'});
        				    applyLinkCallbacks();
    					    return false;
					    } else if (node.attributes.className) {
							showClassDoc(node.attributes.className);
						} else if (!node.leaf) {
						    if (node.isExpanded()) {
    						    node.collapse(false, true);
						    } else{
    						    node.expand(false, true);
						    }
						}
					}
				}
			});
			if (treeType == 'byPackage' || treeType == 'byHierarchy') {
    			new Ext.tree.TreeSorter(treePanel, {
    				folderSort: true
    			});
			}

			treePanel.selectCurrentClass = function() {
				if (req.docClass == 'undefined') {
					Ext.getCmp('treePanelCmp').getRootNode().childNodes[0].expand();
				} else {
					var classNode = treePanel.getRootNode().findChild('className', req.docClass, true);
					if (classNode) {
    					treePanel.expandPath(classNode.getPath(), null, function() {
    						var classNode = treePanel.getRootNode().findChild('className', req.docClass, true);
    						classNode.select();
    					});
					}
				}
			};

			treePanelContainer = new Ext.Container({
				items: [
                    {
                        xtype: 'dataview',
                        id: 'favClasses',
                        store: {
                            id: 'favoritesStore',
                            xtype: 'arraystore',
                            fields: ['id', 'value'],
                            idIndex: 0
                        },
                        tpl: new Ext.XTemplate(
                            '<h2>Favorites</h2>',
                            '<div class="favorites">',
                                '<tpl for=".">',
                                    '<div><a rel="{value}" href="#" class="docClass">{value}</a></div>',
                                '</tpl>',
                            '</div>'
                        )
                    },
    				{
    					html: ['<div class="sortBy" id="sortPackagesBy">',
    					    '<h2>Sort by <select>',
    					        '<option value="byPackage">Package</option>',
    					        '<option value="byHierarchy">Hierarchy</option>',
                                '<option value="byCategory">Category</option>',
        					'</select></h2>',
        					'<a href="#" title="Expand All" id="expandAll"></a>',
        					'<a href="#" title="Collapse All" id="collapseAll"></a>',
    					'</div>'].join(''),
    					xtype: 'container'
    				},
    				treePanel
				],
				listeners: {
				    afterrender: function() {
				        Ext.get('treePanelCmp').setStyle({'top': Ext.get('sortPackagesBy').getY() + 35 + 'px'});
				    }
				}
			});

			treePanelContainer.render('treePanel');
			treePanelContainer.show();

			Ext.get('expandAll').on('click', function(e, el) {
                e.preventDefault();
                var treePanel = Ext.getCmp('treePanelCmp');
                if (treePanel) {
                    treePanel.root.expand(true, false);
                    treePanel.selectCurrentClass();
                }
            });

            Ext.get('collapseAll').on('click', function(e, el) {
                e.preventDefault();
                var treePanel = Ext.getCmp('treePanelCmp');
                if (treePanel) {
                    treePanel.root.collapse(true);
    				treePanel.root.childNodes[0].expand();
                }
            });

			Ext.get('sortPackagesBy').on('change', function(ev, el) {
				showClassTree(Ext.get(el).dom.value);
			});

		} else {
			treePanel.setRootNode(rootNode);
		}

		treePanel.selectCurrentClass();
	};

    var classPackagesStore;
	if (req.standAloneMode) {
		classPackagesStore = new Ext.data.JsonStore({
			idProperty: 'id',
			data: classByPackageData,
			fields: ['id', 'key', 'value']
		});
		classesByPackage = convert(classPackagesStore.data);
		showClassTree('byPackage');
	} else {
		classPackagesStore = new Ext.data.JsonStore({
			url: req.baseDocURL + '/classes.json',
			root: 'rows',
			autoLoad: true,
			idProperty: 'id',
			fields: ['id', 'key', 'value'],
			listeners: {
				load: function() {
					classesByPackage = convert(classPackagesStore.data);
					populateClassCategories();
					showClassTree('byPackage');
				}
			}
		});
	}

    var classHierarchyStore;
    if (req.standAloneMode) {
        classHierarchyStore = new Ext.data.JsonStore({
            data: classByHierarchyData,
            idProperty: 'key',
            fields: ['id', 'key']
        });
        classesByHierarchy = convertArr(classHierarchyStore.data);
    } else {
        classHierarchyStore = new Ext.data.JsonStore({
            url: req.baseDocURL + '/class_hierarchy.json',
            root: 'rows',
            autoLoad: true,
            idProperty: 'key',
            fields: ['id', 'key'],
            listeners: {
                load: function() {
                    classesByHierarchy = convertArr(classHierarchyStore.data);
                }
            }
        });
    };

    var classesByCategory = [];
    var populateClassCategories = function() {
        Ext.Ajax.request({
			url: req.baseDocURL + '/class_categories.json',
			success: function(response) {
			    var classes = JSON.parse(response.responseText)
			    var id = 0;

			    for(var c=0; c< classes.organisation.length; c++) {

			        var topLevel = classes.organisation[c];
			        var midLevelNodes = [];

			        for (var d=0; d< topLevel.categories.length; d++) {
			            var cls = topLevel.categories[d];

                        var innerNodes = [];

                        for (var i=0; i< classes.categories[cls].classes.length; i++) {

                            var curCls = classes.categories[cls].classes[i];
                            var clsData = classPackagesStore.data.get(curCls);
                            innerNodes.push({
                                id: id++,
                                text: curCls,
                                className: curCls,
                                leaf: true,
                                iconCls: clsData ? 'icon-' + clsData.data.value.clsType : ''
                            });
                        }

                        midLevelNodes.push({
                            id: id++,
                            text: cls,
                            iconCls: classes.categories[cls].guide ? 'icon-book' : 'icon-pkg',
                            children: innerNodes
                        });
    			    }

                    classesByCategory.push({
                        id: id++,
                        text: topLevel.name,
                        iconCls: topLevel.guide ? 'icon-book' : 'icon-pkg',
                        children: midLevelNodes
                    });
			    }
			}
		});
    };



});
