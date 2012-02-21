<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File: authProcedures.php
 * Date: 1/13/12
 * Time: 8:41 AM
 */
if(!isset($_SESSION)){
    session_name ("MitosEHR" );
    session_start();
    session_cache_limiter('private');
}
include_once("dbHelper.php");
include_once("AES.php");

class authProcedures {

    /**
     * @param stdClass $params
     * @return int
     */
    public function login(stdClass $params){

        //-------------------------------------------
        // Check that the username do not pass
        // the maximum limit of the field.
        //
        // NOTE:
        // If this condition is met, the user did not
        // use the logon form. Possible hack.
        //-------------------------------------------
        if (strlen($params->authUser) >= 26){
         	return array('success'=>false, 'error'=>'Possible hack, please use the Logon Screen.');
        }
        //-------------------------------------------
        // Check that the username do not pass
        // the maximum limit of the field.
        //
        // NOTE:
        // If this condition is met, the user did not
        // use the logon form. Possible hack.
        //-------------------------------------------
        if (strlen($params->authPass) >= 11){
            return array('success'=>false, 'error'=>'Possible hack, please use the Logon Screen.');
        }
        //-------------------------------------------
        // Simple check username
        //-------------------------------------------
        if (!$params->authUser){
            return array('success'=>false, 'error'=>'The username field can not be in blank. Try again.');
        }
        //-------------------------------------------
        // Simple check password
        //-------------------------------------------
        if (!$params->authPass){
            return array('success'=>false, 'error'=>'The password field can not be in blank. Try again.');
        }
        //-------------------------------------------
        // Find the AES key in the selected site
        // And include the rest of the remaining
        // variables to connect to the database.
        //-------------------------------------------
        $_SESSION['site']['site'] = $params->choiseSite;
        $fileConf = "../sites/" . $_SESSION['site']['site'] . "/conf.php";
        if (file_exists($fileConf)){
            /** @noinspection PhpIncludeInspection */
            include_once($fileConf);
            $mitos_db = new dbHelper();
        	$err = $mitos_db->getError();
        	if (!is_array($err)){
                return array('success'=>false, 'error'=>'For some reason, I can\'t connect to the database.');
        	}
        	// Do not stop here!, continue with the rest of the code.
        } else {
            return array('success'=>false, 'error'=>'No configuration file found on the selected site.<br>Please contact support.');
        }
        //-------------------------------------------
        // Convert the password to AES and validate
        //-------------------------------------------
        $aes = new AES($_SESSION['site']['AESkey']);
        $ret = $aes->encrypt($params->authPass);
        //-------------------------------------------
        // Username & password match
        //-------------------------------------------
        $mitos_db->setSQL("SELECT id, username, fname, mname, lname, email
                         FROM users
        		        WHERE username   = '$params->authUser'
        		          AND password   = '$ret'
        		          AND authorized = '1'
        		        LIMIT 1");

        $rec = $mitos_db->fetch();
        if ($rec['username'] == null){
            return array('success'=>false, 'error'=>'The username or password you provided is invalid.');
        } else {
        	//-------------------------------------------
        	// Change some User related variables and go
        	//-------------------------------------------
        	$_SESSION['user']['name']   = $rec['title'] . " " . $rec['lname'] . ", " . $rec['fname'] . " " . $rec['mname'];
        	$_SESSION['user']['id']     = $rec['id'];
        	$_SESSION['user']['email']  = $rec['email'];
        	$_SESSION['user']['auth']   = true;
        	//-------------------------------------------
        	// Also fetch the current version of the
        	// Application & Database
        	//-------------------------------------------
        	$sql = "SELECT * FROM version LIMIT 1";
            $mitos_db->setSQL($sql);
        	$rec = $mitos_db->fetch();
        	$_SESSION['ver']['codeName']    = $rec['v_tag'];
        	$_SESSION['ver']['major']       = $rec['v_major'];
        	$_SESSION['ver']['rev']         = $rec['v_patch'];
        	$_SESSION['ver']['minor']       = $rec['v_minor'];
        	$_SESSION['ver']['database']    = $rec['v_database'];

            $_SESSION['lang']['code']       = $params->lang;

            return array('success'=>true);
        }
    }

    /**
     * @static
     * @return mixed
     */
    public static function unAuth(){
        session_unset();
        session_destroy();
        return;
    }

    /**
     * @static
     * @return int
     */
    public static function ckAuth(){

        $_SESSION['site']['flops']++;
        //****************************************************************
        // If the session has passed 60 flops, with out any activity exit
        // the application.
        //
        // return an exit code
        //****************************************************************
        if($_SESSION['site']['flops'] < 180) {
            return array('authorized' => true);
        }else{
            return array('authorized' => false);
        }
    }

    public function getSites(){
        $rows = array();
        foreach($_SESSION['site']['sites'] as $row){
            $site['site_id'] = $row;
            $site['site']    = $row;
            array_push($rows,$site);
        }
        return $rows;
    }
}
