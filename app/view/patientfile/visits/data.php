<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File: data.php
 * Date: 1/21/12
 * Time: 4:33 PM
 */
session_name("MitosEHR");
session_start();
session_cache_limiter('private');

include_once($_SESSION['site']['root'] . "/classes/Encounter.php");

$_SESSION['site']['flops'] = 0;


$enc = new Encounter();

$enc->getEncounters($_REQUEST);