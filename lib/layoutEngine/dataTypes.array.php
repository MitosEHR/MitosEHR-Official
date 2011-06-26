<?php

$dataTypes_json = array(
	array("id" 	=> "1", "type" => i18n("List box", 'r')), 				// Done
	array("id" 	=> "2", "type" => i18n("Textbox", 'r')), 				// Done
	array("id" 	=> "3", "type"  => i18n("Textarea", 'r')), 				// Done
	array( "id" 	=> "4", "type"  => i18n("Text-date", 'r')), 		// Done
	
	array("id" 	=> "10", "type"  => i18n("Providers", 'r')), 			// Done
	array("id" 	=> "11", "type"  => i18n("Providers NPI", 'r')), 		// Done
	array("id" 	=> "12", "type"  => i18n("Pharmacies", 'r')), 			// Done
	array("id" 	=> "14", "type"  => i18n("Organizations", 'r')), 		// Done
	array("id" 	=> "15", "type"  => i18n("Billing codes", 'r')),
	
	array("id" 	=> "21", "type"  => i18n("Checkbox list", 'r')), 		// Done
	array("id" 	=> "22", "type"  => i18n("Textbox list", 'r')), 
	array("id" 	=> "23", "type"  => i18n("Exam results", 'r')),
	array("id" 	=> "24", "type"  => i18n("Patient allergies", 'r')), 	// Done
	array("id" 	=> "25", "type"  => i18n("Checkbox w/text", 'r')), 		// Done
	array("id" 	=> "26", "type"  => i18n("List box w/add", 'r')), 		// Done
	array("id" 	=> "27", "type"  => i18n("Radio button", 'r')),
	array("id" 	=> "28", "type"  => i18n("Lifestyle status", 'r')),
	
	array("id" 	=> "31", "type"  => i18n("Static Text", 'r')), 			// Done
	array("id" 	=> "32", "type"  => i18n("Smoking Status", 'r')),
	array("id" 	=> "33", "type"  => i18n("Race and Ethnicity", 'r')),
	array("id" 	=> "34", "type"  => i18n("Line Break", "r"))
);

$dataTypes = array(
	"1"  => i18n("List box", 'r'), 
	"2"  => i18n("Textbox", 'r'),
	"3"  => i18n("Textarea", 'r'),
	"4"  => i18n("Text-date", 'r'),
	
	"10" => i18n("Providers", 'r'),
	"11" => i18n("Providers NPI", 'r'),
	"12" => i18n("Pharmacies", 'r'),
	"14" => i18n("Organizations", 'r'),
	"15" => i18n("Billing codes", 'r'),
	
	"21" => i18n("Checkbox list", 'r'),
	"22" => i18n("Textbox list", 'r'),
	"23" => i18n("Exam results", 'r'),
	"24" => i18n("Patient allergies", 'r'),
	"25" => i18n("Checkbox w/text", 'r'),
	"26" => i18n("List box w/add", 'r'),
	"27" => i18n("Radio button", 'r'),
	"28" => i18n("Lifestyle status", 'r'),
	
	"31" => i18n("Static Text", 'r'),
	"32" => i18n("Smoking Status", 'r'),
	"33" => i18n("Race and Ethnicity", 'r'),
	"34" => i18n("Line Break", "r")
);
	
//---------------------------------------------------------------------------------------
// dataTypes_Reverse - Defines what type of fields are.
// This is just a reverse thing, translate the dataTypes back into numbers.
//---------------------------------------------------------------------------------------
$dataTypes_Reverse = array(
	i18n("List box", 'r') 			=> "1", 
	i18n("Textbox", 'r') 			=> "2",
	i18n("Textarea", 'r') 			=> "3",
	i18n("Text-date", 'r') 			=> "4",
	
	i18n("Providers", 'r') 			=> "10",
	i18n("Providers NPI", 'r') 		=> "11",
	i18n("Pharmacies", 'r') 		=> "12",
	i18n("Organizations", 'r') 		=> "14",
	i18n("Billing codes", 'r') 		=> "15",
	
	i18n("Checkbox list", 'r') 		=> "21",
	i18n("Textbox list", 'r') 		=> "22",
	i18n("Exam results", 'r') 		=> "23",
	i18n("Patient allergies", 'r') 	=> "24",
	i18n("Checkbox w/text", 'r') 	=> "25",
	i18n("List box w/add", 'r') 	=> "26",
	i18n("Radio button", 'r') 		=> "27",
	i18n("Lifestyle status", 'r') 	=> "28",
	
	i18n("Static Text", 'r') 		=> "31",
	i18n("Smoking Status", 'r') 	=> "32",
	i18n("Race and Ethnicity", 'r') => "33",
	i18n("Line Break", "r") 		=> "34"
);

?>