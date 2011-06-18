<?php
include_once("../../registry.php");
include_once("$srcdir/acl.inc.php");

require ("C_FormProsthesis.class.php");

$c = new C_FormProsthesis();
echo $c->view_action($_GET['id']);
?>
