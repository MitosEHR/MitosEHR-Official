<?php
/*----------------------------------------------------------------------------------------------------
Ambulance Spanish Version
v0.0.1
Copyright by NetMedic in 2010
Developed by IdeasGroup Inc. in 2010
Requierements:
	* Sencha ExtJS v3.2+ 
	* OpenEMR v4.0
	* MySQL Server
----------------------------------------------------------------------------------------------------*/

include_once("../../registry.php");
include_once("$srcdir/acl.inc.php");
formHeader("Form: Ambulance");
?>
<html><head>
<link rel=stylesheet href="<?echo $css_header;?>" type="text/css">
</head>
<body <?echo $top_bg_line;?> topmargin=0 rightmargin=0 leftmargin=2 bottommargin=0 marginwidth=2 marginheight=0>
<form method=post action="<?echo $rootdir;?>/forms/Ambulance/save.php?mode=new" name="my_form" onSubmit="return top.restoreSession()">
<h1> Ambulance </h1>
<hr>
<input type="submit" name="submit form" value="submit form" /><br>
<br>
<H3> <?php xl("Horas y Millage",'e') ?> </H3>

<table>

<tr><td> <?php xl("Hr1069",'e') ?> </td> <td><select name="hr1069" >
<option value=" "> </option>
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>
<option value="6">6</option>
<option value="7">7</option>
<option value="8">8</option>
<option value="9">9</option>
<option value="10"> <?php xl("10",'e') ?> </option>
<option value="11"> <?php xl("11",'e') ?> </option>
<option value="12"> <?php xl("12",'e') ?> </option>
</select></td></tr>

</table>

<table>

<tr><td> <?php xl("Mn1069",'e') ?> </td> <td><select name="mn1069" >
<option value=" "> </option>
<option value="0">0</option>
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>
<option value="6">6</option>
<option value="7">7</option>
<option value="8">8</option>
<option value="9">9</option>
<option value="10"> <?php xl("10",'e') ?> </option>
<option value="11"> <?php xl("11",'e') ?> </option>
<option value="12"> <?php xl("12",'e') ?> </option>
<option value="13"> <?php xl("13",'e') ?> </option>
<option value="14"> <?php xl("14",'e') ?> </option>
<option value="15"> <?php xl("15",'e') ?> </option>
<option value="16"> <?php xl("16",'e') ?> </option>
<option value="17"> <?php xl("17",'e') ?> </option>
<option value="18"> <?php xl("18",'e') ?> </option>
<option value="19"> <?php xl("19",'e') ?> </option>
<option value="20"> <?php xl("20",'e') ?> </option>
<option value="21"> <?php xl("21",'e') ?> </option>
<option value="22"> <?php xl("22",'e') ?> </option>
<option value="23"> <?php xl("23",'e') ?> </option>
<option value="24"> <?php xl("24",'e') ?> </option>
<option value="25"> <?php xl("25",'e') ?> </option>
<option value="26"> <?php xl("26",'e') ?> </option>
<option value="27"> <?php xl("27",'e') ?> </option>
<option value="28"> <?php xl("28",'e') ?> </option>
<option value="29"> <?php xl("29",'e') ?> </option>
<option value="30"> <?php xl("30",'e') ?> </option>
<option value="31"> <?php xl("31",'e') ?> </option>
<option value="32"> <?php xl("32",'e') ?> </option>
<option value="33"> <?php xl("33",'e') ?> </option>
<option value="34"> <?php xl("34",'e') ?> </option>
<option value="35"> <?php xl("35",'e') ?> </option>
<option value="36"> <?php xl("36",'e') ?> </option>
<option value="37"> <?php xl("37",'e') ?> </option>
<option value="38"> <?php xl("38",'e') ?> </option>
<option value="39"> <?php xl("39",'e') ?> </option>
<option value="40"> <?php xl("40",'e') ?> </option>
<option value="41"> <?php xl("41",'e') ?> </option>
<option value="42"> <?php xl("42",'e') ?> </option>
<option value="43"> <?php xl("43",'e') ?> </option>
<option value="44"> <?php xl("44",'e') ?> </option>
<option value="45"> <?php xl("45",'e') ?> </option>
<option value="46"> <?php xl("46",'e') ?> </option>
<option value="47"> <?php xl("47",'e') ?> </option>
<option value="48"> <?php xl("48",'e') ?> </option>
<option value="49"> <?php xl("49",'e') ?> </option>
<option value="50"> <?php xl("50",'e') ?> </option>
<option value="51"> <?php xl("51",'e') ?> </option>
<option value="52"> <?php xl("52",'e') ?> </option>
<option value="53"> <?php xl("53",'e') ?> </option>
<option value="54"> <?php xl("54",'e') ?> </option>
<option value="55"> <?php xl("55",'e') ?> </option>
<option value="56"> <?php xl("56",'e') ?> </option>
<option value="57"> <?php xl("57",'e') ?> </option>
<option value="58"> <?php xl("58",'e') ?> </option>
<option value="59"> <?php xl("59",'e') ?> </option>
</select></td></tr>

</table>

<table>

<tr><td> <?php xl("Ampm1069",'e') ?> </td> <td><label><input type="radio" name="ampm1069" value="AM" /> <?php xl("AM",'e') ?> </label> <label><input type="radio" name="ampm1069" value="PM" /> <?php xl("PM",'e') ?> </label></td></tr>

</table>

<table>

<tr><td> <?php xl("Mill1069",'e') ?> </td> <td><input type="text" name="mill1069"  /></td></tr>

</table>

<table>

<tr><td> <?php xl("Hr1070",'e') ?> </td> <td><select name="hr1070" >
<option value=" "> </option>
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>
<option value="6">6</option>
<option value="7">7</option>
<option value="8">8</option>
<option value="9">9</option>
<option value="10"> <?php xl("10",'e') ?> </option>
<option value="11"> <?php xl("11",'e') ?> </option>
<option value="12"> <?php xl("12",'e') ?> </option>
</select></td></tr>

</table>

<table>

<tr><td> <?php xl("Mn1070",'e') ?> </td> <td><select name="mn1070" >
<option value=" "> </option>
<option value="0">0</option>
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>
<option value="6">6</option>
<option value="7">7</option>
<option value="8">8</option>
<option value="9">9</option>
<option value="10"> <?php xl("10",'e') ?> </option>
<option value="11"> <?php xl("11",'e') ?> </option>
<option value="12"> <?php xl("12",'e') ?> </option>
<option value="13"> <?php xl("13",'e') ?> </option>
<option value="14"> <?php xl("14",'e') ?> </option>
<option value="15"> <?php xl("15",'e') ?> </option>
<option value="16"> <?php xl("16",'e') ?> </option>
<option value="17"> <?php xl("17",'e') ?> </option>
<option value="18"> <?php xl("18",'e') ?> </option>
<option value="19"> <?php xl("19",'e') ?> </option>
<option value="20"> <?php xl("20",'e') ?> </option>
<option value="21"> <?php xl("21",'e') ?> </option>
<option value="22"> <?php xl("22",'e') ?> </option>
<option value="23"> <?php xl("23",'e') ?> </option>
<option value="24"> <?php xl("24",'e') ?> </option>
<option value="25"> <?php xl("25",'e') ?> </option>
<option value="26"> <?php xl("26",'e') ?> </option>
<option value="27"> <?php xl("27",'e') ?> </option>
<option value="28"> <?php xl("28",'e') ?> </option>
<option value="29"> <?php xl("29",'e') ?> </option>
<option value="30"> <?php xl("30",'e') ?> </option>
<option value="31"> <?php xl("31",'e') ?> </option>
<option value="32"> <?php xl("32",'e') ?> </option>
<option value="33"> <?php xl("33",'e') ?> </option>
<option value="34"> <?php xl("34",'e') ?> </option>
<option value="35"> <?php xl("35",'e') ?> </option>
<option value="36"> <?php xl("36",'e') ?> </option>
<option value="37"> <?php xl("37",'e') ?> </option>
<option value="38"> <?php xl("38",'e') ?> </option>
<option value="39"> <?php xl("39",'e') ?> </option>
<option value="40"> <?php xl("40",'e') ?> </option>
<option value="41"> <?php xl("41",'e') ?> </option>
<option value="42"> <?php xl("42",'e') ?> </option>
<option value="43"> <?php xl("43",'e') ?> </option>
<option value="44"> <?php xl("44",'e') ?> </option>
<option value="45"> <?php xl("45",'e') ?> </option>
<option value="46"> <?php xl("46",'e') ?> </option>
<option value="47"> <?php xl("47",'e') ?> </option>
<option value="48"> <?php xl("48",'e') ?> </option>
<option value="49"> <?php xl("49",'e') ?> </option>
<option value="50"> <?php xl("50",'e') ?> </option>
<option value="51"> <?php xl("51",'e') ?> </option>
<option value="52"> <?php xl("52",'e') ?> </option>
<option value="53"> <?php xl("53",'e') ?> </option>
<option value="54"> <?php xl("54",'e') ?> </option>
<option value="55"> <?php xl("55",'e') ?> </option>
<option value="56"> <?php xl("56",'e') ?> </option>
<option value="57"> <?php xl("57",'e') ?> </option>
<option value="58"> <?php xl("58",'e') ?> </option>
<option value="59"> <?php xl("59",'e') ?> </option>
</select></td></tr>

</table>

<table>

<tr><td> <?php xl("Ampm1070",'e') ?> </td> <td><label><input type="radio" name="ampm1070" value="AM" /> <?php xl("AM",'e') ?> </label> <label><input type="radio" name="ampm1070" value="PM " /> <?php xl("PM ",'e') ?> </label></td></tr>

</table>

<table>

<tr><td> <?php xl("Mill1070",'e') ?> </td> <td><input type="text" name="mill1070"  /></td></tr>

</table>

<table>

<tr><td> <?php xl("Hr1071",'e') ?> </td> <td><select name="hr1071" >
<option value=" "> </option>
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>
<option value="6">6</option>
<option value="7">7</option>
<option value="8">8</option>
<option value="9">9</option>
<option value="10"> <?php xl("10",'e') ?> </option>
<option value="11"> <?php xl("11",'e') ?> </option>
<option value="12"> <?php xl("12",'e') ?> </option>
</select></td></tr>

</table>

<table>

<tr><td> <?php xl("Mn1071",'e') ?> </td> <td><select name="mn1071" >
<option value=" "> </option>
<option value="0">0</option>
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>
<option value="6">6</option>
<option value="7">7</option>
<option value="8">8</option>
<option value="9">9</option>
<option value="10"> <?php xl("10",'e') ?> </option>
<option value="11"> <?php xl("11",'e') ?> </option>
<option value="12"> <?php xl("12",'e') ?> </option>
<option value="13"> <?php xl("13",'e') ?> </option>
<option value="14"> <?php xl("14",'e') ?> </option>
<option value="15"> <?php xl("15",'e') ?> </option>
<option value="16"> <?php xl("16",'e') ?> </option>
<option value="17"> <?php xl("17",'e') ?> </option>
<option value="18"> <?php xl("18",'e') ?> </option>
<option value="19"> <?php xl("19",'e') ?> </option>
<option value="20"> <?php xl("20",'e') ?> </option>
<option value="21"> <?php xl("21",'e') ?> </option>
<option value="22"> <?php xl("22",'e') ?> </option>
<option value="23"> <?php xl("23",'e') ?> </option>
<option value="24"> <?php xl("24",'e') ?> </option>
<option value="25"> <?php xl("25",'e') ?> </option>
<option value="26"> <?php xl("26",'e') ?> </option>
<option value="27"> <?php xl("27",'e') ?> </option>
<option value="28"> <?php xl("28",'e') ?> </option>
<option value="29"> <?php xl("29",'e') ?> </option>
<option value="30"> <?php xl("30",'e') ?> </option>
<option value="31"> <?php xl("31",'e') ?> </option>
<option value="32"> <?php xl("32",'e') ?> </option>
<option value="33"> <?php xl("33",'e') ?> </option>
<option value="34"> <?php xl("34",'e') ?> </option>
<option value="35"> <?php xl("35",'e') ?> </option>
<option value="36"> <?php xl("36",'e') ?> </option>
<option value="37"> <?php xl("37",'e') ?> </option>
<option value="38"> <?php xl("38",'e') ?> </option>
<option value="39"> <?php xl("39",'e') ?> </option>
<option value="40"> <?php xl("40",'e') ?> </option>
<option value="41"> <?php xl("41",'e') ?> </option>
<option value="42"> <?php xl("42",'e') ?> </option>
<option value="43"> <?php xl("43",'e') ?> </option>
<option value="44"> <?php xl("44",'e') ?> </option>
<option value="45"> <?php xl("45",'e') ?> </option>
<option value="46"> <?php xl("46",'e') ?> </option>
<option value="47"> <?php xl("47",'e') ?> </option>
<option value="48"> <?php xl("48",'e') ?> </option>
<option value="49"> <?php xl("49",'e') ?> </option>
<option value="50"> <?php xl("50",'e') ?> </option>
<option value="51"> <?php xl("51",'e') ?> </option>
<option value="52"> <?php xl("52",'e') ?> </option>
<option value="53"> <?php xl("53",'e') ?> </option>
<option value="54"> <?php xl("54",'e') ?> </option>
<option value="55"> <?php xl("55",'e') ?> </option>
<option value="56"> <?php xl("56",'e') ?> </option>
<option value="57"> <?php xl("57",'e') ?> </option>
<option value="58"> <?php xl("58",'e') ?> </option>
<option value="59"> <?php xl("59",'e') ?> </option>
</select></td></tr>

</table>

<table>

<tr><td> <?php xl("Mpm1071",'e') ?> </td> <td><label><input type="radio" name="mpm1071" value="AM" /> <?php xl("AM",'e') ?> </label> <label><input type="radio" name="mpm1071" value="PM" /> <?php xl("PM",'e') ?> </label></td></tr>

</table>

<table>

<tr><td> <?php xl("Mill1071",'e') ?> </td> <td><input type="text" name="mill1071"  /></td></tr>

</table>

<table>

<tr><td> <?php xl("Hr1072",'e') ?> </td> <td><select name="hr1072" >
<option value=" "> </option>
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>
<option value="6">6</option>
<option value="7">7</option>
<option value="8">8</option>
<option value="9">9</option>
<option value="10"> <?php xl("10",'e') ?> </option>
<option value="11"> <?php xl("11",'e') ?> </option>
<option value="12"> <?php xl("12",'e') ?> </option>
</select></td></tr>

</table>

<table>

<tr><td> <?php xl("Mn1072",'e') ?> </td> <td><select name="mn1072" >
<option value=" "> </option>
<option value="0">0</option>
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>
<option value="6">6</option>
<option value="7">7</option>
<option value="8">8</option>
<option value="9">9</option>
<option value="10"> <?php xl("10",'e') ?> </option>
<option value="11"> <?php xl("11",'e') ?> </option>
<option value="12"> <?php xl("12",'e') ?> </option>
<option value="13"> <?php xl("13",'e') ?> </option>
<option value="14"> <?php xl("14",'e') ?> </option>
<option value="15"> <?php xl("15",'e') ?> </option>
<option value="16"> <?php xl("16",'e') ?> </option>
<option value="17"> <?php xl("17",'e') ?> </option>
<option value="18"> <?php xl("18",'e') ?> </option>
<option value="19"> <?php xl("19",'e') ?> </option>
<option value="20"> <?php xl("20",'e') ?> </option>
<option value="21"> <?php xl("21",'e') ?> </option>
<option value="22"> <?php xl("22",'e') ?> </option>
<option value="23"> <?php xl("23",'e') ?> </option>
<option value="24"> <?php xl("24",'e') ?> </option>
<option value="25"> <?php xl("25",'e') ?> </option>
<option value="26"> <?php xl("26",'e') ?> </option>
<option value="27"> <?php xl("27",'e') ?> </option>
<option value="28"> <?php xl("28",'e') ?> </option>
<option value="29"> <?php xl("29",'e') ?> </option>
<option value="30"> <?php xl("30",'e') ?> </option>
<option value="31"> <?php xl("31",'e') ?> </option>
<option value="32"> <?php xl("32",'e') ?> </option>
<option value="33"> <?php xl("33",'e') ?> </option>
<option value="34"> <?php xl("34",'e') ?> </option>
<option value="35"> <?php xl("35",'e') ?> </option>
<option value="36"> <?php xl("36",'e') ?> </option>
<option value="37"> <?php xl("37",'e') ?> </option>
<option value="38"> <?php xl("38",'e') ?> </option>
<option value="39"> <?php xl("39",'e') ?> </option>
<option value="40"> <?php xl("40",'e') ?> </option>
<option value="41"> <?php xl("41",'e') ?> </option>
<option value="42"> <?php xl("42",'e') ?> </option>
<option value="43"> <?php xl("43",'e') ?> </option>
<option value="44"> <?php xl("44",'e') ?> </option>
<option value="45"> <?php xl("45",'e') ?> </option>
<option value="46"> <?php xl("46",'e') ?> </option>
<option value="47"> <?php xl("47",'e') ?> </option>
<option value="48"> <?php xl("48",'e') ?> </option>
<option value="49"> <?php xl("49",'e') ?> </option>
<option value="50"> <?php xl("50",'e') ?> </option>
<option value="51"> <?php xl("51",'e') ?> </option>
<option value="52"> <?php xl("52",'e') ?> </option>
<option value="53"> <?php xl("53",'e') ?> </option>
<option value="54"> <?php xl("54",'e') ?> </option>
<option value="55"> <?php xl("55",'e') ?> </option>
<option value="56"> <?php xl("56",'e') ?> </option>
<option value="57"> <?php xl("57",'e') ?> </option>
<option value="58"> <?php xl("58",'e') ?> </option>
<option value="59"> <?php xl("59",'e') ?> </option>
</select></td></tr>

</table>

<table>

<tr><td> <?php xl("Ampm1072",'e') ?> </td> <td><label><input type="radio" name="ampm1072" value="AM" /> <?php xl("AM",'e') ?> </label> <label><input type="radio" name="ampm1072" value="PM" /> <?php xl("PM",'e') ?> </label></td></tr>

</table>

<table>

<tr><td> <?php xl("Mill1072",'e') ?> </td> <td><input type="text" name="mill1072"  /></td></tr>

</table>

<table>

<tr><td> <?php xl("Hr1073",'e') ?> </td> <td><select name="hr1073" >
<option value=" "> </option>
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>
<option value="6">6</option>
<option value="7">7</option>
<option value="8">8</option>
<option value="9">9</option>
<option value="10"> <?php xl("10",'e') ?> </option>
<option value="11"> <?php xl("11",'e') ?> </option>
<option value="12"> <?php xl("12",'e') ?> </option>
</select></td></tr>

</table>

<table>

<tr><td> <?php xl("Mn1073",'e') ?> </td> <td><select name="mn1073" >
<option value=" "> </option>
<option value="0">0</option>
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>
<option value="6">6</option>
<option value="7">7</option>
<option value="8">8</option>
<option value="9">9</option>
<option value="10"> <?php xl("10",'e') ?> </option>
<option value="11"> <?php xl("11",'e') ?> </option>
<option value="12"> <?php xl("12",'e') ?> </option>
<option value="13"> <?php xl("13",'e') ?> </option>
<option value="14"> <?php xl("14",'e') ?> </option>
<option value="15"> <?php xl("15",'e') ?> </option>
<option value="16"> <?php xl("16",'e') ?> </option>
<option value="17"> <?php xl("17",'e') ?> </option>
<option value="18"> <?php xl("18",'e') ?> </option>
<option value="19"> <?php xl("19",'e') ?> </option>
<option value="20"> <?php xl("20",'e') ?> </option>
<option value="21"> <?php xl("21",'e') ?> </option>
<option value="22"> <?php xl("22",'e') ?> </option>
<option value="23"> <?php xl("23",'e') ?> </option>
<option value="24"> <?php xl("24",'e') ?> </option>
<option value="25"> <?php xl("25",'e') ?> </option>
<option value="26"> <?php xl("26",'e') ?> </option>
<option value="27"> <?php xl("27",'e') ?> </option>
<option value="28"> <?php xl("28",'e') ?> </option>
<option value="29"> <?php xl("29",'e') ?> </option>
<option value="30"> <?php xl("30",'e') ?> </option>
<option value="31"> <?php xl("31",'e') ?> </option>
<option value="32"> <?php xl("32",'e') ?> </option>
<option value="33"> <?php xl("33",'e') ?> </option>
<option value="34"> <?php xl("34",'e') ?> </option>
<option value="35"> <?php xl("35",'e') ?> </option>
<option value="36"> <?php xl("36",'e') ?> </option>
<option value="37"> <?php xl("37",'e') ?> </option>
<option value="38"> <?php xl("38",'e') ?> </option>
<option value="39"> <?php xl("39",'e') ?> </option>
<option value="40"> <?php xl("40",'e') ?> </option>
<option value="41"> <?php xl("41",'e') ?> </option>
<option value="42"> <?php xl("42",'e') ?> </option>
<option value="43"> <?php xl("43",'e') ?> </option>
<option value="44"> <?php xl("44",'e') ?> </option>
<option value="45"> <?php xl("45",'e') ?> </option>
<option value="46"> <?php xl("46",'e') ?> </option>
<option value="47"> <?php xl("47",'e') ?> </option>
<option value="48"> <?php xl("48",'e') ?> </option>
<option value="49"> <?php xl("49",'e') ?> </option>
<option value="50"> <?php xl("50",'e') ?> </option>
<option value="51"> <?php xl("51",'e') ?> </option>
<option value="52"> <?php xl("52",'e') ?> </option>
<option value="53"> <?php xl("53",'e') ?> </option>
<option value="54"> <?php xl("54",'e') ?> </option>
<option value="55"> <?php xl("55",'e') ?> </option>
<option value="56"> <?php xl("56",'e') ?> </option>
<option value="57"> <?php xl("57",'e') ?> </option>
<option value="58"> <?php xl("58",'e') ?> </option>
<option value="59"> <?php xl("59",'e') ?> </option>
</select></td></tr>

</table>

<table>

<tr><td> <?php xl("Ampm1073",'e') ?> </td> <td><label><input type="radio" name="ampm1073" value="AM" /> <?php xl("AM",'e') ?> </label> <label><input type="radio" name="ampm1073" value="PM" /> <?php xl("PM",'e') ?> </label></td></tr>

</table>

<table>

<tr><td> <?php xl("Mill1073",'e') ?> </td> <td><input type="text" name="mill1073"  /></td></tr>

</table>

<table>

<tr><td> <?php xl("Hr1074",'e') ?> </td> <td><select name="hr1074" >
<option value=" "> </option>
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>
<option value="6">6</option>
<option value="7">7</option>
<option value="8">8</option>
<option value="9">9</option>
<option value="10"> <?php xl("10",'e') ?> </option>
<option value="11"> <?php xl("11",'e') ?> </option>
<option value="12"> <?php xl("12",'e') ?> </option>
</select></td></tr>

</table>

<table>

<tr><td> <?php xl("Mn1074",'e') ?> </td> <td><select name="mn1074" >
<option value=" "> </option>
<option value="0">0</option>
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>
<option value="6">6</option>
<option value="7">7</option>
<option value="8">8</option>
<option value="9">9</option>
<option value="10"> <?php xl("10",'e') ?> </option>
<option value="11"> <?php xl("11",'e') ?> </option>
<option value="12"> <?php xl("12",'e') ?> </option>
<option value="13"> <?php xl("13",'e') ?> </option>
<option value="14"> <?php xl("14",'e') ?> </option>
<option value="15"> <?php xl("15",'e') ?> </option>
<option value="16"> <?php xl("16",'e') ?> </option>
<option value="17"> <?php xl("17",'e') ?> </option>
<option value="18"> <?php xl("18",'e') ?> </option>
<option value="19"> <?php xl("19",'e') ?> </option>
<option value="20"> <?php xl("20",'e') ?> </option>
<option value="21"> <?php xl("21",'e') ?> </option>
<option value="22"> <?php xl("22",'e') ?> </option>
<option value="23"> <?php xl("23",'e') ?> </option>
<option value="24"> <?php xl("24",'e') ?> </option>
<option value="25"> <?php xl("25",'e') ?> </option>
<option value="26"> <?php xl("26",'e') ?> </option>
<option value="27"> <?php xl("27",'e') ?> </option>
<option value="28"> <?php xl("28",'e') ?> </option>
<option value="29"> <?php xl("29",'e') ?> </option>
<option value="30"> <?php xl("30",'e') ?> </option>
<option value="31"> <?php xl("31",'e') ?> </option>
<option value="32"> <?php xl("32",'e') ?> </option>
<option value="33"> <?php xl("33",'e') ?> </option>
<option value="34"> <?php xl("34",'e') ?> </option>
<option value="35"> <?php xl("35",'e') ?> </option>
<option value="36"> <?php xl("36",'e') ?> </option>
<option value="37"> <?php xl("37",'e') ?> </option>
<option value="38"> <?php xl("38",'e') ?> </option>
<option value="39"> <?php xl("39",'e') ?> </option>
<option value="40"> <?php xl("40",'e') ?> </option>
<option value="41"> <?php xl("41",'e') ?> </option>
<option value="42"> <?php xl("42",'e') ?> </option>
<option value="43"> <?php xl("43",'e') ?> </option>
<option value="44"> <?php xl("44",'e') ?> </option>
<option value="45"> <?php xl("45",'e') ?> </option>
<option value="46"> <?php xl("46",'e') ?> </option>
<option value="47"> <?php xl("47",'e') ?> </option>
<option value="48"> <?php xl("48",'e') ?> </option>
<option value="49"> <?php xl("49",'e') ?> </option>
<option value="50"> <?php xl("50",'e') ?> </option>
<option value="51"> <?php xl("51",'e') ?> </option>
<option value="52"> <?php xl("52",'e') ?> </option>
<option value="53"> <?php xl("53",'e') ?> </option>
<option value="54"> <?php xl("54",'e') ?> </option>
<option value="55"> <?php xl("55",'e') ?> </option>
<option value="56"> <?php xl("56",'e') ?> </option>
<option value="57"> <?php xl("57",'e') ?> </option>
<option value="58"> <?php xl("58",'e') ?> </option>
<option value="59"> <?php xl("59",'e') ?> </option>
</select></td></tr>

</table>

<table>

<tr><td> <?php xl("Ampm1074",'e') ?> </td> <td><label><input type="radio" name="ampm1074" value="AM" /> <?php xl("AM",'e') ?> </label> <label><input type="radio" name="ampm1074" value="PM" /> <?php xl("PM",'e') ?> </label></td></tr>

</table>

<table>

<tr><td> <?php xl("Mill1074",'e') ?> </td> <td><input type="text" name="mill1074"  /></td></tr>

</table>
<br>
<H3> <?php xl("Historial Medico/Diagnosticos",'e') ?> </H3>

<table>

<tr><td> <?php xl("Hempleh",'e') ?> </td> <td><input type="text" name="hempleh"  /></td></tr>

</table>

<table>

<tr><td> <?php xl("Hemplea",'e') ?> </td> <td><input type="text" name="hemplea"  /></td></tr>

</table>

<table>

<tr><td> <?php xl("Hemplep",'e') ?> </td> <td><input type="text" name="hemplep"  /></td></tr>

</table>

<table>

<tr><td> <?php xl("Hemplel",'e') ?> </td> <td><input type="text" name="hemplel"  /></td></tr>

</table>

<table>

<tr><td> <?php xl("Hemplee",'e') ?> </td> <td><input type="text" name="hemplee"  /></td></tr>

</table>

<table>

<tr><td> <?php xl("Diagnos",'e') ?> </td> <td><input type="text" name="diagnos"  /></td></tr>

</table>
<br>
<H3> <?php xl("Condiciones",'e') ?> </H3>

<table>

<tr><td> <?php xl("Signos y sintomas",'e') ?> </td> <td><label><input type="checkbox" name="signos_y_sintomas[]" value="Hemiparesis" /> <?php xl("Hemiparesis",'e') ?> </label> <label><input type="checkbox" name="signos_y_sintomas[]" value="HBP" /> <?php xl("HBP",'e') ?> </label> <label><input type="checkbox" name="signos_y_sintomas[]" value="Dolor de Pecho" /> <?php xl("Dolor de Pecho",'e') ?> </label> <label><input type="checkbox" name="signos_y_sintomas[]" value="Dificultad Resp" /> <?php xl("Dificultad Resp",'e') ?> </label> <label><input type="checkbox" name="signos_y_sintomas[]" value="Dolor Abdominal" /> <?php xl("Dolor Abdominal",'e') ?> </label> <label><input type="checkbox" name="signos_y_sintomas[]" value="Reaccion Alergica" /> <?php xl("Reaccion Alergica",'e') ?> </label> <label><input type="checkbox" name="signos_y_sintomas[]" value="Hipglicemia" /> <?php xl("Hipglicemia",'e') ?> </label> <label><input type="checkbox" name="signos_y_sintomas[]" value="Fiebre" /> <?php xl("Fiebre",'e') ?> </label> <label><input type="checkbox" name="signos_y_sintomas[]" value="Mareo" /> <?php xl("Mareo",'e') ?> </label> <label><input type="checkbox" name="signos_y_sintomas[]" value="vomitos" /> <?php xl("vomitos",'e') ?> </label> <label><input type="checkbox" name="signos_y_sintomas[]" value="Sintomas de Parto" /> <?php xl("Sintomas de Parto",'e') ?> </label> <label><input type="checkbox" name="signos_y_sintomas[]" value="Combativo" /> <?php xl("Combativo",'e') ?> </label> <label><input type="checkbox" name="signos_y_sintomas[]" value="convulsionando" /> <?php xl("convulsionando",'e') ?> </label></td></tr>

</table>

<table>


</table>

<table>

<tr><td> <?php xl("Conciencia",'e') ?> </td> <td><label><input type="checkbox" name="conciencia[]" value="Alerta" /> <?php xl("Alerta",'e') ?> </label> <label><input type="checkbox" name="conciencia[]" value="Conciente" /> <?php xl("Conciente",'e') ?> </label> <label><input type="checkbox" name="conciencia[]" value="Orientado" /> <?php xl("Orientado",'e') ?> </label> <label><input type="checkbox" name="conciencia[]" value="Let�rgico" /> <?php xl("Let�rgico",'e') ?> </label> <label><input type="checkbox" name="conciencia[]" value="Incoherente" /> <?php xl("Incoherente",'e') ?> </label> <label><input type="checkbox" name="conciencia[]" value="Inconciente" /> <?php xl("Inconciente",'e') ?> </label></td></tr>

</table>

<table>

<tr><td> <?php xl("Piel",'e') ?> </td> <td><label><input type="checkbox" name="piel[]" value="Normal" /> <?php xl("Normal",'e') ?> </label> <label><input type="checkbox" name="piel[]" value="Fria" /> <?php xl("Fria",'e') ?> </label> <label><input type="checkbox" name="piel[]" value="Caliente" /> <?php xl("Caliente",'e') ?> </label> <label><input type="checkbox" name="piel[]" value="Sudorosa" /> <?php xl("Sudorosa",'e') ?> </label> <label><input type="checkbox" name="piel[]" value="Seca" /> <?php xl("Seca",'e') ?> </label> <label><input type="checkbox" name="piel[]" value="Clanotica" /> <?php xl("Clanotica",'e') ?> </label> <label><input type="checkbox" name="piel[]" value="Humeda" /> <?php xl("Humeda",'e') ?> </label> <label><input type="checkbox" name="piel[]" value="Palido" /> <?php xl("Palido",'e') ?> </label> <label><input type="checkbox" name="piel[]" value="Equimosis" /> <?php xl("Equimosis",'e') ?> </label></td></tr>

</table>

<table>

<tr><td> <?php xl("Pulmones",'e') ?> </td> <td><label><input type="checkbox" name="pulmones[]" value="Claro" /> <?php xl("Claro",'e') ?> </label> <label><input type="checkbox" name="pulmones[]" value="Sibilancia" /> <?php xl("Sibilancia",'e') ?> </label> <label><input type="checkbox" name="pulmones[]" value="Estertores" /> <?php xl("Estertores",'e') ?> </label> <label><input type="checkbox" name="pulmones[]" value="Rales" /> <?php xl("Rales",'e') ?> </label> <label><input type="checkbox" name="pulmones[]" value="Matidos" /> <?php xl("Matidos",'e') ?> </label></td></tr>

</table>

<table>

<tr><td> <?php xl("Abdomen",'e') ?> </td> <td><label><input type="checkbox" name="abdomen[]" value="Blandito" /> <?php xl("Blandito",'e') ?> </label> <label><input type="checkbox" name="abdomen[]" value="No doloroso" /> <?php xl("No doloroso",'e') ?> </label> <label><input type="checkbox" name="abdomen[]" value="Duro" /> <?php xl("Duro",'e') ?> </label> <label><input type="checkbox" name="abdomen[]" value="Doloroso" /> <?php xl("Doloroso",'e') ?> </label></td></tr>

</table>

<table>

<tr><td> <?php xl("Pupilas",'e') ?> </td> <td><label><input type="checkbox" name="pupilas[]" value="Iguales" /> <?php xl("Iguales",'e') ?> </label> <label><input type="checkbox" name="pupilas[]" value="Reactivas" /> <?php xl("Reactivas",'e') ?> </label> <label><input type="checkbox" name="pupilas[]" value="Anisocorta" /> <?php xl("Anisocorta",'e') ?> </label> <label><input type="checkbox" name="pupilas[]" value="No Reactivas" /> <?php xl("No Reactivas",'e') ?> </label> <label><input type="checkbox" name="pupilas[]" value="Dilatadas" /> <?php xl("Dilatadas",'e') ?> </label> <label><input type="checkbox" name="pupilas[]" value="Contaidas" /> <?php xl("Contaidas",'e') ?> </label></td></tr>

</table>

<table>

<tr><td> <?php xl("Pupilasid",'e') ?> </td> <td><label><input type="radio" name="pupilasid" value="Izq" /> <?php xl("Izq",'e') ?> </label> <label><input type="radio" name="pupilasid" value="Der" /> <?php xl("Der",'e') ?> </label></td></tr>

</table>

<table>

<tr><td> <?php xl("Ritomo cardiado",'e') ?> </td> <td><label><input type="checkbox" name="ritomo_cardiado[]" value="Regular" /> <?php xl("Regular",'e') ?> </label> <label><input type="checkbox" name="ritomo_cardiado[]" value="Irregular" /> <?php xl("Irregular",'e') ?> </label> <label><input type="checkbox" name="ritomo_cardiado[]" value="Furete" /> <?php xl("Furete",'e') ?> </label> <label><input type="checkbox" name="ritomo_cardiado[]" value="Debil" /> <?php xl("Debil",'e') ?> </label> <label><input type="checkbox" name="ritomo_cardiado[]" value="Ausente" /> <?php xl("Ausente",'e') ?> </label></td></tr>

</table>

<table>

<tr><td> <?php xl("Oxigenolpm",'e') ?> </td> <td><input type="text" name="oxigenolpm"  /></td></tr>

</table>

<table>

<tr><td> <?php xl("Oxigenovia",'e') ?> </td> <td><label><input type="checkbox" name="oxigenovia[]" value="Canuria" /> <?php xl("Canuria",'e') ?> </label> <label><input type="checkbox" name="oxigenovia[]" value="Mascarilla" /> <?php xl("Mascarilla",'e') ?> </label> <label><input type="checkbox" name="oxigenovia[]" value="Terapia" /> <?php xl("Terapia",'e') ?> </label> <label><input type="checkbox" name="oxigenovia[]" value="Resucitador" /> <?php xl("Resucitador",'e') ?> </label></td></tr>

</table>

<table>

<tr><td> <?php xl("Suero1",'e') ?> </td> <td><input type="text" name="suero1"  /></td></tr>

</table>

<table>

<tr><td> <?php xl("Angio1",'e') ?> </td> <td><input type="text" name="angio1"  /></td></tr>

</table>

<table>

<tr><td> <?php xl("Lugar1",'e') ?> </td> <td><input type="text" name="lugar1"  /></td></tr>

</table>

<table>

<tr><td> <?php xl("Suero2",'e') ?> </td> <td><input type="text" name="suero2"  /></td></tr>

</table>

<table>

<tr><td> <?php xl("Angio2",'e') ?> </td> <td><input type="text" name="angio2"  /></td></tr>

</table>

<table>

<tr><td> <?php xl("Lugar2",'e') ?> </td> <td><input type="text" name="lugar2"  /></td></tr>

</table>
<br>
<H3> <?php xl("Servicios Prestados",'e') ?> </H3>

<table>


</table>

<table>

<tr><td> <?php xl("Escala de trauma",'e') ?> </td> <td><input type="text" name="escala_de_trauma"  /></td></tr>

</table>

<table>

<tr><td> <?php xl("Escala de glasqow",'e') ?> </td> <td><input type="text" name="escala_de_glasqow"  /></td></tr>

</table>

<table>

<tr><td> <?php xl("Escala de apqar",'e') ?> </td> <td><input type="text" name="escala_de_apqar"  /></td></tr>

</table>
<br>
<H3> <?php xl("Entrega del Paciente",'e') ?> </H3>

<table>

<tr><td> <?php xl("Entrega",'e') ?> </td> <td><label><input type="checkbox" name="entrega[]" value="Medico" /> <?php xl("Medico",'e') ?> </label> <label><input type="checkbox" name="entrega[]" value="Familares" /> <?php xl("Familares",'e') ?> </label> <label><input type="checkbox" name="entrega[]" value="cercano" /> <?php xl("cercano",'e') ?> </label> <label><input type="checkbox" name="entrega[]" value="Des Tecnico" /> <?php xl("Des Tecnico",'e') ?> </label> <label><input type="checkbox" name="entrega[]" value="Des Sup" /> <?php xl("Des Sup",'e') ?> </label> <label><input type="checkbox" name="entrega[]" value="Des Despacho" /> <?php xl("Des Despacho",'e') ?> </label></td></tr>

</table>

<table>

<tr><td> <?php xl("Medico",'e') ?> </td> <td><input type="text" name="medico"  /></td></tr>

</table>

<table>

<tr><td> <?php xl("Mediconpi",'e') ?> </td> <td><input type="text" name="mediconpi"  /></td></tr>

</table>

<table>

<tr><td> <?php xl("Tratamiento",'e') ?> </td> <td><label><input type="checkbox" name="tratamiento[]" value="Ambulancia" /> <?php xl("Ambulancia",'e') ?> </label> <label><input type="checkbox" name="tratamiento[]" value="Escena" /> <?php xl("Escena",'e') ?> </label> <label><input type="checkbox" name="tratamiento[]" value="Hogar" /> <?php xl("Hogar",'e') ?> </label></td></tr>

</table>

<table>

<tr><td> <?php xl("Medicoesc",'e') ?> </td> <td><input type="text" name="medicoesc"  /></td></tr>

</table>

<table>

<tr><td> <?php xl("Medicoescnpi",'e') ?> </td> <td><input type="text" name="medicoescnpi"  /></td></tr>

</table>

<table>

<tr><td> <?php xl("Policia",'e') ?> </td> <td><input type="text" name="policia"  /></td></tr>

</table>

<table>

<tr><td> <?php xl("Policaid",'e') ?> </td> <td><input type="text" name="policaid"  /></td></tr>

</table>

<table>

<tr><td> <?php xl("Querella",'e') ?> </td> <td><input type="text" name="querella"  /></td></tr>

</table>
<table></table><input type="submit" name="submit form" value="submit form" />
</form>
<?php
formFooter();
?>
