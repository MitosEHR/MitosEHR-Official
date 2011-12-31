<?php
//--------------------------------------------------------------------------------------------------------------------------
// data_create.ejs.php / new_patient
// v0.0.2
// Under GPLv3 License
//
// Integrated by: GI Technologies Inc. in 2011
//
// Remember, this file is called via the Framework Store, this is the AJAX thing.
//--------------------------------------------------------------------------------------------------------------------------

session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once($_SESSION['site']['root']."/classes/dbHelper.class.php");

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;




