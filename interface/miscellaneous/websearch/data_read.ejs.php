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

$url = ('http://wsearch.nlm.nih.gov/ws/query?db=healthTopics&term=diabetes&retmax=10');


$xml = file_get_contents($url);
$parser = new XMLParser($xml);
$parser->Parse();
$rows = array();

$count = 0;
//foreach($parser->document->list[0]->document as $doc){
//        $item['id']          = ($count+1);
//        $item['title']       = $doc->content[0]->tagData;
//        $item['source']      = $doc->content[1]->tagData;
//        $item['FullSummary'] = $doc->content[6]->tagData;
//        $item['snippet']     = $doc->content[13]->tagData;
//        $count++;
//        array_push($rows, $item);
//}
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
print_r(json_encode(array('totals'=>($count) ,'row'=>$rows)));
?>