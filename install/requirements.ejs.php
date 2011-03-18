<?php 
echo "[";

//******************************************************
// verified that php 5.2.0 or later is istalled
//******************************************************
if (version_compare(phpversion(), "5.2.0", ">=")) {
	$phpVer = 'Success';
} else {
 	$phpVer = 'Fail';
}
echo "{ 'msg': 'PHP 5.2.0 installed', 'status': '".$phpVer."' },"; 
//******************************************************
// try chmod sites folder and check chmod after that
//******************************************************
chmod("../sites", 777);
if(substr(sprintf('%o', fileperms("../sites")), -4)) {
	$sitesPerm = 'Success';
} else {
 	$sitesPerm = 'Fail';
}
echo "{ 'msg': 'Sites folder writable', 'status': '".$phpVer."' },"; 
echo "{ 'msg': 'Sites folder writable', 'status': '".$phpVer."' }"; 





echo "]";
?>

