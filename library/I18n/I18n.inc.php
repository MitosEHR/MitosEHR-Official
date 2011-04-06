<?php
/* I18n Library v0.0.1
 *
 * Description: This will contain all the function for translation 
 * Author: Gino Rivera Falú
 */

// Include the Database Helper, if is not loaded previuosly
include_once('../dbHelper/dbHelper.inc.php');

// The master function
function i18n($word, $ret_mode="e"){
	
	$trans = new dbHelper();
	
	if ($ret_mode == "e"){
		echo $word;
	} elseif($ret_mode == "r"){
		return $word;	
	}
}
?>