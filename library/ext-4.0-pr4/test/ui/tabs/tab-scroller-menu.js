Ext.onReady(function() {
    // enable the tabTip config below
	Ext.QuickTips.init();
    
	// Create our instance of TabScrollerMenu
	var scrollerMenu = new Ext.ux.TabScrollerMenu({
		maxText  : 15,
		pageSize : 5
	});
    
	var win = Ext.createWidget('window', {
		height: 400,
		width: 600,
		layout: 'fit',
		title: 'Exercising scrollable tabs with a TabScroller menu',
		items: {
			xtype: 'tabpanel',
			activeTab: 0,
			itemId: 'tabPanel',
			enableTabScroll: true,
			resizeTabs: true,
			minTabWidth: 75,
			border: false,
			plugins: [scrollerMenu],
			items: [{
				title: 'First tab',
                html: 'Creating more tabs...'
			}]
		}
	});
    
    win.show();
	
	// Add a bunch of tabs dynamically
	var tabLimit = 20,
        tabPanel = win.getComponent('tabPanel');
        
    Ext.defer(function (num) {
		for (var i = 1; i <= tabLimit; i++) {
			var title = 'Tab # ' + i;
			tabPanel.add({
				title: title,
				html: 'Hi, i am tab ' + i,
				tabTip: title,
				closable: true
			});
		}
        tabPanel.getComponent(0).body.update('Done!');
	}, 100);
});