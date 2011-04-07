<?php

function load_compress($file){
	ob_start();
	include_once($file);
	$buffer = ob_get_contents();
	ob_end_flush();
	return $buffer;
}

?>