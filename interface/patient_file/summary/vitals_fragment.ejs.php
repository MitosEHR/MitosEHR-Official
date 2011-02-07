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

?>
<div id='vitals' style='margin-top: 3px; margin-left: 10px; margin-right: 10px'><!--outer div-->
<br>
<?php
//retrieve most recent set of vitals.
$result=sqlQuery("SELECT date, id FROM form_vitals WHERE pid=? ORDER BY date DESC", array($pid) );
    
if ( !$result ) //If there are no disclosures recorded
{ ?>
  <span class='text'> <?php echo htmlspecialchars(xl("No vitals have been documented."),ENT_NOQUOTES); 
?>
  </span> 
<?php 
} else
{
?> 
  <span class='text'><b>
  <?php echo htmlspecialchars(xl('Most recent vitals from:')." ".$result['date'],ENT_NOQUOTES); ?>
  </b></span>
  <br />
  <br />
  <?php include_once($GLOBALS['incdir'] . "/forms/vitals/report.php");
  call_user_func("vitals_report", '', '', 2, $result['id']);
  ?>  <span class='text'>
  <br />
  <a href='../encounter/trend_form.php?formname=vitals' onclick='top.restoreSession()'><?php echo htmlspecialchars(xl('Click here to view and graph all vitals.'),ENT_NOQUOTES);?></a>
  </span><?php
} ?>
<br />
<br />
</div>
