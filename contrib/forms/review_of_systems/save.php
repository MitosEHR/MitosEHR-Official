<?php
include_once("../../registry.php");
include_once("$srcdir/acl.inc.php");

require ("C_FormReviewOfSystems.class.php");

$c = new C_FormReviewOfSystems();
echo $c->default_action_process();
@formJump();
?>
