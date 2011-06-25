<?php

$dataTypes = array(
	"1"  => i18n("List box", 'r'), 
	"2"  => i18n("Textbox", 'r'),
	"3"  => i18n("Textarea", 'r'),
	"4"  => i18n("Text-date", 'r'),
	"10" => i18n("Providers", 'r'),
	
	"11" => i18n("Providers NPI", 'r'),
	"12" => i18n("Pharmacies", 'r'),
	"13" => i18n("Squads", 'r'),
	"14" => i18n("Organizations", 'r'),
	"15" => i18n("Billing codes", 'r'),
	
	"21" => i18n("Checkbox list", 'r'),
	"22" => i18n("Textbox list", 'r'),
	"23" => i18n("Exam results", 'r'),
	"24" => i18n("Patient allergies", 'r'),
	"25" => i18n("Checkbox w/text", 'r'),
	"26" => i18n("List box w/add", 'r'),
	"27" => i18n("Radio buttons", 'r'),
	"28" => i18n("Lifestyle status", 'r'),
	
	"31" => i18n("Static Text", 'r'),
	"32" => i18n("Smoking Status", 'r'),
	"33" => i18n("Race and Ethnicity", 'r'),
	"34" => i18n("Line Break", "r")
);
	
//---------------------------------------------------------------------------------------
// dataTypes - Defines what type of fields are.
// This is just a reverse thing, translate the dataTypes into numbers.
//---------------------------------------------------------------------------------------
$dataTypes_Reverse = array(
	i18n("List box", 'r') 			=> "1", 
	i18n("Textbox", 'r') 			=> "2",
	i18n("Textarea", 'r') 			=> "3",
	i18n("Text-date", 'r') 			=> "4",
	
	i18n("Providers", 'r') 			=> "10",
	i18n("Providers NPI", 'r') 		=> "11",
	i18n("Pharmacies", 'r') 		=> "12",
	i18n("Squads", 'r') 			=> "13",
	i18n("Organizations", 'r') 		=> "14",
	i18n("Billing codes", 'r') 		=> "15",
	
	i18n("Checkbox list", 'r') 		=> "21",
	i18n("Textbox list", 'r') 		=> "22",
	i18n("Exam results", 'r') 		=> "23",
	i18n("Patient allergies", 'r') 	=> "24",
	i18n("Checkbox w/text", 'r') 	=> "25",
	i18n("List box w/add", 'r') 	=> "26",
	i18n("Radio buttons", 'r') 		=> "27",
	i18n("Lifestyle status", 'r') 	=> "28",
	
	i18n("Static Text", 'r') 		=> "31",
	i18n("Smoking Status", 'r') 	=> "32",
	i18n("Race and Ethnicity", 'r') => "33",
	i18n("Line Break", "r") 		=> "34"
);

?>