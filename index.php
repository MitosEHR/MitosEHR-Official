<?php
//************************************************************************************
// This is the decision to make: run the LOGIN windows is all is found in place
// or run the SETUP, when some file are not FOUND!.
//
// It need more work than this, but it's OK.
//************************************************************************************
if ( !empty($_GET['site']) ){
	$site_id = $_GET['site'];
} else if ( is_dir("sites/" . $_SERVER['HTTP_HOST']) ){
	$site_id = $_SERVER['HTTP_HOST'];
} else {
	$site_id = 'default';
}
require_once("sites/$site_id/sqlconf.php");

?>
<html>
<?php if ($config == 1) { ?>
<body ONLOAD="javascript:top.location.href='<?php echo "interface/login/login.ejs.php?site=$site_id" ?>';">
<?php } else { ?>
<body ONLOAD="javascript:top.location.href='<?php echo "setup.php?site=$site_id" ?>';">     
<?php } ?>
Redirecting...
</body>
</html>
