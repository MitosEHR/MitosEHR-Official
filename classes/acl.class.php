<?php
//session_name ( "MitosEHR" );
//session_start();
//session_cache_limiter('private');
include_once($_SESSION['site']['root']."/classes/dbHelper.php");


class ACL {

    /**
     * @var array
     */
    private $perms = array();
    /**
     * @var int
     */
    private $user_id;
    /**
     * @var array
     */
    private $user_roles = array();
    /**
     * @var
     */
    private $conn;

    /**
     * @internal param string $user_id
     * @param null $user_id
     */
	public function __construct($user_id = null){
        $this->conn = new dbHelper();
        $this->user_id = ($user_id == null)? $_SESSION['user']['id'] : $user_id;
        $this->user_roles = $this->getuser_roles();
        $this->buildACL();
	}

    /**
     * @internal param string $format
     * @return array
     */
    public function getAllRoles(){
        $roles = array();
        $this->conn->setSQL("SELECT * FROM acl_roles ORDER BY seq ASC");
        foreach ($this->conn->execStatement(PDO::FETCH_ASSOC) as $row) {
            array_push($roles, $row);
        }
        $total = $this->conn->rowCount();
        return array('totals'=>$total,'row'=>$roles);
    }

    /**
     * @param string $format
     * @return array
     */
    public function getAllPerms($format='ids'){
        $format = strtolower($format);
        $strSQL = "SELECT * FROM acl_permissions ORDER BY seq ASC";
        $this->conn->setSQL($strSQL);
        $resp = array();
        foreach($this->conn->execStatement(PDO::FETCH_ASSOC) as $row){
            if ($format == 'full'){
                $resp[$row['perm_key']] = array('id' => $row['id'], 'Name' => $row['perm_name'], 'Key' => $row['perm_key'], 'Cat' => $row['perm_cat']);
            } else {
                $resp[] = $row['id'];
            }
        }
        return $resp;
    }

    /**
     * @return array
     */
	private function getuser_roles(){

        $this->conn->setSQL("SELECT * FROM acl_user_roles WHERE user_id = '$this->user_id' ORDER BY add_date ASC");
		$resp = array();
        foreach($this->conn->execStatement(PDO::FETCH_ASSOC) as $row){
			$resp[] = $row['role_id'];
		}
		return $resp;

	}

	private function buildACL(){
		//first, get the rules for the user's role
		if (count($this->user_roles) > 0){
			$this->perms = array_merge($this->perms,$this->getRolePerms($this->user_roles));
		}
		//then, get the individual user permissions
		$this->perms = array_merge($this->perms,$this->getUserPerms($this->user_id));
	}

    /**
     * @param $perm_id
     * @return mixed
     */
	private function getperm_keyFromid($perm_id){
		$strSQL = "SELECT perm_key FROM acl_permissions WHERE id = " . floatval($perm_id) . " LIMIT 1";
        $this->conn->setSQL($strSQL);
		$row = $this->conn->execStatement(PDO::FETCH_ASSOC);
		return $row[0]['perm_key'];
	}

    /**
     * @param $perm_id
     * @return mixed
     */
	private function getperm_nameFromid($perm_id){
		$strSQL = "SELECT perm_name FROM acl_permissions WHERE id = " . floatval($perm_id) . " LIMIT 1";
        $this->conn->setSQL($strSQL);
		$row = $this->conn->execStatement(PDO::FETCH_ASSOC);
		return $row[0]['perm_name'];
	}

    /**
     * @param $role_id
     * @return mixed
     */
	private function getRoleNameFromid($role_id){
		$strSQL = "SELECT role_name FROM acl_roles WHERE id = " . floatval($role_id) . " LIMIT 1";
        $this->conn->setSQL($strSQL);
		$row = $this->conn->execStatement(PDO::FETCH_ASSOC);
		return $row[0]['role_name'];
	}

    /**
     * @param $role
     * @return array
     */
	private function getRolePerms($role){
		if (is_array($role)){
			$roleSQL = "SELECT * FROM acl_role_perms WHERE role_id IN (" . implode(",",$role) . ") ORDER BY id ASC";
		} else {
			$roleSQL = "SELECT * FROM acl_role_perms WHERE role_id = " . floatval($role) . " ORDER BY id ASC";
		}
        $this->conn->setSQL($roleSQL);
		$perms = array();
		foreach($this->conn->execStatement(PDO::FETCH_ASSOC) as $row){
			$pK = strtolower($this->getperm_keyFromid($row['perm_id']));
			if ($pK == '') { continue; }
            if ($row['value'] == '1') {
                $hP = true;
            } else {
                $hP = false;
            }
			$perms[$pK] = array('perm' => $pK,'inheritted' => true,'value' => $hP,'Name' => $this->getperm_nameFromid($row['perm_id']),'id' => $row['perm_id']);
		}
		return $perms;
	}

    /**
     * @param $user_id
     * @return array
     */
	private function getUserPerms($user_id){
		$strSQL = "SELECT * FROM acl_user_perms WHERE user_id = " . floatval($user_id) . " ORDER BY add_date ASC";
        $this->conn->setSQL($strSQL);
		$perms = array();
        foreach($this->conn->execStatement(PDO::FETCH_ASSOC) as $row){
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

    /**
     * @param $role_id
     * @return bool
     */
	private function userHasRole($role_id){
		foreach($this->user_roles as $k => $v){
			if (floatval($v) === floatval($role_id)){ return true; }
		}
		return false;
	}

    /**
     * function to ck if user has permition to VIEW
     *
     * @param $perm_key
     * @return bool
     */
	public function hasPermission($perm_key){
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

    /**
     *
     * @return mixed
     */
    public function getRoleForm(){
        $items = array();
        $perms = array();
        $roles = $this->getAllRoles();
        $cattegories = array('General','Calendar','Patients','Encounters','Demographics','Documents','ePrescription','Administrators','Miscellaneous');
        foreach($this->getAllPerms('full') as $perm){
            array_push($perms,$perm);
        }
        foreach($cattegories as $cat){
            $item = array();
            $item['xtype']      = 'fieldset';
            $item['title']      = $cat;
            $item['layout']     = 'anchor';
            $item['labelWidth'] = 100;
            $item['defaults']   = array(
                'xtype'         => 'fieldcontainer',
                'defaultType'   => 'mitos.checkbox',
                'layout'        => 'hbox',
                'defaults'      => array(
                    'margin'    =>'0 50 0 0'
                ),
                'labelWidth'    => 200
             );
            $item['items']      = array();
            foreach($perms as $perm){
                $row = null;
                if(strtolower($perm['Cat']) == strtolower($item['title'])){
                    $row['fieldLabel'] = $perm['Name'];
                    $checkboxes = array();
                    foreach($roles['row'] as $role){
                        //TODO:  for development...  false : false
                        $disable = false; //(strtolower($role['role_name']) == 'administrator')? false : false;
                        $checkbox = array('name'=>strtolower($perm['Key']).'_'.strtolower(str_replace(' ','_',$role['role_name'])),'disabled'=>$disable );
                        array_push($checkboxes,$checkbox);
                    }

                    $row['items'] = $checkboxes;
                    array_push($item['items'],$row);
                }
            }
            array_push($items,$item);
        }
        $rawStr     = json_encode($items);
        $regex      = '("\w*?":|"Ext\.create|\)"\})';
        $cleanItems = array();
        preg_match_all( $regex, $rawStr, $rawItems );
        foreach($rawItems[0] as $item){
            array_push( $cleanItems, str_replace( '"', '', $item) );
        }
        $itemsJsArray = str_replace( '"', '\'', str_replace( $rawItems[0], $cleanItems, $rawStr ));
        return $itemsJsArray;
    }

    private function saveRolePerm($role, $perm, $val){

        $this->conn->setSQL("SELECT id FROM acl_roles WHERE role_key = '$role'");
        $role = $this->conn->fetch();
        $role_perms['role_id'] = $role['id'];

        $this->conn->setSQL("SELECT id FROM acl_permissions WHERE perm_key = '$perm'");
        $perms = $this->conn->fetch();
        $role_perms['perm_id'] = $perms['id'];
        $role_perms['value'] = $val;

        $this->conn->setSQL("SELECT id FROM acl_role_perms WHERE 	role_id = '".$role_perms['role_id']."' AND perm_id = '".$role_perms['perm_id']."' ");
        $role_perm = $this->conn->fetch();

        if($role_perm['id'] != null){
            $sql = $this->conn->sqlBind($role_perms, "acl_role_perms", "U", "id = '".$role_perm['id']."'");
            $this->conn->setSQL($sql);
            $this->conn->execLog();
        }else{
            $sql = $this->conn->sqlBind($role_perms, "acl_role_perms", "I");
            $this->conn->setSQL($sql);
            $this->conn->execLog();
        }
    }

    public function saveRoles($data){
        unset ($data['task']);
        function parse_boolean($val) {
            return ($val == 'on')? 1 : 0;
        }


        foreach($data as $key => $val){
            $val = parse_boolean($val);
            if(!strpos($key,'_front_office') === false){
                $this->saveRolePerm('front_office',str_replace('_front_office','',$key), $val);
            }elseif(!strpos($key,'_auditor') === false){
                $this->saveRolePerm('auditor',str_replace('_auditor','',$key), $val);
            }elseif(!strpos($key,'_clinician') === false){
                $this->saveRolePerm('clinician',str_replace('_clinician','',$key), $val);
            }elseif(!strpos($key,'_physician') === false){
                $this->saveRolePerm('physician',str_replace('_physician','',$key), $val);
            }elseif(!strpos($key,'_administrator') === false){
                $this->saveRolePerm('administrator',str_replace('_administrator','',$key), $val);
            }
        }

        return '{"success":true}';
    }

    public function getrolesFormData(){
        //global $mitos_db;
        $this->conn->setSQL("SELECT acl_roles.role_key, acl_permissions.perm_key, acl_role_perms.value
                               FROM (acl_role_perms
                          LEFT JOIN acl_roles ON acl_role_perms.role_id = acl_roles.id)
                         RIGHT JOIN acl_permissions ON acl_role_perms.perm_id = acl_permissions.id
                           ORDER BY role_name DESC");
        $total = $this->conn->rowCount();
        $rows = array();
        foreach($this->conn->execStatement(PDO::FETCH_ASSOC) as $row){
            $rows[$row['perm_key'].'_'.$row['role_key']] = $row['value'];
        }
        return json_encode(array('totals'=>$total,'row'=>$rows));
    }
}
/**
 * TEST AREA!
 */
//$pclass = new ACL();
//echo '<pre>';
//print_r($pclass->hasPermission('access_calendar')? 'yes':'no');
//
//echo 'User Has Permition to View Administer_Roles? ';
//print $pclass->hasPermission('Administer_Roles')? 'YES' : 'NO';
//echo '<br>';
//echo '<br>';
//echo 'perm values';
//echo '<br>';
//echo 'all roles';
//echo '<br>';
//print_r(json_encode($pclass->getAllRoles()));
//echo '<br>';
//echo '<br>';