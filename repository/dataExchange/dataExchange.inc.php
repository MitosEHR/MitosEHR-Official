<?php
//*********************************************************************
//
// Functions to encode and decode data between Sencha and PHP
//
// Author: Gino Rivera Falú
// Create Date: Feb 12 2011
// Modified: 
// Modified Date: 
// Under LGPLv3 License
//*********************************************************************


// Encode the string to be safe for databases 
function dataEncode($str){
	return addslashes( trim($str) );
}

// Decode the string to be safe on JSON
function dataDecode($str){
	return stripslashes($str);
}

?>
