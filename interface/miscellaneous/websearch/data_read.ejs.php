<?php
//--------------------------------------------------------------------------------------------------------------------------
// manage_messages.ejs.php
// v0.0.1
// Under GPLv3 License
//
// Integrated by: Ernesto Rodriguez. in 2011
//
// Remember, this file is called via the Framework Store, this is the AJAX thing.
//--------------------------------------------------------------------------------------------------------------------------
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');
require_once($_SESSION['site']['root']."/library/XMLParser/XMLParser.inc.php");

//$url = ('http://wsearch.nlm.nih.gov/ws/query?db=healthTopics&term=diabetes&retmax=10');


$args = '';
if($_REQUEST['file'] == 1){
    $baseUrl = $_REQUEST['url'];
    $_SESSION['web_search_baseUrl'] = $baseUrl;

    foreach($_REQUEST as $arg => $value){
        if($arg != 'url' && $arg != 'file'){
            $args .= '&'.$arg.'='.$value;
            $_SESSION['web_search_'.$arg.''] = $value;
        }
    }
}else{
    $baseUrl = $_SESSION['web_search_baseUrl'];
    $args .= '&term='.$_SESSION['web_search_term'];
    $args .= '&file='.$_SESSION['web_search_file'];
    foreach($_REQUEST as $arg => $value){
        if($arg != 'url' && $arg != 'file'){
            $args .= '&'.$arg.'='.$value;
        }
    }
}

$url = $baseUrl.$args;

$xml = file_get_contents($url);
$parser = new XMLParser($xml);
$parser->Parse();
$rows = array();

$totals = $parser->document->count[0]->tagData;
$_SESSION['web_search_file'] = $parser->document->file[0]->tagData;

$count = 0;
if(isset($parser->document->list[0]->document)){
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
print_r(json_encode(array('url' => $url, 'totals'=>$totals,'row'=>$rows)));
?>