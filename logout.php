<?php 
define('_MitosEXEC', 1);
include_once("registry.php"); 
?>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title>MitosEHR Logout Screen</title>
<script type="text/javascript" src="library/<?php echo $_SESSION['dir']['ext']; ?>/bootstrap.js"></script>
<link rel="stylesheet" type="text/css" href="library/<?php echo $_SESSION['dir']['ext']; ?>/resources/css/ext-all.css">
<link rel="stylesheet" type="text/css" href="ui_app/style_newui.css" >
<link rel="stylesheet" type="text/css" href="ui_app/mitosehr_app.css" >
<script type="text/javascript">
Ext.require([
    'Ext.window.*'
]);
Ext.onReady(function(){
	// *************************************************************************************
	// The Copyright Notice Window
	// *************************************************************************************
	var winCopyright = Ext.create('widget.window', {
		id				: 'winCopyright',
		width			: 600,
		height			: 500,
		closeAction		: 'hide',
		bodyStyle		: 'padding: 5px;',
		modal			: false,
		resizable		: true,
		title			: 'MitosEHR Copyright Notice',
		draggable		: true,
		closable		: true,
		autoLoad		: 'interface/login/copyright_notice.html',
		autoScroll		: true
	});
	// *************************************************************************************
	// Logout alert Window
	// *************************************************************************************
	Ext.Msg.alert('Logout', 'You have successfully logout.', function(btn){
	    if (btn == 'ok'){
			window.location = "index.php"
	    }
	}); 
}); 
</script>
</head>
<body id="login">
<div id="copyright">MitosEHR<?php echo $_SESSION['ver']['major'] . "." . $_SESSION['ver']['rev'] . "." . $_SESSION['ver']['minor'] . " " . $_SESSION['ver']['codeName']; ?> | <a href="javascript:void()" onClick="Ext.getCmp('winCopyright').show();" >Copyright Notice</a></div>
<?php include_once('library/authProcedures/unauth.inc.php') ?>
</body>
</html>
