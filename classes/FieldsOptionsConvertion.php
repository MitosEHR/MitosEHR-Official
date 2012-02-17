<?php
if (!isset($_SESSION)) {
    session_name("MitosEHR");
    session_start();
    session_cache_limiter('private');
}
include_once('dbhelper.php');
/**
 * @brief       Brief Description
 * @details     Detail Description ...
 *
 * @author      Ernesto J . Rodriguez(Certun) < erodriguez@certun . com >
 * @version     Vega 1.0
 * @copyright   Gnu Public License(GPLv3)
 */
class FieldsOptionsConvertion extends dbHelper
{

    public function convert(){

        $row = array();

        $sql = ("SELECT DISTINCT field_id  FROM forms_field_options ORDER BY field_id");
        $this->setSQL($sql);
        $fields = $this->execStatement(PDO::FETCH_ASSOC);


        foreach($fields as $field){

            $foo = array();

            $sql = ("SELECT oname, ovalue  FROM forms_field_options ORDER BY field_id");
            $this->setSQL($sql);
            $options = $this->execStatement(PDO::FETCH_ASSOC);

            foreach($options as $option){

                $foo[] = array($option['oname']=>$option['ovalue']);

            }

            $row[] = array('field_id'=>$field['field_id'],'data'=>json_encode($foo));
        }

        return print_r($row);
    }

}

$o = new FieldsOptionsConvertion();
echo '<pre>';
$o->convert();