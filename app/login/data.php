<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File: data.php
 * Date: 1/13/12
 * Time: 8:48 AM
 */
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once($_SESSION['site']['root']."/classes/authProcedures.class.php");


if($_REQUEST['task'] == 'auth'){

    authProcedures::auth($_REQUEST['authUser'], $_REQUEST['authPass'],$_REQUEST['choiseSite']);

    $_SESSION['lang']['code'] = $_REQUEST['lang'];

} elseif($_REQUEST['task'] == 'unAuth'){

    authProcedures::unAuth();

} elseif($_REQUEST['task'] == 'ckAuth'){

    authProcedures::ckAuth();

}
 
