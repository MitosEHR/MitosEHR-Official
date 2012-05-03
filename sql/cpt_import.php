<?php
/**
 * Created by JetBrains PhpStorm.
 * User: mitosehr
 * Date: 3/20/12
 * Time: 8:52 AM
 * To change this template use File | Settings | File Templates.
 */
if(!isset($_SESSION)){
    session_name ( 'MitosEHR' );
    session_start();
    session_cache_limiter('private');
}
include_once($_SESSION['site']['root'].'/classes/dbHelper.php');
echo '<pre>';
$db = new dbHelper();
$file_handle = fopen("LOINC_238_LAB_PANELS.csv", "r");
while (!feof($file_handle)) {
    $line = fgets($file_handle);
    $data = array();
    $foo = explode("\t", $line);
    $data['id'] = $foo[0];
    $data['parent_id'] = $foo[1];
    $data['parent_loinc'] = $foo[2];
    $data['parent_name'] = $foo[3];
    $data['sequence'] = $foo[4];
    $data['loinc_number'] = $foo[5];
    $data['loinc_name'] = $foo[6];
    $data['required_in_panel'] = $foo[7];
    $data['type_of_entry'] = $foo[8];
//    $data['j'] = $foo[9];
//    $data['k'] = $foo[10];
//    $data['l'] = $foo[11];
//    $data['m'] = $foo[12];
//    $data['n'] = $foo[13];
//    $data['o'] = $foo[14];
//    $data['p'] = $foo[15];
//    $data['q'] = $foo[16];
//    $data['r'] = $foo[17];
//    $data['s'] = $foo[18];
//    $data['t'] = $foo[19];
//    $data['u'] = $foo[20];
//    $data['v'] = $foo[21];
//    $data['w'] = $foo[22];
//    $data['x'] = $foo[23];
    $db->setSQL($db->sqlBind($data,'labs_observations','I'));
    $db->execOnly();
}
if(feof($file_handle)) print 'The End!';
fclose($file_handle);