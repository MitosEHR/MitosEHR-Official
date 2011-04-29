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

// CHAR Dicctionary
// How it works
// 1- Segment
// 2- Purpose
// 3- Element
// 4- Character Symbol
// Result = Meaning

$x12['PER']['IC'][3]['EM'] = "E-mail Address"; 
$x12['PER']['IC'][3]['FX'] = "Facsimile";
$x12['PER']['IC'][3]['TE'] = "Telephone";

$x12['NM1']['85'][2]['1'] = "Person";
$x12['NM1']['85'][2]['2'] = "Nonperson Entity";

$x12['SBR'][1]['P'] = "Primary";
$x12['SBR'][1]['S'] = "Secondary";
$x12['SBR'][1]['T'] = "Tertiary";

$x12['SBR'][2]['18'] = "Self";


?> 