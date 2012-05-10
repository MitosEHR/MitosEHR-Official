<?php
$server = "localhost"; // Name or IP of database server.
$user = "mitosuser"; // username
$pwd = "pass"; // password
$db = "mitosdb"; // Name of database to connect to.

if (!$conn = mysql_connect($server,$user,$pwd )) {
die("mysql_connect() failed");
}


if(!mysql_select_db($db)) {
	echo "Impossible d'accer la base de donns : " . mysql_error();
	exit;
}


$lines = file('http://localhost/MitosEHR/product.txt');

//foreach ($lines as $line_num => $line) {
//    echo "Line #<b>{$line_num}</b> : " . htmlspecialchars($line) . "<br />\n";
//}
//exit;

foreach ($lines as $line_num => $line) {
	$arr  = explode("\t", $line);
	#if your data is comma separated
	# instead of tab separated,
	# change the '\t' above to ';'
	$sql = "insert into medications values ('" . implode("','", $arr) . "')";

	mysql_query($sql);
	echo $sql . "\n";
	if(mysql_error()) {
		echo mysql_error() . "\n";
	}
}
?>