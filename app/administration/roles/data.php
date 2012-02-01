<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File: data.php
 * Date: 10/30/11
 * Time: 10:53 AM
 */
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

$_SESSION['site']['flops'] = 0;

include_once($_SESSION['site']['root']."/classes/acl.class.php");
$acl = new ACL();

if($_REQUEST['task'] == 'form'){
    print $acl->getRoleForm();
    exit;
}

if($_REQUEST['task'] == 'save'){
    print $acl->saveRoles($_REQUEST);
    exit;
}

if($_REQUEST['task'] == 'data'){
    print $acl->getrolesFormData();
    exit;
}