<?php
/**
 * This is a template php file for your countries search.
 * Use as you will, or start over. It's up to you.
 */
//header('Content-Type: application/json');
$obj = json_decode($_POST["q"],false);
echo "#YO ".$obj->searchString.$obj->searchString." LO";
?>