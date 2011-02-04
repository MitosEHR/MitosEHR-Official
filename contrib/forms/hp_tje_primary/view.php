<?php
include_once("../../registry.php");
include_once("$srcdir/acl.inc.php");

require ("C_FormHpTje.class.php");

$c = new C_FormHpTje();
echo $c->view_action($_GET['id']);
?>
