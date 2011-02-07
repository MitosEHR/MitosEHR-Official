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
require_once("$srcdir/sql.inc.php");

?>
<?php
/**
 * Retrieve the recent 'N' disclosures.
 * @param $pid   -  patient id.
 * @param $limit -  certain limit up to which the disclosures are to be displyed.
 */
function getDisclosureByDate($pid,$limit)
{
	$r1=sqlStatement("select event,recipient,description,date from extended_log where patient_id=? AND event in (select option_id from list_options where list_id='disclosure_type') order by date desc limit 0,$limit", array($pid) );
	$result2 = array();
	for ($iter = 0;$frow = sqlFetchArray($r1);$iter++)
		$result2[$iter] = $frow;
	return $result2;
}
?>
<div id='pnotes' style='margin-top: 3px; margin-left: 10px; margin-right: 10px'><!--outer div-->
<br>
<table width='100%'>
<?php
//display all the disclosures for the day, as well as others from previous dates, up to a certain number, $N
$N=3;
//$has_variable is set to 1 if there are disclosures recorded.
$has_disclosure=0;
//retrieve all the disclosures.
$result=getDisclosureByDate($pid,$N);
if ($result != null){
	$disclosure_count = 0;//number of disclosures so far displayed
	foreach ($result as $iter)
	{
		$has_disclosure = 1;
		$app_event=$iter{event};
		$event=split("-",$app_event);
		$description=nl2br(htmlspecialchars($iter{"description"},ENT_NOQUOTES));//for line breaks.
		//listing the disclosures 
		echo "<tr style='border-bottom:1px dashed' class='text'>";
			echo "<td valign='top' class='text'>";
			if($event[1]=='healthcareoperations'){ echo "<b>";echo htmlspecialchars(xl('health care operations'),ENT_NOQUOTES);echo "</b>"; } else echo "<b>".htmlspecialchars($event[1],ENT_NOQUOTES)."</b>";
			echo "</td>";
			echo "<td  valign='top'class='text'>";
			echo htmlspecialchars($iter{"date"}." (".xl('Recipient').":".$iter{"recipient"}.")",ENT_NOQUOTES);
	                echo " ".$description;
			echo "</td>";
		echo "</tr>";

	}
}
?>
</table>
<?php
if ( $has_disclosure == 0 ) //If there are no disclosures recorded
{ ?>
	<span class='text'> <?php echo htmlspecialchars(xl("There are no disclosures recorded for this patient."),ENT_NOQUOTES);
	echo " "; echo htmlspecialchars(xl("To record disclosures, please click"),ENT_NOQUOTES); echo " ";echo "<a href='disclosure_full.php'>"; echo htmlspecialchars(xl("here"),ENT_NOQUOTES);echo "</a>."; 
?>
	</span> 
<?php 
} else
{
?> 
	<br />
	<span class='text'> <?php  
	echo htmlspecialchars(xl('Displaying the following number of most recent disclosures:'),ENT_NOQUOTES);?><b><?php echo " ".htmlspecialchars($N,ENT_NOQUOTES);?></b><br>
	<a href='disclosure_full.php'><?php echo htmlspecialchars(xl('Click here to view them all.'),ENT_NOQUOTES);?></a>
	</span><?php
} ?>
<br />
<br />
</div>

