<?php
include_once("../../registry.php");
include_once("$srcdir/acl.inc.php");

require ("C_FormROS.class.php");

$c = new C_FormROS();
echo $c->view_action($_GET['id']);
?>
