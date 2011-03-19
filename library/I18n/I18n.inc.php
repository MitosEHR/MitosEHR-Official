<?php
/* I18n Library v0.0.1
 *
 * Description: This will contain all the function for translation 
 * Author: Gino Rivera Falú
 */
 
function i18n($word, $ret_mode="e"){
	if ($ret_mode == "e"){
		echo $word;
	} elseif($ret_mode == "r"){
		return $word;	
	}
}
?>