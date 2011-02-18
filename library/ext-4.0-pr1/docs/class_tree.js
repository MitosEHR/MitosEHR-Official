var docCache = {};

var showClassDoc = function(cls, noHistory) {
	req.docClass = cls;

	if (req.standAloneMode) {
		if (window.location.href.match(/api/)) {
			window.location = cls + '.html';
		} else {
			window.location = 'api/' + cls + '.html';
		}
		return;
	}

	var url = req.baseDocURL + "/api/" + cls;
	var successFunc = function(response) {
		if (!noHistory && window.history && window.history.pushState) {
			window.history.pushState({
				docClass: cls
			},
			'', url);
		}

		var title = document.title.split(" | ");
		document.title = cls + " | " + title.slice(1).join(" | ");

		Ext.get(Ext.query('#docContent')[0]).update(response.responseText);
		applyLinkCallbacks();
		Ext.getCmp('treePanelCmp').selectCurrentClass();
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

		classes.forEach(function(cls) {
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
				var subTreeKeys = [];
                for (var k2 in tree[key]) subTreeKeys.push(k2);
				if (subTreeKeys.length) {
					innerNodes[innerNodes.length - 1].children = handleTree(clsName, tree[key]);
					innerNodes[innerNodes.length - 1].allowDrag = false;
				} else {
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

		classes.forEach(function(cls) {
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
				innerNodes[innerNodes.length - 1].className = clsName;
				var l = 0;
				for (var k2 in tree[key]) l++;
				if (l) {
					innerNodes[innerNodes.length - 1].children = handleTree(clsName, tree[key]);
					innerNodes[innerNodes.length - 1].allowDrag = false;
				} else {
					innerNodes[innerNodes.length - 1].leaf = true;
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
			children: (treeType == 'byPackage') ? classesByPackage : classesByHierarchy
		});

		if (!treePanel) {

			treePanel = new Ext.tree.TreePanel({
				cls: 'treePanel',
				id: 'treePanelCmp',
				autoScroll: true,
				border: false,
				split: true,
				ddGroup: 'treeDDGroup',
				enableDD: true,
				dropConfig: {
					allowContainerDrop: false
				},
				ddAppendOnly: true,
				loader: new Ext.tree.TreeLoader({
					preloadChildren: true
				}),
				root: rootNode,
				rootVisible: false,
				listeners: {
					click: function(a, b, c) {
						if (a.attributes.className) {
							req.docClass = a.attributes.className;
							showClassDoc(a.attributes.className);
						}
					}
				}
			});
			new Ext.tree.TreeSorter(treePanel, {
				folderSort: true
			});

			treePanel.selectCurrentClass = function() {
				if (req.docClass == 'undefined') {
					Ext.getCmp('treePanelCmp').getRootNode().childNodes[0].expand();
				} else {
					var classNode = treePanel.getRootNode().findChild('className', req.docClass, true);
					treePanel.expandPath(classNode.getPath(), null, function() {
						var classNode = treePanel.getRootNode().findChild('className', req.docClass, true);
						classNode.select();
					});
				}
			};

			var favoritesTree = new Ext.tree.TreePanel({
				id: 'favsTreePanel',
				autoScroll: true,
				border: false,
				ddGroup: 'treeDDGroup',
				enableDD: true,
				root: {
					nodeType: 'async',
					text: 'Favorites',
					id: 'favs',
					children: []
				},
				rootVisible: false,
				listeners: {
					click: function(a, b, c) {
						req.docClass = a.attributes.className;
						showClassDoc(a.attributes.className);
					}
				}
			});

			treePanelContainer = new Ext.Container({
				items: [
				// favoritesTree,
				// {
				//     xtype: 'container',
				//     id: 'favClasses',
				//     cls: 'favorites',
				//     html: 'Drag favorite classes here'
				// },
				{
					html: ['<div class="sortBy" id="sortPackagesBy">Sort by <select>', '<option value="byPackage">Package</option>', '<option value="byHierarchy">Hierarchy</option>',
					// '<option value="byCategory">Category</option>',
					// '<option value="byPopularity">Popularity</option>',
					// '<optgroup label="Recently viewed">',
					//     '<option>Ext.Panel</option>',
					//     '<option>Ext.button.Button</option>',
					//     '<option>Ext.Model</option>',
					//     '<option>Ext.DomQuery</option>',
					// '</optgroup>',
					'</select></div>'].join(''),
					xtype: 'container'
				},
				treePanel]
			});

			treePanelContainer.render('treePanel');
			treePanelContainer.show();

			Ext.get('sortPackagesBy').on('change', function(ev, el) {
				showClassTree(Ext.get(el).dom.value);
			});

			// var formPanelDropTarget = new Ext.dd.DropTarget(Ext.get('favClasses').dom, {
			//     ddGroup: 'treeDDGroup',
			//     notifyEnter: function(ddSource, e, data) {
			//         Ext.get('favClasses').addClass('over')
			//     },
			//     notifyOut: function(ddSource, e, data) {
			//         Ext.get('favClasses').removeClass('over')
			//     },
			//     notifyDrop: function(ddSource, e, data) {
			//         var newFav = new Ext.tree.AsyncTreeNode({
			//             leaf: true,
			//             text: data.node.text,
			//             className: data.node.attributes.className,
			//             allowDrop: true,
			//             allowDrag: true
			//         })
			//         favoritesTree.getRootNode().appendChild(newFav);
			//     }
			// });
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
			fields: ['id', 'key']
		});
		classesByPackage = convert(classPackagesStore.data.keys);
		showClassTree('byPackage');
	} else {
		classPackagesStore = new Ext.data.JsonStore({
			url: req.baseDocURL + '/classes.json',
			root: 'rows',
			autoLoad: true,
			idProperty: 'id',
			fields: ['id', 'key'],
			listeners: {
				load: function() {
					classesByPackage = convert(classPackagesStore.data.keys);
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
		classesByHierarchy = convertArr(classHierarchyStore.data.keys);
	} else {
		classHierarchyStore = new Ext.data.JsonStore({
			url: req.baseDocURL + '/class_hierarchy.json',
			root: 'rows',
			autoLoad: true,
			idProperty: 'key',
			fields: ['id', 'key'],
			listeners: {
				load: function() {
					classesByHierarchy = convertArr(classHierarchyStore.data.keys);
				}
			}
		});
	};
});
