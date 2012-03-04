<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File: User.php
 * Date: 2/3/12
 * Time: 1:46 PM
 */
if(!isset($_SESSION)){
    session_name ( "MitosEHR" );
    session_start();
    session_cache_limiter('private');
}
include_once("AES.php");
include_once("Person.php");
class User extends Person {

    /**
     * @var
     */
    private $user_id;

    /**
     * @return AES
     */
    private function getAES(){
        return new AES($_SESSION['site']['AESkey']);
    }

    public function getCurrentUserId()
    {
        return $_SESSION['user']['id'];
    }

    /**
     * @param stdClass $params
     * @return array
     */
    public function getUsers(stdClass $params)
    {
        $this->setSQL("SELECT u.*, r.role_id
                         FROM users AS u
                    LEFT JOIN acl_user_roles AS r ON r.user_id = u.id
                        WHERE u.authorized = 1 OR u.username != ''
                     ORDER BY u.username
                        LIMIT $params->start,$params->limit");
        $rows = array();
        foreach($this->execStatement(PDO::FETCH_ASSOC) as $row){
            $row['fullname']    = $this->fullname($row['fname'],$row['mname'],$row['lname']);
            unset($row['password'],$row['pwd_history1'],$row['pwd_history2']);
            array_push($rows, $row);
        }
        return $rows;
    }

    public function getCurrentUserData()
    {
        $id = $this->getCurrentUserId();
        $this->setSQL("SELECT *
                         FROM users
                        WHERE id = '$id'");
        $user = $this->fetch();
        return $user;
    }

    /**
     * @param stdClass $params
     * @return stdClass
     */
    public function addUser(stdClass $params)
    {
        $data = get_object_vars($params);
        $role['role_id'] = $data['role_id'];
        unset($data['id'], $data['role_id'], $data['fullname'], $data['password']);
//        $data['authorized'] = ($data['authorized'] == 'on' ? 1 : 0);
//        $data['active']   	= ($data['active']     == 'on' ? 1 : 0);
//        $data['calendar']   = ($data['calendar']   == 'on' ? 1 : 0);
        if($data['taxonomy'] == ""){ unset($data['taxonomy']); }
        $sql = $this->sqlBind($data, "users", "I");
        $this->setSQL($sql);
        $this->execLog();
        $params->id = $this->lastInsertId;
        $role['user_id'] = $params->id;
        $sql = $this->sqlBind($role, "acl_user_roles", "I");
        $this->setSQL($sql);
        $this->execLog();
        return $params;
    }

    /**
     * @param stdClass $params
     * @return stdClass
     */
    public function updateUser(stdClass $params)
    {
        $data = get_object_vars($params);
        $params->password = '';

        $this->user_id = $data['id'];
        $role['role_id'] = $data['role_id'];
        unset($data['id'], $data['role_id'], $data['fullname']);
        if($data['password'] != ''){
            $this->changePassword($data['password']);
        }
        unset($data['password']);
        $sql = $this->sqlBind($role, "acl_user_roles", "U", "user_id='$this->user_id'");
        $this->setSQL($sql);
        $this->execLog();
//        $data['authorized'] = ($data['authorized'] == 'on' ? 1 : 0);
//        $data['active']   	= ($data['active']     == 'on' ? 1 : 0);
//        $data['calendar']   = ($data['calendar']   == 'on' ? 1 : 0);
        $sql = $this->sqlBind($data, "users", "U", "id='$this->user_id'");
        $this->setSQL($sql);
        $this->execLog();
        return $params;

    }


    /**
     * @param stdClass $params
     * @return array
     */
    public function chechPasswordHistory(stdClass $params)
    {
        $aes = $this->getAES();
        $this->user_id = $params->id;
        $aesPwd = $aes->encrypt($params->password);
        $this->setSQL("SELECT password, pwd_history1, pwd_history2  FROM users WHERE id='".$this->user_id."'");
        $pwds = $this->fetch();
        if($pwds['password'] == $aesPwd || $pwds['pwd_history1'] == $aesPwd || $pwds['pwd_history2'] == $aesPwd){
            return array('error'=>true);
        }else{
            return array('error'=>false);
        }
    }


    /**
     * @param $newpassword
     * @return mixed
     */
    public function changePassword($newpassword)
    {
        $aes = $this->getAES();
        $aesPwd = $aes->encrypt($newpassword);
        $this->setSQL("SELECT password, pwd_history1 FROM users WHERE id='".$this->user_id."'");
        $pwds = $this->fetch();
        $row['password']     = $aesPwd;
        $row['pwd_history1'] = $pwds['password'];
        $row['pwd_history2'] = $pwds['pwd_history1'];
        $sql = $this->sqlBind($row, "users", "U", "id='".$this->user_id."'");
        $this->setSQL($sql);
        $this->execLog();
        return;

    }


    public function changeMyPassword(stdClass $params)
    {
        $this->user_id = $params->id;

        return array('success'=>true);
    }

    public function updateMyAccount(stdClass $params)
    {
        $data = get_object_vars($params);
        unset($data['id']);
        $sql = $this->sqlBind($data, "users", "U", "id='" .$params->id . "'");
        $this->setSQL($sql);
        $this->execLog();
        return array('success'=>true);
    }

}
