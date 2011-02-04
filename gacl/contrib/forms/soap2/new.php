<?php
include_once("../../registry.php");
include_once("$srcdir/acl.inc.php");

require ("C_FormSOAP.class.php");

$c = new C_FormSOAP();
echo $c->default_action();
?>
