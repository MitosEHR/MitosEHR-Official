<?php
//--------------------------------------------------------------------------------------------------------------------------
// messages.ejs.php 
// v0.0.3 -> Integrated AJAX
// Under GPLv3 License
// 
// Integration Sencha ExtJS Framework
//
// Integrated by: Ernesto Rodriguez & MitosEHR.org in 2011
// 
//******************************************************
//MitosEHR (Electronic Health Records)
//******************************************************
//MitosEHR is a Open source Web-Based Software for:
//* Practice management
//* Electronic Medical Records
//* Prescription writing and medical billing application
//
//And it can be installed on the following systems:
//* Unix-like systems (Linux, UNIX, and BSD systems)
//* Microsoft systems
//* Mac OS X
//* And other platforms that can run Apache Web server, MySQL
//
//Setup documentation can be found in the INSTALL file,
//and extensive documentation can be found on the
//MitosEHR web site at:
//http://www.mitosehr.org/
//
// Sencha ExtJS
// Ext JS is a cross-browser JavaScript library for building rich internet applications. Build rich,
// sustainable web applications faster than ever. It includes:
// * High performance, customizable UI widgets
// * Well designed and extensible Component model
// * An intuitive, easy to use API
// * Commercial and Open Source licenses available
//--------------------------------------------------------------------------------------------------------------------------

//SANITIZE ALL ESCAPES
$sanitize_all_escapes=true;
//

//STOP FAKE REGISTER GLOBALS
$fake_register_globals=false;
//

 require_once("../../registry.php");
 include_once("$srcdir/sql.inc.php");
 require_once("$srcdir/pnotes.inc.php");
 require_once("$srcdir/acl.inc.php");
 require_once("$srcdir/patient.inc.php");
 require_once("$srcdir/options.inc.php");
 require_once("$srcdir/classes/Document.class.php");
 require_once("$srcdir/formatting.inc.php");
 



 // form parameter docid can be passed to restrict the display to a document.
 // $docid = empty($_REQUEST['docid']) ? 0 : 0 + $_REQUEST['docid'];


    //display all of the notes for the day, as well as others that are active from previous dates, up to a certain number, $N
 //   $N = 3; 

 //     $has_notes = 0;
 //     $thisauth = acl_check('patients', 'notes');
 //     if ($thisauth) {
 //         $tmp = getPatientData($pid, "squad");
 //     if ($tmp['squad'] && ! acl_check('squads', $tmp['squad']))
 //         $thisauth = 0;
 //     }
    //  if (!$thisauth) {
    //      echo "<p>(" . htmlspecialchars(xl('Notes not authorized'),ENT_NOQUOTES) . ")</p>\n";
    //  } else {

    //retrieve all active notes
 //   $result = getPnotesByDate("", 1, "id,date,body,user,title,assigned_to",
 //   $pid, "$N", 0, '', $docid);
 //   if ($result != null) {
    
  

//*********************
// $pid for debuging **
// VVVVVVVVVVVVVVVVV **  
//*********************  
$pid = "1";    


$count = 0;
    $sql = "SELECT
      pnotes.id,
      pnotes.user,
      pnotes.pid,
      pnotes.title,
      pnotes.date,
      pnotes.body,
      pnotes.message_status
    FROM
      pnotes
        WHERE
      pnotes.message_status != 'Done' AND
      pnotes.deleted != '1' AND
      pnotes.pid ='" . $pid . "'";
    $result = sqlStatement($sql);
    while ($row = sqlFetchArray($result)) {
      $count++; 
      $buff .= "{";
      $buff .= " id: '" . htmlspecialchars( $row['id'], ENT_QUOTES) . "',";
      $buff .= " user: '" . htmlspecialchars( $row['user'], ENT_NOQUOTES) . "'," ;
      $buff .= " pid: '" . htmlspecialchars( $row['pid'], ENT_QUOTES) . "',";
      $buff .= " title: '" . htmlspecialchars( $row['title'], ENT_NOQUOTES) . "',";
      $buff .= " date: '" . htmlspecialchars( oeFormatShortDate(substr($row['date'], 0, strpos($row['date'], " "))), ENT_NOQUOTES) . "',";
      $buff .= " body: '" . htmlspecialchars( $row['body'], ENT_QUOTES) . "',";
      $buff .= " message_status: '" . htmlspecialchars( $myrow['message_status'], ENT_NOQUOTES) . "'}," . chr(13);
    }
    $buff = substr($buff, 0, -2); // Delete the last comma.
    echo $_GET['callback'] . '({';
    echo "results: " . $count . ", " . chr(13);
    echo "row: [" . chr(13);
    echo $buff;
    echo "]})" . chr(13);    
?>