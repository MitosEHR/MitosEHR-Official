<?php
include_once("../../registry.php");
include_once("$srcdir/acl.inc.php");
require ("C_FormVitalsM.class.php");

$c = new C_FormVitalsM();
echo $c->default_action_process($_POST);
@formJump();
?>
