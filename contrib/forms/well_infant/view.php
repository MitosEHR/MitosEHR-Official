<?php
include_once("../../registry.php");
include_once("$srcdir/api.inc");

require ("C_FormWellInfant.class.php");

$c = new C_FormWellInfant();
echo $c->view_action($_GET['id']);
?>
