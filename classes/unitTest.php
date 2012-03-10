<?php
session_name ( 'MitosEHR' );
session_start();
session_cache_limiter('private');
$_SESSION['site']['root'] = "/var/www/mitosehr";

include_once("dbHelper.php");

echo "Unit Test:<br/>";
echo "-----------------------------------------------------------------------------------------------------------<br/>";

$dbHelperTest = new dbHelper();

$fields[] = "firstname";
$fields[] = "lastname";

$order[] = "firstname";

$where[] = "firstname='gino'";
$where[] = "lastname='rivera'";

echo $dbHelperTest->sqlSelectBuilder("patient", $fields, $order, $where);

?>