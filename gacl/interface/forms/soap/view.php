<?php
include_once("../../registry.php");
include_once("$srcdir/api.inc");

require ("C_FormSOAP.class.php");

$c = new C_FormSOAP();
echo $c->view_action($_GET['id']);
?>
