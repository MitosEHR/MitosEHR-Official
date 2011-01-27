// *************************************************************************************
// Patient Selector Dialog Class
// This Window will show up all the patient the system have
// *************************************************************************************
/**
  * Ext.ux.IconCombo Extension Class
  *
  * @author Gino Rivera
  * @version 1.0
  *
  * @class Ext.oemr.ux.winPatients
  * @extends Ext.form
  * @constructor
  * @param {Object} config Configuration options
  */

Ext.namespace('Ext.oemr.ux');

Ext.oemr.ux.winPatients = function(config) {
 
    // call parent constructor
    Ext.oemr.ux.winPatients.superclass.constructor.call(this, config);
	
	// lets do the magic
	
 
}; // end of Ext.ux.IconCombo constructor
 

// extend
Ext.extend(Ext.oemr.ux.winPatients, Ext.form, {
 
}); // end of extend


var winPatients = new  Ext.Window({
	width		:900,
	height		: 400,
	modal		: true,
	resizable	: true,
	autoScroll	: true,
	title		:	'',
	closeAction	: 'hide',
	renderTo	: document.body,
	items: [{
			xtype		: 'grid', 
			name		: 'gridPatients',
			autoHeight	: true,
			store		: storePat,
			stripeRows	: true,
			frame		: false,
			viewConfig	: {forceFit: true}, // force the grid to the width of the containing panel
			sm			: new Ext.grid.RowSelectionModel({singleSelect:true}),
			listeners: {
				
				// Single click to select the record, and copy the variables
				rowclick: function(grid, rowIndex, e) {
					
					// Get the content from the data grid
					rowContent = grid.getStore().getAt(rowIndex);
					
					// Enable the select button
					winPatients.patSelect.enable();
				},
				
			},
			columns: [
				{ header: 'id', sortable: false, dataIndex: 'id', hidden: true},
				{ header: '<?php echo htmlspecialchars( xl('Name'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'name' },
				{ header: '<?php echo htmlspecialchars( xl('Phone'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'phone'},
				{ header: '<?php echo htmlspecialchars( xl('SS'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'ss' },
				{ header: '<?php echo htmlspecialchars( xl('DOB'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'dob' },
				{ header: '<?php echo htmlspecialchars( xl('PID'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'pid' }
			],
			tbar:[],
			plugins: [new Ext.ux.grid.Search({
				mode			: 'local',
				iconCls			: false,
				deferredRender	:false,
				dateFormat		:'m/d/Y',
				minLength		:4,
				align			:'left',
				width			: 250,
				disableIndexes	: ['id'],
				position		: 'top'
			})]
	}],

	// Window Bottom Bar
	bbar:[{
		text		:'<?php echo htmlspecialchars( xl('Select'), ENT_NOQUOTES); ?>',
		iconCls		: 'select',
		ref			: '../patSelect',
		formBind	: true,
		disabled	: true,
		handler		: function() {
			patient_Info = rowContent;
			Ext.getCmp('patient_but').setText( rowContent.get('name') );
			Ext.getCmp('PatientName').setValue( rowContent.get('name') );
			winPatients.hide();
			
			// Prepare the information for the patient
			HTML_Pat_Inf = '<table width="100%" border="0" cellspacing="3" cellpadding="3">';
			HTML_Pat_Inf = HTML_Pat_Inf + '	<tr>';
			HTML_Pat_Inf = HTML_Pat_Inf + '		<td colspan="2" class="ux-center"><img class="ux-eclosure-photo" src="../../../ui_app/missing_photo.png" width="128" height="128"></td>';
			HTML_Pat_Inf = HTML_Pat_Inf + '	</tr>';
			HTML_Pat_Inf = HTML_Pat_Inf + '	<tr>';
			HTML_Pat_Inf = HTML_Pat_Inf + '		<td class="ux-bold_title">Name:&nbsp;</td>';
			HTML_Pat_Inf = HTML_Pat_Inf + '		<td class="ux-value">' + patient_Info.get('name') + '</td>';
			HTML_Pat_Inf = HTML_Pat_Inf + '	</tr>';
			HTML_Pat_Inf = HTML_Pat_Inf + '	<tr>';
			HTML_Pat_Inf = HTML_Pat_Inf + '		<td class="ux-bold_title">Phone:&nbsp;</td>';
			HTML_Pat_Inf = HTML_Pat_Inf + '		<td class="ux-value">' + patient_Info.get('phone') + '</td>';
			HTML_Pat_Inf = HTML_Pat_Inf + '	</tr>';
			HTML_Pat_Inf = HTML_Pat_Inf + '	<tr>';
			HTML_Pat_Inf = HTML_Pat_Inf + '		<td class="ux-bold_title">SS:&nbsp;</td>';
			HTML_Pat_Inf = HTML_Pat_Inf + '		<td class="ux-value">' + patient_Info.get('ss') + '</td>';
			HTML_Pat_Inf = HTML_Pat_Inf + '	</tr>';
			HTML_Pat_Inf = HTML_Pat_Inf + '	<tr>';
			HTML_Pat_Inf = HTML_Pat_Inf + '		<td class="ux-bold_title">DOB:&nbsp;</td>';
			HTML_Pat_Inf = HTML_Pat_Inf + '		<td class="ux-value">' + patient_Info.get('dob') + '</td>';
			HTML_Pat_Inf = HTML_Pat_Inf + '	</tr>';
			HTML_Pat_Inf = HTML_Pat_Inf + '	<tr>';
			HTML_Pat_Inf = HTML_Pat_Inf + '		<td class="ux-bold_title">Patient ID:&nbsp;</td>';
			HTML_Pat_Inf = HTML_Pat_Inf + '		<td class="ux-value">' + patient_Info.get('pid') + '</td>';
			HTML_Pat_Inf = HTML_Pat_Inf + '	</tr>';
			HTML_Pat_Inf = HTML_Pat_Inf + '</table>';
			
			// Fill the patient general information panel
			Ext.getCmp('htmlPatInfo').setValue( HTML_Pat_Inf );
			Ext.getCmp('PanelPatInfo').update( Ext.getCmp('htmlPatInfo').getValue() );
			
			// Open the panel
			if( Ext.getCmp('PanelPatInfo').isVisible() == false){
				Ext.getCmp('PanelPatInfo').toggleCollapse(true);
			}
			
		}
	},{
		text	:'<?php echo htmlspecialchars( xl('Close'), ENT_NOQUOTES); ?>',
		iconCls	: 'delete',
		ref		: '../patClose',
		formBind: true,
		handler	: function(){ winPatients.hide(); }
	}]

}); // END WINDOW
