<?php

//********************************************************************
// ANSI X12 Utilities
// v0.0.1
//
// Description: This is one of many ANSI X12 Compliance Utilities
// to manage ANSI X12 Documents (4010 & 5010)
//
// Author: Gino Rivera Falú
// Created Date: 23/4/2011
//
// Companies:
// GI Technologies, Inc.
//********************************************************************

class x12valid_4010A {
	
	private $temp_buff;
	private $chr_div;
	private $reason;
	
	//-------------------------------------------------------
	// Copy the x12 data to the temporary buffer.
	//-------------------------------------------------------
	function setX12($x12){
		$this->temp_buff = $x12;
		$x12_array = explode("~", $this->temp_buff); // Break the document into a array
		$s = explode("*", $x12_array[0]); 
		$this->chr_div = $s[16]; // Extract the character separator
	}
	
	function getReason(){
		return $this->reason;
	}
	
	//-------------------------------------------------------
	// Validate a ANSI x12 version 4010A
	//-------------------------------------------------------
	function valid4010A(){
		$x12_array = explode("~", $this->temp_buff); // Break the document into a array
		
		// check for a ISA valid document
		$v = explode("*", $x12_array[0]);
		if( $v[0] <> "ISA" ){ $this->reason = "ISA - First BYTES"; return FALSE; } // First BYTES
		if( $v[1] <> "00" ){ $this->reason = "ISA - Authorization Information Qualifier"; return FALSE; } // Authorization Information Qualifier
		if( strlen($v[2]) <= 9 && strlen($v[2]) >= 11 ){ $this->reason = "ISA - Authorization Information Size"; return FALSE; } // Authorization Information
		if( $v[3] <> "00" ){ $this->reason = "ISA - Security Information Qualifier"; return FALSE; } // Security Information Qualifier
		if( strlen($v[4]) <= 9 && strlen($v[4]) >= 11 ){ $this->reason = "ISA - Security Information"; return FALSE; } // Security Information
		if( is_int($v[5]) ){ $this->reason = "ISA - Interchange ID Qualifier"; return FALSE; } // Interchange ID Qualifier
		if( strlen($v[6]) <= 14 && strlen($v[6]) >= 16 ){ $this->reason = "ISA - Interchange Sender ID"; return FALSE; } // Interchange Sender ID
		if( strlen($v[8]) <= 14 && strlen($v[8]) >= 16 ){ $this->reason = "ISA - Interchange Receiver ID"; return FALSE; } // Interchange Receiver ID
		if( strlen($v[9]) <= 6 && strlen($v[9]) >= 7 ){ $this->reason = "ISA - Interchange Date"; return FALSE; } // Interchange Date
		if( strlen($v[10]) <= 3 && strlen($v[10]) >= 5 ){ $this->reason = "ISA - Interchange Time"; return FALSE; } // Interchange Time
		if( $v[11] <> "U" ){ $this->reason = "ISA - Interchange Control Standards Identifier"; return FALSE; } // Interchange Control Standards Identifier
		if( $v[12] <> "00401" ){ $this->reason = "ISA - Interchange Control Version Number"; return FALSE; } // Interchange Control Version Number
		if( strlen($v[13]) <= 8 && strlen($v[13]) >= 10 ){ $this->reason = "ISA - Interchange Control Number"; return FALSE; } // Interchange Control Number
		if( $v[14] <> "0" && $v[14] <> "1" ){ $this->reason = "ISA - Acknowledgement Requested"; return FALSE; } // Acknowledgement Requested
		if( $v[15] <> "T" && $v[15] <> "P" ){ $this->reason = "ISA - Usage Indicator"; return FALSE; } // Usage Indicator
		if( strlen($v[16]) <= 0 && strlen($v[16]) >= 2 ){ $this->reason = "ISA - Component Element Separator"; return FALSE; } // Component Element Separator
		
		// GS segment specifications
		$v = explode("*", $x12_array[1]);
		if( $v[0] <> "GS" ){ $this->reason = "GS - First BYTES"; return FALSE; } // First BYTES
		if( $v[1] <> "HC" ){ $this->reason = "GS - Functional Identifier Code"; return FALSE; } // Functional Identifier Code
		if( strlen($v[2]) <= 1 && strlen($v[2]) >= 16 ){ $this->reason = "GS - Application Sender's Code"; return FALSE; } // Application Sender's Code
		if( strlen($v[3]) <= 1 && strlen($v[3]) >= 16 ){ $this->reason = "GS - Application Receiver's Code"; return FALSE; } // Application Receiver's Code
		if( strlen($v[4]) <= 7 && strlen($v[4]) >= 8 ){ $this->reason = "GS - Date"; return FALSE; } // Date
		if( strlen($v[5]) <= 3 && strlen($v[5]) >= 9 ){ $this->reason = "GS - Time"; return FALSE; } // Time
		if( is_int($v[6]) ){ $this->reason = "GS - Group Control Number"; return FALSE; } // Group Control Number
		if( strlen($v[7]) <= 0 && strlen($v[7]) >= 3 ){ $this->reason = "GS - Responsible Agency Code"; return FALSE; } // Responsible Agency Code
		if( $v[8] <> "004010X098A1" ){ $this->reason = "GS - Version/Release/Industry Identifier Code"; return FALSE; } // Version/Release/Industry Identifier Code
		
		// ST segment specifications
		$v = explode("*", $x12_array[2]);
		if( $v[0] <> "ST" ){ $this->reason = "ST - First BYTES"; return FALSE; } // First BYTES
		if( $v[1] <> "837" ){ $this->reason = "ST - Transaction Set Identifier Code"; return FALSE; } // Transaction Set Identifier Code
		if( !strlen($v[2]) ){ $this->reason = "ST - Transaction Set Control Number : " . $v[2]; return FALSE; } // Transaction Set Control Number
		
		// FCHP-specific requirements - BHT
		$v = explode("*", $x12_array[3]);
		if( $v[0] <> "BHT" ){ $this->reason = "BHT - First BYTES"; return FALSE; } // First BYTES
		if( $v[1] <> "0019" ){ $this->reason = "BHT - Hierarchical Structure Code"; return FALSE; } // Hierarchical Structure Code
		if( $v[2] <> "00" ){ $this->reason = "BHT - Transaction Set Purpose Code"; return FALSE; } // Transaction Set Purpose Code
		if( !strlen($v[3]) ){ $this->reason = "BHT - Originator Application Transaction Identifier : " . $v[3]; return FALSE; } // Originator Application Transaction Identifier
		if( strlen($v[4]) <= 7 && strlen($v[4]) >= 9 ){ $this->reason = "BHT - Transaction Set Creation Date"; return FALSE; } // Transaction Set Creation Date
		if( strlen($v[5]) <= 3 && strlen($v[5]) >= 9 ){ $this->reason = "BHT - Transaction Set Creation Time"; return FALSE; } // Transaction Set Creation Time
		if( $v[6] <> "CH" ){ $this->reason = "BHT - Claim or Encounter Identifier : " . $v[6]; return FALSE; }// Claim or Encounter Identifier
		
		// Transmission Type Identification - REF
		$v = explode("*", $x12_array[4]);
		if( $v[0] <> "REF" ){ $this->reason = "REF87 - First BYTES"; return FALSE; } // First BYTES
		if( $v[1] <> "87" ){ $this->reason = "REF87 - Reference Identification Qualifier"; return FALSE; } // Reference Identification Qualifier
		if( substr($v[2], 0, 10) <> "004010X098" ){ $this->reason = "REF87 - Transmission Type Code"; return FALSE; } // Transmission Type Code
		
		
		// Submitter Name
		$v = explode("*", $x12_array[5]);
		if( $v[0] <> "NM1" ){ $this->reason = "NM1 41 - First BYTES"; return FALSE; } // First BYTES
		if( $v[1] <> "41" ){ $this->reason = "NM1 41 - Entity Identifier Code : " . $v[1]; return FALSE; } // Entity Identifier Code
		if( is_int($v[2]) ){ $this->reason = "NM1 41 - Entity Type Qualifier"; return FALSE; } // Entity Type Qualifier
		if( strlen($v[3]) <= 3 ){ $this->reason = "NM1 41 - Submitter Last or Organization Name"; return FALSE; } // Submitter Last or Organization Name
		if( $v[8] <> "46" ){ $this->reason = "NM1 41 - Submitter Last or Organization Name"; return FALSE; }// Identification Code Qualifier
		if( strlen($v[9]) <= 3 ){ $this->reason = "NM1 41 - Submitter TIN"; return FALSE; } // Submitter TIN
		
		// Submitter EDI Contact Information
		$v = explode("*", $x12_array[6]);
		if( $v[0] <> "PER" ){ $this->reason = "PER IC - First BYTES"; return FALSE; } // First BYTES
		if( $v[1] <> "IC" ){ $this->reason = "PER IC - Contact Function Code"; return FALSE; } // Contact Function Code
		if( strlen($v[2]) <= 3 ){ $this->reason = "PER IC - Submitter Contact Name"; return FALSE; } // Submitter Contact Name
		if( strlen($v[3]) < 2 ){ $this->reason = "PER IC - Communication Number Qualifier"; return FALSE; } // Communication Number Qualifier
		if( strlen($v[4]) <= 9 ){ $this->reason = "PER IC - Communication Number"; return FALSE; } // Communication Number - Telephone Number
		
		// Receiver Name
		$v = explode("*", $x12_array[7]);
		if( $v[0] <> "NM1" ){ $this->reason = "NM1 40 - First BYTES"; return FALSE; } // Receiver Name
		if( $v[1] <> "40" ){ $this->reason = "NM1 40 - Entity Identifier Code"; return FALSE; } // Entity Identifier Code
		if( $v[2] <> "2" ){ $this->reason = "NM1 40 - Entity Type Qualifier"; return FALSE; } // Entity Type Qualifier
		if( strlen($v[3]) <= 3 ){ $this->reason = "NM1 40 - Receiver Name"; return FALSE; } // Receiver Name
		if( $v[8] == "" ){ $this->reason = "NM1 40 - Identification Code Qualifier"; return FALSE; } // Identification Code Qualifier
		if( $v[9] == "" ){ $this->reason = "NM1 40 - Receiver Primary Identifier"; return FALSE; } // Receiver Primary Identifier
		
		// Billing/Pay-to Provider Hierarchical Level
		
		
		// The document is perfect!
		return TRUE;
	}

	function tmpShow(){
		$x12_array = explode("~", $this->temp_buff); // Break the document into a array
		
		echo "<pre>";
		print_r($x12_array);
		echo "</pre>";		
	}

}
	
?>