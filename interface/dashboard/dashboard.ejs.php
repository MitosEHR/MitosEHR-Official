<?php
if(!defined('_MitosEXEC')) die('No direct access allowed.');

/* Dashboard Application
*
* Description: Dashboard, will give a brief reports and widgets on how
* the clinic is performing, with news from MitosEHR.org
*
* version 0.0.1
* revision: N/A
* author: Gino Rivera Falú
*/

// Reset session count
$_SESSION['site']['flops'] = 0;

?>

<div class="dashboard_title"><?php i18n("Dashboard"); ?></div>
