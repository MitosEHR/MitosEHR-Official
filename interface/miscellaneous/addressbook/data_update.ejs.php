<?php
//--------------------------------------------------------------------------------------------------------------------------
// data_create.ejs.php
// v0.0.2
// Under GPLv3 License
//
// Integrated by: Ernesto Rodriguez in 2011
//
// Remember, this file is called via the Framework Store, this is the AJAX thing.
//--------------------------------------------------------------------------------------------------------------------------

// *************************************************************************************
//SANITIZE ALL ESCAPES
// *************************************************************************************
$sanitize_all_escapes=true;

// *************************************************************************************
//STOP FAKE REGISTER GLOBALS
// *************************************************************************************
$fake_register_globals=false;

// *************************************************************************************
// Load the OpenEMR Libraries
// *************************************************************************************
require_once("../../registry.php");
require_once("../../../repository/dataExchange/dataExchange.inc.php");

// *************************************************************************************
// Parce the data generated by EXTJS witch is JSON
// *************************************************************************************
$data = json_decode ( $_POST['row'] );

// *************************************************************************************
// Validate and pass the POST variables to an array
// This is the moment to validate the entered values from the user
// although Sencha EXTJS make good validation, we could check again 
// just in case 
// *************************************************************************************
$row['id'] = trim($data[0]->id);

// general info
$row['fname']             = dataEncode($data[0]->fname);
$row['mname']             = dataEncode($data[0]->mname);
$row['lname']             = dataEncode($data[0]->lname);
$row['specialty']         = dataEncode($data[0]->specialty);
$row['organization']      = dataEncode($data[0]->organization);
$row['valedictory']       = dataEncode($data[0]->valedictory);
// primary address
$row['street']            = dataEncode($data[0]->street);
$row['streetb']           = dataEncode($data[0]->streetb);
$row['city']              = dataEncode($data[0]->city);
$row['state']             = dataEncode($data[0]->state);
$row['zip']               = dataEncode($data[0]->zip);
// secondary address
$row['street2']           = dataEncode($data[0]->street2);
$row['streetb2']          = dataEncode($data[0]->streetb2);
$row['city2']             = dataEncode($data[0]->city2);
$row['state2']            = dataEncode($data[0]->state2);
$row['zip2']              = dataEncode($data[0]->zip2);
// phones
$row['phone']             = dataEncode($data[0]->phone);
$row['phonew1']           = dataEncode($data[0]->phonew1);
$row['phonew2']           = dataEncode($data[0]->phonew2);
$row['phonecell']         = dataEncode($data[0]->phonecell);
$row['fax']               = dataEncode($data[0]->fax);
//additional info
$row['email']             = dataEncode($data[0]->email);
$row['assistant']         = dataEncode($data[0]->assistant);
$row['url']               = dataEncode($data[0]->url);

$row['upin']              = dataEncode($data[0]->upin);
$row['npi']               = dataEncode($data[0]->npi);
$row['federaltaxid']      = dataEncode($data[0]->federaltaxid);
$row['taxonomy']          = dataEncode($data[0]->taxonomy);
$row['notes']             = dataEncode($data[0]->notes);

// *************************************************************************************
// Finally that validated POST variables is inserted to the database
// This one make the JOB of two, if it has an ID key run the UPDATE statement
// if not run the INSERT stament
// *************************************************************************************
sqlStatement("UPDATE 
        users 
      SET
        id                = '" . $row['id'] . "', " . "
        fname             = '" . $row['fname'] . "', " . "
        mname             = '" . $row['mname'] . "', " . "
        lname             = '" . $row['lname'] . "', " . "
        specialty         = '" . $row['specialty'] . "', " . "
        organization      = '" . $row['organization'] . "', " . "
        valedictory       = '" . $row['valedictory'] . "', " . "
        street            = '" . $row['street'] . "', " . "
        streetb           = '" . $row['streetb'] . "', " . "
        city              = '" . $row['city'] . "', " . "
        state             = '" . $row['state'] . "', " . "
        zip               = '" . $row['zip'] . "', " . "
        street2           = '" . $row['street2'] . "', " . "
        streetb2          = '" . $row['streetb2'] . "', " . "
        city2             = '" . $row['city2'] . "', " . "
        state2            = '" . $row['state2'] . "', " . "
        zip2              = '" . $row['zip2'] . "', " . "
        phone             = '" . $row['phone'] . "', " . "
        phonew1           = '" . $row['phonew1'] . "', " . "
        phonew2           = '" . $row['phonew2'] . "', " . "
        phonecell         = '" . $row['phonecell'] . "', " . "
        fax               = '" . $row['fax'] . "', " . "
        email             = '" . $row['email'] . "', " . "
        assistant         = '" . $row['assistant'] . "', " . "
        url               = '" . $row['url'] . "', " . "
        upin              = '" . $row['upin'] . "', " . "
        npi               = '" . $row['npi'] . "', " . "
        federaltaxid      = '" . $row['federaltaxid'] . "', " . "
        taxonomy          = '" . $row['taxonomy'] . "', " . "
        notes             = '" . $row['notes'] . "' " . " 
      WHERE 
        id ='" . $row['id'] . "'");

?>