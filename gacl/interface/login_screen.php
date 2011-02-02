<?php
$ignoreAuth=true;
include_once("./registry.php");
?>
<html>
<body>

<script LANGUAGE="JavaScript">
 top.location.href='<?php echo "$rootdir/login/login.ejs.php"; ?>';
</script>

<a href='<?php echo "$rootdir/login/login.ejs.php"; ?>'><?php xl('Follow manually','e'); ?></a>

<p>
<?php xl('OpenEMR requires Javascript to perform user authentication.','e'); ?>

</body>
</html>