<?php
include_once("../../registry.php");
include_once("$srcdir/api.inc");

require ("C_FormPriorAuth.class.php");

$c = new C_FormPriorAuth();
echo $c->view_action($_GET['id']);
?>
