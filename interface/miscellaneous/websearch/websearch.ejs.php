<?php
//******************************************************************************
// new.ejs.php
// New Patient Entry Form
// v0.0.1
//
// Author: Ernest Rodriguez
// Modified: Gino Rivera
//
// MitosEHR (Electronic Health Records) 2011
//******************************************************************************
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');
include_once($_SESSION['site']['root']."/library/I18n/I18n.inc.php");
//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;
?>
<script type="text/javascript">
Ext.onReady(function(){
	Ext.define('Ext.mitos.webSearchPage',{
		extend:'Ext.panel.Panel',
		uses:[
			'Ext.mitos.CRUDStore',
			'Ext.mitos.GridPanel',
			'Ext.mitos.TopRenderPanel'
		],
		initComponent: function(){
            var page = this;

            // *************************************************************************************
            // Search for patient...
            // *************************************************************************************
            if (!Ext.ModelManager.isRegistered('Post')){
                Ext.define("Post", {
                    extend: 'Ext.data.Model',
                    proxy: {
                        type	: 'ajax',
                        url 	: 'library/patient/patient_search.inc.php?task=search',
                        reader: {
                            type			: 'json',
                            root			: 'row',
                            totalProperty	: 'totals'
                        }
                    },
                    fields: [
                        {name: 'id', 			type: 'int'},
                        {name: 'pid', 			type: 'int'},
                        {name: 'pubpid', 		type: 'int'},
                        {name: 'patient_name', 	type: 'string'},
                        {name: 'patient_dob', 	type: 'string'},
                        {name: 'patient_ss', 	type: 'string'}
                    ]
                });
            }
            page.searchStore = Ext.create('Ext.data.Store', {
                pageSize	: 10,
                model		: 'Post'
            });
            page.searchPanel = Ext.create('Ext.panel.Panel', {
                //width		: 400,
                bodyPadding	: '8 11 5 11',
                region		: 'north',
                margin		: '0 0 5 0 ',
                style 		: 'float:left',
                layout		: 'anchor',
                items: [{
                    xtype		: 'combo',
                    id			: 'liveSearch',
                    store		: page.searchStore,
                    displayField: 'title',
                    emptyText	: 'Web Search',
                    typeAhead	: false,
                    hideLabel	: true,
                    hideTrigger	:true,
                    minChars	: 1,
                    anchor		: '100%',
                    listConfig: {
                        loadingText	: 'Searching...',
                        emptyText	: 'No matching posts found.',
                        //---------------------------------------------------------------------
                        // Custom rendering template for each item
                        //---------------------------------------------------------------------
                        getInnerTpl: function() {
                            return '<div class="search-item">' +
                                '<h3><span>{patient_name}</span>  ({pid})</h3>' +
                                'DOB: {patient_dob} SS: {patient_ss}' +
                            '</div>';
                        }
                    },
                    pageSize: 10,
                    //--------------------------------------------------------------------------
                    // override default onSelect to do redirect
                    //--------------------------------------------------------------------------
                    listeners: {
                        select: function(combo, selection) {
                            var post = selection[0];
                            if (post) {
                                Ext.Ajax.request({
                                    url: Ext.String.format('library/patient/patient_search.inc.php?task=set&pid={0}&pname={1}',post.get('pid'),post.get('patient_name') ),
                                    success: function(response, opts){
                                        var newPatientBtn = Ext.String.format('<img src="ui_icons/32PatientFile.png" height="32" width="32" style="float:left"><strong>{0}</strong><br>Record ({1})', post.get('patient_name'), post.get('pid'));
                                        Ext.getCmp('patientButton').setText( newPatientBtn );
                                        Ext.getCmp('patientButton').enable();
                                    }
                                });
                                Ext.data.Request()
                            }
                        },
                        blur: function(){
                         Ext.getCmp('liveSearch').reset();
                        }
                    }
                }]
            });
            page.searchResults = Ext.create('Ext.panel.Panel', {
                title       : '<?php i18n('Serach Results'); ?>',
                region		: 'center',
                frame       : true,
                border      : true,
                layout      : 'fit'
            });



            Ext.create('Ext.mitos.TopRenderPanel', {
                pageTitle: '<?php i18n('Web Search'); ?>',
                pageLayout: 'border',
                pageBody: [page.searchPanel,page.searchResults ]
            });
			page.callParent(arguments);
		} // end of initComponent
	}); //ens oNotesPage class
    Ext.create('Ext.mitos.webSearchPage');
}); // End ExtJS
</script>