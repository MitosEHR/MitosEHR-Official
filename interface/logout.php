<?php
require_once("registry.php");

//start the session
session_start();
$_SESSION = array();
$params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
    $params["path"], $params["domain"],
    $params["secure"], $params["httponly"]
);
session_unset();
session_destroy(); 

header("location: login/login.ejs.php");

?>

