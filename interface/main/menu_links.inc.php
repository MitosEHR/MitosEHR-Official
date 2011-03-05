<?php
/* Main Screen Application
*
* Description: This is the main application, with all the panels
*
* version 0.0.3
* revision: N/A
* author: Gino Rivera Falú
*/

// Reset session count
$_SESSION['site']['flops'] = 0;

?>
<a 
	href="javascript:void()" 
	onClick="MainApp.load('interface/administration/roles/roles.ejs.php');">
	Facilicies
</a>
<br />
<a 
	href="javascript:void()" 
	onClick="MainApp.load('interface/administration/roles/roles.ejs.php');">
	roles and permissions
</a>
