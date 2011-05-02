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
	
	//-------------------------------------------------------
	// getReason : Get the error why the x12 failed.
	//-------------------------------------------------------
	function getReason(){
		return $this->reason;
	}
	
	//-------------------------------------------------------
	// Validate a ANSI x12 version 4010A
	//-------------------------------------------------------
	function valid4010A(){
		
		$line = 0;
		
		$x12_array = explode("~", $this->temp_buff); // Break the document into a array
		
		// check for a ISA valid document
		$v = explode("*", $x12_array[$line]);
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
		$line++;
		$v = explode("*", $x12_array[$line]);
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
		$line++;
		$v = explode("*", $x12_array[$line]);
		if( $v[0] <> "ST" ){ $this->reason = "ST - First BYTES"; return FALSE; } // First BYTES
		if( $v[1] <> "837" ){ $this->reason = "ST - Transaction Set Identifier Code"; return FALSE; } // Transaction Set Identifier Code
		if( !strlen($v[2]) ){ $this->reason = "ST - Transaction Set Control Number : " . $v[2]; return FALSE; } // Transaction Set Control Number
		
		// FCHP-specific requirements - BHT
		$line++;
		$v = explode("*", $x12_array[$line]);
		if( $v[0] <> "BHT" ){ $this->reason = "BHT - First BYTES"; return FALSE; } // First BYTES
		if( $v[1] <> "0019" ){ $this->reason = "BHT - Hierarchical Structure Code"; return FALSE; } // Hierarchical Structure Code
		if( $v[2] <> "00" ){ $this->reason = "BHT - Transaction Set Purpose Code"; return FALSE; } // Transaction Set Purpose Code
		if( !strlen($v[3]) ){ $this->reason = "BHT - Originator Application Transaction Identifier : " . $v[3]; return FALSE; } // Originator Application Transaction Identifier
		if( strlen($v[4]) <= 7 && strlen($v[4]) >= 9 ){ $this->reason = "BHT - Transaction Set Creation Date"; return FALSE; } // Transaction Set Creation Date
		if( strlen($v[5]) <= 3 && strlen($v[5]) >= 9 ){ $this->reason = "BHT - Transaction Set Creation Time"; return FALSE; } // Transaction Set Creation Time
		if( $v[6] <> "CH" ){ $this->reason = "BHT - Claim or Encounter Identifier : " . $v[6]; return FALSE; }// Claim or Encounter Identifier
		
		// Transmission Type Identification - REF
		$line++;
		$v = explode("*", $x12_array[$line]);
		if( $v[0] <> "REF" ){ $this->reason = "REF87 - First BYTES"; return FALSE; } // First BYTES
		if( $v[1] <> "87" ){ $this->reason = "REF87 - Reference Identification Qualifier"; return FALSE; } // Reference Identification Qualifier
		if( substr($v[2], 0, 10) <> "004010X098" ){ $this->reason = "REF87 - Transmission Type Code"; return FALSE; } // Transmission Type Code
		
		
		// Submitter Name
		$line++;
		$v = explode("*", $x12_array[$line]);
		if( $v[0] <> "NM1" ){ $this->reason = "NM1 41 - First BYTES"; return FALSE; } // First BYTES
		if( $v[1] <> "41" ){ $this->reason = "NM1 41 - Entity Identifier Code : " . $v[1]; return FALSE; } // Entity Identifier Code
		if( is_int($v[2]) ){ $this->reason = "NM1 41 - Entity Type Qualifier"; return FALSE; } // Entity Type Qualifier
		if( strlen($v[3]) <= 3 ){ $this->reason = "NM1 41 - Submitter Last or Organization Name"; return FALSE; } // Submitter Last or Organization Name
		if( $v[8] <> "46" ){ $this->reason = "NM1 41 - Submitter Last or Organization Name"; return FALSE; }// Identification Code Qualifier
		if( strlen($v[9]) <= 3 ){ $this->reason = "NM1 41 - Submitter TIN"; return FALSE; } // Submitter TIN
		
		// Submitter EDI Contact Information
		$line++;
		$v = explode("*", $x12_array[$line]);
		if( $v[0] <> "PER" ){ $this->reason = "PER IC - First BYTES"; return FALSE; } // First BYTES
		if( $v[1] <> "IC" ){ $this->reason = "PER IC - Contact Function Code"; return FALSE; } // Contact Function Code
		if( strlen($v[2]) <= 3 ){ $this->reason = "PER IC - Submitter Contact Name"; return FALSE; } // Submitter Contact Name
		if( strlen($v[3]) < 2 ){ $this->reason = "PER IC - Communication Number Qualifier"; return FALSE; } // Communication Number Qualifier
		if( strlen($v[4]) <= 9 ){ $this->reason = "PER IC - Communication Number"; return FALSE; } // Communication Number - Telephone Number
		
		// Receiver Name
		$line++;
		$v = explode("*", $x12_array[$line]);
		if( $v[0] <> "NM1" ){ $this->reason = "NM1 40 Receiver Name - First BYTES"; return FALSE; } // Receiver Name
		if( $v[1] <> "40" ){ $this->reason = "NM1 40 Receiver Name - Entity Identifier Code"; return FALSE; } // Entity Identifier Code
		if( $v[2] <> "2" ){ $this->reason = "NM1 40 Receiver Name - Entity Type Qualifier"; return FALSE; } // Entity Type Qualifier
		if( strlen($v[3]) <= 3 ){ $this->reason = "NM1 40 Receiver Name - Receiver Name"; return FALSE; } // Receiver Name
		if( $v[8] == "" ){ $this->reason = "NM1 40 Receiver Name - Identification Code Qualifier"; return FALSE; } // Identification Code Qualifier
		if( $v[9] == "" ){ $this->reason = "NM1 40 Receiver Name - Receiver Primary Identifier"; return FALSE; } // Receiver Primary Identifier
		
		// Billing/Pay-to Provider Hierarchical Level
		$line++;
		$v = explode("*", $x12_array[$line]);
		if( $v[0] <> "HL" ){ $this->reason = "HL Billing/Pay-to Provider Hierarchical Level - First BYTES"; return FALSE; } // Billing/Pay-to Provider Hierarchical Level
		if( is_int($v[1]) ){ $this->reason = "HL Billing/Pay-to Provider Hierarchical Level - Hierarchical ID Number"; return FALSE; } // Hierarchical ID Number
		if( is_int($v[3]) ){ $this->reason = "HL Billing/Pay-to Provider Hierarchical Level - Hierarchical Level Code"; return FALSE; } // Hierarchical Level Code
		if( is_int($v[4]) ){ $this->reason = "HL Billing/Pay-to Provider Hierarchical Level - Hierarchical Child Code"; return FALSE; } // Hierarchical Child Code
		
		// Billing/Pay-to Provider Specialty Information
		// NOT MANDATORY
		$line++;
		$v = explode("*", $x12_array[$line]);
		if( $v[0] == "PRV" ){ // Billing/Pay-to Provider Specialty Information
			if( strlen($v[1]) <= 1 ){ $this->reason = "PRV Billing/Pay-to Provider Specialty Information - Provider Code"; return FALSE; } // Provider Code
			if( strlen($v[2]) <= 1 ){ $this->reason = "PRV Billing/Pay-to Provider Specialty Information - Reference Identification Qualifier"; return FALSE; } // Reference Identification Qualifier
			if( strlen($v[3]) <= 1 ){ $this->reason = "PRV Billing/Pay-to Provider Specialty Information - Reference Identification"; return FALSE; } // Reference Identification
		} else {
			$line--;
		}
		
		// Foreign Currency Information
		// NOT MANDATORY
		$line++;
		$v = explode("*", $x12_array[$line]);
		if( $v[0] <> "CUR" ){ $line--; } else { // Billing/Pay-to Provider Specialty Information
			if( strlen($v[1]) <= 1 ){ $this->reason = "PRV Foreign Currency Information - Entity Identifier Code"; return FALSE; } // Entity Identifier Code
			if( strlen($v[2]) <= 1 ){ $this->reason = "PRV Foreign Currency Information - Currency Code"; return FALSE; } // Currency Code
		}
		
		// Billing Provider Name
		$line++;
		$v = explode("*", $x12_array[$line]);
		if( $v[0] <> "NM1" ){ $this->reason = "MN1 85 Billing Provider Name - First BYTES"; return FALSE; } // Billing Provider Name 
		if( $v[1] <> "85" ){ $this->reason = "NM1 85 Billing Provider Name - Entity Identifier Code"; return FALSE; } // Entity Identifier Code
		if( $v[2] == "1" && $v[2] == "2" ){ $this->reason = "NM1 85 Billing Provider Name - Entity Type Qualifier"; return FALSE; } // Entity Type Qualifier
		if( strlen($v[3]) <= 3 ){ $this->reason = "NM1 85 Billing Provider Name - Name Last or Organization Name"; return FALSE; } // Name Last or Organization Name
		if( $v[8] == "" ){ $this->reason = "NM1 85 Billing Provider Name - Identification Code Qualifier"; return FALSE; } // Identification Code Qualifier
		if( $v[9] == "" ){ $this->reason = "NM1 85 Billing Provider Name - Identification Code"; return FALSE; } // Identification Code
		
		// Billing Provider Address
		$line++;
		$v = explode("*", $x12_array[$line]);
		if( $v[0] <> "N3" ){ $this->reason = "N3 Billing Provider Address - First BYTES"; return FALSE; } // Billing Provider Address
		if( strlen($v[1]) <= 5 ){ $this->reason = "N3 Billing Provider Address - Address Information 1"; return FALSE; } // Address Information 1

		// Billing Provider City/State/ZIP Code
		$line++;
		$v = explode("*", $x12_array[$line]);
		if( $v[0] != "N4" ){ $this->reason = "N4 Billing Provider City/State/ZIP Code - First BYTES"; return FALSE; } // Billing Provider Address
		if( strlen($v[1]) <= 4 ){ $this->reason = "N4 Billing Provider City/State/ZIP Code - City Name"; return FALSE; } // City Name
		if( strlen($v[2]) <= 1 ){ $this->reason = "N4 Billing Provider City/State/ZIP Code - State or Province Code"; return FALSE; } // State or Province Code
		if( strlen($v[3]) <= 3 ){ $this->reason = "N4 Billing Provider City/State/ZIP Code - Postal Code"; return FALSE; } // Postal Code
		
		// Billing Provider Secondary Identification
		// NOT MANDATORY
		$line++;
		$v = explode("*", $x12_array[$line]);
		if( $v[0]=="REF" && $v[1]=="SY" ){ // Billing/Pay-to Provider Specialty Information
			if( strlen($v[1]) <= 1 ){ $this->reason = "REF SY Billing Provider Secondary Identification - Reference Identification Qualifier"; return FALSE; } // Reference Identification Qualifier
			if( strlen($v[2]) <= 3 ){ $this->reason = "REF SY Billing Provider Secondary Identification - Reference Identification"; return FALSE; } // Reference Identification
		} else {
			$line--;
		}
		
		// Billing Provider Secondary Identification
		// NOT MANDATORY
		$line++;
		$v = explode("*", $x12_array[$line]);
		if( $v[0]=="REF" &&$v[1]=="G2" ){ // Billing/Pay-to Provider Specialty Information
			if( $v[1] != "G2" ){ $this->reason = "REF G2 Billing Provider Secondary Identification - Reference Identification Qualifier"; return FALSE; } // Reference Identification Qualifier
			if( strlen($v[2]) <= 4 ){ $this->reason = "REF G2 Billing Provider Secondary Identification - Reference Identification"; return FALSE; } // Reference Identification
		} else {
			$line--;
		}
		
		// Credit/Debit Card Billing Information
		// NOT MANDATORY
		$line++;
		$v = explode("*", $x12_array[$line]);
		if( $v[0] == "REF" ){ // Credit/Debit Card Billing Information
			if( $v[1] == "" ){ $this->reason = "REF Credit/Debit Card Billing Information"; return FALSE; } // Credit/Debit Card Billing Information
			if( strlen($v[2]) <= 2 ){ $this->reason = "REF Credit/Debit Card Billing Information - Reference Identification"; return FALSE; } // Reference Identification
		} else {
			$line--;
		}

		// Billing Provider Contact Information
		// NOT MANDATORY
		$line++;
		$v = explode("*", $x12_array[$line]);
		if( $v[0] == "PER" ){ // Billing Provider Contact Information
			if( $v[1] == "" ){ $this->reason = "PER Billing Provider Contact Information - Contact Function Code"; return FALSE; } // Contact Function Code
			if( strlen($v[2]) <= 4 ){ $this->reason = "PER Billing Provider Contact Information - Name"; return FALSE; } // Name
			if( strlen($v[3]) <= 4 ){ $this->reason = "PER Billing Provider Contact Information - Communication Number Qualifier"; return FALSE; } // Communication Number Qualifier
			if( strlen($v[4]) <= 4 ){ $this->reason = "PER Billing Provider Contact Information - Communication Number"; return FALSE; } // Communication Number
		} else {
			$line--;
		}
		
		// Pay-to Provider Name
		// NOT MANDATORY
		$line++;
		$v = explode("*", $x12_array[$line]);
		if( $v[0] == "NM1" ){ // Pay-to Provider Name
			if( $v[1] == "87" ){ $this->reason = "NM187 - Entity Identifier Code"; return FALSE; } // Entity Identifier Code
			if( $v[2] <> "1" && $v[2] <> "2" ){ $this->reason = "NM187 - Entity Type Qualifier"; return FALSE; } // Entity Type Qualifier
			if( strlen($v[3]) <= 4 ){ $this->reason = "NM187 - Name Last or Organization Name"; return FALSE; } // Name Last or Organization Name
			if( strlen($v[8]) <= 1 ){ $this->reason = "NM187 - Identification Code Qualifier"; return FALSE; } // Identification Code Qualifier
			if( strlen($v[9]) <= 4 ){ $this->reason = "NM187 - Identification Code"; return FALSE; } // Identification Code
		} else {
			$line--;
		}
		
		// Pay-to Provider Address
		$line++;
		$v = explode("*", $x12_array[$line]);
		if( $v[0] == "N3" ){
			if( strlen($v[1]) <= 5 ){ $this->reason = "N3 Pay-to Provider Address - Address Information 1"; return FALSE; } // Pay-to Provider Address Line 1
		} else {
			$line--;
		}

		// Pay-to Provider City/State/ZIP Code
		$line++;
		$v = explode("*", $x12_array[$line]);
		if( $v[0] == "N4" ){ // Pay-to Provider City/State/ZIP Code
			if( strlen($v[1]) <= 4 ){ $this->reason = "N4 - Pay-to Provider City/State/ZIP Code City Name"; return FALSE; } // City Name
			if( strlen($v[2]) <= 1 ){ $this->reason = "N4 - Pay-to Provider City/State/ZIP Code State or Province Code"; return FALSE; } // State or Province Code
			if( strlen($v[3]) <= 3 ){ $this->reason = "N4 - Pay-to Provider City/State/ZIP Code Postal Code"; return FALSE; } // Postal Code
		} else {
			$line--;
		}
				
		// Pay-to Provider Secondary Identification
		// NOT MANDATORY
		$line++;
		$v = explode("*", $x12_array[$line]);
		if( $v[0] == "REF" ){ // Pay-to Provider Secondary Identification
			if( $v[1] <> "EI" && $v[1] <> "SI" ){ $this->reason = "REF - Pay-to Provider Secondary Identification Reference Identification Qualifier"; return FALSE; } // Reference Identification Qualifier
			if( strlen($v[2]) <= 4 ){ $this->reason = "REF - Pay-to Provider Secondary Identification Reference Identification"; return FALSE; } // Reference Identification
		} else {
			$line--;
		}
		
		// Pay-to Provider Secondary Identification
		// NOT MANDATORY
		$line++;
		$v = explode("*", $x12_array[$line]);
		if( $v[0] == "REF" && $v[1] == "G2"){ // Pay-to Provider Secondary Identification
			if( $v[1] <> "G2" ){ $this->reason = "REF G2 - Pay-to Provider Secondary Identification Reference Identification Qualifier"; return FALSE; } // Reference Identification Qualifier
			if( strlen($v[2]) <= 4 ){ $this->reason = "REF G2 - Pay-to Provider Secondary Identification Reference Identification"; return FALSE; } // Reference Identification
		} else {
			$line--;
		}
		
		// Subscriber Hierarchical Level
		$line++;
		$v = explode("*", $x12_array[$line]);
		if( $v[0] != "HL" ){ $this->reason = "HL Subscriber Hierarchical Level - First bytes."; return FALSE; } // Subscriber Hierarchical Level
		if( is_int($v[1]) ){ $this->reason = "HL Subscriber Hierarchical Level - Hierarchical ID Number"; return FALSE; } // Hierarchical ID Number
		if( is_int($v[2]) ){ $this->reason = "HL Subscriber Hierarchical Level - Hierarchical Parent ID Number"; return FALSE; } // Hierarchical ID Number
		if( is_int($v[3]) ){ $this->reason = "HL Subscriber Hierarchical Level - Hierarchical Level Code"; return FALSE; } // Hierarchical Level Code
		if( is_int($v[4]) ){ $this->reason = "HL Subscriber Hierarchical Level - Hierarchical Child Code"; return FALSE; } // Hierarchical Child Code

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