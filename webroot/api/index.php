<?php
/**
 * This is a template php file for your countries search.
 * Use as you will, or start over. It's up to you.
 */
//header('Content-Type: application/json');
$obj = json_decode($_POST["q"],false);
$searchString=$obj->searchString;
$result->search = $searchString;
$result->result=array("YO",$searchString,"LO");
echo json_encode($result);
//echo "#YO ".$obj->searchString.$obj->searchString." LO";
?>