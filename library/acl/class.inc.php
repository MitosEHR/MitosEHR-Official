<?php  
class ACL  
{  
	var $perms = array();        //Array : Stores the permissions for the user  
	var $userID = 0;            //Integer : Stores the ID of the current user  
	var $userRoles = array();    //Array : Stores the roles of the current user  

	function __constructor($userID = '') {
		if ($userID != '') {
			$this->userID = floatval($userID);  
		} else {  
			$this->userID = floatval($_SESSION['userID']);  
		}  
		$this->userRoles = $this->getUserRoles('ids');  
		$this->buildACL();  
	}
  
	function ACL($userID='') {
		$this->__constructor($userID);  
	}

	function getUserRoles() {
		$strSQL = "SELECT * FROM `acl_user_roles` WHERE `userID` = " . floatval($this->userID) . " ORDER BY `addDate` ASC";  
		$data = mysql_query($strSQL);  
		$resp = array();  
		while($row = mysql_fetch_array($data)) {
			$resp[] = $row['roleID'];  
		}  
		return $resp;  
	}

	function getAllRoles($format='ids') {
		$format = strtolower($format);  
		$strSQL = "SELECT * FROM `acl_roles` ORDER BY `roleName` ASC";  
		$data = mysql_query($strSQL);  
		$resp = array();  
		while($row = mysql_fetch_array($data)){
			if ($format == 'full'){
				$resp[] = array("ID" => $row['ID'],"Name" => $row['roleName']);  
			} else {  
				$resp[] = $row['ID'];  
			}
		}
	return $resp;  
	}
  
	function buildACL() {  
		//first, get the rules for the user's role  
		if (count($this->userRoles) > 0) {  
			$this->perms = array_merge($this->perms,$this->getRolePerms($this->userRoles));  
		}  
	
		//then, get the individual user permissions  
		$this->perms = array_merge($this->perms,$this->getUserPerms($this->userID));  
	}
  
	function getPermKeyFromID($permID){
		$strSQL = "SELECT `permKey` FROM `acl_permissions` WHERE `ID` = " . floatval($permID) . " LIMIT 1";  
		$data = mysql_query($strSQL);  
		$row = mysql_fetch_array($data);  
		return $row[0];  
	}

	function getPermNameFromID($permID){
		$strSQL = "SELECT `permName` FROM `acl_permissions` WHERE `ID` = " . floatval($permID) . " LIMIT 1";  
		$data = mysql_query($strSQL);  
		$row = mysql_fetch_array($data);  
		return $row[0];  
	}
	
	function getRoleNameFromID($roleID)  {
		$strSQL = "SELECT `roleName` FROM `acl_roles` WHERE `ID` = " . floatval($roleID) . " LIMIT 1";  
		$data = mysql_query($strSQL);  
		$row = mysql_fetch_array($data);  
		return $row[0];  
	}
	
	function getUsername($userID){
		$strSQL = "SELECT `username` FROM `users` WHERE `ID` = " . floatval($userID) . " LIMIT 1";  
		$data = mysql_query($strSQL);  
		$row = mysql_fetch_array($data);  
		return $row[0];  
	}
	
	function getRolePerms($role){
		if (is_array($role)){
			$roleSQL = "SELECT * FROM `acl_role_perms` WHERE `roleID` IN (" . implode(",",$role) . ") ORDER BY `ID` ASC";  
		} else {
			$roleSQL = "SELECT * FROM `acl_role_perms` WHERE `roleID` = " . floatval($role) . " ORDER BY `ID` ASC";  
		}  
		$data = mysql_query($roleSQL);  
		$perms = array();  
		while($row = mysql_fetch_assoc($data)){
			$pK = strtolower($this->getPermKeyFromID($row['permID']));  
			if ($pK == '') { continue; }  
			if ($row['value'] === '1') {  
				$hP = true;
			} else {
				$hP = false;  
			}
			$perms[$pK] = array('perm' => $pK,'inheritted' => true,'value' => $hP,'Name' => $this->getPermNameFromID($row['permID']),'ID' => $row['permID']);  
		}
		return $perms;  
	}  

	function getUserPerms($userID){
		$strSQL = "SELECT * FROM `acl_user_perms` WHERE `userID` = " . floatval($userID) . " ORDER BY `addDate` ASC";  
		$data = mysql_query($strSQL);  
		$perms = array();  
		while($row = mysql_fetch_assoc($data)){
			$pK = strtolower($this->getPermKeyFromID($row['permID']));  
			if ($pK == '') { continue; }
			if ($row['value'] == '1') {  
				$hP = true;  
			} else {  
				$hP = false;  
			}
			$perms[$pK] = array('perm' => $pK,'inheritted' => false,'value' => $hP,'Name' => $this->getPermNameFromID($row['permID']),'ID' => $row['permID']);  
		}
	return $perms;  
	}
	
	function getAllPerms($format='ids'){
		$format = strtolower($format);  
		$strSQL = "SELECT * FROM `acl_permissions` ORDER BY `permName` ASC";  
		$data = mysql_query($strSQL);  
		$resp = array();  
		while($row = mysql_fetch_assoc($data)){
			if ($format == 'full'){  
				$resp[$row['permKey']] = array('ID' => $row['ID'], 'Name' => $row['permName'], 'Key' => $row['permKey']);  
			} else {  
				$resp[] = $row['ID'];  
			}  
		}
		return $resp;  
	}

	function userHasRole($roleID){
		foreach($this->userRoles as $k => $v){
			if (floatval($v) === floatval($roleID)){ return true; }
		}
		return false;  
	}

	function hasPermission($permKey){
		$permKey = strtolower($permKey);  
		if (array_key_exists($permKey,$this->perms)){
			if ($this->perms[$permKey]['value'] === '1' || $this->perms[$permKey]['value'] === true){
				return true;
			} else {
				return false;
			}
		} else {
			return false;  
	}

	} // End of CLASS  
}  
?>  