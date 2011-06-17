<?php
//*********************************************************************************************
// setup class v0.0.1
// Description: This class is to manage passwords
//
// Author: Ernesto Rodriguez
//*********************************************************************************************
include_once($_SESSION['site']['root']."/library/dbHelper/dbHelper.inc.php");
class password extends dbHelper {
    public $password;
    public $h1Password;
    public $h2Password;
    public $aes;
    public $oPassword;
    public $nPassword;
    public $user_id;

    //******************************************************************************************************************
    // Just check length (6-10), letters, caps and numbers.
    //******************************************************************************************************************
    function ckPassword(){
        if (preg_match("'^.*(?=.{4,})(?=.*[a-z])(?=.*[A-Z]).*$'", $this->nPassword)){
            return;
        } else {
            echo "{ success: false, errors: { reason: 'The new password must contain 4 or more characters and at least one upper case letter, one lower case letter and one digit.'}}";
            exit;
        }
    }
    //******************************************************************************************************************
    // Lets encrypt both old and new passwords
    //******************************************************************************************************************
    function aesPasswords(){
        require_once($_SESSION['site']['root']."/library/phpAES/AES.class.php");
        $this->aes = new AES($_SESSION['site']['AESkey']);
        $this->oPassword = $this->aes->encrypt($this->oPassword);
        $this->nPassword = $this->aes->encrypt($this->nPassword);
    }
    //******************************************************************************************************************
    // Lets make sure the user has access to change the password
    //******************************************************************************************************************
    function ckUser(){
        $this->setSQL("SELECT * FROM users WHERE id='".$this->user_id."' AND password='".$this->oPassword."' LIMIT 1");
        if($this->fetch()){
            // TODO: full admin access will be able to change all users password too...
            return;
        }else{
            echo "{ success: false, errors: { reason: 'The password you provided is invalid.'}}";
            exit;
        }
    }

    //******************************************************************************************************************
    // Lets make sure the password is not in used or does not repeat the previous two password
    //******************************************************************************************************************
    function ckPasswordHistory(){
        $this->setSQL("SELECT password, pwd_history1, pwd_history2  FROM users WHERE id='".$this->user_id."'");
        $user = $this->fetch();
        
        $this->password     = $user['password'];
        $this->h1Password   = $user['pwd_history1'];
        $this->h2Password   = $user['pwd_history2'];
        
        $newPass = $this->nPassword;
        if($user['pwd_history1'] == $newPass || $user['pwd_history2'] == $newPass){
            echo "{ success: false, errors: { reason: 'The password you provided can not repeat your previous two passwords used'}}";
            exit;
        } elseif($user['password'] == $newPass){
            echo "{ success: false, errors: { reason: 'The password you provided is currently in used. Please use a different password'}}";
            exit;
        }else{
            return;
        }
    }
    //******************************************************************************************************************
    // Lets change the new password history
    //******************************************************************************************************************
    function savePassword(){
        $row['password']     = $this->nPassword;
        $row['pwd_history1'] = $this->oPassword;
        $row['pwd_history2'] = $this->h1Password;

        $sql = $this->sqlBind($row, "users", "U", "id='".$this->user_id."'");
        $this->setSQL($sql);
        $this->execLog();
        echo '{ success: true }';
        exit;
    }
    //******************************************************************************************************************
    // Lets change the password
    //******************************************************************************************************************
    function changePassword(){
        $this->ckPassword(); // lets do this first before AES the passwords
        $this->aesPasswords();
        $this->ckUser();
        $this->ckPasswordHistory();
        $this->savePassword();
    }
}
?>