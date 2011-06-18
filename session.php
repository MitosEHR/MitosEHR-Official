<?php
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');


echo '<pre>';
print_r($_SESSION);
echo '</pre>';
?>