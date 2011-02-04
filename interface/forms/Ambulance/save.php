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
include_once("$srcdir/forms.inc");
require_once("$srcdir/formdata.inc.php");

// *************************************************************************************
// Fill the variable with the form field one by one.
// Needs special care.
// *************************************************************************************

/* Llamadas 10-69 (Horas/Minutos/AMPM/Millaje) */
$field_spec['hr1069'] = $_POST['hr1069'];
$field_spec['mn1069'] = $_POST['mn1069'];
$field_spec['ampm1069'] = $_POST['ampm1069'];
$field_spec['mill1069'] = $_POST['mill1069'];

/* Respuesta 10-70 (Horas/Minutos/AMPM/Millaje) */
$field_spec['hr1070'] = $_POST['hr1070'];
$field_spec['mn1070'] = $_POST['mn1070'];
$field_spec['ampm1070'] = $_POST['ampm1070'];
$field_spec['mill1070'] = $_POST['mill1070'];

/* Respuesta 10-71 (Horas/Minutos/AMPM/Millaje) */
$field_spec['hr1071'] = $_POST['hr1071'];
$field_spec['mn1071'] = $_POST['mn1071'];
$field_spec['ampm1071'] = $_POST['ampm1071'];
$field_spec['mill1071'] = $_POST['mill1071'];

/* Respuesta 10-72 (Horas/Minutos/AMPM/Millaje) */
$field_spec['hr1072'] = $_POST['hr1072'];
$field_spec['mn1072'] = $_POST['mn1072'];
$field_spec['ampm1072'] = $_POST['ampm1072'];
$field_spec['mill1072'] = $_POST['mill1072'];

/* Respuesta 10-73 (Horas/Minutos/AMPM/Millaje) */
$field_spec['hr1073'] = $_POST['hr1073'];
$field_spec['mn1073'] = $_POST['mn1073'];
$field_spec['ampm1073'] = $_POST['ampm1073'];
$field_spec['mill1073'] = $_POST['mill1073'];

/* Respuesta 10-74 (Horas/Minutos/AMPM/Millaje) */
$field_spec['hr1074'] = $_POST['hr1074'];
$field_spec['mn1074'] = $_POST['mn1074'];
$field_spec['ampm1074'] = $_POST['ampm1074'];
$field_spec['mill1074'] = $_POST['mill1074'];

/* Historial Medico/Diagnosticos */
$field_spec['hampleh'] = $_POST['hampleh'];
$field_spec['hamplea'] = $_POST['hamplea'];
$field_spec['hamplem'] = $_POST['hamplem'];
$field_spec['hamplep'] = $_POST['hamplep'];
$field_spec['hamplel'] = $_POST['hamplel'];
$field_spec['hamplee'] = $_POST['hamplee'];
$field_spec['diagnos'] = $_POST['diagnos'];

/* Signos y Sintomas */
$field_spec['signos_y_sintomas'] = implode("|", $_POST['signos_y_sintomas']);
$field_spec['otros'] = $_POST['otros'];

/* Estado de Conciencia */
$field_spec['conciencia'] = implode("|", $_POST['conciencia']);

/* Piel */
$field_spec['piel'] = implode("|", $_POST['piel']);

/* Pulmones */
$field_spec['pulmones'] = implode("|", $_POST['pulmones']);

/* Abdomen */
$field_spec['abdomen'] = implode("|", $_POST['abdomen']);

/* Pupilas */
$field_spec['pupilas'] = implode("|", $_POST['pupilas']);

/* Ojo Izquierdo o Derecho*/
$field_spec['pupilasid'] = $_POST['pupilasid'];

/* Ritmo Cardiaco */
$field_spec['ritmo_cardiaco'] = implode("|", $_POST['ritmo_cardiaco']);

/* Oxigeno LPM */
$field_spec['oxigenolpm'] = $_POST['oxigenolpm'];

/* Oxigeno via */
$field_spec['oxigenovia'] = implode("|", $_POST['oxigenovia']);

/* Suero / Angio / Lugar */
$field_spec['suero1'] = $_POST['suero1'];
$field_spec['angio1'] = $_POST['angio1'];
$field_spec['lugar1'] = $_POST['lugar1'];
$field_spec['suero2'] = $_POST['suero2'];
$field_spec['angio2'] = $_POST['angio2'];
$field_spec['lugar2'] = $_POST['lugar2'];

/* Entrega del Paciente */
$field_spec['entrega'] = implode("|", $_POST['entrega']);

/* Servicios Prestados  */
$field_spec['servicios_prestados'] = implode("|", $_POST['servicios_prestados']);

/* Tratamiento en */
$field_spec['tratamiento'] = implode("|", $_POST['tratamiento']);

$field_spec['escala_de_trauma'] = $_POST['escala_de_trauma'];
$field_spec['escala_de_glasqow'] = $_POST['escala_de_glasqow'];
$field_spec['escala_de_apqar'] = $_POST['escala_de_apqar'];
$field_spec['medico'] = $_POST['medico'];
$field_spec['mediconpi'] = $_POST['mediconpi'];
$field_spec['medicoesc'] = $_POST['medicoesc'];
$field_spec['medicoescnpi'] = $_POST['medicoescnpi'];

/* Policia */
$field_spec['policia'] = $_POST['policia'];
$field_spec['policaid'] = $_POST['policaid'];
$field_spec['querella'] = $_POST['querella'];

//end special processing
foreach ($field_names as $k => $var) {
  #if (strtolower($k) == strtolower($var)) {unset($field_names[$k]);}
  $field_names[$k] = formDataCore($var);
echo "$var\n";
}

if ($encounter == "") $encounter = date("Ymd");

// *************************************************************************************
// Time to save the data.
// *************************************************************************************
$table_name = "form_Ambulance";
if ($_GET["mode"] == "new"){ /* SAVE */
	
	reset($field_names);
	$newid = formSubmit($table_name, $field_spec, $_POST["id"], $userauthorized);
	addForm($encounter, "Ambulance", $newid, "Ambulance", $pid, $userauthorized);

} elseif ($_GET["mode"] == "update") { /* UPDATE */

	$success = formUpdate($table_name, $field_spec, $_POST["id"], $userauthorized);

}

$_SESSION["encounter"] = $encounter;
formHeader("Redirecting....");
formJump();
formFooter();
?>
