<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File: data.php
 * Date: 1/21/12
 * Time: 6:00 PM
 */
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once($_SESSION['site']['root']."/classes/Encounter.class.php");

$_SESSION['site']['flops'] = 0;


$enc = new Encounter();

if($_REQUEST['task'] == 'ckOpenEncounters'){

    $enc->ckOpenEncounters();

}


if($_REQUEST['task'] == 'newEncounter'){

    unset($_REQUEST['task']);
    $enc->createEncounter($_REQUEST);

}
