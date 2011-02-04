<?php
// 
// Dentist Dental Chart Form (Primary Tooth, Adult Tooth)
// v0.0.1
// Copyright by IdeasGroup, Inc in 2010
// All rights reserved.
// 

include_once("../../registry.php");
include_once($GLOBALS["srcdir"]."/acl.inc.php");

//****************************************************************************************
// OpenEMR Core :: Call this function to layout the report
//****************************************************************************************
function dentist_teeth_report( $pid, $encounter, $cols, $id) {
    $count = 0;
    $data = formFetch("dentist_teeth", $id);
    if ($data) {
        print "<table><tr>";
        foreach($data as $key => $value) {
            if ($key == "id" || 
                $key == "pid" || 
                $key == "groupname" || 
                $key == "authorized" || 
                $key == "date" || 
                $value == "" || 
                $value == "0000-00-00 00:00:00")
            {
    	        continue;
            }
    
            if ($value == "on") { $value = "yes"; }
    
            $key=ucwords(str_replace("_"," ",$key));
            print("<tr>\n");  
            print("<tr>\n");
	    if ($key == "Child Adult") {
			print "<td><span class=bold>" . xl("Primary or Permanent") . ": </span>";
				switch ($value){
					case 0:
						print "<span class=text>" . xl("Permanent") . "</span></td>";
						break;
					case 1:
						print "<span class=text>" . xl("Primary") . "</span></td>";
						break;
				}
	    }
	    else {
	        print "<td><span class=bold>" . xl($key) . ": </span><span class=text>$value</span></td>";	
	    }
            $count++;
            if ($count == $cols) {
                $count = 0;
                print "</tr><tr>\n";
            }
        }
    }
    print "</tr></table>";
}
?> 
