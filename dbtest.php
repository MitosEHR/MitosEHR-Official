<?php
$user = 'openemr';
$pass = 'pass';
$conn = new PDO('mysql:host=localhost;dbname=openemr', 'openemr', 'pass');

$sql = $conn->prepare("SELECT username, password, authorized FROM users");
$sql->execute();

/* Exercise PDOStatement::fetch styles */
print("PDO::FETCH_ASSOC: ");
print("Return next row as an array indexed by column name<br>");
$result = $sql->fetch(PDO::FETCH_ASSOC);
print_r($result);
print("<br><br>");

print("PDO::FETCH_BOTH: ");
print("Return next row as an array indexed by both column name and number<br>");
$result = $sql->fetch(PDO::FETCH_BOTH);
print_r($result);
print("<br><br>");

print("PDO::FETCH_LAZY: ");
print("Return next row as an anonymous object with column names as properties<br>");
$result = $sql->fetch(PDO::FETCH_LAZY);
print_r($result);
print("<br><br>");

print("PDO::FETCH_OBJ: ");
print("Return next row as an anonymous object with column names as properties<br>");
$result = $sql->fetch(PDO::FETCH_OBJ);
print $result->username;
print("<br><br>");




$sql = $conn->prepare("SELECT username, password, authorized FROM users");
$sql->execute();
print("FetchAll: ");
print("Fetch all of the remaining rows in the result set:<br>");
$result = $sql->fetchAll();
print_r($result);
print("<br><br>");

?>
