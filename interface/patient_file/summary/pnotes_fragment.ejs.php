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
 require_once("$srcdir/pnotes.inc.php");
 require_once("$srcdir/acl.inc.php");
 require_once("$srcdir/patient.inc.php");
 require_once("$srcdir/options.inc.php");
 require_once("$srcdir/classes/Document.class.php");
 require_once("$srcdir/formatting.inc.php");

 // form parameter docid can be passed to restrict the display to a document.
 // $docid = empty($_REQUEST['docid']) ? 0 : 0 + $_REQUEST['docid'];


    //display all of the notes for the day, as well as others that are active from previous dates, up to a certain number, $N
    $N = 3; 

      $has_notes = 0;
      $thisauth = acl_check('patients', 'notes');
      if ($thisauth) {
          $tmp = getPatientData($pid, "squad");
      if ($tmp['squad'] && ! acl_check('squads', $tmp['squad']))
          $thisauth = 0;
      }
    //  if (!$thisauth) {
    //      echo "<p>(" . htmlspecialchars(xl('Notes not authorized'),ENT_NOQUOTES) . ")</p>\n";
    //  } else {

    //retrieve all active notes
    $result = getPnotesByDate("", 1, "id,date,body,user,title,assigned_to",
    $pid, "$N", 0, '', $docid);
    if ($result != null) {
    $count = mysql_num_rows($result);
    while ($row = sqlFetchArray($result)) {
      $buff .= "{
             id: '" . htmlspecialchars( $row["id"], ENT_NOQUOTES) . "'," .
            "date: '" . $row['date'] . "'," .
            "body: '" . htmlspecialchars( $row["body"], ENT_NOQUOTES) . "'," .
            "user: '" . htmlspecialchars( $row["user"], ENT_NOQUOTES) . "'," .
            "title: '" . htmlspecialchars( $row["title"], ENT_NOQUOTES) . "'," .
            "assigned_to: '" . htmlspecialchars( $row["assigned_to"], ENT_NOQUOTES) . "'},". chr(13);
    }
    $buff = substr($buff, 0, -2); // Delete the last comma.
    echo $_GET['callback'] . '({';
    echo "results: " . $count . ", " . chr(13);
    echo "row: [" . chr(13);
    echo $buff;
    echo "]})" . chr(13);
    };
    
     
   //         ******* to be remove  **********
   //
   //         echo htmlspecialchars(xl( "There are no notes on file for this patient."),ENT_NOQUOTES);
   //         echo " ";
	 //         echo htmlspecialchars(xl("To add notes, please click "),ENT_NOQUOTES);
	 //         echo "<a href='pnotes_full.php'>";
	 //         echo htmlspecialchars(xl("here"),ENT_NOQUOTES);
	 //         echo "</a>."; 
	 //         echo htmlspecialchars(xl('Displaying the following number of most recent notes:'),ENT_NOQUOTES);
	 //         echo htmlspecialchars(xl('Click here to view them all.'),ENT_NOQUOTES); 
	    
?>