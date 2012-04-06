<?php
/**
 * @brief       Brief Description
 * @details     Detail Description ...
 *
 * @author      Ernesto J . Rodriguez(Certun) < erodriguez@certun . com >
 * @version     Vega 1.0
 * @copyright   Gnu Public License(GPLv3)
 */
class Test {
    public function getRec(){
        return array(
            array(
                'company' => '3m Co',
                'price' => '71.72',
                'change' => '0.02',
                'pctChange' => '0.03',
                'lastChange' => '9/1 12:00am'
            ),
            array(
                'company' => '3m Co',
                'price' => '71.72',
                'change' => '0.02',
                'pctChange' => '0.03',
                'lastChange' => '9/1 12:00am'
            ),
            array(
                'company' => '3m Co',
                'price' => '71.72',
                'change' => '0.02',
                'pctChange' => '0.03',
                'lastChange' => '9/1 12:00am'
            ),
            array(
                'company' => '3m Co',
                'price' => '71.72',
                'change' => '0.02',
                'pctChange' => '0.03',
                'lastChange' => '9/1 12:00am'
            ),
            array(
                'company' => '3m Co',
                'price' => '71.72',
                'change' => '0.02',
                'pctChange' => '0.03',
                'lastChange' => '9/1 12:00am'
            ),
            array(
                'company' => '3m Co',
                'price' => '71.72',
                'change' => '0.02',
                'pctChange' => '0.03',
                'lastChange' => '9/1 12:00am'
            )
        );
    }

    public function getRec2(){
            return array(
                array(
                    'id' => 1,
                    'company' => '3m Co',
                    'price' => '71.72',
                    'change' => '0.02',
                    'pctChange' => '0.03',
                    'lastChange' => '9/1 12:00am'
                ),
                array(
                    'id' => 2,
                    'company' => '3m Co',
                    'price' => '71.72',
                    'change' => '0.02',
                    'pctChange' => '0.03',
                    'lastChange' => '9/1 12:00am'
                ),
            );
        }

    public function addRec(stdClass $params){

        $params->id = rand(100, 300);

        return $params;
    }
}