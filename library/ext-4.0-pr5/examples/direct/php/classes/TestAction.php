<?php
class TestAction {
    function doEcho($data){
        return $data;
    }

    function multiply($num){
        if(!is_numeric($num)){
            throw new Exception('Call to multiply with a value that is not a number');
        }
        return $num*8;
    }

    function getTree($id){
        $out = array();
        if($id == "root"){
        	for($i = 1; $i <= 5; ++$i){
        	    array_push($out, array(
        	    	'id'=>'n' . $i,
        	    	'text'=>'Node ' . $i,
        	    	'leaf'=>false
        	    ));
        	}
        }else if(strlen($id) == 2){
        	$num = substr($id, 1);
        	for($i = 1; $i <= 5; ++$i){
        	    array_push($out, array(
        	    	'id'=>$id . $i,
        	    	'text'=>'Node ' . $num . '.' . $i,
        	    	'leaf'=>true
        	    ));
        	}
        }
        return $out;
    }
    
    function showDetails($data){
        $first = $data->firstName;
        $last = $data->lastName; 
        $age = $data->age;
        return "Hi $first $last, you are $age years old.";
    }
}
