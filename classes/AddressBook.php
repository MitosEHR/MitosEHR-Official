<?php
if (!isset($_SESSION)) {
    session_name("MitosEHR");
    session_start();
    session_cache_limiter('private');
}
include_once('dbhelper.php');
include_once('Person.php');
/**
 * @brief       Brief Description
 * @details     Detail Description ...
 *
 * @author      Ernesto J . Rodriguez(Certun) < erodriguez@certun.com >
 * @version     Vega 1.0
 * @copyright   Gnu Public License(GPLv3)
 */
class AddressBook extends dbHelper {

    /**
     * @param stdClass $params
     * @return array
     * NOTES: Address of who?,
     *  Naming: "getAddressesFromPatient" ???
     */
    public function getAddresses(stdClass $params)
    {
        $this->setSQL("SELECT *
                         FROM users
                        WHERE users.active = 1 AND ( users.authorized = 1 OR users.username = '' )
                        LIMIT $params->start,$params->limit");
        $records = $this->execStatement(PDO::FETCH_ASSOC);
        $total   = count($records);
        $rows    = array();
        foreach($records as $row){
        	$row['fullname']    = Person::fullname($row['fname'],$row['mname'],$row['lname']);
        	$row['fulladdress'] = Person::fulladdress($row['street'],$row['streetb'],$row['city'],$row['state'],$row['zip']);
        	array_push($rows, $row);
        }
        return array('totals'=>$total,'rows'=>$rows);
    }

    /**
     * @param stdClass $params
     * @return stdClass
     * NOTES: Add contact to who?
     *  Naming: "AddContactToPatient"
     */
    public function addContact(stdClass $params)
    {
        $data = get_object_vars($params);
        $sql = $this->sqlBind($data, "users", "I");
        $this->setSQL($sql);
        $this->execLog();
        $params->id = $this->lastInsertId;
        return $params;
    }


    /**
     * @param stdClass $params
     * @return stdClass
     * NOTES: Update contact address to who?
     * Naming: "updatePatientAddress"
     */
    public function updateAddress(stdClass $params)
    {
        $data = get_object_vars($params);
        unset($data['id'],$data['fullname'],$data['fulladdress']);
        $sql = $this->sqlBind($data, "users", "U", "id='".$params->id."'");
        $this->setSQL($sql);
        $this->execLog();
        $params->fullname    = Person::fullname($params->fname,$params->mname,$params->lname);
        $params->fulladdress = Person::fulladdress($params->street,$params->streetb,$params->city,$params->state,$params->zip);
        return $params;
    }

}

