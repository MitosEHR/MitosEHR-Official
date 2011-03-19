<?php 
echo "[";
//******************************************************
// verified is already insyalled on server
//******************************************************
$d = dir("../sites/");
while (false !== ($entry = $d->read())) {
	if ( $entry != "." && $entry != "..") {
		 $count++; 
	} 
}
if ($count <= 0){
	echo "{ 'msg': 'MitosEHR not installed', 'status': 'Ok' },";
} else {
	echo "{ 'msg': 'MitosEHR not installed', 'status': 'Fail' },"; 
}
//******************************************************
// verified that php 5.2.0 or later is istalled
//******************************************************
if (version_compare(phpversion(), "5.2.0", ">=")) {
	$phpVer = 'Ok';
} else {
 	$phpVer = 'Fail';
}
echo "{ 'msg': 'PHP 5.2.0 + installed', 'status': '".$phpVer."' },"; 
//******************************************************
// try chmod sites folder and check chmod after that
//******************************************************
chmod("../sites", 777);
if (substr(sprintf('%o', fileperms("../sites")), -4)) {
	$sitesPerm = 'Ok';
} else {
 	$sitesPerm = 'Fail';
}
echo "{ 'msg': 'Sites folder writable', 'status': '".$phpVer."' },";

 
echo "{ 'msg': 'Sites folder writable', 'status': '".$phpVer."' }"; 





echo "]";
?>

