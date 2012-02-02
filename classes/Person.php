<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File: Person.php
 * Date: 1/21/12
 * Time: 3:18 PM
 */
if(!isset($_SESSION)){
    session_name ("MitosEHR" );
    session_start();
    session_cache_limiter('private');
}

include_once($_SESSION['site']['root']."/classes/dbHelper.php");

class Person extends dbHelper {

    /**
     * @param $fname
     * @param $mname
     * @param $lname
     * @return string
     */
    public static function fullname($fname, $mname, $lname){
        if($_SESSION['global_settings'] && $_SESSION['global_settings']['fullname']){
            switch($_SESSION['global_settings']['fullname']){
                case '0':
                    $fullname = $lname.', '.$fname.' '.$mname;
                break;
                case '1':
                   $fullname = $fname.' '.$mname.' '.$lname;
                break;
            }
        }else{
            $fullname =  $lname.', '.$fname.' '.$mname;
        }
        $fullname = ($fullname == ',  ') ? '' : $fullname;

        return $fullname;
    }

}
