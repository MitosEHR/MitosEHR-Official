<?php  
class ACL {  
	var $perms = array();        //Array : Stores the permissions for the user  
	var $user_id = 0;            //Integer : Stores the id of the current user  
	var $user_roles = array();    //Array : Stores the roles of the current user  

	function __constructor($user_id = '') {
		if ($user_id != '') {
			$this->user_id = floatval($user_id);  
		} else {  
			$this->user_id = floatval($_SESSION['user_id']);  
		}  
		$this->user_roles = $this->getuser_roles('ids');  
		$this->buildACL();  
	}
  
	function ACL($user_id='') {
		$this->__constructor($user_id);  
	}

	function getuser_roles() {
		$strSQL = "SELECT * FROM `acl_user_roles` WHERE `user_id` = " . floatval($this->user_id) . " ORDER BY `add_date` ASC";  
		$data = mysql_query($strSQL);  
		$resp = array();  
		while($row = mysql_fetch_array($data)) {
			$resp[] = $row['role_id'];  
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
				$resp[] = array("id" => $row['id'],"Name" => $row['roleName']);  
			} else {  
				$resp[] = $row['id'];  
			}
		}
	return $resp;  
	}
  
	function buildACL() {  
		//first, get the rules for the user's role  
		if (count($this->user_roles) > 0) {  
			$this->perms = array_merge($this->perms,$this->getRolePerms($this->user_roles));  
		}  
	
		//then, get the individual user permissions  
		$this->perms = array_merge($this->perms,$this->getUserPerms($this->user_id));  
	}
  
	function getperm_keyFromid($perm_id){
		$strSQL = "SELECT `perm_key` FROM `acl_permissions` WHERE `id` = " . floatval($perm_id) . " LIMIT 1";  
		$data = mysql_query($strSQL);  
		$row = mysql_fetch_array($data);  
		return $row[0];  
	}

	function getperm_nameFromid($perm_id){
		$strSQL = "SELECT `perm_name` FROM `acl_permissions` WHERE `id` = " . floatval($perm_id) . " LIMIT 1";  
		$data = mysql_query($strSQL);  
		$row = mysql_fetch_array($data);  
		return $row[0];  
	}
	
	function getRoleNameFromid($role_id)  {
		$strSQL = "SELECT `roleName` FROM `acl_roles` WHERE `id` = " . floatval($role_id) . " LIMIT 1";  
		$data = mysql_query($strSQL);  
		$row = mysql_fetch_array($data);  
		return $row[0];  
	}
	
	function getUsername($user_id){
		$strSQL = "SELECT `username` FROM `users` WHERE `id` = " . floatval($user_id) . " LIMIT 1";  
		$data = mysql_query($strSQL);  
		$row = mysql_fetch_array($data);  
		return $row[0];  
	}
	
	function getRolePerms($role){
		if (is_array($role)){
			$roleSQL = "SELECT * FROM `acl_role_perms` WHERE `role_id` IN (" . implode(",",$role) . ") ORDER BY `id` ASC";  
		} else {
			$roleSQL = "SELECT * FROM `acl_role_perms` WHERE `role_id` = " . floatval($role) . " ORDER BY `id` ASC";  
		}  
		$data = mysql_query($roleSQL);  
		$perms = array();  
		while($row = mysql_fetch_assoc($data)){
			$pK = strtolower($this->getperm_keyFromid($row['perm_id']));  
			if ($pK == '') { continue; }  
			if ($row['value'] === '1') {  
				$hP = true;
			} else {
				$hP = false;  
			}
			$perms[$pK] = array('perm' => $pK,'inheritted' => true,'value' => $hP,'Name' => $this->getperm_nameFromid($row['perm_id']),'id' => $row['perm_id']);  
		}
		return $perms;  
	}  

	function getUserPerms($user_id){
		$strSQL = "SELECT * FROM `acl_user_perms` WHERE `user_id` = " . floatval($user_id) . " ORDER BY `add_date` ASC";  
		$data = mysql_query($strSQL);  
		$perms = array();  
		while($row = mysql_fetch_assoc($data)){
			$pK = strtolower($this->getperm_keyFromid($row['perm_id']));  
			if ($pK == '') { continue; }
			if ($row['value'] == '1') {  
				$hP = true;  
			} else {  
				$hP = false;  
			}
			$perms[$pK] = array('perm' => $pK,'inheritted' => false,'value' => $hP,'Name' => $this->getperm_nameFromid($row['perm_id']),'id' => $row['perm_id']);  
		}
	return $perms;  
	}
	
	function getAllPerms($format='ids'){
		$format = strtolower($format);  
		$strSQL = "SELECT * FROM `acl_permissions` ORDER BY `perm_name` ASC";  
		$data = mysql_query($strSQL);  
		$resp = array();  
		while($row = mysql_fetch_assoc($data)){
			if ($format == 'full'){  
				$resp[$row['perm_key']] = array('id' => $row['id'], 'Name' => $row['perm_name'], 'Key' => $row['perm_key']);  
			} else {  
				$resp[] = $row['id'];  
			}  
		}
		return $resp;  
	}

	function userHasRole($role_id){
		foreach($this->user_roles as $k => $v){
			if (floatval($v) === floatval($role_id)){ return true; }
		}
		return false;  
	}
	// function to ck if user has permition to ***** VIEW *****
	function hasPermission($perm_key){
		$perm_key = strtolower($perm_key);  
		if (array_key_exists($perm_key,$this->perms)){
			if ($this->perms[$perm_key]['value'] === '1' || $this->perms[$perm_key]['value'] === true){
				return true;
			} else {
				return false;
			}
		} else {
			return false;  
		}
	} 
	// function to ck if user has permition to ***** VIEW and EDIT *****
	function hasPermissionWrite($perm_key){
		$perm_key = strtolower($perm_key);  
		if (array_key_exists($perm_key,$this->perms)){
			if ($this->perms[$perm_key]['value'] === '2' || $this->perms[$perm_key]['value'] === true){
				return true;
			} else {
				return false;
			}
		} else {
			return false;  
		}
	} 
}  
?>  