<?php
// destroy MitosEHR session and redirect to index.php
session_name ( "MitosEHR" );
session_unset();
session_destroy();
?>