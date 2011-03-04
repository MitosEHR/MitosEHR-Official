Ext.ns('Ext.samples');

Ext.samples.samplesCatalog = [
    {
        title: 'Combination Examples',
        samples: [
            {
                text: 'Feed Viewer',
                url:  'feed-viewer/feed-viewer.html',
                icon: 'feeds.gif',
                desc: 'RSS feed reader example application that features a swappable reader panel layout.',
                status: 'updated'
            },
            {
                text: 'Portal Demo',
                url:  'portal/portal.html',
                icon: 'portal.gif',
                desc: 'A page layout using several custom extensions to provide a web portal interface.',
                status: 'updated'
            },
            {
                text: 'Ext JS 3 & 4 on one page',
                url:  'sandbox/sandbox.html',
                icon: 'sandbox.gif',
                desc: 'This example demonstrates Ext JS 4\'s sandboxing behavior which allows you to run Ext JS 3 & 4 on the same page.',
                status: 'new'
            }
        ]
    },
    {
        title: 'Grids',
        samples: [
            {
                text: 'Basic Array Grid',
                url:  'grid/array-grid.html',
                icon: 'grid-array.gif',
                desc: 'A basic read-only grid loaded from local array data that demonstrates the use of custom column renderer functions.',
                status: 'updated'
            },
            {
                text: 'XML Grid',
                url:  'grid/xml-grid.html',
                icon: 'grid-xml.gif',
                desc: 'A simple read-only grid loaded from XML data.'
            },
            {
                text: 'Paging',
                url:  'grid/paging.html',
                icon: 'grid-paging.gif',
                desc: 'A grid with paging, cross-domain data loading and custom- rendered expandable row bodies.'
            },
            {
                text: 'Sliding Pager',
                url: 'grid/sliding-pager.html',
                icon: 'slider-pager.gif',
                desc: 'A demonstration on the integration of the Slider with the Paging Toolbar using a custom plugin.',
                status: 'updated'
            },
            {
                text: 'Grouping',
                url: 'grid/groupgrid.html',
                icon: 'grid-grouping.gif',
                desc: 'A basic grouping grid showing collapsible data groups that can be customized via the "Group By" header menu option.',
                status: 'updated'
            },
            {
                text: 'Grid Plugins',
                url: 'grid/grid-plugins.html',
                icon: 'grid-plugins.gif',
                desc: 'Multiple grids customized via plugins: expander rows, checkbox selection and row numbering.'
            },
            {
                text: 'Grid Data Binding (basic)',
                url: 'grid/binding.html',
                icon: 'grid-data-binding.gif',
                desc: 'Data binding a grid to a detail preview panel via the grid\'s RowSelectionModel.'
            },
            {
                text: 'Grid Data Binding (advanced)',
                url: 'grid/binding-with-classes.html',
                icon: 'grid-data-binding.gif',
                desc: 'Refactoring the basic data binding example to use a class-based application design model.'
            },
            {
                text: 'Multiple Sorting',
                url: 'grid/multiple-sorting.html',
                icon: 'grid-multiple-sorting.png',
                desc: 'An example that shows multi-level sorting in a Grid Panel.',
                status: 'updated'
            }
        ]
    },
    {
        title: 'Charts',
        samples: [
            {
                text: 'Area Charts',
                url: 'charts/Area.html',
                icon: 'chart-area.gif',
                desc: 'Display 7 sets of random data in an area series. Reload data will randomly generate a new set of data in the store.',
                status: 'new'
            },
            {
                text: 'Custom Area Charts',
                url: 'charts/Area - BrowserStats.html',
                icon: 'area-browsers.gif',
                desc: 'Display browser usage trends in an area series. This chart uses custom gradients for the colors and the legend is interactive.',
                status: 'new'
            },
            {
                text: 'Bar Charts',
                url: 'charts/Bar.html',
                icon: 'chart-bar.gif',
                desc: 'Display a sets of random data in a bar series. Reload data will randomly generate a new set of data in the store.',
                status: 'updated'
            },
            {
                text: 'Custom Bar Charts',
                url: 'charts/BarRenderer.html',
                icon: 'chart-bar-renderer.gif',
                desc: 'Displaying a horizontal bar series with a bar renderer that modifies the color of each bar.',
                status: 'new'
            },
            {
                text: 'Themed Line Charts',
                url: 'charts/Charts.html',
                icon: 'chart-themed.gif',
                desc: 'Using 3.x theme. Displaying multiple charts and mixed charts with mouse over and click interaction.',
                status: 'new'
            },
            {
                text: 'Column Charts',
                url: 'charts/Column.html',
                icon: 'chart-column.gif',
                desc: 'Display a set of random data in a column series. Reload data will randomly generate a new set of data in the store.',
                status: 'updated'
            },
            {
                text: 'Line Charts',
                url: 'charts/Line.html',
                icon: 'chart-line.gif',
                desc: 'Display 2 sets of random data in a line series. Reload data will randomly generate a new set of data in the store.',
                status: 'new'
            },
            {
                text: 'Column Custom Background',
                url: 'charts/Column2.html',
                icon: 'column2.gif',
                desc: 'A Column chart with customized theme and animation transitions',
                status: 'updated'
            },
            {
                text: 'Mixed Series on a Chart',
                url: 'charts/Mixed.html',
                icon: 'chart-mixed.gif',
                desc: 'Display 3 sets of random data using a line, bar, and scatter series. Reload data will randomly generate a new set of data in the store.',
                status: 'new'
            },
            {
                text: 'Pie Charts',
                url: 'charts/Pie.html',
                icon: 'chart-pie.gif',
                desc: 'Display 5 sets of random data using a pie chart. Reload data will randomly generate a new set of data in the store.',
                status: 'updated'
            },
            {
                text: 'Custom Pie Charts',
                url: 'charts/PieRenderer.html',
                icon: 'chart-pie-renderer.gif',
                desc: 'Display 5 sets of random data using a pie chart. A renderer has been set up on to dynamically change the length and color of each slice based on the data.',
                status: 'new'
            },
            {
                text: 'Radar Charts',
                url: 'charts/Radar.html',
                icon: 'chart-radar.gif',
                desc: 'Display 3 sets of random data in a radar series. Note this example uses a radial axis.',
                status: 'new'
            },
            {
                text: 'Filled Radar Charts',
                url: 'charts/RadarFill.html',
                icon: 'chart-radar-fill.gif',
                desc: 'Display 3 sets of random data in a filled radar series. Click or hover on the legend items to highlight and remove them from the chart.',
                status: 'new'
            },
            {
                text: 'Scatter Charts',
                url: 'charts/Scatter - Renderer.html',
                icon: 'chart-scatter.gif',
                desc: 'Display 2 sets of random data in a scatter series. A renderer has been set up on to dynamically change the size and color of the items based upon it\'s data.',
                status: 'new'
            },
            {
                text: 'Stacked Bar Charts',
                url: 'charts/StackedBar.html',
                icon: 'chart-bar-stacked.gif',
                desc: 'Showing movie taking by genre as a stacked bar chart sample. Filter the stacks by clicking on the legend items.',
                status: 'new'
            },
            {
                text: 'Live Updated Chart',
                url: 'charts/LiveUpdates.html',
                icon: 'live-updated.gif',
                desc: 'Showing movie taking by genre as a stacked bar chart sample. Filter the stacks by clicking on the legend items.',
                status: 'new'
            },
            {
                text: 'Live Animated Chart',
                url: 'charts/LiveAnimated.html',
                icon: 'live-animated.gif',
                desc: 'Showing movie taking by genre as a stacked bar chart sample. Filter the stacks by clicking on the legend items.',
                status: 'new'
            }
        ]
    },
    // {
    //     title: 'Tabs',
    //     samples: [{
    //         text: 'Basic Tabs',
    //         url: 'tabs/tabs.html',
    //         icon: 'tabs.gif',
    //         desc: 'Basic tab functionality including autoHeight, tabs from markup, Ajax loading and tab events.'
    //     },{
    //         text: 'Advanced Tabs',
    //         url: 'tabs/tabs-adv.html',
    //         icon: 'tabs-adv.gif',
    //         desc: 'Advanced tab features including tab scrolling, adding tabs programmatically and a context menu plugin.'
    //     }]
    // }
    {
        title: 'Windows',
        samples: [
            {
                text: 'Window Variations',
                url: 'window/window.html',
                icon: 'window-layout.gif',
                desc: 'A collection of Windows in different configurations, showing headers attached to any side of the window.',
                status: 'new'
            },
            {
                text: 'Layout Window',
                url: 'window/layout.html',
                icon: 'window.gif',
                desc: 'A window containing a basic BorderLayout with nested TabPanel.'
            },
            {
                text: 'MessageBox',
                url: 'message-box/msg-box.html',
                icon: 'msg-box.gif',
                desc: 'Different styles include confirm, alert, prompt, progress and wait and also support custom icons.'
            }
        ]
    },
    {
        title: 'Layout Managers',
        samples: [
            {
                text: 'Border Layout',
                url:  'layout/border.html',
                icon: 'border-layout.gif',
                desc: 'A complex BorderLayout implementation that shows nesting multiple components and sub-layouts.',
                status: 'updated'
            },
            // {
            //     text: 'Absolute Layout (Form)',
            //     url:  'layout/absolute.html',
            //     icon: 'layout-absolute.gif',
            //     desc: 'A simple example of form fields utilizing an absolute layout in a window for flexible form resizing.'
            // },
            {
                text: 'Anchor Layout (Form)',
                url:  'form/anchoring.html',
                icon: 'layout-form.gif',
                desc: 'A simple example of form fields utilizing an anchor layout in a window for flexible form resizing.'
            },
            {
                text: 'Anchor Layout (Panel)',
                url:  'layout/anchor.html',
                icon: 'layout-anchor.gif',
                desc: 'An example of Panels anchored in the browser window.'
            },
            // {
            //     text: 'Column Layout',
            //     url:  'layout/column.html',
            //     icon: 'layout-column.gif',
            //     desc: 'An example of Panels managed by a column layout.'
            // },
            {
                text: 'Table Layout',
                url:  'layout/table.html',
                icon: 'layout-table.gif',
                desc: 'An example of Panels managed by a table layout.'
            }
            // {
            //     text: 'HBox Layout',
            //     url:  'layout/hbox.html',
            //     icon: 'layout-column.gif',
            //     desc: 'Interactive layout illustrating the capabilities of the HBox Layout.',
            //     status: 'new'
            // },
            // {
            //     text: 'VBox Layout',
            //     url:  'layout/vbox.html',
            //     icon: 'layout-vbox.gif',
            //     desc: 'Interactive layout illustrating the capabilities of the VBox Layout.',
            //     status: 'new'
            // }
        ]
    },
    {
        title: 'Drawing',
        samples: [
            {
                text: 'Resizable Sencha Logo',
                url: 'draw/Sencha.html',
                icon: 'draw-sencha.gif',
                desc: 'Resolution independent Sencha logo in a resizable component.',
                status: 'new'
            },
            {
                text: 'Browser Logos',
                url: 'draw/Logos.html',
                icon: 'draw-logos.gif',
                desc: 'Resolution independent logos of all the popular browsers.',
                status: 'new'
            },
            {
                text: 'Tiger',
                url: 'draw/Tiger.html',
                icon: 'draw-tiger.gif',
                desc: 'The classic SVG Tiger in a floatable, draggable component. Scalable to any size, fully resolution independent.',
                status: 'new'
            },
            {
                text: 'Rotate Text',
                url: 'draw/Rotate Text.html',
                icon: 'draw-rotate-text.gif',
                desc: 'Create text in a Draw Component which can be rotated easily in any browser.',
                status: 'new'
            }
        ]
    },
    // {
    //     title: 'Toolbars and Menus',
    //     samples: [
    //         {
    //             text: 'Basic Toolbar',
    //             url:  'menu/menus.html',
    //             icon: 'toolbar.gif',
    //             desc: 'Toolbar and menus that contain various components like date pickers, color pickers, sub-menus and more.',
    //             status: 'updated'
    //         },
    //         {
    //             text: 'Toolbar Button Groups',
    //             url:  'toolbar/toolbars.html',
    //             icon: 'toolbar-button-groups.gif',
    //             desc: 'Group buttons together in the toolbar.'
    //         },
    //         {
    //             text: 'Ext Actions',
    //             url:  'menu/actions.html',
    //             icon: 'toolbar-actions.gif',
    //             desc: 'Bind the same behavior to multiple buttons, toolbar and menu items using the Ext.Action class.'
    //         },
    //         {
    //             text: 'Reorderable Toolbar',
    //             url:  'toolbar/reorderable.html',
    //             icon: 'toolbar-reorderable.png',
    //             desc: 'Items within a toolbar can be reordered using this plugin.'
    //         },
    //         {
    //             text: 'Status Bar',
    //             url:  'statusbar/statusbar-demo.html',
    //             icon: 'statusbar-demo.gif',
    //             desc: 'A simple StatusBar that can be dropped into the bottom of any panel to display status text and icons.',
    //             status: 'updated'
    //         },
    //         {
    //             text: 'Status Bar (Advanced)',
    //             url:  'statusbar/statusbar-advanced.html',
    //             icon: 'statusbar-adv.gif',
    //             desc: 'Customizing the StatusBar via a plugin to provide automatic form validation monitoring and error linking.',
    //             status: 'updated'
    //         }
    //     ]
    // }
    {
        title: 'ComboBox',
        samples: [
            {
                text: 'Basic ComboBox',
                url: 'form/combos.html',
                icon: 'combo.gif',
                desc: 'Basic combos, combos rendered from markup and customized list layout to provide item tooltips.'
            }
            // {
            //     text: 'ComboBox Templates',
            //     url: 'form/forum-search.html',
            //     icon: 'combo-custom.gif',
            //     desc: 'Customized combo with template-based list rendering, remote loading and paging.'
            // }
        ]
    },
    {
        title: 'Forms',
        samples: [
            {
                text: 'Dynamic Forms',
                url: 'form/dynamic.html',
                icon: 'form-dynamic.gif',
                desc: 'Various example forms showing collapsible fieldsets, column layout, nested TabPanels and more.'
            },
            {
                text: 'Ajax with XML Forms',
                url: 'form/xml-form.html',
                icon: 'form-xml.gif',
                desc: 'Ajax-loaded form fields from remote XML data and remote field validation on submit.'
            },
            {
                text: 'Custom Search Fields',
                url: 'form/forum-search.html',
                icon: 'form-custom.gif',
                desc: 'A TriggerField search extension combined with an XTemplate for custom results rendering.'
            },
            {
                text: 'Binding a Grid to a Form',
                url:  'form/form-grid.html',
                icon: 'form-grid-binding.gif',
                desc: 'A grid embedded within a FormPanel that automatically loads records into the form on row selection.',
                status: 'updated'
            },
            {
                text: 'Field Types',
                url:  'form/field-types.html',
                icon: 'form-field-types.gif',
                desc: 'This example shows off all of the field types available in Ext JS in lots of different configurations.',
                status: 'updated'
            },
            // {
            //     text: 'Advanced Validation',
            //     url:  'form/adv-vtypes.html',
            //     icon: 'form-adv-vtypes.gif',
            //     desc: 'Relational form field validation using custom vtypes.'
            // },
            {
                 text: 'Checkbox/Radio Groups',
                 url:  'form/check-radio.html',
                 icon: 'form-check-radio.gif',
                 desc: 'Examples showing different checkbox and radio group configurations.'
            },
            // {
            //     text: 'File Upload Field',
            //     url:  'form/file-upload.html',
            //     icon: 'form-file-upload.gif',
            //     desc: 'A demo of how to give standard file upload fields a bit of Ext style using a custom class.'
            // },
            {
                text: 'Number Field',
                url:  'form/number.html',
                icon: 'form-spinner.gif',
                desc: 'An example of the Number field, with and without a spinner.',
                status: 'updated'
            },
            // {
            //     text: 'MultiSelect and ItemSelector',
            //     url:  'multiselect/multiselect-demo.html',
            //     icon: 'form-multiselect.gif',
            //     desc: 'Example controls for selecting a list of items in forms.'
            // },
            {
                text: 'Slider Field',
                url:  'slider/slider-field.html',
                icon: 'form-slider.png',
                desc: 'Example usage of an Ext.Slider to select a number value in a form.',
        	    status : 'new'
            },
            {
                text: 'Forms with vBox layout',
                url:  'form/vbox-form.html',
                icon: 'form-vbox.gif',
                desc: 'Example usage of the vBox layout with forms. An added bonus is the FieldReplicator plugin.',
        	    status : 'new'
            },
            {
                text: 'Forms with hBox layout',
                url:  'form/hbox-form.html',
                icon: 'form-vbox.gif',
                desc: 'Example usage of the hBox layout with a form. Includes automatically adjusting validation messages.',
        	    status : 'new'
            }
            // {
            //     text  : 'Composite Fields',
            //     url   : 'form/composite-field.html',
            //     icon  : 'form-composite.png',
            //     desc  : 'Example usage of the Composite Fields to place several fields on a single form row.',
            //              status: 'new'
            // }
        ]
    },
    {
        title: 'Miscellaneous',
        samples: [
            {
                text: 'History',
                url: 'history/history.html',
                icon: 'history.gif',
                desc: 'A History manager that allows the user to navigate an Ext UI via browser back/forward.'
            },
            {
                text: 'Google Maps',
                url: 'window/gmap.html',
                icon: 'gmap-panel.gif',
                desc: 'A Google Maps wrapper class that enables easy display of dynamic maps in Ext panels and windows.'
            },
            {
                text: 'Editor',
                url: 'simple-widgets/editor.html',
                icon: 'editor.gif',
                desc: 'An example demonstrating the ease of use of the Ext.editor class to modify DOM elements',
                status: 'new'
            },
            {
                text: 'Slider',
                url: 'slider/slider.html',
                icon: 'slider.gif',
                desc: 'A slider component that supports vertical mode, snapping, tooltips, customized styles and multiple thumbs.',
                status: 'updated'
            },
            // {
            //     text: 'QuickTips',
            //     url: 'simple-widgets/qtips.html',
            //     icon: 'qtips.gif',
            //     desc: 'Various tooltip and quick tip configuration options including Ajax loading and mouse tracking.',
            //     status: 'updated'
            // },
            {
                text: 'Progress Bar',
                url: 'simple-widgets/progress-bar.html',
                icon: 'progress.gif',
                desc: 'A basic progress bar component shown in various configurations and with custom styles.'
            },
            {
                text: 'Panels',
                url: 'panel/panel.html',
                icon: 'panel.gif',
                desc: 'A basic collapsible panel example.',
                status: 'updated'
            },
            {
                text: 'Resizable',
                url: 'resizer/basic.html',
                icon: 'resizable.gif',
                desc: 'Examples of making any element resizable with various configuration options.'
            },
            {
                text: 'Buttons',
                url: 'button/button.html',
                icon: 'buttons.gif',
                desc: 'Shows buttons in many of their possible configurations',
                status: 'new'
            }
            // {
            //     text: 'Debugging Console',
            //     url: 'debug/debug-console.html',
            //     icon: 'debug-console.gif',
            //     desc: '',
            //     status: 'new'
            // },
            // {
            //     text: 'Localization (static)',
            //     url: 'locale/dutch-form.html',
            //     icon: 'locale-dutch.gif',
            //     desc: 'Demonstrates fully localizing a form by including a custom locale script.'
            // },
            // {
            //     text: 'Localization (dynamic)',
            //     url: 'locale/multi-lang.html',
            //     icon: 'locale-switch.gif',
            //     desc: 'Dynamically render various Ext components in different locales by selecting from a locale list.'
            // }
        ]
    }
];