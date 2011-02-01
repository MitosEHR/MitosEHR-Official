<!-- Work/School Note Form created by Nikolai Vitsyn: 2004/02/13 and update 2005/03/30 
     Copyright (C) Open Source Medical Software 

     This program is free software; you can redistribute it and/or
     modify it under the terms of the GNU General Public License
     as published by the Free Software Foundation; either version 2
     of the License, or (at your option) any later version.

     This program is distributed in the hope that it will be useful,
     but WITHOUT ANY WARRANTY; without even the implied warranty of
     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
     GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA. -->

<?php
include_once("../../registry.php");
include_once("$srcdir/api.inc");
include_once("$srcdir/forms.inc");

/* 
 * name of the database table associated with this form
 */
$table_name = "dentist_teeth";

if ($encounter == "") $encounter = date("Ymd");

switch ($_POST["task"]) {
	case "save": // Save the dental record using the API
		unset($_POST['task']);
    	$newid = formSubmit($table_name, $_POST, $_GET["id"], $userauthorized);
	    addForm($encounter, "Dental Chart Form", $newid, "dentist_teeth", $pid, $userauthorized);
		break;
	case "update": // Update the dental record using the API
		unset($_POST['task']);
    	$success = formUpdate($table_name, $_POST, $_GET["id"], $userauthorized);
		break;
}

$_SESSION["encounter"] = $encounter;
formHeader("Redirecting....");
formJump();
formFooter();
?>
