<?php
session_name ( 'MitosEHR' );
session_start();
session_cache_limiter('private');
$_SESSION['site']['root'] = "/wamp/www/MitosEHR-Official";

include_once("dbHelper.php");

echo "Unit Test:<br/>";
echo "-----------------------------------------------------------------------------------------------------------<br/>";

$dbHelperTest = new dbHelper();

$fields[] = "firstname";
$fields[] = "lastname";

$order[] = "firstname";

$where[] = "firstname='gino'";
$where[] = "lastname='rivera'";
$where[] = "lastname='rivera'";

echo $dbHelperTest->sqlSelectBuilder("patient", $fields, $order, $where);

echo "<br/>";

$fields=null;
$order=null;
$where=null;

$fields[] = "*";
echo $dbHelperTest->sqlSelectBuilder("patient", $fields, $order, $where);

?>