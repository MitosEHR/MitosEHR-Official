<?php
dl('adodb.so');


include_once('phplens/adodb/adodb.inc.php');

$db = ADONewConnection('mysql');

$server = 'jaguar';
$user = 'mobydick';
$password = $_GET['pwd'];
$database = 'northwind';

$db->Connect($server,$user,$pwd,$database);
$rs = $db->Execute('select productname,unitsinstock from products');
while (!$rs->EOF) {
	print_r($rs->fields);
	print "<br>";
	adodb_movenext($rs); ## ADODB extension function
}

$rs->Close();

echo '<hr>';

$rs = $db->Execute("select productname, unitsinstock from products where productid < 5");
$arr = adodb_getall($rs); ## ADOdb extension function

echo '<pre>'; print_r($arr); echo '</pre>';
?>
