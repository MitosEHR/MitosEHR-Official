<?php
/* The MitosEHR Registry File, this will containt all the global variables
 * used by MitosEHR, putting here variable is a security risk please consider
 * first putting here variables that are not sesible to the database.
 * 
 * version 0.0.1
 * revision: N/A
 * author: Ernesto J Rodriguez
 *
 */
if(!isset($_SESSION)){
    session_name ( "MitosEHR" );
    session_start();
    session_cache_limiter('private');
}

include_once($_SESSION['site']['root']."/classes/acl.class.php");
$ACL = new ACL();
?>

perm = {
    access_dashboard    : <?php print ($ACL->hasPermission('access_dashboard')  ? 'true':'false') ?>,
    access_calendar     : <?php print ($ACL->hasPermission('access_calendar')   ? 'true':'false') ?>,
    access_messages     : <?php print ($ACL->hasPermission('access_messages')   ? 'true':'false') ?>,
    search_patient      : <?php print ($ACL->hasPermission('search_patient')    ? 'true':'false') ?>,


    add_patient         : <?php print ($ACL->hasPermission('add_patient')       ? 'true':'false') ?>,
    open_patient        : <?php print ($ACL->hasPermission('open_patient')      ? 'true':'false') ?>,
    open_patient        : <?php print ($ACL->hasPermission('open_patient')      ? 'true':'false') ?>,
    access_encounters   : <?php print ($ACL->hasPermission('access_encounters') ? 'true':'false') ?>,




    access_gloabal_settings : <?php print ($ACL->hasPermission('access_gloabal_settings')   ? 'true':'false') ?>,
    access_facilities       : <?php print ($ACL->hasPermission('access_facilities')         ? 'true':'false') ?>,
    access_users            : <?php print ($ACL->hasPermission('access_users')              ? 'true':'false') ?>,
    access_practice         : <?php print ($ACL->hasPermission('access_practice')           ? 'true':'false') ?>,
    access_services         : <?php print ($ACL->hasPermission('access_services')           ? 'true':'false') ?>,
    access_roles            : <?php print ($ACL->hasPermission('access_roles')              ? 'true':'false') ?>,
    access_layouts          : <?php print ($ACL->hasPermission('access_layouts')            ? 'true':'false') ?>,
    access_lists            : <?php print ($ACL->hasPermission('access_lists')              ? 'true':'false') ?>,
    access_event_log        : <?php print ($ACL->hasPermission('access_event_log')          ? 'true':'false') ?>

};

setting = {

};
