<?php
/* chkAuth
 * Description: This littler dude will check the integrity of the 
 * session and if the session is expired logoff and show the 
 * logon screen, or if something is missing logoff and show the
 * logon screen
 * 
 * Author: Gino Rivera Falú
 * Modified: N/A
 * Ver: 0.0.1
 * 
 */

session_name ( "MitosEHR" );
session_start();

//****************************************************************
// If the username and password are not longer set
// return an exit code
//****************************************************************
if(isset($_SESSION['authUser']) && isset($_SESSION['authPass'])) {
	echo "exit";
	return;
}

?>