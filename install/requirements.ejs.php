<?php 
echo '[';
//******************************************************
// verified is already insyalled on server
//******************************************************
$d = dir('../sites/');
while (false !== ($entry = $d->read())) {
	if ( $entry != "." && $entry != "..") {
		 $count++; 
	} 
}
if ($count <= 0){
	$count = 'Ok'; 
} else {
	$count = 'Fail'; 
}
echo '{"msg":"MitosEHR not installed","status":"'.$count.'"},'; 

//******************************************************
// verified that php 5.2.0 or later is istalled
//******************************************************
if (version_compare(phpversion(), "5.3.2", ">=")) {
	$phpVer = 'Ok';
} else {
 	$phpVer = 'Fail';
}
echo '{"msg":"PHP 5.3.2 + installed","status":"'.$phpVer.'"},'; 

//******************************************************
// Check if get_magic_quotes_gpc is off
//******************************************************
if ((get_magic_quotes_gpc() != 1)) {
	$gpc = 'Ok';
}else{
	$gpc = 'Fail';
}
echo '{"msg":"get_magic_quotes_gpc off/disabled","status":"'.$gpc.'"},';

//******************************************************
// try chmod sites folder and check chmod after that
//******************************************************
chmod("../sites", 777);
if (substr(sprintf('%o', fileperms("../sites")), -4)) {
	$sitesPerm = 'Ok';
} else {
 	$sitesPerm = 'Fail';
}
echo '{"msg":"Sites folder writable","status":"'.$sitesPerm.'"},'; 
//******************************************************
// check if safe_mome is off
//******************************************************
if (!ini_get('safe_mode')){
	$safe_mode = "Ok";
}else{
	$safe_mode = "Fail";
}
echo '{"msg":"PHP safe maode off","status":"'.$safe_mode.'"}'; 

echo ']';
?>

