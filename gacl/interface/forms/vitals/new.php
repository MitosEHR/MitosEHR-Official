<?php
include_once("../../registry.php");
include_once("$srcdir/acl.inc.php");

require ("C_FormVitals.class.php");

$c = new C_FormVitals();
#echo $c->view_action(0);
echo $c->default_action(0);
?>
