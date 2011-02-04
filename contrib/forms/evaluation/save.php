<?php
include_once("../../registry.php");
include_once("$srcdir/acl.inc.php");

require ("C_FormEvaluation.class.php");
$c = new C_FormEvaluation();
echo $c->default_action_process($_POST);
@formJump();
?>
