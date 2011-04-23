<?php
//-----------------------------------------------------
// destroy MitosEHR session and redirect to index.php
//-----------------------------------------------------
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

//-----------------------------------------------------
// Get the URL first, before the session gets deleted.
//-----------------------------------------------------
$return = $_SESSION['site']['url'];

//-----------------------------------------------------
// Destroy the session
//-----------------------------------------------------
session_unset();
session_destroy();

//-----------------------------------------------------
// Redirect to the index.php
//-----------------------------------------------------
header("Location: $return/index.php");

//-----------------------------------------------------
// Exit nicely
//-----------------------------------------------------
exit;

?>