<?php

include_once("dbHelper.php");

echo "Unit Test:<br/>";
echo "-----------------------------------------------------------------------------------------------------------<br/>";

$dbHelperTest = new dbHelper();

$fields[] = "firstname";
$fields[] = "lastname";

$order[] = "firstname";

$where["firstname"] = "gino";

echo $dbHelperTest->setSqlStatement("patient", $fields, $order, $where);

?>