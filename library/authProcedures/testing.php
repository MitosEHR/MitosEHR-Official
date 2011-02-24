<?php

include_once("../../library/phpAES/AES.class.php");
$key = "abcdefghijuklmno0123456789012345";

$aes = new AES($key);

print($aes->encrypt("edpr787"));

?>
