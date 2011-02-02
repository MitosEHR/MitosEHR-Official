<?php
require_once("interface/registry.php");
require_once("library/classes/Controller.class.php");

echo Controller::act($_GET);

?>
