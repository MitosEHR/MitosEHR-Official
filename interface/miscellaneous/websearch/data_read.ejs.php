<?php
//********************************************************************************
// data _read.ejs.php
// v0.0.1
// Under GPLv3 License
//
// Integrated by: Ernesto Rodriguez. in 2011
//
// This file will manage and parse all Web Search Requests
//********************************************************************************
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');
require_once($_SESSION['site']['root']."/library/XMLParser/XMLParser.inc.php");
//--------------------------------------------------------------------------------
// lets declare few vars for later use.
//--------------------------------------------------------------------------------
$args = '';
$count = 0;
$totals = 0;
//********************************************************************************
// lets check if the request is search request or if is a pager request.
// the pager does not pass the url.
//********************************************************************************
if(isset($_REQUEST['url'])){
    //----------------------------------------------------------------------------
    // Search request!
    // lets use and store few arguments for pager requests if need it
    //----------------------------------------------------------------------------
    $baseUrl = $_REQUEST['url'];
    $_SESSION['web_search_baseUrl'] = $baseUrl;

    foreach($_REQUEST as $arg => $value){
        if($arg != 'url' && $arg != 'file'){
            $args .= '&'.$arg.'='.$value;
            $_SESSION['web_search_'.$arg.''] = $value;
        }
    }
}else{
    //----------------------------------------------------------------------------
    // Pager Request!
    // lets use a few session stored values.
    //----------------------------------------------------------------------------
    $baseUrl = $_SESSION['web_search_baseUrl'];
    $args .= '&term='.$_SESSION['web_search_term'];
    $args .= '&file='.$_SESSION['web_search_file'];
    foreach($_REQUEST as $arg => $value){
        if($arg != 'url' && $arg != 'file'){
            $args .= '&'.$arg.'='.$value;
        }
    }
}
//********************************************************************************
// build the URL using the baseUrl and the appended arguments from the if/else
//********************************************************************************
$url = $baseUrl.$args;
//********************************************************************************
// XML parser... PFM!
//********************************************************************************
$xml = file_get_contents($url);
$parser = new XMLParser($xml);
$parser->Parse();
$rows = array();
//--------------------------------------------------------------------------------
// get the total value form the xml
//--------------------------------------------------------------------------------
if(isset($parser->document->list[0]->document)){
    $totals = $parser->document->count[0]->tagData;
    //----------------------------------------------------------------------------
    // store file value for pager, if need it
    //----------------------------------------------------------------------------
    $_SESSION['web_search_file'] = $parser->document->file[0]->tagData;
    //****************************************************************************
    // now lets work the xml file to push stuff into the $rows array()
    //****************************************************************************
   foreach($parser->document->list[0]->document as $document){
        foreach($parser->document->list[0]->document[$count]->content as $content){
            $item['id'] = ($count+1);
            if($content->tagAttrs['name'] == 'title'){
                $item['title'] = $content->tagData;
            }elseif($content->tagAttrs['name'] == 'organizationName'){
                $item['source'] = $content->tagData;
            }elseif($content->tagAttrs['name'] == 'FullSummary'){
                $item['FullSummary'] = $content->tagData;
            }elseif($content->tagAttrs['name'] == 'snippet'){
                $item['snippet'] = $content->tagData;
            }
            array_push($rows, $item);
        }
        $count++;
    }
}
//********************************************************************************
// lets print the json for sencha
//********************************************************************************
print_r(json_encode(array('totals'=>$totals,'row'=>$rows)));
?>