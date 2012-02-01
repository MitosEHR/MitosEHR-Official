<?php
//**********************************************************************************************************************
// manage_messages.ejs.php
// v0.0.1
// Under GPLv3 License
//
// Integrated by: Ernesto Rodriguez. in 2011
//
// Remember, this file is called via the Framework Store, this is the AJAX thing.
//**********************************************************************************************************************
include_once($_SESSION['site']['root']."/classes/dbHelper.php");
//--------------------------------------------------------------------------------
// Database class instance
//--------------------------------------------------------------------------------
$mitos_db = new dbHelper();
//--------------------------------------------------------------------------------
// always echo the first display Field (Fees)
//--------------------------------------------------------------------------------
echo "{ width: 70, xtype: 'displayfield', value: '";
echo i18n('Fees');
echo ": '}";
//**********************************************************************************************************************
// look for pricelevel lists from list_options table
//**********************************************************************************************************************
$mitos_db->setSQL("SELECT option_id, title
                     FROM list_options
                    WHERE list_id = 'pricelevel'
                 ORDER BY seq");
//--------------------------------------------------------------------------------
// echo the fields
//--------------------------------------------------------------------------------
foreach($mitos_db->execStatement(PDO::FETCH_ASSOC) as $fee){
	echo ",{ width: 100, xtype: 'textfield', name: 'fee_".$fee['option_id']."', emptyText: '";
    echo i18n($fee['title']);
    echo "'}";
}
//**********************************************************************************************************************
// look for te taxes fields
//**********************************************************************************************************************
$mitos_db->setSQL("SELECT option_id, title
                     FROM list_options
                    WHERE list_id = 'taxrate'
                 ORDER BY seq");
$total = $mitos_db->rowCount();
//--------------------------------------------------------------------------------
// if a tax field fond - echo the "Taxes" display field and the fields
//--------------------------------------------------------------------------------
if($total > 0){
    echo ",{ width: 70, xtype: 'displayfield', value: '";
    echo i18n('Taxes');
    echo ": '}";
    foreach($mitos_db->execStatement(PDO::FETCH_ASSOC) as $ftax){
	    echo ",{ width: 100, xtype: 'textfield', name: 'taxrate_".$tax['option_id']."', emptyText: '";
        echo i18n($tax['title']);
        echo "'}";
    }
}
?>