<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File: data.php
 * Date: 10/30/11
 * Time: 10:53 AM
 */
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');
$_SESSION['site']['flops'] = 0;
include_once($_SESSION['site']['root']."/classes/dbHelper.class.php");

$mitos_db   = new dbHelper();

$rawData    = file_get_contents("php://input");
$foo        = json_decode($rawData, true);
$data       = $foo['row'];

$start      = (!$_REQUEST["start"])? 0 : $_REQUEST["start"];
$limit      = (!$_REQUEST["limit"])? 10 : $_REQUEST["limit"];
$rows       = array();
switch($_SERVER['REQUEST_METHOD']){
    case 'GET':
        // *************************************************************************************
        // Get the $_GET['role_id']
        // and execute the apropriate SQL statement
        // query all permissions and left join with currRole values
        // *************************************************************************************
        $currRole = ($_REQUEST["role_id"] == null) ? 5 : $_REQUEST["role_id"];
        $mitos_db->setSQL("SELECT acl_roles.id AS roleID,
                       acl_roles.role_name,
                       acl_permissions.id AS permID,
                       acl_permissions.perm_key,
                       acl_permissions.perm_name,
                       acl_role_perms.id AS rolePermID,
                       acl_role_perms.role_id,
                       acl_role_perms.perm_id,
                       acl_role_perms.value
                  FROM (acl_role_perms
             LEFT JOIN acl_roles ON acl_role_perms.role_id = acl_roles.id)
            RIGHT JOIN acl_permissions ON acl_role_perms.perm_id = acl_permissions.id
                 WHERE acl_roles.id = '$currRole'
                 ORDER BY role_name DESC");
        $total = $mitos_db->rowCount();
        $rows = array();
        foreach($mitos_db->execStatement(PDO::FETCH_ASSOC) as $row){
            switch($row['value']){
                case '0':
                    $row['ac_perm'] = 'No Access';
                break;
                case '1':
                    $row['ac_perm'] = 'View';
                break;
                case '2':
                    $row['ac_perm'] = 'View/Edit';
                break;
                case '3':
                    $row['ac_perm'] = 'View/Edit/Delete';
                break;
            }
            array_push($rows, $row);
        }
        print_r(json_encode(array('totals'=>$total,'row'=>$rows)));
        exit;
    case 'POST':
        switch ($_REQUEST['task']) {
            // *************************************************************************************
            // Code used to create role
            // *************************************************************************************
            case "role":
                // *************************************************************************************
                // Validate and pass the POST variables to an array
                // This is the moment to validate the entered values from the user
                // although Sencha EXTJS make good validation, we could check again
                // just in case
                // *************************************************************************************
                $row['role_name'] = $data['role_name'];
                    
                // *************************************************************************************
                // Finally that validated POST variables is inserted to the database
                // This one make the JOB of two, if it has an ID key run the UPDATE statement
                // if not run the INSERT stament
                // *************************************************************************************
                $mitos_db->setSQL("INSERT INTO acl_roles SET role_name = '" . $row['role_name'] . "'");
                $ret = $mitos_db->execLog();
                $lastInsertId = $mitos_db->lastInsertId;
                // *************************************************************************************
                // when a new role is added a relationship need to be added
                // for every role at acl_role_perm table using the id from new role
                // *************************************************************************************
                $mitos_db->setSQL("SELECT id FROM acl_permissions");
                foreach ($mitos_db->execStatement(PDO::FETCH_ASSOC) as $perms_row) {
                    $mitos_db->setSQL("INSERT INTO acl_role_perms
                                               SET role_id = '" . $lastInsertId . "', " . "
                                                   perm_id = '" . $perms_row['id'] . "', " . "
                                                   value = '0'");
                    $mitos_db->execOnly();
                }
                if ( $ret[2] ){
                    echo '{ success: false, errors: { reason: "'. $ret[2] .'" }}';
                } else {
                    echo "{ success: true, role_id: $lastInsertId }";
                }
                exit;
            // *************************************************************************************
            // Code used to create permisions
            // *************************************************************************************
            case "perm":
                // *************************************************************************************
                // Validate and pass the POST variables to an array
                // This is the moment to validate the entered values from the user
                // although Sencha EXTJS make good validation, we could check again
                // just in case
                // *************************************************************************************
                $perm_key   = $data['perm_key'];
                $perm_name  = $data['perm_name'];
                // *************************************************************************************
                // Finally that validated POST variables is inserted to the database
                // This one make the JOB of two, if it has an ID key run the UPDATE statement
                // if not run the INSERT stament
                // *************************************************************************************
                $mitos_db->setSQL("INSERT INTO acl_permissions SET perm_key='$perm_key', perm_name='$perm_name'");
                $ret = $mitos_db->execLog();
                $lastInsertId = $mitos_db->lastInsertId;
                //**************************************************************************************
                // when a new permission is added a relationship need to be added
                // for every role at acl_role_perm table
                //**************************************************************************************
                $mitos_db->setSQL("SELECT id FROM acl_roles");
                foreach ($mitos_db->execStatement(PDO::FETCH_ASSOC) as $roles_row) {
                    $role_id = $roles_row['id'];
                    $mitos_db->setSQL("INSERT INTO acl_role_perms SET role_id='$role_id', perm_id='$lastInsertId', value = '0'");
                    $mitos_db->execLog();
                }
                if ( $ret[2] ){
                    echo '{ success: false, errors: { reason: "'. $ret[2] .'" }}';
                } else {
                    echo "{ success: true }";
                }
                break;
        }
        exit;
    case 'PUT':
        switch ($_REQUEST['task']) {
            // *************************************************************************************
            // Code used to update role
            // *************************************************************************************
            case "role":
                // *************************************************************************************
                // Validate and pass the POST variables to an array
                // This is the moment to validate the entered values from the user
                // although Sencha EXTJS make good validation, we could check again
                // just in case
                // *************************************************************************************
                $role_name  = $data['role_name'];
                $id         = $data['roleID'];
                // *************************************************************************************
                // Finally that validated POST variables is inserted to the database
                // This one make the JOB of two, if it has an ID key run the UPDATE statement
                // if not run the INSERT stament
                // *************************************************************************************
                $mitos_db->setSQL("UPDATE acl_roles SET role_name='$role_name' WHERE id='$id'");
                $ret = $mitos_db->execLog();
                if ( $ret[2] ){
                    echo '{ success: false, errors: { reason: "'. $ret[2] .'" }}';
                } else {
                    echo "{ success: true }";
                }
                break;
            // *****************************************************************************************
            // Code used to update role_perms and permisions
            // *****************************************************************************************
            case "perm":
                // *************************************************************************************
                // Validate and pass the POST variables to an array
                // This is the moment to validate the entered values from the user
                // although Sencha EXTJS make good validation, we could check again
                // just in case
                // *************************************************************************************
                $id         = $data['rolePermID'];
                $permID     = $data['permID'];
                $value      = $data['ac_perm'];
                $perm_key   = $data['perm_key'];
                $perm_name  = $data['perm_name'];
                // *************************************************************************************
                // Finally that validated POST variables is inserted to the database
                // This one make the JOB of two, if it has an ID key run the UPDATE statement
                // if not run the INSERT stament
                // *************************************************************************************
                $mitos_db->setSQL("UPDATE acl_role_perms SET value='$value' WHERE id='$id'");
                $mitos_db->execLog();
                $mitos_db->setSQL("UPDATE acl_permissions SET perm_key='$perm_key', perm_name='$perm_name' WHERE id='$permID'");
                $mitos_db->execLog();
                if ($ret[2]){
                    echo '{ success: false, errors: { reason: "'. $ret[2] .'" }}';
                } else {
                    echo "{ success: true }";
                }
                break;
        }
        exit;
    case 'DELETE':
        switch ($_REQUEST['task']) {
            // *********************************************************************************
            // Code to delete roles and related data from acl_role_perms
            // *********************************************************************************
            case "role";
                $delete_id = $data['role_id'];
                $mitos_db->setSQL("DELETE FROM acl_roles WHERE id='$delete_id'");
                $mitos_db->execLog();
                $mitos_db->setSQL("DELETE FROM acl_role_perms WHERE role_id='$delete_id'");
                $mitos_db->execLog();
                echo "{ success: true }";
            break;
            // *********************************************************************************
            // Code to delete permissions and related data from acl_role_perms
            // *********************************************************************************
            case "perm";
                $delete_id = $data['permID'];
                $mitos_db->setSQL("DELETE FROM acl_permissions WHERE id='$delete_id'");
                $mitos_db->execLog();
                $mitos_db->setSQL("DELETE FROM acl_role_perms WHERE acl_role_perms.perm_id='$delete_id'");
                $mitos_db->execLog();
                echo "{ success: true }";
            break;
        }
        exit;
}
 
