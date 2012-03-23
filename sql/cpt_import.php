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
$file_handle = fopen("cpt_icd.csv", "r");
while (!feof($file_handle)) {
    $line = fgets($file_handle);
    $data = array();
    $foo = explode(',', $line);
    $data['cpt'] = $foo[0];
    $data['icd'] = $foo[1];
    $db->setSQL($db->sqlBind($data,'cpt_icd','I'));
    $db->execOnly();
}
fclose($file_handle);