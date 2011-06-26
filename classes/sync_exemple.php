<?php
	include "sync.php";
	
	$sync = new SyncronizeDB();
	//masterSet(dbserver,user,password,db,table,index)
	$sync->masterSet("www.pieseautomagazin.ro","cosmetic_test","test","cosmetic_test","_test_1","id");
	//serverSet(dbserver,user,password,db,table,index)	
	$sync->slaveSet("www.pieseautomagazin.ro","cosmetic_test","test","cosmetic_test","_test_2","id");
	//syncronizing the slave table with the master table (at row level)
	$sync->slaveSyncronization()
?>
