<?php
//--------------------------------------------------------------------------------------------------------------------------
// data_create.ejs.php / new_patient
// v0.0.2
// Under GPLv3 License
//
// Integrated by: GI Technologies Inc. in 2011
//
// Remember, this file is called via the Framework Store, this is the AJAX thing.
//--------------------------------------------------------------------------------------------------------------------------

session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once($_SESSION['site']['root']."/classes/dbHelper.class.php");

$_SESSION['site']['flops'] = 0;

$mitos_db   = new dbHelper();
$data       = $_POST;

foreach($data as $key => $val){
    if($val == null) unset($data[$key]);
    if($val == 'off') $data[$key] = 0;
    if($val == 'on')  $data[$key] = 1;
}


$sql = $mitos_db->sqlBind($data, "form_data_demographics", "I");
$mitos_db->setSQL($sql);
$ret = $mitos_db->execLog();
if ( $ret[2] ){
    echo '{ success: false, errors: { reason: "'. $ret[2] .'" }}';
} else {
    echo "{ success: true }";
}



