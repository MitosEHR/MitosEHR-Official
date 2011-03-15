<?php
include_once("../../registry.php");
include_once("$srcdir/acl.inc.php");

require ("C_FormWellInfant.class.php");
$c = new C_FormWellInfant();
echo $c->default_action_process($_POST);
@formJump();
?>
